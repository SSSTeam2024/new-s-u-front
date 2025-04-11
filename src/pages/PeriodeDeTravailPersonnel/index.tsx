import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeletePersonnelWorkingDayMutation,
  useFetchPersonnelWorkingDayQuery,
} from "features/personnelWorkingDay/personnelWorkingDaySlice";

const PeriodeDeTravailPersonnel = () => {
  document.title = "Périodes De Travail | ENIGA";

  const { data = [] } = useFetchPersonnelWorkingDayQuery();

  const [deletePersonnelWorkingDay] = useDeletePersonnelWorkingDayMutation();

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
          deletePersonnelWorkingDay(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Période de travail a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Période de travail est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Title</span>,
      selector: (row: any) => row?.name!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Début</span>,
      selector: (row: any) => row?.period_start!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Fin</span>,
      selector: (row: any) => row?.period_end!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Début Journé</span>,
      selector: (row: any) => row?.day_start_time!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fin Journé</span>,
      selector: (row: any) => row?.day_end_time!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Début Pause</span>,
      selector: (row: any) => row?.daily_pause_start!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fin Pause</span>,
      selector: (row: any) => row?.daily_pause_end!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/parametre-personnel/periode/modifier-periode-travail-personnel"
                className="badge badge-soft-success edit-item-btn"
                state={row}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>

            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const navigate = useNavigate();

  function tog_NewPeriodeTravail() {
    navigate("/parametre-personnel/periode/ajouter-periode-travail-personnel");
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Périodes De Travail"
            pageTitle="Paramètres des personnels"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <Col lg={12} className="d-flex justify-content-end">
                    <span
                      className="badge bg-info-subtle text-info view-item-btn fs-18"
                      style={{ cursor: "pointer" }}
                      onClick={() => tog_NewPeriodeTravail()}
                    >
                      <i className="ph ph-plus">Ajouter</i>
                    </span>
                  </Col>
                </Card.Header>
                <Card.Body>
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PeriodeDeTravailPersonnel;
