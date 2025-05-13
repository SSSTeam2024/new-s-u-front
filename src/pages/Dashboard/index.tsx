import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {
  BasicColumn,
  ColorRangeTreemap,
  Groupes,
  MonochromePie,
  NagetiveLable,
} from "./DashboardCharts";
import KeyCards from "./KeyCards";
import ReclamationCards from "./ReclamationCards";

const Dashboard = () => {
  document.title = "Dashboard | ENIGA";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <KeyCards />
          <ReclamationCards />
          <Row>
            <Card>
              <Card.Header>
                <h4 className="card-title mb-0">Résultat</h4>
              </Card.Header>
              <Card.Body>
                <NagetiveLable dataColors='["--tb-success", "--tb-danger", "--tb-warning"]' />
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <Card.Header>
                  <h4 className="card-title mb-0">Etudiants</h4>
                </Card.Header>
                <Card.Body>
                  <Groupes dataColors='["--tb-success", "--tb-danger", "--tb-primary"]' />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <Card.Header>
                  <h4 className="card-title mb-0">Enseignants</h4>
                </Card.Header>

                <Card.Body>
                  <MonochromePie dataColors='["--tb-primary"]' />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h4 className="card-title mb-0">Absences Personnel</h4>
                </Card.Header>
                <Card.Body>
                  <BasicColumn dataColors='["--tb-danger", "--tb-primary", "--tb-success"]' />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h4 className="card-title mb-0">Grade des Personnels</h4>
                </Card.Header>
                <Card.Body>
                  <ColorRangeTreemap dataColors='["--tb-info","--tb-danger"]' />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
