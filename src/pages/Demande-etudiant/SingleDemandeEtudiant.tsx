import React, { useRef, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Import images
import img4 from "assets/images/small/img-4.jpg";
import student from "assets/images/etudiant.png";
import file from "assets/images/demande.png"
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

import { useHandleDemandeEtudiantMutation } from "features/demandeEtudiant/demandeEtudiantSlice";


const SingleDemandeEtudiant = (props: any) => {
  document.title = "Demande Etudiant | ENIGA";

  const state = useLocation();
  console.log("state data", state);
  const navigate = useNavigate();
  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const bodyRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    piece_demande,
    studentId,
    enseignantId,
    personnelId,
    allVariables,
    raison,
    formattedDate,
    departement,
  } = props;

  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [updateDemande, { isLoading, isSuccess }] = useHandleDemandeEtudiantMutation();

  const generateDocumentAndUpdateDemand = async () => {
    console.log(state.state!)
    const result = await updateDemande({
      demandId: state.state._id,
      modelName: state.state?.piece_demande?.doc!,
      modelLangage: state.state?.piece_demande?.langue!
    }).unwrap();

    console.log(result)
    setUpdatedDemand(result);
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      if (!bodyRef.current) {
        console.error("bodyRef is not set.");
        setIsGenerating(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(bodyRef.current, {
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");

      if (!imgData || !imgData.startsWith("data:image/png;base64,")) {
        throw new Error("Captured image data is not valid.");
      }

      const doc = new jsPDF();
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF: ", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = state.state.piece_demande.title + '-' + state.state.studentId.nom_fr + '_' + state.state.studentId.prenom_fr + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFileInNewWindow = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <div
            style={{
              visibility: "hidden", // Hide it but keep it rendered on the page
              position: "absolute",
              pointerEvents: "none", // Prevent interactions
            }}
            ref={bodyRef}
          >
            <BodyPDF
              piece_demande={state.state?.title}
              studentId={state.state?.studentId?._id!}
              enseignantId={state.state?.enseignantId}
              personnelId={state.state?.personnelId}
              raison={state.state?.raison}
              formattedDate={new Date(
                state.state?.createdAt
              ).toLocaleDateString("fr-FR")}
              departement={state.state?.departement}
              allVariables={allVariables}
            />
          </div> */}
          <Breadcrumb
            title="Demande Etudiant"
            pageTitle="Details de la Demande"
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
                        <img
                          src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${state.state?.studentId?.photo_profil!}`}
                          alt=""
                          className="rounded-circle p-1 bg-body mt-n5"
                          width="150"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de l'étudiant
                  </h5>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() =>
                        navigate(`/gestion-etudiant/compte-etudiant`, {
                          state: { _id: state.state?.studentId?._id! },
                        })
                      }
                      type="button"
                      className="btn btn-info btn-label m-1"
                    >
                      <i className="bi bi-eye label-icon align-middle fs-16 me-2"></i>
                      Voir étudiant
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
                          <td className="fs-5">Nom et Prénom:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.studentId?.nom_fr!}{" "}
                              {state.state?.studentId?.prenom_fr!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">CIN:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.studentId?.num_CIN!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Classe:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {
                                state.state?.studentId?.groupe_classe?.nom_classe_fr!
                              }
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Téléphone</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.studentId?.num_phone!}
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
            {/* <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de la demande
                  </h5>
                  <div className="flex-shrink-0">
                    {state.state.status === 'traité' && (
                      <Button
                        className="btn btn-success btn-label m-1"
                        onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/student_pdf/${state.state.generated_doc}`)}
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}


                    {isSuccess && (
                      <Button
                        className="btn btn-success btn-label m-2"
                        // onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/student_pdf/${updatedDemand.generated_doc}`)}
                        onClick={() =>
                          openFileInNewWindow(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/student_pdf/${updatedDemand.generated_doc}`)
                        }
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}

                    {
                      state.state.status !== 'traité' && updatedDemand === null && (
                        <Button
                          variant="danger"
                          className="btn btn-danger btn-label m-2"
                          disabled={isLoading}
                          onClick={generateDocumentAndUpdateDemand}
                        >
                          {isLoading ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i
                                className="bi bi-file-earmark-plus fs-20"
                                style={{ marginRight: "3px" }}
                              ></i>
                              Générer
                            </div>
                          )}
                        </Button>
                      )
                    }

                    <Button type="button" className="btn btn-success btn-label">
                      <i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i>
                      Notifier l'étudiant
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
                          <td className="fs-5">Pièce demandée:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.piece_demande?.title!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Description:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.description!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Status:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.status!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Date d'envoi:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {new Date(
                                state.state?.createdAt!
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <img
                  src={file}
                  alt=""
                  className="img-fluid category-img object-fit-cover"
                />
              </Card>
            </Col> */}
            <Col xxl={6} lg={6}>
              <Card className="categrory-widgets overflow-hidden">
                <div className="card-header d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">
                    Détails de la demande
                  </h5>
                  <div className="flex-shrink-0">

                    {/* Visualiser Button: shows if either generated_doc exists */}
                    {(state.state?.generated_doc || updatedDemand?.generated_doc) && (
                      <Button
                        className="btn btn-success btn-label m-2"
                        onClick={() => {
                          const docName = updatedDemand?.generated_doc || state.state?.generated_doc;
                          const fileUrl = `${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/student_pdf/${docName}`;
                          window.open(fileUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}

                    {/* Generate Button: only shows if status !== 'traité' and updatedDemand is null */}
                    {state.state.status !== 'traité' && updatedDemand === null && (
                      <Button
                        variant="danger"
                        className="btn btn-danger btn-label m-2"
                        disabled={isLoading}
                        onClick={generateDocumentAndUpdateDemand}
                      >
                        {isLoading ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <i
                              className="bi bi-file-earmark-plus fs-20"
                              style={{ marginRight: "3px" }}
                            ></i>
                            Générer
                          </div>
                        )}
                      </Button>
                    )}

                    {/* Notifier Button */}
                    <Button type="button" className="btn btn-success btn-label">
                      <i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i>
                      Notifier l'étudiant
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
                          <td className="fs-5">Pièce demandée:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.piece_demande?.title!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Description:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.description!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Status:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.status!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Date d'envoi:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {new Date(state.state?.createdAt!).toLocaleDateString("fr-FR")}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <img
                  src={file}
                  alt=""
                  className="img-fluid category-img object-fit-cover"
                />
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleDemandeEtudiant;
