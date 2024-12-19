import React, { useMemo } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import TableContainer from "Common/TableContainer";
import { useLocation } from "react-router-dom";
import {
  DossierAdministratif,
  useFetchDossierAdministratifQuery,
  useRemoveSpecificPaperMutation,
} from "features/dossierAdministratif/dossierAdministratif";
import Swal from "sweetalert2";

const ViewDossierAdministratif = () => {
  document.title = "Visualiser dossier enseignant | Smart Institute";

  const location = useLocation();
  const dossierAdministratif = location.state;

  const { data: allDossiers = [] } = useFetchDossierAdministratifQuery();
  const enseignantId = dossierAdministratif?.enseignant?._id;
  const filteredDossiers = allDossiers.filter((dossier) => {
    const currentEnseignantId = dossier?.enseignant?._id!;
    return String(currentEnseignantId).trim() === String(enseignantId).trim();
  });


  console.log("filteredDossiers", filteredDossiers);
  const [deleteSpecificPaper] = useRemoveSpecificPaperMutation();

  const AlertDelete = async (dossierId: string, paper: any) => {
    console.log(dossierId)
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

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
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const paperDetails = {
              paperId: paper?.paperId?._id! ?? "", // Ensure this gets the correct ID for the paper
              annee: paper.date ?? "",
              remarques: paper.remarque ?? "",
              file: paper.file ?? "",
            };
            
            try {
              console.log(
                "Attempting to delete paper with dossierId:",
                dossierId
              );
              console.log("Paper details:", paperDetails);
              if (!paperDetails.paperId) {
                Swal.fire("Erreur", "Le papier à supprimer est invalide.", "error");
                return;
              }
              await deleteSpecificPaper({
                dossierId,
                userId: enseignantId,
                userType: "enseignant",
                paperDetails,
              });
              console.log("Delete request successful.");
            } catch (error) {
              console.error("Erreur lors de la suppression du papier:", error);
            }

            swalWithBootstrapButtons.fire(
              "Supprimé!",
              "Le papier a été supprimé.",
              "success"
            );
          } catch (error) {
            console.error("Erreur lors de la suppression du papier:", error);
            swalWithBootstrapButtons.fire(
              "Erreur",
              "Échec de la suppression du papier.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le papier est en sécurité :)",
            "error"
          );
        }
      });
  };

  const data = useMemo(() => {
    return filteredDossiers.flatMap((dossier) => {
      return dossier.papers.map((paper) => {
        return {
          dossierId: dossier._id,
          paperId: paper.papier_administratif,
          soustype: paper.papier_administratif.nom_fr,
          date: paper.annee,
          remarque: paper.remarques,
          file: paper.file,
        };
      });
    });
  }, [filteredDossiers]);
  

  const columns = useMemo(
    () => [
      {
        Header: "Papier administratif",
        accessor: "soustype",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Année",
        accessor: "date",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Remarques",
        accessor: "remarque",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Fichier",
        accessor: "file",
        disableFilters: true,
        filterable: true,
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <a
            href={`${process.env.REACT_APP_API_URL}/files/dossierFiles/${value}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="bi bi-file-earmark-pdf"
              style={{
                cursor: "pointer",
                fontSize: "1.5em",
                marginLeft: "30px",
              }}
            ></i>
          </a>
        ),
      },
      ,
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: { row: { original: DossierAdministratif } }) => {
          const dossierId = row.original.dossierId;
          const paper: any = row.original;
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <div
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                  onClick={() => {
                    AlertDelete(dossierId!, paper);
                  }}
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
                >
                  <i className="ph ph-trash"></i>
                </div>
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
      <Tab.Container defaultActiveKey="Profil">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Nav as="ul" className="nav nav-pills flex-grow-1 mb-0">
            <Nav.Item as="li">
              <Nav.Link eventKey="Profil">Profil</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Tab.Content className="text-muted">
          <Tab.Pane eventKey="Profil">
            <Card>
              <Row className="g-0">
                <Col md={9}>
                  <Card.Header>
                    <div className="flex-grow-1 card-title mb-0">
                      <h5>
                        {filteredDossiers[0]?.enseignant?.nom_fr}{" "}
                        {filteredDossiers[0]?.enseignant?.prenom_fr}
                      </h5>
                      <p className="text-muted mb-0">
                        {" "}
                        {filteredDossiers[0]?.enseignant?.nom_ar}{" "}
                        {filteredDossiers[0]?.enseignant?.prenom_ar}
                      </p>
                    </div>
                  </Card.Header>
                </Col>
              </Row>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Card>
        <Card.Body className="p-0">
          <table className="table align-middle table-nowrap" id="customerTable">
            <TableContainer
              columns={columns || []}
              data={data || []}
              // isGlobalFilter={false}
              iscustomPageSize={false}
              isBordered={false}
              customPageSize={5}
              className="custom-header-css table align-middle table-nowrap"
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light"
              SearchPlaceholder="Search Products..."
            />
          </table>
          <div className="noresult" style={{ display: "none" }}>
            <div className="text-center">
              <h5 className="mt-2">Désolé ! Aucun résultat trouvé</h5>
              <p className="text-muted mb-0">
              Nous avons cherché dans plus de 150+ dossiers, mais
              aucun résultat ne correspond à votre recherche.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default ViewDossierAdministratif;