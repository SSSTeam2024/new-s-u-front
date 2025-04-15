import React, { useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteCoursMutation,
  useFetchCoursEnseignantsQuery,
} from "features/coursEnseignant/coursSlice";

const Cours = () => {
  document.title = "Supports | ENIGA";

  const { data = [] } = useFetchCoursEnseignantsQuery();

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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const getFilteredCours = () => {
    let filteredCours = [...data];

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();

      filteredCours = filteredCours.filter((cours: any) => {
        const nomCours = cours?.nom_cours?.toLowerCase() || "";
        const enseignantNom = cours?.enseignant?.nom_fr?.toLowerCase() || "";
        const enseignantPrenom =
          cours?.enseignant?.prenom_fr?.toLowerCase() || "";

        const classeMatch = cours?.classe?.some((c: any) =>
          c?.nom_classe_fr?.toLowerCase().includes(lowerCaseSearch)
        );

        return (
          nomCours.includes(lowerCaseSearch) ||
          enseignantNom.includes(lowerCaseSearch) ||
          enseignantPrenom.includes(lowerCaseSearch) ||
          classeMatch
        );
      });
    }

    return filteredCours.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Supports" pageTitle="Application Enseignant" />
          <Col lg={12}>
            <Card>
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <label className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </label>
                  </Col>
                  <Col lg={6}></Col>
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
                  data={getFilteredCours()}
                  pagination
                  noDataComponent="Il n'y a aucun enregistrement à afficher"
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Cours;
