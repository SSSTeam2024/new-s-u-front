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
  CourrierSortant,
  useUpdateCourrierSortantMutation,
} from "features/courrierSortant/courrierSortantSlice";
import Select from "react-select";
import { useFetchAllVoieEnvoiQuery } from "features/voieEnvoi/voieEnvoiSlice";
import { useFetchAllIntervenantsQuery } from "features/intervenants/intervenantsSlice";

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

const ModifierCourrierSortant = () => {
  document.title = "Modifier Courrier Sortant | ENIGA";

  const location = useLocation();
  const courrierDetails = location.state;

  const today = new Date().toISOString().split("T")[0];
  const [dateEdition, setDateEdition] = useState(courrierDetails.date_edition);
  const [updateCourrierSortant] = useUpdateCourrierSortantMutation();
  const { data = [] } = useFetchAllVoieEnvoiQuery();
  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);

  const basePath = `${process.env.REACT_APP_API_URL}/files/courrierSortantFiles/`;

  const [showFileModal, setShowFileModal] = useState<boolean>(false);

  const [file_courrier, setFileCourrier] = useState<string>(
    `${basePath}${courrierDetails?.file!}`
  );

  const [courrier_num_inscri, setNumInscri] = useState<string>(
    courrierDetails.num_inscription
  );
  const [courrier_destinataire, setDestiantaire] = useState<string>(
    courrierDetails.destinataire?.nom_fr!
  );
  const [courrier_sujet, setCourrierSujet] = useState<string>(
    courrierDetails.sujet
  );
  const [courrier_observation, setCourrierObservation] = useState<string>(
    courrierDetails.observations
  );

  const [selectedIntervenant, setSelectedIntervenant] = useState<string>("");

  const handleNumInscri = (e: any) => {
    setNumInscri(e.target.value);
  };
  const handleSujet = (e: any) => {
    setCourrierSujet(e.target.value);
  };
  const handleObservation = (e: any) => {
    setCourrierObservation(e.target.value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Courrier Sortant a été modifiée avec succès",
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

  function tog_AllCourriersSortants() {
    navigate("/bureau-ordre/courriers-sortants/lister-courriers-sortants");
  }

  const [fileUrl, setFileUrl] = useState<string>("");
  const handleShowFileModal = (file: any) => {
    setFileUrl(file);
    setShowFileModal(true);
  };

  const existingVoie = courrierDetails.voie_envoi || [];

  const defaultVoieOptions =
    courrierDetails.voie_envoi?.map((item: any) => ({
      label: item.titre,
      value: item?._id!,
    })) || [];

  const defaultDestinataireOptions = {
    label: courrierDetails.destinataire.nom_fr,
    value: courrierDetails?.destinataire._id!,
  };

  const optionColumnsTable = data.map((classe: any) => ({
    value: classe?._id!,
    label: classe.titre,
  }));

  const optionDestinataireTable = AllIntervenants.map((intervenant: any) => ({
    value: intervenant?._id!,
    label: intervenant.nom_fr,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingVoie.map((voie: any) => voie?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const handleSelectedIntervenant = (selectedOption: any) => {
    const value = selectedOption.value;
    setSelectedIntervenant(value);
  };

  const initialCourrierSortant: CourrierSortant = {
    _id: "",
    num_inscription: "",
    date_edition: "",
    destinataire: "",
    voie_envoi: [""],
    sujet: "",
    observations: "",
    file_base64_string: "",
    file_extension: "",
    file: "",
  };

  const [courrierSortant, setCourrierSortant] = useState(
    initialCourrierSortant
  );

  const {
    // _id,
    // num_inscription,
    // date_edition,
    // destinataire,
    // voie_envoi,
    // sujet,
    // observations,
    file_base64_string,
    file_extension,
    // file,
  } = courrierSortant;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("file_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const courrierfile = base64Data + "." + extension;
      setCourrierSortant({
        ...courrierSortant,
        file: courrierfile,
        file_base64_string: base64Data,
        file_extension: extension,
      });
    }
  };

  const handleCloseFileModal = () => setShowFileModal(false);

  const onSubmitCourrierSortant = (e: any) => {
    e.preventDefault();

    try {
      const courrierSortantData: any = {
        ...courrierSortant,
        _id: courrierDetails?._id!,
        num_inscription: courrier_num_inscri,
        date_edition: dateEdition,
        destinataire:
          selectedIntervenant === ""
            ? courrierDetails.destinataire?._id!
            : selectedIntervenant,
        sujet: courrier_sujet,
        observations: courrier_observation,
        voie_envoi: selectedColumnValues,
      };

      if (file_base64_string && file_extension) {
        courrierSortantData.file_base64_string = file_base64_string;
        courrierSortantData.file_extension = file_extension;
      } else {
        courrierSortantData.file = courrierDetails?.file;
      }

      updateCourrierSortant(courrierSortantData)
        .then(() => notifySuccess())
        .then(() => setCourrierSortant(initialCourrierSortant));
      tog_AllCourriersSortants();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Courrier Sortant"
            pageTitle="Bureau Ordre"
          />
          <Card className="shadow p-4">
            <Form onSubmit={onSubmitCourrierSortant}>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">N° inscription</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={courrier_num_inscri}
                    onChange={handleNumInscri}
                    name="num_inscription"
                    id="num_inscription"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Date d'édition</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="date"
                    value={dateEdition}
                    onChange={(e) => setDateEdition(e.target.value)}
                    className="text-center"
                    max={today}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">Voie d'envoi</Form.Label>
                </Col>
                <Col>
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={optionColumnsTable}
                    onChange={handleSelectValueColumnChange}
                    defaultValue={defaultVoieOptions}
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
                    onChange={handleSelectedIntervenant}
                    defaultValue={defaultDestinataireOptions}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">Sujet</Form.Label>
                </Col>
                <Col>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={courrier_sujet}
                    onChange={handleSujet}
                    name="sujet"
                    id="sujet"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Observation</Form.Label>
                </Col>
                <Col>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={courrier_observation}
                    onChange={handleObservation}
                    name="observations"
                    id="observations"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <Form.Label className="fw-bold">Pièce jointe</Form.Label>
                </Col>

                <Col lg={4}>
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
                            alt="Courrier Sortant"
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : isPDFFile(fileUrl) ? (
                          <iframe
                            src={fileUrl}
                            title="Courrier Sortant"
                            width="100%"
                            height="700px"
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

export default ModifierCourrierSortant;
