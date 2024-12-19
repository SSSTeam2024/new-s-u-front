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
import {useUpdateReclamationPersonnelMutation}  from "features/reclamationPersonnel/reclamationPersonnelSlice";


// Import images
import img1 from "assets/images/small/img-1.jpg";
import img2 from "assets/images/small/img-2.jpg";
import img3 from "assets/images/small/img-3.jpg";
import img4 from "assets/images/small/img-4.jpg";
import img5 from "assets/images/small/img-5.jpg";
import img6 from "assets/images/small/img-6.jpg";
import avatar1 from "assets/images/users/avatar-1.jpg";
import Swal from "sweetalert2";
import student from "assets/images/etudiant.png";
// Define types for location state and update payload
type ReclamationState = {
  _id:string,
  personnelId: string,
  title:  string,
  description: string,
  response: string,
  status: string,
  createdAt:Date,
  updatedAt:Date
};

type UpdateDemandePayload = {
  _id: string;
  response: string;
  status: string

};
const EditReclamationPersonnel = () => {
  document.title = "Modifier demande Personnel | Smart Institute";
  const location = useLocation();
  console.log("state", location);
  const personnelId= location.state?.personnelId?._id!
  console.log("personnelId", personnelId);
  const state = location.state as ReclamationState; // Adjust based on your type
  const [response, setResponse] = useState(location.state?.response || "");
  const [updateReclamationPersonnel] = useUpdateReclamationPersonnelMutation();

  const navigate = useNavigate();
  const Navigate = (studentId: any) => {
    navigate("/reclamation-personnel/single-reclamation-personnel");
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateReclamationPersonnel({
        _id: state._id,
        response: response,
        status: "traité", // Update status to "traité" implicitly
      } as unknown as UpdateDemandePayload).unwrap();
  
      // Show notification
      notify();
  
      // Delay navigation to allow the notification to be visible
      setTimeout(() => {
        navigate("/reclamation-personnel/liste-reclamation-personnel");
      }, 2000); // Adjust delay to match the timer in the Swal notification
    } catch (error) {
      console.error("Failed to update reclamation:", error);
      // Handle error (e.g., show an error message)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Échec de la mise à jour de la reclamation",
        showConfirmButton: true,
      });
    }
  };
  
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Reclamation mise à jour avec succès",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Réclamation personnel"
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
      src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${location.state?.personnelId.photo_profil}`}
      alt="Student Profile"
      className="rounded-circle p-1 bg-body mt-n5"
      width="150"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevents infinite loop if the fallback image also fails to load
        target.src = student;
      }}
    />
  </div>
</Card.Body>
                    <Row>
            <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de l'étudiant{" "}
                    {/* <i className="bi bi-mortarboard-fill"></i> */}
                  </h5>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => Navigate(personnelId)}
                      type="button"
                      className="btn btn-info btn-label m-1"
                    >
                      <i className="bi bi-eye label-icon align-middle fs-16 me-2"></i>
                      Voir personnel{" "}
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
                              {location.state?.personnelId?.nom_fr!} {location.state?.personnelId?.prenom_fr!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">CIN:</td>
                          <td>
                            <span className="mb-1 ">{location.state?.personnelId?.num_cin!}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">Categorie:</td>
                          <td>
                            <span className="mb-1 ">
                            {location.state?.personnelId?.categorie!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">E-mail:</td>
                          <td>
                            <span className="mb-1 ">
                            {location.state?.personnelId?.email!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="">Téléphone:</td>
                          <td>
                            <span className="mb-1 ">{location.state?.personnelId?.num_phone!}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* <img
                  src={student}
                  alt=""
                  className="img-fluid category-img object-fit-cover"
                /> */}
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
                                    <td>{location.state.createdAt}</td>
                                  </tr>
                                  <tr>
                                    <td className="">Date d'exécution</td>
                                    <td>{location.state.updatedAt}</td>
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
                                    onChange={(e) => setResponse(e.target.value)}
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

export default EditReclamationPersonnel;