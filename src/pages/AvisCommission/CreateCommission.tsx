import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useAddVoieEnvoiMutation,
  VoieEnvoiModel,
} from "features/voieEnvoi/voieEnvoiSlice";
import {
  CommissionModel,
  useAddCommissionMutation,
} from "features/commission/commissionSlice";
import BreadCrumb from "Common/BreadCrumb";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useNavigate } from "react-router-dom";

const CreateCommission = () => {
  document.title = "Ajouter Nouvelle Commission | ENIGA";

  const navigate = useNavigate();

  const [createCommission] = useAddCommissionMutation();
  const { data: allClasses = [] } = useFetchClassesQuery();
  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const groupeOptions = allClasses.map((classe) => ({
    value: classe?._id!,
    label: classe.nom_classe_fr,
  }));

  const membresOptions = allEnseignants.map((enseignant) => ({
    value: enseignant?._id!,
    label: `${enseignant.prenom_fr} ${enseignant.nom_fr}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);
  const [selectedColumnGroupes, setSelectedColumnGroupes] = useState<any[]>([]);

  const handleSelectGroupeChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnGroupes(values);
  };

  const handleSelectMembresChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Commission a été créée avec succès",
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

  const initialCommission: CommissionModel = {
    titre_fr: "",
    titre_ar: "",
    date_creation: "",
    date_fin: "",
    groupes: [],
    membres: [],
  };

  const [commission, setCommission] = useState(initialCommission);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommission((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitCommission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    commission["groupes"] = selectedColumnGroupes;
    commission["membres"] = selectedColumnValues;
    commission["date_creation"] = dateDebut;
    commission["date_fin"] = dateFin;
    try {
      createCommission(commission)
        .then(() => notifySuccess())
        .then(() => setCommission(initialCommission));
      navigate("/gestion-des-stages/avis-de-commission-de-validation");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb title="Avis Commission" pageTitle="Gestion des stages" />
          <Row>
            <Col lg={12}>
              <Form onSubmit={onSubmitCommission}>
                <Card>
                  <Card.Body>
                    <Row className="mb-3 d-flex align-items-center">
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Titre</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="titre_fr"
                          id="titre_fr"
                          onChange={onChange}
                          value={commission.titre_fr}
                        />
                      </Col>
                      <Col lg={1}></Col>
                      <Col className="d-flex justify-content-end">
                        <Form.Control
                          type="text"
                          name="titre_ar"
                          id="titre_ar"
                          onChange={onChange}
                          value={commission.titre_ar}
                        />
                      </Col>
                      <Col lg={1}>
                        <Form.Label>عنوان</Form.Label>
                      </Col>
                      <Col lg={1}></Col>
                    </Row>
                    <Row className="mb-3 d-flex align-items-center">
                      <Col lg={2} className="text-end">
                        <Form.Label>Date de début</Form.Label>
                      </Col>
                      <Col lg={4}>
                        <Form.Control
                          type="date"
                          value={dateDebut}
                          onChange={(e) => setDateDebut(e.target.value)}
                          className="text-center"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3 d-flex align-items-center">
                      <Col lg={2} className="text-end">
                        <Form.Label>Date de fin</Form.Label>
                      </Col>
                      <Col lg={4}>
                        <Form.Control
                          type="date"
                          value={dateFin}
                          onChange={(e) => setDateFin(e.target.value)}
                          className="text-center"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3 d-flex align-items-center">
                      <Col lg={2} className="text-end">
                        <Form.Label>Groupes</Form.Label>
                      </Col>
                      <Col lg={4}>
                        <Select
                          closeMenuOnSelect={false}
                          isSearchable
                          isMulti
                          options={groupeOptions}
                          onChange={handleSelectGroupeChange}
                          placeholder="Choisissez un source..."
                        />
                      </Col>
                    </Row>
                    <Row className="d-flex align-items-center">
                      <Col lg={2} className="text-end">
                        <Form.Label>Membres</Form.Label>
                      </Col>
                      <Col lg={4}>
                        <Select
                          closeMenuOnSelect={false}
                          isSearchable
                          isMulti
                          options={membresOptions}
                          onChange={handleSelectMembresChange}
                          placeholder="Choisissez un source..."
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <Row>
                      <Col className="d-flex justify-content-end">
                        <Button type="submit" variant="success" id="addNew">
                          Ajouter
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateCommission;
