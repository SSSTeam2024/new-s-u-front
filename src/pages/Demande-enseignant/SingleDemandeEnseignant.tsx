import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import {
  Font,

} from "@react-pdf/renderer";
import img4 from "assets/images/small/img-4.jpg";
import student from "assets/images/etudiant.png";
import file from "assets/images/demande.png";

import { useHandleDemandeEnseignantMutation } from "features/demandeEnseignant/demandeEnseignantSlice";

Font.register({
  family: "Amiri",
  src: "/assets/fonts/Amiri-Regular.ttf",
});


const SingleDemandeEnseignant = () => {
  document.title = "Demande Enseignant | ENIGA";

  const location = useLocation();
  const navigate = useNavigate();


  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [updateDemande, { isLoading, isSuccess }] = useHandleDemandeEnseignantMutation();

  const generateDocumentAndUpdateDemand = async () => {
    console.log(location.state!)
    const result = await updateDemande({
      demandId: location.state._id,
      modelName: location.state?.piece_demande?.doc!,
      modelLangage: location.state?.piece_demande?.langue!
    }).unwrap();

    console.log(result)
    setUpdatedDemand(result);
  }
  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = location.state.piece_demande.title + '-' + location.state.enseignantId.nom_fr + '_' + location.state.enseignantId.prenom_fr + '.pdf';
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
            title="Demande enseignant "
            pageTitle="Modifier La Demande"
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
                          src={`${process.env.REACT_APP_API_URL}/files/enseignantFiles/PhotoProfil/${location.state?.enseignantId.photo_profil}`}
                          alt=""
                          className="avatar-xxl rounded-circle p-1 bg-body mt-n5"
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
                    Détails de l'enseignant{" "}
                  </h5>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() =>
                        navigate(`/gestion-enseignant/compte-enseignant`, {
                          state: { _id: location.state?.enseignantId._id },
                        })
                      }
                      type="button"
                      className="btn btn-info btn-label m-1"
                    >
                      <i className="bi bi-eye label-icon align-middle fs-16 me-2"></i>
                      Voir enseignant{" "}
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
                          <td className="fs-5">Nom et prénom:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.enseignantId?.nom_fr!}{" "}
                              {location.state?.enseignantId?.prenom_fr!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">CIN:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.enseignantId?.num_cin!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">E-mail:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.enseignantId?.email!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Téléphone:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.enseignantId?.num_phone1!}
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
                    {location.state.status === 'traité' && (
                      <Button
                        className="btn btn-success btn-label m-1"
                        onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/teacher_pdf/${location.state.generated_doc}`)}
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}


                    {isSuccess && (
                      <Button
                        className="btn btn-success btn-label m-2"
                        // onClick={() => downloadFile(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/teacher_pdf/${updatedDemand.generated_doc}`)}
                        onClick={() =>
                          openFileInNewWindow(`${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/teacher_pdf/${updatedDemand.generated_doc}`)
                        }
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}

                    {
                      location.state.status !== 'traité' && updatedDemand === null && (
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
                      Notifier l'enseignant
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
                              {location.state?.piece_demande?.title!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Description:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.description!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Status:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.status!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Date d'envoi:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {new Date(
                                location.state?.createdAt!
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
                    {(location.state?.generated_doc || updatedDemand?.generated_doc) && (
                      <Button
                        className="btn btn-success btn-label m-2"
                        onClick={() => {
                          const docName = updatedDemand?.generated_doc || location.state?.generated_doc;
                          const fileUrl = `${process.env.REACT_APP_API_URL}/files/generated_docs/pdf/teacher_pdf/${docName}`;
                          window.open(fileUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                        Visualiser
                      </Button>
                    )}

                    {/* Generate Button: only shows if status !== 'traité' and updatedDemand is null */}
                    {location.state.status !== 'traité' && updatedDemand === null && (
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
                      Notifier l'enseignant
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
                              {location.state?.piece_demande?.title!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Description:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.description!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Status:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.status!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Date d'envoi:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {new Date(location.state?.createdAt!).toLocaleDateString("fr-FR")}
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

export default SingleDemandeEnseignant;
