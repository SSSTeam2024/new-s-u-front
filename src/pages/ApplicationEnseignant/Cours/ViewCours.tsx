import { useState } from "react";
import { Container, Row, Card, Col, Button, Modal } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";

const ViewCours = () => {
  const location = useLocation();
  const coursDetails = location?.state?.coursDetails;
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [showFileModal, setShowFileModal] = useState<boolean>(false);

  const handleShowFileModal = (file: any) => {
    setFileUrl(file);
    setShowFileModal(true);
  };

  const handleCloseFileModal = () => setShowFileModal(false);
  console.log(coursDetails); // Debugging

  const isImageFile = (url: string) => /\.(jpeg|jpg|gif|png)$/i.test(url);
  const isPDFFile = (url: string) => /\.pdf$/i.test(url);
  const isPowerPointFile = (url: string) => /\.(pptx|ppt|ppsx)$/i.test(url);
  const isExcelFile = (url: string) => /\.(xlsx|xls)$/i.test(url);

  const basePath = `${process.env.REACT_APP_API_URL}/files/Cours/`;
  const files =
    coursDetails?.file_cours?.map((file: string) => `${basePath}${file}`) || [];
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="Détails des Cours"
          pageTitle="Application Enseignant"
        />

        <Col lg={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-warning text-white text-center">
              <h4 className="mb-0">Détails de Cours</h4>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col lg={3}>
                  <span className="fw-medium">Classe(s)</span>
                </Col>
                <Col lg={9}>
                  <i>
                    {coursDetails.classe
                      ?.map((classe: any) => classe.nom_classe_fr)
                      .join(" / ")}
                  </i>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg={3}>
                  <span className="fw-medium">Matière</span>
                </Col>
                <Col lg={9}>
                  <i>{coursDetails.nom_cours}</i>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={3}>
                  <span className="fw-medium">Semestre</span>
                </Col>
                <Col lg={9}>
                  <i>{coursDetails.trimestre}</i>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg={3}>
                  <span className="fw-medium">Enseignant</span>
                </Col>
                <Col lg={9}>
                  <i>
                    {coursDetails.enseignant?.nom_fr}{" "}
                    {coursDetails.enseignant?.prenom_fr}
                  </i>
                </Col>
              </Row>
              <Row>
                {files.some(
                  (file: any) => isImageFile(file) || isPDFFile(file)
                ) ? (
                  <Col lg={12}>
                    <Card>
                      <Card.Body>
                        <Row>
                          {files
                            .filter(
                              (file: any) =>
                                isImageFile(file) || isPDFFile(file)
                            )
                            .map((file: any, index: any) => (
                              <Col key={index} lg={4} className="mb-4">
                                <Card>
                                  <Card.Body style={{ position: "relative" }}>
                                    {isImageFile(file) ? (
                                      <>
                                        <img
                                          src={file}
                                          alt={`File ${index + 1}`}
                                          style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                          }}
                                          onClick={() =>
                                            handleShowFileModal(file)
                                          }
                                        />
                                        <Button
                                          variant="primary"
                                          onClick={() =>
                                            handleShowFileModal(file)
                                          }
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.5)",
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
                                    ) : isPDFFile(file) ? (
                                      <>
                                        <iframe
                                          src={file}
                                          style={{
                                            border: "none",
                                            width: "100%",
                                            height: "200px",
                                          }}
                                          title={`PDF ${index + 1}`}
                                        />
                                        <Button
                                          variant="primary"
                                          onClick={() =>
                                            handleShowFileModal(file)
                                          }
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.5)",
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
                                          Afficher le PDF
                                        </Button>
                                      </>
                                    ) : null}
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  <Col lg={12}>
                    <p>Pas d'image ou Fchier PDF .</p>
                  </Col>
                )}

                {files.some(
                  (file: any) => isPowerPointFile(file) || isExcelFile(file)
                ) ? (
                  <Col lg={12} className="mt-4">
                    <Card>
                      <Card.Body>
                        <Row>
                          {files
                            .filter(
                              (file: any) =>
                                isPowerPointFile(file) || isExcelFile(file)
                            )
                            .map((file: any, index: any) => (
                              <Col key={index} lg={4} className="mb-4">
                                <Card>
                                  <Card.Body>
                                    {isPowerPointFile(file) ? (
                                      <div>
                                        <p>
                                          Fichier PowerPoint détecté. Vous
                                          pouvez le télécharger{" "}
                                          <a href={file} download>
                                            ici
                                          </a>
                                          .
                                        </p>
                                      </div>
                                    ) : isExcelFile(file) ? (
                                      <div>
                                        <p>
                                          Fichier Excel détecté. Vous pouvez le
                                          télécharger{" "}
                                          <a href={file} download>
                                            ici
                                          </a>
                                          .
                                        </p>
                                      </div>
                                    ) : null}
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  <Col lg={12} className="mt-4">
                    <p>Pas de fichier PowerPoint ou Fichier Excel.</p>
                  </Col>
                )}
                <Modal
                  show={showFileModal}
                  onHide={handleCloseFileModal}
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Visionneuse de documents</Modal.Title>
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
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="danger" onClick={() => navigate(-1)}>
                  Retour
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default ViewCours;
