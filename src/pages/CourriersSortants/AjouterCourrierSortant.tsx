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
import { useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import {
  CourrierSortant,
  useAddCourrierSortantMutation,
} from "features/courrierSortant/courrierSortantSlice";
import Select from "react-select";
import {
  useAddVoieEnvoiMutation,
  useFetchAllVoieEnvoiQuery,
  VoieEnvoiModel,
} from "features/voieEnvoi/voieEnvoiSlice";
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

const AjouterCourrierSortant = () => {
  document.title = "Nouveau Courrier Sortant | ENIGA";

  const today = new Date().toISOString().split("T")[0];
  const [dateEdition, setDateEdition] = useState(today);
  const [modal_AddNewVoie, setModalAddNewVoie] = useState<boolean>(false);
  const [createCourrierSortant] = useAddCourrierSortantMutation();
  const { data = [] } = useFetchAllVoieEnvoiQuery();

  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Courrier Sortant a été créée avec succès",
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

  const tog_ModalAddNewVoie = () => {
    setModalAddNewVoie(!modal_AddNewVoie);
  };
  const optionVoieEnvoi = data.map((voie) => ({
    value: voie?._id!,
    label: voie.titre,
  }));

  const [selectedVoieEnvoi, setSelectedVoieEnvoi] = useState<any[]>([]);

  const handleSelectVoieEnvoiChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedVoieEnvoi(values);
  };

  const [selectedIntervenant, setSelectedIntervenant] = useState<string>("");

  const intervenantOptions = AllIntervenants.map((intervenant) => ({
    value: intervenant?._id!,
    label: intervenant.nom_fr,
  }));

  const handleSelectedIntervernant = (selectedOption: any) => {
    const source = selectedOption.value;
    setSelectedIntervenant(source);
  };

  const initialCourrierSortant: CourrierSortant = {
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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCourrierSortant((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("file_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const insurancefile = base64Data + "." + extension;
      setCourrierSortant({
        ...courrierSortant,
        file: insurancefile,
        file_base64_string: base64Data,
        file_extension: extension,
      });
    }
  };

  const onSubmitCourrierSortant = (e: any) => {
    e.preventDefault();

    try {
      const courrierSortantData = {
        ...courrierSortant,
        date_edition: dateEdition,
        voie_envoi: selectedVoieEnvoi,
        destinataire: selectedIntervenant,
      };

      createCourrierSortant(courrierSortantData)
        .then(() => notifySuccess())
        .then(() => setCourrierSortant(initialCourrierSortant));
      tog_AllCourriersSortants();
    } catch (error) {
      notifyError(error);
    }
  };

  const [createNewVoie] = useAddVoieEnvoiMutation();

  const notifySuccessNewVoie = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Voie d'envoi a été créée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyErrorNewVoie = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const initialVoieEnvoi: VoieEnvoiModel = {
    titre: "",
  };

  const [voieEnvoi, setVoieEnvoi] = useState(initialVoieEnvoi);

  const onChangeNewVoie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoieEnvoi((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitVoieEnvoi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createNewVoie(voieEnvoi)
        .then(() => notifySuccessNewVoie())
        .then(() => setVoieEnvoi(initialVoieEnvoi));
      tog_ModalAddNewVoie();
    } catch (error) {
      notifyErrorNewVoie(error);
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Courrier Sortant"
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
                    value={courrierSortant?.num_inscription}
                    onChange={onChange}
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
                  <div className="hstack gap-2">
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionVoieEnvoi}
                      onChange={handleSelectVoieEnvoiChange}
                      placeholder="Sélection des voies"
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      data-bs-toggle="button"
                      onClick={tog_ModalAddNewVoie}
                    >
                      <span>
                        <i className="ri-add-fill align-bottom me-1 fs-17"></i>
                      </span>
                    </button>
                  </div>
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Destinataire</Form.Label>
                </Col>
                <Col>
                  <Select
                    closeMenuOnSelect={false}
                    isSearchable
                    options={intervenantOptions}
                    onChange={handleSelectedIntervernant}
                    placeholder="Choisissez un destinataire..."
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
                    value={courrierSortant.sujet}
                    onChange={onChange}
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
                    value={courrierSortant.observations}
                    onChange={onChange}
                    name="observations"
                    id="observations"
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <Form.Label className="fw-bold">Pièce jointe</Form.Label>
                </Col>
                <Col lg={3}>
                  <input
                    className="form-control mb-2"
                    type="file"
                    id="file_base64_string"
                    onChange={(e) => handleFile(e)}
                  />
                </Col>
              </Row>
              <div className="text-end">
                <Button variant="success" className="mt-3" type="submit">
                  Ajouter
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
        <Modal
          show={modal_AddNewVoie}
          onHide={tog_ModalAddNewVoie}
          dialogClassName="rounded"
          size="sm"
          id="voieModal"
        >
          <Modal.Header>
            <h4>Nouveau Voie</h4>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={onSubmitVoieEnvoi}>
              <Row className="mb-3">
                <Col lg={2} className="d-flex justify-content-end">
                  <Form.Label>Title</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="titre"
                    id="titre"
                    onChange={onChangeNewVoie}
                    value={voieEnvoi.titre}
                    className="w-75"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button type="submit" variant="success" id="addNew">
                    Ajouter
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default AjouterCourrierSortant;
