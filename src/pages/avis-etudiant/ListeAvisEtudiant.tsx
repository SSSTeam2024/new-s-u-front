import React, { useState, useMemo, useCallback } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";

import { Link, useNavigate } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { actionAuthorization } from "utils/pathVerification";
import {
  useFetchAvisEtudiantQuery,
  useDeleteAvisEtudiantMutation,
} from "features/avisEtudiant/avisEtudiantSlice";
const ListeAvisEtudiant = () => {
  document.title = "Avis Etudiant | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data: avisEtudiant } = useFetchAvisEtudiantQuery();
  console.log("aviss",avisEtudiant)
  const { refetch } = useFetchAvisEtudiantQuery();
  const [deleteAvisEtudiant] = useDeleteAvisEtudiantMutation();

  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  // State for PDF modal
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const handleDeleteAvisEtudiant = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085D6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
      });
      if (result.isConfirmed) {
        await deleteAvisEtudiant({ _id: id }).unwrap();
        Swal.fire("Supprimé !", "L'aavis etudiant a été supprimée.", "success");
        refetch(); // Recharger les données ou mettre à jour l'UI
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité :", error);
      Swal.fire(
        "Erreur !",
        "Un problème est survenu lors de la suppression de l'actualité.",
        "error"
      );
    }
  };
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
  const handleShowPdfModal = (fileName: string) => {
    let link =
      `${process.env.REACT_APP_API_URL}/files/avisEtudiantFiles/pdf/` +
      fileName;
    setPdfUrl(link);
    setShowPdfModal(true);
  };
  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl("");
  };

  const navigate = useNavigate();
  function tog_AddAvisEtudiant() {
    navigate("/avis-etudiant/ajouter-avis-etudiant");
  }
  const columns = useMemo(
    () => [
      {
        Header: "Titre",
        accessor: "title",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: { value: string }) =>
          value.length > 50 ? value.slice(0, 50) + "..." : value,
      },
      {
        Header: "Date",
        accessor: "createdAt",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Auteur",
        accessor: (row: any) => row.auteurId?.login || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "PDF",
        accessor: "pdf",
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: any) => (
          <Button
            variant="link"
            onClick={() => handleShowPdfModal(row.original.pdf)}
          >
             <i
                      className="bi bi-filetype-pdf me-2"
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
          </Button>
        ),
      },
      {
        Header: "Lien",
        accessor: "lien",
        disableFilters: true,
        filterable: true,
        Cell: ({ cell: { value } }: any) => (
          <Button variant="link" onClick={() => window.open(value, "_blank")}>
              
                   <i
                      className="bi bi-link-45deg me-2"
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
          </Button>
        ),
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/avis-etudiant/single-avis-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/avis-etudiant/single-avis-etudiant"
                    state={cellProps}
                    className="badge bg-info-subtle text-info view-item-btn"
                    // data-bs-toggle="offcanvas"
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
                "/avis-etudiant/edit-avis-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/avis-etudiant/edit-avis-etudiant"
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
                "/avis-etudiant/supprimer-avis-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="#"
                    className="badge bg-danger-subtle text-danger remove-item-btn"
                  >
                    <i
                      onClick={() => handleDeleteAvisEtudiant(cellProps?._id!)}
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
    [checkedAll]
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste des Avis" pageTitle="Avis Etudiant" />
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
                          placeholder="Chercher un avis..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </label>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddAvisEtudiant()}
                        >
                          Ajouter Avis
                        </Button>
                      </div>
                    </Col>
                    {isMultiDeleteButton && (
                      <Button variant="danger" className="btn-icon">
                        <i className="ri-delete-bin-2-line"></i>
                      </Button>
                    )}
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={avisEtudiant || []}
                    isGlobalFilter={false}
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
      {/* PDF Modal */}
      <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>PDF Viewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: "none" }}
            title="PDF Viewer"
          ></iframe>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
export default ListeAvisEtudiant;
