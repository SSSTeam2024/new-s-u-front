import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAssignJuryMutation,
  useDeleteStagePfeMutation,
  useFetchAllStagePfeQuery,
} from "features/stagesPfe/stagesPfeSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import { formatDate } from "utils/formatDate";
import { useFetchAllTypeStageQuery } from "features/typeStage/typeStageSlice";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";

import withReactContent from "sweetalert2-react-content";
import DisponibiliteSoutenance from "./DisponibiliteSoutenance";
import DecisionSoutenance from "./DecisionSoutenance";

const StagesPfe = () => {
  document.title = "Liste Stages | ENIGA";

  const { data = [] } = useFetchAllStagePfeQuery();
  console.log("data", data)
  const { data: allTypesStage = [] } = useFetchAllTypeStageQuery();
  console.log("allTypesStage", allTypesStage)
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
  const [jury, setJury] = useState<boolean>(false);

  const handleChangeJury = () => {
    setJury(!jury);
  };

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
  const [showSoutenanceDateModal, setShowSoutenanceDateModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
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
      name: <span className="font-weight-bold fs-13">Membres Jury</span>,
      selector: (row: any) => <Link to="#" state={row} onClick={handleChangeJury}>{row.type_stage.soutenance?.length}</Link>,
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
              <span
                className="badge badge-soft-secondary edit-item-btn"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedStage(row);
                  setShowJuryModal(true);
                }}
              >
                <i
                  className="ph ph-users-three"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                ></i>
              </span>
            </li>
            <li>
              <Link to="#" className="badge badge-soft-warning remove-item-btn" onClick={() => {
                setSelectedStage(row);
                setShowSoutenanceDateModal(true);
              }}>
                <i
                  className="ph ph-exam"
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
              <Link to="#" className="badge badge-soft-info remove-item-btn" onClick={() => {
                setSelectedStage(row);
                setShowDecisionModal(true);
              }}>
                <i
                  className="ph ph-megaphone"
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


  const [showJuryModal, setShowJuryModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any>(null);


  const [assignJury] = useAssignJuryMutation();

  const [juryRoles, setJuryRoles] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (selectedStage) {
      const initialRoles: { [key: string]: string } = {};

      selectedStage?.type_stage?.soutenance?.forEach((role: string) => {
        switch (role) {
          case "Rapporteur 1":
            initialRoles[role] = typeof selectedStage.rapporteur1 === "object"
              ? selectedStage.rapporteur1?._id
              : selectedStage.rapporteur1 || "";
            break;
          case "Rapporteur 2":
            initialRoles[role] = typeof selectedStage.rapporteur2 === "object"
              ? selectedStage.rapporteur2?._id
              : selectedStage.rapporteur2 || "";
            break;
          case "Examinateur 1":
            initialRoles[role] = typeof selectedStage.examinateur1 === "object"
              ? selectedStage.examinateur1?._id
              : selectedStage.examinateur1 || "";
            break;
          case "Examinateur 2":
            initialRoles[role] = typeof selectedStage.examinateur2 === "object"
              ? selectedStage.examinateur2?._id
              : selectedStage.examinateur2 || "";
            break;
          case "Invité 1":
            initialRoles[role] = typeof selectedStage.invite1 === "object"
              ? selectedStage.invite1?._id
              : selectedStage.invite1 || "";
            break;
          case "Invité 2":
            initialRoles[role] = typeof selectedStage.invite2 === "object"
              ? selectedStage.invite2?._id
              : selectedStage.invite2 || "";
            break;
          case "Présentant de Jury":
            initialRoles[role] = typeof selectedStage.chef_jury === "object"
              ? selectedStage.chef_jury?._id
              : selectedStage.chef_jury || "";
            break;
          default:
            break;
        }
      });

      setJuryRoles(initialRoles);
    }
  }, [selectedStage]);


  const handleSelectChange = (role: string, value: string) => {
    setJuryRoles((prev) => ({
      ...prev,
      [role]: value,
    }));
  };
  const handleSaveJury = () => {
    const payload: any = {};

    Object.entries(juryRoles).forEach(([role, value]) => {
      switch (role) {
        case "Rapporteur 1":
          payload.rapporteur1 = value;
          break;
        case "Rapporteur 2":
          payload.rapporteur2 = value;
          break;
        case "Examinateur 1":
          payload.examinateur1 = value;
          break;
        case "Examinateur 2":
          payload.examinateur2 = value;
          break;
        case "Invité 1":
          payload.invite1 = value;
          break;
        case "Invité 2":
          payload.invite2 = value;
          break;
        case "Présentant de Jury":
          payload.chef_jury = value;
          break;
        default:
          break;
      }
    });
    console.log("payload", payload)
    assignJury({ id: selectedStage._id, data: payload })
      .unwrap()
      .then(() => {
        // ✅ Update stage locally
        setSelectedStage((prev: any) => ({
          ...prev,
          ...payload,
        }));

        // ✅ Show success toast
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Jury assigné avec succès",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // ✅ Close modal and reset roles
        setShowJuryModal(false);
        setJuryRoles({});
      })
      .catch((err) => {
        console.error("Erreur d’assignation :", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Erreur lors de l'affectation du jury",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  const location = useLocation();
  const stageDetails = location.state;

  console.log("stageDetails", stageDetails);
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
        <Modal show={showJuryModal} onHide={() => setShowJuryModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Assigner les membres du jury</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedStage?.type_stage?.avec_soutenance === "Oui" ? (
              <>
                {selectedStage.type_stage.soutenance?.map((role: string, index: number) => (
                  <div key={index} className="mb-3">
                    <label className="form-label">{role}</label>
                    <select
                      className="form-select"
                      value={juryRoles[role] || ""}
                      onChange={(e) => handleSelectChange(role, e.target.value)}
                    >
                      <option value="">-- Sélectionner un enseignant --</option>
                      {allEnseignants?.map((ens: any) => (
                        <option key={ens._id} value={ens._id}>
                          {ens?.prenom_fr} {ens?.nom_fr}
                        </option>
                      ))}
                    </select>

                  </div>
                ))}
              </>
            ) : (
              <p className="text-muted">Ce type de stage ne nécessite pas de soutenance.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowJuryModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSaveJury}>
              Enregistrer
            </Button>

          </Modal.Footer>
        </Modal>

        {/* <Modal show={jury} onHide={() => setJury(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Les membres du jury</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {stageDetails?.type_stage?.avec_soutenance === "Non" ? (
              <p className="text-muted text-center">Ce type de stage ne nécessite pas de jury.</p>)
              :
              stageDetails?.chef_jury! === null && stageDetails?.rapporteur1 === null && stageDetails?.rapporteur2 === null && stageDetails?.invite1 === null && stageDetails?.invite2 === null && stageDetails?.examinateur1 === null && stageDetails?.examinateur2 === null
                ?
                <p className="text-muted text-center">Aucun jury assigné pour ce stage.</p>
                :
                <>
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Présentant de Jury"
                  ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={5}>
                          <span className="fs-16 fw-medium">Présentant de Jury</span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails?.chef_jury?.prenom_fr!} {stageDetails?.chef_jury?.nom_fr!}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Rapporteur 1"
                  ) &&
                    stageDetails?.type_stage?.soutenance?.includes(
                      "Rapporteur 2"
                    ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Rapporteur 1
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.rapporteur1.prenom_fr} {stageDetails.rapporteur1.nom_fr}
                          </span>
                        </Col>
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Rapporteur 2
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.rapporteur2.prenom_fr} {stageDetails.rapporteur2.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Rapporteur 1"
                  ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">Rapporteur</span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.rapporteur1.prenom_fr} {stageDetails.rapporteur1.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Invité 1"
                  ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">Invité</span>
                        </Col>
                        <Col lg={3}>
                          <span
                          >
                            {stageDetails.invite1.prenom_fr} {stageDetails.invite1.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Invité 1"
                  ) &&
                    stageDetails?.type_stage?.soutenance?.includes(
                      "Invité 2"
                    ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Invité 1
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.invite1.prenom_fr} {stageDetails.invite1.nom_fr}
                          </span>
                        </Col>
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Invité 2
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.invite2.prenom_fr} {stageDetails.invite2.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Examinateur 1"
                  ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">Examinateur</span>
                        </Col>
                        <Col lg={3}>
                          <span
                          >
                            {stageDetails.examinateur1.prenom_fr} {stageDetails.examinateur1.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                  {stageDetails?.type_stage?.soutenance?.includes(
                    "Examinateur 1"
                  ) &&
                    stageDetails?.type_stage?.soutenance?.includes(
                      "Examinateur 2"
                    ) && (
                      <Row className="mb-2 d-flex align-items-center">
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Examinateur 1
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.examinateur1.prenom_fr} {stageDetails.examinateur1.nom_fr}
                          </span>
                        </Col>
                        <Col lg={3}>
                          <span className="fs-16 fw-medium">
                            Examinateur 2
                          </span>
                        </Col>
                        <Col>
                          <span
                          >
                            {stageDetails.examinateur2.prenom_fr} {stageDetails.examinateur2.nom_fr}
                          </span>
                        </Col>
                      </Row>
                    )}
                </>
            }

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowJuryModal(false)}>
              Annuler
            </Button>

          </Modal.Footer>
        </Modal> */}

        <Modal show={jury} onHide={() => setJury(false)} centered size="lg">
          <Modal.Header closeButton className="border-0 pb-1">
            <Modal.Title className="fs-4 fw-bold text-primary">
              Les membres du jury
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-light px-4 py-3 rounded">
            {stageDetails?.type_stage?.avec_soutenance === "Non" ? (
              <div className="text-muted text-center py-4">
                Ce type de stage ne nécessite pas de jury.
              </div>
            ) :
              stageDetails?.chef_jury! === null && stageDetails?.rapporteur1 === null && stageDetails?.rapporteur2 === null && stageDetails?.invite1 === null && stageDetails?.invite2 === null && stageDetails?.examinateur1 === null && stageDetails?.examinateur2 === null
                ?
                <div className="text-muted text-center py-4">
                  Aucun jury assigné pour ce stage.
                </div>
                :
                <div className="bg-white border rounded shadow-sm p-4">
                  {stageDetails?.type_stage?.soutenance?.includes("Présentant de Jury") && (
                    <Row className="align-items-center mb-3">
                      <Col lg={4} className="fw-semibold text-secondary">
                        Présentant de Jury
                      </Col>
                      <Col className="text-dark">
                        {stageDetails?.chef_jury?.prenom_fr!} {stageDetails?.chef_jury?.nom_fr!}
                      </Col>
                    </Row>
                  )}

                  {stageDetails?.type_stage?.soutenance?.includes("Rapporteur 1") &&
                    stageDetails?.type_stage?.soutenance?.includes("Rapporteur 2") && (
                      <Row className="align-items-center mb-3">
                        <Col lg={4} className="fw-semibold text-secondary">
                          Rapporteur 1
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.rapporteur1.prenom_fr} {stageDetails.rapporteur1.nom_fr}
                        </Col>
                        <Col lg={4} className="fw-semibold text-secondary">
                          Rapporteur 2
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.rapporteur2.prenom_fr} {stageDetails.rapporteur2.nom_fr}
                        </Col>
                      </Row>
                    )}

                  {stageDetails?.type_stage?.soutenance?.includes("Rapporteur 1") && (
                    <Row className="align-items-center mb-3">
                      <Col lg={4} className="fw-semibold text-secondary">
                        Rapporteur
                      </Col>
                      <Col className="text-dark">
                        {stageDetails.rapporteur1.prenom_fr} {stageDetails.rapporteur1.nom_fr}
                      </Col>
                    </Row>
                  )}

                  {stageDetails?.type_stage?.soutenance?.includes("Invité 1") && (
                    <Row className="align-items-center mb-3">
                      <Col lg={4} className="fw-semibold text-secondary">
                        Invité
                      </Col>
                      <Col className="text-dark">
                        {stageDetails.invite1.prenom_fr} {stageDetails.invite1.nom_fr}
                      </Col>
                    </Row>
                  )}

                  {stageDetails?.type_stage?.soutenance?.includes("Invité 1") &&
                    stageDetails?.type_stage?.soutenance?.includes("Invité 2") && (
                      <Row className="align-items-center mb-3">
                        <Col lg={4} className="fw-semibold text-secondary">
                          Invité 1
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.invite1.prenom_fr} {stageDetails.invite1.nom_fr}
                        </Col>
                        <Col lg={4} className="fw-semibold text-secondary">
                          Invité 2
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.invite2.prenom_fr} {stageDetails.invite2.nom_fr}
                        </Col>
                      </Row>
                    )}

                  {stageDetails?.type_stage?.soutenance?.includes("Examinateur 1") && (
                    <Row className="align-items-center mb-3">
                      <Col lg={4} className="fw-semibold text-secondary">
                        Examinateur
                      </Col>
                      <Col className="text-dark">
                        {stageDetails.examinateur1.prenom_fr} {stageDetails.examinateur1.nom_fr}
                      </Col>
                    </Row>
                  )}

                  {stageDetails?.type_stage?.soutenance?.includes("Examinateur 1") &&
                    stageDetails?.type_stage?.soutenance?.includes("Examinateur 2") && (
                      <Row className="align-items-center mb-3">
                        <Col lg={4} className="fw-semibold text-secondary">
                          Examinateur 1
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.examinateur1.prenom_fr} {stageDetails.examinateur1.nom_fr}
                        </Col>
                        <Col lg={4} className="fw-semibold text-secondary">
                          Examinateur 2
                        </Col>
                        <Col className="text-dark">
                          {stageDetails.examinateur2.prenom_fr} {stageDetails.examinateur2.nom_fr}
                        </Col>
                      </Row>
                    )}
                </div>
            }
          </Modal.Body>

          <Modal.Footer className="border-0 pt-1">
            <Button variant="outline-secondary" onClick={() => setShowJuryModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={showSoutenanceDateModal} onHide={() => setShowSoutenanceDateModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Soutenance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DisponibiliteSoutenance showSoutenanceDateModal={showSoutenanceDateModal} setShowSoutenanceDateModal={setShowSoutenanceDateModal} stage={selectedStage} />
          </Modal.Body>
        </Modal>

        <Modal show={showDecisionModal} onHide={() => setShowDecisionModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Décision</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DecisionSoutenance showDecisionModal={showDecisionModal} setShowDecisionModal={setShowDecisionModal} stage={selectedStage} />
          </Modal.Body>
        </Modal>

      </div>
    </React.Fragment>
  );
};

export default StagesPfe;
