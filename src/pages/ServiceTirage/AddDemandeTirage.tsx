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
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";

import {
    Classe,
    useFetchClassesByTeacherMutation,
    useFetchClassesQuery,
} from "features/classe/classe";
import {
    AbsenceEtudiant,
    useAddAbsenceEtudiantMutation,
} from "features/absenceEtudiant/absenceSlice";
import { useFetchParcoursQuery } from "features/parcours/parcours";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import { formatDate, formatTime } from "helpers/data_time_format";
import { useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation } from "features/teachersPeriods/teachersPeriods";
import { useGetPeriodicSessionsByTeacherV2Mutation } from "features/seance/seance";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import Select, { OptionsOrGroups } from "react-select";

const AddDemandeTirage = () => {
    const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

    const { data: AllClasse = [] } = useFetchClassesQuery();

    const { data: AllParcours = [] } = useFetchParcoursQuery();

    const [getTeacherPeriodicSchedules] =
        useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation();

    const [getTeacherSessions] = useGetPeriodicSessionsByTeacherV2Mutation();

    const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

    const [studentTypes, setStudentTypes] = useState<{ [key: string]: string }>(
        {}
    );
    const [classesList, setClassesList] = useState<Classe[]>();
    const [showObservation, setShowObservation] = useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [max_date, setMaxDate] = useState<Date | undefined>(undefined);
    const [min_date, setMinDate] = useState<Date | undefined>(undefined);

    const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
    const [selectedSemestre, setSelectedSemestre] = useState<string>("1");

    const [sessions, setSessions] = useState<any>([]);
    const [selectedSession, setSelectedSession] = useState<string>("");

    const [studentsList, setStudentsList] = useState<any[]>([]);

    const [hasProcessed, setHasProcessed] = useState<boolean>(false);
    const [hasProcessed2, setHasProcessed2] = useState<boolean>(false);

    const [selectedClasse, setSelectedClasse] = useState<string>("");

    const { data: EtudiantsByClasseID = [], isSuccess: studentsLoaded } =
        useFetchEtudiantsByIdClasseQuery(selectedClasse);

    const { data: scheduleParams = [], isSuccess: paramsLoaded } = useFetchTimeTableParamsQuery();

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

        if (paramsLoaded && !hasProcessed2) {
            configureMinAndMaxCalendarDates('1');
            setHasProcessed2(true);
        }
    }, [EtudiantsByClasseID, hasProcessed, selectedClasse, scheduleParams, hasProcessed2]);

    const configureMinAndMaxCalendarDates = (semester: string) => {
        if (semester === '1') {
            const [day1, month1, year1] = scheduleParams[0].semestre1_start.split('-').map(Number);
            const semesterOneStartDate = new Date(year1, month1 - 1, day1);
            setMinDate(semesterOneStartDate);

            const currentDate = new Date();
            const [day2, month2, year2] = scheduleParams[0].semestre1_end.split('-').map(Number);
            const semesterOneEndDate = new Date(year2, month2 - 1, day2);

            if (semesterOneEndDate > currentDate) {
                setMaxDate(currentDate);
            } else {
                setMaxDate(semesterOneEndDate);
            }
        } else {
            const [day1, month1, year1] = scheduleParams[0].semestre2_start.split('-').map(Number);
            const semesterTwoStartDate = new Date(year1, month1 - 1, day1);
            setMinDate(semesterTwoStartDate);

            const currentDate = new Date();
            const [day2, month2, year2] = scheduleParams[0].semestre2_end.split('-').map(Number);
            const semesterTwoEndDate = new Date(year2, month2 - 1, day2);

            if (semesterTwoEndDate > currentDate) {
                setMaxDate(currentDate);
            } else {
                setMaxDate(semesterTwoEndDate);
            }
        }
    }

    const handleDateChange = (selectedDates: Date[]) => {
        setSelectedDate(selectedDates[0]);
        setSelectedEnseignant("");
        setSessions([]);
        setSelectedClasse("");
        setStudentsList([]);
        setHasProcessed(false);
    };

    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    const handleTimeChange = (selectedDates: Date[]) => {
        const time = selectedDates[0];
        setSelectedTime(time);
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

    const [selectedEleve, setSelectedEleve] = useState<string>("");

    const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedEleve(value);
    };

    const handleSelectTrimestre = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;
        setSelectedSemestre(value);
    };

    const toggleSemestre = () => {
        const newSemester = selectedSemestre === "1" ? "2" : "1";
        configureMinAndMaxCalendarDates(newSemester);
        setSelectedSemestre(newSemester);
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

        const value = event.target.value;
        setSelectedEnseignant(value);

        let periodicSchedulesRequestData = {
            teacherId: value,
            semester: selectedSemestre,
        };

        console.log(periodicSchedulesRequestData);

        let schedules = await getTeacherPeriodicSchedules(
            periodicSchedulesRequestData
        ).unwrap();
        console.log("schedules", schedules);

        const filteredSchedulesIds =
            joinTeacherSchedules(schedules);

        console.log("filteredSchedulesIds", filteredSchedulesIds);

        let teacherSessionsRequestData = {
            teacher_id: value,
            emplois_periodiques_ids: filteredSchedulesIds,
        };

        let allTeacherSessions = await getTeacherSessions(
            teacherSessionsRequestData
        ).unwrap();

        console.log("allTeacherSessions", allTeacherSessions);

        const sessions = filterSessionsBasedOnPeriodicScheduleState(allTeacherSessions);
        console.log(sessions);
        setSessions(sessions);
        setSelectedClasse("");
        setStudentsList([]);
        setHasProcessed(false);

        let classesRequestData = {
            teacherId: value,
            semestre: selectedSemestre,
        };

        let classes = await getClassesByTeacherId(classesRequestData).unwrap();

        console.log("classes", classes);

        let classOptions = classes.map((classe: any) => ({
            value: classe?._id!,
            label: classe?.nom_classe_fr!,
        }));

        setOptionColumnsTable(classOptions);
        setSelectedColumnValues([]);
        setFilteredSubjects([]);
        setSelectedMatiere('');

    };

    const joinTeacherSchedules = (schedules: any) => {

        let joinedSchedulesClassPeriodsIds: any = [];

        for (const schedule of schedules) {

            joinedSchedulesClassPeriodsIds =
                joinedSchedulesClassPeriodsIds.concat(schedule.ids);

        }

        return joinedSchedulesClassPeriodsIds;
    };

    const filterSessionsBasedOnPeriodicScheduleState = (allSessions: any) => {
        let sessions = [];
        for (const session of allSessions) {
            if (session?.emploiPeriodique_id?.etat! === "En élaboration") {
                sessions.push(session);
            }
        }
        return sessions;
    };

    const handleSelectSubject = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;
        setSelectedMatiere(value);
    };

    const [selectedMatiere, setSelectedMatiere] = useState<string>("");
    const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

    const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedMatiere(value);
    };

    const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedClasse(value);
    };

    const [selectedType, setSelectedType] = useState<string>("");

    const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedType(value);
    };

    const [modal_AddAbsence, setmodal_AddAbsence] = useState<boolean>(false);
    function tog_AddAbsence() {
        setmodal_AddAbsence(!modal_AddAbsence);
    }

    const [modal_UpdateAbsence, setmodal_UpdateAbsence] =
        useState<boolean>(false);
    function tog_UpdateAbsence() {
        setmodal_UpdateAbsence(!modal_UpdateAbsence);
    }

    const [createAbsence] = useAddAbsenceEtudiantMutation();

    const initialAbsence: AbsenceEtudiant = {
        classe: "",
        enseignant: "",
        etudiants: [],
        seance: "",
        date: "",
        trimestre: "",
    };

    const [absence, setAbsence] = useState(initialAbsence);

    const { classe, enseignant, etudiants, seance, date, trimestre } = absence;

    const handleStudentTypeChange = (e: any, element: any, index: number) => {
        let value = "";
        let presenceState = false;
        if (element.presence === true) {
            value = "A";
        } else {
            presenceState = true;
            value = "P";
        }

        setStudentTypes((prevState) => ({
            ...prevState,
            [element.student._id]: value,
        }));

        setAbsence((prevAbsence) => {
            const updatedEleves = prevAbsence.etudiants.filter(
                (eleve) => eleve.etudiant !== element.student._id
            );

            return {
                ...prevAbsence,
                eleves: [
                    ...updatedEleves,
                    { etudiant: element.student._id, typeAbsent: value },
                ],
            };
        });

        let studentsListRef = [...studentsList];
        studentsListRef[index].presence = presenceState;
        setStudentsList(studentsListRef);
    };

    const navigate = useNavigate();

    function tog_AllAbsences() {
        navigate("/application-enseignant/lister-absence");
    }
    const onSubmitAbsence = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const elevesWithTypes = EtudiantsByClasseID?.map((eleve) => ({
                etudiant: eleve?._id!,
                typeAbsent: studentTypes[eleve?._id!] || "P",
            }));

            const absenceData = {
                ...absence,
                classe: selectedClasse,
                etudiants: elevesWithTypes,
                date: formatDate(selectedDate),
                trimestre: selectedSemestre,
                enseignant: selectedEnseignant,
                seance: selectedSession,
            };
            console.log(absenceData);
            createAbsence(absenceData)
                .then(() => notifySuccess())
                .then(() => setAbsence(initialAbsence));
            tog_AllAbsences();
        } catch (error) {
            notifyError(error);
        }
    };

    const [optionColumnsTable, setOptionColumnsTable] = useState<any>(null);
    const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

    const handleSelectValueColumnChange = (selectedOptions: any) => {
        const classIds = selectedOptions.map((option: any) => option.value);
        console.log(classIds);

        const uniqueSessions = sessions.filter((session: any, index: number, self: any) =>
            index === self.findIndex((s: any) => s.matiere.matiere === session.matiere.matiere && s.matiere.types[0].type === session.matiere.types[0].type)
        );

        console.log(uniqueSessions);

        let fileteredSubjects = [];

        for (const session of uniqueSessions) {
            let subjectCounterExistence = 0;
            for (const classId of classIds) {
                let classe = AllClasse.filter(c => c._id === classId)[0];
                let modules = classe.parcours.modules.filter((m: any) => m.semestre_module === session.matiere.semestre);
                if (modules.length > 0) {
                    const subjects = modules.map((module: any) => {
                        let subjectsResult = module.matiere.filter((m: any) => m.matiere === session.matiere.matiere);
                        return subjectsResult;
                    })
                    const validSubjects = subjects.filter((subjectArray: any) => subjectArray.length > 0);
                    if (validSubjects.length > 0) {
                        subjectCounterExistence++;
                    }
                }
            }
            if (subjectCounterExistence === classIds.length && subjectCounterExistence > 0) {
                fileteredSubjects.push(session.matiere);
            }
        }

        console.log("fileteredSubjects", fileteredSubjects);
        setFilteredSubjects(fileteredSubjects)
        setSelectedMatiere('');
        setSelectedColumnValues(selectedOptions);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Ajouter Demande Tirage" pageTitle="Service Tirage" />
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
                                                            checked={selectedSemestre === "2"}
                                                            onChange={toggleSemestre}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="SwitchCheck6"
                                                        >
                                                            {selectedSemestre === "1" ? "S1" : "S2"}
                                                        </label>
                                                    </div>
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
                                                                value={enseignant?._id!}
                                                                key={enseignant?._id!}
                                                            >
                                                                {enseignant.prenom_fr} {enseignant.nom_fr}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="classe">Classe(s)</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        isMulti
                                                        options={optionColumnsTable}
                                                        value={selectedColumnValues}
                                                        onChange={handleSelectValueColumnChange}
                                                        placeholder="Choisir..."
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="classe">Matière</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <select
                                                        className="form-select text-muted"
                                                        name="classe"
                                                        id="classe"
                                                        onChange={handleSelectSubject}
                                                        value={selectedMatiere}
                                                    >
                                                        <option value="">Choisir</option>
                                                        {filteredSubjects?.map((subject: any) => (
                                                            <option value={subject?.matiere!} key={subject?.matiere!}>
                                                                {subject?.matiere!}{" "}
                                                                {subject?.types[0].type}
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
export default AddDemandeTirage;
