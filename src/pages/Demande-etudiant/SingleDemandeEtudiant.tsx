import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import student from "assets/images/etudiant.png";

import { useHandleDemandeEtudiantMutation, useUpdateDemandeEtudiantMutation } from "features/demandeEtudiant/demandeEtudiantSlice";
import Swal from "sweetalert2";
import Select from "react-select";


const SingleDemandeEtudiant = () => {
  document.title = "Demande Etudiant | ENIGA";

  const state = useLocation();
  console.log("state data", state);
  const navigate = useNavigate();

  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [handleDemande, { isLoading, isSuccess }] = useHandleDemandeEtudiantMutation();
  const [updateDemande, { isLoading: isUpdateLoading, isSuccess: isUpdateCompleted }] = useUpdateDemandeEtudiantMutation();
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // const generateDocumentAndUpdateDemand = async () => {

  //   try {
  //     let newStatusHistory = state?.state?.status_history!;
  //     newStatusHistory.push({
  //       value: "Générée",
  //       date: formatDate(new Date())
  //     })
  //     const result = await handleDemande({
  //       demandId: state.state._id,
  //       modelName: state.state?.piece_demande?.doc!,
  //       modelLangage: state.state?.piece_demande?.langue!,
  //       status_history: newStatusHistory
  //     }).unwrap();

  //     setUpdatedDemand(result);
  //   } catch (error) {
  //     console.log(error);
  //     alert("Une erreur est servenu, veuillez réessayer plus tard!")
  //   }
  // }

  const generateDocumentAndUpdateDemand = async () => {
    Swal.fire({
      title: 'Veuillez patienter...',
      text: "Le document est en cours de génération. N'actualisez pas la page ou ne quittez pas.",
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let newStatusHistory = state?.state?.status_history!;
      newStatusHistory.push({
        value: "Générée",
        date: formatDate(new Date())
      });

      const result = await handleDemande({
        demandId: state.state._id,
        modelName: state.state?.piece_demande?.doc!,
        modelLangage: state.state?.piece_demande?.langue!,
        status_history: newStatusHistory
      }).unwrap();

      setUpdatedDemand(result);
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Le document a été généré avec succès.',
      });
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue, veuillez réessayer plus tard.',
      });
    }
  };

  const acceptDemand = async () => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, Approuver',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let demandData;
          if (updatedDemand !== null) {
            demandData = {
              ...updatedDemand,
              status_history: [...(updatedDemand.status_history || [])]
            };
          } else {
            demandData = {
              ...state?.state,
              status_history: [...(state?.state?.status_history || [])]
            };
          }

          demandData.status_history.push({
            value: "Approuvée",
            date: formatDate(new Date())
          });

          demandData.current_status = "Approuvée";

          const result = await updateDemande(demandData).unwrap();

          setUpdatedDemand(result);
          Swal.fire(
            'Approuvée !',
            'La demande a été approuvée.',
            'success'
          );
        } catch (error) {
          console.log(error);
          alert("Une erreur est servenu, veuillez réessayer plus tard!")
        }
      }
    });
  }

  const rejectDemand = async () => {

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, réfuser',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let demandData;
          if (updatedDemand !== null) {
            demandData = {
              ...updatedDemand,
              status_history: [...(updatedDemand.status_history || [])]
            };
          } else {
            demandData = {
              ...state?.state,
              status_history: [...(state?.state?.status_history || [])]
            };
          }

          demandData.status_history.push({
            value: "Réfusée",
            date: formatDate(new Date())
          });

          demandData.current_status = "Réfusée";
          demandData.response = raison;
          if (file !== null) {
            demandData.FileBase64 = file.base64;
            demandData.FileExtension = file.extension;
          } else {
            demandData.FileBase64 = '';
            demandData.FileExtension = '';
          }

          const result = await updateDemande(demandData).unwrap();

          setUpdatedDemand(result);
          Swal.fire(
            'Réfusée !',
            'La demande a été réfusée.',
            'success'
          );
        } catch (error) {
          console.log(error);
          alert("Une erreur est servenu, veuillez réessayer plus tard!")
        }
      }
    });
  }

  const getRaison = (event: any) => {
    setRaison(event.target.value);
  }

  const [selectedStatus, setSelectedStatus] = useState("none");
  const [raison, setRaison] = useState("");
  const onSelectChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption.value);
  };

  const [file, setFile] = useState<any>(null);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    const { base64Data, extension } = await convertToBase64(file);
    setFile({ name: file.name, base64: base64Data, extension: extension });
  };

  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const [, base64Data] = base64String.split(",");
        const extension = file.name.split(".").pop() ?? "";
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Demande étudiant "
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
                    {state.state.current_status === 'En attente' && updatedDemand === null && (
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
                            {(() => {
                              const status = updatedDemand === null ? state.state?.current_status : updatedDemand?.current_status;

                              let statusClass = '';
                              switch (status) {
                                case 'En attente':
                                  statusClass = 'text-warning';
                                  break;
                                case 'Générée':
                                  statusClass = 'text-secondary';
                                  break;
                                case 'Réfusée':
                                  statusClass = 'text-danger';
                                  break;
                                case 'Approuvée':
                                  statusClass = 'text-success';
                                  break;
                                default:
                                  statusClass = 'text-dark'; // fallback
                              }

                              return <span className={`mb-1 fs-5 fw-semibold ${statusClass}`}>{status}</span>;
                            })()}
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
                        <tr>
                          <td className="fs-5">Langue:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state.langue! === 'arabic' ? 'Arabe' : 'Français'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Nombre de copie:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.nombre_copie!}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fs-5">Créé par:</td>
                          <td>
                            <span className="mb-1 fs-5">
                              {state.state?.added_by! === null ? state.state?.studentId?.nom_fr! + " " + state.state?.studentId?.prenom_fr! : "Admin " + state.state?.added_by?.login!}
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
                    Détails de l'étudiant{" "}
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
                      Voir étudiant{" "}
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
            {((state?.state?.current_status! === "Générée" && updatedDemand === null) || updatedDemand?.current_status! === "Générée") && (
              <Col xxl={6} lg={6}>
                <Card className="categrory-widgets overflow-hidden">
                  <div className="card-header d-flex align-items-center">
                    <h5 className="card-title flex-grow-1 mb-2">
                      Etat Demande{" "}
                    </h5>
                    <div className="flex-shrink-0">
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
                                        onChange={getRaison}
                                      />
                                    </Form.Group>

                                    <Form.Group className="mb-0">
                                      <Form.Label className="fw-semibold">
                                        Pièce jointe <small className="text-muted">(optionnel)</small>
                                      </Form.Label>

                                      <div className="input-group">
                                        <input
                                          type="file"
                                          id="Face1CINFileBase64String"
                                          name="Face1CINFileBase64String"
                                          accept="*/*"
                                          onChange={handleFileChange}
                                          className="d-none"
                                        />
                                        <label htmlFor="Face1CINFileBase64String" className="btn btn-outline-primary">
                                          Choisir un fichier
                                        </label>
                                        <span className="form-control bg-light">{file === null ? 'Aucun fichier choisi' : file.name}</span>
                                      </div>
                                    </Form.Group>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  <div className="d-flex justify-content-start">
                                    <Button
                                      type="button"
                                      className="btn btn-danger d-flex align-items-center gap-2"
                                      onClick={rejectDemand}
                                      disabled={isUpdateLoading || raison === ''}>
                                      {isUpdateLoading ? (
                                        <Spinner as="span" animation="border" size="sm" />) :
                                        <i className="bi bi-x-lg fs-5 text-white"></i>}
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
                </Card>
              </Col>
            )}
            {((state?.state?.current_status! === "Réfusée" && updatedDemand === null) ||
              updatedDemand?.current_status! === "Réfusée") && (
                <Col xxl={6} lg={6}>
                  <Card className="categrory-widgets overflow-hidden">
                    <div className="card-header d-flex align-items-center">
                      <h5 className="card-title flex-grow-1 mb-2">
                        Etat Demandee{" "}
                      </h5>
                      <div className="flex-shrink-0">
                        {updatedDemand === null ? state?.state?.current_status! : updatedDemand?.current_status!}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="text-center">
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm table-borderless align-middle description-table mb-0">

                          <tbody>
                            {(updatedDemand?.current_status! === "Réfusée" || state?.state?.current_status! === "Réfusée") && (
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
                                          value={updatedDemand === null ? state?.state?.response! : updatedDemand?.response!}
                                          readOnly={true}
                                        />
                                      </Form.Group>
                                      {
                                        updatedDemand?.file! !== undefined || state.state?.file! !== undefined && (
                                          <Form.Group className="mb-0">
                                            <Form.Label className="fw-semibold">
                                              Pièce jointe
                                            </Form.Label>

                                            <Button
                                              className="btn btn-danger btn-label m-2"
                                              onClick={() => {
                                                const docName = updatedDemand?.file! || state.state?.file!;
                                                const fileUrl = `${process.env.REACT_APP_API_URL}/files/demandeEtudiant/${docName}`;
                                                window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                              }}
                                            >
                                              <i className="bi bi-file-earmark-pdf label-icon align-middle fs-16 me-2"></i>
                                              Visualiser
                                            </Button>
                                          </Form.Group>
                                        )
                                      }

                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                </Col>
              )}
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleDemandeEtudiant;
