import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteStagePfeMutation,
  useFetchAllStagePfeQuery,
} from "features/stagesPfe/stagesPfeSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import { formatDate } from "utils/formatDate";

const StagesPfe = () => {
  document.title = "Liste Stages PFE | ENIGA";

  const { data = [] } = useFetchAllStagePfeQuery();
  const [deleteStagePfe] = useDeleteStagePfeMutation();

  const navigate = useNavigate();

  function tog_AjouterStagePfe() {
    navigate("/gestion-des-stages/ajouter-stage-pfe");
  }

  const [typeStage, setTypeStage] = useState<string>("");

  const handleSelectedTypeStage = (e: any) => {
    setTypeStage(e.target.value);
  };
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
            "Stage Pfe a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Stage Pfe est en sécurité :)",
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
          {row?.etudiant?.prenom_fr!} {row?.etudiant?.nom_fr!}
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
      name: <span className="font-weight-bold fs-13">Binôme</span>,
      selector: (row: any) =>
        row.binome !== null ? (
          <span>
            {row?.binome?.prenom_fr!} {row?.binome?.nom_fr!}
          </span>
        ) : (
          <span className="text-muted"> --- </span>
        ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Encadrant</span>,
      selector: (row: any) => (
        <span>
          {row?.encadrant_univ?.prenom_fr!} {row?.encadrant_univ?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sociéte</span>,
      selector: (row: any) => <span>{row?.societe?.nom!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Demande</span>,
      selector: (row: any) => formatDate(row?.createdAt!),
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
                to="/gestion-des-stages/modifier-stage-pfe"
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

  const getFilteredStagePfe = () => {
    let filteredStagePfe = [...data];

    if (searchTerm) {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) =>
          stage?.etudiant
            ?.prenom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          stage?.etudiant
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          stage?.encadrant_univ
            ?.prenom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          stage?.encadrant_univ
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          stage?.etudiant
            ?.Groupe!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (typeStage && typeStage !== "") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.type_stage! === typeStage
      );
    }

    return filteredStagePfe.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="PFE et Mémoire" pageTitle="Gestion des stages" />
          <Card>
            <Card.Header>
              <Row>
                <Col lg={2}>
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
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleSelectedTypeStage}
                  >
                    <option value="">Type Stage</option>
                    <option value="Industriel">Industriel</option>
                    <option value="Académique">Académique</option>
                  </select>
                </Col>
                <Col className="d-flex justify-content-end">
                  <span
                    className="badge bg-info-subtle text-info add-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterStagePfe()}
                  >
                    <i className="ph ph-plus">Ajouter</i>
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <DataTable
                    columns={columns}
                    data={getFilteredStagePfe()}
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

export default StagesPfe;
