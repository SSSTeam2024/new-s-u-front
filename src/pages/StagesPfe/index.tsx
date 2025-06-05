import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
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
import { useFetchAllTypeStageQuery } from "features/typeStage/typeStageSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";

const StagesPfe = () => {
  document.title = "Liste Stages | ENIGA";

  const { data = [] } = useFetchAllStagePfeQuery();
  const { data: allTypesStage = [] } = useFetchAllTypeStageQuery();
  const { data: allEnseignants = [] } = useFetchEnseignantsQuery();

  const [deleteStagePfe] = useDeleteStagePfeMutation();

  const navigate = useNavigate();

  function tog_AjouterStagePfe() {
    navigate("/gestion-des-stages/ajouter-stage");
  }

  const [etat, setEtat] = useState<string>("");
  const [avancement, setAvancement] = useState<string>("");
  const [binome, setBinome] = useState<string>("");
  const [localite, setLocalite] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [secondFilter, setSecondFilter] = useState<string>("");
  const [groupe, setGroupe] = useState<string>("");
  const [enseignant, setEnseignant] = useState<string>("");
  const [avancementPerType, setAvancementPerType] = useState<string>("");
  const [selectedType, setSelectedType] = useState("Tous");
  const [etatPerType, setEtatPerType] = useState<string>("");

  const handleChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const handleSelectedEtat = (e: any) => {
    setEtat(e.target.value);
  };

  const handleSelectedAvancement = (e: any) => {
    setAvancement(e.target.value);
  };

  const handleSelectedFilter = (e: any) => {
    setFilter(e.target.value);
  };

  const handleSelectedSecondFilter = (e: any) => {
    setSecondFilter(e.target.value);
  };

  const handleSelectedBinome = (e: any) => {
    setBinome(e.target.value);
  };

  const handleSelectedLocalite = (e: any) => {
    setLocalite(e.target.value);
  };

  const handleSelectedGroupe = (e: any) => {
    setGroupe(e.target.value);
  };

  const handleSelectedEnseignant = (e: any) => {
    setEnseignant(e.target.value);
  };

  const handleSelectedAvancementPerType = (e: any) => {
    setAvancementPerType(e.target.value);
  };

  const handleSelectedEtatPerType = (e: any) => {
    setEtatPerType(e.target.value);
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
            "Stage a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Stage est en sécurité :)",
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
      selector: (row: any) => row?.type_stage?.nom_fr!,
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
      name: <span className="font-weight-bold fs-13">Sociéte</span>,
      selector: (row: any) =>
        row.societe === null ? (
          <span className="text-muted">---</span>
        ) : (
          <span>{row?.societe?.nom!}</span>
        ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etat</span>,
      selector: (row: any) => {
        switch (row.status_stage) {
          case "En Cours":
            return (
              <span className="badge bg-success-subtle text-success">
                {row.status_stage}
              </span>
            );
          case "En Attente":
            return (
              <span className="badge bg-danger-subtle text-danger">
                {row.status_stage}
              </span>
            );
          default:
            return (
              <span className="badge bg-secondary-subtle text-secondary">
                {row.status_stage}
              </span>
            );
        }
      },
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
                to="/gestion-des-stages/modifier-stage"
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

  const filtredStageByTypeStage = data.filter(
    (stage: any) => stage.type_stage.nom_fr === selectedType
  );

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
          stage?.etudiant
            ?.Groupe!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (etat && etat !== "") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.status_stage === etat
      );
    }

    if (binome && binome !== "") {
      if (binome === "Oui") {
        filteredStagePfe = filteredStagePfe.filter(
          (stage: any) => stage?.binome !== null
        );
      }
      if (binome === "Non") {
        filteredStagePfe = filteredStagePfe.filter(
          (stage: any) => stage?.binome === null
        );
      }
    }

    if (localite && localite !== "") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.type_stage.localite === localite
      );
    }

    if (groupe && groupe !== "") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.etudiant.Groupe === groupe
      );
    }

    if (enseignant && enseignant !== "") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.encadrant_univ === enseignant
      );
    }
    if (selectedType && selectedType !== "Tous") {
      filteredStagePfe = filteredStagePfe.filter(
        (stage: any) => stage?.type_stage.nom_fr === selectedType
      );
    }

    return filteredStagePfe.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste Stages" pageTitle="Gestion des stages" />
          <Card>
            <Card.Header>
              <Row>
                <Col>
                  <div className="hstack gap-4">
                    <div className="form-check mb-2">
                      <Form.Check
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        value="Tous"
                        checked={selectedType === "Tous"}
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="flexRadioDefault1">
                        Tous les stages
                      </Form.Label>
                    </div>
                    {allTypesStage.map((type) => (
                      <div className="form-check" key={type?._id!}>
                        <Form.Check
                          type="radio"
                          name="flexRadioDefault"
                          id={`flexRadio-${type._id}`}
                          value={type.nom_fr}
                          checked={selectedType === type.nom_fr}
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor={`flexRadio-${type._id}`}>
                          {type.nom_fr}
                        </Form.Label>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col lg={1} className="d-flex justify-content-end">
                  <span
                    className="badge bg-info-subtle text-info add-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterStagePfe()}
                  >
                    <i className="ph ph-plus">Ajouter</i>
                  </span>
                </Col>
              </Row>
              {selectedType === "Tous" ? (
                <Row className="mt-2">
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
                      onChange={handleSelectedFilter}
                    >
                      <option value="">Filtrer ...</option>
                      <option value="Etat">Etat</option>
                      <option value="Avancement">Avancement</option>
                      <option value="Binome">Binome</option>
                      <option value="Localité">Localité</option>
                    </select>
                  </Col>
                  {filter && filter === "Etat" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedEtat}
                      >
                        <option value="">Choisir ...</option>
                        <option value="En Cours">En Cours</option>
                        <option value="Attente validation">
                          Attente validation
                        </option>
                        <option value="Refusé">Refusé</option>
                      </select>
                    </Col>
                  )}
                  {filter && filter === "Avancement" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedAvancement}
                      >
                        <option value="">Choisir ...</option>
                        <option value="<20%">{`< 20%`}</option>
                        <option value="<40%">{`< 40%`}</option>
                        <option value="<60%">{`< 60%`}</option>
                        <option value="<80%">{`< 80%`}</option>
                        <option value="100%">{`100%`}</option>
                      </select>
                    </Col>
                  )}
                  {filter && filter === "Binome" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedBinome}
                      >
                        <option value="">Choisir ...</option>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                      </select>
                    </Col>
                  )}
                  {filter && filter === "Localité" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedLocalite}
                      >
                        <option value="">Choisir ...</option>
                        <option value="Interne">Interne</option>
                        <option value="Externe">Externe</option>
                        <option value="Externe/Interne">Externe/Interne</option>
                      </select>
                    </Col>
                  )}
                </Row>
              ) : (
                <Row className="mt-2">
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
                      onChange={handleSelectedSecondFilter}
                    >
                      <option value="">Filtrer ...</option>
                      <option value="Groupes">Groupes</option>
                      <option value="Encadrement">Encadrement</option>
                      <option value="Avancement">Avancement</option>
                      <option value="Etat">Etat</option>
                      <option value="Documents">Documents</option>
                    </select>
                  </Col>
                  {secondFilter && secondFilter === "Groupes" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedGroupe}
                      >
                        <option value="">Choisir ...</option>
                        {filtredStageByTypeStage.map((stage: any) =>
                          stage.type_stage.classes.map((classe: any) => (
                            <option
                              key={classe?._id!}
                              value={classe?.nom_classe_fr!}
                            >
                              {classe.nom_classe_fr}
                            </option>
                          ))
                        )}
                      </select>
                    </Col>
                  )}
                  {secondFilter && secondFilter === "Encadrement" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedEnseignant}
                      >
                        <option value="">Choisir ...</option>
                        {allEnseignants.map((enseignant) => (
                          <option value={enseignant?._id!}>
                            {enseignant?.prenom_fr} {enseignant?.nom_fr!}
                          </option>
                        ))}
                      </select>
                    </Col>
                  )}
                  {secondFilter && secondFilter === "Avancement" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedAvancementPerType}
                      >
                        <option value="">Choisir ...</option>
                        <option value="<20%">{`< 20%`}</option>
                        <option value="<40%">{`< 40%`}</option>
                        <option value="<60%">{`< 60%`}</option>
                        <option value="<80%">{`< 80%`}</option>
                        <option value="100%">{`100%`}</option>
                      </select>
                    </Col>
                  )}
                  {secondFilter && secondFilter === "Etat" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedEtatPerType}
                      >
                        <option value="">Choisir ...</option>
                        <option value="En Cours">En Cours</option>
                        <option value="Validé">Validé</option>
                        <option value="Non Validé">Non Validé</option>
                        <option value="Refusé">Refusé</option>
                      </select>
                    </Col>
                  )}
                  {secondFilter && secondFilter === "Documents" && (
                    <Col lg={3}>
                      <select
                        className="form-select"
                        onChange={handleSelectedLocalite}
                      >
                        <option value="">Choisir ...</option>
                        {filtredStageByTypeStage.map((stage: any) =>
                          stage.type_stage.files.map(
                            (file: any, index: number) => (
                              <option key={index} value={file.nomFr}>
                                {file.nomFr}
                              </option>
                            )
                          )
                        )}
                      </select>
                    </Col>
                  )}
                </Row>
              )}
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
