import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "flatpickr/dist/flatpickr.min.css";
import Select from "react-select";
import { useAddDemandeEtudiantMutation, Demande } from "features/demandeEtudiant/demandeEtudiantSlice";
import { useFetchEtudiantsQuery, Etudiant } from "features/etudiant/etudiantSlice";
import { useFetchTemplateBodyQuery, TemplateBody} from "features/templateBody/templateBodySlice"
import { Classe, useFetchClassesQuery } from "features/classe/classe";
import { useNavigate } from "react-router-dom";
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice'; 

const AjouterDemandeEtudiant = () => {
  document.title = "Ajouter Demande Etudiant | Smart University";
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [addDemandeEtudiant] = useAddDemandeEtudiantMutation();
  const { data: etudiants } = useFetchEtudiantsQuery();
  const etudiant: Etudiant[] = Array.isArray(etudiants) ? etudiants : [];

  const { data: templateBodies } = useFetchTemplateBodyQuery();
  const templateBody: TemplateBody[] = Array.isArray(templateBodies) ? templateBodies : [];
  // Filter templates based on selected language and intended for students
// const studentTemplates = templateBody.filter(
//   (template) => template.langue === selectedLangue && template.intended_for === "etudiant"
// );
  const { data: classes } = useFetchClassesQuery();
  const classe: Classe[] = Array.isArray(classes) ? classes : [];
  const [selectedClasse, setSelectedClasse] = useState<string | null>(null); // To store selected class
  const [selectedLangue, setSelectedLangue] = useState<string>(""); // Empty string initially

  const handleClassSelect = (selectedOption: any) => {
    setSelectedClasse(selectedOption.value); // Set selected class ID
  };
  // Filter students based on selected class
  const filteredEtudiants = selectedClasse
    ? etudiant.filter(
        (etudiant) => etudiant.groupe_classe._id === selectedClasse
      )
    : etudiant; // Show all students if no class is selected


  const [formData, setFormData] = useState<Partial<Demande>>({

    studentId: "",
    title:  "",
    description: "",
    piece_demande: "",
    langue: "",
    nombre_copie: 1,
    response: "",
    status: "en attente",
    createdAt:undefined,
    updatedAt:undefined
  });
 
 

  const handleLangueChange = (langue: string) => {
    setSelectedLangue(langue);
    setFormData((prevState) => ({
      ...prevState,
      langue: langue,
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
 

  const onSelectChange = (selectedOption: any) => {
    setFormData((prevState) => ({
      ...prevState,
      studentId: selectedOption.value,

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

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      setSelectedDate(selectedDates[0]);
    } else {
      setSelectedDate(null);
    }
  };

  const onSubmitDemandeEnseignant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDemandeEtudiant(formData).unwrap();
      notify();
      navigate("/demandes-etudiant/Liste-demandes-etudiant");
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
  const studentTemplates = templateBody.filter(
    (template) => 
      selectedLangue && // Make sure selectedLangue is not empty
      template.langue === selectedLangue && 
      template.intended_for === "etudiant"
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
                        <h5 className="card-title">Nouvelle demande etudiant</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmitDemandeEnseignant}>
                    <Row>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                        <Form.Label>Classe</Form.Label>
                        <Select
                          options={classe.map((c) => ({
                            value: c._id,
                            label: c.nom_classe_fr,
                          }))}
                          onChange={handleClassSelect} // Update the selected class
                        />
                      </Form.Group>
                      </Col>
                      <Col lg={6}>
                      {selectedClasse && (
                        <Form.Group className="mb-3">
                          <Form.Label>Etudiant</Form.Label>
                          <Select
                            options={filteredEtudiants.map((c) => ({
                              value: c._id,
                              label: `${c.prenom_fr} ${c.nom_fr}`,
                            }))}
                            onChange={onSelectChange} // Use the existing handler for student selection
                          />
                        </Form.Group>
                      )}
                       </Col>
                       </Row>
                       <Row>

                      
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Langue</Form.Label>
                            <div>
                              <Button
                                variant={selectedLangue === "arabic" ? "primary" : "light"}
                                onClick={() => handleLangueChange("arabic")}
                              >
                                Arabe
                              </Button>
                              <Button
                                variant={selectedLangue === "french" ? "primary" : "light"}
                                onClick={() => handleLangueChange("french")}
                                className="ms-2"
                              >
                                Français
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                     
                        <Col lg={6}>
                      {selectedLangue && (
                   
                          
                            <Form.Group className="mb-3">
                              <Form.Label>Piece demandée</Form.Label>
                              <Select
                                options={studentTemplates.map((template: any) => ({
                                  value: template._id,
                                  label: template.title,
                                }))}
                                onChange={onSelectChangeTemplate}
                              />
                            </Form.Group>
                      
                        
                      )}    </Col>
 </Row>
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
                   <Col lg={5} >
                     <Form.Group className="mb-3">
  <Form.Label>Ajouter une note (facultatif)</Form.Label>
  <Form.Control
    as="textarea"
    id="description"
    rows={3}
    value={formData.description ?? ""}
    onChange={onChange}
  />
</Form.Group>

    </Col>

                   </Row>

                    



                    
                      <div className="text-end">
                        <Button variant="secondary" onClick={() => navigate("/demande-enseignant/liste-demande-enseignant")}>
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

export default AjouterDemandeEtudiant;