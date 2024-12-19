import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Image,
  Form,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateDemandeEtudiantMutation } from "features/demandeEtudiant/demandeEtudiantSlice";

// Import images
import img4 from "assets/images/small/img-4.jpg";
import avatar1 from "assets/images/users/avatar-1.jpg";
import Swal from "sweetalert2";


// Define types for location state and update payload
type DemandeState = {
  _id: string;
  etudiant: string;
  classe: string;
  CIN: string;
  phone: string;
  type: string;
  soustype: string;
  nombre_copie: number;
  date: string;
  status: string;
};

type UpdateDemandePayload = {
  _id: string;
  status: string;
};

const EditDemandeEtudiant = () => {
  document.title = "Modifier demande Etudiant | Smart Institute";
  const navigate = useNavigate();
  const location = useLocation();
  const studentId= location.state?.studentId?._id!
  const state = location.state as DemandeState; // Adjust based on your type
  const [status, setStatus] = useState(state?.status || "");
  const [updateDemande] = useUpdateDemandeEtudiantMutation();
  const Navigate = (studentId: any) => {
    navigate("/demande-etudiant/single-demande-etudiant");
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateDemande({
        _id: state._id,
        status: status,
      } as UpdateDemandePayload).unwrap();
  
      // Show notification
      notify();
  
      // Delay navigation to allow the notification to be visible
      setTimeout(() => {
        navigate("/demande-etudiant/Liste-demandes-etudiant");
      }, 2000); // Adjust delay to match the timer in the Swal notification
    } catch (error) {
      console.error("Failed to update demande:", error);
      // Handle error (e.g., show an error message)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Échec de la mise à jour de la demande",
        showConfirmButton: true,
      });
    }
  };
  
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Demande mise à jour avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card className="border-0 shadow-none mb-0">
                    <Card.Body
                      className="rounded profile-basic"
                      style={{
                        backgroundImage: `url(${img4})`,
                        backgroundSize: "cover",
                      }}
                    ></Card.Body>
                    <Card.Body>
                      <div className="mt-n5">
                        <Image
                           src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${location.state?.studentId!.photo_profil}`}
                          alt=""
                          className="rounded-circle p-1 bg-body mt-n5" width="150"
                        />
                      </div>
                    </Card.Body>
                    <Card.Body className="pt-0">
                      <Row className="justify-content-between gy-4">
                        <Col xl={3} md={5}>
                          <h5 className="fs-20">{state?.etudiant}</h5>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-geo-alt"></i>{" "}
                            {state?.classe}
                          </div>
                          <h6 className="fs-16">
                            CIN: <span className="text-muted">{state?.CIN}</span>
                          </h6>
                          <h6 className="fs-16">
                            Tél: <span className="text-muted">{state?.phone}</span>
                          </h6>
                        </Col>
                        <Col xl={4} md={7}>
                          <div>
                            <h5 className="fs-20">Demande</h5>
                            <ul className="list-inline mb-4">
                              <li className="list-inline-item">
                                <h6 className="fs-16">
                                  Type:{" "}
                                  <span className="text-muted">
                                    {state?.type}/
                                    {state?.soustype}
                                  </span>
                                </h6>
                                <h6 className="fs-16">
                                  Langue:{" "}
                                  <span className="badge bg-info-subtle text-info">
                                    Francais
                                  </span>
                                </h6>
                                <h6 className="fs-16">
                                  Nombre de copie:{" "}
                                  <span className="badge bg-secondary-subtle text-info">
                                    {state?.nombre_copie}
                                  </span>
                                </h6>
                                <h6 className="fs-16">
                                  Date de création:{" "}
                                  <span className="text-muted">
                                    {state?.date}
                                  </span>
                                </h6>
                                <div className="d-flex align-items-center">
                                  <h6 className="fs-16 mr-2">Statut:</h6>
                                  <Form.Select
                                    className="form-select mb-3 fs-16"
                                    aria-label="Default select example"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                  >
                                    <option value="en attente">En attente</option>
                                    <option value="traité">Traité</option>
                                    <option value="rejeté">Rejeté</option>
                                  </Form.Select>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button
                  variant="primary"
                  id="add-btn"
                  onClick={handleSubmit}
                >
                  Modifier la Demande
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditDemandeEtudiant;


