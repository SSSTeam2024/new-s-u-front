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
      selector: (row: any) => {
        return row?.cin! !== "" ? (
          <span>{row?.cin!}</span>
        ) : (
          <span className="text-danger-emphasis"> ---- </span>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matricule</span>,
      selector: (row: any) => {
        return row?.matricule! !== "" ? (
          <span>{row?.matricule!}</span>
        ) : (
          <span className="text-danger-emphasis"> ---- </span>
        );
      },
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredIntervenants = () => {
    let filteredIntervenants = [...data];

    if (searchTerm) {
      filteredIntervenants = filteredIntervenants.filter(
        (intervenant: any) =>
          intervenant
            ?.nom_fr!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          intervenant
            ?.nom_ar!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          intervenant?.cin!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          intervenant
            ?.matricule!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          intervenant
            ?.phone!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          intervenant?.email!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredIntervenants.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Intervenants" pageTitle="Bureau d'Ordre" />
          <Card>
            <Card.Header>
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
                <Col className="d-flex justify-content-end">
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
                data={getFilteredIntervenants()}
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
              <Col lg={4}>
                <span className="fw-medium">Nom</span>
              </Col>
              <Col lg={8} className="text-end">
                <i>
                  {intervenantDetails?.nom_fr!} (
                  {intervenantDetails?.abbreviation!}){" "}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">الإسم</span>
              </Col>
              <Col lg={8} className="text-end">
                <i>{intervenantDetails?.nom_ar!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">C.I.N</span>
              </Col>
              <Col lg={8} className="text-end">
                {intervenantDetails?.cin! !== "" ? (
                  <i>{intervenantDetails?.cin!}</i>
                ) : (
                  <i className="text-danger">Pas de C.I.N disponible</i>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Matricule</span>
              </Col>
              <Col lg={8} className="text-end">
                <i>{intervenantDetails?.matricule!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <div className="hstack gap-1">
                  <i className="ri-phone-fill"></i>
                  <span className="fw-medium">Téléphone</span>
                </div>
              </Col>
              <Col lg={8} className="text-end">
                <i>{intervenantDetails?.phone!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <div className="hstack gap-1">
                  <i className="ri-mail-fill"></i>
                  <span className="fw-medium">Email</span>
                </div>
              </Col>
              <Col lg={8} className="text-end">
                {intervenantDetails?.email! !== "" ? (
                  <i>{intervenantDetails?.email!}</i>
                ) : (
                  <i className="text-danger">Aucun e-mail disponible</i>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <div className="hstack gap-1">
                  <i className="ri-map-pin-fill"></i>
                  <span className="fw-medium">Adresse</span>
                </div>
              </Col>
              <Col lg={8} className="text-end">
                {intervenantDetails?.address! !== "" ? (
                  <i>{intervenantDetails?.address!}</i>
                ) : (
                  <i className="text-danger-emphasis">
                    Pas d'adresse disponible
                  </i>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <div className="hstack gap-1">
                  <i className="ri-global-fill"></i>
                  <span className="fw-medium">Site Web</span>
                </div>
              </Col>
              <Col lg={8} className="text-end">
                {intervenantDetails?.site! !== "" ? (
                  <i>{intervenantDetails?.site!}</i>
                ) : (
                  <i className="text-danger">Aucun site Web disponible</i>
                )}
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};

export default Intervenants;
