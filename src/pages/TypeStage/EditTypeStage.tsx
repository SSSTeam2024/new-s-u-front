import React, { useState } from "react";
import { Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";

const EditTypeStage = () => {
  document.title = "Modifier Type Stage | ENIGA";

  const location = useLocation();
  const detailsTypeStage = location.state;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Type Stage"
            pageTitle="Gestion des stages"
          />
          <Card>
            <Card.Header>
              <Row>
                <Col>
                  <h4>Modifier</h4>
                </Col>
                {/* <Col className="d-flex justify-content-end">
                  <h4>{detailsTypeStage.nom_ar}</h4>
                </Col> */}
              </Row>
            </Card.Header>
            <Card.Body></Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditTypeStage;
