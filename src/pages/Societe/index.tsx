import React, { useState } from "react";
import { Card, Col, Container, Offcanvas, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteSocieteMutation,
  useFetchAllSocietesQuery,
} from "features/societe/societeSlice";

const Societe = () => {
  document.title = "Partenaires | ENIGA";

  const navigate = useNavigate();

  function tog_AjouterPartenaire() {
    navigate("/gestion-des-stages/ajouter-partenaire");
  }

  const [showSociete, setShowSociete] = useState<boolean>(false);

  const location = useLocation();
  const societeDetails = location.state;

  const { data = [] } = useFetchAllSocietesQuery();

  const [deleteSociete] = useDeleteSocieteMutation();

  const [modal_UpdateVoieEnvoi, setmodal_UpdateVoieEnvoi] =
    useState<boolean>(false);
  function tog_UpdateVoieEnvoi() {
    setmodal_UpdateVoieEnvoi(!modal_UpdateVoieEnvoi);
  }

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
          deleteSociete(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Partenaire a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Partenaire est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row?.nom!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matricule</span>,
      selector: (row: any) => row?.matricule!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Responsable</span>,
      selector: (row: any) => row?.responsable!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">N° Tél</span>,
      selector: (row: any) => row?.phone!,
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
                className="badge badge-soft-info view-item-btn"
                state={row}
                onClick={() => setShowSociete(!showSociete)}
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
                to="/gestion-des-stages/modifier-partenaire"
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

  const getFilteredSocietes = () => {
    let filteredSocietes = [...data];

    if (searchTerm) {
      filteredSocietes = filteredSocietes.filter(
        (societe: any) =>
          societe?.nom!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          societe
            ?.matricule!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          societe
            ?.responsable!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          societe?.phone!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredSocietes.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Partenaires" pageTitle="Gestion des stages" />
          <Card>
            <Card.Header>
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
                    className="badge bg-secondary-subtle text-secondary view-item-btn fs-18 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterPartenaire()}
                  >
                    <i className="ph ph-plus"></i> Ajouter
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <DataTable
                    columns={columns}
                    data={getFilteredSocietes()}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Offcanvas
        show={showSociete}
        onHide={() => setShowSociete(!showSociete)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Détails du Partenaire</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-3">
            <h3>{societeDetails?.nom!}</h3>
          </div>
          <Row>
            <Col>
              <span className="text-muted">Matricule</span>
            </Col>
            <Col>
              <span className="fw-medium">{societeDetails?.matricule!}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <span className="text-muted">Responsable</span>
            </Col>
            <Col>
              <span className="fw-medium">{societeDetails?.responsable!}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <span className="text-muted">N° Tél</span>
            </Col>
            <Col>
              <span className="fw-medium">{societeDetails?.phone!}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <span className="text-muted">Adresse</span>
            </Col>
            <Col>
              <span className="fw-medium">{societeDetails?.adresse!}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <span className="text-muted">Siteweb</span>
            </Col>
            <Col>
              <span className="fw-medium">{societeDetails?.siteweb!}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <span className="text-muted">Encadrant(s)</span>
            </Col>
            <Col>
              {societeDetails?.encadrant?.map((enc: any) => (
                <div>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <span className="fw-medium">{enc}</span>
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

export default Societe;
