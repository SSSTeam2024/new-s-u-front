import React, { useState } from "react";
import { Card, Col, Container, Offcanvas, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteCommissionMutation,
  useFetchAllCommissionQuery,
} from "features/commission/commissionSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";

const AvisCommission = () => {
  document.title = "Liste Commissions | ENIGA";

  const navigate = useNavigate();

  const [showCommission, setShowCommission] = useState<boolean>(false);

  const location = useLocation();
  const commissionDetails = location.state;

  function tog_AjouterCommission() {
    navigate("/directeur-de-stage/ajouter-commission");
  }

  const { data = [] } = useFetchAllCommissionQuery();
  const [deleteCommission] = useDeleteCommissionMutation();

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
          deleteCommission(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Commission a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Commission est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Titre</span>,
      sortable: true,
      width: "340px",
      cell: (row: any) => {
        return (
          <div>
            <span>{row?.titre_fr!}</span>
            <span> ( {row?.titre_ar!} )</span>
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe(s)</span>,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled">
            {row.groupes.map((groupe: any) => (
              <li>{groupe.nom_classe_fr}</li>
            ))}
          </ul>
        );
      },
      sortable: true,
      width: "360px",
    },
    {
      name: <span className="font-weight-bold fs-13">Période</span>,
      cell: (row: any) => (
        <span>
          <strong>{row.date_creation}</strong> au{" "}
          <strong>{row.date_fin}</strong>
        </span>
      ),
      sortable: true,
      width: "260px",
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
                className="badge badge-soft-info view-item-btn"
                state={row}
                onClick={() => setShowCommission(!showCommission)}
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
            </li>
            <li>
              <Link
                to="#"
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredCourrierEntrants = () => {
    let filteredCourrierEntrants = [...data];

    if (searchTerm) {
      filteredCourrierEntrants = filteredCourrierEntrants.filter(
        (courrier: any) =>
          courrier
            ?.num_ordre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier
            ?.date_arrive!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier?.source
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier
            ?.date_livraison!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier?.destinataire
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredCourrierEntrants.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste Commissions"
            pageTitle="Directeur des stages"
          />
          <Card className="shadow p-4">
            <Card.Header className="border-bottom-dashed">
              <Row>
                <Col>
                  <label className="search-box">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Rechercher ..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </label>
                </Col>
                <Col className="d-flex justify-content-end">
                  <span
                    className="badge bg-secondary-subtle text-secondary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterCommission()}
                  >
                    <i className="ph ph-plus"></i> Ajouter
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={getFilteredCourrierEntrants()}
                pagination
                noDataComponent="Il n'y a aucun enregistrement à afficher"
              />
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Offcanvas
        show={showCommission}
        onHide={() => setShowCommission(!showCommission)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Détails du Commission</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row className="mb-3">
            <Col>
              <h3>{commissionDetails?.titre_fr!}</h3>
            </Col>
            <Col className="text-end">
              <h3>{commissionDetails?.titre_ar!}</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <span className="text-muted">Période</span>
            </Col>
            <Col>
              <div className="hstack gap-2">
                <span className="fw-medium">
                  {commissionDetails?.date_creation!}
                </span>
                <span>au</span>
                <span className="fw-medium">
                  {commissionDetails?.date_fin!}
                </span>
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={4}>
              <span className="text-muted">Membre(s)</span>
            </Col>
            <Col>
              {commissionDetails?.membres?.map((enseignant: any) => (
                <div>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <span className="fw-medium">
                              {enseignant.prenom_fr} {enseignant.nom_fr}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr style={{ color: "#000", height: "1px" }} />
                  </div>
                </div>
              ))}
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={4}>
              <span className="text-muted">Groupe(s)</span>
            </Col>
            <Col>
              {commissionDetails?.groupes?.map((classe: any) => (
                <div>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <span className="fw-medium">
                              {classe.nom_classe_fr}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr style={{ color: "#000", height: "1px" }} />
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default AvisCommission;
