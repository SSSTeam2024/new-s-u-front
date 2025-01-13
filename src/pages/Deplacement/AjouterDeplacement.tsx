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

const AjouterDeplacement = () => {
  document.title = "Ajouter Déplacement| ENIGA";

  const [addDeplacement] = useAddDeplacementMutation();
  const { data: personnels } = useFetchPersonnelsQuery();
  const { data: enseignants } = useFetchEnseignantsQuery();

  const navigate = useNavigate();

  const [deplacee, setDeplacee] = useState("");
  const [carState, setCarState] = useState(false);

  const [formData, setFormData] = useState<Partial<Deplacement>>({
    _id: "",
    title: "",
    enseignant: "",
    personnel: "",
    date_depart: "",
    date_retour: "",
    lieu_depart: "",
    lieu_arrive: "",
    accompagnants: "",
    info_voiture: "",
    pdfBase64String: "",
    pdfExtension: "",
    etat: "En attente",
  });
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleDateDepartChange = (selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setFormData((prevState) => ({
      ...prevState,
      date_depart: day + "-" + month + "-" + year,
    }));
  };

  const handleDateRetourChange = (selectedDates: Date[]) => {
    let date = selectedDates[0];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setFormData((prevState) => ({
      ...prevState,
      date_retour: day + "-" + month + "-" + year,
    }));
  };

  const onSubmitAvisEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await addDeplacement(formData).then(() => setFormData(formData));
    notify();
    navigate("/gestion-deplacement/Liste-deplacements");
    console.log(formData);
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Avis has been created successfully",
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
                        <h5 className="card-title">Nouveau Déplacement</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitAvisEnseignant}
                    >
                      <input type="hidden" id="id-field" value={formData._id} />
                      <Row>
                        <Row>
                          <Col lg={3} className="mb-3">
                            <Form.Group controlId="langue">
                              <Form.Label>
                                <h4 className="card-title mb-0">Déplacé(e)</h4>
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
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">
                                  Motif de déplacement
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="title"
                                value={formData.title ?? ""}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="dateOfBirth">
                                <h4 className="card-title mb-0">Date départ</h4>
                              </Form.Label>
                              <Flatpickr
                                value={formData.date_depart}
                                onChange={handleDateDepartChange}
                                className="form-control flatpickr-input"
                                placeholder="Sélectionner Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="date_depart"
                              />
                            </div>
                          </Col>
                          <Col lg={3} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">Date retour</h4>
                              </Form.Label>
                              <Flatpickr
                                value={formData.date_retour}
                                onChange={handleDateRetourChange}
                                className="form-control flatpickr-input"
                                placeholder="Sélectionner Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="date_retour"
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="title">
                                <h4 className="card-title mb-0">
                                  Lieu de départ
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="lieu_depart"
                                value={formData.lieu_depart ?? ""}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="dateOfBirth">
                                <h4 className="card-title mb-0">
                                  Lieu d'arrivé
                                </h4>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="lieu_arrive"
                                value={formData.lieu_arrive ?? ""}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div className="mb-3">
                              <Form.Label htmlFor="choices-multiple-remove-button">
                                <h4 className="card-title mb-0">
                                  Accompagnants
                                </h4>
                              </Form.Label>

                              <Form.Control
                                type="text"
                                id="accompagnants"
                                value={formData.accompagnants ?? ""}
                                onChange={onChange}
                                // required
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="legalcardBase64String"
                                className="form-label"
                              >
                                Fichier (pdf)
                              </label>
                              <Form.Control
                                type="file"
                                accept=".pdf"
                                className="text-muted"
                                onChange={async (e) => {
                                  const input = e.target as HTMLInputElement;
                                  const file = input.files?.[0];
                                  if (file) {
                                    const { base64Data, extension } =
                                      await convertToBase64(file);
                                    setFormData((prev) => ({
                                      ...prev,
                                      pdfBase64String: base64Data,
                                      pdfExtension: extension,
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={2}>
                            <div className="mb-3 d-flex flex-column">
                              <div
                                className="btn-group"
                                role="group"
                                aria-label="Basic radio toggle button group"
                              >
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio1"
                                  autoComplete="off"
                                  checked={carState === false}
                                  onChange={() => {
                                    setCarState(false);
                                  }}
                                />
                                <label
                                  className="btn btn-outline-secondary"
                                  htmlFor="btnradio1"
                                >
                                  Sans voiture
                                </label>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio2"
                                  autoComplete="off"
                                  checked={carState === true}
                                  onChange={() => {
                                    setCarState(true);
                                  }}
                                />
                                <label
                                  className="btn btn-outline-secondary"
                                  htmlFor="btnradio2"
                                >
                                  Avec voiture
                                </label>
                              </div>
                            </div>
                          </Col>
                          <Col lg={6}>
                            {carState === true ? (
                              <div>
                                <Form.Label htmlFor="choices-multiple-remove-button">
                                  <h4 className="card-title mb-0">
                                    Info voiture
                                  </h4>
                                </Form.Label>
                                <textarea
                                  onChange={onChange}
                                  className="form-control"
                                  id="info_voiture"
                                ></textarea>
                              </div>
                            ) : (
                              <></>
                            )}
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

export default AjouterDeplacement;
