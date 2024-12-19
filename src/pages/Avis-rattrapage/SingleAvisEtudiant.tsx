import React from "react";
import { Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

// Import images
import img1 from "assets/images/small/img-1.jpg";
import img2 from "assets/images/small/img-2.jpg";
import img3 from "assets/images/small/img-3.jpg";
import img4 from "assets/images/small/img-4.jpg";
import img5 from "assets/images/small/img-5.jpg";
import img6 from "assets/images/small/img-6.jpg";

const SingleAvisEtudiant = () => {
  document.title = "Avis Etudiant | Smart Institute";
  const state = useLocation();
  console.log("state", state);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Avis Etudiant" pageTitle="Avis Etudiant" />
          <Row>
            <Col xxl={12}>
              <Card>
                <Row >
                  <Col md={4}>
                    {/* <img className="rounded-start img-fluid h-100 object-cover" src={img10} alt="Card img" /> */}
                    <Carousel controls={false} indicators={false}>
                      <Carousel.Item>
                        <Image
                          className="rounded-start img-fluid h-100 object-cover"
                          src={img1}
                          alt="First slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <Image
                          className="rounded-start img-fluid h-100 object-cover"
                          src={img2}
                          alt="Second slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <Image
                          className="rounded-start img-fluid h-100 object-cover"
                          src={img3}
                          alt="Third slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                  </Col>
                  <Col md={8}>
                    <Card.Header>
                      <h5 className="card-title mb-0">
                        {state.state.title}
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="card-text mb-2">
                    {state.state.description}
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                        For that very reason, I went on a quest and spoke to
                        many different professional graphic designers and asked
                        them what graphic design tips they live.
                      </p>
                      <p className="card-text">
                      <span className="badge badge-label bg-primary"><i className="mdi mdi-circle-medium"></i> LGA2</span>
                      <span className="badge badge-label bg-primary"><i className="mdi mdi-circle-medium"></i> LGA3</span>
                      <span className="badge badge-label bg-primary"><i className="mdi mdi-circle-medium"></i> MPI1</span>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                            {state.state.date}
                          
                        </small>
                      </p>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleAvisEtudiant;
