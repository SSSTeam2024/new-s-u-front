import React, { useState } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "Common/BreadCrumb";
import DataTable from "react-data-table-component";
import {
  useDeleteCourrierSortantMutation,
  useFetchAllCourrierSortantQuery,
} from "features/courrierSortant/courrierSortantSlice";
import { useFetchAllIntervenantsQuery } from "features/intervenants/intervenantsSlice";

const CourriersSortants = () => {
  document.title = "Courriers Sortants | ENIGA";

  const navigate = useNavigate();

  function tog_AjouterCourrierSortant() {
    navigate("/bureau-ordre/courriers-sortants/ajouter-courrier-sortant");
  }

  const { data = [] } = useFetchAllCourrierSortantQuery();
  const { data: AllIntervenants = [] } = useFetchAllIntervenantsQuery();

  const [selectedDestinataire, setSelectedDestinataire] = useState<string>("");

  const handleSelectedDestinataire = (e: any) => {
    setSelectedDestinataire(e.target.value);
  };

  const [deleteCourrierSortant] = useDeleteCourrierSortantMutation();

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
          deleteCourrierSortant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Courrier Sortant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Courrier Sortant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">N° Inscription</span>,
      selector: (row: any) => row?.num_inscription!,
      sortable: true,
      width: "128px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date Edition</span>,
      selector: (row: any) => row?.date_edition!,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">Voie d'envoi</span>,
      selector: (row: any) => (
        <ul className="list-unstyled">
          {row.voie_envoi.map((voie: any, index: number) => (
            <li key={index}>{voie.titre}</li>
          ))}
        </ul>
      ),
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
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      width: "160px",
      cell: (row: any) => {
        const handleDownload = async () => {
          const fileUrl = `${process.env.REACT_APP_API_URL}/files/courrierSortantFiles/${row?.file}`;

          try {
            const response = await fetch(fileUrl, {
              method: "GET",
            });

            if (!response.ok) throw new Error("File not found.");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `courrier-${row.num_inscription}.pdf`;
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
                to="/bureau-ordre/courriers-sortants/details-courrier-sortant"
                className="badge badge-soft-info edit-item-btn"
                state={row}
              >
                <i className="ri-eye-line"></i>
              </Link>
            </li>
            <li>
              <Link
                to="/bureau-ordre/courriers-sortants/modifier-courrier-sortant"
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

  const getFilteredCourrierSortants = () => {
    let filteredCourrierSortants = [...data];

    if (searchTerm) {
      filteredCourrierSortants = filteredCourrierSortants.filter(
        (courrier: any) =>
          courrier
            ?.num_inscription!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier
            ?.date_edition!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier?.destinataire
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          courrier.voie_envoi.some((voie: any) =>
            voie.titre.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (selectedDestinataire && selectedDestinataire !== "destinataire") {
      filteredCourrierSortants = filteredCourrierSortants.filter(
        (courrier: any) => courrier?.destinataire?._id! === selectedDestinataire
      );
    }

    return filteredCourrierSortants.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Liste Courriers Sortants"
            pageTitle="Bureau Ordre"
          />
          <Card className="shadow p-4">
            <Card.Header className="border-bottom-dashed">
              <Row>
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
                <Col lg={3}>
                  <select
                    className="form-select"
                    onChange={handleSelectedDestinataire}
                  >
                    <option value="destinataire">Destinataire</option>
                    {AllIntervenants.map((intervenant) => (
                      <option value={intervenant?._id!} key={intervenant?._id!}>
                        {intervenant?.nom_fr!}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={6} className="d-flex justify-content-end">
                  <span
                    className="badge bg-info-subtle text-info view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                    onClick={() => tog_AjouterCourrierSortant()}
                  >
                    <i className="ph ph-plus">Ajouter</i>
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={getFilteredCourrierSortants()}
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

export default CourriersSortants;
