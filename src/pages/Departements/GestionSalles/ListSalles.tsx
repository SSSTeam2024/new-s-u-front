import React, { useMemo, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { salles } from "../../../Common/data/salles";
import TableContainer from "Common/TableContainer";
import {
  Salle,
  useDeleteSalleMutation,
  useFetchSallesQuery,
} from "features/salles/salles";
import { useFetchAllSessionsByRoomIdMutation } from "features/seance/seance";

const ListSalles = () => {
  document.title = "Liste des salles | Smart University";

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salles");
    XLSX.writeFile(workbook, "Salles.xlsx");
  };

  function tog_AddSalle() {
    navigate("/departement/gestion-salles/add-salle");
  }
  const { data = [] } = useFetchSallesQuery();
  const [getSessionsByRoomId] = useFetchAllSessionsByRoomIdMutation();
  const [deleteSalle] = useDeleteSalleMutation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const checkRoomIsCleanAndDelete = async (_id: string) => {
    let res = await getSessionsByRoomId(_id).unwrap();
    console.log(res);
    if(res.length === 0) {
      await AlertDelete(_id);
    }else{
      let classNames = "";
      for(let session of res){
        classNames += "\n- " + session.classe.nom_classe_fr + " | Semestre " + session.semestre;
      }
      alert("Cette salle est présente dans les emplois de temps des classes suivantes: " + classNames);
    }
  }

  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSalle(_id);
          swalWithBootstrapButtons.fire(
            "Supprimée!",
            "Salle supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Salle est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
    
      {
        Header: "Salle",
        accessor: "salle",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Emplacement",
        accessor: "emplacement",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Type Salle",
        accessor: "type_salle",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Departement (FR)",
        accessor: (row: any) => row.departement?.name_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Departement (AR)",
        accessor: (row: any) => row.departement?.name_ar || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (salle: Salle) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/departement/gestion-salles/edit-salle"
                  state={salle}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
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
                  onClick={() => checkRoomIsCleanAndDelete(salle?._id!)}
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
            title="Gestion des départements"
            pageTitle="Liste des salles"
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
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <Col className="col-lg-auto">
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
                    </Col>
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-3">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddSalle()}
                        >
                          Ajouter salle
                        </Button>
                        <Button
                          variant="primary"
                          className="add-btn"
                          // onClick={() => tog_ImportModals()}
                          onClick={exportToExcel}
                        >
                          Importer
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Modal
                className="fade modal-fullscreen"
                show={modal_AddParametreModals}
                onHide={() => {
                  tog_AddParametreModals();
                }}
                centered
              >
                <Modal.Header className="px-4 pt-4" closeButton>
                  <h5 className="modal-title" id="exampleModalLabel">
                    Ajouter Une Salle
                  </h5>
                </Modal.Header>
                <Form className="tablelist-form">
                  <Modal.Body className="p-4">
                    <div
                      id="alert-error-msg"
                      className="d-none alert alert-danger py-2"
                    ></div>
                    <input type="hidden" id="id-field" />

                    <div className="mb-3">
                      <Form.Label htmlFor="item-stock-field">
                        Salle
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="item-stock-field"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="item-stock-field">
                        Emplacement
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="item-stock-field"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="civilStatus">Type Salle</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="civilStatus"
                        id="civilStatus"
                      >
                        <option value="">Salle Cours</option>
                        <option value="Married">Labo</option>
                        <option value="Divorced">Salle TD</option>
                        <option value="Widowed">Amphi</option>
                        <option value="Widowed">Atelier</option>
                      </select>
                    </div>
                  </Modal.Body>
                  <div className="modal-footer">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddParametreModals();
                        }}
                      >
                        Fermer
                      </Button>
                      <Button variant="success" id="add-btn">
                        Ajouter
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
                      data={data || []}
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

export default ListSalles;