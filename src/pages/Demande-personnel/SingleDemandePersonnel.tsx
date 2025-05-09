import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import {

  Font,
} from "@react-pdf/renderer";

// Import images

import img4 from "assets/images/small/img-4.jpg";
import student from "assets/images/etudiant.png";
import file from "assets/images/demande.png";


import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import { useFetchDemandePersonnelByIdQuery, useHandleDemandePersonnelMutation } from "features/demandePersonnel/demandePersonnelSlice";

Font.register({
  family: "Amiri",
  src: "/assets/fonts/Amiri-Regular.ttf",
});

const SingleDemandePersonnel = () => {
  document.title = "Demande Personnel | ENIGA";

  const state = useLocation();
  console.log("state", state.state);
  const navigate = useNavigate();
  const Navigate = () => {
    navigate("/accountEtudiant");
  };
  const { data: AllVariablesGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [updateDemande, { isLoading, isSuccess }] = useHandleDemandePersonnelMutation();

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
  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = state.state.piece_demande.title + '-' + state.state.personnelId.nom_fr + '_' + state.state.personnelId.prenom_fr + '.pdf';
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
                        {/* <img
                  src={`${process.env.REACT_APP_API_URL}/files/personnelFiles/PhotoProfil/${state.state?.personnelId.photo_profil}`}
                  alt=""
                          className="rounded-circle p-1 bg-body mt-n5" width="150"
                        /> */}
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
                    Détails du personnel{" "}
                    {/* <i className="bi bi-mortarboard-fill"></i> */}
                  </h5>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() =>
                        navigate(`/gestion-etudiant/compte-etudiant`, {
                          state: { _id: state.state?.personnelId?._id! },
                        })
                      }
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
                          <td className="fs-5">Nom et Prénom:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.personnelId?.nom_fr!}{" "}
                              {state.state?.personnelId?.prenom_fr!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">CIN:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.personnelId?.num_CIN!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">identifinat_unique:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.personnelId?.identifinat_unique!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Téléphone</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.personnelId?.num_phone1!}
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
                    {AllVariablesGlobales?.length > 0 ? (
                      <PDFDownloadLink
                        document={
                          <PDF_REPORT
                            logo_etablissement={
                              AllVariablesGlobales[2]?.logo_etablissement!
                            }
                            logo_republique={
                              AllVariablesGlobales[2]?.logo_republique!
                            }
                            logo_universite={
                              AllVariablesGlobales[2]?.logo_universite!
                            }
                            address_fr={AllVariablesGlobales[2]?.address_fr!}
                            phone={AllVariablesGlobales[2]?.phone!}
                            fax={AllVariablesGlobales[2]?.fax!}
                            website={AllVariablesGlobales[2]?.website!}
                            formattedDate={formattedDate}
                            piece_demande={state?.state?.piece_demande!}
                            personnelId={state?.state?.personnelId!}
                            signature_directeur={
                              AllVariablesGlobales[2]?.signature_directeur!
                            }
                            langue={state?.state?.langue!}
                            address_ar={AllVariablesGlobales[2]?.address_ar!}
                            gouvernorat_ar={
                              AllVariablesGlobales[2]?.gouvernorat_ar!
                            }
                            gouvernorat_fr={
                              AllVariablesGlobales[2]?.gouvernorat_fr!
                            }
                            code_postal={AllVariablesGlobales[2]?.code_postal!}
                            allVariables={AllVariablesGlobales[2]}
                            raison={state?.state?.description!}
                            // departement={
                            //   state?.state?.studentId?.groupe_classe
                            //     ?.departement!
                            // }
                          />
                        }
                        fileName={state?.state?.piece_demande?.title!}
                      >
                        <Link
                          to="/demandes-personnel/generer-demande-personnel"
                          state={state.state}
                          className="btn btn-danger btn-label m-1"
                        >
                          <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                          Générer
                        </Link>
                      </PDFDownloadLink>
                    ) : (
                      <div>No data available</div>
                    )}
                    <Button type="button" className="btn btn-success btn-label">
                      <i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i>{" "}
                      Notifier le personnel
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
                          <td className="fs-5">Langue:</td>
                          <td>
                            {state.state?.langue! === "french" ? (
                              <span className="badge bg-info-subtle text-info">
                                Français
                              </span>
                            ) : (
                              <span className="badge bg-primary-subtle text-primary">
                                Arabe
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Nombre de copie:</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {state.state?.nombre_copie!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Etat de la demande:</td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger">
                              {state.state?.status!}
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
                        onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/employee_pdf/${state.state.generated_doc}`)}
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}


                    {isSuccess && (
                      <Button
                        className="btn btn-success btn-label m-2"
                        // onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/employee_pdf/${updatedDemand.generated_doc}`)}
                        onClick={() =>
                          openFileInNewWindow(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/employee_pdf/${updatedDemand.generated_doc}`)
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
                      Notifier le personnel
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
                          const fileUrl = `${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/employee_pdf/${docName}`;
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
                      Notifier le personnel
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
          {/* <Row>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button variant="primary" id="add-btn" type="submit">
                  Modifer la Demande
                </Button>
              </div>
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleDemandePersonnel;
