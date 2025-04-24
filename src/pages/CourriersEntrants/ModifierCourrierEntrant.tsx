import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import {
  CourrierEntrant,
  useFetchAllCourrierEntrantQuery,
  useUpdateCourrierEntrantMutation,
} from "features/courrierEntrant/courrierEntrant";
import { useFetchAllIntervenantsQuery } from "features/intervenants/intervenantsSlice";
import Select from "react-select";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const ModifierCourrierEntrant = () => {
  document.title = "Modifier Courrier Entrant | ENIGA";

  const location = useLocation();
  const courrierDetails = location.state;
  const { data: existingCourriers = [] } = useFetchAllCourrierEntrantQuery();

  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();

  const [dateArrive, setDateArrive] = useState(courrierDetails.date_arrive);
  const [dateCourrier, setDateCourrier] = useState(
    courrierDetails.date_courrier
  );
  const [dateLivraison, setDateLivraison] = useState(
    courrierDetails.date_livraison
  );

  const [updateCourrierEntrant] = useUpdateCourrierEntrantMutation();
  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);

  const basePath = `${process.env.REACT_APP_API_URL}/files/courrierEntrantFiles/`;

  const [showFileModal, setShowFileModal] = useState<boolean>(false);

  const [file_courrier, setFileCourrier] = useState<string>(
    `${basePath}${courrierDetails?.file!}`
  );

  const [courrier_num, setNumCourrier] = useState<string>(
    courrierDetails.num_courrier
  );

  const [ordre_num, setNumOrdre] = useState<string>(courrierDetails.num_ordre);

  const [courrier_destinataire, setDestiantaire] = useState<string>(
    courrierDetails.destinataire.nom_fr
  );
  const [courrier_source, setSource] = useState<string>(
    courrierDetails.source.nom_fr
  );
  const [courrier_sujet, setCourrierSujet] = useState<string>(
    courrierDetails.sujet
  );

  const handleNumCourrier = (e: any) => {
    setNumCourrier(e.target.value);
  };
  const handleSujet = (e: any) => {
    setCourrierSujet(e.target.value);
  };

  const defaultDestinataireOptions = {
    label: courrierDetails.destinataire.nom_fr,
    value: courrierDetails?.destinataire._id!,
  };

  const defaultSourceOptions = {
    label: courrierDetails.source.nom_fr,
    value: courrierDetails?.source._id!,
  };

  const [selectedSource, setSelectedSource] = useState<string>(
    courrierDetails.source._id
  );

  const [selectedDestinataire, setSelectedDestinataire] = useState<string>(
    courrierDetails.destinataire._id
  );

  const filteredSourceOptions = AllIntervenants.filter(
    (intervenant) => intervenant._id !== selectedDestinataire
  );
  const filteredDestinataireOptions = AllIntervenants.filter(
    (intervenant) => intervenant._id !== selectedSource
  );

  const optionSourceTable = filteredSourceOptions.map((intervenant: any) => ({
    value: intervenant?._id!,
    label: intervenant.nom_fr,
  }));

  const optionDestinataireTable = filteredDestinataireOptions.map(
    (intervenant: any) => ({
      value: intervenant?._id!,
      label: intervenant.nom_fr,
    })
  );

  const handleSelectedSource = (selectedOption: any) => {
    const value = selectedOption.value;
    const selectedIntervenant = AllIntervenants.find(
      (intervenant) => intervenant._id === value
    );
    if (selectedIntervenant) {
      setSource(selectedIntervenant.nom_fr);
    }
    setSelectedSource(value);
  };

  const handleSelectedDestinataire = (selectedOption: any) => {
    const value = selectedOption.value;
    const selectedIntervenant = AllIntervenants.find(
      (intervenant) => intervenant._id === value
    );
    if (selectedIntervenant) {
      setDestiantaire(selectedIntervenant.nom_fr);
    }
    setSelectedDestinataire(value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Courrier Entrant a été modifiée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const navigate = useNavigate();

  function tog_AllCourriersEntrants() {
    navigate("/bureau-ordre/courriers-entrants/lister-courriers-entrants");
  }

  const [fileUrl, setFileUrl] = useState<string>("");

  const handleShowFileModal = (file: any) => {
    setFileUrl(file);
    setShowFileModal(true);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "num_ordre") {
      if (existingCourriers?.some((c) => c.num_ordre === value)) {
        alert("Le numéro d'ordre existe déjà !");
        setNumOrdre(courrierDetails.num_ordre);
        return;
      }
    }

    setNumOrdre(value);
  };

  const initialCourrierEntrant: CourrierEntrant = {
    _id: "",
    num_ordre: "",
    date_arrive: "",
    num_courrier: "",
    date_courrier: "",
    source: "",
    destinataire: "",
    sujet: "",
    date_livraison: "",
    file_base64_string: "",
    file_extension: "",
    file: "",
  };

  const [courrierEntrant, setCourrierEntrant] = useState(
    initialCourrierEntrant
  );

  const {
    // _id,
    // num_ordre,
    // date_arrive,
    // num_courrier,
    // date_courrier,
    // source,
    // destinataire,
    // sujet,
    // date_livraison,
    file_base64_string,
    file_extension,
    // file,
  } = courrierEntrant;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("file_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const courrierfile = base64Data + "." + extension;
      setCourrierEntrant({
        ...courrierEntrant,
        file: courrierfile,
        file_base64_string: base64Data,
        file_extension: extension,
      });
    }
  };

  const handleCloseFileModal = () => setShowFileModal(false);

  const onSubmitCourrierEntrant = (e: any) => {
    e.preventDefault();

    try {
      const courrierEntrantData: any = {
        ...courrierEntrant,
        _id: courrierDetails?._id!,
        num_ordre: ordre_num,
        date_arrive: dateArrive,
        num_courrier: courrier_num,
        date_courrier: dateCourrier,
        source:
          selectedSource === "" ? courrierDetails.source?._id! : selectedSource,
        destinataire:
          selectedDestinataire === ""
            ? courrierDetails.destinataire?._id!
            : selectedDestinataire,
        sujet: courrier_sujet,
        date_livraison: dateLivraison,
      };

      if (file_base64_string && file_extension) {
        courrierEntrantData.file_base64_string = file_base64_string;
        courrierEntrantData.file_extension = file_extension;
      } else {
        courrierEntrantData.file = courrierDetails?.file;
      }

      updateCourrierEntrant(courrierEntrantData)
        .then(() => notifySuccess())
        .then(() => setCourrierEntrant(initialCourrierEntrant));
      tog_AllCourriersEntrants();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Courrier Entrant"
            pageTitle="Bureau Ordre"
          />
          <Card className="shadow p-4">
            <Form onSubmit={onSubmitCourrierEntrant}>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">N° d’ordre</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={ordre_num}
                    onChange={onChange}
                    name="num_ordre"
                    id="num_ordre"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Date d'arrivée</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="date"
                    value={dateArrive}
                    onChange={(e) => setDateArrive(e.target.value)}
                    className="text-center"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">N° du courrier</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={courrier_num}
                    onChange={handleNumCourrier}
                    name="num_courrier"
                    id="num_courrier"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">Date de courrier</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="date"
                    value={dateCourrier}
                    onChange={(e) => setDateCourrier(e.target.value)}
                    className="text-center"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Source</Form.Label>
                </Col>
                <Col>
                  <Select
                    closeMenuOnSelect={false}
                    isSearchable
                    options={optionSourceTable}
                    onChange={handleSelectedSource}
                    defaultValue={defaultSourceOptions}
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Destinataire</Form.Label>
                </Col>
                <Col>
                  <Select
                    closeMenuOnSelect={false}
                    isSearchable
                    options={optionDestinataireTable}
                    onChange={handleSelectedDestinataire}
                    defaultValue={defaultDestinataireOptions}
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Form.Label className="fw-bold">Sujet</Form.Label>
              </Row>
              <Row className="mb-3">
                <textarea
                  className="form-control"
                  rows={3}
                  value={courrier_sujet}
                  onChange={handleSujet}
                  name="sujet"
                  id="sujet"
                />
              </Row>
              <Row className="mb-4">
                <Col lg={2}>
                  <Form.Label className="fw-bold">Date de livraison</Form.Label>
                </Col>
                <Col lg={2}>
                  <Form.Control
                    type="date"
                    value={dateLivraison}
                    onChange={(e) => setDateLivraison(e.target.value)}
                    className="text-center"
                  />
                </Col>
                <Col>
                  <Row>
                    <Col lg={3}>
                      <Form.Label className="fw-bold">Pièce jointe</Form.Label>
                    </Col>
                    <Col>
                      <Row>
                        <Col lg={12}>
                          <Row>
                            <Card className="p-2">
                              <Card.Body style={{ position: "relative" }}>
                                {isImageFile(file_courrier) ? (
                                  <>
                                    <img
                                      src={file_courrier}
                                      alt="Courrier Sortant"
                                      style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover",
                                      }}
                                      onClick={() =>
                                        handleShowFileModal(file_courrier)
                                      }
                                    />
                                    <Button
                                      variant="primary"
                                      onClick={() =>
                                        handleShowFileModal(file_courrier)
                                      }
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "16px",
                                        zIndex: 10,
                                      }}
                                    >
                                      Afficher l'Image
                                    </Button>
                                  </>
                                ) : isPDFFile(file_courrier) ? (
                                  <>
                                    <iframe
                                      src={file_courrier}
                                      style={{
                                        border: "none",
                                        width: "100%",
                                        height: "200px",
                                      }}
                                      title="PDF"
                                    />
                                    <Button
                                      variant="primary"
                                      onClick={() =>
                                        handleShowFileModal(file_courrier)
                                      }
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "16px",
                                        zIndex: 10,
                                      }}
                                    >
                                      Afficher le PDF
                                    </Button>
                                  </>
                                ) : null}
                              </Card.Body>
                            </Card>
                          </Row>
                        </Col>
                        <Modal
                          show={showFileModal}
                          onHide={handleCloseFileModal}
                          size="lg"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Visionneuse de documents</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            {isImageFile(fileUrl) ? (
                              <img
                                src={fileUrl}
                                alt="View Courrier Entrant"
                                style={{ width: "100%", height: "auto" }}
                              />
                            ) : isPDFFile(fileUrl) ? (
                              <iframe
                                src={fileUrl}
                                width="100%"
                                height="700px"
                                title="Courrier Entrant"
                              />
                            ) : (
                              <p>Aucun document à afficher.</p>
                            )}
                          </Modal.Body>
                        </Modal>
                      </Row>
                      <Row>
                        <input
                          className="form-control mb-2"
                          type="file"
                          id="file_base64_string"
                          onChange={(e) => handleFile(e)}
                        />
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div className="text-end">
                <Button variant="success" className="mt-3" type="submit">
                  Modifier
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ModifierCourrierEntrant;
