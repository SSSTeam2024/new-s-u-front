import React, { useMemo } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { actionAuthorization } from "utils/pathVerification";
import {
  useFetchAvisEnseignantQuery,
  useDeleteAvisEnseignantMutation,
} from "features/avisEnseignant/avisEnseignantSlice";
import Swal from "sweetalert2";

import { useFetchNotesProQuery } from "features/notesPro/notesProSlice";

const ListeNotesPro = () => {
  document.title = "Notes Professionnelles | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();

  const { data: notesPro } = useFetchNotesProQuery();
  console.log("notesPro", notesPro)
  const { refetch } = useFetchAvisEnseignantQuery();
  const [deleteAvisEnseignant] = useDeleteAvisEnseignantMutation();

  function tog_AddNewGrades() {
    navigate("/gestion-notes-professionelles/Ajouter-notes-professionelles");
  }

  const handleDeleteAvisEnseignant = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
      });

      if (result.isConfirmed) {
        await deleteAvisEnseignant({ _id: id }).unwrap();
        Swal.fire(
          "Supprimé !",
          "Note Professionnelle a été supprimée.",
          "success"
        );
        refetch(); // Recharger les données ou mettre à jour l'UI
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du Note Professionnelle :",
        error
      );
      Swal.fire(
        "Erreur !",
        "Un problème est survenu lors de la suppression du note professionnelle.",
        "error"
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Personnel",
        accessor: (row: any) =>
          `${row.personnel?.nom_fr || ""} ${row.personnel?.prenom_fr || ""}`,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Quantité de travail",
        accessor: "note1",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Mode de travail",
        accessor: "note2",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Relations et Apparence",
        accessor: "note3",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Persévérance",
        accessor: "note4",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Discipline",
        accessor: "note5",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Note finale",
        accessor: "note_finale",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Année",
        accessor: "annee",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/avis-enseignant/single-avis-enseignant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/avis-enseignant/single-avis-enseignant"
                    state={cellProps}
                    className="badge bg-info-subtle text-info view-item-btn"
                    data-bs-toggle="offcanvas"
                  >
                    <i
                      className="ph ph-eye"
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
              ) : (
                <></>
              )}
              {actionAuthorization(
                "/avis-enseignant/edit-avis-enseignant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/avis-enseignant/edit-avis-enseignant"
                    className="badge bg-success-subtle text-success edit-item-btn"
                    state={cellProps}
                  >
                    <i
                      className="ph ph-pencil-line"
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
              ) : (
                <></>
              )}
              {actionAuthorization(
                "/avis-enseignant/supprimer-avis-enseignant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="#"
                    className="badge bg-danger-subtle text-danger remove-item-btn"
                  >
                    <i
                      onClick={() =>
                        handleDeleteAvisEnseignant(cellProps?._id!)
                      }
                      className="ph ph-trash"
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
              ) : (
                <></>
              )}
            </ul>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste des notes profesionnelles"
            pageTitle="Notes profesionnelles"
          />
          <Card className="p-2">
            <Row>
              <Col lg={10}></Col>
              <Col lg={2}>
                <span
                  className="badge bg-secondary-subtle text-secondary view-item-btn fs-16"
                  style={{ cursor: "pointer" }}
                  onClick={() => tog_AddNewGrades()}
                >
                  <i className="ph ph-plus align-middle"></i> Note
                  professionnelle
                </span>
              </Col>
            </Row>
          </Card>

          <Row id="usersList">
            <Col lg={12}>
              {/* <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher un avis..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>

                    {isMultiDeleteButton && (
                      <Button variant="danger" className="btn-icon">
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}
                  </Row>
                </Card.Body>
              </Card> */}
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={notesPro || []}
                    // isGlobalFilter={false}
                    iscustomPageSize={false}
                    isBordered={false}
                    customPageSize={10}
                    isPagination={true}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted"
                    SearchPlaceholder="Search Products..."
                  />
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center">
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ Orders We did not find any
                        orders for you search.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListeNotesPro;
