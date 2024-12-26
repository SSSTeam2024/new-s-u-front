import React, { useState, useMemo, useCallback } from "react";
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
import CountUp from "react-countup";
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
  useFetchLeaveBalanceQuery,
  useAddLeaveBalanceMutation,
  LeaveBalance,
} from "features/congé/leaveBalanceSlice";

const ListeSoldeConge = () => {
  document.title = "Liste solde Congés | Smart Institute";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const MySwal = withReactContent(Swal);

  // Fetch reclamations query hook
  const { data: leaveBalance, error, isLoading } = useFetchLeaveBalanceQuery();
  console.log("leaveBalance", leaveBalance);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/solde-conge/Ajouter-solde-conge");
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
        Header: "Catégorie",
        accessor: (row: any) => {
          const leaveTypeName = row.leaveType?.name_fr || "";
          const subcategoryName = row.subcategory?.name_fr || ""; // Assuming subcategory is populated and has a `name` property
          return subcategoryName
            ? `${leaveTypeName} (${subcategoryName})`
            : leaveTypeName;
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Jours utilisés",
        accessor: "daysUsed",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Jours restants",
        accessor: "remainingDays",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Année",
        accessor: "year",
        disableFilters: true,
        filterable: true,
      },

      // {
      //   Header: "Etat",
      //   disableFilters: true,
      //   filterable: true,
      //   accessor: (cellProps: any) => {
      //     switch (cellProps.status) {
      //       case "traité":
      //         return (
      //           <span className="badge bg-success-subtle text-success">
      //             {" "}
      //             {cellProps.status}
      //           </span>
      //         );
      //       case "rejeté":
      //         return (
      //           <span className="badge bg-danger-subtle text-danger">
      //             {" "}
      //             {cellProps.status}
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="badge bg-secondary-subtle text-secondary">
      //             {" "}
      //             {cellProps.status}
      //           </span>
      //         );
      //     }
      //   },
      // },

      {
        Header: "Actions",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/demandes-etudiant/Single-demande-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="#"
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
                "/demandes-etudiant/Edit-demande-etudiant",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="#"
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
                "/demandes-enseignant/supprimer-demande-enseignant",
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
            title="Gestions des congés"
            pageTitle="Liste des congés"
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
                          placeholder="Chercher une demande..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
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
                        Ajouter un solde congé
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-0">
                  <TableContainer
                    columns={columns || []}
                    data={leaveBalance || []}
                    // isGlobalFilter={false}
                    iscustomPageSize={false}
                    isBordered={false}
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
    </React.Fragment>
  );
};

export default ListeSoldeConge;
