import React, { useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import userImage from "assets/images/etudiant.png";

const DetailsStagePfe = () => {
  document.title = "Détails PFE | ENIGA";

  const location = useLocation();
  const stageDetails = location.state;

  const [showPropositionSigneModal, setShowPropositionSigneModal] =
    useState<boolean>(false);
  const [showAttestationModal, setShowAttestationModal] =
    useState<boolean>(false);
  const [showRapportModal, setShowRapportModal] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleShowPropositionSigneModal = (file: any) => {
    setFileUrl(file);
    setShowPropositionSigneModal(true);
  };

  const handleShowAttestationModal = (file: any) => {
    setFileUrl(file);
    setShowAttestationModal(true);
  };

  const handleShowRapportModal = (file: any) => {
    setFileUrl(file);
    setShowRapportModal(true);
  };

  const handleClosePropositionSigneModal = () =>
    setShowPropositionSigneModal(false);

  const handleCloseAttestationModal = () => setShowAttestationModal(false);
  const handleCloseRapportModal = () => setShowRapportModal(false);

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);
  const basePath = `${process.env.REACT_APP_API_URL}/files/`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <Card.Header className="bg-secondary-subtle text-dark-emphasis">
              <span className="fs-20 fw-bold">Information Etudiant(e)</span>
            </Card.Header>
            <Card.Body className="border border-end">
              <Row>
                <Col lg={2}>
                  <img
                    className="rounded-start img-fluid h-80 object-cover"
                    src={
                      stageDetails.etudiant.photo_profil
                        ? `${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${stageDetails.etudiant.photo_profil}`
                        : userImage
                    }
                    alt="Photo Profile"
                    onError={(e) => {
                      e.currentTarget.src = userImage;
                    }}
                    width="120"
                  />
                </Col>
                <Col>
                  <Row className="mb-2">
                    <Col>
                      <span>Nom & Prénom</span>
                    </Col>
                    <Col>
                      <span>
                        {stageDetails.etudiant.prenom_fr}{" "}
                        {stageDetails.etudiant.nom_fr}
                      </span>
                    </Col>
                    <Col>
                      <span>Groupe</span>
                    </Col>
                    <Col>
                      <span>{stageDetails.etudiant.Groupe}</span>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <span>N° Tél</span>
                    </Col>
                    <Col>
                      <span>{stageDetails.etudiant.num_phone}</span>
                    </Col>
                    <Col>
                      <span>Spécialité</span>
                    </Col>
                    <Col>
                      <span>{stageDetails.etudiant.Spécialité}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <span>Email</span>
                    </Col>
                    <Col>
                      <span>{stageDetails.etudiant.email}</span>
                    </Col>
                    <Col>
                      <span>Diplôme</span>
                    </Col>
                    <Col>
                      <span>{stageDetails.etudiant.DIPLOME}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
            <Card.Body className="text-center">
              <Row>
                <Col>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/files/propositionFiles/${stageDetails.file_proposition}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-soft-info view-item-btn"
                  >
                    <i
                      className="ph ph-file-arrow-down"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "3.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                    <p className="mt-1">Proposition Stage</p>
                  </a>
                </Col>
                <Col>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/files/affectationEtudiantFiles/${stageDetails.file_affectation_etudiant}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-soft-secondary view-item-btn"
                  >
                    <i
                      className="ph ph-file-arrow-down"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "3.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                    <p className="mt-1">Affectation Stage Etudiant</p>
                  </a>
                </Col>
                <Col>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/files/affectationBinomeFiles/${stageDetails.file_affectation_binome}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-soft-warning view-item-btn"
                  >
                    <i
                      className="ph ph-file-arrow-down"
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        cursor: "pointer",
                        fontSize: "3.5em",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.3)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                    <p className="mt-1">Affectation Stage Binôme</p>
                  </a>
                </Col>
              </Row>
            </Card.Body>
            <Card.Header className="bg-primary opacity-50 text-white">
              <span className="fs-20 fw-bold">Information Société</span>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col lg={2}>Nom Société</Col>
                <Col>{stageDetails.societe.nom}</Col>
                <Col>Encadrant Société</Col>
                <Col>{stageDetails.encadrant_societe}</Col>
              </Row>
              <Row>
                <Col lg={2}>Informations</Col>
                <Col>{stageDetails.societe.infos}</Col>
              </Row>
            </Card.Body>
            <Card.Header className="bg-info-subtle text-dark-emphasis">
              <span className="fs-20 fw-bold">Information Projet</span>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col>Date Début</Col>
                <Col>{stageDetails.date_debut}</Col>
                <Col>Date Fin</Col>
                <Col>{stageDetails.date_fin}</Col>
                <Col>Date Soutenance</Col>
                <Col>{stageDetails.date_soutenance}</Col>
              </Row>
              <Row className="mb-2">
                <Col lg={2}>Encadrant</Col>
                <Col>
                  {stageDetails.encadrant_univ.prenom_fr}
                  {stageDetails.encadrant_univ.nom_fr}
                </Col>
                <Col>Status</Col>
                <Col>{stageDetails.status_stage}</Col>
              </Row>
              <Row className="mb-2">
                <Col lg={2}>Sujet Projet</Col>
                <Col>{stageDetails.sujet}</Col>
              </Row>
              <Row className="mb-2">
                <Col lg={2}>Description</Col>
                <Col>{stageDetails.description}</Col>
              </Row>
              {/* <Row className="mb-2">
                <Col lg={2}>Description</Col>
                <Col>{stageDetails.description}</Col>
              </Row> */}
              <Row className="mb-2">
                <Col lg={2}>Décision</Col>
                <Col>{stageDetails.avis}</Col>
              </Row>
              <Row className="mb-2">
                <Col lg={2}></Col>
                <Col>{stageDetails.note}</Col>
              </Row>
            </Card.Body>
            <Card.Header className="bg-warning-subtle text-dark">
              <span className="fs-20 fw-bold">Information Binôme</span>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <span>Nom & Prénom</span>
                </Col>
                <Col>
                  <span>
                    {stageDetails.binome.prenom_fr} {stageDetails.binome.nom_fr}
                  </span>
                </Col>
                <Col lg={1}>
                  <span>N° Tél</span>
                </Col>
                <Col>
                  <span>{stageDetails.binome.num_phone}</span>
                </Col>
                <Col lg={1}>
                  <span>Email</span>
                </Col>
                <Col>
                  <span>{stageDetails.binome.email}</span>
                </Col>
              </Row>
            </Card.Body>
            <Card.Header className="bg-success-subtle text-dark">
              <span className="fs-20 fw-bold">Les pièces jointes</span>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col
                  className="border-2 border-end"
                  style={{ position: "relative" }}
                >
                  <div className="vstack gap-3">
                    <span className="fs-15 fw-medium">
                      Proposition pfe signé
                    </span>
                    {isImageFile(
                      `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                    ) && (
                      <>
                        <img
                          src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                          alt="Proposition PFE Signé"
                          style={{ width: "100%", height: "auto" }}
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowPropositionSigneModal(
                              `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher l'Image
                        </Button>
                      </>
                    )}
                    {isPDFFile(
                      `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                    ) && (
                      <>
                        <iframe
                          src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                          style={{
                            border: "none",
                            width: "100%",
                            height: "200px",
                          }}
                          title="Proposition PFE Signé"
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowPropositionSigneModal(
                              `${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher PDF
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
                <Col
                  className="border-2 border-end"
                  style={{ position: "relative" }}
                >
                  <div className="vstack gap-3">
                    <span className="fs-15 fw-medium">
                      Attestation de stage
                    </span>
                    {isImageFile(
                      `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                    ) && (
                      <>
                        <img
                          src={`${basePath}/attestationFiles/${stageDetails.file_attestation}`}
                          alt="Attestation de stage"
                          style={{ width: "100%", height: "auto" }}
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowAttestationModal(
                              `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher l'Image
                        </Button>
                      </>
                    )}
                    {isPDFFile(
                      `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                    ) && (
                      <>
                        <iframe
                          src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                          style={{
                            border: "none",
                            width: "100%",
                            height: "200px",
                          }}
                          title="Attestation de stage"
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowAttestationModal(
                              `${basePath}/attestationFiles/${stageDetails.file_attestation}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher PDF
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
                <Col>
                  <div className="vstack gap-3">
                    <span className="fs-15 fw-medium">Rapport</span>
                    {isImageFile(
                      `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                    ) && (
                      <>
                        <img
                          src={`${basePath}/rapportFiles/${stageDetails.file_rapport}`}
                          alt="Rapport"
                          style={{ width: "100%", height: "auto" }}
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowRapportModal(
                              `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher l'Image
                        </Button>
                      </>
                    )}
                    {isPDFFile(
                      `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                    ) && (
                      <>
                        <iframe
                          src={`${basePath}/propositionSigneFiles/${stageDetails.file_proposition_signe}`}
                          style={{
                            border: "none",
                            width: "100%",
                            height: "200px",
                          }}
                          title="Rapport"
                        />
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleShowRapportModal(
                              `${basePath}/rapportFiles/${stageDetails.file_rapport}`
                            )
                          }
                          style={{
                            position: "absolute",
                            top: 36,
                            left: 10,
                            width: "94%",
                            height: "91%",
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
                          Afficher PDF
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Modal
        show={showPropositionSigneModal}
        onHide={handleClosePropositionSigneModal}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Proposition PFE Signé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="Proposition PFE Signé"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showAttestationModal}
        onHide={handleCloseAttestationModal}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Attestation de stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="Attestation de stage"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showRapportModal} onHide={handleCloseRapportModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Visionneuse Rapport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImageFile(fileUrl) ? (
            <img
              src={fileUrl}
              alt="View Image"
              style={{ width: "100%", height: "auto" }}
            />
          ) : isPDFFile(fileUrl) ? (
            <iframe src={fileUrl} width="100%" height="700px" />
          ) : (
            <p>Aucun document à afficher.</p>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default DetailsStagePfe;
