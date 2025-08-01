import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import { LienUtils } from "Common/data/lienUtils";
import {
  useFetchTemplateBodyQuery,
  useDeleteTemplateBodyMutation,
} from "features/templateBody/templateBodySlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
type LanguageCode = "french" | "arabic";
const TemplateBody = () => {
  document.title = "Liste des modèles | ENIGA";
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const { data: allTemplateBody = [] } = useFetchTemplateBodyQuery();
  console.log("allTemplateBody", allTemplateBody)
  const [deleteTemplateBody] = useDeleteTemplateBodyMutation();
  const handleDeleteTemplate = async (id: string) => {
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
          await deleteTemplateBody(id).unwrap();
          MySwal.fire("Deleted!", "Modele a été supprimée", "success");
        }
      });
    } catch (error) {
      console.error("Failed to delete reclamation:", error);
      MySwal.fire(
        "Error!",
        "There was an error deleting the reclamation.",
        "error"
      );
    }
  };
  const languageMapping: Record<LanguageCode, string> = {
    french: "Français",
    arabic: "Arabe",
  };
  const [showModal, setShowModal] = useState(false);
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const columns = useMemo(
    () => [
      {
        Header: "Titre",
        accessor: "title",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Langue",
        accessor: (row: { langue: LanguageCode }) =>
          languageMapping[row.langue] || row.langue,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "destiné à",
        accessor: "intended_for",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Gérée par",
        accessor: "handled_by",
        Cell: ({ value }: { value: any[] }) => {
          if (!Array.isArray(value) || value.length === 0) return "Aucun";

          const validUsers = value.filter(
            (user) => user?.prenom_fr && user?.nom_fr
          );

          if (validUsers.length === 0) return "Aucun";

          const maxVisible = 3;
          const visible = validUsers.slice(0, maxVisible);
          const remaining = validUsers.length - maxVisible;

          return (
            <span>
              {visible.map((user, index) => (
                <span key={index}>
                  {user.prenom_fr} {user.nom_fr}
                  {index < visible.length - 1 ? ", " : ""}
                </span>
              ))}

              {remaining > 0 && (
                <>
                  {" et "}
                  <span
                    onClick={() => {
                      setModalUsers(value);
                      setShowModal(true);
                    }}
                    className="fw-semibold text-info text-decoration-underline"
                    style={{ cursor: "pointer", textUnderlineOffset: "2px" }}
                  >
                    {remaining} autre{remaining > 1 ? "s" : ""}
                  </span>

                </>
              )}
            </span>
          );
        },
        disableFilters: true,
        filterable: true,
      }


      ,
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/template/single-template-body"
                  state={cellProps}
                  className="badge bg-info-subtle text-info view-item-btn"
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
              <li>
                <Link
                  to="/template/edit-template-body"
                  state={cellProps}
                  className="badge bg-success-subtle text-success edit-item-btn"
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
                  to="#"
                  onClick={() => handleDeleteTemplate(cellProps._id)}
                  className="badge bg-danger-subtle text-danger remove-item-btn"
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
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste des modèles"
            pageTitle="Gestion des modèles"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <label className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </label>
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
                          onClick={() =>
                            navigate("/template/ajouter-template-body")
                          }
                        >
                          Ajouter un modèle
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
                      data={allTemplateBody || []}
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
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Liste des utilisateurs</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="mb-3 text-muted">
                      Les utilisateurs suivants sont les administrateurs responsables du traitement de ce modèle :
                    </p>
                    <ul className="list-unstyled">
                      {modalUsers.map((user, index) => (
                        <li key={index}>
                          - {user.prenom_fr} {user.nom_fr}
                        </li>
                      ))}
                    </ul>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Fermer
                    </Button>
                  </Modal.Footer>
                </Modal>


              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TemplateBody;
