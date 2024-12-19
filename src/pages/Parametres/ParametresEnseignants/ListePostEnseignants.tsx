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
  PosteEnseignant,
  useAddPosteEnseignantMutation,
  useDeletePosteEnseignantMutation,
  useFetchPostesEnseignantQuery,
  useUpdatePosteEnseignantMutation,
} from "features/posteEnseignant/posteEnseignant";
import { actionAuthorization } from 'utils/pathVerification';
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice';

const ListePostEnseignants = () => {
  document.title = "Liste postes des enseignants | Smart University";
  const user = useSelector((state: RootState) => selectCurrentUser(state));


  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const { data = [] } = useFetchPostesEnseignantQuery();
  const filteredPosteEnseignants = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((posteEnseignant) =>
        [
          posteEnseignant.poste_ar,
          posteEnseignant.poste_fr,
          //posteEnseignant.value_poste_enseignant,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);

  const [deletePosteEnseignant] = useDeletePosteEnseignantMutation();

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
          deletePosteEnseignant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Poste enseignant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Poste enseignant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Poste Enseignant",
        accessor: "poste_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "الخطة الوظيفية",
        accessor: "poste_ar",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (posteEnseignant: PosteEnseignant) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
               {actionAuthorization("/parametre-enseignant/poste/edit-poste-enseignant",user?.permissions!)? 
              <li>
                <Link
                  to=""
                  state={posteEnseignant}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModal(posteEnseignant);
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
              </li>  : <></> }
              {actionAuthorization("/parametre-enseignant/poste/supprimer-poste-enseignant",user?.permissions!)? 
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
                    onClick={() => AlertDelete(posteEnseignant?._id!)}
                  ></i>
                </Link>
              </li> : <></> }
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

  const [createPosteEnseignant] = useAddPosteEnseignantMutation();
  const { state: posteEnseignant } = useLocation();
  const [editPosteEnseignant] = useUpdatePosteEnseignantMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    // value_poste_enseignant: "",
    poste_ar: "",
    poste_fr: "",
  });

  const handleAddClick = () => {
    setFormData({
      _id: "",
      poste_ar: "",
      poste_fr: "",
    });
    setAddModalOpen(true);
  };

  const handleEditModal = (posteEnseignant: any) => {
    setFormData({
      _id: posteEnseignant._id,
      poste_ar: posteEnseignant.poste_ar,
      poste_fr: posteEnseignant.poste_fr,
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

  const onSubmitPosteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createPosteEnseignant(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parametre-enseignant/poste/liste-poste-enseignant");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onSubmitEditPosteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editPosteEnseignant(formData).unwrap();
      setShowEditModal(false);
      notify();
    } catch (error) {
      errorAlert("An error occurred while editing the poste enseignant.");
    }
  };

  useEffect(() => {
    if (posteEnseignant && isEditModalOpen) {
      setFormData({
        _id: posteEnseignant._id,
        poste_ar: posteEnseignant.poste_ar,
        poste_fr: posteEnseignant.poste_fr,
      });
    }
  }, [posteEnseignant, isEditModalOpen]);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Poste enseignant a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Paramètres des enseignants"
            pageTitle="Liste postes des enseignants"
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
                      {actionAuthorization("/parametre-enseignant/poste/ajouter-poste-enseignant",user?.permissions!)? 
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => handleAddClick()}
                        >
                          Ajouter poste enseignant
                        </Button> : <></> }
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
                      data={filteredPosteEnseignants || []}
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
            {/* Add poste enseignant */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Poste Enseignant
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitPosteEnseignant}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="poste_fr">
                          Poste Enseignant
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="poste_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.poste_fr}
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
                        <Form.Label htmlFor="poste_ar">
                          الخطة الوظيفية
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="poste_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.poste_ar}
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

            {/*Edit poste enseignant */}
            <Modal
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Modifier Poste Enseignant
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitEditPosteEnseignant}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="poste_fr">
                          Poste Enseignant
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="poste_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.poste_fr}
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
                        <Form.Label htmlFor="poste_ar">
                          الخطة الوظيفية
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="poste_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.poste_ar}
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

export default ListePostEnseignants;