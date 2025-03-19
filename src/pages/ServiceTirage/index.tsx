import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col, Form, Offcanvas } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddAbsenceEtudiantMutation,
  useDeleteAbsenceMutation,
  useFetchAbsenceEtudiantsQuery,
} from "features/absenceEtudiant/absenceSlice";

const DemandesTirage = () => {
  const { data = [] } = useFetchAbsenceEtudiantsQuery();
  console.log(data);
  //   const [deleteAbsence] = useDeleteAbsenceMutation();

  const [showObservation, setShowObservation] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Paramètre Absence SMS a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };
  //   const AlertDelete = async (_id: any) => {
  //     swalWithBootstrapButtons
  //       .fire({
  //         title: "Etes-vous sûr?",
  //         text: "Vous ne pouvez pas revenir en arrière?",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Oui, supprime-le !",
  //         cancelButtonText: "Non, annuler !",
  //         reverseButtons: true,
  //       })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           deleteAbsence(_id);
  //           swalWithBootstrapButtons.fire(
  //             "Supprimé !",
  //             "L'absence est supprimée.",
  //             "success"
  //           );
  //         } else if (result.dismiss === Swal.DismissReason.cancel) {
  //           swalWithBootstrapButtons.fire(
  //             "Annulé",
  //             "L'absence est en sécurité :)",
  //             "info"
  //           );
  //         }
  //       });
  //   };

  const navigate = useNavigate();

  function tog_AddAbsence() {
    navigate("/service-tirage/ajouter-tirage");
  }

  //   const [updateAbsenceSmsSetting] = useUpdateSmsSettingByIdMutation();
  //   const [formData, setFormData] = useState({
  //     id: "",
  //     status: "",
  //   });

  //   useEffect(() => {
  //     if (AllSmsSettings !== undefined && isLoading === false) {
  //       const absence_sms_setting = AllSmsSettings?.filter(
  //         (parametre) => parametre.service_name === "Absences"
  //       );
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         id: absence_sms_setting[0]?._id!,
  //         status: absence_sms_setting[0].sms_status,
  //       }));
  //     }
  //   }, [AllSmsSettings, isLoading]);

  //   const onChangeAbsenceSmsSetting = () => {
  //     let updateData = {
  //       id: formData.id,
  //       status: formData.status === "1" ? "0" : "1",
  //     };
  //     updateAbsenceSmsSetting(updateData)
  //       .then(() =>
  //         setFormData((prevState) => ({
  //           ...prevState,
  //           status: formData.status === "1" ? "0" : "1",
  //         }))
  //       )
  //       .then(() => notifySuccess());
  //   };

  const [deleteAbsence] = useDeleteAbsenceMutation();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteAbsence(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Absence Etudiant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Classe est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => <span>{row?.classe?.nom_classe_fr!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row?.date!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure Début</span>,
      selector: (row: any) => row?.seance?.heure_debut!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure Fin</span>,
      selector: (row: any) => row?.seance?.heure_fin!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.seance?.matiere?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => (
        <span>
          {row?.enseignant?.prenom_fr!} {row?.enseignant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etudiants Absents</span>,
      selector: (row: any) =>
        row.etudiants.filter((e: any) => e?.typeAbsent! === "A").length,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/application-enseignant/visualiser-absence-etudiant"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowObservation(!showObservation)}
                state={{ absenceDetails: row }}
              >
                <i
                  className="ri-eye-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>

            <li>
              <Link
                to="/application-enseignant/modifier-absence-etudiant"
                className="badge badge-soft-success edit-item-btn"
                state={{ absenceDetails: row }}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>

            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const observationLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredAbsences = () => {
    let filteredAbsences = data;

    if (searchTerm) {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) =>
          absence?.matiere!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.heure!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.nom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.prenom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredAbsences;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Liste Des Demandes Tirage" pageTitle="Service Tirage" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={3} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddAbsence()}
                      >
                        <i
                          className="ri-add-fill align-middle"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "1.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>{" "}
                        <span>Ajouter Absence</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredAbsences()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Offcanvas
          show={showObservation}
          onHide={() => setShowObservation(!showObservation)}
          placement="end"
          style={{ width: "30%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Absence</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.classe?.nom_classe!} </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Heure</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.heure!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimèstre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Enseignant</span>
              </Col>
              <Col lg={9}>
                <i>
                  {observationLocation?.state?.enseignant?.nom_enseignant}{" "}
                  {observationLocation?.state?.enseignant?.prenom_enseignant}
                </i>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Row>
                  <Col lg={5}>
                    <Form.Label>Elève</Form.Label>
                  </Col>
                  <Col lg={3}>
                    <Form.Label>Type</Form.Label>
                  </Col>
                </Row>

                {observationLocation?.state?.eleves!.length > 0 ? (
                  observationLocation?.state?.eleves!.map((eleve: any) => (
                    <Row key={eleve.eleve._id}>
                      <Col lg={5} className="mb-1">
                        {eleve?.eleve?.prenom!} {eleve?.eleve?.nom!}
                      </Col>
                      <Col lg={3} className="mb-1">
                        {eleve.typeAbsent}
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Col>
                      <p>Aucun Absence pour le classe</p>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default DemandesTirage;
