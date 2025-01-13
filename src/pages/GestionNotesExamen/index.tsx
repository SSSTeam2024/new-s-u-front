import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import {
  useFetchNotesExamenQuery,
  useUpdateNoteExamenMutation,
} from "features/notesExamen/notesExamenSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFetchEtudiantsByIdClasseQuery } from "features/etudiant/etudiantSlice";

const GestionNotesExamen = () => {
  document.title = "Liste des Notes Examen | ENIGA";

  const [open_ModalNote, setOpenModalNote] = useState<boolean>(false);

  const [checkedItems, setCheckedItems] = useState<any>({});

  const location = useLocation();
  const noteState = location.state;

  const { data: AllNotesExamen = [] } = useFetchNotesExamenQuery();
  const [updateNoteExamen] = useUpdateNoteExamenMutation();

  const navigate = useNavigate();

  const tog_AjouterNoteExamen = () => {
    navigate("/gestion-examen/ajouter-des-notes-examen");
  };

  const tog_ModalNote = () => {
    setOpenModalNote(!open_ModalNote);
  };

  const { data: EtudiantsByClasseID = [] } = useFetchEtudiantsByIdClasseQuery(
    noteState?.groupe?._id!
  );

  const hasEtudiants = noteState?.etudiants && noteState?.etudiants.length > 0;
  const filteredEtudiants = hasEtudiants
    ? EtudiantsByClasseID.filter(
        (etudiant) =>
          !noteState?.etudiants?.some(
            (existingEtudiant: any) =>
              existingEtudiant?.etudiant?._id! === etudiant?._id!
          )
      )
    : EtudiantsByClasseID;

  const handleCheckboxChange = (id: any) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("filteredEtudiants", filteredEtudiants);
  const columns = useMemo(
    () => [
      {
        Header: "Semestre",
        accessor: "semestre",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Classe",
        accessor: "groupe.nom_classe_fr",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Matière",
        accessor: "matiere.matiere",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Type Examen",
        accessor: "type_examen",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  className="badge bg-info-subtle text-info view-item-btn"
                  onClick={tog_ModalNote}
                  state={cellProps}
                >
                  <i
                    className="ph ph-exam"
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
              {/* <li>
                  <Link
                    to="#"
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
                </li> */}
              {/* <li>
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
                    ></i>
                  </Link>
                </li> */}
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
          <Breadcrumb title="Notes Examen" pageTitle="Liste des Notes Examen" />
          <Card>
            <Card.Header>
              <Row>
                <Col className="col-lg-auto ms-auto">
                  <div className="hstack gap-2">
                    <Button
                      variant="primary"
                      className="add-btn"
                      onClick={() => tog_AjouterNoteExamen()}
                    >
                      Ajouter Note Examen
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={12}>
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <TableContainer
                      columns={columns || []}
                      data={AllNotesExamen || []}
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
        <Modal
          className="fade modal-fullscreen"
          show={open_ModalNote}
          onHide={() => {
            tog_ModalNote();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title" id="exampleModalLabel">
              Notes
            </h5>
          </Modal.Header>
          <Form>
            <Modal.Body className="p-4">
              {hasEtudiants
                ? noteState?.etudiants.map((existingEtudiant: any) => (
                    <Row
                      className="mb-3"
                      key={existingEtudiant?.etudiant?._id!}
                    >
                      <Col lg={1}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked
                          disabled
                        />
                      </Col>
                      <Col>
                        {existingEtudiant.etudiant.prenom_fr}{" "}
                        {existingEtudiant.etudiant.nom_fr}
                      </Col>
                      <Col>
                        <input
                          className="form-control"
                          type="text"
                          value={existingEtudiant?.note!}
                        />
                      </Col>
                    </Row>
                  ))
                : null}

              {filteredEtudiants.map((etudiants) => (
                <Row className="mb-3" key={etudiants?._id!}>
                  <Col lg={1}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={() => handleCheckboxChange(etudiants?._id!)}
                      checked={checkedItems[etudiants?._id!] || false}
                    />
                  </Col>
                  <Col>
                    {etudiants.prenom_fr} {etudiants.nom_fr}
                  </Col>
                  <Col>
                    <input
                      className="form-control"
                      type="text"
                      disabled={!checkedItems[etudiants?._id!]}
                      value={checkedItems[etudiants?._id!] ? 99 : ""}
                    />
                  </Col>
                </Row>
              ))}
            </Modal.Body>
            <div className="modal-footer">
              <div className="hstack gap-2 justify-content-end">
                <Button
                  className="btn-ghost-danger"
                  onClick={() => {
                    tog_ModalNote();
                  }}
                >
                  Fermer
                </Button>
                <Button variant="success" id="add-btn">
                  Modifier
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default GestionNotesExamen;
