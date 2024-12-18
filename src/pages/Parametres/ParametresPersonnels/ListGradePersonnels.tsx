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
import {
  GradePersonnel,
  useAddGradePersonnelMutation,
  useDeleteGradePersonnelMutation,
  useFetchGradesPersonnelQuery,
  useUpdateGradePersonnelMutation,
} from "features/gradePersonnel/gradePersonnel";

const ListGradePersonnels = () => {
  document.title = "Liste grades des personnels | Smart University";

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  function tog_AddCategoriePersonnel() {
    navigate("/parametre/add-grade-personnels");
  }
  const { data = [] } = useFetchGradesPersonnelQuery();
  const filteredGradePersonnels = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((gradePersonnel) =>
        [
          gradePersonnel.grade_fr,
          gradePersonnel.grade_ar,
          //gradePersonnel.value_grade_personnel,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);
  const [deleteGradePersonnel] = useDeleteGradePersonnelMutation();

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
          deleteGradePersonnel(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Grade personnel a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Grade personnel est en sécurité :)",
            "error"
          );
        }
      });
  };
  const [createGradePersonnel] = useAddGradePersonnelMutation();
  const { state: gradePersonnel } = useLocation();
  const [editGradePersonnel] = useUpdateGradePersonnelMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    //value_etat_enseignant: "",
    grade_fr: "",
    grade_ar: "",
  });
  const handleAddClick = () => {
    setFormData({
      _id: "",
      grade_fr: "",
      grade_ar: "",
    });
    setAddModalOpen(true);
  };
  const handleEditModal = (gradePersonnel: any) => {
    setFormData({
      _id: gradePersonnel._id,
      grade_fr: gradePersonnel.grade_fr,
      grade_ar: gradePersonnel.grade_ar,
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

  const onSubmitEtatPersonnel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createGradePersonnel(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parametre/grade-personnels");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditGradePersonnel = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editGradePersonnel(formData).unwrap();
      setShowEditModal(false);
      notify();
    } catch (error) {
      errorAlert("An error occurred while editing the grade Personnel.");
    }
  };

  useEffect(() => {
    if (gradePersonnel && isEditModalOpen) {
      setFormData({
        _id: gradePersonnel._id,
        grade_ar: gradePersonnel.grade_ar,
        grade_fr: gradePersonnel.grade_fr,
      });
    }
  }, [gradePersonnel, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Grade personnel a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  const columns = useMemo(
    () => [
      {
        Header: "Grade Personnel",
        accessor: "grade_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "رتبة الإداري",
        accessor: "grade_ar",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (gradePersonnel: GradePersonnel) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to=""
                  state={gradePersonnel}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModal(gradePersonnel);
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
                    onClick={() => AlertDelete(gradePersonnel?._id!)}
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
            pageTitle="Liste grades des personnels"
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
                          onClick={() => handleAddClick()}
                        >
                          Ajouter grade personnel
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
                      data={filteredGradePersonnels || []}
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

            {/* Add grade personnel */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Grade Pesonnel
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitEtatPersonnel}>
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="grade_fr">
                          Grade Personnel
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="grade_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.grade_fr}
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
                        <Form.Label htmlFor="grade_ar">رتبة الإداري</Form.Label>
                        <Form.Control
                          type="text"
                          id="grade_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.grade_ar}
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

            {/*Edit etat enseignant */}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Modifier Grade Personnel
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitEditGradePersonnel}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="grade_fr">
                          Grade Personnel
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="grade_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.grade_fr}
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
                        <Form.Label htmlFor="grade_ar">رتبة الإداري</Form.Label>
                        <Form.Control
                          type="text"
                          id="grade_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.grade_ar}
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

export default ListGradePersonnels;