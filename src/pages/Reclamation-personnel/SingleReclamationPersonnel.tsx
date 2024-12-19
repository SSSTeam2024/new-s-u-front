import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Modal,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

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

const SingleReclamationPersonnel = () => {
  document.title = "Réclamation Personnel| Smart University";
  const location = useLocation();
  const personnelId= location.state?.personnelId?._id! 
  const navigate = useNavigate();
  const Navigate = (personnelId:any) => {
    navigate("/reclamation-personnel/single-reclamation-personnel");
  };
  
  const [showModal, setShowModal] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (type: any, url: any) => {
    setMediaType(type);
    setMediaUrl(url);
    setShowModal(true);
  };
  const currentStatus = location.state.status;
  const photoUrls = location.state?.photos
    ? location.state?.photos.map(
        (photo: any) =>
          `${process.env.REACT_APP_API_URL}/files/reclamationPersonnelFiles/photo/${photo}`
      )
    : [];
  const pdfUrl = location.state?.pdf
    ? `${process.env.REACT_APP_API_URL}/files/reclamationPersonnelFiles/pdf/${location.state.pdf}`
    : "";
  const videoUrl = location.state?.video  ? `${process.env.REACT_APP_API_URL}/files/reclamationPersonnelFiles/video/${location.state.video}`
  : "";
  console.log("currentStatus", currentStatus);
  console.log("photoUrls:", photoUrls);
  console.log("pdfUrl:", pdfUrl);
  console.log("videoUrl:", videoUrl);

const getBadgeClasses = (statusValue: string) => {
  switch (statusValue) {
      case 'en attente':
          return 'badge bg-warning-subtle text-warning';
      case 'traité':
          return 'badge bg-primary-subtle text-primary';
      case 'rejeté':
          return 'badge bg-danger-subtle text-danger';
      default:
          return 'badge';
  }
}
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
          <Col xxl={3} lg={3}>
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
          <Col xxl={7} lg={7}>
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
                                  <span className="mb-1 ">
                                     {location.state.response}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                    <td className="">Etat:</td>
                                    <span className={getBadgeClasses(currentStatus)}>
                                    {currentStatus}
                                    </span>
                                  </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                  
                      </Card>
                    </Col>
                    <Col xxl={2} lg={2}>
  <Card className="categrory-widgets overflow-hidden">
    <div className="card-header d-flex align-items-center">
      <h5 className="card-title flex-grow-1 mb-0">Pièce-jointe</h5>
    </div>
    <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
      <div
        className="btn-group-vertical"
        role="group"
        aria-label="Media options"
      >
        {/* Show Image button if there are photos */}
        {photoUrls.length > 0 && (
          <Button
            variant="outline-primary"
            className="mb-2"
            onClick={() => handleShow("image", photoUrls[0])} // Show the first image in the modal
          >
            <i className="bi bi-image"></i> Image
          </Button>
        )}

        {/* Show Video button if there is a video */}
        {videoUrl && (
          <Button
            variant="outline-success"
            className="mb-2"
            onClick={() => handleShow("video", videoUrl)}
          >
            <i className="bi bi-camera-video"></i> Video
          </Button>
        )}

        {/* Show PDF button if there is a PDF */}
        {pdfUrl && (
          <Button
            variant="outline-danger"
            onClick={() => handleShow("pdf", pdfUrl)}
          >
            <i className="bi bi-file-earmark-pdf"></i> PDF
          </Button>
        )}
      </div>
    </Card.Body>
  </Card>
</Col>
        </Row>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
       
      </Container>
        {/* Modal */}
    
        <Modal show={showModal} onHide={handleClose} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {mediaType === 'image' && (
      <Carousel>
        {photoUrls.map((url:any, index:any) => (
          <Carousel.Item key={index}>
            <Image src={url} alt={`Image ${index + 1}`} fluid />
          </Carousel.Item>
        ))}
      </Carousel>
    )}
    {mediaType === 'video' && (
      <video controls width="100%">
        <source src={mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )}
    {mediaType === 'pdf' && (
      <iframe src={mediaUrl} width="100%" height="600px" />
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  </React.Fragment>
);
};

export default SingleReclamationPersonnel;
