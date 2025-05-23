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
import {
  DomaineClasse,
  useAddDomaineClasseMutation,
  useDeleteDomaineClasseMutation,
  useFetchDomainesClasseQuery,
  useUpdateDomaineClasseMutation,
} from "features/domaineClasse/domaineClasse";

const ListDomaineClass = () => {
  document.title = "Liste domaines des classes | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchDomainesClasseQuery();
  const filteredDomaineClasses = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((domaineClasse) =>
        [
          domaineClasse.name_domaine_ar,
          domaineClasse.name_domaine_fr,
          domaineClasse.abreviation,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deleteDomaineClasse] = useDeleteDomaineClasseMutation();

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
          deleteDomaineClasse(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Domaine classe a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Domaine classe est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Domaine Classe (FR)",
        accessor: "name_domaine_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Domaine Classe (AR)",
        accessor: "name_domaine_ar",
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
                "/departement/gestion-classes/edit-domaine-classe",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/departement/gestion-classes/edit-domaine-classe"
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
                "/departement/gestion-classes/delete-domaine-classe",
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

  const [createDomaineClasse] = useAddDomaineClasseMutation();
  const { state: domaineClasse } = useLocation();
  const [editDomaineClasse] = useUpdateDomaineClasseMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name_domaine_fr: "",
    name_domaine_ar: "",
    abreviation: "",
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      name_domaine_fr: "",
      name_domaine_ar: "",
      abreviation: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (domaineClasse: any) => {
    setFormData({
      _id: domaineClasse._id,
      name_domaine_fr: domaineClasse.name_domaine_fr,
      name_domaine_ar: domaineClasse.name_domaine_ar,
      abreviation: domaineClasse.abreviation,
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

  const onSubmitDomaineClasse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createDomaineClasse(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/departement/gestion-classes/liste-domaines");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditDomaineClasse = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editDomaineClasse(formData).unwrap();
      setShowEditModal(false);
      notifyEdit();
    } catch (error) {
      errorAlert("An error occurred while editing the poste enseignant.");
    }
  };

  useEffect(() => {
    if (domaineClasse && isEditModalOpen) {
      setFormData({
        _id: domaineClasse._id,
        name_domaine_fr: domaineClasse.name_domaine_fr,
        name_domaine_ar: domaineClasse.name_domaine_ar,
        abreviation: domaineClasse.abreviation,
      });
    }
  }, [domaineClasse, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Domaine Classe a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const notifyEdit = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Domaine Classe a été modifié avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste des domaines"
            pageTitle="Liste des domaines"
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
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </label>
                    </Col>
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        {actionAuthorization(
                          "/departement/gestion-classes/add-domaine-classe",
                          user?.permissions!
                        ) ? (
                          <Button
                            variant="primary"
                            className="add-btn"
                            onClick={() => handleAddClick()}
                          >
                            Ajouter domaine classe
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
                      data={filteredDomaineClasses || []}
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
              </Card>
            </Col>
            {/* Add domaine classe */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Domaine Classe
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitDomaineClasse}>
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_domaine_fr">
                          Domaine Classe(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_domaine_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_domaine_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_domaine_ar">
                          Domaine Classe(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_domaine_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_domaine_ar}
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

            {/*Edit domaine classe */}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Modifier Domaine Classe
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitEditDomaineClasse}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_domaine_fr">
                          Domaine Classe(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_domaine_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_domaine_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={4}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_domaine_ar">
                          Domaine Classe(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_domaine_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_domaine_ar}
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

export default ListDomaineClass;
