import React, { useState, useMemo, useCallback } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import Flatpickr from "react-flatpickr";
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";
import { Link, useNavigate } from "react-router-dom";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useFetchDemandeEtudiantQuery,
  useDeleteDemandeEtudiantMutation,
} from "features/demandeEtudiant/demandeEtudiantSlice";

const ListeDemandeEtudiant = () => {
  document.title = "Demandes Etudiant | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const MySwal = withReactContent(Swal);

  // Fetch reclamations query hook
  const { data: demandesEtudiant } = useFetchDemandeEtudiantQuery();

  // Mutation hooks
  const [deleteDemandeEtudiant] = useDeleteDemandeEtudiantMutation();

  const handleDeleteDemande = async (id: string) => {
    try {
      await MySwal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas annuler cela !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDemandeEtudiant(id).unwrap();
          MySwal.fire("Supprimée!", "Demande a été supprimée", "success");
        }
      });
    } catch (error) {
      console.error("Failed to delete demand:", error);
      MySwal.fire(
        "Error!",
        "Une erreur s'est produite lors de la suppression de la demande.",
        "error"
      );
    }
  };
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/demandes-etudiant/ajouter-demande-etudiant");
  };

  const [modal_AddUserModals, setmodal_AddUserModals] =
    useState<boolean>(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  function tog_AddUserModals() {
    setmodal_AddUserModals(!modal_AddUserModals);
  }

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkAll") as HTMLInputElement;
    const ele = document.querySelectorAll(".userCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    checkedbox();
  }, []);

  const checkedbox = () => {
    const ele = document.querySelectorAll(".userCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
  };

  const [showHint, setShowHint] = useState(true);

  const columns = useMemo(
    () => [
      {
        Header: "Pièce demandée",
        accessor: (row: any) => row.piece_demande?.title || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Etudiant",
        accessor: (row: any) => `${row.studentId?.nom_fr || ""} ${row.studentId?.prenom_fr || ""}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "CIN",
        accessor: (row: any) => row.studentId?.num_CIN || "",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Classe",
        accessor: (row: any) =>
          row.studentId?.groupe_classe?.nom_classe_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date d'Envoi",
        accessor: (row: any) =>
          new Date(row.createdAt).toLocaleDateString("fr-FR"),
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date de modification",
        accessor: (row: any) =>
          new Date(row.updatedAt).toLocaleDateString("fr-FR"),
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Etat",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          switch (cellProps.current_status) {
            case "Approuvée":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            case "Réfusée":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            case "Générée":
              return (
                <span className="badge bg-secondary-subtle text-secondary">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
            default:
              return (
                <span className="badge bg-warning-subtle text-warning">
                  {" "}
                  {cellProps.current_status}
                </span>
              );
          }
        },
      },

      {
        Header: "Actions",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <div>
              <ul className="hstack gap-2 list-unstyled mb-1">
                {actionAuthorization(
                  "/demandes-etudiant/Single-demande-etudiant",
                  user?.permissions!
                ) && (
                    <li>
                      <Link
                        to="/demandes-etudiant/Single-demande-etudiant"
                        state={cellProps}
                        className="badge bg-info-subtle text-info view-item-btn"
                      >
                        <i
                          className="ph ph-gear-six"
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
                  )}

                {actionAuthorization(
                  "/demandes-etudiant/supprimer-demande-etudiant",
                  user?.permissions!
                ) &&
                  cellProps.current_status === "En attente" &&
                  cellProps.added_by?._id === user?._id && (
                    <li>
                      <Link
                        to="#"
                        className="badge bg-danger-subtle text-danger remove-item-btn"
                        onClick={() => handleDeleteDemande(cellProps._id)}
                      >
                        <i
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
                  )}
              </ul>

              {cellProps.added_by && (
                <div className="d-flex align-items-center text-muted small mt-1">
                  <i className="bi bi-person-circle me-1"></i>
                  <span className="fst-italic">
                    Ajoutée par : <strong>{cellProps.added_by.login}</strong>
                  </span>
                </div>
              )}

            </div>
          );
        },
      },
    ],
    [checkedAll]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Demandes Etudiant"
            pageTitle="Liste des demandes"
          />

          <Row id="usersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col lg={3}>
                      <label className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher une demande..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </label>
                    </Col>

                    {isMultiDeleteButton && (
                      <Button variant="danger" className="btn-icon">
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}

                    <Col sm={3} className="col-lg-auto ms-auto">
                      <Button
                        onClick={handleNavigate}
                        variant="primary"
                        type="button"
                        className="w-100 add-btn"
                      >
                        Ajouter une demande
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  {showHint && (
                    <Alert
                      variant="warning"
                      dismissible
                      onClose={() => setShowHint(false)}
                      className="d-flex align-items-center gap-2 m-3"
                    >
                      <i className="ri-information-line fs-4"></i>
                      <div>
                        <strong>Remarque :</strong> Le bouton de suppression n'apparaît que pour les demandes avec le statut <strong>"En attente"</strong> et uniquement si vous êtes l'administrateur qui a ajouté la demande.
                      </div>
                    </Alert>
                  )}
                  <TableContainer
                    columns={columns || []}
                    data={demandesEtudiant || []}
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

export default ListeDemandeEtudiant;
