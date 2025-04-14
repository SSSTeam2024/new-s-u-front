import React, { useState } from "react";
import { Container, Row, Card, Col, Form, Offcanvas } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFetchDemandeTiragesQuery } from "features/demandeTirage/demandeTirageSlice";

const DemandesTirage = () => {
  document.title = "Service Tirage | ENIGA";

  const { data = [] } = useFetchDemandeTiragesQuery();
  const [showObservation, setShowObservation] = useState<boolean>(false);

  const navigate = useNavigate();

  function tog_AddAbsence() {
    navigate("/service-tirage/ajouter-tirage");
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
          console.log("Delete api");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Annulé", "", "error");
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Semestre</span>,
      selector: (row: any) => <span>{row.semestre!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe(s)</span>,
      selector: (row: any) => <span>{row?.classes.length}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => (
        <span>
          {row?.enseignant?.prenom_fr!} {row?.enseignant?.nom_fr!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure Limite</span>,
      selector: (row: any) => row?.heure_limite!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Limite</span>,
      selector: (row: any) => row?.date_limite!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.matiere!,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Etat</span>,
      selector: (row: any) => row?.etat!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ajouté par</span>,
      selector: (row: any) => {
        return row?.added_by !== null ? (
          row?.added_by?.enseignantId !== null ? (
            <div>
              {row?.added_by?.enseignantId?.prenom_fr}{" "}
              {row?.added_by?.enseignantId?.nom_fr}
            </div>
          ) : (
            <div>
              {row?.added_by?.personnelId?.prenom_fr}{" "}
              {row?.added_by?.enseignantId?.nom_fr}
            </div>
          )
        ) : (
          <div>
            {row?.enseignant?.prenom_fr} {row?.enseignant?.nom_fr}
          </div>
        );
      },
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
                to="/application-enseignant/visualiser-absence-etudiant"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowObservation(!showObservation)}
                state={{ absenceDetails: row }}
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
                to="/application-enseignant/modifier-absence-etudiant"
                className="badge badge-soft-success edit-item-btn"
                state={{ absenceDetails: row }}
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

  const observationLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredAbsences = () => {
    let filteredAbsences = data;

    if (searchTerm) {
      filteredAbsences = filteredAbsences.filter(
        (absence: any) =>
          absence?.matiere!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.heure!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.nom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.enseignant
            ?.prenom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absence?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredAbsences;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Liste Des Demandes Tirage"
            pageTitle="Service Tirage"
          />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
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
                  <Col lg={6}></Col>
                  <Col lg={3} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddAbsence()}
                      >
                        <i
                          className="ri-add-fill align-middle"
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
                        ></i>{" "}
                        <span>Ajouter Demande de Tirage</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredAbsences()}
                  pagination
                  noDataComponent="Il n'y a aucun enregistrement à afficher"
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Offcanvas
          show={showObservation}
          onHide={() => setShowObservation(!showObservation)}
          placement="end"
          style={{ width: "30%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Absence</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.classe?.nom_classe!} </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Heure</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.heure!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimèstre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Enseignant</span>
              </Col>
              <Col lg={9}>
                <i>
                  {observationLocation?.state?.enseignant?.nom_enseignant}{" "}
                  {observationLocation?.state?.enseignant?.prenom_enseignant}
                </i>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Row>
                  <Col lg={5}>
                    <Form.Label>Elève</Form.Label>
                  </Col>
                  <Col lg={3}>
                    <Form.Label>Type</Form.Label>
                  </Col>
                </Row>

                {observationLocation?.state?.eleves!.length > 0 ? (
                  observationLocation?.state?.eleves!.map((eleve: any) => (
                    <Row key={eleve.eleve._id}>
                      <Col lg={5} className="mb-1">
                        {eleve?.eleve?.prenom!} {eleve?.eleve?.nom!}
                      </Col>
                      <Col lg={3} className="mb-1">
                        {eleve.typeAbsent}
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Col>
                      <p>Aucun Absence pour le classe</p>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default DemandesTirage;
