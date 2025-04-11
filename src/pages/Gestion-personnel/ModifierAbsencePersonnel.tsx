import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetchPersonnelWorkingDayQuery } from "features/personnelWorkingDay/personnelWorkingDaySlice";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import absenceAnimation from "../../assets/images/Animation - 1742900291397.json";
import { AbsencePersonnel } from "features/absencePersonnel/absencePersonnel";

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

  const start: any = new Date(filteredWorkingHour?.period_start!);
  const end: any = new Date(filteredWorkingHour?.period_end!);
  const diffInDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

  let periodType = "Temps Régulier";

  if (diffInDays === 30) {
    periodType = "Calendrier Ramadan";
  } else if (diffInDays === 62) {
    periodType = "Séance unique";
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Modifier Absence Personnels"
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
                      {absenceDetails?.personnels.map(
                        (element: any, index: number) => {
                          const { morning, evening, fullDay } = element;

                          const getDisplayElement = (period: string) => {
                            if (period === "Present") {
                              return (
                                <select>
                                  <option value="">Choisir ...</option>
                                  <option value="Present">Présent</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </select>
                              );
                            } else if (period === "Absent") {
                              return (
                                <select>
                                  <option value="">Choisir ...</option>
                                  <option value="Present">Présent</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </select>
                              );
                            } else if (period === "Autorisation") {
                              return (
                                <select>
                                  <option value="">Choisir ...</option>
                                  <option value="Present">Présent</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Autorisation">
                                    Autorisation
                                  </option>
                                </select>
                              );
                            } else if (period === "En congé") {
                              return (
                                <span className="text-primary">En Congé</span>
                              );
                            }
                          };

                          const displayElementMorning =
                            getDisplayElement(morning);
                          const displayElementEvening =
                            getDisplayElement(evening);

                          const displayElement = getDisplayElement(fullDay);

                          return filteredWorkingHour?.daily_pause_start ===
                            "--:--" &&
                            filteredWorkingHour?.daily_pause_end === "--:--" ? (
                            <Row
                              key={element?.personnel?._id!}
                              className="mb-1"
                            >
                              <Col lg={6}>
                                {element.personnel.prenom_fr}{" "}
                                {element.personnel.nom_fr}
                              </Col>
                              <Col>{displayElement}</Col>
                            </Row>
                          ) : (
                            <Row
                              key={element?.personnel?._id!}
                              className="mb-1"
                            >
                              <Col lg={6}>
                                {element.personnel.prenom_fr}{" "}
                                {element.personnel.nom_fr}
                              </Col>
                              <Col>{displayElementMorning}</Col>
                              <Col>{displayElementEvening}</Col>
                            </Row>
                          );
                        }
                      )}
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
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
                      <Button type="submit" variant="success" id="addNew">
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
