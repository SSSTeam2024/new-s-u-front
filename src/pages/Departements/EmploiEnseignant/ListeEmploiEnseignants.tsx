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
import Swal from "sweetalert2";
import TableContainer from "Common/TableContainer";
import {
  Classe,
  useDeleteClasseMutation,
  useFetchClassesQuery,
} from "features/classe/classe";
import {
  Enseignant,
  useFetchEnseignantsQuery,
  useFetchTeachersPeriodsQuery,
} from "features/enseignant/enseignantSlice";
import { actionAuthorization } from 'utils/pathVerification';
import { RootState } from 'app/store';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'features/account/authSlice';

const ListeEmploiEnseignants = () => {
  document.title = "Liste emplois des enseigants | Smart University";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();

  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }

  function tog_AddClasse() {
    navigate("/departement/gestion-classes/add-classe");
  }
  const { data: allClasses = [] } = useFetchClassesQuery();
  console.log("allClasses", allClasses);
  const { data: allTeachers = [] } = useFetchEnseignantsQuery();
  console.log("allTeachers", allTeachers);
  // console.log("classe data ", data)

  const { data: tachersPeriods = [] } = useFetchTeachersPeriodsQuery();
  console.log("tachersPeriods", tachersPeriods);
  const [deleteClasse] = useDeleteClasseMutation();
  //console.log(data)

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
          deleteClasse(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Classe a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Classe est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Enseignant",
        accessor: (row: any) => `${row?.prenom_fr!}    ${row?.nom_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Departement",
        accessor: (row: any) => row.departements?.name_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Grade",
        accessor: (row: any) => row.grade?.grade_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Spécialité",
        accessor: (row: any) => row.specilaite?.specialite_fr! || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Poste",
        accessor: (row: any) => row.poste?.poste_fr! || "",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Emploi",
        disableFilters: true,
        filterable: true,
        accessor:  (enseignant: Enseignant) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              {actionAuthorization("/gestion-emplois/emlpoi-enseignant/single-emplois", user?.permissions!) ? (
                <>
                  <li>
                    <Link
                      to="/gestion-emplois/emlpoi-enseignant/single-emplois"
                      className="badge bg-primary-subtle text-primary edit-item-btn"
                      state={{ enseignant, semestre: "1" }}
                    >
                      S1
                    </Link>
                  </li>
                  <span>|</span>
                  <li>
                    <Link
                      to="/gestion-emplois/emlpoi-enseignant/single-emplois"
                      className="badge bg-info-subtle text-info remove-item-btn"
                      state={{ enseignant, semestre: "1" }}
                    >
                      S2
                    </Link>
                  </li>
                </>
              ) : null}
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
            pageTitle="Liste emplois des enseignants"
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
                    {/* 
                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddClasse()}
                        >
                          Ajouter classe
                        </Button>
                      </div>
                    </Col> */}
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
                    <React.Fragment>
                      <TableContainer
                        columns={columns || []}
                        data={allTeachers || []}
                        // isGlobalFilter={false}
                        iscustomPageSize={false}
                        isBordered={false}
                        customPageSize={10}
                        className="custom-header-css table align-middle table-nowrap"
                        tableClass="table-centered align-middle table-nowrap mb-0"
                        theadClass="text-muted table-light"
                        SearchPlaceholder="Search Products..."
                      />
                    </React.Fragment>
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

export default ListeEmploiEnseignants;