import React, { useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TableContainer from "Common/TableContainer";

import {
  Seance,
  useDeleteSeanceMutation,
  useFetchAllSeancesByTimeTableIdQuery,
} from "features/seance/seance";

const GestionSeances = () => {
  document.title = "Liste emplois des classes | Smart University";

  const navigate = useNavigate();

  const location = useLocation();
  const params = location.state;
  console.log("params page seance", params);

  const { data = [] } = useFetchAllSeancesByTimeTableIdQuery(params?._id!);
  console.log(data);

  const [deleteSeance] = useDeleteSeanceMutation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const AlertDelete = async (seance: Seance) => {
    console.log("seance", seance);
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
      .then(async (result) => {
        if (result.isConfirmed) {
          await deleteSeance(seance);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Séance a été supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Annulé", "", "error");
        }
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Heure de début",
        accessor: (row: any) => row.heure_debut!,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Heure de fin",
        accessor: (row: any) => row.heure_fin!,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Jour",
        accessor: (row: any) => row.jour!,
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Matière",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) =>
          row.matiere?.matiere! + " " + row.matiere?.type!,
      },
      {
        Header: "Enseignant",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) =>
          row.enseignant?.nom_fr! + " " + row.enseignant?.prenom_fr!,
      },
      {
        Header: "Salle",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) => row.salle?.salle!,
      },
      {
        Header: "Type séance",
        disableFilters: true,
        filterable: true,
        accessor: (row: any) =>
          row.type_seance === "1" ? "Ordinaire" : "Par quanzaine",
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (seance: Seance) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Button
                  className="btn btn-danger btn-icon"
                  onClick={() => {
                    AlertDelete(seance);
                  }}
                >
                  <i className="ri-delete-bin-6-line align-bottom me-1"></i>{" "}
                </Button>
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
            title="Gestion des séances"
            pageTitle="Liste des séances"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <div className="text-center fw-bold titre-emploi">
                    <Form.Label htmlFor="semestre">
                      Liste des séances {params?.id_classe?.nom_classe_fr!} -
                      Semestre {params?.semestre!}
                    </Form.Label>
                  </div>
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

export default GestionSeances;