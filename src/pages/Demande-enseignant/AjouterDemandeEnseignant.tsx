import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import {
  useAddDemandeEnseignantMutation,
  Demande,
} from "features/demandeEnseignant/demandeEnseignantSlice";
import {
  useFetchEnseignantsQuery,
  Enseignant,
} from "features/enseignant/enseignantSlice";
import {
  useFetchTemplateBodyQuery,
  TemplateBody,
} from "features/templateBody/templateBodySlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
const AjouterDemandeEnseignant = () => {
  document.title = "Ajouter Demande Enseignant | ENIGA";
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addDemandeEnseignant] = useAddDemandeEnseignantMutation();
  const { data: enseignants } = useFetchEnseignantsQuery();
  const enseignant: Enseignant[] = Array.isArray(enseignants)
    ? enseignants
    : [];

  const { data: templateBodies } = useFetchTemplateBodyQuery();
  const templateBody: TemplateBody[] = Array.isArray(templateBodies)
    ? templateBodies
    : [];

  const [formData, setFormData] = useState<Partial<Demande>>({
    enseignantId: "",
    title: "",
    description: "",
    piece_demande: "",
    langue: "",
    nombre_copie: 1,
    response: "",
    status: "en attente",
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [selectedLangue, setSelectedLangue] = useState<string>("");
  // nombre de copie set
  // const [blueCounter, setblueCounter] = useState(1);
  // function countUP(id: any, prev_data_attr: any) {
  //   id(prev_data_attr + 1);
  // }

  // function countDown(id: any, prev_data_attr: any) {
  //   id(prev_data_attr - 1);
  // }

  const handleLangueChange = (langue: string) => {
    setSelectedLangue(langue);
    setFormData((prevState) => ({
      ...prevState,
      langue: langue,
    }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSelectChange = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      enseignantId: selectedOption.value,
    }));
  };
  const onSelectChangeTemplate = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      piece_demande: selectedOption.value,
    }));
  };

  const onDescriptionChange = (event: any, editor: any) => {
    const data = editor.getData();
    setFormData((prevState) => ({
      ...prevState,
      description: data,
    }));
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onSubmitDemandeEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await addDemandeEnseignant(formData).unwrap();
      notify();
      navigate("/demandes-enseignant/liste-demande-enseignant");
    } catch (error) {
      console.error("Failed to create demande:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la création de la demande.",
      });
    }
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Demande has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Filter templates based on selected language
  const filteredTemplates = templateBody.filter(
    (template) =>
      selectedLangue && // Make sure selectedLangue is not empty
      template.langue === selectedLangue &&
      template.intended_for === "enseignant"
  );

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
                          Nouvelle demande enseignant
                        </h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitDemandeEnseignant}
                    >
                      <Row>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Enseignant</Form.Label>
                            <Select
                              options={enseignant.map((c) => ({
                                value: c._id,
                                label: `${c.prenom_fr} ${c.nom_fr}`,
                              }))}
                              onChange={onSelectChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Langue</Form.Label>
                            <div>
                              <Button
                                variant={
                                  selectedLangue === "arabic"
                                    ? "primary"
                                    : "light"
                                }
                                onClick={() => handleLangueChange("arabic")}
                              >
                                Arabe
                              </Button>
                              <Button
                                variant={
                                  selectedLangue === "french"
                                    ? "primary"
                                    : "light"
                                }
                                onClick={() => handleLangueChange("french")}
                                className="ms-2"
                              >
                                Français
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      {selectedLangue && (
                        <Row>
                          <Col lg={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Piece demandée</Form.Label>
                              <Select
                                options={filteredTemplates.map(
                                  (template: any) => ({
                                    value: template._id,
                                    label: template.title,
                                  })
                                )}
                                onChange={onSelectChangeTemplate}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre de copie</Form.Label>
                          <div className="d-flex flex-wrap align-items-start gap-2">
                            <div className="input-step step-primary">
                              <Button
                                className="minus"
                                onClick={() => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    nombre_copie: Math.max(
                                      (prevState.nombre_copie ?? 1) - 1,
                                      1
                                    ),
                                  }));
                                }}
                              >
                                –
                              </Button>
                              <Form.Control
                                type="number"
                                className="product-quantity"
                                value={formData.nombre_copie ?? 1}
                                min="1"
                                max="100"
                                readOnly
                              />
                              <Button
                                className="plus"
                                onClick={() => {
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    nombre_copie:
                                      (prevState.nombre_copie ?? 1) + 1,
                                  }));
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </Form.Group>
                      </Col>

                      <Row>
                        <Col lg={5}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Ajouter une note ( facultatif)
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="description"
                              value={formData.description ?? ""}
                              onChange={onChange}
                              // required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              "/demande-enseignant/liste-demande-enseignant"
                            )
                          }
                        >
                          Annuler
                        </Button>
                        <Button variant="primary" type="submit">
                          Envoyer
                        </Button>
                      </div>
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

export default AjouterDemandeEnseignant;
