import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
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
import {
  StyleSheet,
  Document,
  Page,
  View,
  Text,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import { useVerifyPasswordMutation } from "features/account/accountSlice";

const styleGlobalCalendar = StyleSheet.create({
  secondTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  thirdTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
});

const stylesCalenderFilter = StyleSheet.create({
  page: {
    padding: 50,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    margin: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  timetable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 50,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "left",
    fontSize: 10,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  numEtudiant: {
    width: 60,
    fontWeight: "bold",
  },
  cinEtudiant: {
    width: 125,
    fontWeight: "bold",
  },
  nomEtudiant: {
    width: 245,
    fontWeight: "bold",
  },
  entreEtudiant: {
    width: 110,
    fontWeight: "bold",
  },
  emergedTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
});

const GestionNotesExamen = () => {
  document.title = "Liste des Notes Examen | ENIGA";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const [open_ModalNote, setOpenModalNote] = useState<boolean>(false);
  const [open_ModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [verifyPassword] = useVerifyPasswordMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const initialVerifyPassword = {
    hashedPassword: "",
    plainPassword: "",
  };

  const [verification, setVerification] = useState(initialVerifyPassword);

  const { hashedPassword, plainPassword } = verification;

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
        return prev.map((item: any) =>
          item.etudiant === id ? { ...item, note: newValue } : item
        );
      } else {
        return [...prev, { etudiant: id, note: newValue, isAbsent: false }];
      }
    });

    if (newValue.trim() === "") {
      setCheckedItems((prev: any) => ({
        ...prev,
        [id]: false,
      }));
    }
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

  const handleSubmitPassword = async () => {
    verification["plainPassword"] = passwordValue;
    verification["hashedPassword"] = user?.password!;
    const response = await verifyPassword(verification).unwrap();

    if (response.isMatch) {
      try {
        const updateData = { completed: "1" };

        await updateNoteExamen({ id: noteState._id, updateData }).unwrap();

        alert("Note Examen envoyé d'une façon définitive!!");
        tog_ModalConfirm();
      } catch (error) {
        console.error("Erreur lors de l'envoi de la Note Examen:", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
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
                        (e.currentTarget.style.transform = "scale(1.4)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    ></i>
                  </Link>
                </li>
              )}
              {cellProps.completed === "1" && (
                <li>
                  <button
                    type="button"
                    className="btn bg-danger-subtle btn-sm remove-item-btn"
                  >
                    <PDFDownloadLink
                      document={<NotePaper />}
                      fileName={`Note_${cellProps?.type_examen!}_${cellProps
                        ?.groupe?.nom_classe_fr!}_${cellProps?.matiere
                        ?.matiere!}_${cellProps.semestre}.pdf`}
                      className="text-decoration-none"
                    >
                      <i
                        className="ph ph-file-pdf text-danger"
                        style={{
                          transition: "transform 0.3s ease-in-out",
                          cursor: "pointer",
                          fontSize: "1.1em",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.6)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                      ></i>
                    </PDFDownloadLink>
                  </button>
                </li>
              )}
            </ul>
          );
        },
      },
    ],
    []
  );

  function getAcademicYear() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    let startYear, endYear;

    if (currentMonth >= 1 && currentMonth <= 6) {
      startYear = currentYear - 1;
      endYear = currentYear;
    } else if (currentMonth >= 9 && currentMonth <= 12) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    return `${startYear}/${endYear}`;
  }

  const NotePaper = () => {
    return (
      <Document>
        <Page orientation="portrait" style={{ padding: 30 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            {/* Left Section */}
            <View style={{ flex: 1, flexWrap: "wrap", maxWidth: "20%" }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                {variableGlobales[2]?.universite_fr!}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  textAlign: "left",
                }}
              >
                {variableGlobales[2]?.etablissement_fr!}
              </Text>
            </View>
            {/* Center Section */}
            <View style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Note: {noteState?.type_examen!}
              </Text>
              <Text style={styleGlobalCalendar.secondTitle}>
                Groupe: {noteState?.groupe?.nom_classe_fr!}
              </Text>
              <Text style={styleGlobalCalendar.thirdTitle}>
                Epreuve de: {noteState?.matiere?.matiere!}
              </Text>
            </View>
            {/* Right Section */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10 }}>A.U: {getAcademicYear()}</Text>
              <Text style={{ fontSize: 10 }}>
                Semestre: {noteState?.semestre!}
              </Text>
            </View>
          </View>
          {/* Table */}
          {/* Table Header */}
          <View style={stylesCalenderFilter.emergedTable}>
            {/* Header */}
            <View
              style={[stylesCalenderFilter.row, stylesCalenderFilter.headerRow]}
            >
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.numEtudiant,
                ]}
              >
                N°
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.cinEtudiant,
                ]}
              >
                C.I.N
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.nomEtudiant,
                ]}
              >
                Nom et Prénom
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.entreEtudiant,
                ]}
              >
                Note
              </Text>
            </View>
            {/* Body */}
            {noteState?.etudiants?.map((etudiant: any, index: any) => {
              return (
                <View style={stylesCalenderFilter.row} key={index}>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.numEtudiant,
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.cinEtudiant,
                    ]}
                  >
                    {etudiant.etudiant.num_CIN}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.nomEtudiant,
                    ]}
                  >
                    {etudiant.etudiant.nom_fr} {etudiant.etudiant.prenom_fr}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.entreEtudiant,
                    ]}
                  >
                    {etudiant.note}
                  </Text>
                </View>
              );
            })}
          </View>
          {/* Footer */}
          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              right: 10,
              paddingLeft: 30,
              paddingRight: 30,
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                marginTop: 10,
                padding: 10,
              }}
              render={({ pageNumber }) => (
                <Text style={{ fontSize: 10 }}>Page {pageNumber}</Text>
              )}
            />
          </View>
        </Page>
      </Document>
    );
  };

  const validateNote = (id: string, value: string) => {
    const numericValue = parseFloat(value);
    if (value.trim() === "" || (numericValue >= 0 && numericValue <= 20)) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "La valeur saisie doit être comprise entre 0 et 20!",
      }));
    }
  };

  const handleChange = (id: string, value: string) => {
    validateNote(id, value);
    handleInputChange(id, value);
  };

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
                      isPagination={true}
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
                            handleChange(
                              existingEtudiant.etudiant._id,
                              e.target.value
                            )
                          }
                        />
                        {errors[existingEtudiant.etudiant._id] && (
                          <div className="text-danger small mt-1">
                            {errors[existingEtudiant.etudiant._id]}
                          </div>
                        )}
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
                        handleChange(etudiants?._id!, e.target.value)
                      }
                    />
                    {errors[etudiants?._id!] && (
                      <div className="text-danger small mt-1">
                        {errors[etudiants?._id!]}
                      </div>
                    )}
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
                    <span className="fw-medium">{noteState?.type_examen!}</span>{" "}
                    de{" "}
                    <span className="fw-bold">
                      {noteState?.matiere?.matiere!}
                    </span>{" "}
                    pour{" "}
                    <span className="fw-bold">
                      {noteState?.groupe?.nom_classe_fr!}
                    </span>{" "}
                    en <span className="fw-medium">{noteState?.semestre!}</span>
                  </Col>
                </Row>
                {noteState?.etudiants!.map((etudiant: any) => (
                  <Row key={etudiant?.etudiant?._id!} className="mb-2">
                    <Col lg={2}>{etudiant?.etudiant?.num_CIN!}</Col>
                    <Col>
                      {etudiant?.etudiant?.prenom_fr!}{" "}
                      {etudiant?.etudiant?.nom_fr!}{" "}
                    </Col>
                    <Col>{etudiant?.note!}</Col>
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
