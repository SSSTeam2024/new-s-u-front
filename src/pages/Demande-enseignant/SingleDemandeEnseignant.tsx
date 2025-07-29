import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import {
  Font,

} from "@react-pdf/renderer";
import student from "assets/images/etudiant.png";
import Select from "react-select";
import { useHandleDemandeEnseignantMutation, useUpdateDemandeEnseignantMutation } from "features/demandeEnseignant/demandeEnseignantSlice";
import Swal from "sweetalert2";

Font.register({
  family: "Amiri",
  src: "/assets/fonts/Amiri-Regular.ttf",
});


const SingleDemandeEnseignant = () => {
  document.title = "Demande Enseignant | ENIGA";

  const location = useLocation();
  console.log(location)

  const navigate = useNavigate();

  const [updatedDemand, setUpdatedDemand] = useState<any>(null);

  const [handleDemande, { isLoading, isSuccess }] = useHandleDemandeEnseignantMutation();
  const [updateDemande, { isLoading: isUpdateLoading, isSuccess: isUpdateCompleted }] = useUpdateDemandeEnseignantMutation();
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // const generateDocumentAndUpdateDemand = async () => {

  //   try {
  //     let newStatusHistory = location?.state?.status_history!;
  //     newStatusHistory.push({
  //       value: "Générée",
  //       date: formatDate(new Date())
  //     })
  //     const result = await handleDemande({
  //       demandId: location.state._id,
  //       modelName: location.state?.piece_demande?.doc!,
  //       modelLangage: location.state?.piece_demande?.langue!,
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
      let newStatusHistory = location?.state?.status_history!;
      newStatusHistory.push({
        value: "Générée",
        date: formatDate(new Date())
      });

      const result = await handleDemande({
        demandId: location.state._id,
        modelName: location.state?.piece_demande?.doc!,
        modelLangage: location.state?.piece_demande?.langue!,
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
              ...location?.state,
              status_history: [...(location?.state?.status_history || [])]
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
              ...location?.state,
              status_history: [...(location?.state?.status_history || [])]
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
  const regex = /extra_files\.(jpeg|png|jpg|pdf|docx)$/;

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
                    {location.state.current_status === 'En attente' && updatedDemand === null && (
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
                            {(() => {
                              const status = updatedDemand === null ? location.state?.current_status : updatedDemand?.current_status;

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

                    <div className="d-flex justify-content-end mt-3">
                      {location.state.extra_data.map((extra: any) => (
                        regex.test(extra.value) === true ?
                          <button className="btn btn-info me-2"
                            onClick={() => {

                              const fileUrl = `${process.env.REACT_APP_API_URL}/files/demandeEnseignant/extraFilesDemande/${extra.value}`;
                              window.open(fileUrl, '_blank', 'noopener,noreferrer');
                            }}>
                            {extra.name}
                          </button>
                          : <></>
                      ))}
                    </div>
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
            {((location?.state?.current_status! === "Générée" && updatedDemand === null) || updatedDemand?.current_status! === "Générée") && (
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
            {((location?.state?.current_status! === "Réfusée" && updatedDemand === null) ||
              updatedDemand?.current_status! === "Réfusée") && (
                <Col xxl={6} lg={6}>
                  <Card className="categrory-widgets overflow-hidden">
                    <div className="card-header d-flex align-items-center">
                      <h5 className="card-title flex-grow-1 mb-2">
                        Etat Demandee{" "}
                      </h5>
                      <div className="flex-shrink-0">
                        {updatedDemand === null ? location?.state?.current_status! : updatedDemand?.current_status!}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="text-center">
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm table-borderless align-middle description-table mb-0">

                          <tbody>
                            {(updatedDemand?.current_status! === "Réfusée" || location?.state?.current_status! === "Réfusée") && (
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
                                          value={updatedDemand === null ? location?.state?.response! : updatedDemand?.response!}
                                          readOnly={true}
                                        />
                                      </Form.Group>
                                      {
                                        updatedDemand?.file! !== undefined || location.state?.file! !== undefined && (
                                          <Form.Group className="mb-0">
                                            <Form.Label className="fw-semibold">
                                              Pièce jointe
                                            </Form.Label>

                                            <Button
                                              className="btn btn-danger btn-label m-2"
                                              onClick={() => {
                                                const docName = updatedDemand?.file! || location.state?.file!;
                                                const fileUrl = `${process.env.REACT_APP_API_URL}/files/demandeEnseignant/${docName}`;
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

export default SingleDemandeEnseignant;
