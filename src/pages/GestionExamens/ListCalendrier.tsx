import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import {
  useFetchExamensQuery,
  useDeleteExamenMutation,
} from "features/examens/examenSlice";
import Swal from "sweetalert2";
import SimpleBar from "simplebar-react";

const ListCalendrier = () => {
  document.title = "Liste des Calendriers | ENIGA";

  const [deleteCalendrier] = useDeleteExamenMutation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const AlertDelete = async (_id: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-le !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteCalendrier(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le calendrier a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le calendrier est en sécurité :)",
            "info"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Période",
        accessor: "period",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Semestre",
        accessor: "semestre",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Session",
        accessor: "session",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Type",
        accessor: "type_examen",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (calendrier: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  state={calendrier}
                  className="badge bg-info-subtle text-info view-item-btn"
                  onClick={() => handleShow(calendrier)}
                >
                  <i
                    className="ph ph-users-three"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/gestion-examen/programmer-calendrier"
                  className="badge bg-dark-subtle text-dark edit-item-btn"
                  state={calendrier}
                >
                  <i
                    className="ph ph-gear"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/gestion-examen/details-calendrier-examen"
                  className="badge bg-secondary-subtle text-secondary edit-item-btn"
                  state={calendrier}
                >
                  <i
                    className="ph ph-calendar-blank"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                  onClick={() => AlertDelete(calendrier?._id!)}
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
  const {
    data: AllCalendriers = [],
    isLoading,
    isError,
  } = useFetchExamensQuery();
  console.log("AllCalendriers", AllCalendriers);
  const [show, setShow] = useState(false);
  const [selectedCalendrier, setSelectedCalendrier] = useState<any>(null);

  const handleClose = () => setShow(false);

  const handleShow = (calendrier: any) => {
    setSelectedCalendrier(calendrier);
    setShow(true);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liens utils" pageTitle="Liste des liens utils" />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
                      <select
                        className="form-select"
                        id="idStatus"
                        name="choices-single-default"
                      >
                        <option defaultValue="All">Status</option>
                        <option value="All">tous</option>
                        <option value="Active">Activé</option>
                        <option value="Inactive">Desactivé</option>
                      </select>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          //   onClick={() => tog_AddParametreModals()}
                        >
                          Ajouter un lien
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={AllCalendriers || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Products..."
                    />
                  </table>
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center py-4">
                      <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                          <i className="bi bi-search"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Offcanvas for displaying exam planification details */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Détails de Calendrier Examen</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isLoading && <p>Chargement...</p>}
          {isError && (
            <p>Erreur lors de la récupération des détails des examens.</p>
          )}
          {!isLoading && !isError && selectedCalendrier && (
            <SimpleBar>
              <p>
                <strong>Période:</strong> {selectedCalendrier.period}
              </p>
              <p>
                <strong>Semestre:</strong> {selectedCalendrier.semestre}
              </p>
              <p>
                <strong>Session:</strong> {selectedCalendrier.session}
              </p>
              <p>
                <strong>Type:</strong> {selectedCalendrier.type_examen}
              </p>

              <div className="acitivity-timeline acitivity-main">
                {selectedCalendrier.group_enseignant.map(
                  (group: any, index: any) => {
                    const dateParts = group.date.split("-");
                    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    const date = new Date(formattedDate);
                    if (isNaN(date.getTime())) {
                      console.error(`Invalid date format: ${group.date}`);
                      return (
                        <div key={index} className="activity-item d-flex mb-3">
                          <p className="text-danger">
                            Invalid Date: {group.date}
                          </p>
                        </div>
                      );
                    }
                    const dayName = date.toLocaleDateString("fr-FR", {
                      weekday: "long",
                    });

                    return (
                      <div key={index} className="activity-item d-flex mb-3">
                        <div className="flex-shrink-0 activity-avatar"></div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0 lh-base">{dayName}</h6>
                          {group.enseignant && group.enseignant.length > 0 ? (
                            <p className="text-muted mb-0">
                              <strong>{group.date}:</strong>{" "}
                              {group.enseignant
                                .map(
                                  (enseignant: any) =>
                                    `${
                                      enseignant.prenom_fr ||
                                      "Prenom non disponible"
                                    } ${
                                      enseignant.nom_fr || "Nom non disponible"
                                    }`
                                )
                                .join(", ")}
                            </p>
                          ) : (
                            <p className="text-muted">
                              <strong>{group.date}:</strong> Aucun enseignant
                              disponible.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* <div className="acitivity-timeline acitivity-main">
                {selectedCalendrier.epreuve.map((epreuve: any, index: any) => (
                  <div key={index} className="acitivity-item d-flex mb-3">
                    <div className="flex-shrink-0 acitivity-avatar"></div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-0 lh-base">{`jour ${index + 1}`}</h6>
                      {epreuve.group_surveillants.length > 0 ? (
                        epreuve?.group_surveillants?.map(
                          (surveillant: any, i: any) => (
                            <p key={i} className="text-muted mb-0">
                              <strong>-</strong>{" "}
                              {surveillant.prenom_fr || "Prenom non disponible"}{" "}
                              {surveillant.nom_fr || "Nom non disponible"}
                            </p>
                          )
                        )
                      ) : (
                        <p className="text-muted">
                          <strong>-</strong> Aucun surveillant disponible.
                        </p>
                      )}
                      <p className="text-muted mt-2">
                        <strong>Date:</strong> {epreuve.date} |
                        <strong> Heure:</strong> {epreuve.heure_debut} -{" "}
                        {epreuve.heure_fin}
                      </p>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* <div className="acitivity-timeline acitivity-main">
                <div className="acitivity-item d-flex">
                  <div className="flex-shrink-0 acitivity-avatar"></div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-0 lh-base">Matières</h6>
                    <p className="text-muted mb-0" key={1}>
                      <strong>-</strong> here is the code
                    </p>
                    <p className="text-muted mb-0" key={2}>
                      <strong>-</strong> here is the code
                    </p>
                  </div>
                </div>
                <div className="acitivity-item py-3 d-flex">
                  <div className="flex-shrink-0">
                    <div className="acitivity-avatar"></div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-0 lh-base">Jours</h6>
                    <p className="mb-2 text-muted" key={1}>
                      vvv
                    </p>
                    <p className="mb-2 text-muted" key={2}>
                      vvv
                    </p>
                  </div>
                </div>
              </div> */}

              {/* <div>
                {selectedCalendrier.epreuve.map((epreuve: any, index: any) => (
                  <div key={index} className="mb-3">
                    <h6>
                     
                    </h6>
                    {epreuve.group_surveillants.length > 0 ? (
                      epreuve?.group_surveillants?.map(
                        (surveillant: any, i: any) => (
                          <p key={i} className="text-muted mb-0">
                            - {surveillant.prenom_fr || "Prenom non disponible"}{" "}
                            {surveillant.nom_fr || "Nom non disponible"}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-muted">
                        Aucun surveillant disponible.
                      </p>
                    )}
                    <p className="text-muted mt-2">
                      <strong>Date:</strong> {epreuve.date} |
                      <strong> Heure:</strong> {epreuve.heure_debut} -{" "}
                      {epreuve.heure_fin}
                    </p>
                  </div>
                ))}
              </div> */}
            </SimpleBar>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ListCalendrier;
