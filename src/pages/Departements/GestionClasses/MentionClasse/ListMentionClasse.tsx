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
  MentionsClasse,
  useAddMentionsClasseMutation,
  useDeleteMentionsClasseMutation,
  useFetchMentionsClasseQuery,
  useUpdateMentionsClasseMutation,
} from "features/mentionClasse/mentionClasse";
import { useFetchDomainesClasseQuery } from "features/domaineClasse/domaineClasse";

const ListMentionClasse = () => {
  document.title = "Liste mentions des classes | ENIGA";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchMentionsClasseQuery();
  const filteredMentionsClasses = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((mentionClasse) =>
        [
          mentionClasse.name_mention_ar,
          mentionClasse.name_mention_fr,
          mentionClasse.abreviation,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deleteMentionClasse] = useDeleteMentionsClasseMutation();

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
          deleteMentionClasse(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Mention classe a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Mention classe est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Mention Classe (FR)",
        accessor: "name_mention_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Mention Classe (AR)",
        accessor: "name_mention_ar",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Domaine",
        accessor: (row: any) => row?.domaine?.name_domaine_fr! || "",
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
        accessor: (mentionClasse: MentionsClasse) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization(
                "/departement/gestion-classes/edit-mention-classe",
                user?.permissions!
              ) ? (
                <li>
                  <Link
                    to="/departement/gestion-classes/edit-mention-classe"
                    state={mentionClasse}
                    className="badge bg-primary-subtle text-primary edit-item-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditModal(mentionClasse);
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
                "/departement/gestion-classes/delete-mention-classe",
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
                      onClick={() => AlertDelete(mentionClasse?._id!)}
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

  const [createMentionClasse] = useAddMentionsClasseMutation();
  const { state: mentionClasse } = useLocation();
  const [editMentionClasse] = useUpdateMentionsClasseMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name_mention_ar: "",
    name_mention_fr: "",
    abreviation: "",
    domaine: "",
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      name_mention_ar: "",
      name_mention_fr: "",
      abreviation: "",
      domaine: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (mentionClasse: any) => {
    setFormData({
      _id: mentionClasse._id,
      name_mention_ar: mentionClasse.name_mention_ar,
      name_mention_fr: mentionClasse.name_mention_fr,
      abreviation: mentionClasse.abreviation,
      domaine: mentionClasse.domaine,
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

  const onSubmitMentionClasse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createMentionClasse(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/departement/gestion-classes/liste-mentions");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditMentionClasse = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editMentionClasse(formData).unwrap();
      setShowEditModal(false);
      notifyEdit();
    } catch (error) {
      errorAlert("An error occurred while editing the mention classe .");
    }
  };

  useEffect(() => {
    if (mentionClasse && isEditModalOpen) {
      setFormData({
        _id: mentionClasse._id,
        name_mention_ar: mentionClasse.name_mention_ar,
        name_mention_fr: mentionClasse.name_mention_fr,
        abreviation: mentionClasse.abreviation,
        domaine: mentionClasse.domaine,
      });
    }
  }, [mentionClasse, isEditModalOpen]);

  const { data: domaines = [] } = useFetchDomainesClasseQuery();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const notifyEdit = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Mention Classe a été modifié avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Mention Classe a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste des mentions"
            pageTitle="Liste des mentions"
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
                          "/departement/gestion-classes/add-mention-classe",
                          user?.permissions!
                        ) ? (
                          <Button
                            variant="primary"
                            className="add-btn"
                            onClick={() => handleAddClick()}
                          >
                            Ajouter mention classe
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
                      data={filteredMentionsClasses || []}
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
            {/* Add mention classe */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Mention Classe
                </h5>
              </Modal.Header>
              <Form className="tablelist-form" onSubmit={onSubmitMentionClasse}>
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_mention_fr">
                          Mention Classe(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_mention_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_mention_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_mention_ar">
                          Mention Classe(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_mention_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_mention_ar}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
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
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="domaine">
                          Domaine Classe
                        </Form.Label>
                        <select
                          className="form-select text-muted"
                          name="domaine"
                          id="domaine"
                          value={formData.domaine}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionner Domaine Classe</option>
                          {domaines.map((domaine) => (
                            <option key={domaine._id} value={domaine._id}>
                              {domaine.name_domaine_fr}
                            </option>
                          ))}
                        </select>
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
                  Modifier Mention Classe
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitEditMentionClasse}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_mention_fr">
                          Mention Classe(FR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_mention_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_mention_fr}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="name_mention_ar">
                          Mention Classe(AR)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name_mention_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.name_mention_ar}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
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
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="domaine">
                          Domaine Classe
                        </Form.Label>
                        <select
                          className="form-select text-muted"
                          name="domaine"
                          id="domaine"
                          value={formData.domaine}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionner Domaine Classe</option>
                          {domaines.map((domaine) => (
                            <option key={domaine._id} value={domaine._id}>
                              {domaine.name_domaine_fr}
                            </option>
                          ))}
                        </select>
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

export default ListMentionClasse;
