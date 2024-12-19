import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import TableContainer from "Common/TableContainer";
import Swal from "sweetalert2";
import {
  FicheVoeux,
  useDeleteFicheVoeuxMutation,
  useFetchFicheVoeuxsQuery,
} from "features/ficheVoeux/ficheVoeux";
import { Enseignant } from "features/enseignant/enseignantSlice";

interface Voeux {
  enseignant: Enseignant;
  voeux_s1: any;
  voeux_s2: any;
}

const ListFicheVoeux = () => {
  document.title = "Liste fiches des voeux enseignants | Smart University";

  const navigate = useNavigate();
  const [filePath, setFilePath] = useState<string | null>(null);
  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  const [modal_ImportModals, setmodal_ImportModals] = useState<boolean>(false);
  function tog_AddParametreModals() {
    setmodal_AddParametreModals(!modal_AddParametreModals);
  }
  function tog_ImportModals() {
    setmodal_ImportModals(!modal_ImportModals);
  }

  function tog_AddMatiere() {
    navigate("/gestion-fiche-voeux/add-fiche-voeux");
  }
  const { data = [], isSuccess } = useFetchFicheVoeuxsQuery();

  console.log(data);

  const [deleteFicheVoeux] = useDeleteFicheVoeuxMutation();

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
          deleteFicheVoeux(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Fiche Voeux a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Fiche Voeux est en sécurité :)",
            "error"
          );
        }
      });
  };

  const [showFicheClasse, setShowFicheClasse] = useState<boolean>(false);
  const [showFicheClasseDetails, setShowFicheClasseDetails] = useState<any>({});

  const [listeVoeux, setListeVoeux] = useState<Voeux[]>([]);

  useEffect(() => {
    if (isSuccess) {
      let voeux: Voeux[] = [];
      for (const element of data) {
        let teacher: any = voeux.filter(
          (v) => v.enseignant._id === element.enseignant._id
        );

        if (element.semestre === "S1") {
          if (teacher.length > 0) {
            let index = voeux.findIndex(
              (v) => v.enseignant._id === teacher[0].enseignant._id
            );
            voeux[index].voeux_s1 = element;
          } else {
            voeux.push({
              enseignant: element.enseignant,
              voeux_s1: element,
              voeux_s2: "",
            });
          }
        } else {
          if (teacher.length > 0) {
            let index = voeux.findIndex(
              (v) => v.enseignant._id === teacher[0].enseignant._id
            );
            voeux[index].voeux_s2 = element;
          } else {
            voeux.push({
              enseignant: element.enseignant,
              voeux_s1: "",
              voeux_s2: element,
            });
          }
        }
      }

      setListeVoeux(voeux);
    }
  }, [isSuccess, data]);

  console.log(listeVoeux);

  const columns = useMemo(
    () => [
      {
        Header: "Enseignants",
        accessor: (row: any) =>
          row.enseignant?.prenom_fr + " " + row.enseignant?.nom_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestre1",
        accessor: (cellProps: any) => {
          return cellProps.voeux_s1 !== "" ? (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  data-bs-toggle="offcanvas"
                  className="badge bg-warning-subtle text-body view-item-btn"
                  onClick={() => {
                    setShowFicheClasseDetails(cellProps?.voeux_s1!);
                    setShowFicheClasse(!showFicheClasse);
                  }}
                >
                  {" "}
                  <i
                    className="ph ph-eye"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/gestion-fiche-voeux/edit-fiche-voeux"
                  state={cellProps?.voeux_s1!}
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
                    onClick={() => AlertDelete(cellProps?.voeux_s1?._id!)}
                  ></i>
                </Link>
              </li>
            </ul>
          ) : (
            <div>-------------------</div>
          );
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Semestre2",
        accessor: (cell: any) => {
          console.log("cellProps?.voeux_s2", cell?.voeux_s2);
          return cell?.voeux_s2! !== "" ? (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  data-bs-toggle="offcanvas"
                  className="badge bg-warning-subtle text-body view-item-btn"
                  onClick={() => {
                    setShowFicheClasseDetails(cell?.voeux_s2!);
                    setShowFicheClasse(!showFicheClasse);
                  }}
                >
                  {" "}
                  <i
                    className="ph ph-eye"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/gestion-fiche-voeux/edit-fiche-voeux"
                  state={cell?.voeux_s2!}
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
                    onClick={() => AlertDelete(cell?.voeux_s2?._id!)}
                  ></i>
                </Link>
              </li>
            </ul>
          ) : (
            <div>-------------------</div>
          );
        },
        disableFilters: true,
        filterable: true,
      },
    ],
    [showFicheClasse]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des départements"
            pageTitle="Liste fiches des voeux enseignants "
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
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>

                    <Col className="col-lg-auto ms-auto">
                      <div className="hstack gap-3">
                        <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_AddMatiere()}
                        >
                          Ajouter fiche voeux
                        </Button>
                        {/* <Button
                          variant="primary"
                          className="add-btn"
                          onClick={() => tog_ImportModals()}
                          // onClick={exportToExcel}
                        >
                          Importer
                        </Button> */}
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
                      data={listeVoeux || []}
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
          </Row>
        </Container>
      </div>
      <Offcanvas
        show={showFicheClasse}
        onHide={() => setShowFicheClasse(!showFicheClasse)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Fiche Voeux</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {console.log(showFicheClasseDetails)}
          <div>{showFicheClasseDetails?.semestre!}</div>
          {showFicheClasseDetails?.fiche_voeux_classes?.map((voeux: any) => (
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <span className="text-muted">Classe</span>
                      </td>
                      <td>
                        <span className="fw-medium">
                          {voeux?.classe?.nom_classe_fr!}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="text-muted">Matières</span>
                      </td>
                      <td>
                        <ul>
                          {voeux?.matieres?.map((matiere: any) => (
                            <li>
                              <span className="fw-medium">
                                {matiere?.matiere + " " + matiere?.type}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr style={{ color: "#000", height: "3px" }} />
              </div>
            </div>
          ))}
          <Row>
            <div>
              <div>
                <span className="text-muted">Jours</span>
              </div>
              <div>
                <ul>
                  {showFicheClasseDetails?.jours?.map((elm: any) => (
                    <li>
                      <span className="fw-medium">{elm.jour}</span> |{" "}
                      {elm?.temps}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ListFicheVoeux;