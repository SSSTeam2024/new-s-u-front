import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Card,
    Col,
    Form,
    Button,
} from "react-bootstrap";
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
import { useFetchEtudiantsByClassIdsQuery, useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import { formatDate, formatTime } from "helpers/data_time_format";
import { useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation } from "features/teachersPeriods/teachersPeriods";
import { useGetPeriodicSessionsByTeacherV2Mutation } from "features/seance/seance";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import Select, { OptionsOrGroups } from "react-select";
import { DemandeTirage, useAddDemandeTirageMutation } from "features/demandeTirage/demandeTirageSlice";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";

const AddDemandeTirage = () => {
    const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

    const { data: AllClasse = [] } = useFetchClassesQuery();

    const { data: AllParcours = [] } = useFetchParcoursQuery();

    const user = useSelector((state: RootState) => selectCurrentUser(state));

    const [getTeacherPeriodicSchedules] =
        useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation();

    const [getTeacherSessions] = useGetPeriodicSessionsByTeacherV2Mutation();

    const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

    const [createDemand] = useAddDemandeTirageMutation();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

    const [sessions, setSessions] = useState<any>([]);

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
        const newSemester = formData.semestre === "1" ? "2" : "1";
        setFormData((prev) => ({
            ...prev,
            classes: [],
            enseignant: '',
            docFileBase64String: '',
            docFileExtension: '',
            titre: '',
            nbr_page: '',
            recto_verso: '',
            nbr_copies: '',
            format: '',
            heure_envoi_demande: '',
            date_limite: '',
            heure_limite: '',
            semestre: newSemester,
            couleur: 'Noir',
            note: '',
            matiere: ''
        }))
        setSelectedDate(null);
        setSelectedColumnValues([]);
    };

    const toggleColor = () => {
        const newColor = formData.couleur === "Noir" ? "Couleur" : "Noir";
        setFormData((prev) => ({
            ...prev,
            couleur: newColor
        }))
    }

    const handleSelectEnseignant = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value = event.target.value;
        setSelectedEnseignant(value);
        setFormData((prev) => ({
            ...prev,
            enseignant: value
        }))

        let periodicSchedulesRequestData = {
            teacherId: value,
            semester: formData.semestre,
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

        let classesRequestData = {
            teacherId: value,
            semestre: formData.semestre,
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
        setFormData((prev) => ({
            ...prev,
            matiere: value,
        }))
    };

    const [selectedMatiere, setSelectedMatiere] = useState<string>("");
    const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState<DemandeTirage>({
        classes: [''],
        enseignant: '',
        matiere: '',
        docFileBase64String: '',
        docFileExtension: '',
        titre: '',
        nbr_page: '',
        recto_verso: '',
        nbr_copies: '',
        format: '',
        date_envoi_demande: formatDate(new Date()),
        heure_envoi_demande: '',
        date_limite: '',
        heure_limite: '',
        date_recuperation: '',
        heure_recuperation: '',
        heure_impression: '',
        date_impression: '',
        etat: 'En cours',
        semestre: '1',
        added_by: user?._id,
        couleur: 'Noir',
        note: ''
    });

    const navigate = useNavigate();

    const onChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleDateChange = (selectedDates: Date[]) => {
        const selectedDate = selectedDates[0];
        setSelectedDate(selectedDate);
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            setFormData((prevState) => ({
                ...prevState,
                date_limite: formattedDate,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                date_limite: "",
            }));
        }
    };

    const handleLimite = (selectedDates: any) => {
        const formattedTime = selectedDates[0];

        const heure_minute =
            String(formattedTime.getHours()).padStart(2, "0") +
            ":" +
            String(formattedTime.getMinutes()).padStart(2, "0");

        setFormData((prevState) => ({
            ...prevState,
            heure_limite: heure_minute,
        }));
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = (
            document.getElementById("pdfBase64String") as HTMLFormElement
        ).files[0];
        if (file) {
            const { base64Data, extension } = await convertToBase64(file);

            setFormData({
                ...formData,
                docFileBase64String: base64Data,
                docFileExtension: extension
            });
        }
    };

    function convertToBase64(
        file: File
    ): Promise<{ base64Data: string; extension: string }> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const base64String = fileReader.result as string;
                const [, base64Data] = base64String.split(",");
                const extension = file.name.split(".").pop() ?? "";
                resolve({ base64Data, extension });
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
            fileReader.readAsDataURL(file);
        });
    }

    const onSubmitDemandeTirage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const d = new Date();
            const heure_minute =
                String(d.getHours()).padStart(2, "0") +
                ":" +
                String(d.getMinutes()).padStart(2, "0");

            const demandeTirage = {
                ...formData,
                heure_envoi_demande: heure_minute,
            };
            console.log(demandeTirage)
            createDemand(demandeTirage)
                .then(() => notifySuccess()).then(() => navigate('/service-tirage/liste-tirages'))
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
        setFormData((prev) => ({
            ...prev,
            classes: classIds,
            matiere: ''
        }))
    };

    const checkForFormValidation = () => {
        let notValid = true;
        if (formData.classes.length > 0 && formData.docFileBase64String !== ''
            && formData.enseignant !== '' && formData.format !== '' && formData.date_limite !== ''
            && formData.heure_limite !== '' && formData.matiere !== '' && formData.nbr_copies !== ''
            && formData.nbr_page !== '' && formData.recto_verso !== '' && formData.titre !== '') {
            notValid = false;
        }
        return notValid;
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Ajouter Demande Tirage" pageTitle="Service Tirage" />
                    <Col lg={12}>
                        <Card id="shipmentsList">
                            <Card.Body>
                                <Form className="create-form" onSubmit={onSubmitDemandeTirage}>
                                    <Row>
                                        <Col lg={6}>
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
                                                            checked={formData.semestre === "2"}
                                                            onChange={toggleSemestre}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="SwitchCheck6"
                                                        >
                                                            {formData.semestre === "1" ? "S1" : "S2"}
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="titre">Titre</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Form.Control
                                                        type="text"
                                                        id="titre"
                                                        placeholder=""
                                                        onChange={onChange}
                                                        value={formData.titre}
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
                                                        value={formData.enseignant}
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
                                                    <Form.Label htmlFor="classe">Groupe(s)</Form.Label>
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
                                                        value={formData.matiere}
                                                    >
                                                        <option value="">Choisir</option>
                                                        {filteredSubjects?.map((subject: any) => (
                                                            <option value={subject?.matiere! + " " + subject?.types[0].type} key={subject?.matiere!}>
                                                                {subject?.matiere!}{" "}
                                                                {subject?.types[0].type}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="recto_verso">Type d'impression</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <select
                                                        className="form-select text-muted"
                                                        name="recto_verso"
                                                        id="recto_verso"
                                                        onChange={onChange}
                                                        value={formData.recto_verso}
                                                    >
                                                        <option value="">Choisir</option>
                                                        <option value="Recto">Recto
                                                        </option>
                                                        <option value="Recto Verso">Recto Verso

                                                        </option>

                                                    </select>
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="format">Format</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <select
                                                        className="form-select text-muted"
                                                        name="format"
                                                        id="format"
                                                        onChange={onChange}
                                                        value={formData.format}
                                                    >
                                                        <option value="">Choisir</option>
                                                        <option value="A5">A5
                                                        </option>
                                                        <option value="A4">A4
                                                        </option>
                                                        <option value="A3">A3
                                                        </option>
                                                        <option value="A2">A2
                                                        </option>
                                                        <option value="A1">A1
                                                        </option>

                                                    </select>
                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col lg={6}>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="date_limite">
                                                        Date et Heure Limite
                                                    </Form.Label>
                                                </Col>
                                                <Col lg={8} className="d-flex">
                                                    <Flatpickr
                                                        value={selectedDate!}
                                                        onChange={handleDateChange}
                                                        className="form-control flatpickr-input"
                                                        style={{ marginRight: '10px' }}
                                                        placeholder="Choisir date"
                                                        options={{
                                                            dateFormat: "d M, Y",
                                                            minDate: new Date()

                                                        }}
                                                        id="date_limite"
                                                    />
                                                    <Flatpickr
                                                        className="form-control"
                                                        id="heure_limite"
                                                        placeholder="--:--"
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: "H:i",
                                                            time_24hr: true,
                                                            onChange: handleLimite,
                                                        }}
                                                        value={formData.heure_limite}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="note">Note</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    {/* <Form.Control
                                                        type="text"
                                                        id="note"
                                                        placeholder=""
                                                        onChange={onChange}
                                                        value={formData.note}
                                                    /> */}
                                                    <textarea onChange={onChange} className="form-control" id="note" rows={4} value={formData.note}></textarea>
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="couleur">Couleur</Form.Label>
                                                </Col>
                                                <Col lg={3}>
                                                    {/* <select
                                                        className="form-select text-muted"
                                                        name="couleur"
                                                        id="couleur"
                                                        onChange={onChange}
                                                        value={formData.couleur}
                                                    >
                                                        <option value="">Choisir</option>
                                                        <option value="Noir">Noir
                                                        </option>
                                                        <option value="Couleur">Couleur
                                                        </option>

                                                    </select> */}
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="SwitchCheck6"
                                                            checked={formData.couleur === "Couleur"}
                                                            onChange={toggleColor}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="SwitchCheck6"
                                                        >
                                                            {formData.couleur}
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="nbr_copies">Nombre de copies</Form.Label>
                                                </Col>
                                                <Col lg={2}>
                                                    <Form.Control
                                                        type="number"
                                                        id="nbr_copies"
                                                        placeholder=""
                                                        onChange={onChange}
                                                        value={formData.nbr_copies}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="nbr_copies">Nombre de copies</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Form.Control
                                                        type="number"
                                                        id="nbr_copies"
                                                        placeholder=""
                                                        onChange={onChange}
                                                        value={formData.nbr_copies}
                                                    />
                                                </Col>
                                            </Row> */}
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="title">Document</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        name="pdfBase64String"
                                                        id="pdfBase64String"
                                                        accept="pdf*"
                                                        multiple={true}
                                                        onChange={(e) => handleFileUpload(e)}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="mb-4">
                                                <Col lg={3}>
                                                    <Form.Label htmlFor="nbr_page">Nombre de pages</Form.Label>
                                                </Col>
                                                <Col lg={8}>
                                                    <Form.Control
                                                        type="number"
                                                        id="nbr_page"
                                                        placeholder=""
                                                        onChange={onChange}
                                                        value={formData.nbr_page}
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="hstack gap-2 justify-content-end">
                                            <Button
                                                type="submit"
                                                variant="success"
                                                id="addNew"
                                                disabled={checkForFormValidation()}
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
