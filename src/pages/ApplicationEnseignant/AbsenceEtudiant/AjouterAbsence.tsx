import React, { useState } from "react";
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

// import UpdateAbsence from "./UpdateAbsence";
import { French } from "flatpickr/dist/l10n/fr";
// import { formatDate, formatTime } from "helpers/data_time_format";
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

const AjouterAbsence = () => {
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const { data: AllClasse = [] } = useFetchClassesQuery();

  const { data: AllParcours = [] } = useFetchParcoursQuery();
  const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

  const [studentTypes, setStudentTypes] = useState<{ [key: string]: string }>(
    {}
  );
  const [classesList, setClassesList] = useState<Classe[]>();
  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };
  console.log("AllParcours", AllParcours);
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

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  //   const handleSelectClasse = async (
  //     event: React.ChangeEvent<HTMLSelectElement>
  //   ) => {
  //     const value = event.target.value;
  //     const result = await fetchEtudiantsByClasseId(value).unwrap();
  //     setStudents(result);
  //     setSelectedClasse(value);
  //   };

  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const handleSelectEnseignant = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);

    let classesRequestData = {
      teacherId: value,
      semestre: selectedTrimestre,
    };

    let classes = await getClassesByTeacherId(classesRequestData).unwrap();
    console.log("classes", classes);
    setClassesList(classes);
  };

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
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
    matiere: "",
    enseignant: "",
    etudiants: [],
    heure: "",
    date: "",
    trimestre: "",
  };

  const [absence, setAbsence] = useState(initialAbsence);

  const { classe, matiere, enseignant, etudiants, heure, date, trimestre } =
    absence;

  const handleStudentTypeChange = (e: any, studentId: string) => {
    const { value } = e.target;

    // Update the studentTypes state
    setStudentTypes((prevState) => ({
      ...prevState,
      [studentId]: value,
    }));

    // Update the eleves array in the absence state
    setAbsence((prevAbsence) => {
      // Filter out any existing entry for the student
      const updatedEleves = prevAbsence.etudiants.filter(
        (eleve) => eleve.etudiant !== studentId
      );

      return {
        ...prevAbsence,
        eleves: [
          ...updatedEleves,
          { etudiant: studentId, typeAbsent: value }, // Add updated student data
        ],
      };
    });
  };

  //   const onChangeAbsence = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     setAbsence((prevState) => ({
  //       ...prevState,
  //       [e.target.id]: e.target.value,
  //     }));
  //   };
  const navigate = useNavigate();

  function tog_AllAbsences() {
    navigate("/absence");
  }
  const onSubmitAbsence = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Create elevesWithTypes with the correct structure (array of objects)
      const elevesWithTypes = students.map((eleve) => ({
        eleve: eleve._id,
        typeAbsent: studentTypes[eleve._id] || "P", // Default to "P" if no type selected
      }));

      const absenceData = {
        ...absence,
        classe: selectedClasse,
        etudiants: elevesWithTypes, // Ensure this is an array of objects, not a string
        date: selectedDate,
        matiere: "",
        heure: selectedTime,
        trimestre: selectedTrimestre,
        enseignant: selectedEnseignant,
      };
      console.log(absenceData);
      //   Submit to the backend
      //   createAbsence(absenceData)
      //     .then(() => notifySuccess())
      //     .then(() => setAbsence(initialAbsence));
      tog_AllAbsences();
    } catch (error) {
      notifyError(error); // Handle errors
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
                    <Col lg={5}>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="trimestre">Semestre</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="trimestre"
                            id="trimestre"
                            onChange={handleSelectTrimestre}
                          >
                            <option value="">Choisir</option>
                            <option value="1">S1</option>
                            <option value="2">S2</option>
                          </select>
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
                          <Form.Label htmlFor="classe">Classe</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="classe"
                            id="classe"
                            // onChange={handleSelectClasse}
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
                      {/* <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="description">Matière</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="eleve"
                            id="eleve"
                            onChange={handleSelectMatiere}
                          >
                            <option value="">Choisir</option>
                            {allMatieresByEtudiantId.map((matiere) =>
                              matiere.matieres.map((m) => (
                                <option value={m.nom_matiere} key={m?._id!}>
                                  {m.nom_matiere}
                                </option>
                              ))
                            )}
                          </select>
                        </Col>
                      </Row> */}

                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="date">Date</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Flatpickr
                            className="form-control flatpickr-input"
                            placeholder="Date d'absence"
                            onChange={handleDateChange}
                            options={{
                              dateFormat: "d M, Y",
                              locale: French,
                            }}
                            id="date"
                            name="date"
                          />
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
                      </Row>
                    </Col>
                    <Col lg={7}>
                      <Row>
                        <Col lg={3}>
                          <Form.Label>Elève</Form.Label>
                        </Col>
                        <Col lg={4}>
                          <Form.Label>Type</Form.Label>
                        </Col>
                      </Row>
                      {students.map((eleve) => (
                        <Row key={eleve._id}>
                          <Col lg={3} className="mb-1">
                            {eleve.prenom} {eleve.nom}
                          </Col>
                          <Col lg={4} className="mb-1">
                            <select
                              className="form-select text-muted"
                              name="par"
                              id="par"
                              onChange={(e) =>
                                handleStudentTypeChange(e, eleve._id)
                              } // Bind onChange event
                            >
                              <option value="P">Présent(e)</option>
                              <option value="A">Absent(e)</option>
                              <option value="R">Retard</option>
                            </select>
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
export default AjouterAbsence;
