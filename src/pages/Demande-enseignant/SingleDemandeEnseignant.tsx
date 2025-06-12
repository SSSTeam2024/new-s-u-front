import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
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
import etatDemande from "assets/images/etat-demande.png";
import file from "assets/images/demande.png";
import Select from "react-select";
import { useHandleDemandeEnseignantMutation, useUpdateDemandeEnseignantMutation } from "features/demandeEnseignant/demandeEnseignantSlice";

Font.register({
  family: "Amiri",
  src: "/assets/fonts/Amiri-Regular.ttf",
});


const SingleDemandeEnseignant = () => {
  document.title = "Demande Enseignant | ENIGA";

  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state!)

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [handleDemande, { isLoading, isSuccess }] = useHandleDemandeEnseignantMutation();
  const [updateDemande, { isLoading: isUpdateLoading, isSuccess: isUpdateCompleted }] = useUpdateDemandeEnseignantMutation();
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateDocumentAndUpdateDemand = async () => {
    console.log(location.state!)
    try {
      let newStatusHistory = location?.state?.status_history!;
      newStatusHistory.push({
        value: "générée",
        date: formatDate(new Date())
      })
      const result = await handleDemande({
        demandId: location.state._id,
        modelName: location.state?.piece_demande?.doc!,
        modelLangage: location.state?.piece_demande?.langue!,
        status_history: newStatusHistory
      }).unwrap();

      setUpdatedDemand(result);
    } catch (error) {
      console.log(error);
      alert("Une erreur est servenu, veuillez réessayer plus tard!")
    }
  }

  const acceptDemand = async () => {
    try {
      let demandData;
      if (updatedDemand !== null) {
        demandData = {
          ...updatedDemand,
          status_history: [...(updatedDemand.status_history || [])] // clone array safely
        };
      } else {
        demandData = {
          ...location?.state,
          status_history: [...(location?.state?.status_history || [])]
        };
      }

      demandData.status_history.push({
        value: "Approuvée",
        date: formatDate(new Date())
      });

      demandData.current_status = "Approuvée";
      console.log(demandData)
      const result = await updateDemande(demandData).unwrap();

      setUpdatedDemand(result);
    } catch (error) {
      console.log(error);
      alert("Une erreur est servenu, veuillez réessayer plus tard!")
    }
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
  const [selectedStatus, setSelectedStatus] = useState("none");
  const onSelectChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption.value);
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
                    {location.state.current_status === 'en attente' && updatedDemand === null && (
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
                    {/* <Button type="button" className="btn btn-success btn-label">
                      <i className="bi bi-postcard label-icon align-middle fs-16 me-2"></i>
                      Notifier l'enseignant
                    </Button> */}

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
                              {updatedDemand === null ? location.state?.current_status! : updatedDemand?.current_status!}
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
                        <tr>
                          <td className="fs-5">Langue:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state.langue! === 'arabic' ? 'Arabe' : 'Français'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Nombre de copie:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.nombre_copie!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Créé par:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {location.state?.added_by! === null ? location.state?.enseignantId?.nom_fr! + " " + location.state?.enseignantId?.prenom_fr! : "Admin " + location.state?.added_by?.login!}
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
            {((location?.state?.current_status! === "générée" && updatedDemand === null) || updatedDemand?.current_status! === "générée") && (
              <Col xxl={6} lg={6}>
                <Card className="categrory-widgets overflow-hidden">
                  <div className="card-header d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-2">
                      Etat Demande{" "}
                    </h5>
                    <div className="flex-shrink-0">
                      {/* <Button
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
                    </Button> */}

                      <Select
                        options={[{
                          value: "Approuvée",
                          label: "Approuvée",
                        }, {
                          value: "Réfusée",
                          label: "Réfusée",
                        }]}
                        onChange={onSelectChange}

                      />

                    </div>
                  </div>
                  <div className="card-body">
                    <div className="text-center">
                      {/* <i className="bi bi-mortarboard fs-1 text-muted"></i> */}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless align-middle description-table mb-0">

                        <tbody>
                          {selectedStatus === "Réfusée" && (
                            <>
                              <tr>
                                <td colSpan={2}>
                                  <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
                                    <Form.Group className="mb-3">
                                      <Form.Label className="fw-semibold">Raison</Form.Label>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        name="infos"
                                        id="infos"
                                        placeholder="Décrivez la raison du refus"
                                      />
                                    </Form.Group>

                                    <Form.Group className="mb-0">
                                      <Form.Label className="fw-semibold">
                                        Pièce jointe <small className="text-muted">(optionnel)</small>
                                      </Form.Label>
                                      <Form.Control
                                        name="Face1CINFileBase64String"
                                        type="file"
                                        id="Face1CINFileBase64String"
                                        accept="*/*"
                                        className="form-control"
                                      />
                                    </Form.Group>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  <div className="d-flex justify-content-start">
                                    <Button type="button" className="btn btn-danger d-flex align-items-center gap-2">
                                      <i className="bi bi-x-lg fs-5 text-white"></i>
                                      <span className="text-white">Valider</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            </>
                          )}

                          {selectedStatus === "Approuvée" && (
                            <tr>
                              <td colSpan={2}>
                                <div className="d-flex justify-content-start">

                                  <Button
                                    type="button"
                                    className="btn btn-success d-flex align-items-center gap-2"
                                    onClick={acceptDemand}
                                    disabled={isUpdateLoading}>
                                    {isUpdateLoading ? (
                                      <Spinner as="span" animation="border" size="sm" />) :
                                      <i className="bi bi-check2 fs-5 text-white"></i>}
                                    <span className="text-white">Valider</span>
                                  </Button>

                                </div>
                              </td>
                            </tr>
                          )}

                          {selectedStatus === "none" && (
                            <tr>
                              <td colSpan={2}>
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                  <i className="bi bi-info-circle-fill me-2"></i>
                                  Modifier l'état de la demande.
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>



                      </table>
                    </div>
                  </div>
                  {/* <img
                  src={etatDemande}
                  alt=""
                  className="img-fluid category-img object-fit-cover"
                /> */}
                </Card>
              </Col>
            )}
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleDemandeEnseignant;
