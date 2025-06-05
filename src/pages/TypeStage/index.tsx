import React, { useState } from "react";
import { Card, Col, Container, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteTypeStageMutation,
  useFetchAllTypeStageQuery,
} from "features/typeStage/typeStageSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";

const TypeStage = () => {
  document.title = "Type Stage | ENIGA";

  const { data = [] } = useFetchAllTypeStageQuery();

  const navigate = useNavigate();
  const [deleteTypeStage] = useDeleteTypeStageMutation();

  const [typeStage, setTypeStage] = useState<string>("");

  const handleSelectedTypeStage = (e: any) => {
    setTypeStage(e.target.value);
  };

  function tog_AjouterTypeStage() {
    navigate("/gestion-des-stages/ajouter-type-stage");
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
          deleteTypeStage(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Type Stage a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Type Stage est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row?.nom_fr!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row?.choix!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Niveau</span>,
      selector: (row: any) => row?.niveau?.name_niveau_fr!,
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Durée</span>,
    //   selector: (row: any) => row?.duree_min!,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Période</span>,
      selector: (row: any) => (
        <span>
          du <strong>{row.date_debut}</strong> au{" "}
          <strong>{row.date_fin}</strong>
        </span>
      ),
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Encadrement</span>,
    //   selector: (row: any) => row?.avec_encadrement!,
    //   sortable: true,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Soutenance</span>,
    //   selector: (row: any) => row?.avec_soutenance!,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Localité</span>,
      selector: (row: any) => row?.localite!,
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
                to="/gestion-des-stages/details-type-stage"
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
            </li>
            <li>
              <Link
                to="/gestion-des-stages/modifier-type-stage"
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

  const getFilteredTypeStage = () => {
    let filteredTypeStage = [...data];

    if (searchTerm) {
      filteredTypeStage = filteredTypeStage.filter(
        (stage: any) =>
          stage?.choix!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stage?.nom_fr!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stage?.niveau
            ?.name_niveau_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          stage?.localite!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeStage && typeStage !== "") {
      filteredTypeStage = filteredTypeStage.filter(
        (type: any) => type?.choix! === typeStage
      );
    }

    return filteredTypeStage.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Types Stage" pageTitle="Gestion des stages" />

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
                    <option value="Obligatoire">Obligatoire</option>
                    <option value="Optionnel">Optionnel</option>
                  </select>
                </Col>
                <Col className="d-flex justify-content-end">
                  <span
                    className="badge bg-info-subtle text-info add-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterTypeStage()}
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
                    data={getFilteredTypeStage()}
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

export default TypeStage;
