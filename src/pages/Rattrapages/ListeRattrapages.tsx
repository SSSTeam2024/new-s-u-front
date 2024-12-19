import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import {
  GradeEnseignant,
  useDeleteGradeEnseignantMutation,
} from "features/gradeEnseignant/gradeEnseignant";
import {
  Rattrapage,
  useFetchRattrapagesQuery,
  useUpdateRattrapageEtatStatusMutation,
} from "features/rattrapage/rattrapage";
import { format } from "date-fns";
import "./style.css";

const ListeRattrapages = () => {
  document.title = "Liste des rattrapages | Smart University";

  const navigate = useNavigate();
  function tog_AddRattrapage() {
    navigate("/ajouter-rattrapage");
  }
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const { data = [] } = useFetchRattrapagesQuery();

  //console.log("rattrapage data", data);

  const filteredRattrapage = useMemo(() => {
    let result = data;
    if (searchQuery) {
      result = result.filter((rattrapage) =>
        [
          rattrapage.classe?.nom_classe_fr,
          rattrapage.enseignant?.prenom_fr,
          rattrapage.enseignant?.nom_fr,
          //   rattrapage.salle.salle,
          rattrapage.heure_fin,
          rattrapage.heure_debut,
          rattrapage.jour,
          rattrapage.semestre,
          //rattrapage.date
        ].some((value) => value && value.toLowerCase().includes(searchQuery))
      );
    }

    return result;
  }, [data, searchQuery]);
  const [deleteGradeEnseignant] = useDeleteGradeEnseignantMutation();

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
          deleteGradeEnseignant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Grade enseignant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Grade enseignant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const [selectedEtat, setSelectedEtat] = useState("");
  const [subEtat, setSubEtat] = useState("");
  const location = useLocation();
  const rattrapage = location.state;

  const rattrapageId = rattrapage?._id!;

  console.log(rattrapageId);
  const [updateRattrapageEtatStatus] = useUpdateRattrapageEtatStatusMutation();

  const handleEtatChange = (etat: any) => {
    setSelectedEtat(etat);
    setSubEtat("");
  };

  const handleSubEtatChange = (status: any) => {
    setSubEtat(status);
  };

  const handleSave = () => {
    if (selectedEtat === "Acceptée" && !subEtat) {
      Swal.fire({
        icon: "warning",
        title: "Statut requis",
        text: "Veuillez sélectionner un statut lorsque l'État est Acceptée !",
        confirmButtonText: "OK",
      });
      return;
    }
    const finalEtat = selectedEtat;
    updateRattrapageEtatStatus({
      _id: rattrapageId,
      etat: finalEtat,
      status: subEtat || "----",
    }).then(() => {
      tog_AddOrderModals();
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Classe",
        accessor: (row: any) => `${row?.classe?.nom_classe_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Enseignant",
        accessor: (row: any) =>
          `${row?.enseignant?.nom_fr!} ${row?.enseignant?.prenom_fr!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Matière",
        accessor: (row: any) => `${row?.matiere?.matiere!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Salle",
        accessor: (row: any) => `${row?.salle?.salle!}`,
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Heure Début",
        accessor: "heure_debut",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Heure Fin",
        accessor: "heure_fin",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Jour",
        accessor: "jour",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Date Rattrapage",
        accessor: "date",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestre",
        accessor: "semestre",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: { value: any }) => `S${value}`,
      },

      {
        Header: "Date Création",
        accessor: "createdAt",
        disableFilters: true,
        filterable: true,
        Cell: ({ value }: { value: string }) =>
          format(new Date(value), "dd-MM-yyyy HH:mm"),
      },
      {
        Header: "Etat",
        accessor: "etat",
        Cell: ({ value }: { value: any }) => {
          if (value === "Refusée") {
            return (
              <span className="badge rounded-pill bg-danger-subtle text-danger">
                Refusée
              </span>
            );
          } else if (value === "Acceptée") {
            return (
              <span className="badge rounded-pill bg-success-subtle text-success">
                Acceptée
              </span>
            );
          } else if (value === "En Cours") {
            return (
              <span className="badge rounded-pill bg-warning-subtle text-warning">
                En Cours
              </span>
            );
          }
          return null;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: { value: any }) => {
          if (value === "Faite") {
            return (
              <span className="badge rounded-pill bg-info-subtle text-info">
                Faite
              </span>
            );
          } else if (value === "Non Faite") {
            return (
              <span className="badge rounded-pill bg-danger-subtle text-danger">
                Non Faite
              </span>
            );
          }
          return value ? value : "----";
        },
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (rattrapage: Rattrapage) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  state={rattrapage}
                  className="badge bg-secondary-subtle text-secondary edit-item-btn"
                  onClick={tog_AddOrderModals}
                >
                  <i
                    className="ph ph-gear"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/parametre/edit-grade-enseignants"
                  state={rattrapage}
                  className="badge bg-primary-subtle text-primary edit-item-btn"
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
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
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => AlertDelete(rattrapage?._id!)}
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
  const [modal_AddOrderModals, setmodal_AddOrderModals] =
    useState<boolean>(false);
  function tog_AddOrderModals() {
    setmodal_AddOrderModals(!modal_AddOrderModals);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Paramètres des enseignants"
            pageTitle="Liste grades des enseignants"
          />

          <Row id="sellersList">
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-3">
                    <Col lg={3}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Chercher..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-2">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddRattrapage()}
                        >
                          Ajouter Rattrapage
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body className="p-0">
                  {/* <div className="table-responsive table-card mb-1"> */}
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={filteredRattrapage || []}
                      // isGlobalFilter={false}
                      iscustomPageSize={false}
                      isBordered={false}
                      customPageSize={10}
                      className="custom-header-css table align-middle table-nowrap"
                      tableClass="table-centered align-middle table-nowrap mb-0"
                      theadClass="text-muted table-light"
                      SearchPlaceholder="Search Products..."
                    />
                  </table>
                  <div className="noresult" style={{ display: "none" }}>
                    <div className="text-center py-4">
                      <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                          <i className="bi bi-search"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">Sorry! No Result Found</h5>
                      <p className="text-muted mb-0">
                        We've searched more than 150+ seller We did not find any
                        seller for you search.
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </Card.Body>
              </Card>
            </Col>

            <Modal show={modal_AddOrderModals} onHide={tog_AddOrderModals}>
              <Modal.Header closeButton>
                <Modal.Title>Modifier Rattrapage</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Primary Etat Selection */}
                <Form.Group>
                  <Form.Label>Etat</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedEtat}
                    onChange={(e) => handleEtatChange(e.target.value)}
                  >
                    <option value="">Selection Etat</option>
                    <option value="Refusée">Refusée</option>
                    <option value="Acceptée">Acceptée</option>
                  </Form.Control>
                </Form.Group>

                {/* Conditionally render subEtat selection based on selectedEtat */}
                {selectedEtat === "Acceptée" && (
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={subEtat}
                      onChange={(e) => handleSubEtatChange(e.target.value)}
                    >
                      <option value="">Selectionner Status</option>
                      <option value="Faite">Faite</option>
                      <option value="Non Faite">Non Faite</option>
                    </Form.Control>
                  </Form.Group>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={tog_AddOrderModals}>
                  Fermer
                </Button>
                <Button variant="success" onClick={handleSave}>
                  Enregistrer
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListeRattrapages;