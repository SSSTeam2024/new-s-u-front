import React, { useState } from "react";
import { Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";

const DetailsTypeStage = () => {
  document.title = "Détails Type Stage | ENIGA";

  const location = useLocation();
  const detailsTypeStage = location.state;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Détails Type Stage"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Card.Header>
              <Row className="p-2">
                <Col>
                  <h3>{detailsTypeStage.nom_fr}</h3>
                </Col>
                <Col className="d-flex justify-content-end">
                  <h3>{detailsTypeStage.nom_ar}</h3>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Card.Header>
                <h4>Caractéristiques</h4>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col lg={1}>
                    <Form.Label>Caractère: </Form.Label>
                  </Col>
                  <Col>{detailsTypeStage.choix}</Col>
                  <Col lg={1}>
                    <Form.Label>Localité: </Form.Label>
                  </Col>
                  <Col>{detailsTypeStage.localite}</Col>
                </Row>
                <Row className="mb-3">
                  <Col lg={1}>
                    <Form.Label>Niveau : </Form.Label>
                  </Col>
                  <Col>{detailsTypeStage.niveau.name_niveau_fr}</Col>
                  <Col lg={1}>
                    <Form.Label>Classe(s):</Form.Label>
                  </Col>
                  <Col>
                    <ul>
                      {detailsTypeStage?.classes?.map((classe: any) => (
                        <li className="list-unstyled">
                          {classe.nom_classe_fr}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <Form.Label>Nombre maximum des candidats: </Form.Label>
                  </Col>
                  <Col lg={2}>{detailsTypeStage.max_etudiant} étudiant(s)</Col>
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Période</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={2}>
                    <Form.Label>Durée minimum : </Form.Label>
                  </Col>
                  <Col lg={2}>{detailsTypeStage.duree_min} jours</Col>
                  <Col className="text-end">
                    <Form.Label>Date Début : </Form.Label>
                  </Col>
                  <Col lg={1}>{detailsTypeStage.date_debut}</Col>
                  <Col lg={2} className="text-end">
                    <Form.Label>Date Fin : </Form.Label>
                  </Col>
                  <Col>{detailsTypeStage.date_fin}</Col>
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Avis de commission de validation</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {detailsTypeStage.avec_commission === "Oui" && (
                    <Col className="text-center">
                      <Form.Label>
                        Le stage nécessite obligatoirement un avis de commission
                        de validation afin de garantir sa conformité aux
                        critères pédagogiques et professionnels.
                      </Form.Label>
                    </Col>
                  )}
                  {detailsTypeStage.avec_commission === "Non" && (
                    <Col className="text-center">
                      <Form.Label>
                        Le stage ne nécessite pas l'
                        <u>avis d'une commission de validation</u>.
                      </Form.Label>
                    </Col>
                  )}
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Encadrement</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {detailsTypeStage.avec_encadrement === "Non" && (
                    <Col className="text-center">
                      <Form.Label>
                        Ce stage ne comporte pas de <u>soutenance finale</u>.
                      </Form.Label>
                    </Col>
                  )}
                  {detailsTypeStage.avec_encadrement === "Oui" && (
                    <>
                      <Col lg={2}>
                        <Form.Label>Encadrant :</Form.Label>
                      </Col>
                      <Col>{detailsTypeStage.encadrement.join(" / ")}</Col>
                    </>
                  )}
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Autorisation de Soutenance</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {detailsTypeStage.avec_validation_soutenance === "Oui" && (
                    <Col className="text-center">
                      <Form.Label>
                        Le stage nécessite <u>une autorisation de soutenance</u>{" "}
                        avant de pouvoir être présenté devant le jury de
                        validation.
                      </Form.Label>
                    </Col>
                  )}
                  {detailsTypeStage.avec_validation_soutenance === "Non" && (
                    <Col className="text-center">
                      <Form.Label>
                        Le stage ne nécessite pas d’
                        <u>autorisation de soutenance</u>, ce qui permet une
                        présentation immédiate des résultats ou du travail
                        effectué.
                      </Form.Label>
                    </Col>
                  )}
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Soutenance</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {detailsTypeStage.avec_soutenance === "Non" && (
                    <Col className="text-center">
                      <Form.Label>
                        Ce stage ne comporte pas de <u>soutenance finale</u>.
                      </Form.Label>
                    </Col>
                  )}
                  {detailsTypeStage.avec_soutenance === "Oui" && (
                    <>
                      <Col lg={2}>
                        <Form.Label>Jury : </Form.Label>
                      </Col>
                      <Col>{detailsTypeStage.soutenance.join(" / ")}</Col>
                    </>
                  )}
                </Row>
              </Card.Body>
              <Card.Header>
                <h4>Fichiers</h4>
              </Card.Header>
              <Card.Body>
                {detailsTypeStage.files.map((file: any) => (
                  <Row className="mb-2">
                    <Col lg={1}>
                      <Form.Label>Titre : </Form.Label>
                    </Col>
                    <Col lg={4}>
                      <span>
                        {file.nomFr} ({file.nomAr})
                      </span>
                    </Col>
                    <Col lg={1} className="text-end">
                      <Form.Label>Type :</Form.Label>
                    </Col>
                    <Col>
                      <span>{file.type}</span>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DetailsTypeStage;
