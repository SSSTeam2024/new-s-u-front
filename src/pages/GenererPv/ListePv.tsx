import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import {
  GeneratedPvModel,
  useDeleteGeneratedPvMutation,
  useFetchAllGeneratedPvsQuery,
  useUpdateGeneratedPvMutation,
} from "features/generatedPv/generatedPvSlice";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const ListePv = () => {
  document.title = "Liste des Pv | ENIGA";

  const [updatePv] = useUpdateGeneratedPvMutation();
  const { data = [] } = useFetchAllGeneratedPvsQuery();
  const [deletePv] = useDeleteGeneratedPvMutation();

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
          deletePv(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "PV a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "PV est en sécurité :)",
            "error"
          );
        }
      });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    row: GeneratedPvModel
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const updatedPv = {
        ...row,
        fichier: base64Data + "." + extension,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      };

      await updatePv(updatedPv);
      // Optionally refresh your data here if needed
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Titre</span>,
      sortable: true,
      width: "240px",
      cell: (row: any) => {
        return (
          <div>
            <span>{row?.titre!}</span>
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Commission</span>,
      cell: (row: any) => {
        return (
          <div>
            <span>{row?.commission?.titre_fr!}</span>
          </div>
        );
      },
      sortable: true,
      width: "240px",
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      cell: (row: any) => (
        <span>
          <strong>{row?.createdAt?.split("T")[0]}</strong>
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="font-weight-bold fs-13">Fichier</span>,
      cell: (row: any) => (
        <div className="badge badge-soft-secondary">
          <i
            className="ph ph-file-arrow-up"
            style={{
              transition: "transform 0.3s ease-in-out",
              cursor: "pointer",
              fontSize: "1.5em",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.3)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() =>
              document.getElementById(`fileInput-${row._id}`)?.click()
            }
          ></i>
          <input
            id={`fileInput-${row._id}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, row)}
          />
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: false,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/directeur-de-stage/details-pv"
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
                to="#"
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Liste des PV" pageTitle="Directeur des stages" />
          <Card className="shadow p-4">
            <Card.Header className="border-bottom-dashed">
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
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={data}
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

export default ListePv;
