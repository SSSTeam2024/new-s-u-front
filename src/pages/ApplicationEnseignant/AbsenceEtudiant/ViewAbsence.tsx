import React from "react";
import { Container, Row, Card, Col, Button, Table } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";

const ViewAbsence = () => {
  const location = useLocation();
  const absenceDetails = location?.state?.absenceDetails;
  const navigate = useNavigate();

  console.log(absenceDetails); // Debugging

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="Détails de l'Absence"
          pageTitle="Application Enseignant"
        />

        <Col lg={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white text-center">
              <h4 className="mb-0">Détails de l'Absence</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Semestre:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.trimestre ?? "Aucune semestre assigné..."}
                </Col>
              </Row>

              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Date:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.date ?? "Aucune date assigné..."}
                </Col>
              </Row>

              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Enseignant:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.enseignant?.prenom_fr ??
                    "Aucune enseignant assigné..."}{" "}
                  {absenceDetails?.enseignant?.nom_fr ?? ""}
                </Col>
              </Row>
              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Matière:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.seance?.matiere?.matiere ??
                    "Aucune matière assigné..."}
                </Col>
              </Row>

              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Horaire:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.seance?.heure_debut ??
                    "Aucune heure debt assigné..."}{" "}
                  -{" "}
                  {absenceDetails?.seance?.heure_fin ??
                    "Aucune heure fin assigné..."}
                </Col>
              </Row>

              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Salle:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.seance?.salle?.salle ??
                    "Aucune salle assigné..."}
                </Col>
              </Row>

              <Row className="mb-3 border-bottom pb-2">
                <Col lg={4}>
                  <strong className="text-muted">Classe:</strong>
                </Col>
                <Col lg={8} className="fw-bold">
                  {absenceDetails?.classe?.nom_classe_fr ??
                    "Aucun classe assigné..."}
                </Col>
              </Row>

              <h5 className="text-primary mt-4">Étudiants Absents</h5>
              {absenceDetails?.etudiants &&
              absenceDetails.etudiants.length > 0 ? (
                <Table striped bordered hover className="mt-3">
                  <thead className="table-secondary">
                    <tr>
                      <th>Nom & Prénom</th>
                      <th>Présence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absenceDetails.etudiants
                      // Filter students by typeAbsent (A for absent)
                      .filter((student: any) => student?.typeAbsent === "A") // Only absent students
                      .map((student: any) => (
                        <tr key={student?._id}>
                          <td>
                            {student?.etudiant?.prenom_fr ??
                              "Aucun étudiant assigné..."}{" "}
                            {student?.etudiant?.nom_fr ?? ""}
                          </td>
                          <td className="text-danger fw-bold">Absent(e)</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center text-muted mt-3">
                  Aucun étudiant enregistré.
                </p>
              )}

              <h5 className="text-primary mt-4">Étudiants Présents</h5>
              {absenceDetails?.etudiants &&
              absenceDetails.etudiants.length > 0 ? (
                <Table striped bordered hover className="mt-3">
                  <thead className="table-secondary">
                    <tr>
                      <th>Nom & Prénom</th>
                      <th>Présence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absenceDetails.etudiants
                      // Filter students by typeAbsent (P for present)
                      .filter((student: any) => student?.typeAbsent === "P") // Only present students
                      .map((student: any) => (
                        <tr key={student?._id}>
                          <td>
                            {student?.etudiant?.prenom_fr ??
                              "Aucun étudiant assigné..."}{" "}
                            {student?.etudiant?.nom_fr ?? ""}
                          </td>
                          <td className="text-success fw-bold">Présent(e)</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center text-muted mt-3">
                  Aucun étudiant enregistré.
                </p>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Button variant="danger" onClick={() => navigate(-1)}>
                  Retour
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default ViewAbsence;
