import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          <Row>
            <Col sm={6}>
              {new Date().getFullYear()} © École nationale d'ingénieurs de
              Gafsa.
            </Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Conception et développement par 3S
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
