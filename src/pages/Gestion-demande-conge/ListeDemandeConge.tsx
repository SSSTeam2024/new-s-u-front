import React, { useState, useMemo, useCallback } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Link } from "react-router-dom";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { actionAuthorization } from "utils/pathVerification";
import { useFetchDemandeCongeQuery } from "features/congé/demandeCongeSlice";

const ListeDemandeConge = () => {
  document.title = "Liste demande conge | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: demandeConge, error, isLoading } = useFetchDemandeCongeQuery();

  const [modal_AddUserModals, setmodal_AddUserModals] =
    useState<boolean>(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  function tog_AddUserModals() {
    setmodal_AddUserModals(!modal_AddUserModals);
  }

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
      `${process.env.REACT_APP_API_URL}/files/congeFiles/demandeCongeFiles/` +
      fileName;

    setPdfUrl(link);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl("");
  };

  const columns = useMemo(
    () => [
      {
        Header: "Personnel",
        accessor: (row: any) =>
          `${row.personnelId?.prenom_fr} ${row.personnelId?.nom_fr}`,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Type de congé",
        accessor: (row: any) => row.leaveType?.name_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Categorie",
        accessor: (row: any) => row.subcategory?.name_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date debut",
        accessor: (row: any) =>
          new Date(row.startDay).toLocaleDateString("fr-FR"),
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date fin",
        accessor: (row: any) =>
          new Date(row.endDay).toLocaleDateString("fr-FR"),
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Fichier",
        accessor: "file",
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: any) => (
          <Button
            variant="link"
            onClick={() => handleShowPdfModal(row.original.file)}
          >
            <i
              className="bi bi-filetype-pdf text-danger"
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
        Header: "Status",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          switch (cellProps.status) {
            case "en cours":
              return (
                <span className="badge bg-warning-subtle text-warning">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "acceptée":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "refusée":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "suspendue":
              return (
                <span className="badge bg-primary-subtle text-primary">
                  {" "}
                  {cellProps.status}
                </span>
              );
            default:
              return (
                <span className="badge bg-warning-subtle text-warning">
                  {" "}
                  {cellProps.status}
                </span>
              );
          }
        },
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/demande-conge/single-demande-conge",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/demande-conge/single-demande-conge"
                    state={cellProps}
                    className="badge bg-info-subtle text-info view-item-btn"
                    // data-bs-toggle="offcanvas"
                  >
                    <i
                      className="bi bi-file-earmark-arrow-down"
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
                "/demande-conge/edit-demande-conge",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/demande-conge/edit-demande-conge"
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
          <Breadcrumb
            title="Liste demande conge"
            pageTitle="Gestion des congés"
          />
          <Row id="usersList">
            <Col lg={12}>
              <Card>
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
              </Card>
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={demandeConge || []}
                    iscustomPageSize={false}
                    isBordered={false}
                    isPagination={true}
                    customPageSize={10}
                    className="custom-header-css table align-middle table-nowrap"
                    tableClass="table-centered align-middle table-nowrap mb-0"
                    theadClass="text-muted table-light"
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

export default ListeDemandeConge;
