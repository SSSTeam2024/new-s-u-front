import React, { useState } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import DataTable from "react-data-table-component";
import {
  useDeleteCourrierEntrantMutation,
  useFetchAllCourrierEntrantQuery,
} from "features/courrierEntrant/courrierEntrant";
import { useFetchAllIntervenantsQuery } from "features/intervenants/intervenantsSlice";

const CourriersEntrants = () => {
  document.title = "Courriers Entrants | ENIGA";

  const navigate = useNavigate();

  function tog_AjouterCourrierEntrant() {
    navigate("/bureau-ordre/courriers-entrants/ajouter-courrier-entrant");
  }

  const { data = [] } = useFetchAllCourrierEntrantQuery();
  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();

  const [deleteCourrierEntrant] = useDeleteCourrierEntrantMutation();
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDestinataire, setSelectedDestinataire] = useState<string>("");

  const handleSelectedSource = (e: any) => {
    setSelectedSource(e.target.value);
  };

  const handleSelectedDestinataire = (e: any) => {
    setSelectedDestinataire(e.target.value);
  };

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
          deleteCourrierEntrant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Courrier Entrant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Courrier Entrant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">N° Ordre</span>,
      selector: (row: any) => row?.num_ordre!,
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date arrivée</span>,
      selector: (row: any) => row?.date_arrive!,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Source</span>,
      selector: (row: any) => row?.source?.nom_fr!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destinataire</span>,
      selector: (row: any) => row?.destinataire?.nom_fr!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sujet</span>,
      selector: (row: any) =>
        row.sujet.length > 40 ? row.sujet.slice(0, 40) + "..." : row.sujet,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date livraison</span>,
      selector: (row: any) => row?.date_livraison!,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      width: "160px",
      cell: (row: any) => {
        const handleDownload = async () => {
          const fileUrl = `${process.env.REACT_APP_API_URL}/files/courrierEntrantFiles/${row?.file}`;

          try {
            const response = await fetch(fileUrl, {
              method: "GET",
            });

            if (!response.ok) throw new Error("File not found.");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `courrier-${row.num_ordre}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
          } catch (error) {
            console.error("Error downloading file:", error);
            alert("Échec du téléchargement du fichier.");
          }
        };
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/bureau-ordre/courriers-entrants/details-courrier-entrant"
                className="badge badge-soft-info edit-item-btn"
                state={row}
              >
                <i className="ri-eye-line"></i>
              </Link>
            </li>

            <li>
              <Link
                to="/bureau-ordre/courriers-entrants/modifier-courrier-entrant"
                className="badge badge-soft-success edit-item-btn"
                state={row}
              >
                <i className="ri-edit-2-line"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge badge-soft-secondary edit-item-btn"
                title="Download File"
                onClick={handleDownload}
              >
                <i className="ri-download-line" title="Download File"></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
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

  const getFilteredCourrierEntrants = () => {
    let filteredCourrierEntrants = [...data];

    if (searchTerm) {
      filteredCourrierEntrants = filteredCourrierEntrants.filter(
        (courrier: any) =>
          courrier
            ?.num_ordre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier
            ?.date_arrive!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier?.source
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier
            ?.date_livraison!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier?.destinataire
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSource && selectedSource !== "source") {
      filteredCourrierEntrants = filteredCourrierEntrants.filter(
        (courrier: any) => courrier?.source?._id! === selectedSource
      );
    }

    if (selectedDestinataire && selectedDestinataire !== "destinataire") {
      filteredCourrierEntrants = filteredCourrierEntrants.filter(
        (courrier: any) => courrier?.destinataire?._id! === selectedDestinataire
      );
    }

    return filteredCourrierEntrants.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste Courriers Entrants"
            pageTitle="Bureau Ordre"
          />
          <Card className="shadow p-4">
            <Card.Header className="border-bottom-dashed">
              <Row>
                <Col lg={6}>
                  <Row>
                    <Col>
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
                    <Col>
                      <select
                        className="form-select"
                        onChange={handleSelectedSource}
                      >
                        <option value="source">Source</option>
                        {AllIntervenants.map((intervenant) => (
                          <option
                            value={intervenant?._id!}
                            key={intervenant?._id!}
                          >
                            {intervenant?.nom_fr!}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col>
                      <select
                        className="form-select"
                        onChange={handleSelectedDestinataire}
                      >
                        <option value="destinataire">Destinataire</option>
                        {AllIntervenants.map((intervenant) => (
                          <option
                            value={intervenant?._id!}
                            key={intervenant?._id!}
                          >
                            {intervenant?.nom_fr!}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                </Col>
                <Col lg={3}></Col>
                <Col lg={3} className="d-flex justify-content-end">
                  <span
                    className="badge bg-secondary-subtle text-secondary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterCourrierEntrant()}
                  >
                    <i className="ph ph-plus">Ajouter</i>
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={getFilteredCourrierEntrants()}
                pagination
                noDataComponent="Il n'y a aucun enregistrement à afficher"
              />
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CourriersEntrants;
