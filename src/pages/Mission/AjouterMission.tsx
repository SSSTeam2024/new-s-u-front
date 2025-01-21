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
import { Mission, useAddMissionMutation } from "features/mission/missionSlice";

const AjouterMission = () => {
  document.title = "Ajouter Mission| ENIGA";

  const [addDeplacement] = useAddDeplacementMutation();
  const [addMission] = useAddMissionMutation();
  const { data: personnels } = useFetchPersonnelsQuery();
  const { data: enseignants } = useFetchEnseignantsQuery();

  const navigate = useNavigate();

  const [deplacee, setDeplacee] = useState("");
  const [carState, setCarState] = useState(false);

  const [formData, setFormData] = useState<Partial<Mission>>({
    _id: "",
    motif: "",
    enseignant: "",
    personnel: "",
    date_affectation: "",
    date_fin: "",
    objectif: "",
    etat: "",
  });
  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onChangeDeplacee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeplacee(e.target.value);
  };
  const onSelectPersonnel = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      personnel: selectedOption.value,
    }));
  };
  const onSelectEnseignant = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      enseignant: selectedOption.value,
    }));
  };

  const handleDateAffectationChange = (selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setFormData((prevState) => ({
      ...prevState,
      date_affectation: day + "-" + month + "-" + year,
    }));
  };

  const handleDateFinChange = (selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setFormData((prevState) => ({
      ...prevState,
      date_fin: day + "-" + month + "-" + year,
    }));
  };

  const onSubmitMission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addMission(formData).then(() => setFormData(formData));
    notify();
    navigate("/gestion-mission/liste-mission");
    console.log(formData);
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Tâche créée avec succès",
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
                        <h5 className="card-title">Nouvelle tâche</h5>
                      </div>
                    </div>
                  </Card.Header>

                  <div className="mb-3 mt-3">
                    <Form className="tablelist-form" onSubmit={onSubmitMission}>
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                          <Col lg={3} className="mb-3">
                            <Form.Group controlId="langue">
                              <Form.Label>
                                <h4 className="card-title mb-0">Attribuer à</h4>
                              </Form.Label>
                              <Form.Select
                                value={deplacee}
                                onChange={onChangeDeplacee}
                                className="text-muted"
                              >
                                <option value="">
                                  Sélectionner déplacé(e)
                                </option>
                                <option value="personnel">Personnel</option>
                                <option value="enseignant">Enseignant</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          {deplacee === "personnel" && (
                            <Col lg={3} md={6}>
                              <div className="mb-3">
                                <Form.Group controlId="personnel">
                                  <Form.Label htmlFor="choices-multiple-remove-button">
                                    <h4 className="card-title mb-0">
                                      Personnel
                                    </h4>
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
                          )}
                          {deplacee === "enseignant" && (
                            <Col lg={3} md={6}>
                              <div className="mb-3">
                                <Form.Label htmlFor="choices-multiple-remove-button">
                                  <h4 className="card-title mb-0">
                                    Enseignant
                                  </h4>
                                </Form.Label>
                                <Select
                                  options={enseignants?.map((c) => ({
                                    value: c._id,
                                    label: c.nom_fr + " " + c.prenom_fr,
                                  }))}
                                  onChange={onSelectEnseignant}
                                />
                              </div>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="motif">
                                <h4 className="card-title mb-0">
                                  Motif de la tâche
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="motif"
                                value={formData.motif ?? ""}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="date_affectation">
                                <h4 className="card-title mb-0">
                                  Date d’affectation
                                </h4>
                              </Form.Label>
                              <Flatpickr
                                value={formData.date_affectation}
                                onChange={handleDateAffectationChange}
                                className="form-control flatpickr-input"
                                placeholder="Sélectionner Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="date_affectation"
                              />
                            </div>
                          </Col>
                          <Col lg={2} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="date_fin">
                                <h4 className="card-title mb-0">
                                  Date de Fin de tache
                                </h4>
                              </Form.Label>
                              <Flatpickr
                                value={formData.date_fin}
                                onChange={handleDateFinChange}
                                className="form-control flatpickr-input"
                                placeholder="Sélectionner Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="date_fin"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={7}>
                            <div className="mb-3">
                              <Form.Label htmlFor="objectif">
                                <h4 className="card-title mb-0">
                                  Objectifs de la tâche
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="objectif"
                                value={formData.objectif ?? ""}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="mb-3">
                            <Form.Group controlId="etat">
                              <Form.Label>
                                <h4 className="card-title mb-0">Etat </h4>
                              </Form.Label>
                              <Form.Select
                                value={formData.etat ?? ""}
                                onChange={onChange}
                                className="text-muted"
                              >
                                <option value="">Sélectionner l'etat</option>
                                <option value="en-cours">En cours</option>
                                <option value="cloturee">Clôturée</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Ajouter tâche
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

export default AjouterMission;
