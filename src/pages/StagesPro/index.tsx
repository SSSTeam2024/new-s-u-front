import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import {
  useDeleteStageProMutation,
  useFetchAllStageProQuery,
} from "features/stagesPro/stagesProSlice";

const StagesPro = () => {
  document.title = "Liste Stages Professionnels | ENIGA";

  const { data = [] } = useFetchAllStageProQuery();
  const [deleteStagePfe] = useDeleteStageProMutation();

  const navigate = useNavigate();

  function tog_AjouterCourrierEntrant() {
    navigate("/gestion-des-stages/ajouter-stage-professionnel");
  }

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
          deleteStagePfe(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Stage Professionnel a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Stage Professionnel est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Etudiant</span>,
      selector: (row: any) => (
        <span>
          {row?.etudiant?.prenom_fr!}
          {row?.etudiant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe</span>,
      selector: (row: any) => <span>{row?.etudiant?.Groupe!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type Stage</span>,
      selector: (row: any) => row?.type_stage!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sociéte</span>,
      selector: (row: any) => <span>{row?.societe?.nom!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Période</span>,
      selector: (row: any) => (
        <span>
          {row?.date_debut} au {row?.date_fin}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            {/* <li>
              <Link
                to="/gestion-des-stages/visualiser-stage-pfe"
                className="badge badge-soft-info view-item-btn"
                state={row}
              >
                <i
                  className="ph ph-eye"
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
            </li> */}
            <li>
              <Link
                to="/gestion-des-stages/modifier-stage-professionnel"
                className="badge badge-soft-success edit-item-btn"
                state={row}
              >
                <i
                  className="ph ph-pencil-simple-line"
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
                  className="ph ph-trash"
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste Stages Professionnels"
            pageTitle="Gestion des stages"
          />
          <Card>
            {/* <Card.Header>
              <Row>
                <Col className="d-flex justify-content-end">
                  <span
                    className="badge bg-secondary-subtle text-secondary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterCourrierEntrant()}
                  >
                    <i className="ph ph-plus">Ajouter</i>
                  </span>
                </Col>
              </Row>
            </Card.Header> */}
            <Card.Body>
              <Row>
                <Col>
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StagesPro;
