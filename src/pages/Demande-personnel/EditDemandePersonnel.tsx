import React from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
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
import avatar1 from "assets/images/users/avatar-1.jpg";

const EditDemandePersonnel = () => {
  document.title = "Modifier demande Etudiant | Smart Institute";
  const state = useLocation();
  console.log("state", state);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="demande Etudiant"
            pageTitle="Modifier La Demande"
          />
          <Row>
            <Col lg={12}>
              <Card>
                {/* <Card.Header>
                                <h5 className="card-title mb-0">Basic Example</h5>
                            </Card.Header> */}
                <Card.Body>
                  <Card className="border-0 shadow-none mb-0">
                    <Card.Body
                      className="rounded profile-basic"
                      style={{
                        backgroundImage: `url(${img4})`,
                        backgroundSize: "cover",
                      }}
                    ></Card.Body>
                    <Card.Body>
                      <div className="mt-n5">
                        <Image
                          src={avatar1}
                          alt=""
                          className="avatar-lg rounded-circle p-1 bg-body mt-n3"
                        />
                      </div>
                    </Card.Body>
                    <Card.Body className="pt-0">
                      <Row className="justify-content-between gy-4">
                        <Col xl={3} md={5}>
                          <h5 className="fs-20">{state.state?.etudiant!}</h5>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-geo-alt"></i>{" "}
                            {state.state?.classe!}
                          </div>
                          <h6 className="fs-16">
                            CIN: <span className="text-muted">{state.state?.CIN!}</span>
                          </h6>
                          <h6 className="fs-16">
                            Tél: <span className="text-muted">{state.state?.CIN!}</span>
                          </h6>

                          {/* <div className="hstack gap-2">
                                                    <Button variant="primary">Invite to Project</Button>
                                                    <Button variant='soft-info' className="btn-icon"><i className="bi bi-chat-left-text"></i></Button>

                                                    <Dropdown role="button">
                                                        <Dropdown.Toggle as="a" className="btn btn-soft-danger btn-icon arrow-none">
                                                            <i className="bi bi-three-dots-vertical"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu as="ul" className="dropdown-menu">
                                                            <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                            <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                            <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div> */}
                        </Col>
                        <Col xl={4} md={7}>
                          <div>
                            <h5 className="fs-20">Demande</h5>
                            <ul className="list-inline mb-4">
                              <li className="list-inline-item">
                                <h6 className="fs-16 ">
                                  Type:{" "}
                                  <span className="text-muted">
                                    {state.state?.type!}/
                                    {state.state?.soustype!}
                                  </span>
                                </h6>
                                <h6 className="fs-16" >
                                  Langue:{" "}
                                  <span className="badge bg-info-subtle text-info">
                                    Francais
                                  </span>
                                </h6>
                                <h6 className="fs-16">
                                  Nombre de copie:{" "}
                                  <span className="badge bg-secondary-subtle text-info">
                                    1
                                  </span>
                                </h6>
                                <h6 className="fs-16">
                                  Date de création:{" "}
                                  <span className="text-muted">
                                    {state.state?.date!}
                                  </span>
                                </h6>
                                <div className="d-flex align-items-center">
                                <h6 className="fs-16 mr-2">
                                    Statut: </h6><select
                                  className="form-select mb-3 fs-16"
                                  aria-label="Default select example"
                                >
                                  <option selected>
                                   {state.state?.status!}
                                  </option>
                                  <option value="1">En cours</option>
                                  <option value="2">Traité</option>
                                </select>
                                
                                </div>
                              </li>
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
            
          </Row>
          <Row>
          <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Modifier la Demande
                            </Button>
                          </div>
                        </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditDemandePersonnel;
