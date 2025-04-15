import React, { useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import userImage from "../../assets/images/users/user-dummy-img.jpg";
import Breadcrumb from "Common/BreadCrumb";
import { useFetchDepartementsQuery } from "features/departement/departement";
import { useFetchNiveauxQuery } from "features/niveau/niveau";
import {
  useFetchClasseByIdQuery,
  useFetchClassesQuery,
} from "features/classe/classe";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useReactToPrint } from "react-to-print";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

const RepartitionGroupe = () => {
  document.title = "Répartition des Groupes | ENIGA";

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { data: AllDepartements = [] } = useFetchDepartementsQuery();

  const { data: AllNiveaux = [] } = useFetchNiveauxQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");

  const [selectedDepartement, setSelectedDepartement] = useState<string>("");

  const [selectedGroupe, setSelectedGroupe] = useState<string>("");

  const handleSelectedNiveau = (e: any) => {
    setSelectedNiveau(e.target.value);
    setSelectedDepartement("");
  };

  const handleSelectedDepartement = (e: any) => {
    setSelectedDepartement(e.target.value);
    setSelectedNiveau("");
  };

  const handleSelectedGroupe = (e: any) => {
    setSelectedGroupe(e.target.value);
  };

  const filtredClasseByDepartement = AllClasses.filter(
    (classe) => classe.departement._id === selectedDepartement
  );

  const filtredClasseByNiveau = AllClasses.filter(
    (classe) => classe.niveau_classe._id === selectedNiveau
  );

  const { data: EtudiantsByClasseID = [] } =
    useFetchEtudiantsByIdClasseQuery(selectedGroupe);

  const { data: classeDetails } = useFetchClasseByIdQuery(selectedGroupe);

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom Etudiant</span>,
      selector: (etudiants: any) => {
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="flex-shrink-0">
              <img
                src={`${process.env.REACT_APP_API_URL}/files/etudiantFiles/PhotoProfil/${etudiants.photo_profil}`}
                alt="etudiant-img"
                id="photo_profil"
                className="avatar-xs rounded-circle user-profile-img"
                onError={(e) => {
                  e.currentTarget.src = userImage;
                }}
              />
            </div>
            <div className="flex-grow-1 user_name">
              {etudiants?.nom_fr!} {etudiants?.prenom_fr!}
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">CIN</span>,
      selector: (row: any) => row?.num_CIN!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe Classe</span>,
      selector: (row: any) => row?.Groupe!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Genre</span>,
      selector: (row: any) => row?.sexe!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date d'inscription</span>,
      selector: (row: any) =>
        format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm"),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etat Compte</span>,
      selector: (row: any) => row?.etat_compte?.etat_fr,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type inscription</span>,
      selector: (row: any) => <span>{row?.type_inscription?.type_fr}</span>,
      sortable: true,
    },
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Répartition des Groupes"
            pageTitle="Gestion des Etudiants"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <Row className="g-3">
                    <Col>
                      <Row>
                        <Col className="col-lg-auto">
                          <select
                            className="form-select"
                            id="idDepartement"
                            name="departement-single-default"
                            onChange={handleSelectedDepartement}
                          >
                            <option defaultValue="">Départements</option>
                            {AllDepartements.map((departement) => (
                              <option
                                value={departement?._id!}
                                key={departement?._id!}
                              >
                                {departement.name_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                        {selectedDepartement !== "" && (
                          <Col className="col-lg-auto">
                            <select
                              className="form-select"
                              id="idClasse"
                              name="classes-single-default"
                              onChange={handleSelectedGroupe}
                            >
                              <option defaultValue="">Groupes</option>
                              {filtredClasseByDepartement.map((classe) => (
                                <option value={classe?._id!} key={classe?._id!}>
                                  {classe?.nom_classe_fr!}
                                </option>
                              ))}
                            </select>
                          </Col>
                        )}
                      </Row>
                      <Row className="mt-2">
                        <Col className="col-lg-auto">
                          <select
                            className="form-select"
                            id="idNiveau"
                            name="niveau-single-default"
                            onChange={handleSelectedNiveau}
                          >
                            <option defaultValue="">Niveaux</option>
                            {AllNiveaux.map((niveau) => (
                              <option value={niveau?._id!} key={niveau?._id!}>
                                {niveau.name_niveau_fr}
                              </option>
                            ))}
                          </select>
                        </Col>
                        {selectedNiveau !== "" && (
                          <Col className="col-lg-auto">
                            <select
                              className="form-select"
                              id="idGroupe"
                              name="groupes-single-default"
                              onChange={handleSelectedGroupe}
                            >
                              <option defaultValue="">Groupes</option>
                              {filtredClasseByNiveau.map((classe) => (
                                <option value={classe?._id!} key={classe?._id!}>
                                  {classe?.nom_classe_fr!}
                                </option>
                              ))}
                            </select>
                          </Col>
                        )}
                      </Row>
                    </Col>
                    <Col
                      lg={5}
                      className="d-flex justify-content-end align-items-center"
                    >
                      <Link
                        to="#"
                        className="badge bg-info-subtle text-info view-item-btn h-50"
                      >
                        <i
                          className="ph ph-printer"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "2.6em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.48)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          onClick={() => reactToPrintFn()}
                        ></i>
                      </Link>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <div>
                    <DataTable
                      columns={columns}
                      data={EtudiantsByClasseID}
                      pagination
                      noDataComponent="Il n'y a aucun enregistrement à afficher"
                    />
                  </div>
                  <Row
                    className="justify-content-center"
                    style={{ display: "none" }}
                  >
                    <Col xxl={9}>
                      <div ref={contentRef}>
                        <Card>
                          <Card.Header className="border-0">
                            <Row className="g-3">
                              <Col lg={4} className="text-center pt-2">
                                <h6>
                                  Ministère de l’Enseignement Supérieur et de la
                                  Recherche Scientifique
                                </h6>
                                <h6>{lastVariable?.universite_fr!}</h6>
                                <h6>{lastVariable?.etablissement_fr!}</h6>
                              </Col>
                              <Col lg={4} className="text-center">
                                <img
                                  className="w-25"
                                  src={`${
                                    process.env.REACT_APP_API_URL
                                  }/files/variableGlobaleFiles/logoRepubliqueFiles/${lastVariable?.logo_republique!}`}
                                  alt={lastVariable?.etablissement_fr!}
                                />
                              </Col>
                              <Col lg={4} className="text-center pt-2">
                                <h6>الجمهورية التونسية</h6>
                                <h6>وزارة التعليم العالي و البحث العلمي</h6>

                                <h6>{lastVariable?.universite_ar!}</h6>
                                <h6>{lastVariable?.etablissement_ar!}</h6>
                              </Col>
                            </Row>
                            <Row className="mt-3">
                              <Col lg={12} className="text-center">
                                <span>
                                  Liste des étudiants de :{" "}
                                  <strong>
                                    {classeDetails?.nom_classe_fr!}
                                  </strong>
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-1 mb-1">
                              <Col lg={12} className="text-center">
                                <h6>
                                  Année Universitaire {startYear} / {endYear}
                                </h6>
                              </Col>
                            </Row>
                          </Card.Header>
                          <Card.Body
                            style={{
                              paddingLeft: "30px",
                              paddingRight: "30px",
                            }}
                          >
                            <div>
                              <Row className="border border-3">
                                <Col lg={2} className="border-end border-3 p-1">
                                  <h6>Nom Etudiant</h6>
                                </Col>
                                <Col lg={2} className="border-end border-3 p-1">
                                  <h6>CIN</h6>
                                </Col>
                                <Col lg={2} className="border-end border-3 p-1">
                                  <h6>Groupe Classe</h6>
                                </Col>
                                <Col lg={2} className="border-end border-3 p-1">
                                  <h6>Genre</h6>
                                </Col>
                                <Col lg={2} className="border-end border-3 p-1">
                                  <h6>Date d'inscription</h6>
                                </Col>
                                <Col lg={1} className="border-end border-3 p-1">
                                  <h6>Etat Compte</h6>
                                </Col>
                                <Col lg={1} className="p-1">
                                  <h6>Type inscription</h6>
                                </Col>
                              </Row>
                              <Row className="border border-3">
                                {EtudiantsByClasseID.map((etudiant: any) => (
                                  <>
                                    <Col
                                      lg={2}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>
                                        {etudiant?.nom_fr!}{" "}
                                        {etudiant?.prenom_fr!}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>{etudiant?.num_CIN!}</span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>{etudiant?.Groupe!}</span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>{etudiant?.sexe!}</span>
                                    </Col>
                                    <Col
                                      lg={2}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>
                                        {format(
                                          new Date(etudiant.createdAt),
                                          "yyyy-MM-dd - HH:mm"
                                        )}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={1}
                                      className="border-end border-bottom border-3 p-1"
                                    >
                                      <span>
                                        {etudiant?.etat_compte?.etat_fr!}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={1}
                                      className="border-bottom border-3 p-1"
                                    >
                                      <span>
                                        {etudiant?.type_inscription?.type_fr!}
                                      </span>
                                    </Col>
                                  </>
                                ))}
                              </Row>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RepartitionGroupe;
