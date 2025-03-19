import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteAbsenceMutation,
  useFetchAbsencePersonnelsQuery,
} from "features/absencePersonnel/absencePersonnel";
import Swal from "sweetalert2";

const ListeAbsencePersonnel = () => {
  document.title = "Absence des Personnels | ENIGA";

  const { data = [] } = useFetchAbsencePersonnelsQuery();

  const [deleteAbsence] = useDeleteAbsenceMutation();

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
          deleteAbsence(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Absence Etudiant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Absence Etudiant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row?.jour!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Personnels Absents</span>,
      selector: (row: any) =>
        row.personnels.filter(
          (e: any) => e?.evening! === "Absent" && e?.morning! === "Absent"
        ).length,
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
                to="#"
                className="badge badge-soft-info edit-item-btn"
                //   onClick={() => setShowObservation(!showObservation)}
                // state={{ absenceDetails: row }}
              >
                <i
                  className="ri-eye-line"
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
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                // state={{ absenceDetails: row }}
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

  function tog_AllAbsences() {
    navigate("/absence-personnel/ajouter-absence-personnel");
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Absence des Personnels"
            pageTitle="Gestion des Personnels"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <Col lg={12} className="d-flex justify-content-end">
                    <span
                      className="badge bg-secondary-subtle text-secondary view-item-btn fs-18"
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className="ph ph-plus"
                        onClick={() => tog_AllAbsences()}
                      >
                        Ajouter Absence
                      </i>
                    </span>
                  </Col>
                </Card.Header>
                <Card.Body>
                  <DataTable columns={columns} data={data} pagination />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListeAbsencePersonnel;
