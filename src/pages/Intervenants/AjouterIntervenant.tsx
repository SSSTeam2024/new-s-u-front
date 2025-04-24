import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  IntervenantsModel,
  useAddIntervenantMutation,
} from "features/intervenants/intervenantsSlice";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";

const AjouterIntervenant = () => {
  document.title = "Nouveau Intervenant | ENIGA";

  const [createNewIntervenant] = useAddIntervenantMutation();

  const navigate = useNavigate();

  function tog_ListeIntervenants() {
    navigate("/bureau-ordre/intervenants/lister-intervenants");
  }

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Intervenant a été créée avec succès",
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

  const initialIntervenant: IntervenantsModel = {
    nom_fr: "",
    nom_ar: "",
    cin: "",
    matricule: "",
    phone: "",
    email: "",
    site: "",
    address: "",
    abbreviation: "",
  };

  const [intervenant, setIntervenant] = useState(initialIntervenant);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setIntervenant((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitIntervenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createNewIntervenant(intervenant)
        .then(() => notifySuccess())
        .then(() => setIntervenant(initialIntervenant));
      tog_ListeIntervenants();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Nouveau Intervenant" pageTitle="Bureau d'Ordre" />
          <Form onSubmit={onSubmitIntervenant}>
            <Card>
              <Card.Body>
                <Row className="mb-3">
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>Nom</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="nom_fr"
                      id="nom_fr"
                      onChange={onChange}
                      value={intervenant.nom_fr}
                      className="w-75"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="nom_ar"
                      id="nom_ar"
                      onChange={onChange}
                      value={intervenant.nom_ar}
                      className="w-75"
                    />
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>الإ سم</Form.Label>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>C.I.N</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="cin"
                      id="cin"
                      onChange={onChange}
                      value={intervenant.cin}
                      className="w-75"
                    />
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>Matricule</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="matricule"
                      id="matricule"
                      onChange={onChange}
                      value={intervenant.matricule}
                      className="w-75"
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>N° Téléphone</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="phone"
                      id="phone"
                      onChange={onChange}
                      value={intervenant.phone}
                      className="w-75"
                    />
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>Email</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="email"
                      id="email"
                      onChange={onChange}
                      value={intervenant.email}
                      className="w-75"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Form.Label>Adresse</Form.Label>
                  </Col>
                  <Col>
                    <textarea
                      className="form-control w-75"
                      rows={3}
                      value={intervenant.address}
                      onChange={onChange}
                      name="address"
                      id="address"
                    />
                  </Col>
                  <Col>
                    <Row className="mb-2">
                      <Col lg={3} className="d-flex justify-content-end">
                        <Form.Label>Site Web</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="site"
                          id="site"
                          onChange={onChange}
                          value={intervenant.site}
                          className="w-75"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={3} className="d-flex justify-content-end">
                        <Form.Label>Abbréviation</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="abbreviation"
                          id="abbreviation"
                          onChange={onChange}
                          value={intervenant.abbreviation}
                          className="w-75"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button
                  type="submit"
                  variant="success"
                  id="addNew"
                  className="float-end"
                >
                  Ajouter
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterIntervenant;
