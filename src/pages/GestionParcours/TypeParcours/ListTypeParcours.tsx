import React, { useEffect, useMemo, useState } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import { actionAuthorization } from "utils/pathVerification";
import { RootState } from "app/store";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "features/account/authSlice";
import { DomaineClasse } from "features/domaineClasse/domaineClasse";
import {
  useAddTypeParcoursMutation,
  useDeleteTypeParcoursMutation,
  useFetchTypeParcoursQuery,
  useUpdateTypeParcoursMutation,
} from "features/TypeParcours/TypeParcours";

const ListTypeParcours = () => {
  document.title = "Liste types parcours | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchTypeParcoursQuery();
  const filteredTypesParcours = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((typeParcours) =>
        [
          typeParcours.name_type_parcours_ar,
          typeParcours.name_type_parcours_fr,
          typeParcours.abreviation,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deleteTypeParcours] = useDeleteTypeParcoursMutation();

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
          deleteTypeParcours(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Type parcours a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Type parcours est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Type Parcours (FR)",
        accessor: "name_type_parcours_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Type Parcours (AR)",
        accessor: "name_type_parcours_ar",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Abréviation",
        accessor: "abreviation",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (domaineClasse: DomaineClasse) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/parcours/gestion-parcours/edit-type-parcours",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/parcours/gestion-parcours/edit-type-parcours"
                    state={domaineClasse}
                    className="badge bg-primary-subtle text-primary edit-item-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditModal(domaineClasse);
                    }}
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
              ) : (
                <></>
              )}
              {actionAuthorization(
                "/parcours/gestion-parcours/delete-type-parcours",
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
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => AlertDelete(domaineClasse?._id!)}
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
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const [createTypeParcours] = useAddTypeParcoursMutation();
  const { state: typeParcours } = useLocation();
  const [editTypeParcours] = useUpdateTypeParcoursMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name_type_parcours_ar: "",
    name_type_parcours_fr: "",
    abreviation: "",
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      name_type_parcours_ar: "",
      name_type_parcours_fr: "",
      abreviation: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (typeParcours: any) => {
    setFormData({
      _id: typeParcours._id,
      name_type_parcours_fr: typeParcours.name_type_parcours_fr,
      name_type_parcours_ar: typeParcours.name_type_parcours_ar,
      abreviation: typeParcours.abreviation,
    });
    setShowEditModal(true);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onSubmitTypeParcours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTypeParcours(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parcours/gestion-parcours/liste-type-parcours");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditTypeParcours = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editTypeParcours(formData).unwrap();
      setShowEditModal(false);
      notifyEdit();
    } catch (error) {
      errorAlert("An error occurred while editing the type parcours.");
    }
  };

  useEffect(() => {
    if (typeParcours && isEditModalOpen) {
      setFormData({
        _id: typeParcours._id,
        name_type_parcours_fr: typeParcours.name_type_parcours_fr,
        name_type_parcours_ar: typeParcours.name_type_parcours_ar,
        abreviation: typeParcours.abreviation,
      });
    }
  }, [typeParcours, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Type Parcours a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const notifyEdit = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Type Parcours a été modifié avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Paramètres des Parcours"
            pageTitle="Liste types des parcours"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        {actionAuthorization(
                          "/parcours/gestion-parcours/ajouter-type-parcours",
                          user?.permissions!
                        ) ? (
                          <Button
                            variant="primary"
                            className="add-btn"
                            onClick={() => handleAddClick()}
                          >
                            Ajouter type parcours
                          </Button>
                        ) : (
                          <></>
                        )}
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
                      data={filteredTypesParcours || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
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
              </Card>
            </Col>
            {/* Add type parcours */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Type Parcours
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitTypeParcours}>
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_type_parcours_fr">
                          Type Parcours(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_type_parcours_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_type_parcours_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_type_parcours_ar">
                          Type Parcours(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_type_parcours_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_type_parcours_ar}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="abreviation">
                          Abréviation
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="abreviation"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.abreviation}
                        />
                      </div>
                    </Col>
                  </Row>
                </Modal.Body>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button className="btn-ghost-danger">Fermer</Button>
                    <Button
                      variant="success"
                      id="add-btn"
                      type="submit"
                      onClick={tog_AddOrderModals}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </Form>
            </Modal>

            {/*Edit Type Parcours */}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Modifier Type Parcours
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitEditTypeParcours}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_type_parcours_fr">
                          Type Parcours(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_type_parcours_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_type_parcours_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_type_parcours_ar">
                          Type Parcours(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_type_parcours_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_type_parcours_ar}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="abreviation">
                          Abréviation
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="abreviation"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.abreviation}
                        />
                      </div>
                    </Col>
                  </Row>
                </Modal.Body>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => setShowEditModal(false)}
                    >
                      Fermer
                    </Button>
                    <Button variant="success" id="add-btn" type="submit">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </Form>
            </Modal>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListTypeParcours;
