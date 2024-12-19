import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import {
  CategoriePersonnel,
  useAddCategoriePersonnelMutation,
  useDeleteCategoriePersonnelMutation,
  useFetchCategoriesPersonnelQuery,
  useUpdateCategoriePersonnelMutation,
} from "features/categoriePersonnel/categoriePersonnel";

const ListCategoriePersonnels = () => {
  document.title = "Liste catégories des personnels | Smart University";

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }

 
  const { data = [] } = useFetchCategoriesPersonnelQuery();
  const [deleteCategoriePersonnel] = useDeleteCategoriePersonnelMutation();

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
          deleteCategoriePersonnel(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Catégorie personnel a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Catégorie personnel est en sécurité :)",
            "error"
          );
        }
      });
  };
  const filteredCategoriePersonnels = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((categoriePersonnel) =>
        [categoriePersonnel.categorie_fr, categoriePersonnel.categorie_ar].some(
          (value) => value && value.toLowerCase().includes(searchQuery)
        )
      );
    }

    return result;
  }, [data, searchQuery]);

  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const [createCategoriePersonnel] = useAddCategoriePersonnelMutation();
  const { state: categoriePersonnel } = useLocation();
  const [editCategoriePersonnel] = useUpdateCategoriePersonnelMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    // value_poste_enseignant: "",
    categorie_ar: "",
    categorie_fr: "",
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      categorie_ar: "",
      categorie_fr: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (categoriePersonnel: CategoriePersonnel) => {
    setFormData({
      _id: categoriePersonnel._id,
      categorie_ar: categoriePersonnel.categorie_ar,
      categorie_fr: categoriePersonnel.categorie_fr,
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

  const onSubmitCategoriePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createCategoriePersonnel(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parametre/categorie-personnels");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditCategoriePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editCategoriePersonnel(formData).unwrap();
      setShowEditModal(false);
      notify();
    } catch (error) {
      errorAlert("An error occurred while editing the categorie personnel.");
    }
  };

  useEffect(() => {
    if (categoriePersonnel && isEditModalOpen) {
      setFormData({
        _id: categoriePersonnel._id,
        categorie_ar: categoriePersonnel.categorie_ar,
        categorie_fr: categoriePersonnel.categorie_fr,
      });
    }
  }, [categoriePersonnel, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Catégorie personnel a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Catégorie (FR)",
        accessor: "categorie_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "صنف الإداري",
        accessor: "categorie_ar",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (categoriePersonnel: CategoriePersonnel) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to=""
                  state={categoriePersonnel}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModal(categoriePersonnel);
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
                    onClick={() => AlertDelete(categoriePersonnel?._id!)}
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
            title="Paramètres des personnels"
            pageTitle="Liste catégories des personnels"
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
                    {/* <Col className="col-lg-auto">
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
                    </Col> */}

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => handleAddClick()}
                        >
                          Ajouter Catégorie
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Add categorie personnel */}
              <Modal
                show={isAddModalOpen}
                onHide={() => setAddModalOpen(false)}
                centered
              >
                <Modal.Header className="px-4 pt-4" closeButton>
                  <h5 className="modal-title" id="exampleModalLabel">
                    Ajouter Catégorie Enseignant
                  </h5>
                </Modal.Header>
                <Form
                  className="tablelist-form"
                  onSubmit={onSubmitCategoriePersonnel}
                >
                  <Modal.Body className="p-4">
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Form.Label htmlFor="categorie_fr">
                            Catégorie Personnel
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="categorie_fr"
                            placeholder=""
                            required
                            onChange={onChange}
                            value={formData.categorie_fr}
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div
                          className="mb-3"
                          style={{
                            direction: "rtl",
                            textAlign: "right",
                          }}
                        >
                          <Form.Label htmlFor="categorie_ar">
                            صنف الإداري
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="categorie_ar"
                            placeholder=""
                            required
                            onChange={onChange}
                            value={formData.categorie_ar}
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

              {/*Edit categorie personn */}
              <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
              >
                <Modal.Header className="px-4 pt-4" closeButton>
                  <h5 className="modal-title" id="exampleModalLabel">
                    Modifier Catégorie Personnel
                  </h5>
                </Modal.Header>
                <Form
                  className="tablelist-form"
                  onSubmit={onSubmitEditCategoriePersonnel}
                >
                  <Modal.Body className="p-4">
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Form.Label htmlFor="categorie_fr">
                            Catégorie Personnel
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="categorie_fr"
                            placeholder=""
                            required
                            onChange={onChange}
                            value={formData.categorie_fr}
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div
                          className="mb-3"
                          style={{
                            direction: "rtl",
                            textAlign: "right",
                          }}
                        >
                          <Form.Label htmlFor="categorie_ar">
                            صنف الإداري
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="categorie_ar"
                            placeholder=""
                            required
                            onChange={onChange}
                            value={formData.categorie_ar}
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

              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={filteredCategoriePersonnels || []}
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListCategoriePersonnels;