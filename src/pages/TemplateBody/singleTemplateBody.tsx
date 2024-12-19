import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const TemplateBodyDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const templateBody = location.state; // Extract the template body data from location

  if (!templateBody) {
    return (
      <div>
        <h4>Aucune donnée disponible. Veuillez revenir en arrière et réessayer.</h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-file-text"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">Détails du Corps du Modèle</h5>
                      </div>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    <div className="mb-3">
                      <h4 className="card-title mb-0">Titre</h4>
                      <p>{templateBody?.title}</p>
                    </div>

                    <div className="mb-3">
                      <h4 className="card-title mb-0">Langue</h4>
                      <p>{templateBody?.langue}</p> 
                    </div>

                    <div className="mb-3">
                      <h4 className="card-title mb-0">Destiné à</h4>
                      <p>{templateBody?.intended_for}</p> 
                    </div>

                    <div className="mb-3">
                      <h4 className="card-title mb-0">Corps</h4>
                      <div dangerouslySetInnerHTML={{ __html: templateBody?.body }} /> 
                    </div>

                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={() => navigate(-1)} 
                      >
                        Retour
                      </Button>
                    </div>
                  </Card.Body>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TemplateBodyDetail;
