import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
//import "./style.css"
import { useUpdateReclamationEnseignantMutation } from "features/reclamationEnseignant/reclamationEnseignantSlice";

// Import images
import img1 from "assets/images/small/img-1.jpg";
import img2 from "assets/images/small/img-2.jpg";
import img3 from "assets/images/small/img-3.jpg";
import img4 from "assets/images/small/img-4.jpg";
import img5 from "assets/images/small/img-5.jpg";
import img6 from "assets/images/small/img-6.jpg";
import avatar1 from "assets/images/users/avatar-1.jpg";
import student from "assets/images/etudiant.png";
import file from "assets/images/demande.png";
import Swal from "sweetalert2";

// Define types for location state and update payload
type ReclamationState = {
  _id: String;
  enseignantId: string;
  title: String;
  description: String;
  response: String;
  status: String;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateDemandePayload = {
  _id: string;
  response: string;
  status: String;
};
const EditReclamationEnseignant = () => {
  document.title = "Modifier Réclamation Etudiant | Smart University";
  const location = useLocation();
  console.log("state", location);
  const enseignantId = location.state?.enseignantId?._id!;
  const state = location.state as ReclamationState; // Adjust based on your type
  const [response, setResponse] = useState(location.state?.response || "");
  console.log("response",location.state.response)
  const [updateReclamationEnseignant] = useUpdateReclamationEnseignantMutation();

  const navigate = useNavigate();
  const Navigate = (enseignantId: any) => {
    navigate("/reclamation-enseignant/single-reclamation-enseignant");
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateReclamationEnseignant({
        _id: state._id,
        response: response,
        status: "traité", // Update status to "traité" implicitly
      } as unknown as UpdateDemandePayload).unwrap();

      // Show notification
      notify();

      // Delay navigation to allow the notification to be visible
      setTimeout(() => {
        navigate("/reclamation-enseignant/liste-reclamation-enseignant");
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
          <Breadcrumb
            title="Réclamation Enseignant"
            pageTitle="Modifier la réclamation"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Card className="border-0 shadow-none mb-0">
                    <Card.Body
                      className="rounded profile-basic mb-n5"
                      style={{
                        backgroundImage: `url(${img4})`,
                        backgroundSize: "cover",
                      }}
                    ></Card.Body>
                    <Card.Body>
                      <div className="mt-n5">
                        <Image
                          src={`${process.env.REACT_APP_API_URL}/files/enseignantFiles/PhotoProfil/${location.state?.enseignantId?.photo_profil}`}
                          alt=""
                          className="rounded-circle p-1 bg-body mt-n5" width="150"
                        />
                      </div>
                    </Card.Body>
                    <Row>
                      <Col xxl={6} lg={6}>
                        <Card className="categrory-widgets overflow-hidden">
                          <div className="card-header d-flex align-items-center">
                            <h5 className="card-title flex-grow-1 mb-0">
                              Détails de l'enseignant{" "}
                              {/* <i className="bi bi-mortarboard-fill"></i> */}
                            </h5>
                            <div className="flex-shrink-0">
                              <Button
                                onClick={() => Navigate(enseignantId)}
                                type="button"
                                className="btn btn-info btn-label m-1"
                              >
                                <i className="bi bi-eye label-icon align-middle fs-16 me-2"></i>
                                Voir le profil{" "}
                              </Button>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="text-center">
                              <i className="bi bi-mortarboard fs-1 text-muted"></i>
                            </div>
                            <div className="table-responsive">
                              <table className="table table-sm table-borderless align-middle description-table mb-0">
                                <tbody>
                                  <tr>
                                    <td className="">Nom et prénom:</td>
                                    <td>
                                      <span className="mb-1 ">
                                        {location.state?.enseignantId?.nom_fr!}{" "}
                                        {
                                          location.state?.enseignantId
                                            ?.prenom_fr!
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="">CIN:</td>
                                    <td>
                                      <span className="mb-1 ">
                                        {location.state?.enseignantId?.num_CIN!}
                                      </span>
                                    </td>
                                  </tr>
                                  {/* <tr>
                          <td className="">Classe:</td>
                          <td>
                            <span className="mb-1 ">
                            {location.state?.studentId?.groupe_classe!}
                            </span>
                          </td>
                        </tr> */}
                                  <tr>
                                    <td className="">E-mail:</td>
                                    <td>
                                      <span className="mb-1 ">
                                        {location.state?.enseignantId?.email!}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="">Téléphone:</td>
                                    <td>
                                      <span className="mb-1 ">
                                        {
                                          location.state?.enseignantId
                                            ?.num_phone1!
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <img
                            src={student}
                            alt=""
                            className="img-fluid category-img object-fit-cover"
                          />
                        </Card>
                      </Col>
                      <Col xxl={6} lg={6}>
                        <Card className="categrory-widgets overflow-hidden">
                          <div className="card-header d-flex align-items-center">
                            <h5 className="card-title flex-grow-1 mb-0">
                              Détails de la réclamation
                            </h5>
                            <div className="flex-shrink-0">
                              <Button
                                type="button"
                                className="btn btn-warning btn-label m-1"
                              >
                                <i className="bi bi-file-earmark-arrow-down label-icon align-middle fs-16 me-2"></i>
                                Pièce-jointe
                              </Button>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="text-center">
                              <i className="bi bi-card-list fs-1 text-muted"></i>
                            </div>
                            <div className="table-responsive">
                              <table className="table table-sm table-borderless align-middle description-table mb-0">
                                <tbody>
                                  <tr>
                                    <td className="">Description:</td>
                                    <td>
                                      <span className="mb-1 ">
                                        {location.state.description}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="">Date de création</td>
                                    <td>
                                      {new Date(
                                        location.state.createdAt
                                      ).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="">Date d'exécution</td>
                                    <td>
                                      {new Date(
                                        location.state.updatedAt
                                      ).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Réponse :</td>
                                    <td className="d-flex align-items-center">
                                      <textarea
                                        className="form-control  muted-placeholder me-2"
                                        id="response"
                                        placeholder="Taper votre réponse"
                                        rows={2}
                                        value={response}
                                        onChange={(e) =>
                                          setResponse(e.target.value)
                                        }
                                      ></textarea>
                                      <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="btn btn-success btn-icon"
                                      >
                                        <i className="bi bi-send"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="">Etat:</td>
                                    <span className="badge bg-danger-subtle text-danger">
                                      en cours
                                    </span>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {/* <img
                  src={file}
                  alt=""
                  className="img-fluid category-img object-fit-cover"
                /> */}
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditReclamationEnseignant;
