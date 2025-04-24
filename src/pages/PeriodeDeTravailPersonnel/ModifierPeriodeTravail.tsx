import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  PersonnelWorkingDay,
  useUpdatePersonnelWorkingDayMutation,
} from "features/personnelWorkingDay/personnelWorkingDaySlice";
import Flatpickr from "react-flatpickr";

const ModifierPeriodeTravail = () => {
  document.title = "Modifier Période De Travail | ENIGA";

  const location = useLocation();
  const workingDayDetails = location.state;
  const [workingTitle, setWorkingTitle] = useState(workingDayDetails.name);
  const [dateDebut, setDateDebut] = useState(workingDayDetails.period_start);
  const [dateFin, setDateFin] = useState(workingDayDetails.period_end);
  const [debutJourney, setDebutJourney] = useState(
    workingDayDetails.day_start_time
  );
  const [finJourney, setFinJourney] = useState(workingDayDetails.day_end_time);
  const [debutPause, setDebutPause] = useState(
    workingDayDetails.daily_pause_start
  );
  const [finPause, setFinPause] = useState(workingDayDetails.daily_pause_end);

  const [updateWorkingDay] = useUpdatePersonnelWorkingDayMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La période a été modifié avec succès",
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

  const navigate = useNavigate();

  function tog_AllPeriodesTravail() {
    navigate("/parametre-personnel/periode/liste-periode-travail-personnel");
  }

  const initialPersonnelWorkingDay: PersonnelWorkingDay = {
    name: "",
    day_start_time: "",
    day_end_time: "",
    daily_pause_start: "",
    daily_pause_end: "",
    period_start: "",
    period_end: "",
    part_time: "",
  };

  const [periodeTravail, setPeriodeTravail] = useState(
    initialPersonnelWorkingDay
  );

  const {
    name,
    day_start_time,
    day_end_time,
    daily_pause_start,
    daily_pause_end,
    period_start,
    period_end,
  } = periodeTravail;

  const onSubmitWorkingDay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const periodeData = {
        ...periodeTravail,
        _id: workingDayDetails?._id!,
        name: workingTitle,
        day_start_time: debutJourney,
        day_end_time: finJourney,
        daily_pause_start: debutPause,
        daily_pause_end: finPause,
        period_start: dateDebut,
        period_end: dateFin,
        part_time: workingDayDetails.part_time,
      };
      console.log("periode data", periodeData);
      updateWorkingDay(periodeData)
        .then(() => notifySuccess())
        .then(() => setPeriodeTravail(initialPersonnelWorkingDay));
      tog_AllPeriodesTravail();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Modifier Période De Travail"
            pageTitle="Paramètres des personnels"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Form onSubmit={onSubmitWorkingDay}>
                    <Row className="mb-3">
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Title</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="name"
                          id="name"
                          onChange={(e) => setWorkingTitle(e.target.value)}
                          value={workingTitle}
                          className="w-75"
                        />
                      </Col>
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Date Début</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="date"
                          value={dateDebut}
                          onChange={(e) => setDateDebut(e.target.value)}
                          className="w-75 text-center"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Date Fin</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="date"
                          value={dateFin}
                          onChange={(e) => setDateFin(e.target.value)}
                          className="w-75 text-center"
                        />
                      </Col>
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Début Journé</Form.Label>
                      </Col>
                      <Col>
                        <Flatpickr
                          className="form-control w-75 text-center"
                          value={debutJourney}
                          onChange={(selectedDates) => {
                            if (selectedDates.length > 0) {
                              const selectedTime =
                                selectedDates[0].toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              setDebutJourney(selectedTime);
                            }
                          }}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            defaultDate: "08:00",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Fin Journé</Form.Label>
                      </Col>
                      <Col>
                        <Flatpickr
                          className="form-control w-75 text-center"
                          value={finJourney}
                          onChange={(selectedDates) => {
                            if (selectedDates.length > 0) {
                              const selectedTime =
                                selectedDates[0].toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              setFinJourney(selectedTime);
                            }
                          }}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            defaultDate: "18:00",
                          }}
                        />
                      </Col>
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Début Pause</Form.Label>
                      </Col>
                      <Col>
                        <Flatpickr
                          className="form-control w-75 text-center"
                          value={debutPause}
                          onChange={(selectedDates) => {
                            if (selectedDates.length > 0) {
                              const selectedTime =
                                selectedDates[0].toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              setDebutPause(selectedTime);
                            }
                          }}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            defaultDate: "12:00",
                          }}
                        />
                      </Col>
                      <Col lg={2} className="d-flex justify-content-end">
                        <Form.Label>Fin Pause</Form.Label>
                      </Col>
                      <Col>
                        <Flatpickr
                          className="form-control w-75 text-center"
                          value={finPause}
                          onChange={(selectedDates) => {
                            if (selectedDates.length > 0) {
                              const selectedTime =
                                selectedDates[0].toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              setFinPause(selectedTime);
                            }
                          }}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            defaultDate: "14:00",
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex justify-content-start">
                        <Button
                          type="button"
                          variant="danger"
                          id="back"
                          onClick={() => navigate(-1)}
                        >
                          Retour
                        </Button>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <Button type="submit" variant="success" id="update">
                          Modifier
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ModifierPeriodeTravail;
