import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

const AddNewStagePro = () => {
  document.title = "Ajouter Nouveau Stage Professionnel | ENIGA";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nouveau Stage Professionnel"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <h6>Add New</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNewStagePro;
