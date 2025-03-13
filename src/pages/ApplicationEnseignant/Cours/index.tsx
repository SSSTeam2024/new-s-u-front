import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col, Form, Offcanvas } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteCoursMutation,
  useFetchCoursEnseignantsQuery,
} from "features/coursEnseignant/coursSlice";

const Cours = () => {
  const { data = [] } = useFetchCoursEnseignantsQuery();
  // console.log(data);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showObservation, setShowObservation] = useState(false);
  const navigate = useNavigate();

  function tog_AddAbsence() {
    navigate("/application-enseignant/ajouter-cours");
  }

  const [deleteCours] = useDeleteCoursMutation();
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
          deleteCours(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Support Cours a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Support Cours est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => (
        <span>{row?.classe?.map((c: any) => c.nom_classe_fr).join(", ")}</span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row.nom_cours,
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
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/application-enseignant/visualiser-support-cours"
                className="badge badge-soft-info edit-item-btn"
                state={{ coursDetails: row }}
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
                to="/application-enseignant/modifier-support-cours"
                className="badge badge-soft-success edit-item-btn"
                state={{ coursDetails: row }}
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
          <Breadcrumb title="Support" pageTitle="Application Enseignant" />
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
                        // value={searchTerm}
                        // onChange={handleSearchChange}
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
                        <span>Ajouter Support</span>
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
          onHide={() => setShowObservation(false)}
          placement="end"
          style={{ width: "30%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Cours</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {selectedCourse ? (
              <>
                {/* Classe Information */}
                <Row className="mb-3">
                  <Col lg={3}>
                    <span className="fw-medium">Classe</span>
                  </Col>
                  <Col lg={9}>
                    <i>{selectedCourse.classe[0]?.nom_classe_fr}</i>
                  </Col>
                </Row>

                {/* Course Information */}
                <Row className="mb-3">
                  <Col lg={3}>
                    <span className="fw-medium">Matière</span>
                  </Col>
                  <Col lg={9}>
                    <i>{selectedCourse.nom_cours}</i>
                  </Col>
                </Row>

                {/* Trimester */}
                <Row className="mb-3">
                  <Col lg={3}>
                    <span className="fw-medium">Trimèstre</span>
                  </Col>
                  <Col lg={9}>
                    <i>{selectedCourse.trimestre}</i>
                  </Col>
                </Row>

                {/* Teacher Information */}
                <Row className="mb-3">
                  <Col lg={3}>
                    <span className="fw-medium">Enseignant</span>
                  </Col>
                  <Col lg={9}>
                    <i>
                      {selectedCourse.enseignant?.nom_fr}{" "}
                      {selectedCourse.enseignant?.prenom_fr}
                    </i>
                  </Col>
                </Row>

                {/* Displaying file_cours links */}
                {selectedCourse.file_cours &&
                  selectedCourse.file_cours.length > 0 && (
                    <Row className="mb-3">
                      <Col lg={3}>
                        <span className="fw-medium">Fichiers de Cours</span>
                      </Col>
                      <Col lg={9}>
                        {selectedCourse.file_cours.map(
                          (file: any, index: any) => {
                            // Get the file extension to determine how to handle it
                            const fileExtension = file
                              .split(".")
                              .pop()
                              .toLowerCase();

                            return (
                              <div key={index}>
                                {fileExtension === "pdf" ||
                                fileExtension === "xlsx" ||
                                fileExtension === "xls" ||
                                fileExtension === "pptx" ||
                                fileExtension === "ppt" ||
                                fileExtension === "jpg" ||
                                fileExtension === "jpeg" ||
                                fileExtension === "png" ||
                                fileExtension === "gif" ? (
                                  <a
                                    href={file}
                                    download
                                    className="btn btn-link"
                                  >
                                    {file.split("/").pop()}{" "}
                                    {/* Display file name */}
                                  </a>
                                ) : (
                                  // Default case for other file types
                                  <a
                                    href={file}
                                    download
                                    className="btn btn-link"
                                  >
                                    {file.split("/").pop()}{" "}
                                    {/* Display file name */}
                                  </a>
                                )}
                              </div>
                            );
                          }
                        )}
                      </Col>
                    </Row>
                  )}
              </>
            ) : (
              <p>Loading details...</p>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};

export default Cours;
