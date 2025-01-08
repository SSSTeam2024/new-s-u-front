import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useFetchSallesQuery } from "features/salles/salles";
import {
  StyleSheet,
  Document,
  Page,
  View,
  Text,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 20 },
  text: { fontSize: 14, marginBottom: 15 },
  listItem: { fontSize: 14, marginLeft: 20, marginBottom: 5 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  leftAlign: { fontSize: 14 },
  rightAlign: { fontSize: 14 },
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
    textAlign: "center",
    fontSize: 10,
  },
  dayCell: {
    width: 100,
    fontWeight: "bold",
  },
  classeCell: {
    width: 100,
    fontWeight: "bold",
  },
  salleCell: {
    width: 80,
  },
  matiereCell: {
    flex: 1,
  },
  timeCell: {
    width: 120,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

interface Props {
  title: string;
  filteredDays: {
    date: string;
    day: string;
    epreuve: any[];
  }[];
  filterBy: "jour" | "classe" | "salle" | null;
  filterValue?: string | null;
}

const CalendrierDetails: React.FC = () => {
  document.title = "Détails du Calendrier | ENIGA";

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllSalles = [] } = useFetchSallesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();
  console.log("variableGlobales", variableGlobales);

  const location = useLocation();
  const calendrierState = location.state;
  console.log("calendrierState", calendrierState);

  const [days, setDays] = useState<
    { date: string; day: string; epreuve: any[] }[]
  >([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [selectedJour, setSelectedJour] = useState("");
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    if (calendrierState?.period) {
      const [start, end] = calendrierState?.period
        .split(" / ")
        .map((d: string) => {
          const [day, month, year] = d.split("-");
          return new Date(`${year}-${month}-${day}`);
        });

      const generateDays = (start: Date, end: Date) => {
        const result: { date: string; day: string; epreuve: any[] }[] = [];
        let current = new Date(start);

        while (current <= end) {
          if (current.getDay() !== 0) {
            // Skip Sundays
            const formattedDate = current.toISOString().split("T")[0]; // yyyy-mm-dd
            const dayName = current.toLocaleDateString("fr-FR", {
              weekday: "long",
            });

            const epreuves = calendrierState.epreuve.filter((exam: any) => {
              if (!exam.date || isNaN(new Date(exam.date).getTime())) {
                return false;
              }

              // Directly compare the yyyy-mm-dd format
              const examDate = new Date(exam.date).toISOString().split("T")[0];

              return (
                examDate === formattedDate &&
                (!selectedClasse ||
                  exam.classe?.nom_classe_fr === selectedClasse) &&
                (!selectedSalle || exam.salle?.salle! === selectedSalle) &&
                (!selectedTeacher ||
                  exam.group_surveillants.some(
                    (teacher: any) => teacher._id === selectedTeacher
                  ))
              );
            });

            // Push the day with only relevant exams
            result.push({
              date: formattedDate,
              day: dayName,
              epreuve: epreuves,
            });
          }
          current.setDate(current.getDate() + 1);
        }
        return result;
      };

      const allDays = generateDays(start, end);
      setDays(allDays);
    }
  }, [calendrierState, selectedClasse, selectedSalle, selectedTeacher]);

  const applyFilters = () => {
    return days
      .filter(({ day }) => !selectedJour || day === selectedJour.split(" ")[0])
      .map(({ date, day, epreuve }) => ({
        date,
        day,
        epreuve: epreuve.filter(
          (exam: any) =>
            (!selectedSalle || exam.salle?.salle! === selectedSalle) &&
            (!selectedClasse ||
              exam.classe?.nom_classe_fr === selectedClasse) &&
            (!selectedTeacher ||
              exam.group_surveillants.some(
                (teacher: any) => teacher._id === selectedTeacher
              ))
        ),
      }))
      .filter(({ epreuve }) => epreuve.length > 0);
  };

  const filteredDays = applyFilters();

  const ConvocationPDF = ({
    teacherName,
    exams,
  }: {
    teacherName: string;
    exams: any[];
  }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Convocation</Text>
        <Text style={styles.text}>Cher(e) {teacherName},</Text>
        <Text style={styles.text}>
          Vous êtes convoqué(e) pour surveiller les examens selon le planning
          suivant :
        </Text>
        <View style={styles.section}>
          {exams.map((exam, idx) => (
            <Text key={idx} style={styles.listItem}>
              - {exam.day.charAt(0).toUpperCase() + exam.day.slice(1)}{" "}
              {exam.date}
            </Text>
          ))}
        </View>
        <Text style={styles.text}>
          Nous comptons sur votre présence et votre ponctualité pour assurer le
          bon déroulement des épreuves.
        </Text>
        <View style={styles.footer}>
          <Text style={styles.leftAlign}>
            Signature l'équipe administrative
          </Text>
          <Text style={styles.rightAlign}>Signature l'enseignant</Text>
        </View>
      </Page>
    </Document>
  );

  const filteredExamsForTeacher = days
    .filter(({ epreuve }) =>
      epreuve.some((exam: any) =>
        exam.group_surveillants.some(
          (teacher: any) => teacher._id === selectedTeacher
        )
      )
    )
    .map(({ date, day, epreuve }) => ({
      date,
      day,
      epreuve: epreuve.filter((exam: any) =>
        exam.group_surveillants.some(
          (teacher: any) => teacher._id === selectedTeacher
        )
      ),
    }));

  const selectedTeacherDetails = AllEnseignants.find(
    (t) => t._id === selectedTeacher
  );

  const selectedTeacherPrenom = selectedTeacherDetails?.prenom_fr || "";
  const selectedTeacherNom = selectedTeacherDetails?.nom_fr || "";

  const teacherName = `${selectedTeacherPrenom} ${selectedTeacherNom}`;

  const handleFilterChange = (filter: any, value: any) => {
    resetFilters();

    if (filter === "classe") setSelectedClasse(value);
    if (filter === "jour") setSelectedJour(value);
    if (filter === "salle") setSelectedSalle(value);
    if (filter === "teacher") setSelectedTeacher(value);

    setActiveFilter(filter);
    setFilterApplied(true);
  };

  const resetFilters = () => {
    setSelectedClasse(null);
    setSelectedJour("");
    setSelectedSalle(null);
    setSelectedTeacher(null);
    setActiveFilter(null);
    setFilterApplied(false);
  };

  // Helper to group rows by day and calculate rowspan
  const groupByDay = (
    filteredDays: { date: string; day: string; epreuve: any[] }[]
  ) => {
    return filteredDays.flatMap(({ date, day, epreuve }) =>
      epreuve.map((exam, index) => ({
        date,
        day,
        salle: exam.salle.salle,
        classe: exam.classe.nom_classe_fr,
        heure_debut: exam.heure_debut,
        heure_fin: exam.heure_fin,
        matiere: exam.matiere.matiere,
        showDay: index === 0,
        rowspan: epreuve.length,
      }))
    );
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  const CalendarPDF = ({
    title,
    filteredDays,
    filterBy,
    filterValue = "",
  }: Props) => {
    const rows = groupByDay(filteredDays);

    return (
      <Document>
        <Page orientation="landscape" style={stylesCalenderFilter.page}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            {/* Left Section */}
            <View style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}>
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

            {/* Center Section (Title with Subtitle) */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>{title}</Text>
              {filterValue && (
                <Text style={{ fontSize: 12, marginTop: 5 }}>
                  {filterValue}
                </Text>
              )}
            </View>

            {/* Right Section */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10 }}>
                A.U: {startYear}/{endYear}
              </Text>
              <Text style={{ fontSize: 10 }}>
                Semestre: {calendrierState?.semestre!}
              </Text>
              <Text style={{ fontSize: 10 }}>
                Période: {calendrierState?.period!}
              </Text>
            </View>
          </View>

          {/* Timetable */}
          <View style={stylesCalenderFilter.timetable}>
            {/* Header Row */}
            <View
              style={[stylesCalenderFilter.row, stylesCalenderFilter.headerRow]}
            >
              {filterBy && filterBy === "jour" ? (
                ""
              ) : (
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.dayCell,
                  ]}
                >
                  Jour
                </Text>
              )}
              {filterBy !== "classe" && (
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.classeCell,
                  ]}
                >
                  Classe
                </Text>
              )}
              {filterBy !== "salle" && (
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.salleCell,
                  ]}
                >
                  Salle
                </Text>
              )}
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.matiereCell,
                ]}
              >
                Matière
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.timeCell,
                ]}
              >
                Horaire
              </Text>
            </View>

            {/* Data Rows */}
            {rows.map((row, idx) => (
              <View key={idx} style={stylesCalenderFilter.row}>
                {/* Conditionally render the Day column */}
                {filterBy !== "jour" && (
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.dayCell,
                      idx > 0 && row.day === rows[idx - 1].day
                        ? { borderWidth: 0 }
                        : {},
                    ]}
                  >
                    {idx === 0 || row.day !== rows[idx - 1].day
                      ? `${
                          row.day.charAt(0).toUpperCase() + row.day.slice(1)
                        } - ${row.date}`
                      : ""}
                  </Text>
                )}
                {filterBy !== "classe" && (
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.classeCell,
                    ]}
                  >
                    {row.classe}
                  </Text>
                )}

                {filterBy !== "salle" && (
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.salleCell,
                    ]}
                  >
                    {row.salle}
                  </Text>
                )}

                {/* Matière */}
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.matiereCell,
                  ]}
                >
                  {row.matiere}
                </Text>

                {/* Horaire */}
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.timeCell,
                  ]}
                >
                  {row.heure_debut} - {row.heure_fin}
                </Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Card>
          <Card.Body>
            <Row>
              <Col lg={3}>
                <h5>A.U: {calendrierState?.annee_universitaire}</h5>
              </Col>
              <Col>
                <h4 className="text-center">
                  Calendrier des {calendrierState?.type_examen}{" "}
                  {calendrierState?.semestre}
                </h4>
                <h5 className="text-muted text-center">
                  Période: {calendrierState?.period}
                </h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row className="mb-3 align-items-center">
          <Col lg={2} className="d-flex align-items-center">
            <Form.Label className="me-2">Classe:</Form.Label>
            <Button
              variant="link"
              className="me-2 p-0"
              style={{ cursor: "pointer" }}
            >
              {/* <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens - Classe ${selectedClasse}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Classe.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink> */}
              <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens`}
                    filterValue={`Classe ${selectedClasse}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Classe.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink>
            </Button>

            <select
              className="form-select"
              value={selectedClasse || ""}
              onChange={(e) => handleFilterChange("classe", e.target.value)}
            >
              <option value="">Choisir...</option>
              {AllClasses.map((classe) => (
                <option key={classe._id} value={classe.nom_classe_fr}>
                  {classe.nom_classe_fr}
                </option>
              ))}
            </select>
          </Col>

          <Col lg={2} className="d-flex align-items-center">
            <Form.Label className="me-2">Salle:</Form.Label>
            <Button
              variant="link"
              className="me-2 p-0"
              style={{ cursor: "pointer" }}
            >
              {/* <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens - Salle ${selectedSalle}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Salle.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink> */}
              <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens`}
                    filterValue={`Salle ${selectedSalle}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Salle.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink>
            </Button>

            <select
              className="form-select"
              value={selectedSalle || ""}
              onChange={(e) => handleFilterChange("salle", e.target.value)}
            >
              <option value="">Choisir...</option>
              {AllSalles.map((salle) => (
                <option key={salle._id} value={salle.salle}>
                  {salle.salle}
                </option>
              ))}
            </select>
          </Col>

          <Col lg={2} className="d-flex align-items-center">
            <Form.Label className="me-2">Jour:</Form.Label>
            <Button
              variant="link"
              className="me-2 p-0"
              style={{ cursor: "pointer" }}
            >
              {/* <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens - ${selectedJour}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Jour.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink> */}
              <PDFDownloadLink
                document={
                  <CalendarPDF
                    title={`Calendrier des Examens`}
                    filterValue={`${selectedJour}`}
                    filteredDays={filteredDays}
                    filterBy={activeFilter}
                  />
                }
                fileName={`Calendrier_Jour.pdf`}
                className="text-decoration-none"
              >
                <i className="bi bi-printer-fill"></i>
              </PDFDownloadLink>
            </Button>

            <select
              className="form-select"
              value={selectedJour || ""}
              onChange={(e) => handleFilterChange("jour", e.target.value)}
            >
              <option value="">Choisir...</option>
              {days.map(({ day, date }, idx) => (
                <option key={idx} value={`${day} ${date}`}>
                  {day}
                </option>
              ))}
            </select>
          </Col>

          <Col lg={2} className="d-flex align-items-center">
            <Form.Label className="me-2">Enseignant Surveillants:</Form.Label>
            <Button
              variant="link"
              className="me-2 p-0"
              style={{ cursor: "pointer" }}
              onClick={() => console.log("Printing Enseignant")}
            ></Button>
            <select
              className="form-select"
              value={selectedTeacher || ""}
              onChange={(e) => handleFilterChange("teacher", e.target.value)}
            >
              <option value="">Choisir...</option>
              {AllEnseignants.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.prenom_fr} {teacher.nom_fr}
                </option>
              ))}
            </select>
          </Col>
          {selectedTeacher && (
            <Col lg={2}>
              <PDFDownloadLink
                document={
                  <ConvocationPDF
                    teacherName={teacherName!}
                    exams={filteredExamsForTeacher}
                  />
                }
                fileName="convocation.pdf"
                className="btn btn-secondary     "
              >
                Télécharger Convocation
              </PDFDownloadLink>
            </Col>
          )}
        </Row>

        <Row>
          <table className="table table-bordered table-striped w-100">
            <tbody>
              {filterApplied && filteredDays.length > 0 ? (
                filteredDays.map(({ date, day, epreuve }) => (
                  <tr key={date}>
                    <td className="py-3 px-4 fw-bold text-center bg-light">
                      {day.charAt(0).toUpperCase() + day.slice(1)} {date}
                    </td>
                    {selectedClasse ? (
                      <>
                        {epreuve.length === 0 ? (
                          <td className="py-3 px-4 text-center">
                            <em className="text-muted">Pas d'examens</em>
                          </td>
                        ) : (
                          epreuve.map((exam, idx) => (
                            <td key={idx} className="py-3 px-4 text-center">
                              <strong>
                                {exam.matiere?.matiere || "Inconnu"}
                              </strong>
                              <br />
                              {`${exam.heure_debut} - ${exam.heure_fin}`}
                              <br />
                              {exam.salle?.salle || "Non attribuée"}
                              <br />
                              {exam.classe?.nom_classe_fr || "Non attribuée"}
                            </td>
                          ))
                        )}
                      </>
                    ) : (
                      <td className="py-3 px-4 text-center">
                        {epreuve.length === 0 ? (
                          <em className="text-muted">Pas d'examens</em>
                        ) : (
                          <ul className="list-unstyled">
                            {epreuve.map((exam: any, idx: number) => (
                              <li key={idx}>
                                <strong>
                                  {exam.matiere?.matiere || "Inconnu"}
                                </strong>
                                <br />
                                {`${exam.heure_debut} - ${exam.heure_fin}`}
                                <br />
                                {`${exam.salle?.salle || "Non attribuée"}`}
                                <br />
                                {`${
                                  exam.classe?.nom_classe_fr || "Non attribuée"
                                }`}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : filterApplied ? (
                <tr>
                  <td className="text-center py-3 px-4" colSpan={2}>
                    <em className="text-muted">
                      Aucun jour disponible avec les filtres appliqués.
                    </em>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="text-center py-3 px-4" colSpan={2}>
                    <em className="text-muted">
                      Sélectionnez des filtres pour afficher les jours...
                    </em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Row>
      </Container>
    </div>
  );
};

export default CalendrierDetails;
