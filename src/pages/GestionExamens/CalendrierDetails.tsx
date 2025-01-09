import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  Modal,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
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
import { useModifierExamenEpreuveMutation } from "features/examens/examenSlice";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";

const predefinedColors = [
  "#d3d3d3", // light gray
  "#a9a9a9", // dark gray
  "#808080", // gray
  "#ffcccb", // light pink
  "#90ee90", // light green
  "#add8e6", // light blue
  "#ffffe0", // light yellow
  "#dda0dd", // plum
  "#f0e68c", // khaki
  "#ffb6c1", // light coral
];

const styleGlobalCalendar = StyleSheet.create({
  page: { padding: 24 },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  secondTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  thirdTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 10,
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

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
  const [modifierExamenEpreuve] = useModifierExamenEpreuveMutation();

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
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedEpreuve, setSelectedEpreuve] = useState<any>(null);

  const tog_ViewModal = (ep?: any) => {
    setSelectedEpreuve(ep || null);
    setOpenViewModal(!openViewModal);
  };

  const tog_EditModal = (epreuveId?: string) => {
    if (epreuveId) {
      setCalendarEpreuve((prevState) => ({
        ...prevState,
        epreuveId,
      }));
    }
    setOpenEditModal(!openEditModal);
  };

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
            {/* {rows.map((row, idx) => (
              <View key={idx} style={stylesCalenderFilter.row}>
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
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.matiereCell,
                  ]}
                >
                  {row.matiere}
                </Text>

                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.timeCell,
                  ]}
                >
                  {row.heure_debut} - {row.heure_fin}
                </Text>
              </View>
            ))} */}

            {rows.map((row, idx) => (
              <View key={idx} style={stylesCalenderFilter.row}>
                {/* Render the Day column only if it's the first row for that day */}
                {filterBy !== "jour" && (
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.dayCell,
                      idx === 0 || row.day !== rows[idx - 1].day
                        ? {}
                        : { display: "none" }, // Hide the cell for subsequent rows with the same day
                    ]}
                  >
                    {idx === 0 || row.day !== rows[idx - 1].day
                      ? `${
                          row.day.charAt(0).toUpperCase() + row.day.slice(1)
                        } - ${row.date}`
                      : ""}
                  </Text>
                )}

                {/* Salle */}
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

  const dateColorMap = useMemo(() => {
    const uniqueDates = Array.from(
      new Set<string>(calendrierState.epreuve.map((ep: any) => ep.date))
    );

    const map = new Map<string, string>();

    uniqueDates.forEach((date, index) => {
      map.set(date, predefinedColors[index % predefinedColors.length]);
    });

    return map;
  }, [calendrierState.epreuve]);

  const getBackgroundColor = (date: string) => {
    return dateColorMap.get(date) || "#ffffff";
  };

  const [status, setStatus] = useState("Faite"); // Default value is "Faite"

  const handleToggle = () => {
    setStatus((prevStatus) =>
      prevStatus === "Faite" ? "Non Terminé" : "Faite"
    );
  };

  const initialCalendarEpreuve = {
    id_Calendrier: "",
    epreuveId: "",
    epreuve_status: "",
    nbre_present: "",
    nbre_absent: "",
    nbre_exclus: "",
    notes: "",
  };
  const [calendarEpreuve, setCalendarEpreuve] = useState(
    initialCalendarEpreuve
  );
  const {
    id_Calendrier,
    epreuveId,
    epreuve_status,
    nbre_present,
    nbre_absent,
    nbre_exclus,
    notes,
  } = calendarEpreuve;

  const onChangeCalendarEpreuve = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCalendarEpreuve((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitCalendarEpreuve = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      calendarEpreuve["id_Calendrier"] = calendrierState?._id!;
      calendarEpreuve["epreuve_status"] = status;
      modifierExamenEpreuve(calendarEpreuve)
        .then(() => setCalendarEpreuve(initialCalendarEpreuve))
        // .then(() => notifyHourBand())
        .then(() => tog_EditModal());
    } catch (error) {
      alert(error);
    }
  };
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();

  const GlobalCalendar = () => {
    const [start, end] = calendrierState.period.split(" / ");

    const [startDay, startMonth, startYear] = start.split("-");
    const monthName = new Date(
      Number(startYear),
      Number(startMonth) - 1
    ).toLocaleString("fr-FR", {
      month: "long",
    });

    const [endDay] = end.split("-");

    return (
      <Document>
        <Page orientation="landscape" style={styleGlobalCalendar.page}>
          {/* Header */}
          <Text style={styleGlobalCalendar.title}>
            Session des {calendrierState.type_examen} {calendrierState.session}
          </Text>
          <Text style={styleGlobalCalendar.secondTitle}>
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {startYear}
          </Text>
          <Text style={styleGlobalCalendar.thirdTitle}>
            {startDay} - {endDay}
          </Text>

          {/* Table */}
          <View style={styleGlobalCalendar.table}>
            {/* Table Header */}
            <View style={styleGlobalCalendar.tableRow}>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Date
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                H. Début
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                H. Fin
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Durée
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Groupe
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Epreuve
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Salle
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Responsable(s)
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Surveillant(s)
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                N° Copie
              </Text>
            </View>
            {/* Table Body */}
            {calendrierState.epreuve.map((ep: any, index: any) => {
              const startTime = new Date(`1970-01-01T${ep.heure_debut}`);
              const endTime = new Date(`1970-01-01T${ep.heure_fin}`);
              const durationMs = endTime.getTime() - startTime.getTime();

              const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
              const durationMinutes = Math.floor(
                (durationMs % (1000 * 60 * 60)) / (1000 * 60)
              );

              const formattedDuration = `${durationHours}h ${durationMinutes}m`;
              return (
                <View style={styleGlobalCalendar.tableRow} key={index}>
                  <Text style={styleGlobalCalendar.tableCell}>{ep?.date!}</Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.heure_debut!}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.heure_fin!}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {formattedDuration}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.classe?.nom_classe_fr!}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.matiere?.matiere?.length > 24
                      ? `${ep?.matiere?.matiere?.slice(
                          0,
                          24
                        )}\n${ep?.matiere?.matiere?.slice(24)}`
                      : ep?.matiere?.matiere!}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.salle?.salle!}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.group_responsables
                      ?.map((res: any) => `${res?.prenom_fr!} ${res?.nom_fr!}`)
                      .join(", ")}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.group_surveillants
                      ?.map((sur: any) => `${sur?.prenom_fr!} ${sur?.nom_fr!}`)
                      .join(", ")}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {ep?.nbr_copie!}
                  </Text>
                </View>
              );
            })}
          </View>
        </Page>
      </Document>
    );
  };

  const ListEmergement = ({ classeId }: { classeId: string }) => {
    const etudiants = AllEtudiants.filter(
      (etudiant) => etudiant?.groupe_classe?._id! === classeId
    );

    return (
      <Document>
        <Page orientation="landscape">
          <Text>Header</Text>
          {/* Table */}
          <View style={styleGlobalCalendar.table}>
            {/* Table Header */}
            <View style={styleGlobalCalendar.tableRow}>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                C.I.N
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Nom & Prénom
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Entre
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Sortie
              </Text>
              <Text
                style={[
                  styleGlobalCalendar.tableCell,
                  styleGlobalCalendar.headerCell,
                ]}
              >
                Nombre de Pages
              </Text>
            </View>
            {etudiants.map((etudiant, index) => {
              return (
                <View style={styleGlobalCalendar.tableRow} key={index}>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {etudiant.num_CIN}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}>
                    {etudiant.nom_fr} {etudiant.prenom_fr}
                  </Text>
                  <Text style={styleGlobalCalendar.tableCell}></Text>
                  <Text style={styleGlobalCalendar.tableCell}></Text>
                  <Text style={styleGlobalCalendar.tableCell}></Text>
                </View>
              );
            })}
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
                ""
              )}
            </tbody>
          </table>
        </Row>
        <Row>
          <div className="table-responsive">
            <Table className="table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">H. Début</th>
                  <th scope="col">H. Fin</th>
                  <th scope="col">Durée</th>
                  <th scope="col">Groupe</th>
                  <th scope="col">Epreuve</th>
                  <th scope="col">Salle</th>
                  <th scope="col">Responsable(s)</th>
                  <th scope="col">Surveillant(s)</th>
                  <th scope="col">N° Copie</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {calendrierState.epreuve.map((ep: any) => {
                  const startTime = new Date(`1970-01-01T${ep.heure_debut}`);
                  const endTime = new Date(`1970-01-01T${ep.heure_fin}`);
                  const durationMs = endTime.getTime() - startTime.getTime();

                  const durationHours = Math.floor(
                    durationMs / (1000 * 60 * 60)
                  );
                  const durationMinutes = Math.floor(
                    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                  );

                  const formattedDuration = `${durationHours}h ${durationMinutes}m`;
                  const backgroundColor = getBackgroundColor(ep.date);
                  return (
                    <tr
                      key={ep.date + ep.heure_debut + ep.heure_fin}
                      style={{ backgroundColor }}
                    >
                      <td>{ep.date}</td>
                      <td>{ep.heure_debut}</td>
                      <td>{ep.heure_fin}</td>
                      <td>{formattedDuration}</td>
                      <td>{ep?.classe?.nom_classe_fr!}</td>
                      <td>
                        {ep?.matiere?.matiere.length > 24 ? (
                          <>
                            <span>{ep.matiere.matiere.slice(0, 24)}</span>
                            <br />
                            <span>{ep.matiere.matiere.slice(24)}</span>
                          </>
                        ) : (
                          ep?.matiere?.matiere
                        )}
                      </td>
                      <td>{ep?.salle?.salle!}</td>
                      <td>
                        <ul className="list-unstyled">
                          {ep.group_responsables.map((res: any) => (
                            <li key={res.prenom_fr + res.nom_fr}>
                              {res.prenom_fr} {res.nom_fr}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <ul className="list-unstyled">
                          {ep.group_surveillants.map((sur: any) => (
                            <li key={sur.prenom_fr + sur.nom_fr}>
                              {sur.prenom_fr} {sur.nom_fr}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{ep.nbr_copie}</td>
                      <td>{ep?.epreuveStatus!}</td>
                      <td>
                        <ul className="hstack gap-2 list-unstyled mb-0">
                          <li>
                            <button
                              type="button"
                              className="btn bg-info-subtle text-info view-item-btn btn-sm"
                              onClick={() => tog_ViewModal(ep)}
                            >
                              <i className="ph ph-eye fs-18"></i>
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn bg-success-subtle text-success edit-item-btn btn-sm"
                              onClick={() => tog_EditModal(ep?._id!)}
                            >
                              <i className="ph ph-pencil-simple-line fs-18"></i>
                            </button>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="badge bg-dark-subtle text-dark qrcode-btn"
                            >
                              <i className="ph ph-qr-code fs-20"></i>
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="btn bg-primary-subtle text-primary generatefile-btn btn-sm"
                            >
                              <PDFDownloadLink
                                document={
                                  <ListEmergement classeId={ep?.classe?._id!} />
                                }
                                fileName={`Liste-émergement${ep?.classe
                                  ?._id!}.pdf`}
                                className="text-decoration-none"
                              >
                                <i className="ph ph-clipboard-text fs-18"></i>{" "}
                              </PDFDownloadLink>
                            </button>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="link"
                className="me-2 p-0 fs-22"
                style={{ cursor: "pointer" }}
              >
                <PDFDownloadLink
                  document={<GlobalCalendar />}
                  fileName={`Calendrier_des_Examens- ${calendrierState.period}.pdf`}
                  className="text-decoration-none"
                >
                  <i className="bi bi-printer-fill text-success"></i>
                </PDFDownloadLink>
              </Button>
            </div>
          </div>
        </Row>
        {/* View Modal */}
        <Modal
          className="fade zoomIn"
          size="sm"
          show={openViewModal}
          onHide={() => {
            tog_ViewModal();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Détails Epreuve
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Row>
              <Col>
                <div className="vstack gap-1">
                  <p>
                    Epreuve de:{" "}
                    <span className="fw-bold">
                      {selectedEpreuve?.matiere?.matiere}
                    </span>{" "}
                  </p>
                  <p className="text-center">
                    Le <span className="fw-bold">{selectedEpreuve?.date!}</span>{" "}
                    de{" "}
                    <span className="fw-bold">
                      {selectedEpreuve?.heure_debut!}
                    </span>{" "}
                    à{" "}
                    <span className="fw-bold">
                      {selectedEpreuve?.heure_fin!}
                    </span>
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <span className="fw-medium">Nombre de copies:</span>{" "}
                  <span>{selectedEpreuve?.nbr_copie}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <span className="fw-medium">Nombre de présence:</span>{" "}
                  <span>{selectedEpreuve?.nbrePresent}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <span className="fw-medium">Nombre d'absence: </span>
                  <span>{selectedEpreuve?.nbreAbsent}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <span className="fw-medium">Nombre d'exclus: </span>
                  <span>{selectedEpreuve?.nbreExclus}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <span className="fw-medium">Notes: </span>
                  <span>{selectedEpreuve?.epreuveNotes}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center">
                {(selectedEpreuve?.epreuveStatus === "Done" ||
                  selectedEpreuve?.epreuveStatus === "Faite") && (
                  <span className="badge text-bg-success">
                    {selectedEpreuve?.epreuveStatus}
                  </span>
                )}
                {(selectedEpreuve?.epreuveStatus === "Non Terminé" ||
                  selectedEpreuve?.epreuveStatus === "") && (
                  <span className="badge text-bg-warning">
                    {selectedEpreuve?.epreuveStatus}
                  </span>
                )}
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        {/* Edit Modal */}
        <Modal
          className="fade zoomIn"
          size="sm"
          show={openEditModal}
          onHide={() => {
            tog_EditModal();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Modifier Epreuve
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={onSubmitCalendarEpreuve}>
              <Row className="mb-2">
                <Col lg={8}>
                  <Form.Label>Nombre de Copies</Form.Label>
                </Col>
                <Col lg={2}>
                  <h4>25</h4>
                  {/* To Fix Later*/}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col className="d-flex justify-content-center">
                  <div className="form-check form-switch form-switch-secondary">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="SwitchCheck2"
                      checked={status === "Faite"}
                      onChange={handleToggle}
                    />
                    <label className="form-check-label" htmlFor="SwitchCheck2">
                      {status}
                    </label>
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={3}>
                  <Form.Label htmlFor="nbre_present">Présent</Form.Label>
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    onChange={onChangeCalendarEpreuve}
                    id="nbre_present"
                    name="nbre_present"
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={3}>
                  <Form.Label htmlFor="nbre_absent">Absent</Form.Label>
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    onChange={onChangeCalendarEpreuve}
                    id="nbre_absent"
                    name="nbre_absent"
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={3}>
                  <Form.Label htmlFor="nbre_exclus">Exclus</Form.Label>
                </Col>
                <Col>
                  <input
                    type="text"
                    className="form-control"
                    onChange={onChangeCalendarEpreuve}
                    id="nbre_exclus"
                    name="nbre_exclus"
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={3}>
                  <Form.Label htmlFor="notes">Notes</Form.Label>
                </Col>
                <Col>
                  <textarea
                    rows={2}
                    className="form-control"
                    onChange={onChangeCalendarEpreuve}
                    id="notes"
                    name="notes"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-secondary">
                    Modifier
                  </button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default CalendrierDetails;
