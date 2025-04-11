import React, { useState } from "react";
import { Card, Col, Container, Offcanvas, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteIntervenantMutation,
  useFetchAllIntervenantsQuery,
} from "features/intervenants/intervenantsSlice";

const Intervenants = () => {
  document.title = "Intervenants | ENIGA";

  const navigate = useNavigate();

  function tog_AjouterIntervenant() {
    navigate("/bureau-ordre/intervenants/nouveau-intervenant");
  }
  const [showIntervenant, setShowIntervenant] = useState<boolean>(false);

  const location = useLocation();
  const intervenantDetails = location.state;

  const { data = [] } = useFetchAllIntervenantsQuery();

  const [deleteIntervenant] = useDeleteIntervenantMutation();

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
          deleteIntervenant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Intervenant a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Intervenant est en sécurité :)",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row?.nom_fr!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">الإ سم</span>,
      selector: (row: any) => row?.nom_ar!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">C.I.N</span>,
      selector: (row: any) => row?.cin!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matricule</span>,
      selector: (row: any) => row?.matricule!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Téléphone</span>,
      selector: (row: any) => row?.phone!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row: any) => row?.email!,
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
                className="badge badge-soft-info edit-item-btn"
                state={row}
                onClick={() => setShowIntervenant(!showIntervenant)}
              >
                <i className="ri-eye-line"></i>
              </Link>
            </li>
            <li>
              <Link
                to="/bureau-ordre/intervenants/modifier-intervenant"
                className="badge badge-soft-success edit-item-btn"
                state={row}
              >
                <i className="ri-edit-2-line"></i>
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Intervenants" pageTitle="Bureau d'Ordre" />
          <Card>
            <Card.Header>
              <Row>
                <Col lg={12} className="d-flex justify-content-end">
                  <span
                    className="badge bg-primary-subtle text-primary view-item-btn fs-18"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="ph ph-plus"
                      onClick={() => tog_AjouterIntervenant()}
                    >
                      Ajouter
                    </i>
                  </span>
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
        <Offcanvas
          show={showIntervenant}
          onHide={() => setShowIntervenant(!showIntervenant)}
          placement="end"
          style={{ width: "30%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Intervenant</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Nom</span>
              </Col>
              <Col lg={4}>
                <i>
                  {intervenantDetails?.nom_fr!} (
                  {intervenantDetails?.abbreviation!}){" "}
                </i>
              </Col>
              <Col lg={3}>
                <i>{intervenantDetails?.nom_ar!}</i>
              </Col>
              <Col lg={2}>
                <span className="fw-medium">الإ سم</span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">C.I.N</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.cin!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matricule</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.matricule!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Téléphone</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.phone!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Email</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.email!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Adresse</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.address!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Site Web</span>
              </Col>
              <Col lg={9}>
                <i>{intervenantDetails?.site!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};

export default Intervenants;
