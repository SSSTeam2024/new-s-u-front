import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  IntervenantsModel,
  useUpdateIntervenantMutation,
} from "features/intervenants/intervenantsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";

const ModifierIntervenant = () => {
  document.title = "Modifier Intervenant | ENIGA";

  const [updateIntervenant] = useUpdateIntervenantMutation();

  const navigate = useNavigate();

  function tog_ListeIntervenants() {
    navigate("/bureau-ordre/intervenants/lister-intervenants");
  }

  const location = useLocation();
  const intervenantDetails = location.state;

  const [nomFR, setNomFR] = useState<string>(intervenantDetails?.nom_fr!);

  const [nomAR, setNomAR] = useState<string>(intervenantDetails?.nom_ar!);

  const [intervenantCin, setIntervenantCin] = useState<string>(
    intervenantDetails?.cin!
  );

  const [intervenantMat, setintervenantMat] = useState<string>(
    intervenantDetails?.matricule!
  );

  const [intervenantPhone, setintervenantPhone] = useState<string>(
    intervenantDetails?.phone!
  );

  const [intervenantEmail, setintervenantEmail] = useState<string>(
    intervenantDetails?.email!
  );

  const [intervenantSite, setintervenantSite] = useState<string>(
    intervenantDetails?.site!
  );

  const [intervenantAdr, setintervenantAdr] = useState<string>(
    intervenantDetails?.address!
  );

  const [intervenantAbr, setintervenantAbr] = useState<string>(
    intervenantDetails?.abbreviation!
  );

  const handleNomFr = (e: any) => {
    setNomFR(e.target.value);
  };

  const handleNomAr = (e: any) => {
    setNomAR(e.target.value);
  };

  const handleCin = (e: any) => {
    setIntervenantCin(e.target.value);
  };

  const handleMat = (e: any) => {
    setintervenantMat(e.target.value);
  };

  const handlePhone = (e: any) => {
    setintervenantPhone(e.target.value);
  };

  const handleEmail = (e: any) => {
    setintervenantEmail(e.target.value);
  };

  const handleSite = (e: any) => {
    setintervenantSite(e.target.value);
  };

  const handleAdresse = (e: any) => {
    setintervenantAdr(e.target.value);
  };

  const handleAbr = (e: any) => {
    setintervenantAbr(e.target.value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Intervenant a été modifié avec succès",
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
    _id: "",
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

  const onSubmitIntervenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const intervenantData: any = {
        ...intervenant,
        _id: intervenantDetails?._id!,
        nom_fr: nomFR,
        nom_ar: nomAR,
        cin: intervenantCin,
        matricule: intervenantMat,
        phone: intervenantPhone,
        email: intervenantEmail,
        site: intervenantSite,
        address: intervenantAdr,
        abbreviation: intervenantAbr,
      };

      updateIntervenant(intervenantData)
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
          <Breadcrumb title="Modifier Intervenant" pageTitle="Bureau d'Ordre" />
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
                      onChange={handleNomFr}
                      value={nomFR}
                      className="w-75"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="nom_ar"
                      id="nom_ar"
                      onChange={handleNomAr}
                      value={nomAR}
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
                      onChange={handleCin}
                      value={intervenantCin}
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
                      onChange={handleMat}
                      value={intervenantMat}
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
                      onChange={handlePhone}
                      value={intervenantPhone}
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
                      onChange={handleEmail}
                      value={intervenantEmail}
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
                      value={intervenantAdr}
                      onChange={handleAdresse}
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
                          onChange={handleSite}
                          value={intervenantSite}
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
                          onChange={handleAbr}
                          value={intervenantAbr}
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
                  Modifier
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ModifierIntervenant;
