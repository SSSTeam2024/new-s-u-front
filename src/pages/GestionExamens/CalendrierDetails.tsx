import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useFetchSallesQuery } from "features/salles/salles";
import { useFetchExamensQuery } from "features/examens/examenSlice";
import {
  pdf,
  StyleSheet,
  Document,
  Page,
  View,
  Text,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 10 },
  text: { fontSize: 14 },
});

const CalendrierDetails: React.FC = () => {
  document.title = "Détails du Calendrier | ENIGA";

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllSalles = [] } = useFetchSallesQuery();
  const { data: AllExamens = [] } = useFetchExamensQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const location = useLocation();
  const calendrierState = location.state;
  console.log("calendrierState", calendrierState);

  const [days, setDays] = useState<
    { date: string; day: string; epreuve: any[] }[]
  >([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [selectedJour, setSelectedJour] = useState(null);
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);

  // useEffect(() => {
  //   if (
  //     calendrierState?.period &&
  //     (selectedClasse || selectedJour || selectedSalle || selectedTeacher)
  //   ) {
  //     const [start, end] = calendrierState?.period
  //       ?.split(" / ")
  //       .map((d: string) => {
  //         const [day, month, year] = d.split("-");
  //         return new Date(`${year}-${month}-${day}`);
  //       });

  //     const generateDays = (start: Date, end: Date) => {
  //       const result: { date: string; day: string; epreuve: any[] }[] = [];
  //       let current = new Date(start);
  //       while (current <= end) {
  //         if (current.getDay() !== 0) {
  //           const formattedDate = current.toISOString().split("T")[0];
  //           const dayName = current.toLocaleDateString("fr-FR", {
  //             weekday: "long",
  //           });
  //           const parseDate = (date: string) => {
  //             const parts = date.split("-");
  //             if (parts.length === 3) {
  //               return `${parts[2]}-${parts[1]}-${parts[0]}`;
  //             }
  //             return date;
  //           };

  //           const epreuves = calendrierState.epreuve.filter((exam: any) => {
  //             if (!exam.date || isNaN(new Date(exam.date).getTime())) {
  //               return false;
  //             }
  //             const sanitizedDate = exam.date.includes("-")
  //               ? parseDate(exam.date)
  //               : exam.date;

  //             const examDate = new Date(sanitizedDate)
  //               .toISOString()
  //               .split("T")[0];

  //             return (
  //               examDate === formattedDate &&
  //               (!selectedClasse || exam.classe?._id === selectedClasse) &&
  //               (!selectedSalle || exam.salle?._id === selectedSalle) &&
  //               (!selectedTeacher ||
  //                 exam.group_surveillants.some(
  //                   (teacher: any) => teacher._id === selectedTeacher
  //                 ))
  //             );
  //           });

  //           result.push({
  //             date: formattedDate,
  //             day: dayName,
  //             epreuve: epreuves,
  //           });
  //         }
  //         current.setDate(current.getDate() + 1);
  //       }
  //       return result;
  //     };

  //     const allDays = generateDays(start, end);
  //     setDays(allDays);
  //   } else {
  //     setDays([]);
  //   }
  // }, [
  //   calendrierState,
  //   AllExamens,
  //   selectedClasse,
  //   selectedJour,
  //   selectedSalle,
  //   selectedTeacher,
  // ]);
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
            const formattedDate = current.toISOString().split("T")[0];
            const dayName = current.toLocaleDateString("fr-FR", {
              weekday: "long",
            });

            const parseDate = (date: string) => {
              const parts = date.split("-");
              if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
              }
              return date;
            };

            const epreuves = calendrierState.epreuve.filter((exam: any) => {
              if (!exam.date || isNaN(new Date(exam.date).getTime())) {
                return false;
              }
              const sanitizedDate = exam.date.includes("-")
                ? parseDate(exam.date)
                : exam.date;

              const examDate = new Date(sanitizedDate)
                .toISOString()
                .split("T")[0];

              return (
                examDate === formattedDate &&
                (!selectedClasse || exam.classe?._id === selectedClasse) &&
                (!selectedSalle || exam.salle?._id === selectedSalle) &&
                (!selectedTeacher ||
                  exam.group_surveillants.some(
                    (teacher: any) => teacher._id === selectedTeacher
                  ))
              );
            });

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
      setDays(allDays); // Populate days immediately when the component loads
    }
  }, [calendrierState]);

  // const filteredDays = days.filter(({ day }) =>
  //   selectedJour ? day === selectedJour : true
  // );
  const applyFilters = () => {
    return days.filter(({ day, epreuve }) => {
      return (
        (!selectedJour || day === selectedJour) &&
        (!selectedClasse ||
          epreuve.some((exam: any) => exam.classe?._id === selectedClasse)) &&
        (!selectedSalle ||
          epreuve.some((exam: any) => exam.salle?._id === selectedSalle)) &&
        (!selectedTeacher ||
          epreuve.some((exam: any) =>
            exam.group_surveillants.some(
              (teacher: any) => teacher._id === selectedTeacher
            )
          ))
      );
    });
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
        {exams.map((exam, idx) => (
          <Text key={idx} style={styles.text}>
            - {exam.day.charAt(0).toUpperCase() + exam.day.slice(1)} {exam.date}
            {/* : {exam.epreuve.map((e: any) => e.nom).join(", ")} */}
          </Text>
        ))}
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
  const selectedTeacherName = AllEnseignants.find(
    (t) => t._id === selectedTeacher
  )?.prenom_fr;

  const handleFilterChange = (filter: any, value: any) => {
    console.log("Filter change:", { filter, value });
    if (filter === "classe") setSelectedClasse(value);
    if (filter === "jour") setSelectedJour(value);
    if (filter === "salle") setSelectedSalle(value);
    if (filter === "teacher") setSelectedTeacher(value);
    setActiveFilter(filter);
    setFilterApplied(true); // Mark that a filter is applied
  };

  const resetFilters = () => {
    console.log("Resetting all filters");
    setSelectedClasse(null);
    setSelectedJour(null);
    setSelectedSalle(null);
    setSelectedTeacher(null);
    setActiveFilter(null);
    setFilterApplied(false); // Reset filter state
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
              onClick={() => console.log("Printing Classe")}
            >
              <i className="bi bi-printer-fill"></i>
            </Button>
            <select
              className="form-select"
              value={selectedClasse || ""}
              disabled={!!activeFilter && activeFilter !== "classe"}
              onChange={(e) => handleFilterChange("classe", e.target.value)}
            >
              <option value="">Choisir...</option>
              {AllClasses.map((classe) => (
                <option key={classe._id} value={classe._id}>
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
              onClick={() => console.log("Printing Salle")}
            >
              <i className="bi bi-printer-fill"></i>
            </Button>
            <select
              className="form-select"
              value={selectedSalle || ""}
              disabled={!!activeFilter && activeFilter !== "salle"}
              onChange={(e) => handleFilterChange("salle", e.target.value)}
            >
              <option value="">Choisir...</option>
              {AllSalles.map((salle) => (
                <option key={salle._id} value={salle._id}>
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
              onClick={() => console.log("Printing Jour")}
            >
              <i className="bi bi-printer-fill"></i>
            </Button>
            <select
              className="form-select"
              value={selectedJour || ""}
              disabled={!!activeFilter && activeFilter !== "jour"}
              onChange={(e) => handleFilterChange("jour", e.target.value)}
            >
              <option value="">Choisir...</option>
              {days.map(({ day }, idx) => (
                <option key={idx} value={day}>
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
            >
              <i className="bi bi-printer-fill"></i>
            </Button>
            <select
              className="form-select"
              value={selectedTeacher || ""}
              disabled={!!activeFilter && activeFilter !== "teacher"}
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
                    teacherName={selectedTeacherName!}
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

          <Col lg={2}>
            <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
          </Col>
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
                      Sélectionner des filtres pour afficher les jours...
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
