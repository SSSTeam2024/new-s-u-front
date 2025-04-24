import React, { useState } from "react";
import { Card, Col, Container, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteVoieEnvoiMutation,
  useFetchAllVoieEnvoiQuery,
} from "features/voieEnvoi/voieEnvoiSlice";
import AjouterVoieEnvoi from "./AjouterVoieEnvoi";
import ModifierVoieEnvoi from "./ModifierVoieEnvoi";

const VoieEnvoi = () => {
  document.title = "Voie d'Envoi | ENIGA";

  const { data = [] } = useFetchAllVoieEnvoiQuery();

  const [deleteVoieEnvoi] = useDeleteVoieEnvoiMutation();

  const [modal_UpdateVoieEnvoi, setmodal_UpdateVoieEnvoi] =
    useState<boolean>(false);
  function tog_UpdateVoieEnvoi() {
    setmodal_UpdateVoieEnvoi(!modal_UpdateVoieEnvoi);
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
          deleteVoieEnvoi(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Voie d'Envoi a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Voie d'Envoi est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Title</span>,
      selector: (row: any) => row?.titre!,
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
                to="#"
                className="badge badge-soft-success edit-item-btn"
                state={row}
                onClick={tog_UpdateVoieEnvoi}
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Voie d'Envoi" pageTitle="Bureau d'Ordre" />

          <Card>
            <Card.Body>
              <Row>
                <Col lg={5}>
                  <AjouterVoieEnvoi />
                </Col>
                <Col lg={1}></Col>
                <Col>
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    noDataComponent="Il n'y a aucun enregistrement à afficher"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Modal
        className="fade zoomIn"
        size="sm"
        show={modal_UpdateVoieEnvoi}
        onHide={() => {
          setmodal_UpdateVoieEnvoi(false);
        }}
        centered
      >
        <Modal.Header className="px-4 pt-4" closeButton>
          <h5 className="modal-title fs-18" id="exampleModalLabel">
            Modifier Voie d'envoi
          </h5>
        </Modal.Header>
        <Modal.Body className="p-4">
          <ModifierVoieEnvoi
            setmodal_UpdateVoieEnvoi={setmodal_UpdateVoieEnvoi}
            modal_UpdateVoieEnvoi={modal_UpdateVoieEnvoi}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default VoieEnvoi;
