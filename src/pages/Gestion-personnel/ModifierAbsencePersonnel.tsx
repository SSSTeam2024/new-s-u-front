import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetchPersonnelWorkingDayQuery } from "features/personnelWorkingDay/personnelWorkingDaySlice";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import absenceAnimation from "../../assets/images/Animation - 1742900291397.json";
import {
  AbsencePersonnel,
  useUpdateAbsenceMutation,
} from "features/absencePersonnel/absencePersonnel";

const ModifierAbsencePersonnel = () => {
  document.title = "Modifier Absence Personnels | ENIGA";
  const location = useLocation();
  const absenceDetails = location?.state?.absenceDetails;
  const { data: AllPersonnelWorkingDay = [] } =
    useFetchPersonnelWorkingDayQuery();
  const [personnelTypes, setPersonnelTypes] = useState<{
    [key: string]: string;
  }>({});
  const [refresh, setRefresh] = useState(false);
  const lottieRef3 = useRef<LottieRefCurrentProps>(null);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [personnelsList, setPersonnelsList] = useState<any[]>([]);
  const [absence, setAbsence] = useState<AbsencePersonnel>(
    absenceDetails || {
      jour: "",
      added_by: "",
      personnels: [],
    }
  );
  const navigate = useNavigate();
  const filteredWorkingHour = AllPersonnelWorkingDay.find((day) => {
    const periodStart = day.period_start;
    const periodEnd = day.period_end;

    return (
      absenceDetails.jour >= periodStart && absenceDetails.jour <= periodEnd
    );
  });

  useEffect(() => {
    if (absenceDetails.personnels && !hasProcessed) {
      if (
        filteredWorkingHour?.daily_pause_start === "--:--" &&
        filteredWorkingHour?.daily_pause_end === "--:--"
      ) {
        let personnels = absenceDetails.personnels.map((person: any) => ({
          personnel: person,
          presence: true,
        }));

        setPersonnelsList(personnels);
        setHasProcessed(true);
      } else {
        let personnels = absenceDetails.personnels.map((person: any) => ({
          personnel: person,
          presenceMorning: true,
          presenceEvening: true,
        }));

        setPersonnelsList(personnels);
        setHasProcessed(true);
      }
    }
  }, [absenceDetails, hasProcessed, filteredWorkingHour]);

  // const start: any = new Date(filteredWorkingHour?.period_start!);
  // const end: any = new Date(filteredWorkingHour?.period_end!);
  // const diffInDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

  // let periodType = "Temps Régulier";

  // if (diffInDays === 30) {
  //   periodType = "Calendrier Ramadan";
  // } else if (diffInDays === 62) {
  //   periodType = "Séance unique";
  // }

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'absence a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [updatedPersonnels, setUpdatedPersonnels] = useState(
    absenceDetails?.personnels || []
  );

  const handleChange = (index: number, field: string, value: string) => {
    setUpdatedPersonnels((prev: any) => {
      const updated = [...prev];
      const current = { ...updated[index] };

      if (field === "morning" && value === "Autorisation") {
        current.autorisation = "matin";
      } else if (field === "evening" && value === "Autorisation") {
        current.autorisation = "apres_midi";
      } else if (field === "morning" && current.autorisation === "matin") {
        current.autorisation = "";
      } else if (field === "evening" && current.autorisation === "apres_midi") {
        current.autorisation = "";
      }

      current[field] = value;
      updated[index] = current;
      return updated;
    });
  };

  const handleDureeChange = (index: number, value: string) => {
    setUpdatedPersonnels((prev: any) => {
      const updated = [...prev];
      updated[index].duree = value;
      return updated;
    });
  };

  const [updateAbsence] = useUpdateAbsenceMutation();

  const handleSubmit = () => {
    try {
      updateAbsence({
        _id: absenceDetails._id,
        jour: absenceDetails.jour,
        personnels: updatedPersonnels,
        added_by: absenceDetails.added_by,
      });
      notifySuccess();
      navigate("/gestion-personnel/absence-personnel");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Modifiér Absence Personnels"
            pageTitle="Gestion des Personnels"
          />
          <Col lg={12}>
            <Card>
              <Card.Header className="border-0">
                <Row>
                  <Col className="d-flex justify-content-end">
                    <div className="hstack gap-3">
                      <span className="fs-18 fw-medium">Date: </span>
                      <span className="fs-20 fw-bold">
                        {absenceDetails.jour}
                      </span>
                    </div>
                  </Col>
                  <Col>
                    <div className="hstack gap-3">
                      <span className="fs-18 fw-medium">Période: </span>
                      <span className="fs-20 fw-bold">
                        {filteredWorkingHour?.name!}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col lg={6}>
                      {updatedPersonnels.map((person: any, index: number) => (
                        <Row key={person.personnel}>
                          <Col className="mb-3">
                            {person.personnel.prenom_fr}
                            {person.personnel.nom_fr}
                          </Col>
                          <Col className="mb-3">
                            {person.en_conge === "yes" ? (
                              <span className="badge bg-success">En Congé</span>
                            ) : (
                              <>
                                <Form.Select
                                  value={
                                    person.autorisation === "matin"
                                      ? "Autorisation"
                                      : person.morning
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "morning",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Present">Présent</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </Form.Select>
                                {person.autorisation === "matin" && (
                                  <Form.Select
                                    className="mt-2"
                                    value={person.duree}
                                    onChange={(e) =>
                                      handleDureeChange(index, e.target.value)
                                    }
                                  >
                                    <option value="">
                                      Sélectionner la durée
                                    </option>
                                    <option value="1H">1H</option>
                                    <option value="2H">2H</option>
                                  </Form.Select>
                                )}
                              </>
                            )}
                          </Col>
                          <Col className="mb-3">
                            {person.en_conge === "yes" ? (
                              <span className="badge bg-success">En Congé</span>
                            ) : (
                              <>
                                <Form.Select
                                  value={
                                    person.autorisation === "apres_midi"
                                      ? "Autorisation"
                                      : person.evening
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "evening",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Present">Présent</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </Form.Select>

                                {person.autorisation === "apres_midi" && (
                                  <Form.Select
                                    className="mt-2"
                                    value={person.duree}
                                    onChange={(e) =>
                                      handleDureeChange(index, e.target.value)
                                    }
                                  >
                                    <option value="">
                                      Sélectionner la durée
                                    </option>
                                    <option value="1H">1H</option>
                                    <option value="2H">2H</option>
                                  </Form.Select>
                                )}
                              </>
                            )}
                          </Col>
                        </Row>
                      ))}
                    </Col>
                    <Col>
                      <Lottie
                        lottieRef={lottieRef3}
                        onComplete={() => {
                          lottieRef3.current?.goToAndPlay(5, true);
                        }}
                        animationData={absenceAnimation}
                        loop={false}
                        style={{ width: 600 }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        type="button"
                        variant="success"
                        id="updateAbsence"
                        onClick={handleSubmit}
                      >
                        Modifier
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default ModifierAbsencePersonnel;
