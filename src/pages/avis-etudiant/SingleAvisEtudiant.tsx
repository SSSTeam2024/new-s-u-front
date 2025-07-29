
import React from "react";
import { Button, Col, Container, Row, Carousel, Image, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const SingleAvisEtudiant = () => {
  document.title = "Avis Etudiant | ENIGA";
  const location = useLocation();
  const { title, gallery, description, auteurId, createdAt, lien } = location.state;

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Avis Etudiant" pageTitle="Avis Etudiant" />

          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <Card className="shadow-lg border-0 mt-4">
                <Card.Body>
                  {/* Title */}
                  <h2 className="text-center fw-bold mb-4 text-primary">{title}</h2>

                  {/* Carousel */}
                  {gallery?.length > 0 && (
                    <Carousel className="mb-4">
                      {gallery.map((photo: any, index: number) => (
                        <Carousel.Item key={index}>
                          <Image
                            src={`${process.env.REACT_APP_API_URL}/files/avisEtudiantFiles/photo/${photo}`}
                            alt={`Slide ${index + 1}`}
                            className="d-block w-100 rounded"
                            style={{ maxHeight: "450px", objectFit: "cover" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}

                  {/* Metadata */}
                  <div className="text-muted small mb-3 text-center">
                    <span className="me-3">
                      <i className="bi bi-calendar-event me-1"></i>
                      Publié <strong>{formattedDate}</strong>
                    </span>
                    
                      <span>
                        <i className="bi bi-person-fill me-1"></i>
                        par <strong className="text-primary">{auteurId.prenom_fr} {auteurId.nom_fr}</strong>
                      </span>
                
                  </div>

                  {/* Description */}
                  <div
                    className="mb-4"
                    style={{ lineHeight: 1.7, fontSize: "1.05rem" }}
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div>

                  {/* Buttons */}
                  <div className="text-center mt-4">
                    {lien && (
                      <Button
                        variant="outline-primary"
                        className="me-2 mb-2"
                        href={lien}
                        target="_blank"
                      >
                        <i className="bi bi-link-45deg me-2"></i>Consulter le lien
                      </Button>
                    )}
                    <Button variant="outline-danger" className="mb-2">
                      <i className="bi bi-filetype-pdf me-2"></i>Voir le fichier
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleAvisEtudiant;
