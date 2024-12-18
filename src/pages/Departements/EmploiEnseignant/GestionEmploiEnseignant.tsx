import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import { useGetSeancesByIdTeacherAndSemestreQuery } from "features/seance/seance";

import CustomLoader from "Common/CustomLoader/CustomLoader";
import "jspdf-autotable";
import "../Emploi/GestionEmploiClasse.css";
import {
  Document,
  Page,
  pdf,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import { useFetchTypeSeancesQuery } from "features/typeSeance/typeSeance";

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  header: {
    marginBottom: 20,
    //borderBottomWidth: 1,
    paddingBottom: 10,
    margin: 20,
  },

  headerColumn: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  periodicInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  leftColumn: {
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 10,
    textAlign: "left",
    marginBottom: 2,
  },

  timetable: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
  },
  dayCell: {
    width: 100,
    fontWeight: "bold",
  },
  sessionCell: {
    flex: 1,
    textAlign: "center",
  },
  emptyCell: {
    flex: 1,
    textAlign: "center",
    color: "#888",
  },

  periodicDateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 40,
  },
  periodicDate: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  courseLoadContainer: {
    width: 200,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "flex-end",
  },
  courseLoadRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  courseLoadHeader: {
    fontWeight: "bold",
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    paddingVertical: 2,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  courseLoadCell: {
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    paddingVertical: 2,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  footerRowTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  centerColumn: {
    alignItems: "center",
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  loadContainer: {
    width: 200,
    alignSelf: "flex-end",
  },

  footerText: {
    fontSize: 12,
    // textAlign: "center",
    marginBottom: 2,
    marginLeft: 85,
  },
  footerRightText: {
    fontSize: 12,
    // textAlign: "center",
    marginBottom: 2,
    marginLeft: 50,
  },

  enseignantFooterText: {
    fontSize: 12,
    // textAlign: "center",
    marginBottom: 2,
    marginLeft: 38,
  },
});

interface Session {
  heure_debut: string;
  heure_fin: string;
  matiere: {
    matiere: string;
  };
  salle: {
    salle: string;
  };
  classe: {
    nom_classe_fr: string;
  };
}

type GroupedSessions = {
  [day: string]: Session[];
};
interface TimetablePDFProps {
  days: string[];
  groupedSessions: GroupedSessions;
  maxSessions: number;
}

const SingleEmploiEnseignant = () => {
  document.title = " Gestion emploi enseignant | Application Smart Institute";

  const [canAddSession, setCanAddSession] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setAlertMessage] = useState("");
  const location = useLocation();
  const { enseignant, semestre } = location?.state! || {};
  //console.log("enseignant", enseignant);
  const { data: seances = [], isSuccess: sessionClassFetched } =
    useGetSeancesByIdTeacherAndSemestreQuery({
      enseignantId: enseignant?._id!,
      semestre: semestre,
    });

  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();

  const { data: typeSeances = [] } = useFetchTypeSeancesQuery();

  const typesFromSeances = useMemo(() => {
    if (
      !sessionClassFetched ||
      seances.length === 0 ||
      typeSeances.length === 0
    ) {
      return [];
    }

    const matchedTypes = seances.flatMap((seance: any) => {
      const typeMatiere = seance?.matiere?.type;

      if (!typeMatiere) return [];

      // Find matching typeSeances based on abbreviation
      const matches = typeSeances.filter(
        (typeSeance: any) => typeSeance.abreviation === typeMatiere
      );

      return matches;
    });
    return matchedTypes;
  }, [seances, typeSeances, sessionClassFetched]);

  const [cours, setCours] = useState("");
  const [tp, setTp] = useState("");
  const [td, setTd] = useState("");
  const [ci, setCi] = useState("");

  useEffect(() => {
    let tempCours = 0;
    let tempTp = 0;
    let tempTd = 0;
    let tempCi = 0;

    typesFromSeances.forEach((types: any) => {
      seances.forEach((seance: any) => {
        const heureDebut = new Date(`1970-01-01T${seance?.heure_debut}`);
        const heureFin = new Date(`1970-01-01T${seance?.heure_fin}`);
        const duration =
          (heureFin.getTime() - heureDebut.getTime()) / (60 * 1000); // minutes

        if (types?.abreviation === "C") {
          tempCours = 1.83 * (duration / 60);
        }
        if (types?.abreviation === "CI") {
          tempCi = 1.55 * (duration / 60);
        }
        if (types?.abreviation === "TP") {
          tempTp = 0.86 * (duration / 60);
        }
        if (types?.abreviation === "TD") {
          tempTd = 1 * (duration / 60);
        }
      });
    });

    // Update the state once after all calculations
    setCours(tempCours.toFixed(2));
    setTp(tempTp.toFixed(2));
    setTd(tempTd.toFixed(2));
    setCi(tempCi.toFixed(2));
  }, [typesFromSeances, seances]);

  const filteredSessions = seances?.filter(
    (session) => session?.semestre! === semestre
  );

  const timeSlotsDynamic: any = [];
  for (let i = 16; i < 38; i++) {
    const startHour = String(Math.floor(i / 2)).padStart(2, "0");
    const startMinutes = i % 2 === 0 ? "00" : "30";
    const endHour = String(Math.floor((i + 1) / 2)).padStart(2, "0");
    const endMinutes = (i + 1) % 2 === 0 ? "00" : "30";
    timeSlotsDynamic.push(
      `${startHour}:${startMinutes}-${endHour}:${endMinutes}`
    );
  }

  const sortSessions = (sessions: any[]) => {
    sessions.sort((a, b) => {
      const timeA = a.heure_debut.split(":").map(Number);
      const timeB = b.heure_debut.split(":").map(Number);
      const hoursDifference = timeA[0] - timeB[0];
      const minutesDifference = timeA[1] - timeB[1];

      return hoursDifference !== 0 ? hoursDifference : minutesDifference;
    });

    return sessions;
  };

  const groupSessionsByDay = (sessions: any) => {
    const grouped: any = {};

    // Group sessions by day
    sessions.forEach((session: any) => {
      const { jour, heure_debut, heure_fin, matiere, salle, classe } = session;

      // Ensure each day exists as a key
      if (!grouped[jour]) {
        grouped[jour] = [];
      }

      grouped[jour].push({
        heure_debut,
        heure_fin,
        matiere,
        salle,
        classe,
      });
    });

    // Sort sessions by time for each day
    Object.keys(grouped).forEach((day) => {
      grouped[day] = sortSessions(grouped[day]);
    });

    return grouped;
  };

  const groupedSessions = groupSessionsByDay(filteredSessions) || {};
  // console.log("groupedSessions", groupedSessions);
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const maxSessions = Math.max(
    ...days.map((day) =>
      groupedSessions[day] ? groupedSessions[day].length : 0
    )
  );

  const closeAlert = () => {
    setShowAlert(false);
  };
  const courseLoad = {
    c: Number(cours),
    ci: Number(ci),
    tp: Number(tp),
    td: Number(td),
    total: Number(cours) + Number(ci) + Number(tp) + Number(td),
  };
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // January = 0, December = 11

  // Determine academic year based on September as the starting month
  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1; // August is 8
  const endYear = startYear + 1;

  const TimetablePDF: React.FC<TimetablePDFProps> = ({
    days,
    groupedSessions,
    maxSessions,
    // enseignant,
  }) => (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Top Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerColumn}>
              <Text style={styles.headerText}>
                {variableGlobales[2].universite_fr}
              </Text>
              <Text style={styles.headerText}>
                {variableGlobales[2].etablissement_fr}
              </Text>
            </View>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                Emploi de temps pour enseignant
              </Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.headerText}>
                A.U: {startYear}/{endYear}
              </Text>
              <Text style={styles.headerText}>Semestre: {semestre}</Text>
            </View>
          </View>

          {/* Middle Row */}

          {/* Bottom Row */}
          <View style={styles.headerRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.headerText}>
                Nom et Prénom:{" "}
                <Text style={{ fontWeight: "bold", fontSize: "12" }}>
                  {enseignant.nom_fr} {enseignant.prenom_fr}
                </Text>
              </Text>
              <Text style={styles.headerText}>
                Grade:{" "}
                <Text style={{ fontWeight: "bold", fontSize: "12" }}>
                  {enseignant?.grade?.grade_fr}
                </Text>
              </Text>
            </View>
            {/* Left: Periodic Date Section */}
            <View style={styles.periodicDateContainer}>
              <Text style={styles.periodicDate}>
                Période: 09-09-2024 / 09-10-2024
              </Text>
            </View>

            {/* Right: Course Load Table */}
            <View style={styles.courseLoadContainer}>
              <View style={styles.courseLoadRow}>
                <Text style={styles.courseLoadHeader}>C</Text>
                <Text style={styles.courseLoadHeader}>CI</Text>
                <Text style={styles.courseLoadHeader}>TP</Text>
                <Text style={styles.courseLoadHeader}>TD</Text>
                <Text style={styles.courseLoadHeader}>TOTAL</Text>
              </View>
              <View style={styles.courseLoadRow}>
                <Text style={styles.courseLoadCell}>{courseLoad.c || "0"}</Text>
                <Text style={styles.courseLoadCell}>
                  {courseLoad.ci || "0"}
                </Text>
                <Text style={styles.courseLoadCell}>
                  {courseLoad.tp || "0"}
                </Text>
                <Text style={styles.courseLoadCell}>
                  {courseLoad.td || "0"}
                </Text>
                <Text style={styles.courseLoadCell}>
                  {courseLoad.total || "0"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timetable Section */}
        <View style={styles.timetable}>
          {days.map((day) => (
            <View style={styles.row} key={day}>
              {/* Day Column */}
              <Text style={[styles.cell, styles.dayCell]}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>

              {/* Sessions or "No Sessions" */}
              {groupedSessions[day]?.length > 0 ? (
                groupedSessions[day].map((session, index) => (
                  <Text style={[styles.cell, styles.sessionCell]} key={index}>
                    {session.heure_debut || "N/A"} -{" "}
                    {session.heure_fin || "N/A"}
                    {"\n"}
                    {session.matiere?.matiere || "No Subject"} {"\n"}
                    {session.salle?.salle || "No Room"} {"\n"}
                    {session.classe?.nom_classe_fr || "No Class"}
                  </Text>
                ))
              ) : (
                <Text style={[styles.cell, styles.emptyCell]}>
                  Pas de séances
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.footerText}>Chef de département</Text>
          </View>
          {/* Left: Periodic Date Section */}
          <View style={styles.periodicDateContainer}>
            <Text style={styles.enseignantFooterText}>Enseignant</Text>
          </View>

          {/* Right: Course Load Table */}
          <View style={styles.loadContainer}>
            <View style={styles.footerRightText}>
              <Text>Secrétaire Générale</Text>
            </View>
          </View>
        </View>
        <View style={styles.footerRowTitle}>
          <View style={styles.leftColumn}>
            <Text style={styles.footerText}>
              {enseignant.departements.nom_chef_dep}
            </Text>
          </View>
          {/* Left: Periodic Date Section */}
          <View style={styles.periodicDateContainer}>
            <Text style={styles.footerText}>
              <Text>
                {enseignant.nom_fr} {enseignant.prenom_fr}
              </Text>
            </Text>
          </View>

          {/* Right: Course Load Table */}
          <View style={styles.loadContainer}>
            <View style={styles.footerRightText}>
              <Text>{variableGlobales[2].secretaire_fr}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const handlePrintPDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (Object.keys(groupedSessions).length === 0) {
        throw new Error("No sessions found to generate PDF.");
      }

      const pdfInstance = pdf(
        <TimetablePDF
          days={days}
          groupedSessions={groupedSessions}
          maxSessions={maxSessions}
        />
      );
      const pdfBlob = await pdfInstance.toBlob();

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "emploiTempsEnseignant.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
      setShowAlert(true);
      setAlertMessage("Failed to generate PDF. Please try again.");
    }
  };

  // console.log(
  //   <TimetablePDF
  //     days={days}
  //     groupedSessions={groupedSessions}
  //     maxSessions={maxSessions}
  //   />
  // );

  return (
    <React.Fragment>
      <div className="page-content">
        {showAlert == true ? (
          <div
            className="alert alert-warning alert-dismissible alert-label-icon rounded-label fade show"
            role="alert"
          >
            <i className="ri-alert-line label-icon"></i>
            {showAlertMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => {
                closeAlert();
              }}
            ></button>
          </div>
        ) : (
          <></>
        )}

        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form className="tablelist-form">
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>
                <input type="hidden" id="id-field" />
                <Row className=" fw-bold titre-emploi">
                  <h2 className="text-center">
                    Emploi de Temps - {enseignant.prenom_fr} {enseignant.nom_fr}{" "}
                    - Semestre {semestre}
                  </h2>
                </Row>
                {canAddSession === false ? (
                  sessionClassFetched == true ? (
                    <Row>
                      <Col lg={12} className="d-flex align-items-center">
                        <div style={{ overflowX: "auto", width: "100%" }}>
                          <table className="table table-bordered table-striped w-100">
                            <tbody>
                              {days.map((day) => (
                                <tr key={day}>
                                  <td className="py-3 px-4 fw-bold text-center bg-light">
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                  </td>
                                  {groupedSessions[day]?.length > 0 ? (
                                    <>
                                      {groupedSessions[day]?.map(
                                        (session: any, index: any) => (
                                          <td
                                            key={index}
                                            className="py-3 px-4 text-center"
                                          >
                                            <div className="fw-bold">
                                              {session?.heure_debut!} -{" "}
                                              {session?.heure_fin!}
                                            </div>
                                            <div>
                                              {session?.matiere?.matiere!}
                                            </div>
                                            <div>{session?.salle?.salle!}</div>
                                            <div>
                                              {session?.classe?.nom_classe_fr!}{" "}
                                            </div>
                                          </td>
                                        )
                                      )}
                                      {[
                                        ...Array(
                                          maxSessions -
                                            groupedSessions[day]?.length
                                        ),
                                      ].map((_, idx) => (
                                        <td
                                          key={`empty-${idx}`}
                                          className="py-3 px-4 text-center"
                                        ></td>
                                      ))}
                                    </>
                                  ) : (
                                    <td
                                      colSpan={maxSessions}
                                      className="py-3 px-4 text-center"
                                    >
                                      <em className="text-muted">
                                        Pas de séances
                                      </em>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <CustomLoader
                      text={"Chargement d'Emploi En Cours ..."}
                    ></CustomLoader>
                  )
                ) : (
                  <Row></Row>
                )}

                <div className="modal-footer">
                  {" "}
                  <Button variant="dark" onClick={handlePrintPDF}>
                    Print/Download PDF
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SingleEmploiEnseignant;