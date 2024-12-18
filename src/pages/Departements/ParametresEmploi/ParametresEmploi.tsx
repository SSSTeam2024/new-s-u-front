import {
    useAddTimeTableParamsMutation,
    useFetchTimeTableParamsQuery,
    useUpdateTimeTableParamsMutation,
  } from "features/timeTableParams/timeTableParams";
  import { update } from "lodash";
  import { format } from "date-fns";
  import React, { useEffect, useState } from "react";
  import { Button, Col, Container, Form, Row } from "react-bootstrap";
  import Flatpickr from "react-flatpickr";
  import Swal from "sweetalert2";
  
  const ParametresEmploi = () => {
    document.title = " Parametres Emplois | Application Smart Institute";
  
    const [formData, setFormData] = useState({
      _id: "",
      day_start_time: "",
      day_end_time: "",
      daily_pause_start: "",
      daily_pause_end: "",
      semestre1_end: "",
      semestre1_start: "",
      semestre2_end: "",
      semestre2_start: "",
    });
  
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
  
    const { data: timeTableParams = [], isLoading: isParamsLoading } =
      useFetchTimeTableParamsQuery();
  
    console.log(isParamsLoading);
  
    console.log("fetching timeTableParams", timeTableParams);
  
    const [createTimeTableParams] = useAddTimeTableParamsMutation();
    const [editTimeTableParams] = useUpdateTimeTableParamsMutation();
  
    const handleDebutJournee = (selectedDates: any) => {
      const formattedTime = selectedDates[0];
  
      console.log(
        String(formattedTime.getHours()).padStart(2, "0") +
          ":" +
          String(formattedTime.getMinutes()).padStart(2, "0")
      );
  
      const dj =
        String(formattedTime.getHours()).padStart(2, "0") +
        ":" +
        String(formattedTime.getMinutes()).padStart(2, "0");
  
      setFormData((prevState) => ({
        ...prevState,
        day_start_time: dj,
      }));
    };
  
    const handleFinJournee = (selectedDates: any) => {
      const formattedTime = selectedDates[0];
  
      console.log(
        String(formattedTime.getHours()).padStart(2, "0") +
          ":" +
          String(formattedTime.getMinutes()).padStart(2, "0")
      );
  
      const fj =
        String(formattedTime.getHours()).padStart(2, "0") +
        ":" +
        String(formattedTime.getMinutes()).padStart(2, "0");
  
      setFormData((prevState) => ({
        ...prevState,
        day_end_time: fj,
      }));
    };
  
    const handleDebutPause = (selectedDates: any) => {
      const formattedTime = selectedDates[0];
  
      console.log(
        String(formattedTime.getHours()).padStart(2, "0") +
          ":" +
          String(formattedTime.getMinutes()).padStart(2, "0")
      );
  
      const dp =
        String(formattedTime.getHours()).padStart(2, "0") +
        ":" +
        String(formattedTime.getMinutes()).padStart(2, "0");
  
      setFormData((prevState) => ({
        ...prevState,
        daily_pause_start: dp,
      }));
    };
  
    const handleFinPause = (selectedDates: any) => {
      const formattedTime = selectedDates[0];
      console.log(
        String(formattedTime.getHours()).padStart(2, "0") +
          ":" +
          String(formattedTime.getMinutes()).padStart(2, "0")
      );
  
      const fp =
        String(formattedTime.getHours()).padStart(2, "0") +
        ":" +
        String(formattedTime.getMinutes()).padStart(2, "0");
      setFormData((prevState) => ({
        ...prevState,
        daily_pause_end: fp,
      }));
    };
  
    const onChangeBreakTime = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevState) => ({
        ...prevState,
        between_sessions_brake: e.target.value,
      }));
    };
  
    const notify = () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Paramètres ont été modifiés avec succés",
        showConfirmButton: false,
        timer: 2000,
      });
    };
    const errorAlert = (message: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 2000,
      });
    };
    const saveParams = async () => {
      try {
        console.log(formData);
  
        await createTimeTableParams(formData).unwrap();
        notify();
      } catch (error: any) {
        if (error.status === 400) {
          errorAlert("La valeur doit être unique.");
        } else {
          errorAlert("La valeur doit être unique. Veuillez réessayer.");
        }
      }
    };
    const updateParams = async () => {
      try {
        console.log(formData);
  
        await editTimeTableParams(formData).unwrap();
        notify();
      } catch (error: any) {
        if (error.status === 400) {
          errorAlert("La valeur doit être unique.");
        } else {
          errorAlert("La valeur doit être unique. Veuillez réessayer.");
        }
      }
    };
  
    useEffect(() => {
      if (timeTableParams.length > 0) {
        console.log(timeTableParams);
        setCanUpdate(true);
        setFormData({
          _id: timeTableParams[0]?._id!,
          day_start_time: timeTableParams[0]?.day_start_time!,
          day_end_time: timeTableParams[0]?.day_end_time!,
          daily_pause_start: timeTableParams[0]?.daily_pause_start!,
          daily_pause_end: timeTableParams[0]?.daily_pause_end!,
  
          semestre1_start: timeTableParams[0]?.semestre1_start!,
          semestre1_end: timeTableParams[0]?.semestre1_end!,
          semestre2_start: timeTableParams[0]?.semestre2_start!,
          semestre2_end: timeTableParams[0]?.semestre2_end!,
        });
      }
    }, [timeTableParams]);
    const [selectedDateDebutS1, setSelectedDateDebutS1] = useState<Date | null>(
      null
    );
    const [selectedDateFinS1, setSelectedDateFinS1] = useState<Date | null>(null);
  
    const [selectedDateDebutS2, setSelectedDateDebutS2] = useState<Date | null>(
      null
    );
    const [selectedDateFinS2, setSelectedDateFinS2] = useState<Date | null>(null);
    // change date debut s1
    const handleDateChangeDebutS1 = (selectedDates: Date[]) => {
      const selectedDate = selectedDates[0];
      setSelectedDateDebutS1(selectedDate);
      if (selectedDate) {
        const formattedDate = format(selectedDate, "dd-MM-yyyy");
        setFormData((prevState) => ({
          ...prevState,
          semestre1_start: formattedDate,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          semestre1_start: "",
        }));
      }
    };
    // change date Fin s1
    const handleDateChangeFinS1 = (selectedDates: Date[]) => {
      const selectedDate = selectedDates[0];
      setSelectedDateFinS1(selectedDate);
      if (selectedDate) {
        const formattedDate = format(selectedDate, "dd-MM-yyyy");
        setFormData((prevState) => ({
          ...prevState,
          semestre1_end: formattedDate,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          semestre1_end: "",
        }));
      }
    };
  
    // change date debut s2
    const handleDateChangeDebutS2 = (selectedDates: Date[]) => {
      const selectedDate = selectedDates[0];
      setSelectedDateDebutS2(selectedDate);
      if (selectedDate) {
        const formattedDate = format(selectedDate, "dd-MM-yyyy");
        setFormData((prevState) => ({
          ...prevState,
          semestre2_start: formattedDate,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          semestre2_start: "",
        }));
      }
    };
    // change date Fin s2
    const handleDateChangeFinS2 = (selectedDates: Date[]) => {
      const selectedDate = selectedDates[0];
      setSelectedDateFinS2(selectedDate);
      if (selectedDate) {
        const formattedDate = format(selectedDate, "dd-MM-yyyy");
        setFormData((prevState) => ({
          ...prevState,
          semestre2_end: formattedDate,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          semestre2_end: "",
        }));
      }
    };
  
    const convertStringToDate = (dateStr: any) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      // Months are 0-indexed in JavaScript Date (0 = January, 1 = February, etc.)
      return new Date(year, month - 1, day);
    };
  
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Row>Paramètres des emplois de temps</Row>
            <Row>
              <Col lg={12}>
                <Form className="tablelist-form">
                  <Row className="gy-2 mb-2">
                    {" "}
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="createdate-field">
                          Début Journé
                        </Form.Label>
                        <Flatpickr
                          className="form-control"
                          id="day_start_time"
                          placeholder="--:--"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                            onChange: handleDebutJournee,
                          }}
                          value={formData.day_start_time}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="deliverydate-field">
                          Fin Journé
                        </Form.Label>
                        <Flatpickr
                          className="form-control"
                          id="day_end_time"
                          placeholder="--:--"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                            onChange: handleFinJournee,
                          }}
                          value={formData.day_end_time}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="createdate-field">
                          Début Pause
                        </Form.Label>
                        <Flatpickr
                          className="form-control"
                          id="daily_pause_start"
                          placeholder="--:--"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                            onChange: handleDebutPause,
                          }}
                          value={formData.daily_pause_start}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="deliverydate-field">
                          Fin Pause
                        </Form.Label>
                        <Flatpickr
                          className="form-control"
                          id="daily_pause_end"
                          placeholder="--:--"
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: true,
                            onChange: handleFinPause,
                          }}
                          value={formData.daily_pause_end}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3 mt-4 fs-20">
                    <Col lg={6} className="text-center">
                      Semestre 1
                    </Col>
                    <Col lg={6} className="text-center">
                      Semestre 2
                    </Col>
                  </Row>
                  <Row className="gy-2 mb-2">
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="semestre1_start">
                          Date Début
                        </Form.Label>
  
                        <Flatpickr
                          value={convertStringToDate(formData.semestre1_start!)}
                          onChange={handleDateChangeDebutS1}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          id="semestre1_start"
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="semestre1_end">Date Fin</Form.Label>
                        <Flatpickr
                          value={convertStringToDate(formData.semestre1_end!)}
                          onChange={handleDateChangeFinS1}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          id="semestre1_end"
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="semestre2_start">
                          Date Début
                        </Form.Label>
                        <Flatpickr
                          value={convertStringToDate(formData.semestre2_start!)}
                          onChange={handleDateChangeDebutS2}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          id="semestre2_start"
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div>
                        <Form.Label htmlFor="semestre2_end">Date Fin</Form.Label>
                        <Flatpickr
                          value={convertStringToDate(formData.semestre2_end!)}
                          onChange={handleDateChangeFinS2}
                          className="form-control flatpickr-input"
                          placeholder="Sélectionner date"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          id="semestre2_end"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="modal-footer">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        // onClick={() => {
                        //   tog_retourParametres();
                        // }}
                      >
                        Retour
                      </Button>
                      {isParamsLoading === true ? (
                        <></>
                      ) : (
                        <>
                          {canUpdate === false ? (
                            <Button
                              variant="secondary"
                              id="add-btn"
                              onClick={() => {
                                saveParams();
                              }}
                            >
                              Ajouter
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              id="add-btn"
                              onClick={() => {
                                updateParams();
                              }}
                            >
                              Modifier
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  };
  
  export default ParametresEmploi;