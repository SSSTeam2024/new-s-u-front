import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

// Import Images
import logoDark from 'assets/images/logo-dark.png'
import logoLight from 'assets/images/logo-light.png'
import enigaLogo from 'assets/images/logo.png'
import error404 from 'assets/images/error400.png'
import { Link } from 'react-router-dom';
import Footer from 'Layout/Footer';

const Error404 = () => {

    document.title = "404 | Page introuvable!";

    return (
        <React.Fragment>
            <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
                <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
                    <Container fluid={true}>
                        <Row className="justify-content-between align-items-center">
                            <Col className="col-2">
                                <Link to="/" className="navbar-brand mb-2 mb-sm-0">
                                    <img src={enigaLogo} alt="" height="50" className="card-logo card-logo-dark" />
                                    <img src={enigaLogo} alt="" height="50" className="card-logo card-logo-light" />
                                </Link>
                            </Col>


                            <Col className="col-auto">
                                {/* <ul className="list-unstyled hstack gap-2 mb-0">
                                    <li className="me-md-3">
                                        <Link to="#!" className="text-body fw-medium fs-15">Become a Selling</Link>
                                    </li>
                                    <li className="d-none d-md-block">
                                        <Link to="#!" className="btn btn-soft-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-google-play align-middle me-1"></i> Download App
                                        </Link>
                                    </li>
                                    <li className="d-none d-md-block">
                                        <Link to="#!" className="btn btn-soft-primary" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-apple align-middle me-1"></i> Download App
                                        </Link>
                                    </li>
                                </ul> */}
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div style={{ width: "100%" }}>
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={6}>
                                <div className="auth-card mx-lg-3">
                                    <Card className="border-0 mb-0">
                                        <Card.Body className="text-center p-4">

                                            <div className="text-center px-sm-5 mx-5">
                                                <img src={error404} className="img-fluid" alt="" />
                                            </div>
                                            <div className="mt-4 text-center pt-3">
                                                <div className="position-relative">
                                                    <h4 className="fs-18 error-subtitle text-uppercase mb-0">Opps, page introuvable</h4>

                                                    <div className="mt-4">
                                                        <Link to="/" className="btn btn-primary"><i className="mdi mdi-home me-1"></i>Revenir à la page d'accueil</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    {/* <footer className="footer">
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <div className="text-center">
                                        <p className="mb-0 text-muted">©
                                            2025 © École nationale d'ingénieurs de Gafsa.
                                            Conception et développement par 3S
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </footer> */}
                    <Footer />
                </div>
            </section>
        </React.Fragment>
    );
}

export default Error404;