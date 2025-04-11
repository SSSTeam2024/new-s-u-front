import React from "react";
import CountUp from "react-countup";
import { Card, Col, Row } from "react-bootstrap";
import { useFetchDemandeEnseignantQuery } from "features/demandeEnseignant/demandeEnseignantSlice";
import { useFetchDemandeEtudiantQuery } from "features/demandeEtudiant/demandeEtudiantSlice";
import { useFetchDemandePersonnelQuery } from "features/demandePersonnel/demandePersonnelSlice";

const KeyCards = () => {
  const { data: demandesEnseignant } = useFetchDemandeEnseignantQuery();
  const { data: demandesEtudiant } = useFetchDemandeEtudiantQuery();
  const { data: demandesPersonnel } = useFetchDemandePersonnelQuery();

  const filtredDemandeEnseignant = demandesEnseignant?.filter(
    (demande) => demande.status === "en attente"
  );

  const filtredDemandeEtudiant = demandesEtudiant?.filter(
    (demande) => demande.status === "en attente"
  );

  const filtredDemandePersonnel = demandesPersonnel?.filter(
    (demande) => demande.status === "en attente"
  );

  const totalDemandesEnAttente =
    (filtredDemandeEnseignant?.length || 0) +
    (filtredDemandeEtudiant?.length || 0) +
    (filtredDemandePersonnel?.length || 0);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Nouvelles Demandes</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col lg={3}>
                  <Card className="text-center mb-0">
                    <Card.Header className="text-bg-success border-0">
                      <div className="fs-22 fw-semibold">
                        <span className="counter-value" data-target="40">
                          <CountUp end={totalDemandesEnAttente} separator="," />
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title bg-success-subtle text-success fs-22 rounded-circle">
                          <i className="bi bi-send-exclamation"></i>
                        </div>
                      </div>
                      <p className="text-muted fs-13 mb-0">
                        Total Demandes En Attente
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="text-center mb-0">
                    <Card.Header className="text-bg-secondary border-0">
                      <div className="fs-22 fw-semibold">
                        <span className="counter-value" data-target="40">
                          <CountUp
                            end={filtredDemandeEnseignant?.length!}
                            separator=","
                          />
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title bg-secondary-subtle text-secondary fs-22 rounded-circle">
                          <i className="bi bi-envelope-exclamation"></i>
                        </div>
                      </div>
                      <p className="text-muted fs-14 mb-0">
                        Demandes Enseignant
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="text-center border-danger mb-0 border-opacity-25">
                    <Card.Header className="bg-danger-subtle text-danger border-0">
                      <div className="fs-22 fw-semibold">
                        <span className="counter-value" data-target="40">
                          <CountUp
                            end={filtredDemandeEtudiant?.length!}
                            separator=","
                          />
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title bg-danger-subtle text-danger fs-22 rounded-circle">
                          <i className="bi bi-patch-question"></i>
                        </div>
                      </div>
                      <p className="text-muted fs-14 mb-0">Demandes Etudiant</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="text-center border-warning border-opacity-25 mb-0">
                    <Card.Header className="bg-warning-subtle text-warning border-0">
                      <div className="fs-22 fw-semibold">
                        <span className="counter-value" data-target="40">
                          <CountUp
                            end={filtredDemandePersonnel?.length!}
                            separator=","
                          />
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title bg-warning-subtle text-warning fs-22 rounded-circle">
                          <i className="bi bi-file-earmark-ppt"></i>
                        </div>
                      </div>
                      <p className="text-muted fs-14 mb-0">
                        Demandes Personnel
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default KeyCards;
