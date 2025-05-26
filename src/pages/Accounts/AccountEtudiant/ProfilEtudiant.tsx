import React, { useEffect, useState } from "react";
import {
  Card,
  Nav,
  Row,
  Col,
  Table,
  Image,
  Tab,
  Form,
  Modal,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useFetchEtudiantByIdQuery,
  Etudiant,
} from "features/etudiant/etudiantSlice";
import userImage from "assets/images/etudiant.png";
import DemandeTable from "./DemandeTable";
import ReclamationTable from "./ReclamationTable";

const MyAccount = () => {
  const [idFromRoute, setIdFromRoute] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const location = useLocation();
  const locationState = location?.state! as
    | Etudiant
    | { _id: string }
    | undefined;
  const passedId = locationState ? (locationState as Etudiant)._id! : undefined;

  const { data: fetchedEtudiant, isLoading } = useFetchEtudiantByIdQuery(
    { _id: idFromRoute! },
    { skip: !idFromRoute }
  );

  // Fetch the article by ID if passed, otherwise use location state data
  const { data: fetchedArticle, isLoading: isLoadingById } =
    useFetchEtudiantByIdQuery(
      { _id: passedId || "" },
      {
        skip: !passedId,
      }
    );

  const etudiant = passedId ? fetchedArticle : (locationState as Etudiant);

  useEffect(() => {
    if (!passedId && !etudiant) {
      navigate("/gestion-etudiant/liste-etudiants");
    }
  }, [passedId, etudiant, navigate]);

  if (isLoadingById || isLoading) {
    return <p>Chargement...</p>; // or a loading spinner
  }

  if (!etudiant) {
    return <p>Etudiant non trouvé.</p>;
  }

  const handleShowPdfModal = (file: any) => {
    setPdfUrl(file);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => setShowPdfModal(false);

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);

  // Construct the full URLs for the images
  const basePath = `${process.env.REACT_APP_API_URL}/files/etudiantFiles/`;
  const face1CINPath = `${basePath}Face1CIN/`;
  const face2CINPath = `${basePath}Face2CIN/`;
  const fichePaiementPath = `${basePath}FichePaiement/`;

  const files = [
    `${face1CINPath}${etudiant?.face_1_CIN}`,
    `${face2CINPath}${etudiant?.face_2_CIN}`,
    `${fichePaiementPath}${etudiant?.fiche_paiement}`,
  ];

  const groupeClasseDisplay =
    typeof etudiant?.groupe_classe === "object"
      ? etudiant?.groupe_classe?.nom_classe_fr || ""
      : etudiant?.groupe_classe || "";

  const niveauClasseDisplay =
    typeof etudiant?.groupe_classe?.niveau_classe === "object"
      ? etudiant?.groupe_classe?.niveau_classe?.name_niveau_fr || ""
      : etudiant?.groupe_classe?.niveau_classe || "";

  const etatCompteDisplay =
    typeof etudiant?.etat_compte === "object"
      ? etudiant?.etat_compte?.etat_fr || ""
      : etudiant?.etat_compte || "";

  const typeInscriptionDisplay =
    typeof etudiant?.type_inscription === "object"
      ? etudiant?.type_inscription?.type_fr || ""
      : etudiant?.type_inscription || "";

  const getSectionNames = (etudiant: any) => {
    if (Array.isArray(etudiant?.groupe_classe?.niveau_classe?.sections!)) {
      return etudiant?.groupe_classe?.niveau_classe?.sections.map(
        (section: any) => section.name_section_fr
      );
    } else {
      return [];
    }
  };

  const sectionNames = getSectionNames(etudiant);

  // const etatCompteDisplay =
  //   typeof etudiant?.etat_compte! === "object"
  //     ? etudiant?.etat_compte?.etat_fr!
  //     : etudiant?.etat_compte!;

  // const typeInscriptionDisplay =
  //   typeof etudiant?.type_inscription! === "object"
  //     ? etudiant?.type_inscription?.type_fr!
  //     : etudiant?.type_inscription!;

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
          {/* <div className="flex-shrink-0">
            <Link to="/settings" className="btn btn-success">
              Modifier le profil
            </Link>
          </div> */}
        </div>

        {/* Profile Tab Content */}
        {/* <Tab.Content className="text-muted">
          <Tab.Pane eventKey="Profil">
            <Card>
              <Row className="g-0">
                <Col md={3}>
                  <img
                    className="rounded-start img-fluid h-100 object-cover"
                    src={
                      etudiant.photo_profil
                        ? `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiant?.photo_profil!}`
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
                      <h5>{etudiant?.nom_fr!} {etudiant?.prenom_fr!}</h5>
                      <p className="text-muted mb-0">
                        {etudiant?.nom_ar!} {etudiant?.prenom_ar!}
                      </p>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col lg={6}>
                        <Table className="table-borderless table-sm m-0 p-0">
                          <tbody>
                            <tr>
                              <td>Groupe</td>
                              <td className="fw-medium">{groupeClasseDisplay}</td>
                            </tr>
                            <tr>
                              <td>Cin</td>
                              <td className="fw-medium">{etudiant?.num_CIN!}</td>
                            </tr>
                            <tr>
                              <td>Téléphone</td>
                              <td className="fw-medium">{etudiant?.num_phone!}</td>
                            </tr>
                            <tr>
                              <td>Compte Verifié</td>
                              <td className="fw-medium">
                                <span className="badge badge-label bg-primary">
                                  <i className="mdi mdi-circle-medium"></i> Oui
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col lg={6}>
                        <Table className="table-borderless table-sm m-0 p-0">
                          <tbody>
                            <tr>
                              <td>Etat de Compte</td>
                              <td className="fw-medium">
                                <span className="badge badge-label bg-warning">
                                  <i className="mdi mdi-circle-medium"></i> {etatCompteDisplay}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Type d'inscription</td>
                              <td className="fw-medium">
                                <span className="badge badge-label bg-secondary fs-6">
                                  <i className="mdi mdi-circle-medium"></i> {typeInscriptionDisplay}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Niveau</td>
                               
                            </tr>
                            <tr>
                              <td>Filière</td>
                              <td className="fw-medium">{sectionNames.join(', ')}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <Card>
              <Row className="p-2">
                <Col lg={6} className="border-end">
                  <h5 className="text-muted">Informations Personnelles</h5>
                  <Table className="table-borderless table-sm m-0 p-0">
                    <tbody>
                      <tr>
                        <td>Genre</td>
                        <td className="fw-medium">{etudiant?.sexe!}</td>
                      </tr>
                      <tr>
                        <td>Etat civil</td>
                        <td className="fw-medium">{etudiant?.etat_civil!}</td>
                      </tr>
                      <tr>
                        <td>Date naissance</td>
                        <td className="fw-medium">{etudiant?.date_naissance!}</td>
                      </tr>
                      <tr>
                        <td>Lieu de naissance</td>
                        <td className="fw-medium">
                          {etudiant?.lieu_naissance_ar!} / {etudiant?.lieu_naissance_fr!}
                        </td>
                      </tr>
                      <tr>
                        <td>Téléphone Etudiant</td>
                        <td className="fw-medium">{etudiant?.num_phone!}</td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td className="fw-medium">{etudiant?.email!}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={6}>
                  <h5 className="text-muted">Adresse de l'etudiant</h5>
                  <Table className="table-borderless table-sm m-0 p-0">
                    <tbody>
                      <tr>
                        <td>Nationalité</td>
                        <td className="fw-medium">{etudiant?.nationalite!}</td>
                      </tr>
                      <tr>
                        <td>Gouvernorat</td>
                        <td className="fw-medium">{etudiant?.state!}</td>
                      </tr>
                      <tr>
                        <td>Ville</td>
                        <td className="fw-medium">{etudiant?.dependence!}</td>
                      </tr>
                      <tr>
                        <td>Adresse</td>
                        <td className="fw-medium">{etudiant?.adress_fr!}</td>
                      </tr>
                      <tr>
                        <td>Code postale</td>
                        <td className="fw-medium">{etudiant.code_postale!}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card>
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
           <DemandeTable />
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
        </Tab.Content> */}

        <Tab.Content className="text-muted" id="profil-content">
          <Tab.Pane eventKey="Profil">
            <Card>
              <Row className="g-0">
                <Col md={2}>
                  <img
                    className="rounded-start img-fluid h-80 object-cover"
                    src={
                      etudiant.photo_profil
                        ? `http://localhost:7000/files/etudiantFiles/PhotoProfil/${etudiant.photo_profil}`
                        : userImage
                    }
                    alt="Photo Profile"
                    onError={(e) => {
                      e.currentTarget.src = userImage;
                    }}
                  />
                </Col>
                <Col md={10}>
                  <Card.Header>
                    <div className="flex-grow-1 card-title mb-0">
                      <h5>
                        {etudiant.nom_fr} {etudiant.prenom_fr}
                      </h5>
                      <p className="text-muted mb-0">
                        {etudiant.nom_ar} {etudiant.prenom_ar}
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
                                <td>Groupe</td>
                                <td className="fw-medium">
                                  {groupeClasseDisplay}
                                </td>
                              </tr>
                              <tr>
                                <td>Cin</td>
                                <td className="fw-medium">
                                  {etudiant.num_CIN}
                                </td>
                              </tr>
                              <tr>
                                <td>Téléphone</td>
                                <td className="fw-medium">
                                  {etudiant.num_phone}
                                </td>
                              </tr>
                              <tr>
                                <td>Compte Verifié</td>
                                <td className="fw-medium">
                                  {" "}
                                  <span className="badge badge-label bg-primary">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    Oui
                                  </span>
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
                                <td>Etat de Compte</td>
                                <td className="fw-medium">
                                  <span className="badge badge-label bg-warning">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    {etatCompteDisplay}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>Type d'inscription</td>
                                <td className="fw-medium">
                                  <span className="badge badge-label bg-secondary fs-6">
                                    <i className="mdi mdi-circle-medium"></i>{" "}
                                    {typeInscriptionDisplay}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>Niveau</td>
                                <td className="fw-medium">
                                  {niveauClasseDisplay}
                                </td>
                              </tr>
                              <tr>
                                <td>Filière</td>
                                <td className="fw-medium">{sectionNames}</td>
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
              <Row className="p-2">
                <Col lg={6} className="border-end">
                  <h5 className="text-muted"> Informations Personnelles</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Genre</td>
                          <td className="fw-medium">{etudiant.sexe}</td>
                        </tr>

                        <tr>
                          <td>Etat civil</td>
                          <td className="fw-medium">{etudiant.etat_civil}</td>
                        </tr>
                        <tr>
                          <td>Date naissance </td>
                          <td className="fw-medium">
                            {etudiant.date_naissance}
                          </td>
                        </tr>
                        <tr>
                          <td>Lieu de naissance</td>
                          <td className="fw-medium">
                            {etudiant.lieu_naissance_ar} /{" "}
                            {etudiant.lieu_naissance_fr}
                          </td>
                        </tr>
                        <tr>
                          <td>Téléphone Etudiant</td>
                          <td className="fw-medium">{etudiant.num_phone}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td className="fw-medium">{etudiant.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col lg={6}>
                  <h5 className="text-muted "> Adresse de l'etudiant</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Nationalité </td>
                          <td className="fw-medium">{etudiant.nationalite}</td>
                        </tr>
                        <tr>
                          <td>Gouvernorat</td>
                          <td className="fw-medium">{etudiant.state}</td>
                        </tr>
                        <tr>
                          <td>Municipalité </td>
                          <td className="fw-medium">{etudiant.dependence}</td>
                        </tr>
                        <tr>
                          <td>Adresse Domicile FR</td>
                          <td className="fw-medium">{etudiant.adress_fr}</td>
                        </tr>
                        <tr>
                          <td>Adresse Domicile AR</td>
                          <td className="fw-medium">{etudiant.adress_ar}</td>
                        </tr>
                        <tr>
                          <td>Code Postal</td>
                          <td className="fw-medium">{etudiant.code_postale}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="p-2">
                <Col lg={6} className="border-end ">
                  <h5 className="text-muted pb-1 pt-2 "> Parents</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0 ">
                      <tbody>
                        <tr>
                          <td>Nom et prénom père</td>
                          <td className="fw-medium">{etudiant.nom_pere}</td>
                        </tr>

                        <tr>
                          <td>Profession de père </td>
                          <td className="fw-medium">{etudiant.job_pere}</td>
                        </tr>
                        <tr>
                          <td>Nom et prénom mère </td>
                          <td className="fw-medium">{etudiant.nom_mere}</td>
                        </tr>
                        <tr>
                          <td>Téléphone famille</td>
                          <td className="fw-medium">
                            {etudiant.num_phone_tuteur}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col lg={6}>
                  <h5 className="text-muted pb-1 pt-2"> Baccalauréat</h5>
                  <div className="table-responsive">
                    <Table className="table-borderless table-sm m-0 p-0">
                      <tbody>
                        <tr>
                          <td>Année </td>
                          <td className="fw-medium">
                            {etudiant.annee_scolaire}
                          </td>
                        </tr>
                        <tr>
                          <td>Section</td>
                          <td className="fw-medium">{etudiant.filiere}</td>
                        </tr>
                        <tr>
                          <td>Session</td>
                          <td className="fw-medium">{etudiant.session}</td>
                        </tr>
                        <tr>
                          <td>Moyenne</td>
                          <td className="fw-medium">{etudiant.moyen}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Card>

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

            <h5 className="text-muted "> Documents</h5>
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
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body className="d-flex">
                    {files.map((file, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        {isImageFile(file) ? (
                          <img
                            src={file}
                            alt={`File ${index + 1}`}
                            style={{ width: "100%", height: "300px" }}
                          />
                        ) : isPDFFile(file) ? (
                          <>
                            <iframe
                              src={file}
                              style={{
                                border: "none",
                                width: "500px",
                                height: "290px",
                              }}
                              title={`PDF ${index + 1}`}
                            />
                            <button
                              onClick={() => handleShowPdfModal(file)}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                zIndex: 10,
                              }}
                            >
                              View PDF
                            </button>
                          </>
                        ) : (
                          <p>Unsupported file format</p>
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              {/* Modal for PDF Viewing */}
              <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Document Viewer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {pdfUrl ? (
                    <iframe src={pdfUrl} width="100%" height="700px" />
                  ) : (
                    <p>No document to display.</p>
                  )}
                </Modal.Body>
              </Modal>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="Demandes">
            <Card>
              {/* <Card.Header className="d-sm-flex align-items-center gap-3">
                <h5 className="card-title mb-0 flex-grow-1">Demandes</h5>
                <div className="search-box mt-3 mt-sm-0">
                  <Form.Control
                    type="text"
                    className="search w-md"
                    placeholder="Rechercher une demande..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </Card.Header> */}
              <DemandeTable />
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="Reclamation">
            <Card>
              {/* <Card.Header className="d-sm-flex align-items-center gap-3">
                <h5 className="card-title mb-0 flex-grow-1">Réclamations</h5>
                <div className="search-box mt-3 mt-sm-0">
                  <Form.Control
                    type="text"
                    className="search w-md"
                    placeholder="Rechercher une réclamation..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </Card.Header> */}
              <ReclamationTable />
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </React.Fragment>
  );
};

export default MyAccount;
