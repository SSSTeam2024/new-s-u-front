import React, { useState } from "react";
import { Container, Row, Card, Col, Button, Table } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchPersonnelWorkingDayQuery } from "features/personnelWorkingDay/personnelWorkingDaySlice";

const ViewAbsencePersonnel = () => {
  document.title = "Détails Absence | ENIGA";
  const location = useLocation();
  const absenceDetails = location?.state!;
  const navigate = useNavigate();

  const { data: AllPersonnelWorkingDay = [] } =
    useFetchPersonnelWorkingDayQuery();

  const personnelEnConge = absenceDetails.personnels.filter(
    (personnel: any) =>
      personnel?.evening === "En congé" && personnel?.morning === "En congé"
  );

  const personnelAutorisation = absenceDetails.personnels.filter(
    (personnel: any) =>
      personnel?.evening === "Autorisation" ||
      personnel?.morning === "Autorisation" ||
      personnel?.fullDay === "Autorisation"
  );

  const filteredWorkingHour = AllPersonnelWorkingDay.find((day) => {
    const periodStart = day.period_start;
    const periodEnd = day.period_end;

    return (
      absenceDetails.jour >= periodStart && absenceDetails.jour <= periodEnd
    );
  });

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="Détails de l'Absence"
          pageTitle="Gestion des Personnels"
        />

        <Col lg={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-center">
              <h4 className="mb-0 text-light">
                Etat de présence des personnels
              </h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3 border-bottom pb-2">
                <Col lg={3}>
                  <strong className="text-muted">Période:</strong>
                </Col>
                <Col lg={3} className="fw-bold">
                  {filteredWorkingHour?.name! ?? "Aucune semestre assigné..."}
                </Col>

                <Col lg={3}>
                  <strong className="text-muted">Date:</strong>
                </Col>
                <Col lg={3} className="fw-bold">
                  {absenceDetails?.jour ?? "Aucune date assigné..."}
                </Col>
              </Row>

              <h5 className="text-primary mt-4">Personnels Absents</h5>
              {absenceDetails?.personnels &&
              absenceDetails.personnels.length > 0 ? (
                filteredWorkingHour?.daily_pause_start === "--:--" &&
                filteredWorkingHour?.daily_pause_end === "--:--" ? (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Seul Séance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absenceDetails.personnels
                        .filter(
                          (personnel: any) => personnel?.fullDay === "Absent"
                        )
                        .map((personnel: any) => (
                          <tr key={personnel?.personnel?._id!}>
                            <td>
                              {personnel?.personnel?.prenom_fr ??
                                "Aucun personnel assigné..."}{" "}
                              {personnel?.personnel?.nom_fr ?? ""}
                            </td>
                            <td className="text-danger fw-bold">Absent(e)</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Matin</th>
                        <th>Après-midi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absenceDetails.personnels
                        .filter(
                          (personnel: any) =>
                            personnel?.evening === "Absent" &&
                            personnel?.morning === "Absent"
                        )
                        .map((personnel: any) => (
                          <tr key={personnel?.personnel?._id!}>
                            <td>
                              {personnel?.personnel?.prenom_fr ??
                                "Aucun personnel assigné..."}{" "}
                              {personnel?.personnel?.nom_fr ?? ""}
                            </td>
                            <td className="text-danger fw-bold">Absent(e)</td>
                            <td className="text-danger fw-bold">Absent(e)</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )
              ) : (
                <p className="text-center text-muted mt-3">
                  Aucun personnel enregistré.
                </p>
              )}

              <h5 className="text-primary mt-4">Personnels En Congé</h5>
              {personnelEnConge && personnelEnConge.length > 0 ? (
                filteredWorkingHour?.daily_pause_start === "--:--" &&
                filteredWorkingHour?.daily_pause_end === "--:--" ? (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Seul Séance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personnelEnConge.map((personnel: any) => (
                        <tr key={personnel?.personnel?._id!}>
                          <td>
                            {personnel?.personnel?.prenom_fr ??
                              "Aucun personnel assigné..."}{" "}
                            {personnel?.personnel?.nom_fr ?? ""}
                          </td>
                          <td className="text-warning fw-bold">En congé</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Matin</th>
                        <th>Après-midi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personnelEnConge.map((personnel: any) => (
                        <tr key={personnel?.personnel?._id!}>
                          <td>
                            {personnel?.personnel?.prenom_fr ??
                              "Aucun personnel assigné..."}{" "}
                            {personnel?.personnel?.nom_fr ?? ""}
                          </td>
                          <td className="text-warning fw-bold">En congé</td>
                          <td className="text-warning fw-bold">En congé</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )
              ) : (
                <p className="text-center text-muted mt-3">
                  Aucun personnel enregistré.
                </p>
              )}

              <h5 className="text-primary mt-4">Autorisation Personnels</h5>
              {personnelAutorisation && personnelAutorisation.length > 0 ? (
                filteredWorkingHour?.daily_pause_start === "--:--" &&
                filteredWorkingHour?.daily_pause_end === "--:--" ? (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Seul Séance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personnelAutorisation.map((personnel: any) => (
                        <tr key={personnel?.personnel?._id!}>
                          <td>
                            {personnel?.personnel?.prenom_fr ??
                              "Aucun personnel assigné..."}{" "}
                            {personnel?.personnel?.nom_fr ?? ""}
                          </td>
                          <td>
                            {personnel?.fullDay === "Autorisation" && (
                              <div className="vstack gap-2">
                                <span className="text-warning fw-bold">
                                  Autorisation
                                </span>
                                <span className="fw-bold">
                                  Durée: {personnel.duree}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Matin</th>
                        <th>Après-midi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personnelAutorisation.map((personnel: any) => (
                        <tr key={personnel?.personnel?._id!}>
                          <td>
                            {personnel?.personnel?.prenom_fr ??
                              "Aucun personnel assigné..."}{" "}
                            {personnel?.personnel?.nom_fr ?? ""}
                          </td>
                          <td>
                            {personnel?.morning === "Autorisation" ? (
                              <div className="vstack gap-2">
                                <span className="text-warning fw-bold">
                                  Autorisation
                                </span>
                                <span className="fw-bold">
                                  Durée: {personnel.duree}
                                </span>
                              </div>
                            ) : (
                              <span className="text-success fw-bold">
                                Présent(e)
                              </span>
                            )}
                          </td>
                          <td>
                            {personnel?.evening === "Autorisation" ? (
                              <div className="vstack gap-2">
                                <span className="text-warning fw-bold">
                                  Autorisation
                                </span>
                                <span className="fw-bold">
                                  Durée: {personnel.duree}
                                </span>
                              </div>
                            ) : (
                              <span className="text-success fw-bold">
                                Présent(e)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )
              ) : (
                <p className="text-center text-muted mt-3">
                  Aucun personnel enregistré.
                </p>
              )}

              <h5 className="text-primary mt-4">Personnels Présents</h5>
              {absenceDetails?.personnels &&
              absenceDetails.personnels.length > 0 ? (
                filteredWorkingHour?.daily_pause_start === "--:--" &&
                filteredWorkingHour?.daily_pause_end === "--:--" ? (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Seul Séance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absenceDetails.personnels

                        .filter((person: any) => person?.fullDay === "Present")
                        .map((person: any) => (
                          <tr key={person?._id}>
                            <td>
                              {person?.personnel?.prenom_fr ??
                                "Aucun étudiant assigné..."}{" "}
                              {person?.personnel?.nom_fr ?? ""}
                            </td>
                            <td className="text-success fw-bold">Présent(e)</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                ) : (
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-info">
                      <tr>
                        <th>Nom & Prénom</th>
                        <th>Matin</th>
                        <th>Après-midi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absenceDetails.personnels

                        .filter(
                          (person: any) =>
                            person?.evening === "Present" &&
                            person?.morning === "Present"
                        )
                        .map((person: any) => (
                          <tr key={person?._id}>
                            <td>
                              {person?.personnel?.prenom_fr ??
                                "Aucun étudiant assigné..."}{" "}
                              {person?.personnel?.nom_fr ?? ""}
                            </td>
                            <td className="text-success fw-bold">Présent(e)</td>
                            <td className="text-success fw-bold">Présent(e)</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )
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

export default ViewAbsencePersonnel;
