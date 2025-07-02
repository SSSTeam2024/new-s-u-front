import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import BreadCrumb from "Common/BreadCrumb";
import {
  SocieteModel,
  useAddSocieteMutation,
} from "features/societe/societeSlice";
import { useNavigate } from "react-router-dom";

const AddNew = () => {
  document.title = "Nouveau Partenaire | ENIGA";

  const navigate = useNavigate();

  const [encadrants, setEncadrants] = useState([{ id: Date.now(), name: "" }]);

  const [createSociete] = useAddSocieteMutation();

  const handleAddEncadrant = () => {
    setEncadrants([...encadrants, { id: Date.now(), name: "" }]);
  };

  const handleDeleteEncadrant = (id: number) => {
    setEncadrants(encadrants.filter((enc) => enc.id !== id));
  };

  const handleEncadrantChange = (id: number, value: string) => {
    setEncadrants((prev) =>
      prev.map((enc) => (enc.id === id ? { ...enc, name: value } : enc))
    );
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Partenaire a été créée avec succès",
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

  const initialSociete: SocieteModel = {
    nom: "",
    encadrant: [""],
    matricule: "",
    adresse: "",
    responsable: "",
    siteweb: "",
    phone: "",
  };

  const [nouveauSociete, setNouveauSociete] = useState(initialSociete);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNouveauSociete((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitNouveauSociete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const societeData: SocieteModel = {
      ...nouveauSociete,
      encadrant: encadrants.map((enc) => enc.name),
    };

    try {
      createSociete(societeData)
        .then(() => notifySuccess())
        .then(() => setNouveauSociete(initialSociete));
      navigate("/gestion-des-stages/liste-partenaires");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Nouveau Partenaire"
            pageTitle="Gestion des stages"
          />
          <Form onSubmit={onSubmitNouveauSociete}>
            <Card>
              <Card.Body>
                <Row className="mb-4 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <Form.Label>Nom</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="nom"
                      id="nom"
                      onChange={onChange}
                      value={nouveauSociete.nom}
                    />
                  </Col>
                  <Col className="text-end">
                    <Form.Label>Matricule</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="matricule"
                      id="matricule"
                      onChange={onChange}
                      value={nouveauSociete.matricule}
                    />
                  </Col>
                  <Col className="text-end">
                    <Form.Label>Responsable</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="responsable"
                      id="responsable"
                      onChange={onChange}
                      value={nouveauSociete.responsable}
                    />
                  </Col>
                </Row>
                <Row className="mb-4 d-flex align-items-center">
                  <Col lg={2} className="text-end">
                    <Form.Label>N° Tél</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="phone"
                      id="phone"
                      onChange={onChange}
                      value={nouveauSociete.phone}
                    />
                  </Col>
                  <Col className="text-end">
                    <Form.Label>Siteweb</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="siteweb"
                      id="siteweb"
                      onChange={onChange}
                      value={nouveauSociete.siteweb}
                    />
                  </Col>
                  <Col className="text-end">
                    <Form.Label>Adresse</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="adresse"
                      id="adresse"
                      onChange={onChange}
                      value={nouveauSociete.adresse}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-end" lg={2}>
                    <Form.Label>Encadrant(s)</Form.Label>
                  </Col>
                  <Col>
                    {encadrants.map((enc, index) => (
                      <Row className="mb-3" key={enc.id}>
                        <Col>
                          <Form.Control
                            type="text"
                            name={`encadrant_${enc.id}`}
                            className="w-75 grey-placeholder"
                            placeholder="Nom & Prénom Encadrant"
                            value={enc.name}
                            onChange={(e) =>
                              handleEncadrantChange(enc.id, e.target.value)
                            }
                          />
                        </Col>
                        <Col>
                          {/* Trash Button: visible if more than one row */}
                          {encadrants.length > 1 && (
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteEncadrant(enc.id)}
                              className="me-2"
                            >
                              <i className="ph ph-trash"></i>
                            </Button>
                          )}
                          {/* Add Button: visible only in the last row */}
                          {index === encadrants.length - 1 && (
                            <Button
                              type="button"
                              variant="success"
                              onClick={handleAddEncadrant}
                            >
                              <i className="ph ph-plus"></i>
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNew;
