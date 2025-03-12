import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
  Offcanvas,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";

// import UpdateAbsence from "./UpdateAbsence";
import { French } from "flatpickr/dist/l10n/fr";

import {
  AbsenceEtudiant,
  useAddAbsenceEtudiantMutation,
  useUpdateAbsenceMutation,
} from "features/absenceEtudiant/absenceSlice";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import { formatDate, formatTime } from "helpers/data_time_format";
import { useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation } from "features/teachersPeriods/teachersPeriods";
import { useGetPeriodicSessionsByTeacherV2Mutation } from "features/seance/seance";

const EditAbsence = () => {
  const location = useLocation();
  const absenceDetails = location?.state?.absenceDetails;
  console.log(absenceDetails);
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [getTeacherPeriodicSchedules] =
    useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation();

  const [getTeacherSessions] = useGetPeriodicSessionsByTeacherV2Mutation();

  const [studentTypes, setStudentTypes] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const [sessions, setSessions] = useState<any>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");

  const [studentsList, setStudentsList] = useState<any[]>([]);

  console.log("studentsList", studentsList)

  const [hasProcessed, setHasProcessed] = useState<boolean>(false);

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const { data: EtudiantsByClasseID = [], isSuccess: studentsLoaded } =
    useFetchEtudiantsByIdClasseQuery(selectedClasse);

  useEffect(() => {
    if (studentsLoaded && !hasProcessed) {
      let students = EtudiantsByClasseID.map((student: any) => ({
        student: student,
        presence: true,
      }));

      setStudentsList(students);
      console.log(students);
      setHasProcessed(true);
    }
  }, [EtudiantsByClasseID, hasProcessed, selectedClasse]);

  useEffect(() => {
    if (absenceDetails) {
      setSelectedDate(new Date(absenceDetails.date));
      setSelectedTrimestre(absenceDetails.trimestre === 'S1' ? '1' : '2');
      setSelectedEnseignant(absenceDetails.enseignant);
      setSelectedClasse(absenceDetails.classe);
      setSelectedSession(absenceDetails.seance);
      setStudentsList(
        absenceDetails.etudiants.map((etudiant: any) => ({
          student: etudiant.etudiant,
          presence: etudiant.typeAbsent !== "A",
          typeAbsent: etudiant.typeAbsent
        }))
      );
    }
  }, [absenceDetails]);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
    setSelectedEnseignant("");
    setSessions([]);
    setSelectedClasse("");
    setStudentsList([]);
    setHasProcessed(false);
  };
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'absence a été créée avec succès",
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

  const toggleSemestre = () => {
    setSelectedTrimestre((prev) => (prev === "1" ? "2" : "1"));
    setSelectedDate(null);
    setSelectedEnseignant("");
    setSessions([]);
    setSelectedClasse("");
    setStudentsList([]);
    setHasProcessed(false);
  };

  const handleSelectEnseignant = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(selectedDate);
    if (selectedDate === null) {
      alert("Sélectionnez une date avant de continuer!");
    } else {
      const value = event.target.value;
      setSelectedEnseignant(value);

      let periodicSchedulesRequestData = {
        teacherId: value,
        semester: selectedTrimestre,
      };

      console.log(periodicSchedulesRequestData);

      let schedules = await getTeacherPeriodicSchedules(
        periodicSchedulesRequestData
      ).unwrap();
      const filteredSchedulesIds =
        filterTeacherSchedulesBasedOnSelectedDate(schedules);
      let teacherSessionsRequestData = {
        teacher_id: value,
        emplois_periodiques_ids: filteredSchedulesIds,
      };

      let allTeacherSessions = await getTeacherSessions(
        teacherSessionsRequestData
      ).unwrap();

      const sessions = filterSessionsBasedOnSelectedWeekDay(allTeacherSessions);
      console.log(sessions);
      setSessions(sessions);
      setSelectedClasse("");
      setStudentsList([]);
      setHasProcessed(false);
    }
  };

  const filterTeacherSchedulesBasedOnSelectedDate = (schedules: any) => {
    let date = formatDate(selectedDate);
    console.log(date);
    let filteredSchedulesClassPeriodsIds: any = [];

    for (const schedule of schedules) {
      if (isDateBetween(schedule?.start_date, schedule?.end_date, date)) {
        filteredSchedulesClassPeriodsIds =
          filteredSchedulesClassPeriodsIds.concat(schedule.ids);
      }
    }

    return filteredSchedulesClassPeriodsIds;
  };

  const filterSessionsBasedOnSelectedWeekDay = (allSessions: any) => {
    let sessions = [];
    let weekDay = getWeekDayFromSelectedDate();
    for (const session of allSessions) {
      if (session?.jour! === weekDay) {
        sessions.push(session);
      }
    }
    return sessions;
  };

  const getWeekDayFromSelectedDate = () => {
    const dayIndex = selectedDate?.getDay();
    let day = "";
    switch (dayIndex) {
      case 0:
        day = "Dimanche";
        break;

      case 1:
        day = "Lundi";
        break;

      case 2:
        day = "Mardi";
        break;

      case 3:
        day = "Mercredi";
        break;

      case 4:
        day = "Jeudi";
        break;

      case 5:
        day = "Vendredi";
        break;

      case 6:
        day = "Samedi";
        break;

      default:
        console.log("Invalid day index");
        break;
    }
    return day;
  };

  const isDateBetween = (
    startDate: string,
    endDate: string,
    absenceDate: string
  ) => {
    const [startDay, startMonth, startYear] = startDate.split("-").map(Number);
    const [endDay, endMonth, endYear] = endDate.split("-").map(Number);
    const [absenceDay, absenceMonth, absenceYear] = absenceDate
      .split("-")
      .map(Number);

    const start = new Date(startYear, startMonth - 1, startDay); // months are 0-based
    const end = new Date(endYear, endMonth - 1, endDay);
    const abs = new Date(absenceYear, absenceMonth - 1, absenceDay);
    return abs >= start && abs <= end;
  };

  const handleSelectSession = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedSession(value);
    let selectedSession = sessions.filter(
      (session: any) => session._id === value
    );
    setSelectedClasse(selectedSession[0].classe._id);
    setHasProcessed(false);
  };

  const [modal_AddAbsence, setmodal_AddAbsence] = useState<boolean>(false);
  function tog_AddAbsence() {
    setmodal_AddAbsence(!modal_AddAbsence);
  }

  const [updateAbsence] = useUpdateAbsenceMutation();

  const [absence, setAbsence] = useState<AbsenceEtudiant>(
    absenceDetails || {
      classe: "",
      enseignant: "",
      etudiants: [],
      seance: "",
      date: "",
      trimestre: "",
    }
  );

  const handleStudentTypeChange = (e: any, element: any, index: number) => {
    console.log("element", element)
    let isPresent = !element.presence;
    let absenceType = isPresent ? "P" : "A";

    console.log("absenceType", absenceType)

    setStudentTypes((prevState) => ({
      ...prevState,
      [element.student._id]: absenceType,
    }));

    setAbsence((prevAbsence) => ({
      ...prevAbsence,
      etudiants: prevAbsence.etudiants.map((eleve) =>
        eleve.etudiant === element.student._id
          ? { etudiant: eleve.etudiant, typeAbsent: absenceType }
          : eleve
      ),
    }));

    let updatedStudents = [...studentsList];
    updatedStudents[index].presence = isPresent;
    setStudentsList(updatedStudents);
  };

  const navigate = useNavigate();

  function tog_AllAbsences() {
    navigate("/application-enseignant/lister-absence");
  }
  const onSubmitAbsence = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedAbsence = {
        ...absence,
        _id: absenceDetails._id, // Ensure you're passing the correct ID
        classe: selectedClasse,
        enseignant: selectedEnseignant,
        seance: selectedSession,
        date: formatDate(selectedDate),
        trimestre: selectedTrimestre,
        etudiants: studentsList.map((student) => ({
          etudiant: student.student._id,
          typeAbsent: studentTypes[student.student._id] || student.typeAbsent,
        })),
      };

      console.log("Updating Absence: ", updatedAbsence);

      await updateAbsence(updatedAbsence)
        .then(() => notifySuccess())
        .catch((error) => notifyError(error));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Ajouter Absence" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Form className="create-form" onSubmit={onSubmitAbsence}>
                  <Row>
                    <Col lg={7}>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="trimestre">Semestre</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="SwitchCheck6"
                              checked={selectedTrimestre === "2"}
                              onChange={toggleSemestre}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="SwitchCheck6"
                            >
                              {selectedTrimestre === "1" ? "S1" : "S2"}
                            </label>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="date">Date</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Flatpickr
                            className="form-control flatpickr-input"
                            placeholder="Date d'absence"
                            onChange={handleDateChange}
                            value={selectedDate!}
                            options={{
                              dateFormat: "d M, Y",
                              locale: French,
                              maxDate: new Date(),
                            }}
                            id="date"
                            name="date"
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="enseignant">
                            Enseignant
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="enseignant"
                            id="enseignant"
                            value={selectedEnseignant}
                            onChange={handleSelectEnseignant}
                          >
                            <option value="">Select</option>
                            {AllEnseignants.map((enseignant) => (
                              <option
                                value={enseignant._id}
                                key={enseignant._id}
                              >
                                {enseignant.prenom_fr} {enseignant.nom_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="classe">Séance</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="classe"
                            id="classe"
                            value={selectedSession}
                            onChange={handleSelectSession}
                          >
                            <option value="">Choisir</option>
                            {sessions?.map((session: any) => (
                              <option value={session._id} key={session._id}>
                                {session.matiere.matiere} {session.heure_debut}{" "}
                                - {session.heure_fin} {session.salle.salle}{" "}
                                {session.classe.nom_classe_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                      {/* <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="classe">Classe</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="classe"
                            id="classe"
                            onChange={handleSelectClasse}
                          >
                            <option value="">Choisir</option>
                            {classesList?.map((classe) => (
                              <option value={classe?._id!} key={classe?._id!}>
                                {classe.nom_classe_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="mat">Matière</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="mat"
                            id="mat"
                            onChange={handleSelectMatiere}
                          >
                            <option value="">Choisir</option>
                            {classesList?.map((classe) =>
                              classe.parcours.modules
                                .filter((modul: any) => {
                                  let sem;
                                  if (modul.semestre_module === "S5") {
                                    sem = "1";
                                  }
                                  if (modul.semestre_module === "S6") {
                                    sem = "2";
                                  }
                                  return sem === selectedTrimestre;
                                })
                                .map((matieres: any) =>
                                  matieres.matiere.map((mat: any) => (
                                    <option value={mat?._id!} key={mat?._id!}>
                                      {mat.matiere}
                                    </option>
                                  ))
                                )
                            )}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="date">Heure</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Flatpickr
                            className="form-control"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                              time_24hr: true,
                            }}
                            onChange={handleTimeChange}
                          />
                        </Col>
                      </Row> */}
                    </Col>
                    <Col lg={5}>
                      <Row>
                        <Col lg={4}>
                          <Form.Label>Etudiants</Form.Label>
                        </Col>
                        <Col lg={4}>
                          <Form.Label></Form.Label>
                        </Col>
                      </Row>
                      {studentsList.map((element: any, index: number) => (
                        <Row key={element.student._id}>
                          <Col lg={4} className="mb-1">
                            {element.student.prenom_fr} {element.student.nom_fr}
                          </Col>
                          <Col lg={4} className="mb-1">
                            {/* <select
                              className="form-select text-muted"
                              name="par"
                              id="par"
                              onChange={(e) =>
                                handleStudentTypeChange(e, element.student?._id!)
                              }
                            >
                              <option value="P">Présent(e)</option>
                              <option value="A">Absent(e)</option>
                            </select> */}
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="SwitchCheck6"
                                checked={element.presence}
                                onChange={(e) =>
                                  handleStudentTypeChange(e, element!, index)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="SwitchCheck6"
                              >
                                {element.presence === true
                                  ? "Présent"
                                  : "Absent"}
                              </label>
                            </div>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        onClick={() => {
                          tog_AddAbsence();
                        }}
                        type="submit"
                        variant="success"
                        id="addNew"
                      >
                        Ajouter
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
export default EditAbsence;
