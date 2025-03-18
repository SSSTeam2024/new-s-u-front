import React, { useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteAbsenceMutation,
  useFetchAbsenceEtudiantsQuery,
} from "features/absenceEtudiant/absenceSlice";

const AbsenceEtudiant = () => {
  document.title = "Absences | ENIGA";

  //! add this line just to push it in github !!
  const { data = [] } = useFetchAbsenceEtudiantsQuery();

  const [showObservation, setShowObservation] = useState<boolean>(false);

  const navigate = useNavigate();

  function tog_AddAbsence() {
    navigate("/application-enseignant/ajouter-absence");
  }

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
            "Absence Etudiant est en sécurité :)",
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredAbsences = () => {
    let filteredAbsences = [...data];

    if (searchTerm) {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) =>
          absence?.classe
            ?.nom_classe_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.seance?.matiere
            ?.matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.seance
            ?.heure_debut!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.prenom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredAbsences.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Absence" pageTitle="Application Enseignant" />
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
      </div>
    </React.Fragment>
  );
};
export default AbsenceEtudiant;
