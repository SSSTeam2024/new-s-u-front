import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateDemandeCongeMutation } from "features/congé/demandeCongeSlice";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const EditDemandeConge = () => {
  document.title = "Modifier Demande de Congé | Smart University";

  const navigate = useNavigate();
  const location = useLocation();
  const demandeConge = location.state;
console.log("state",demandeConge)
  const [updateDemandeConge] = useUpdateDemandeCongeMutation();
  const [formData, setFormData] = useState({
    ...demandeConge,
    
    status: demandeConge.status || "en attente", 
    dateInterruption: demandeConge.dateInterruption || "",
    fileInterruption: demandeConge.fileInterruption || "",
    fileInterruptionBase64String: demandeConge.fileInterruptionBase64String || ""
});

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setFormData({
      ...formData,
      status: newStatus,
     
      dateInterruption: newStatus === "suspendue" ? formData.dateInterruption : "",
    });
  };

  const handleDateSuspensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dateInterruption: e.target.value, fileInterruption: e.target.value  });
  };



  const handleDateInterruptionChange = (dates: Date[]) => {
    setFormData((prev: any) => ({
      ...prev,
      dateInterruption: dates[0]?.toISOString() || null,
      dateReponse: dates[0]?.toISOString() || null,
    }));
  };

 
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDemandeConge(formData).unwrap();
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Statut modifié en "${formData.status}" avec succès`,
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/demande-conge/liste-demande-conge");
    } catch (error: any) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Échec de la modification",
        text: error.message || "Une erreur est survenue.",
        showConfirmButton: true,
      });
    }
  };

  function convertToBase64(fileInterruption: File): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const [, base64Data] = base64String.split(","); 
        const extension = fileInterruption.name.split(".").pop() ?? ""; 
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(fileInterruption);
    });
  }
  return (
    <React.Fragment>
      <div className="page-content">
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="card-title"> Demande de Congé/ Reponse</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col lg={6}>
                  <h6>Personnel:</h6>
                  <p>{demandeConge.personnelId?.prenom_fr} {demandeConge.personnelId?.nom_fr} | {demandeConge.personnelId?.prenom_ar} {demandeConge.personnelId?.nom_ar}</p>
                </Col>
                <Col lg={6}>
                  <h6>Type de Congé:</h6>
                  <p>{demandeConge.leaveType.name_fr} | {demandeConge.leaveType.name_ar}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={6}>
                  <h6>Date de Début:</h6>
                  <p>{demandeConge.startDay ? new Date(demandeConge.startDay).toLocaleDateString("fr-FR") : "N/A"}</p>
                </Col>
                <Col lg={6}>
                  <h6>Date de Fin:</h6>
                  <p>{demandeConge.endDay ? new Date(demandeConge.endDay).toLocaleDateString("fr-FR") : "N/A"}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={6}>
                  <h6>Fichier:</h6>
                  <p>{demandeConge.fileName || "Aucun fichier"}</p>
                </Col>
                <Col lg={6}>
                  <h6>Nature du Fichier:</h6>
                  <p>{demandeConge.nature_fichier || "N/A"}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={6}>
                  <h6>Description:</h6>
                  <p>{demandeConge.description || "Aucune description"}</p>
                </Col>
               {demandeConge.status === "acceptée" ? (
                <Col lg={6}>
                  <h6>Statut:</h6>
                  <Form.Select
                    value={formData.status}
                    onChange={handleStatusChange}
                  >
                    {/* <option value="acceptée">Acceptée</option> */}
                    <option value="suspendue">Suspendue</option>
                  </Form.Select>
                </Col>
               ) :demandeConge.status === "refusée" ? (
                <> 
               <Col lg={6}>
                  <h6>Statut:</h6>
                  <p>{demandeConge.status}</p>
                </Col> 
    
              
                 </>) : demandeConge.status === "suspendue" ? (
                <> 
               <Col lg={6}>
                  <h6>Statut:</h6>
                 <p>{demandeConge.status}
                  </p>
                  <h6>Date suspension:</h6>
                 <p>{demandeConge.dateInterruption}
                  </p>
                  <h6>Piece-jointe:</h6>
                 <p>{demandeConge.fileInterruption}
                  </p>
                </Col> 
    
              
                 </>) :
                <Col lg={6}>
                  <h6>Statut:</h6>
                  <Form.Select
                    value={formData.status}
                    onChange={handleStatusChange}
                  >
                   <option >En cours</option>
                    <option value="acceptée">Acceptée</option>
                    <option value="refusée">Refusée</option>
                    <option value="suspendue">Suspendue</option>
                  </Form.Select>
                </Col> } 
              </Row>
                 {/* Conditionally render the date_suspension field */}
                 {formData.status === "suspendue" && (
                <Row className="mt-3">
                  <Col lg={6}>
                    <h6>Date de Suspension:</h6>
                    <Flatpickr
                      options={{
                        minDate: formData.startDay,
                        maxDate: formData.endDay,
                        dateFormat: "Y-m-d",
                      }}
                      value={formData.dateInterruption ? new Date(formData.dateInterruption) : undefined}
                      onChange={handleDateInterruptionChange}
                      className="form-control"
                    />
                  </Col>
                  <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="fileInterruptionBase64String"
                                className="form-label"
                              >
                               Pièce-jointe 
                              </label>
                              <Form.Control
                                type="file"
                                accept=".pdf"
                                
                                className="text-muted"
                                onChange={async (e) => {
                                  const input = e.target as HTMLInputElement;
                                  const file = input.files?.[0];
                                  if (file) {
                                    const { base64Data, extension } = await convertToBase64(file);
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      fileInterruptionBase64String: base64Data,
                                      fileInterruptionExtension: extension,
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </Col>
                </Row>
              )}
                {/* Conditionally render the date_suspension field */}
                {formData.status === "acceptée" && (
                <Row className="mt-3">
                  <Col lg={6}>
                    <h6>Date de d'acceptation:</h6>
                    <Flatpickr
                      options={{
                    
                        dateFormat: "Y-m-d",
                      }}
                      value={formData.dateReponse ? new Date(formData.dateReponse) : undefined}
                      onChange={handleDateInterruptionChange}
                      className="form-control"
                    />
                  </Col>
                  <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="fileInterruptionBase64String"
                                className="form-label"
                              >
                               Pièce-jointe 
                              </label>
                              <Form.Control
                                type="file"
                                accept=".pdf"
                                
                                className="text-muted"
                                onChange={async (e) => {
                                  const input = e.target as HTMLInputElement;
                                  const file = input.files?.[0];
                                  if (file) {
                                    const { base64Data, extension } = await convertToBase64(file);
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      fileReponseBase64String: base64Data,
                                      fileReponseExtension: extension,
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </Col>
                </Row>
              )}

              <Button variant="primary" type="submit" onClick={onSubmit}>
                Enregistrer
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
    </React.Fragment>
  );
};

export default EditDemandeConge;
