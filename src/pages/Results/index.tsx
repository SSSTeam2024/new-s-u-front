import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Resultat,
  useDeleteResultatMutation,
  useFetchResultatsQuery,
} from "features/resultats/resultatsSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import { formatDate } from "utils/formatDate";
import AddResultat from "./AddResultat";
import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchNiveauxQuery } from "features/niveau/niveau";
import { useFetchSectionsQuery } from "features/section/section";

const Results = () => {
  document.title = "Resultat | ENIGA";

  const { data = [] } = useFetchResultatsQuery();
  const { data: allClasses = [] } = useFetchClassesQuery();
  const { data: allNiveaux = [] } = useFetchNiveauxQuery();
  const { data: allSpecialites = [] } = useFetchSectionsQuery();
  const etudiantsAdmis = data.reduce((acc: any[], resultat: Resultat) => {
    const admis = resultat.etudiants.filter((et) => et.avis === "Admis");
    return acc.concat(admis);
  }, []);

  const etudiantsRefuse = data.reduce((acc: any[], resultat: Resultat) => {
    const admis = resultat.etudiants.filter((et) => et.avis === "Refuse");
    return acc.concat(admis);
  }, []);

  const [deleteResultat] = useDeleteResultatMutation();

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
          deleteResultat(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Résultat a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Résultat est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Niveau</span>,
      selector: (row: any) => {
        const niveaux = row.etudiants.reduce((unique: string[], item: any) => {
          const niveau = item.etudiant.Niveau_Fr;
          if (niveau && !unique.includes(niveau)) {
            unique.push(niveau);
          }
          return unique;
        }, []);

        return niveaux.join(", ");
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Diplome</span>,
    //   selector: (row: any) => {
    //     const niveaux = row.etudiants.reduce((unique: string[], item: any) => {
    //       const niveau = item.etudiant.DIPLOME;
    //       if (niveau && !unique.includes(niveau)) {
    //         unique.push(niveau);
    //       }
    //       return unique;
    //     }, []);

    //     return niveaux.join(", ");
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Spécialité</span>,
      selector: (row: any) => {
        const specialites = row.etudiants.reduce(
          (unique: string[], item: any) => {
            const specialite = item.etudiant.Spécialité;
            if (specialite && !unique.includes(specialite)) {
              unique.push(specialite);
            }
            return unique;
          },
          []
        );

        return specialites.join(", ");
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => {
        const niveaux = row.etudiants.reduce((unique: string[], item: any) => {
          const niveau = item.etudiant.Groupe;
          if (niveau && !unique.includes(niveau)) {
            unique.push(niveau);
          }
          return unique;
        }, []);

        return niveaux.join(", ");
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Nombre Admis</span>,
      selector: (row: any) => (
        <span className="badge bg-success">{etudiantsAdmis.length}</span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Nombre Réfusé</span>,
      selector: (row: any) => (
        <span className="badge bg-danger">{etudiantsRefuse.length}</span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
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
                to="/gestion-des-resultats/details"
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
                to="/gestion-des-resultats/modifier"
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
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const handleSelectedSpecialite = (e: any) => {
    setSelectedSpecialite(e.target.value);
  };
  const handleSelectedNiveau = (e: any) => {
    setSelectedNiveau(e.target.value);
  };
  const handleSelectedClasse = (e: any) => {
    setSelectedClasse(e.target.value);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredResultat = () => {
    let filteredResultat = [...data];

    if (searchTerm) {
      filteredResultat = filteredResultat.reduce(
        (acc: any[], resultat: Resultat) => {
          const classe = resultat.etudiants.filter(
            (et: any) => et.etudiant.Spécialité === selectedSpecialite
          );
          return acc.concat(classe);
        },
        []
      );
    }

    if (selectedSpecialite && selectedSpecialite !== "Specilite") {
      filteredResultat = filteredResultat.reduce(
        (acc: any[], resultat: Resultat) => {
          const specialite = resultat.etudiants.filter(
            (et: any) => et.etudiant.Spécialité === selectedSpecialite
          );
          return acc.concat(specialite);
        },
        []
      );
    }

    if (selectedNiveau && selectedNiveau !== "Niveau") {
      filteredResultat = filteredResultat.reduce(
        (acc: any[], resultat: Resultat) => {
          const niveau = resultat.etudiants.filter(
            (et: any) => et.etudiant.Niveau_Fr === selectedNiveau
          );
          return acc.concat(niveau);
        },
        []
      );
    }

    if (selectedClasse && selectedClasse !== "Classe") {
      filteredResultat = filteredResultat.reduce(
        (acc: any[], resultat: Resultat) => {
          const classe = resultat.etudiants.filter(
            (et: any) => et.etudiant.Groupe === selectedClasse
          );
          return acc.concat(classe);
        },
        []
      );
    }

    return filteredResultat.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Résultats" pageTitle="Gestion des résultats" />
          <Card>
            <Card.Header>
              <Row>
                <Col>
                  <label className="search-box">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Chercher..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </label>
                </Col>
                <Col>
                  <select
                    className="form-select"
                    onChange={handleSelectedSpecialite}
                  >
                    <option value="Specilite">Spécialité</option>
                    {allSpecialites.map((specialite) => (
                      <option
                        value={specialite?.name_section_fr!}
                        key={specialite?._id!}
                      >
                        {specialite?.name_section_fr!}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col>
                  <select
                    className="form-select"
                    onChange={handleSelectedNiveau}
                  >
                    <option value="Niveau">Niveau</option>
                    {allNiveaux.map((niveau) => (
                      <option value={niveau.name_niveau_fr} key={niveau?._id!}>
                        {niveau.name_niveau_fr}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col>
                  <select
                    className="form-select"
                    onChange={handleSelectedClasse}
                  >
                    <option value="Classe">Classe</option>
                    {allClasses.map((classe) => (
                      <option value={classe.nom_classe_fr} key={classe?._id!}>
                        {classe?.nom_classe_fr!}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col className="text-end">
                  <AddResultat />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <DataTable
                    columns={columns}
                    data={getFilteredResultat()}
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

export default Results;
