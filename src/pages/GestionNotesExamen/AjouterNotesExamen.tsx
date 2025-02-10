import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useAddNewNoteExamenMutation } from "features/notesExamen/notesExamenSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import {
  useFetchClassesByTeacherMutation,
  useGetMatieresByClasseIdQuery,
} from "features/classe/classe";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AjouterNotesExamen = () => {
  document.title = "Ajouter Notes Examen | ENIGA";

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Examen Ajouté",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const navigate = useNavigate();

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [selectedTypeEvaluation, setSelectedTypeEvaluation] =
    useState<string>("");
  const [classes, setClasses] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState("");

  const [addNewNoteExamen] = useAddNewNoteExamenMutation();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();

  const handleSelectEnseignant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const { data: matieres = [], isLoading: isMatieresLoading } =
    useGetMatieresByClasseIdQuery(selectedClasse, {
      skip: !selectedClasse,
    });

  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const handleSelectMatiere = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const handleSelectTypeEvaluation = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTypeEvaluation(value);
  };

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedEnseignant) {
        try {
          let classesRequestData = {
            teacherId: selectedEnseignant,
            semestre: selectedValue === "S1" ? "1" : "2",
          };
          const response = await getClassesByTeacherId(
            classesRequestData
          ).unwrap();

          setClasses(response);
        } catch (error) {
          console.error("Error fetching classes:", error);
        }
      }
    };

    fetchClasses();
  }, [selectedEnseignant, selectedValue, getClassesByTeacherId]);

  const filteredMatieres = matieres.filter((matiere) =>
    matiere?.semestre?.toLowerCase().includes(selectedValue.toLowerCase())
  );

  const initialNoteExamen = {
    enseignant: "",
    semestre: "",
    groupe: "",
    matiere: "",
    type_examen: "",
    completed: "",
  };

  const [noteExamen, setNoteExamen] = useState(initialNoteExamen);

  const { enseignant, semestre, groupe, matiere, type_examen, completed } =
    noteExamen;

  const onSubmitNoteExamen = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      noteExamen["enseignant"] = selectedEnseignant;
      noteExamen["groupe"] = selectedClasse;
      noteExamen["matiere"] = selectedMatiere;
      noteExamen["type_examen"] = selectedTypeEvaluation;
      noteExamen["semestre"] = selectedValue;
      noteExamen["completed"] = "0";
      await addNewNoteExamen(noteExamen).unwrap();
      notify();
      navigate("/gestion-examen/liste-des-notes-examen");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Notes Examen" pageTitle="Ajouter Notes Examen" />

          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Form onSubmit={onSubmitNoteExamen}>
                    <Row className="mb-3">
                      <Col>
                        <div className="hstack gap-4">
                          <div>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              value="S1"
                              onChange={handleChange}
                            />{" "}
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault1"
                            >
                              S1
                            </label>
                          </div>
                          <div>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                              value="S2"
                              onChange={handleChange}
                            />{" "}
                            <label
                              className="form-check-label"
                              htmlFor="flexRadioDefault2"
                            >
                              S2
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label>Enseignant</Form.Label>
                        <select
                          className="form-select"
                          onChange={handleSelectEnseignant}
                        >
                          <option value="">Choisir ...</option>
                          {AllEnseignants.map((enseignant) => (
                            <option
                              value={enseignant?._id!}
                              key={enseignant?._id!}
                            >
                              {enseignant?.prenom_fr!} {enseignant?.nom_fr!}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col>
                        <Form.Label>Groupes</Form.Label>
                        <select
                          className="form-select"
                          onChange={handleSelectClasse}
                        >
                          <option value="">Choisir ...</option>
                          {classes.map((classe: any) => (
                            <option value={classe?._id!} key={classe?._id!}>
                              {classe?.nom_classe_fr!}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col>
                        <Form.Label>Matières</Form.Label>
                        <select
                          className="form-select"
                          onChange={handleSelectMatiere}
                        >
                          <option value="">Choisir ...</option>
                          {filteredMatieres.map((matiere: any) => (
                            <option value={matiere?._id!} key={matiere?._id!}>
                              {matiere?.matiere!}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col>
                        <Form.Label>Type Evaluation</Form.Label>
                        <select
                          className="form-select"
                          onChange={handleSelectTypeEvaluation}
                        >
                          <option value="">Choisir ...</option>
                          <option value="Test">Test</option>
                          <option value="Oral">Oral</option>
                          <option value="Mini Projet">Mini Projet</option>
                          <option value="Examen TP">Examen TP</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex justify-content-end mt-3">
                        <button type="submit" className="btn btn-secondary">
                          Ajouter
                        </button>
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

export default AjouterNotesExamen;
