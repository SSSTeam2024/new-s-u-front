import React, { useEffect, useState } from "react";
import { Card, Nav, Tab, Row, Col, Table, Image, Modal, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DemandeTableEnseignant from "./DemandeTableEnseignant";
import ReclamationTableEnseignant from "./ReclamationTableEnseignant";
import { useFetchEnseignantByIdQuery, Enseignant } from "features/enseignant/enseignantSlice";

import "./hover.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import userImage from "assets/images/etudiant.png";

const ProfilEnseignant = () => {
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const [idFromRoute, setIdFromRoute] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as Enseignant | { _id: string } | undefined;
  const passedId = locationState ? (locationState as Enseignant)._id : undefined;
  
  const { data: fetchedEnseignant, isLoading } = useFetchEnseignantByIdQuery(
    { _id: idFromRoute! }, 
    { skip: !idFromRoute }
  );

  // Fetch the article by ID if passed, otherwise use location state data
  const { data: fetchedArticle, isLoading: isLoadingById } = useFetchEnseignantByIdQuery({ _id: passedId || "" }, {
    skip: !passedId,
  });

  const enseignantDetails = passedId ? fetchedArticle : (locationState as Enseignant);

  useEffect(() => {
    if (!passedId && !enseignantDetails) {
     
      navigate('/gestion-etudiant/liste-etudiants');
    }
  }, [passedId, enseignantDetails, navigate]);

  if (isLoadingById || isLoading) {
    return <p>Chargement...</p>; // or a loading spinner
  }

  if (!enseignantDetails) {
    return <p>enseignant  non trouvé.</p>;
  }


  console.log("enseignantDetails",enseignantDetails);
  const handleImageClick = (imageSrc: any) => {
    setClickedImage(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
  };
  //Poste enseignant
  const posteEnseignantFR =
    typeof enseignantDetails?.poste! === "object"
      ? enseignantDetails?.poste?.poste_fr!
      : enseignantDetails?.poste!;

  const posteEnseignantAR =
    typeof enseignantDetails?.poste! === "object"
      ? enseignantDetails?.poste?.poste_ar!
      : enseignantDetails?.poste!;
  // etat compte enseignant
  const etatCompteDisplayFR =
    typeof enseignantDetails?.etat_compte! === "object"
      ? enseignantDetails?.etat_compte?.etat_fr!
      : enseignantDetails?.etat_compte!;

  const etatCompteDisplayAR =
    typeof enseignantDetails?.etat_compte! === "object"
      ? enseignantDetails?.etat_compte?.etat_ar!
      : enseignantDetails?.etat_compte!;
  //specialite enseignant
  const specialiteEnseignantFR =
    typeof enseignantDetails?.specilaite! === "object"
      ? enseignantDetails?.specilaite?.specialite_fr!
      : enseignantDetails?.specilaite!;
  const specialiteEnseignantAR =
    typeof enseignantDetails?.specilaite! === "object"
      ? enseignantDetails?.specilaite?.specialite_ar!
      : enseignantDetails?.specilaite!;

  //grade enseignant
  const gradeEnseignantFR =
    typeof enseignantDetails?.grade! === "object"
      ? enseignantDetails?.grade?.grade_fr!
      : enseignantDetails?.grade!;
  const gradeEnseignantAR =
    typeof enseignantDetails?.grade! === "object"
      ? enseignantDetails?.grade?.grade_ar!
      : enseignantDetails?.grade!;

  //departement enseignant
  const departementEnseignantFR =
    typeof enseignantDetails?.departements! === "object"
      ? enseignantDetails?.departements?.name_fr!
      : enseignantDetails?.departements!;
  const departementEnseignantAR =
    typeof enseignantDetails?.departements! === "object"
      ? enseignantDetails?.departements?.name_ar!
      : enseignantDetails?.departements!;
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
            <Link to="/gestion-enseignant/edit-compte-enseignant" className="btn btn-success">
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
                      enseignantDetails.photo_profil
                        ? `${process.env.REACT_APP_API_URL}/files/enseignantFiles/PhotoProfil/${enseignantDetails.photo_profil}`
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
                        {enseignantDetails.nom_fr} {enseignantDetails.prenom_fr}
                      </h5>
                      <p className="text-muted mb-0">
                        {" "}
                        {enseignantDetails.nom_ar} {enseignantDetails.prenom_ar}
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
                                  {posteEnseignantFR} / {posteEnseignantAR}
                                </td>
                              </tr>
                              <tr>
                                <td>CIN</td>
                                <td className="fw-medium">
                                  {enseignantDetails.num_cin}
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
                                    {enseignantDetails.matricule}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>Etat de Compte</td>
                                <td className="fw-medium">
                                  <span className="badge badge-label bg-warning">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    {enseignantDetails.etat_compte?.etat_fr!}
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
                          <td className="fw-medium">
                            {enseignantDetails.sexe}
                          </td>
                        </tr>

                        <tr>
                          <td>Nationnalité:</td>
                          <td className="fw-medium">
                            {enseignantDetails.nationalite}
                          </td>
                        </tr>
                        <tr>
                          <td>Etat civil:</td>
                          <td className="fw-medium">
                            {enseignantDetails.etat_civil}
                          </td>
                        </tr>
                        <tr>
                          <td>Date de naissance:</td>
                          <td className="fw-medium">
                            {enseignantDetails.date_naissance}
                          </td>
                        </tr>
                        <tr>
                          <td>Lieu de naissance:</td>
                          <td className="fw-medium">
                            {enseignantDetails.lieu_naissance_ar} /{" "}
                            {enseignantDetails.lieu_naissance_fr}
                          </td>
                        </tr>


                        <tr>
                          <td> Adresse:</td>
                          <td className="fw-medium">
                            {enseignantDetails.adress_fr} /{" "}
                            {enseignantDetails.adress_ar}
                          </td>
                        </tr>
                        <tr>
                          <td>Email:</td>
                          <td className="fw-medium">
                            {enseignantDetails.email}
                          </td>
                        </tr>
                        <tr>
                          <td>Téléphone 1:</td>
                          <td className="fw-medium">
                            {enseignantDetails.num_phone1}
                          </td>
                        </tr>
                        <tr>
                          <td>Téléphone 2:</td>
                          <td className="fw-medium">
                            {enseignantDetails.num_phone2}
                          </td>
                        </tr>
                        <tr>
                          <td>Compte Courant:</td>
                          <td className="fw-medium">
                            {enseignantDetails.compte_courant}
                          </td>
                        </tr>
                        <tr>
                          <td>RIB:</td>
                          <td className="fw-medium">
                            {enseignantDetails.identifinat_unique}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col lg={6}>
                  <h5 className="text-muted ">Enseignant</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Spécialité: </td>
                          <td className="fw-medium">
                            {specialiteEnseignantFR} / {specialiteEnseignantAR}
                          </td>
                        </tr>
                        <tr>
                          <td>Grade: </td>
                          <td className="fw-medium">
                            {gradeEnseignantFR} / {gradeEnseignantAR}
                          </td>
                        </tr>
                        <tr>
                          <td>Date d'affectation: </td>
                          <td className="fw-medium">
                            {enseignantDetails.date_affectation}
                          </td>
                        </tr>
                        <tr>
                          <td>Date délivrance: </td>
                          <td className="fw-medium">
                            {enseignantDetails.date_delivrance}
                          </td>
                        </tr>
                        <tr>
                          <td>Département:</td>
                          <td className="fw-medium">
                            {departementEnseignantFR} /{" "}
                            {departementEnseignantAR}{" "}
                          </td>
                        </tr>
                        {/* Diplome 1 */}
                        {enseignantDetails.certif1 && (
                          <>
                            <tr>
                              <td>Diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.certif1}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.annee_certif1}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 1: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.entreprise1}
                              </td>
                            </tr>
                          </>
                        )}

                        {/* Diplome 2 */}
                        {enseignantDetails.certif2 && (
                          <>
                            <tr>
                              <td>Diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.certif2}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.annee_certif2}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 2: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.entreprise2}
                              </td>
                            </tr>
                          </>
                        )}

                        {/* Diplome 3 */}
                        {enseignantDetails.certif3 && (
                          <>
                            <tr>
                              <td>Diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.certif3}
                              </td>
                            </tr>
                            <tr>
                              <td>Année diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.annee_certif3}
                              </td>
                            </tr>
                            <tr>
                              <td>Etablissement diplome 3: </td>
                              <td className="fw-medium">
                                {" "}
                                {enseignantDetails.entreprise3}
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
                          <td className="fw-medium">{enseignantDetails.nom_conjoint}</td>
                        </tr>

                        <tr>
                          <td>Profession du conjoint:</td>
                          <td className="fw-medium">{enseignantDetails.job_conjoint
                          }</td>
                        </tr>
                        <tr>
                          <td>Nombre des enfants:</td>
                          <td className="fw-medium">{enseignantDetails.nombre_fils}</td>
                        </tr>
                     
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="p-2">
             
               
              </Row>
            </Card>

         

           
          

           
          
         
           
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
              <DemandeTableEnseignant />
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
              <ReclamationTableEnseignant />
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </React.Fragment>
  );
};

export default ProfilEnseignant;