import React, { useEffect, useState } from "react";
import { Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const DetailsResultat = () => {
  document.title = "Détails Résultat | ENIGA";
  const location = useLocation();
  const resultDetails = location.state;

  const [niveau, setNiveau] = useState<string>("");
  const [spectialite, setSpectialite] = useState<string>("");
  const [diplome, setDiplome] = useState<string>("");

  const etudiantsAdmis = resultDetails.etudiants.filter(
    (item: any) => item.avis === "Admis"
  );
  const etudiantsRefuse = resultDetails.etudiants.filter(
    (item: any) => item.avis === "Refuse"
  );

  useEffect(() => {
    const niveaux = resultDetails.etudiants.reduce(
      (unique: string[], item: any) => {
        const niveau = item.etudiant.Groupe;
        if (niveau && !unique.includes(niveau)) {
          unique.push(niveau);
        }
        return unique;
      },
      []
    );
    const specialites = resultDetails.etudiants.reduce(
      (unique: string[], item: any) => {
        const specialite = item.etudiant.Spécialité;
        if (specialite && !unique.includes(specialite)) {
          unique.push(specialite);
        }
        return unique;
      },
      []
    );
    const diplomes = resultDetails.etudiants.reduce(
      (unique: string[], item: any) => {
        const diplome = item.etudiant.DIPLOME;
        if (diplome && !unique.includes(diplome)) {
          unique.push(diplome);
        }
        return unique;
      },
      []
    );
    setNiveau(niveaux);
    setSpectialite(diplomes);
    setDiplome(specialites);
  }, [resultDetails]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card className="p-3 bg-light">
            <div className="hstack gap-2 d-flex justify-content-center">
              <span className="fs-20 fw-bold">Résultat :</span>
              <span className="fs-18 fw-medium">{niveau}</span>
              <span className="fs-18 fw-medium">{spectialite}</span>
              <span className="fs-18 fw-meduim">{diplome}</span>
            </div>
          </Card>
          <Card className="p-3 bg-light">
            <Row>
              <Tab.Container defaultActiveKey="home1">
                <Nav
                  as="ul"
                  variant="pills"
                  className="nav-pills-custom nav-primary nav-justified mb-3 "
                >
                  <Nav.Item as="li">
                    <Nav.Link eventKey="home1">
                      <div className="hstack gap-3 d-flex justify-content-center">
                        <span className="fs-18">Nombre des Admis</span>
                        <span className="fs-18">{etudiantsAdmis.length}</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="profile1">
                      <div className="hstack gap-3 d-flex justify-content-center">
                        <span className="fs-18">Nombre des Refusé</span>
                        <span className="fs-18">{etudiantsRefuse.length}</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="text-muted">
                  <Tab.Pane eventKey="home1">
                    <Row className="mb-2 fs-14 fw-bold text-white bg-info">
                      <Col>C.I.N</Col>
                      <Col>Nom & Prénom</Col>
                      <Col>Moyenne S1</Col>
                      <Col>Moyenne S2</Col>
                      <Col>Moyenne Rattrapage</Col>
                      <Col>Moyenne Générale</Col>
                    </Row>
                    {etudiantsAdmis.map((item: any) => (
                      <Row className="mb-1 text-dark fs-15 fw-meduim">
                        <Col>{item.etudiant.num_CIN}</Col>
                        <Col>
                          {item.etudiant.nom_fr} {item.etudiant.prenom_fr}
                        </Col>
                        <Col>{item.moyenne_sem1}</Col>
                        <Col>{item.moyenne_sem2}</Col>
                        <Col>
                          {item.moyenne_rattrapage === "" ? (
                            <span>--</span>
                          ) : (
                            <span>{item.moyenne_rattrapage}</span>
                          )}
                        </Col>
                        <Col>{item.moyenne_generale}</Col>
                      </Row>
                    ))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="profile1">
                    <Row className="mb-2 fs-14 fw-bold text-white bg-info">
                      <Col lg={2}>C.I.N</Col>
                      <Col>Nom & Prénom</Col>
                      <Col>Moyenne S1</Col>
                      <Col>Moyenne S2</Col>
                      <Col>Moyenne Rattrapage</Col>
                      <Col>Moyenne Générale</Col>
                    </Row>
                    {etudiantsRefuse.map((item: any) => (
                      <Row className="mb-1 text-dark fs-15 fw-meduim">
                        <Col>{item.etudiant.num_CIN}</Col>
                        <Col>
                          {item.etudiant.nom_fr} {item.etudiant.prenom_fr}
                        </Col>
                        <Col>{item.moyenne_sem1}</Col>
                        <Col>{item.moyenne_sem2}</Col>
                        <Col>
                          {item.moyenne_rattrapage === "" ? (
                            <span>--</span>
                          ) : (
                            <span>{item.moyenne_rattrapage}</span>
                          )}
                        </Col>
                        <Col>{item.moyenne_generale}</Col>
                      </Row>
                    ))}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DetailsResultat;
