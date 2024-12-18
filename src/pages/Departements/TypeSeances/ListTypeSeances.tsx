import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Form,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import {
  TypeSeance,
  useAddTypeSeanceMutation,
  useDeleteTypeSeanceMutation,
  useFetchTypeSeancesQuery,
  useUpdateTypeSeanceMutation,
} from "features/typeSeance/typeSeance";

const ListTypeSeances = () => {
  document.title = "Liste Types Séances | Smart University";

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const { data = [] } = useFetchTypeSeancesQuery();

  const { state: typeSeance } = useLocation();
  const [editTypeSeance] = useUpdateTypeSeanceMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (typeSeance && isEditModalOpen) {
      setFormData({
        _id: typeSeance._id,
        seance_ar: typeSeance.seance_ar,
        seance_fr: typeSeance.seance_fr,
        abreviation: typeSeance.abreviation,
        charge: typeSeance.charge,
      });
    }
  }, [typeSeance, isEditModalOpen]);

  const filteredTypesSeances = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((typeSeance) =>
        [
          typeSeance.abreviation,
          typeSeance.charge,
          typeSeance.seance_ar,
          typeSeance.seance_fr,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deleteTypeSeance] = useDeleteTypeSeanceMutation();

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
          deleteTypeSeance(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Type Séance a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Type Séance est en sécurité :)",
            "error"
          );
        }
      });
  };
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);

  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const [formData, setFormData] = useState({
    _id: "",
    seance_ar: "",
    seance_fr: "",
    abreviation: "",
    charge: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const [createTypeSeance] = useAddTypeSeanceMutation();
  const errorAlert = (message: string) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const handleAddClick = () => {
    setFormData({
      _id: "",
      seance_ar: "",
      seance_fr: "",
      abreviation: "",
      charge: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (typeSeance: any) => {
    setFormData({
      _id: typeSeance._id,
      seance_ar: typeSeance.seance_ar,
      seance_fr: typeSeance.seance_fr,
      abreviation: typeSeance.abreviation,
      charge: typeSeance.charge,
    });
    setShowEditModal(true);
  };
  const onSubmitTypeSeance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTypeSeance(formData).unwrap();
      setAddModalOpen(false);
      notify();
      // navigate("/departement/gestion-types-seances/liste-types-seances");
    } catch (error: any) {
      console.log(error);
    }
  };
  const onSubmitEditTypeSeance = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editTypeSeance(formData).unwrap();
      setShowEditModal(false);
      notify();
    } catch (error) {
      errorAlert("An error occurred while editing the type séance.");
    }
  };
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Type Séance a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const error = (error: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Creation type Séance échoué ${error}`,
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Type Séance (FR)",
        accessor: "seance_fr",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Type Séance (AR)",
        accessor: "seance_ar",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Abrération",
        accessor: "abreviation",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Charge Horaire",
        accessor: (row: any) => `${row.charge} Heures`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (typeSeance: TypeSeance) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to=""
                  state={typeSeance}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModal(typeSeance);
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
                    onClick={() => AlertDelete(typeSeance?._id!)}
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
            title="Paramètres des enseignants"
            pageTitle="Liste grades des enseignants"
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
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={handleAddClick}
                        >
                          Ajouter type Séance
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
                      data={filteredTypesSeances || []}
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

          <Modal
            show={isAddModalOpen}
            onHide={() => setAddModalOpen(false)}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title" id="exampleModalLabel">
                Ajouter type séance
              </h5>
            </Modal.Header>
            <Form className="tablelist-form" onSubmit={onSubmitTypeSeance}>
              <Modal.Body className="p-4">
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_fr">
                        Type Séance (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_fr}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_ar">
                        {" "}
                        Type Séance (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_ar}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="abreviation">Abréviation</Form.Label>
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
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="charge">Charge Horaire</Form.Label>
                      <Form.Control
                        type="number"
                        id="charge"
                        placeholder=""
                        onChange={onChange}
                        value={formData.charge}
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

          {/*Edit type seance */}
          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title" id="exampleModalLabel">
                Modifier type séance
              </h5>
            </Modal.Header>
            <Form className="tablelist-form" onSubmit={onSubmitEditTypeSeance}>
              <Modal.Body className="p-4">
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_fr">
                        Type Séance (FR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_fr"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_fr}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="seance_ar">
                        {" "}
                        Type Séance (AR)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="seance_ar"
                        placeholder=""
                        required
                        onChange={onChange}
                        value={formData.seance_ar}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="abreviation">Abréviation</Form.Label>
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
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="charge">Charge Horaire</Form.Label>
                      <Form.Control
                        type="number"
                        id="charge"
                        placeholder=""
                        onChange={onChange}
                        value={formData.charge}
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListTypeSeances;