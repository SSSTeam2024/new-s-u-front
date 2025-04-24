import React from "react";
import CountUp from "react-countup";
import { Card, Col, Row } from "react-bootstrap";
import { useFetchReclamationsEnseignantQuery } from "features/reclamationEnseignant/reclamationEnseignantSlice";
import { useFetchReclamationsQuery } from "features/reclamationEtudiant/recalamationEtudiantSlice";
import { useFetchReclamationsPersonnelQuery } from "features/reclamationPersonnel/reclamationPersonnelSlice";

const ReclamationCards = () => {
  const { data: reclamationsEnseignant } =
    useFetchReclamationsEnseignantQuery();
  const { data: reclamationsEtudiant } = useFetchReclamationsQuery();
  const { data: reclamationsPersonnel } = useFetchReclamationsPersonnelQuery();

  const filtredReclamationsEnseignant = reclamationsEnseignant?.filter(
    (reclamation) => reclamation.status === "en attente"
  );

  const filtredReclamationsEtudiant = reclamationsEtudiant?.filter(
    (reclamation) => reclamation.status === "en attente"
  );

  const filtredReclamationsPersonnel = reclamationsPersonnel?.filter(
    (reclamation) => reclamation.status === "en attente"
  );

  const totalReclamationsEnAttente =
    (filtredReclamationsEnseignant?.length || 0) +
    (filtredReclamationsEtudiant?.length || 0) +
    (filtredReclamationsPersonnel?.length || 0);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Réclamations En Attente</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                <Col lg={3}>
                  <Card className="ribbon-box border shadow-none mb-lg-0">
                    <Card.Body>
                      <div className="ribbon ribbon-primary ribbon-shape">
                        Total
                      </div>
                      <h5 className="fs-14 text-end">
                        <CountUp
                          end={totalReclamationsEnAttente}
                          separator=","
                        />
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="ribbon-box border shadow-none mb-lg-0">
                    <Card.Body>
                      <div className="ribbon ribbon-info ribbon-shape">
                        Enseignant
                      </div>
                      <h5 className="fs-14 text-end">
                        <CountUp
                          end={filtredReclamationsEnseignant?.length!}
                          separator=","
                        />
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="ribbon-box border shadow-none mb-lg-0 right">
                    <Card.Body>
                      <div className="ribbon ribbon-dark ribbon-shape">
                        Etudiant
                      </div>
                      <h5 className="fs-14 text-start">
                        <CountUp
                          end={filtredReclamationsEtudiant?.length!}
                          separator=","
                        />
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={3}>
                  <Card className="ribbon-box border shadow-none mb-lg-0 right">
                    <Card.Body>
                      <div className="ribbon ribbon-light ribbon-shape text-dark">
                        Personnel
                      </div>
                      <h5 className="fs-14 text-start">
                        <CountUp
                          end={filtredReclamationsPersonnel?.length!}
                          separator=","
                        />
                      </h5>
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
export default ReclamationCards;
