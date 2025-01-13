import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Swal from "sweetalert2";
import {
  useAddDeplacementMutation,
  Deplacement,
} from "features/deplacement/deplacementSlice";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import { useFetchPersonnelsQuery } from "features/personnel/personnelSlice";
import { NotesPro } from "features/notesPro/notesProSlice";

const AjouterNotePro = () => {
  document.title = "Ajouter Notes Professionnelles| ENIGA";

  const [addDeplacement] = useAddDeplacementMutation();
  const { data: personnels } = useFetchPersonnelsQuery();

  const navigate = useNavigate();

  const [carState, setCarState] = useState(false);

  const [administrativeYears, setAdministrativeYears] = useState<number[]>([]);

  const [formData, setFormData] = useState<Partial<NotesPro>>({
    _id: "",
    personnel: "",
    annee: "",
    note1: "",
    note2: "",
    note3: "",
    note4: "",
    note5: "",
    note_finale: "",
    observation: "",
  });
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.id);
    getTotal(e.target.value, e.target.id);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
      note_finale: getTotal(e.target.id, e.target.value),
    }));
  };

  const getTotal = (noteValue: string, noteNumber: string) => {
    let sum = 0;

    // switch (noteNumber) {
    //   case "note1":
    //       sum = String(noteValue) +
    //     break;
    //     case "note2":
    //       sum = noteValue
    //     break;
    //     case "note3":
    //       sum = noteValue
    //     break;
    //     case "note4":
    //       sum = noteValue
    //     break;
    //     case "note5":
    //       sum = noteValue
    //     break;

    //   default:
    //     break;
    // }
    return "";
  };

  const onSelectPersonnel = (selectedOption: any) => {
    let currentYear = new Date().getFullYear();
    console.log(currentYear);
    setAdministrativeYears([currentYear, currentYear - 1]);
    setFormData((prevState) => ({
      ...prevState,
      personnel: selectedOption.value,
    }));
  };

  const onSelectAdministrativeYear = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      annee: String(selectedOption.value),
    }));
  };

  const onSubmitNotesPro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // await addDeplacement(formData).then(() => setFormData(formData));
    // notify();
    // navigate("/gestion-notes-professionelles/Liste-notes-professionelles");
    console.log(formData);
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Notes professionnelles ajoutées avec succès!",
      showConfirmButton: false,
      timer: 2000,
    });
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">
                          Nouvelles notes professionnelles
                        </h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitNotesPro}
                    >
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                          <Col lg={3} md={6}>
                            <div className="mb-3">
                              <Form.Group controlId="personnel">
                                <Form.Label htmlFor="choices-multiple-remove-button">
                                  <h4 className="card-title mb-0">Personnel</h4>
                                </Form.Label>
                                <Select
                                  options={personnels?.map((c) => ({
                                    value: c._id,
                                    label: c.nom_fr + " " + c.prenom_fr,
                                  }))}
                                  onChange={onSelectPersonnel}
                                />
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={3} md={6}>
                            <div className="mb-3">
                              <Form.Group controlId="annee-administrative">
                                <Form.Label htmlFor="choices-multiple-remove-button">
                                  <h4 className="card-title mb-0">
                                    Année administrative
                                  </h4>
                                </Form.Label>
                                <Select
                                  options={administrativeYears?.map((year) => ({
                                    value: year,
                                    label: year,
                                  }))}
                                  onChange={onSelectAdministrativeYear}
                                />
                              </Form.Group>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">
                                  Note 1 (/20)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="note1"
                                value={formData.note1}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">
                                  Note 2 (/20)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="note2"
                                value={formData.note2}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="dateOfBirth">
                                <h4 className="card-title mb-0">
                                  Note 3 (/20)
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="note3"
                                value={formData.note3}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={2} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">
                                  Note 4 (/20)
                                </h4>
                              </Form.Label>

                              <Form.Control
                                type="text"
                                id="note4"
                                value={formData.note4}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={2} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">
                                  Note 5 (/20)
                                </h4>
                              </Form.Label>

                              <Form.Control
                                type="text"
                                id="note5"
                                value={formData.note5}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={2} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">
                                  Total (/100)
                                </h4>
                              </Form.Label>

                              <Form.Control
                                type="text"
                                id="note_finale"
                                value={formData.note_finale}
                                // onChange={onChange}
                                disabled={true}
                                // required
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <Form.Label htmlFor="choices-multiple-remove-button">
                              <h4 className="card-title mb-0">Observations</h4>
                            </Form.Label>
                            <textarea
                              onChange={onChange}
                              className="form-control"
                              id="observations"
                            ></textarea>
                          </Col>
                        </Row>

                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter Déplacement
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterNotePro;
