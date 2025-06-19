import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation } from "react-router-dom";

const DetailsPv = () => {
  document.title = "Détails de Pv | ENIGA";

  const location = useLocation();
  const pvDetails = location.state;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Détails de PV" pageTitle="Directeur des stages" />
          <Card className="shadow p-4">
            <Card.Body>
              <h4>Details</h4>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DetailsPv;
