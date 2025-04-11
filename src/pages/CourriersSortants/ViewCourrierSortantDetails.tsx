import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

const ViewCourrierSortantDetails = () => {
  document.title = "Details Courrier Sortant | ENIGA";

  const navigate = useNavigate();

  const { data: Variables = [] } = useFetchVaribaleGlobaleQuery();

  const lastVariable =
    Variables.length > 0 ? Variables[Variables.length - 1] : null;

  const location = useLocation();
  const courrierDetails = location.state;

  const handleOpenFile = () => {
    const fileUrl = `${
      process.env.REACT_APP_API_URL
    }/files/courrierSortantFiles/${courrierDetails?.file!}`;
    window.open(fileUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Détails Courier Sortant"
            pageTitle="Bureau Ordre"
          />
          <button
            type="button"
            className="btn rounded-pill btn-soft-secondary btn-sm mb-2"
            onClick={() => navigate(-1)}
          >
            <i className="ri-arrow-go-back-line me-2 align-middle"></i>Retour
          </button>
          <Card className="shadow p-4">
            <Card.Header>
              <Row>
                <Col>
                  <h3>Ordre Sortant</h3>
                </Col>
                <Col className="d-flex justify-content-end fs-13 fw-bold">
                  <span>{courrierDetails.createdAt.split("T")[0]}</span>
                  <span>&nbsp;</span>
                  <span>
                    {courrierDetails.createdAt.split(":")[0].slice(11, 13)}:
                    {courrierDetails.createdAt.split(":")[1]}
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Row>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
                      alt="logo_etablissement-img"
                      className="avatar-xl"
                    />
                  </Row>
                  <Row>
                    <h5>{lastVariable?.etablissement_fr}</h5>
                  </Row>
                  <Row>
                    <Col lg={2}>
                      <span className="fs-16 fw-medium">Adresse: </span>
                    </Col>
                    <Col>
                      <span className="fs-17 fw-medium">
                        {lastVariable?.address_fr}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={2}>
                      <span className="fs-16 fw-medium">Site Web: </span>
                    </Col>
                    <Col>
                      <span className="fs-17 fw-medium">
                        {lastVariable?.website}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={2}>
                      <span className="fs-16 fw-medium">Téléphone: </span>
                    </Col>
                    <Col>
                      <span className="fs-16 fw-medium">
                        {lastVariable?.phone}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col lg={3}>
                      <span className="fs-16 fw-medium">
                        Numéro d’inscription#
                      </span>
                    </Col>
                    <Col>
                      <span className="fs-18 fw-bold">
                        {courrierDetails.num_inscription}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3}>
                      <span className="fs-16 fw-medium">Date d’édition </span>
                    </Col>
                    <Col>
                      <span className="fs-18 fw-bold">
                        {courrierDetails.date_edition}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <Row>
                    <Col lg={3} className="fs-16 fw-medium">
                      Voie d’envoi
                    </Col>
                    <Col>
                      {courrierDetails.voie_envoi.map((voie: any) => (
                        <ul className="list-unstyled">
                          <li className="fs-17 fw-medium">{voie.titre}</li>
                        </ul>
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} className="fs-16 fw-medium">
                      Sujet
                    </Col>
                    <Col className="fs-17 fw-medium">
                      {courrierDetails.sujet}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} className="fs-16 fw-medium">
                      Observations
                    </Col>
                    <Col className="fs-17 fw-medium">
                      {courrierDetails.observations}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col lg={3} className="fs-18 fw-medium">
                      Destinataire
                    </Col>
                    <Col className="fs-20 fw-bold">
                      {courrierDetails.destinataire.nom_fr}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col>
                  <button
                    type="button"
                    className="btn btn-primary btn-label"
                    onClick={handleOpenFile}
                  >
                    <i className="ri-file-text-line label-icon align-middle fs-16 me-2"></i>{" "}
                    Fichier
                  </button>
                </Col>
                <Col className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-darken-light btn-label text-dark"
                    onClick={handlePrint}
                  >
                    <i className="ri-printer-line label-icon align-middle fs-16 me-2"></i>{" "}
                    Imprimer
                  </button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewCourrierSortantDetails;
