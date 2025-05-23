import React, { useState, useMemo, useCallback } from "react";
import { Button, Card, Col, Container, Offcanvas, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useFetchAllUsersQuery,
  useDeleteUserMutation,
} from "features/account/accountSlice";
import { useFetchUserPermissionsHistoryByUserIdQuery } from "features/userPermissions/userPermissionSlice";

interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section: string;
  __v: number;
}

const ListeAdmin = () => {
  document.title = "Liste des admins | ENIGA";

  const navigate = useNavigate();

  const { data: usersResponse = [] } = useFetchAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<{
    userId: string;
  } | null>(null); // State to hold selected user ID

  const handleShow = (userId: string) => {
    setSelectedUserId({ userId }); // Set the selected user ID
    setShow(true); // Show the Offcanvas
  };
  const {
    data: userPermissionsHistory,
    isLoading,
    isError,
  } = useFetchUserPermissionsHistoryByUserIdQuery({
    userId: selectedUserId?.userId || "", // Use empty string or handle default value as per your logic
  });
  const handleClose = () => setShow(false);

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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  function tog_AddAdmin() {
    navigate("/admin/ajouter-admin");
  }

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
          deleteUser(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "L'utilisateur a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'utilisateur est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nom",
        accessor: (row: any) =>
          row.enseignantId?.prenom_fr || row.personnelId?.prenom_fr || row.name,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Email",
        accessor: (row: any) =>
          row.enseignantId?.email || row.personnelId?.email,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Login",
        accessor: (row: any) => row?.login!,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Service",
        accessor: (row: any) => row.service?.title!,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Titre Application",
        accessor: "app_name",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (admin: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/admin/single-admin"
                  state={admin}
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
              <li>
                <Link
                  to="/admin/edit-admin"
                  state={admin}
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
              {/* <li>
                <Link
                  to="/admin/history-admin"
                  state={admin}
                  className="badge bg-warning-subtle text-warning edit-item-btn"
                >
                  <i
                    className="bi bi-archive"
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
              </li> */}
              <li>
                <Link
                  onClick={() => handleShow(admin._id)}
                  className="badge bg-warning-subtle text-warning edit-item-btn"
                  to={""}
                >
                  <i
                    className="bi bi-archive"
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
                    onClick={() => AlertDelete(admin._id)}
                  ></i>
                </Link>
              </li>
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
          <Breadcrumb title="Liste des admins" pageTitle="Gestion des admins" />

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
                          placeholder="Chercher un admin..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </label>
                    </Col>
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddAdmin()}
                        >
                          Ajouter un admin
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
                    data={usersResponse || []}
                    iscustomPageSize={false}
                    isBordered={false}
                    isPagination={true}
                    customPageSize={10}
                    className="custom-header-css"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="text-muted"
                    SearchPlaceholder="Search Admins..."
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Offcanvas for displaying permissions history */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Historique des permissions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error fetching history.</p>}
          {userPermissionsHistory && (
            <div>
              {userPermissionsHistory.map((historyItem) => (
                <div key={historyItem._id}>
                  <h6>User ID: {historyItem.user_id}</h6>
                  {historyItem.assigned_at && (
                    <p style={{ color: "green" }}>
                      Attribué à:{" "}
                      {new Date(historyItem.assigned_at).toLocaleString()}
                    </p>
                  )}
                  {historyItem.removed_at && (
                    <p style={{ color: "red" }}>
                      Retiré à:{" "}
                      {new Date(historyItem.removed_at).toLocaleString()}
                    </p>
                  )}
                  <ul>
                    {historyItem.permissions.map((permission) => (
                      <li key={permission._id}>
                        {permission.name} - {permission.path}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ListeAdmin;
