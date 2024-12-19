import React, { useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "Common/TableContainer";
import { DossierAdministratif, useArchiveDossierAdministratifMutation, useFetchDossierAdministratifQuery } from "features/dossierAdministratif/dossierAdministratif";

const ListeDossierAdministratifPersonnels = () => {
  document.title = "Liste Dossiers Administratifs | Smart University";

  const navigate = useNavigate();
 
  function tog_AddDossierAdministratif() {
    navigate("/gestion-personnel/ajouter-dossier-administartif");
  }
  const { data = [] } = useFetchDossierAdministratifQuery();

const personnelsDossiers = data.filter(dossier => dossier.personnel && !dossier.isArchived);


  const [archiveDossier] = useArchiveDossierAdministratifMutation();

  const handleArchive = async (dossierId: any) => {

    try {
      await archiveDossier({ dossierId }).unwrap(); 
    } catch (error) {
      console.error('Failed to archive the dossier: ', error);
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: "Personnels",
        accessor: (row: any) =>
          row.personnel?.prenom_fr + " " + row.personnel?.nom_fr || "",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Papier Administratif",
        accessor: (row: any) => {
         return row.papers ? row.papers.length : 0;
        },
        disableFilters: true,
        filterable: true,
      },
      
      {
        Header: "Date de création",
        accessor: "createdAt",
        Cell: ({ value }: any) => new Date(value).toLocaleDateString("fr-FR"),
        disableFilters: true,
        filterable: true,
      }
,      
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (dossierAdministratif: DossierAdministratif) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
               <li>
                <Link
                  to="/gestion-personnel/details-dossier-administratif"
                  className="badge bg-info-subtle text-info view-item-btn"
                  state={dossierAdministratif}
                >
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
                  to="/gestion-personnel/edit-dossier-administratif"
                  state={dossierAdministratif}
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
                    className="ph ph-archive"
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
                    onClick={() => handleArchive(dossierAdministratif._id)}
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Gestion des personnels"
            pageTitle="Liste des dossiers personnels"
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
                          onClick={() => tog_AddDossierAdministratif()}
                        >
                          Ajouter dossier administratif
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
                      data={personnelsDossiers || []}
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
                      <h5 className="mt-2">Désolé ! Aucun résultat trouvé</h5>
                      <p className="text-muted mb-0">
                      Nous avons cherché dans plus de 150+ dossiers, mais
                      aucun résultat ne correspond à votre recherche.
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
    </React.Fragment>
  );
};

export default ListeDossierAdministratifPersonnels;