import React, { useEffect, useMemo, useState } from "react";
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

import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { selectCurrentUser } from "features/account/authSlice";

const GestionNotesExamen = () => {
  document.title = "Liste des Notes Examen | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const [open_ModalNote, setOpenModalNote] = useState<boolean>(false);
  const [open_ModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
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

  const tog_ModalConfirm = () => {
    setOpenModalConfirm(!open_ModalConfirm);
  };

  const handlePasswordValue = (e: any) => {
    setPasswordValue(e.target.value);
  };
  const { data: EtudiantsByClasseID = [] } = useFetchEtudiantsByIdClasseQuery(
    noteState?.groupe?._id!
  );

  const hasEtudiants = noteState?.etudiants && noteState?.etudiants.length > 0;
  const filteredEtudiants = useMemo(() => {
    if (!hasEtudiants) return EtudiantsByClasseID;

    return EtudiantsByClasseID.filter(
      (etudiant) =>
        !noteState?.etudiants?.some(
          (existingEtudiant: any) =>
            existingEtudiant?.etudiant?._id === etudiant?._id
        )
    );
  }, [EtudiantsByClasseID, noteState]);

  const handleCheckboxChange = (id: any) => {
    setCheckedItems((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [updatedNotes, setUpdatedNotes] = useState(() => {
    const existingNotes =
      noteState?.etudiants.map((etudiant: any) => ({
        etudiant: etudiant.etudiant._id,
        note: etudiant.note,
        isAbsent: false,
      })) || [];

    const newNotes = filteredEtudiants.map((etudiant: any) => ({
      etudiant: etudiant._id,
      note: "",
      isAbsent: false,
    }));

    return [...existingNotes, ...newNotes];
  });

  const handleInputChange = (id: string, newValue: string) => {
    setUpdatedNotes((prev: any) => {
      const exists = prev.some((item: any) => item.etudiant === id);

      if (exists) {
        // Update the existing note
        return prev.map((item: any) =>
          item.etudiant === id ? { ...item, note: newValue } : item
        );
      } else {
        // Add a new note entry if not found
        return [...prev, { etudiant: id, note: newValue, isAbsent: false }];
      }
    });
  };

  useEffect(() => {
    const existingNotes =
      noteState?.etudiants.map((etudiant: any) => ({
        etudiant: etudiant.etudiant._id,
        note: etudiant.note,
        isAbsent: false,
      })) || [];

    const newNotes = filteredEtudiants.map((etudiant: any) => ({
      etudiant: etudiant._id,
      note: "",
      isAbsent: false,
    }));

    setUpdatedNotes([...existingNotes, ...newNotes]);
  }, [noteState]);

  const handleSubmit = async () => {
    const finalNotes = updatedNotes.map((item) => ({
      etudiant: item.etudiant,
      note: item.isAbsent ? "Absent" : item.note || "",
    }));

    const updateData = { etudiants: finalNotes };

    try {
      await updateNoteExamen({ id: noteState._id, updateData }).unwrap();
      alert("Notes updated successfully!");
      setOpenModalNote(!open_ModalNote);
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const handleSubmitPassword = () => {
    if (passwordValue === "123456") {
      alert("Note Examen envoyé d'une façon définitive!!");
      tog_ModalConfirm();
    } else {
      setErrorMessage("Veuillez vérifier le mot de passe entré!!");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

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
              {filteredEtudiants.length === 0 && (
                <li>
                  <Link
                    to="#"
                    className="badge bg-success-subtle text-success edit-item-btn"
                    onClick={tog_ModalConfirm}
                    state={cellProps}
                  >
                    <i
                      className="ph ph-paper-plane-tilt"
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
              )}
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
              <Row className="mb-2">
                <Col>
                  <small className="text-muted">
                    Veuillez cocher la case correspondante si un étudiant est{" "}
                    <strong>absent</strong>.
                  </small>
                </Col>
              </Row>
              {hasEtudiants
                ? noteState?.etudiants.map((existingEtudiant: any) => (
                    <Row
                      className="mb-3"
                      key={existingEtudiant?.etudiant?._id!}
                    >
                      <Col lg={1}>
                        <input
                          type="checkbox"
                          className="form-check-input bg-light"
                          onChange={() =>
                            handleCheckboxChange(existingEtudiant.etudiant._id)
                          }
                          checked={
                            updatedNotes.find(
                              (item: any) =>
                                item.etudiant === existingEtudiant.etudiant._id
                            )?.isAbsent || false
                          }
                        />
                      </Col>
                      <Col lg={2}>
                        *****{existingEtudiant.etudiant.num_CIN.slice(5)}
                      </Col>
                      <Col lg={5}>
                        {existingEtudiant.etudiant.prenom_fr}{" "}
                        {existingEtudiant.etudiant.nom_fr}
                      </Col>
                      <Col lg={3}>
                        <input
                          className={`form-control ${
                            updatedNotes.find(
                              (item: any) =>
                                item.etudiant === existingEtudiant.etudiant._id
                            )?.isAbsent
                              ? "text-muted bg-light"
                              : ""
                          }`}
                          type="text"
                          disabled={
                            updatedNotes.find(
                              (item: any) =>
                                item.etudiant === existingEtudiant.etudiant._id
                            )?.isAbsent
                          }
                          value={
                            updatedNotes.find(
                              (item: any) =>
                                item.etudiant === existingEtudiant.etudiant._id
                            )?.note || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              existingEtudiant.etudiant._id,
                              e.target.value
                            )
                          }
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
                  <Col lg={2}>*****{etudiants.num_CIN.slice(5)}</Col>
                  <Col lg={5}>
                    {etudiants.prenom_fr} {etudiants.nom_fr}
                  </Col>
                  <Col lg={3}>
                    <input
                      className={`form-control ${
                        updatedNotes.find(
                          (item: any) => item.etudiant === etudiants._id
                        )?.isAbsent
                          ? "text-muted bg-light"
                          : ""
                      }`}
                      type="text"
                      disabled={checkedItems[etudiants?._id!]}
                      value={
                        updatedNotes.find(
                          (item: any) => item.etudiant === etudiants._id
                        )?.note || ""
                      }
                      onChange={(e) =>
                        handleInputChange(etudiants?._id!, e.target.value)
                      }
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
                <Button variant="success" id="add-btn" onClick={handleSubmit}>
                  Modifier
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
        <Modal
          className="fade modal-fullscreen"
          show={open_ModalConfirm}
          onHide={() => {
            tog_ModalConfirm();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title" id="exampleModalLabel">
              Confirmation
            </h5>
          </Modal.Header>
          {!showPasswordForm ? (
            <>
              <Modal.Body className="p-4">
                <Row className="mb-3">
                  <Col>
                    <span className="fw-medium">{noteState.type_examen}</span>{" "}
                    de{" "}
                    <span className="fw-bold">{noteState.matiere.matiere}</span>{" "}
                    pour{" "}
                    <span className="fw-bold">
                      {noteState.groupe.nom_classe_fr}
                    </span>{" "}
                    en <span className="fw-medium">{noteState.semestre}</span>
                  </Col>
                </Row>
                {noteState.etudiants.map((etudiant: any) => (
                  <Row key={etudiant?.etudiant?._id!} className="mb-2">
                    <Col lg={2}>{etudiant.etudiant.num_CIN}</Col>
                    <Col>
                      {etudiant.etudiant.prenom_fr} {etudiant.etudiant.nom_fr}{" "}
                    </Col>
                    <Col>{etudiant.note}</Col>
                  </Row>
                ))}
              </Modal.Body>
              <div className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => {
                      tog_ModalConfirm();
                    }}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="success"
                    id="add-btn"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Form>
              <Modal.Body className="p-4">
                <Row>
                  <Col>
                    <Form.Label>Entrer mot de passe pour confirmer</Form.Label>
                  </Col>
                  <Col lg={5}>
                    <input
                      type="password"
                      className={`form-control ${
                        errorMessage ? "is-invalid" : ""
                      }`}
                      onChange={handlePasswordValue}
                    />
                    {errorMessage && (
                      <div className="invalid-feedback d-block">
                        {errorMessage}
                      </div>
                    )}
                  </Col>
                </Row>
              </Modal.Body>
              <div className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => {
                      tog_ModalConfirm();
                    }}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="success"
                    id="add-btn"
                    onClick={handleSubmitPassword}
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default GestionNotesExamen;
