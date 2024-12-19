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
import { sellerList } from "Common/data";
import Swal from "sweetalert2";
import {
  SpecialiteEnseignant,
  useAddSpecialiteEnseignantMutation,
  useDeleteSpecialiteEnseignantMutation,
  useFetchSpecialitesEnseignantQuery,
  useUpdateSpecialiteEnseignantMutation,
} from "features/specialiteEnseignant/specialiteEnseignant";
import { actionAuthorization } from 'utils/pathVerification';
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice';

const ListSpecialiteEnseignants = () => {
  document.title = "Liste spécialités des enseignants | Smart University";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };


  const { data = [] } = useFetchSpecialitesEnseignantQuery();
  const filteredSpecialiteEnseignants = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((specialiteEnseignant) =>
        [
          specialiteEnseignant.specialite_fr,
          specialiteEnseignant.specialite_ar,
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);
  const [deleteSpecialiteEnseignant] = useDeleteSpecialiteEnseignantMutation();

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
          deleteSpecialiteEnseignant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Spécialité enseignant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Spécialité enseignant est en sécurité :)",
            "error"
          );
        }
      });
  };
  const [createSpecialiteEnseignant] = useAddSpecialiteEnseignantMutation();
  const { state: specialiteEnseignant } = useLocation();
  const [editSpecialiteEnseignant] = useUpdateSpecialiteEnseignantMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddClick = () => {
    setFormData({
      _id: "",
      specialite_ar: "",
      specialite_fr: "",
    });
    setAddModalOpen(true);
  };
  const handleEditModal = (specialiteEnseignant: any) => {
    setFormData({
      _id: specialiteEnseignant._id,
      specialite_ar: specialiteEnseignant.specialite_ar,
      specialite_fr: specialiteEnseignant.specialite_fr,
    });
    setShowEditModal(true);
  };
  const [formData, setFormData] = useState({
    _id: "",
    specialite_ar: "",
    specialite_fr: "",
  });
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

  const onSubmitSpecialiteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await createSpecialiteEnseignant(formData).unwrap();
      notify();
      setAddModalOpen(false);
      navigate("/parametre-enseignant/specialite/liste-specialite-enseignant");
    } catch (error: any) {
      console.log(error);
    }
  };
  const onSubmitEditSpecialiteEnseignant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      await editSpecialiteEnseignant(formData).unwrap();
      setShowEditModal(false);
      notify();
    } catch (error) {
      errorAlert("An error occurred while editing the poste enseignant.");
    }
  };
  useEffect(() => {
    if (specialiteEnseignant && isEditModalOpen) {
      setFormData({
        _id: specialiteEnseignant._id,
        specialite_ar: specialiteEnseignant.specialite_ar,
        specialite_fr: specialiteEnseignant.specialite_fr,
      });
    }
  }, [specialiteEnseignant, isEditModalOpen]);
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Spécialité enseignant a été crée avec succés",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Spécialité Enseignant",
        accessor: "specialite_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "الإختصاص",
        accessor: "specialite_ar",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (specialiteEnseignant: SpecialiteEnseignant) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
            {actionAuthorization("/parametre-enseignant/specialite/edit-specialite-enseignant",user?.permissions!)? 

              <li>
                <Link
                  to=""
                  state={specialiteEnseignant}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModal(specialiteEnseignant);
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
              {actionAuthorization("/parametre-enseignant/specialite/supprimer-specialite-enseignant",user?.permissions!)? 
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
                    onClick={() => AlertDelete(specialiteEnseignant?._id!)}
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
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Paramètres des enseignants"
            pageTitle="Liste spécialités des enseignants"
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
                      {actionAuthorization("/parametre-enseignant/specialite/ajouter-specialite-enseignant",user?.permissions!)? 
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={handleAddClick}
                        >
                          Ajouter spécialité enseignant
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
                      data={filteredSpecialiteEnseignants || []}
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

            {/* Add specialite enseignant */}
            <Modal
              show={isAddModalOpen}
              onHide={() => setAddModalOpen(false)}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter Etat Compte Enseignant
                </h5>
              </Modal.Header>
              <Form
                className="tablelist-form"
                onSubmit={onSubmitSpecialiteEnseignant}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="specialite_fr">
                          Spécialité Enseignant
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="specialite_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.specialite_fr}
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
                        <Form.Label htmlFor="specialite_ar">
                          الإختصاص
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="specialite_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.specialite_ar}
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

            {/*Edit specialite enseignant */}
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
                onSubmit={onSubmitEditSpecialiteEnseignant}
              >
                <Modal.Body className="p-4">
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Label htmlFor="specialite_fr">
                          Spécialité Enseignant
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="specialite_fr"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.specialite_fr}
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
                        <Form.Label htmlFor="specialite_ar">
                          الإختصاص
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="specialite_ar"
                          placeholder=""
                          required
                          onChange={onChange}
                          value={formData.specialite_ar}
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

export default ListSpecialiteEnseignants;