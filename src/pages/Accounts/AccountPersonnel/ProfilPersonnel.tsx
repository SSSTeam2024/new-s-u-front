import React, { useState } from "react";
import {
  Card,
  Nav,
  Tab,
  Row,
  Col,
  Table,
  Image,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import DemandeTablePersonnel from "./DemandeTablePersonnel";
import ReclamationTable from "./ReclamationTablePersonnel";
import "./hover.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import userImage from "assets/images/userImage.jpg";
import moment from 'moment';

const ProfilPersonnel = () => {
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const location = useLocation();
  const personnelDetails = location.state;

  const [showFileModal, setShowFileModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileTitle, setFileTitle] = useState('')
  const baseUrl = `${process.env.REACT_APP_API_URL}/files/personnelFiles/historique/`; // Change to your server base

  const openFileModal = (filename: string, title: string) => {
    if (!filename) return;
    setFileUrl(`${baseUrl}${filename}`);
    setFileTitle(title);
    setShowFileModal(true);
  };
  const handleImageClick = (imageSrc: any) => {
    setClickedImage(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
  };
  const getLatestPosition = () => {
    if (!personnelDetails?.historique_positions?.length) return null;

    // Sort by date_affectation descending
    const sorted = [...personnelDetails.historique_positions].sort((a, b) => {
      const dateA = new Date(a.date_affectation);
      const dateB = new Date(b.date_affectation);
      return dateB.getTime() - dateA.getTime(); // Latest first
    });

    return sorted[0]; // Latest entry
  };
  const latestPosition = getLatestPosition();
  console.log("latest position", latestPosition.categorie)
  //Poste personnel
  const postePersonnelFR =
    typeof personnelDetails?.poste! === "object"
      ? personnelDetails?.poste?.poste_fr!
      : personnelDetails?.poste!;

  const posteEnseignantAR =
    typeof personnelDetails?.poste! === "object"
      ? personnelDetails?.poste?.poste_ar!
      : personnelDetails?.poste!;
  // etat compte enseignant
  const etatCompteDisplayFR =
    typeof personnelDetails?.etat_compte! === "object"
      ? personnelDetails?.etat_compte?.etat_fr!
      : personnelDetails?.etat_compte!;

  const etatCompteDisplayAR =
    typeof personnelDetails?.etat_compte! === "object"
      ? personnelDetails?.etat_compte?.etat_ar!
      : personnelDetails?.etat_compte!;
  // //specialite enseignant
  const categoriePersonnelFR =
    typeof personnelDetails?.categorie! === "object"
      ? personnelDetails?.categorie?.categorie_fr!
      : personnelDetails?.categorie!;
  const categoriePersonnelAR =
    typeof personnelDetails?.categorie! === "object"
      ? personnelDetails?.categorie?.categorie_ar!
      : personnelDetails?.categorie!;

  //grade enseignant
  const gradeEnseignantFR =
    typeof personnelDetails?.grade! === "object"
      ? personnelDetails?.grade?.grade_fr!
      : personnelDetails?.grade!;
  const gradeEnseignantAR =
    typeof personnelDetails?.grade! === "object"
      ? personnelDetails?.grade?.grade_ar!
      : personnelDetails?.grade!;

  //service personnel
  const servicePersonnelFR =
    typeof personnelDetails?.service! === "object"
      ? personnelDetails?.service?.service_fr!
      : personnelDetails?.service!;
  const servicePersonnelAR =
    typeof personnelDetails?.service! === "object"
      ? personnelDetails?.service?.service_ar!
      : personnelDetails?.service!;
  return (
    <React.Fragment>
      <Tab.Container defaultActiveKey="Profil">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Nav as="ul" className="nav nav-pills flex-grow-1 mb-0">
            <Nav.Item as="li">
              <Nav.Link eventKey="Profil">Profil</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="Demandes">Demandes</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="Reclamation">Réclamations</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="flex-shrink-0">
            <Link to="/settings" className="btn btn-success">
              Modifier le profil
            </Link>
          </div>
        </div>
        <Tab.Content className="text-muted">
          <Tab.Pane eventKey="Profil">
            <Card>
              <Row className="g-0">
                <Col md={2}>
                  <img
                    className="rounded-start img-fluid h-70 object-cover"
                    src={
                      personnelDetails.photo_profil
                        ? `${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${personnelDetails.photo_profil}`
                        : userImage
                    }
                    alt="Photo Profile"
                    onError={(e) => {
                      e.currentTarget.src = userImage;
                    }}
                  />
                </Col>
                <Col md={9}>
                  <Card.Header>
                    <div className="flex-grow-1 card-title mb-0">
                      <h5>
                        {personnelDetails.nom_fr} {personnelDetails.prenom_fr}
                      </h5>
                      <p className="text-muted mb-0">
                        {" "}
                        {personnelDetails.nom_ar} {personnelDetails.prenom_ar}
                      </p>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col lg={6} className="m-0 p-0">
                        <div className="table-responsive">
                          <Table className="table-borderless table-sm m-0 p-0 ">
                            <tbody>
                              <tr>
                                <td>Poste</td>
                                <td className="fw-medium">
                                  {latestPosition.poste.poste_fr}/{latestPosition.poste.poste_ar}
                                </td>
                              </tr>
                              <tr>
                                <td>CIN</td>
                                <td className="fw-medium">
                                  {personnelDetails.num_cin}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                      <Col lg={6} className="m-0 p-0">
                        <div className="table-responsive">
                          <Table className="table-borderless table-sm m-0 p-0 ">
                            <tbody>
                              <tr>
                                <td>Matricule</td>
                                <td className="fw-medium">
                                  <span className="badge badge-label bg-secondary fs-6">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    2493600925
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>Etat de Compte</td>
                                <td className="fw-medium">
                                  <span className="badge badge-label bg-warning">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    {etatCompteDisplayFR} /{" "}
                                    {etatCompteDisplayAR}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card>
              <Row className="p-4">
                <Col lg={6} className="border-end">
                  <h5 className="text-muted"> Informations Personnelles</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Genre:</td>
                          <td className="fw-medium">{personnelDetails.sexe}</td>
                        </tr>

                        <tr>
                          <td>Nationnalité:</td>
                          <td className="fw-medium">
                            {personnelDetails.nationalite}
                          </td>
                        </tr>
                        <tr>
                          <td>Etat civil:</td>
                          <td className="fw-medium">
                            {personnelDetails.etat_civil}
                          </td>
                        </tr>
                        <tr>
                          <td>Date de naissance:</td>
                          <td className="fw-medium">
                            {personnelDetails.date_naissance}
                          </td>
                        </tr>
                        <tr>
                          <td>Lieu de naissance:</td>
                          <td className="fw-medium">
                            {personnelDetails.lieu_naissance_ar} /{" "}
                            {personnelDetails.lieu_naissance_fr}
                          </td>
                        </tr>

                        <tr>
                          <td> Adresse:</td>
                          <td className="fw-medium">
                            {personnelDetails.adress_fr} /{" "}
                            {personnelDetails.adress_ar}
                          </td>
                        </tr>
                        <tr>
                          <td>Email:</td>
                          <td className="fw-medium">
                            {personnelDetails.email}
                          </td>
                        </tr>
                        <tr>
                          <td>Téléphone 1:</td>
                          <td className="fw-medium">
                            {personnelDetails.num_phone1}
                          </td>
                        </tr>
                        <tr>
                          <td>Téléphone 2:</td>
                          <td className="fw-medium">
                            {personnelDetails.num_phone2}
                          </td>
                        </tr>
                        <tr>
                          <td>Compte Courant:</td>
                          <td className="fw-medium">
                            {personnelDetails.compte_courant}
                          </td>
                        </tr>
                        <tr>
                          <td>RIB:</td>
                          <td className="fw-medium">
                            {personnelDetails.identifinat_unique}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col lg={6}>
                  <h5 className="text-muted ">Responsabilité actuelle</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Catégorie: </td>
                          <td className="fw-medium">
                            {latestPosition.categorie.categorie_fr}/{latestPosition.categorie.categorie_ar}
                          </td>
                        </tr>
                        <tr>
                          <td>Grade: </td>
                          <td className="fw-medium">
                            {latestPosition.grade.grade_fr}/{latestPosition.grade.grade_ar}
                          </td>
                        </tr>
                        <tr>
                          <td>Date d'affectation: </td>
                          <td className="fw-medium">
                            {latestPosition.date_affectation}
                          </td>
                        </tr>
                        <tr>
                          <td>Date délivrance: </td>
                          <td className="fw-medium">
                            {latestPosition.date_depart}
                          </td>
                        </tr>
                        <tr>
                          <td>Date de désignation: </td>
                          <td className="fw-medium">
                            {latestPosition.date_titularisation}
                          </td>
                        </tr>
                        <tr>
                          <td>Service:</td>
                          <td className="fw-medium">
                            {servicePersonnelFR} / {servicePersonnelAR}{" "}
                          </td>
                        </tr>
                        {/* Diplome 1 */}
                        {personnelDetails.certif1 && (
                          <>
                            <tr>
                              <td>Diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.certif1}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.annee_certif1}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.entreprise1}
                              </td>
                            </tr>
                          </>
                        )}

                        {/* Diplome 2 */}
                        {personnelDetails.certif2 && (
                          <>
                            <tr>
                              <td>Diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.certif2}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.annee_certif2}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.entreprise2}
                              </td>
                            </tr>
                          </>
                        )}

                        {/* Diplome 3 */}
                        {personnelDetails.certif3 && (
                          <>
                            <tr>
                              <td>Diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.certif3}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.annee_certif3}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {personnelDetails.entreprise3}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col lg={6} className="mt-0">
                  <h5 className="text-muted pb-1 pt-2">Conjoint</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Nom du conjoint:</td>
                          <td className="fw-medium">
                            {personnelDetails.nom_conjoint}
                          </td>
                        </tr>

                        <tr>
                          <td>Profession du conjoint:</td>
                          <td className="fw-medium">
                            {personnelDetails.job_conjoint}
                          </td>
                        </tr>
                        <tr>
                          <td>Nombre des enfants:</td>
                          <td className="fw-medium">
                            {personnelDetails.nombre_fils}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="p-2">
                {/* <Col lg={6}>
                  <h5 className="text-muted pb-1 pt-2"> Baccalauréat</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0">
                      <tbody>
                        <tr>
                          <td>Année </td>
                          <td className="fw-medium">2022</td>
                        </tr>
                        <tr>
                          <td>Section</td>
                          <td className="fw-medium">علوم تجريبية</td>
                        </tr>
                        <tr>
                          <td>Session</td>
                          <td className="fw-medium">التدارك</td>
                        </tr>
                        <tr>
                          <td>Moyenne</td>
                          <td className="fw-medium">10.40</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col> */}
              </Row>
            </Card>
            {personnelDetails.historique_positions && personnelDetails.historique_positions.length > 0 && (
              <Card className="mt-4">
                <Card.Body>
                  <h5 className="text-muted">Historique Professionnel/ التسلسل المهني</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th>Poste</th>
                          <th>Grade</th>
                          <th>Catégorie</th>
                          <th>Date d'affectation</th>
                          <th>Fichier Affectation</th>
                          <th>Date de titularisation</th>
                          <th>Fichier Titularisation</th>
                          <th>Date de départ</th>
                          <th>Fichier Départ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personnelDetails.historique_positions.map((entry: any, index: number) => (
                          <tr key={index}>
                            <td>{entry.poste?.poste_fr || '-'}</td>
                            <td>{entry.grade?.grade_fr || '-'}</td>
                            <td>{entry.categorie?.categorie_fr || '-'}</td>

                            <td>{entry.date_affectation ? moment(entry.date_affectation).format('DD/MM/YYYY') : '-'}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openFileModal(entry.fichier_affectation, 'Fichier Affectation')}
                                disabled={!entry.fichier_affectation}
                              >
                                Affectation
                              </Button>
                            </td>

                            <td>{entry.date_titularisation ? moment(entry.date_titularisation).format('DD/MM/YYYY') : '-'}</td>
                            <td>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => openFileModal(entry.fichier_titularisation, 'Fichier Titularisation')}
                                disabled={!entry.fichier_titularisation}
                              >
                                Titularisation
                              </Button>
                            </td>

                            <td>{entry.date_depart ? moment(entry.date_depart).format('DD/MM/YYYY') : '-'}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => openFileModal(entry.fichier_depart, 'Fichier Départ')}
                                disabled={!entry.fichier_depart}
                              >
                                Départ
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}
            {personnelDetails.historique_services && personnelDetails.historique_services.length > 0 && (
              <Card className="mt-4">
                <Card.Body>
                  <h5 className="text-muted">Historique des services/ التسلسل في الخدمات</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Date d'affectation</th>
                          <th>Fichier Affectation</th>
                          <th>Date de fin</th>
                          <th>Fichier de fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personnelDetails.historique_services.map((entry: any, index: number) => (
                          <tr key={index}>
                            <td>{entry.service?.service_fr || '-'}</td>
                            <td>{entry.date_affectation ? moment(entry.date_affectation).format('DD/MM/YYYY') : '-'}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openFileModal(entry.fichier_affectation, 'Fichier Affectation')}
                                disabled={!entry.fichier_affectation}
                              >
                                fichier affectation
                              </Button>
                            </td>

                            <td>{entry.date_fin ? moment(entry.date_fin).format('DD/MM/YYYY') : '-'}</td>
                            <td>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => openFileModal(entry.fichier_fin, 'Fichier Titularisation')}
                                disabled={!entry.fichier_fin}
                              >
                                fichier fin
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}


            {/* documents */}

            {/* <div className="mt-3">
                      <ul className="list-unstyled hstack gap-2 mb-0">
                        <li>Documents:</li>
                        <li>
                        <Button type="button" className="btn btn-success btn-label"><i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i> CIN Face 1</Button>
                        </li>
                        <li>
                        <Button type="button" className="btn btn-danger btn-label"><i className="bi bi-card-list label-icon align-middle fs-16 me-2"></i> CIN Face 2</Button>

                        </li>
                        <li>
                        <Button type="button" className="btn btn-info btn-label"><i className="bi bi-file-text label-icon align-middle fs-16 me-2"></i> Fiche d'inscription</Button>

                        </li>
                       
                      </ul>
                    </div> */}
            {/* </Col> */}

            {/* <h5 className="text-muted "> Documents</h5> */}
            {/* <Row>
              <Col lg={3} className="d-flex flex-column ">
                <Image
                  src={cin1}
                  
                  className="figure-img img-fluid rounded hover-image"
                  onMouseEnter={(e) => handleHover(e, cin1)}
                  onMouseLeave={handleMouseLeave}
                  alt="..."
                />
                <Image
                  src={cin2}
                  onMouseEnter={(e) => handleHover(e, cin2)}
                  onMouseLeave={handleMouseLeave}
                  className="figure-img img-fluid rounded hover-image"
                  alt="..."
                />
               
              </Col>
              <Col lg={2}>
                <Image
                  src={paiement}
                  onMouseEnter={(e) => handleHover(e, paiement)}
                  onMouseLeave={handleMouseLeave}
                  className="figure-img img-fluid rounded h-100 hover-image"
                  alt="..."
                />
              </Col>
              <Col lg={2}>
                <Image
                  src={img1}
                  onMouseEnter={(e) => handleHover(e, img1)}
                  onMouseLeave={handleMouseLeave}
                  className="figure-img img-fluid rounded h-100 hover-image"
                  alt="..."
                />
              </Col>
              <Col lg={2}>
                <Image
                  src={img1}
                  className="figure-img img-fluid rounded h-100 hover-image"
                  alt="..."
                />
              </Col>
              <Col lg={2}>
                <Image
                  src={img1}
                  className="figure-img img-fluid rounded h-100 hover-image"
                  alt="..."
                />
              </Col>
              
            </Row> */}
            {/* <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={10}
                      pagination={{
                        el: ".swiper-pagination",
                        clickable: true,
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 40,
                        },
                        1024: {
                          slidesPerView: 4,
                          spaceBetween: 50,
                        },
                      }}
                      loop={true}
                      modules={[Pagination]}
                      className="mySwiper swiper responsive-swiper rounded gallery-light pb-4"
                    >
                      <div className="swiper-wrapper">
                        <SwiperSlide>
                          <div className="gallery-box card">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={cin1}
                                alt=""
                                onClick={() => handleImageClick(cin1)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="gallery-box card mb-0">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={cin2}
                                alt=""
                                onClick={() => handleImageClick(cin2)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="gallery-box card">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={paiement}
                                alt=""
                                onClick={() => handleImageClick(paiement)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="gallery-box card">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={img1}
                                alt=""
                                onClick={() => handleImageClick(img1)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="gallery-box card">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={img1}
                                alt=""
                                onClick={() => handleImageClick(img1)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="gallery-box card">
                            <Link className="image-popup" to="#" title="">
                              <Image
                                className="gallery-img img-fluid mx-auto"
                                src={img1}
                                alt=""
                                onClick={() => handleImageClick(img1)}
                              />
                            </Link>
                          </div>
                        </SwiperSlide>
                      </div>
                      <div className="swiper-pagination swiper-pagination-dark"></div>
                    </Swiper>
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}
            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Body>
                {clickedImage && (
                  <Image
                    className="modal-img img-fluid mx-auto"
                    src={clickedImage}
                    alt=""
                  />
                )}
              </Modal.Body>
            </Modal>
          </Tab.Pane>

          <Tab.Pane eventKey="Demandes">
            <Card>
              <Card.Header className="d-sm-flex align-items-center gap-3">
                <h5 className="card-title mb-0 flex-grow-1">Demandes</h5>
                <div className="search-box mt-3 mt-sm-0">
                  <Form.Control
                    type="text"
                    className="search w-md"
                    placeholder="Rechercher une demande..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </Card.Header>
              <DemandeTablePersonnel />
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="Reclamation">
            <Card>
              <Card.Header className="d-sm-flex align-items-center gap-3">
                <h5 className="card-title mb-0 flex-grow-1">Réclamations</h5>
                <div className="search-box mt-3 mt-sm-0">
                  <Form.Control
                    type="text"
                    className="search w-md"
                    placeholder="Rechercher une réclamation..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </Card.Header>
              <ReclamationTable />
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{fileTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title="Document Preview"
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          ) : (
            <p>Fichier introuvable.</p>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ProfilPersonnel;