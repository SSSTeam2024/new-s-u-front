import React from "react";
import { Button, Col, Container, Row, Carousel, Image } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const EditAvisEtudiant = () => {
  document.title = "Avis Etudiant | Smart Institute";
  const location = useLocation();
  const { title, gallery, description, auteurId, date_avis, createdAt, lien } =
    location.state;

  // Format the createdAt timestamp
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Avis Etudiant" pageTitle="Avis Etudiant" />

          <Row className="justify-content-center">
            <Col lg={8} className="mt-4">
              <h5 className="display-4  mb-4">{title}</h5>
              <Carousel controls={true} indicators={true} className="mb-4">
                {gallery.map((photo: any, index: any) => (
                  <Carousel.Item key={index}>
                    <Image
                      className="d-block w-100"
                      src={`${process.env.REACT_APP_API_URL}/files/avisEtudiantFiles/photo/${photo}`}
                      alt={`Slide ${index + 1}`}
                      style={{ maxHeight: "500px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              <p className="text-muted mb-2">
                <span className="fw-bold">Publié</span>{" "}
                <span className="text-secondary fw-bold">{formattedDate}</span>
                <br />
                <span className="fw-bold">par</span>{" "}
                <span className="fw-semibold text-primary fw-bold">
                  {auteurId?.name}
                </span>
              </p>{" "}
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: description }}
              ></div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <Button variant="soft-primary" className="btn-sm mb-3 me-2">
                <i className="bi bi-link-45deg fs-20 me-2"></i> Lien
              </Button>
              <Button variant="soft-danger" className="btn-sm mb-3">
                <i className="bi bi-filetype-pdf fs-20 me-2"></i> Fichier
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditAvisEtudiant;
