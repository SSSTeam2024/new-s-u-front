import { useFetchClassesQuery } from "features/classe/classe";
import { useFetchEnseignantsQuery } from "features/enseignant/enseignantSlice";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useFetchSallesQuery } from "features/salles/salles";
import {
  StyleSheet,
  Document,
  Image,
  Page,
  View,
  Text,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";
import { useModifierExamenEpreuveMutation } from "features/examens/examenSlice";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";
import { useReactToPrint } from "react-to-print";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

const predefinedColors = [
  "#E5E4E2", // Platinum
  "#C0C0C0", // Silver
  "#D3D3D3", // Light Gray
  "#A9A9A9", // Dark Gray
];

const styleGlobalCalendar = StyleSheet.create({
  page: { padding: 24 },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  secondTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  thirdTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
  fourthTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
  },
  table: {
    // width: "100%",
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
  heureCell: {
    width: 30,
  },
});

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 15, textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 20 },
  text: { fontSize: 14, marginBottom: 15 },
  listItem: { fontSize: 14, marginLeft: 20, marginBottom: 5 },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Ensures left and right positioning
    alignItems: "center",
    marginBottom: 20,
  },
  leftAlign: { fontSize: 14 },
  rightAlign: { fontSize: 14 },
  headerLogoRight: {
    width: 60,
    height: 60,
    marginTop: 5,
    marginRight: 50,
  },
  headerLeft: {
    alignItems: "flex-start",
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  headerText: {
    fontSize: 12,
    // fontWeight: "ultrabold",
    textAlign: "center",
    marginBottom: 5,
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginTop: 5,
    marginRight: 50,
  },
  centeredRightSection: {
    marginTop: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 10,
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
    //borderBottomWidth: 1,
    paddingBottom: 10,
    margin: 20,
  },

  headerColumn: {
    flex: 1,
    marginTop: 5,
    alignItems: "center",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginVertical: 10,
    display: "flex",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#EAEAEA",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  footerRightText: {
    fontSize: 11,
    textAlign: "right",
    marginBottom: 2,
  },
  footerleftColumn: {
    position: "absolute",
    bottom: 20, // Keeps it at the bottom
    left: 50, // Aligns it to the left side
  },
  footerTextDirecteur: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 50, // Creates space for the signature
  },
  signatureSpace: {
    height: 40, // Defines a blank space for the signature
    marginTop: 10, // Adds space after the name
    borderBottom: "1px solid black", // Optional: adds a signature line
    width: 150, // Adjust as needed
  },

  rightColumn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
  },
  // headerLogo: {
  //   width: 60, // Adjust as needed
  //   height: 60, // Adjust as needed
  //   resizeMode: "contain",
  //   marginTop: 5,
  // },
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain", // Instead of resizeMode
    marginTop: 5,
    marginRight: 50,
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
    marginTop: 30,
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
  nameCell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "left",
    fontSize: 10,
  },
  dayCell: {
    width: 150,
    fontWeight: "bold",
  },
  classeCell: {
    width: 100,
    fontWeight: "bold",
  },
  salleCell: {
    width: 150,
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
  dateCell: {
    width: 70,
    fontWeight: "bold",
  },
  heureCell: {
    width: 55,
    fontWeight: "bold",
  },
  dureeCell: {
    width: 50,
    fontWeight: "bold",
  },
  groupeCell: {
    width: 80,
    fontWeight: "bold",
  },
  epreuveCell: {
    width: 115,
    fontWeight: "bold",
  },
  salleepreuveCell: {
    width: 40,
    fontWeight: "bold",
  },
  responsableCell: {
    width: 110,
    fontWeight: "bold",
  },
  nombreCopie: {
    width: 30,
    fontWeight: "bold",
  },
  numEtudiant: {
    width: 30,
    fontWeight: "bold",
  },
  cinEtudiant: {
    width: 70,
    fontWeight: "bold",
  },
  nomEtudiant: {
    width: 250,
    fontWeight: "bold",
  },
  entreEtudiant: {
    width: 95,
    fontWeight: "bold",
  },
  nbrePages: {
    width: 70,
    fontWeight: "bold",
  },
  codeZone: {
    padding: 5,
  },
  infoZone: {
    padding: 5,
    textAlign: "center", // Centers text horizontally
    lineHeight: 2,
    flex: 1, // Ensures the component takes up available space
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
  },
  emergedTableV1: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 100,
  },
  emergedTableV2: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 20,
  },
  emergedTableV3: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 4,
  },

  emergedTableV4: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    marginBottom: 50,
  },

  surTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
  cellFooter: {
    flex: 1, // Equal width for each column
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 10,
    height: 60,
  },
  block: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#000",
  },
  cellQRCode: {
    padding: 5,
    textAlign: "center",
    fontSize: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "center",
  },
  headerCenter: {
    flex: 2, // Gives more space to the center
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  headerLogo: {
    width: 70, // Increased for better visibility
    height: 70,
    objectFit: "contain",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  centeredRightSection: {
    marginTop: 5,
    alignItems: "center",
  },
  infoText: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

const stylesEnveloppe = StyleSheet.create({
  page: {
    padding: 20,
  },
  examDetails: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15, // Ensures space below the header
    padding: 10, // Adds some space around the text
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1 solid black",
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headerColumn: {
    textAlign: "center",
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Amiri",
  },
  headerLeft: {
    width: "33%",
    textAlign: "left",
  },
  headerRight: {
    width: "33%",
    textAlign: "right",
    direction: "rtl",
  },
  headerCenter: {
    width: "34%",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  footer: {
    textAlign: "right",
    marginTop: 20,
  },
  rightAlign: {
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 11,
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
  const lastVariable =
    variableGlobales.length > 0
      ? variableGlobales[variableGlobales.length - 1]
      : null;
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
  const [loading, setLoading] = useState(false);
  const [hashedCode, setHashedCode] = useState<string>("");

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
  }) => {
    console.log("exams", exams[0].exams[0].time);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Top Row */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerText}>
                  {lastVariable?.universite_fr}
                </Text>
                <Image
                  style={styles.headerLogoRight}
                  src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
                />
              </View>

              <View style={styles.headerCenter}>
                <Text style={styles.title}>Convocation de Surveillance</Text>

                <View style={styles.headerColumn}>
                  <Text style={styles.headerText}>
                    Session: {startYear}/{endYear}
                  </Text>
                </View>
              </View>

              {/* Right Side: Establishment Name and Logo */}
              <View style={styles.headerRight}>
                <Text style={styles.headerText}>
                  {lastVariable?.etablissement_fr}
                </Text>
                <Image
                  style={styles.headerLogoRight}
                  src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
                />
              </View>
            </View>
          </View>

          <Text style={styles.text}>Cher(e) {teacherName},</Text>
          <Text style={styles.text}>
            Vous êtes convoqué(e) pour surveiller les examens selon le planning
            suivant :
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableHeaderCell}>Jour</Text>
              <Text style={styles.tableHeaderCell}>Horaire</Text>
            </View>

            {exams.map((examen, idx) =>
              examen.exams.map((exam: any) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {examen.day.charAt(0).toUpperCase() + examen.day.slice(1)} -{" "}
                    {examen.date}
                  </Text>
                  <Text style={styles.tableCell}>{exam.time}</Text>
                </View>
              ))
            )}
          </View>

          <Text style={styles.text}>
            Merci de vous présenter 10 minutes avant le début de l'examen pour
            les préparatifs nécessaires.
          </Text>
          <Text style={styles.text}>Cordialement.</Text>
          <View style={[styles.footer, { marginTop: 20 }]}>
            <Text style={styles.rightAlign}>Directeur</Text>
          </View>
          <View style={[styles.footer, { marginTop: 10 }]}>
            <Text style={styles.rightAlign}>{lastVariable?.directeur_fr!}</Text>
          </View>
        </Page>
      </Document>
    );
  };

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
      // Extracting relevant exams with their time
      exams: epreuve
        .filter((exam: any) =>
          exam.group_surveillants.some(
            (teacher: any) => teacher._id === selectedTeacher
          )
        )
        .map((exam: any) => ({
          time: `${exam.heure_debut} - ${exam.heure_fin}`,
        })),
    }));
  console.log("days", days);
  const selectedTeacherDetails = AllEnseignants.find(
    (t) => t._id === selectedTeacher
  );

  const selectedTeacherPrenom = selectedTeacherDetails?.prenom_fr || "";
  const selectedTeacherNom = selectedTeacherDetails?.nom_fr || "";

  const teacherName = `${selectedTeacherPrenom} ${selectedTeacherNom}`;

  const handleFilterChange = (filter: any, value: any) => {
    resetFilters();

    switch (filter) {
      case "classe":
        setSelectedClasse(value);
        break;
      case "jour":
        setSelectedJour(value);
        break;
      case "salle":
        setSelectedSalle(value);
        break;
      case "teacher":
        setSelectedTeacher(value);
        break;
      default:
        break;
    }

    setActiveFilter(filter);
    setFilterApplied(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
          <View style={stylesCalenderFilter.headerContainer}>
            {/* Left Side: University Name and Logo */}
            <View style={stylesCalenderFilter.headerLeft}>
              <Text style={stylesCalenderFilter.headerText}>
                {lastVariable?.universite_fr}
              </Text>
              <Image
                style={stylesCalenderFilter.headerLogo}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
              />
            </View>

            {/* Center Section: Title and Exam Info */}
            <View style={stylesCalenderFilter.headerCenter}>
              <Text style={stylesCalenderFilter.headerTitle}>{title}</Text>
              {filterValue && (
                <Text style={stylesCalenderFilter.headerSubtitle}>
                  {filterValue}
                </Text>
              )}
              <View style={stylesCalenderFilter.centeredRightSection}>
                <Text style={stylesCalenderFilter.infoText}>
                  A.U: {startYear}/{endYear}
                </Text>
                <Text style={stylesCalenderFilter.infoText}>
                  Semestre: {calendrierState?.semestre!}
                </Text>
                <Text style={stylesCalenderFilter.infoText}>
                  Période: {calendrierState?.period!}
                </Text>
              </View>
            </View>

            {/* Right Side: Etablissement Name and Logo */}
            <View style={stylesCalenderFilter.headerRight}>
              <Text style={stylesCalenderFilter.headerText}>
                {lastVariable?.etablissement_fr}
              </Text>
              <Image
                style={stylesCalenderFilter.headerLogo}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
              />
            </View>
          </View>

          {/* Timetable */}
          <View style={stylesCalenderFilter.timetable}>
            {/* Header Row */}
            <View
              style={[stylesCalenderFilter.row, stylesCalenderFilter.headerRow]}
            >
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.dayCell,
                ]}
              >
                Jour
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.timeCell,
                ]}
              >
                Horaire
              </Text>
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
                  stylesCalenderFilter.salleCell,
                ]}
              >
                Salle
              </Text>
            </View>

            {/* Table Rows */}
            {rows.map((row, idx) => (
              <View key={idx} style={stylesCalenderFilter.row}>
                {/* Display the day */}
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.dayCell,
                  ]}
                >
                  {row.day.charAt(0).toUpperCase() + row.day.slice(1)} -{" "}
                  {row.date}
                </Text>
                <Text
                  style={[
                    stylesCalenderFilter.cell,
                    stylesCalenderFilter.timeCell,
                  ]}
                >
                  {row.heure_debut} - {row.heure_fin}
                </Text>
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
                    stylesCalenderFilter.salleCell,
                  ]}
                >
                  {row.salle}
                </Text>
              </View>
            ))}
          </View>
          <View style={stylesCalenderFilter.footerleftColumn}>
            <Text style={stylesCalenderFilter.footerTextDirecteur}>
              Directeur
            </Text>
            <Text style={stylesCalenderFilter.footerText}>
              {lastVariable?.directeur_fr}
            </Text>
            {/* <View style={stylesCalenderFilter.signatureSpace} /> */}
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

    return (
      <Document>
        <Page orientation="landscape" style={stylesCalenderFilter.page}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
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
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                Session des {calendrierState.type_examen}{" "}
                {calendrierState.session}
              </Text>
              <Text style={styleGlobalCalendar.secondTitle}>
                {monthName.charAt(0).toUpperCase() + monthName.slice(1)}{" "}
                {startYear}
              </Text>
            </View>
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

          {/* Table */}
          <View style={stylesCalenderFilter.timetable}>
            {/* Header */}
            <View
              style={[stylesCalenderFilter.row, stylesCalenderFilter.headerRow]}
            >
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.dateCell,
                ]}
              >
                Date
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.heureCell,
                ]}
              >
                H. Début
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.heureCell,
                ]}
              >
                H. Fin
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.dureeCell,
                ]}
              >
                Durée
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.groupeCell,
                ]}
              >
                Groupe
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.epreuveCell,
                ]}
              >
                Epreuve
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.salleepreuveCell,
                ]}
              >
                Salle
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.responsableCell,
                ]}
              >
                Responsable(s)
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.responsableCell,
                ]}
              >
                Surveillant(s)
              </Text>
              <Text
                style={[
                  stylesCalenderFilter.cell,
                  stylesCalenderFilter.nombreCopie,
                ]}
              >
                N° Copie
              </Text>
            </View>
            {/* Body */}
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
                <View style={stylesCalenderFilter.row} key={index}>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.dateCell,
                    ]}
                  >
                    {ep?.date!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.heureCell,
                    ]}
                  >
                    {ep?.heure_debut!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.heureCell,
                    ]}
                  >
                    {ep?.heure_fin!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.dureeCell,
                    ]}
                  >
                    {formattedDuration}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.groupeCell,
                    ]}
                  >
                    {ep?.classe?.nom_classe_fr!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.epreuveCell,
                    ]}
                  >
                    {ep?.matiere?.matiere?.length > 24
                      ? `${ep?.matiere?.matiere?.slice(
                        0,
                        24
                      )}\n${ep?.matiere?.matiere?.slice(24)}`
                      : ep?.matiere?.matiere!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.salleepreuveCell,
                    ]}
                  >
                    {ep?.salle?.salle!}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.responsableCell,
                    ]}
                  >
                    {ep?.group_responsables
                      ?.map((res: any) => `${res?.prenom_fr!} ${res?.nom_fr!}`)
                      .join(", ")}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.responsableCell,
                    ]}
                  >
                    {ep?.group_surveillants
                      ?.map((sur: any) => `${sur?.prenom_fr!} ${sur?.nom_fr!}`)
                      .join(", ")}
                  </Text>
                  <Text
                    style={[
                      stylesCalenderFilter.cell,
                      stylesCalenderFilter.nombreCopie,
                    ]}
                  >
                    {ep?.nbr_copie!}
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
              right: 10,
            }}
            render={({ pageNumber }) => (
              <Text style={{ fontSize: 10 }}>Page {pageNumber}</Text>
            )}
          />
        </Page>
      </Document>
    );
  };

  const ListEmergement = ({ epreuve }: { epreuve: any }) => {
    const etudiants = AllEtudiants.filter(
      (etudiant) => etudiant?.groupe_classe?._id! === epreuve?.classe?._id!
    );

    etudiants.sort(function (a, b) {
      if (a.prenom_fr < b.prenom_fr) {
        return -1;
      }
      if (a.prenom_fr > b.prenom_fr) {
        return 1;
      }
      return 0;
    });

    const chunkArray = (arr: any, chunkSize: number) => {
      const result: any = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
      }
      return result;
    };

    let etudiants_blocks: any = [];

    etudiants_blocks = chunkArray(etudiants, 25);

    const calculateStudentsSumFromCurrentBlock = (block_index: number) => {
      let result = 0;
      for (let i = 0; i < block_index; i++) {
        result += etudiants_blocks[i].length;
      }
      return result;
    };

    return (
      <Document>
        {etudiants_blocks.map((block: any, block_index: any) => {
          if (block.length <= 20) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV1}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}

                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
          if (block.length === 25 && etudiants_blocks.length === 1) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV3}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
          if (
            block.length === 25 &&
            etudiants_blocks.length > 0 &&
            block_index < etudiants_blocks.length - 1
          ) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV4}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
          if (
            block.length === 25 &&
            etudiants_blocks.length > 0 &&
            block_index === etudiants_blocks.length - 1
          ) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV2}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
          if (block.length < 25 && etudiants_blocks.length === 1) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV2}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
          if (
            block.length < 25 &&
            etudiants_blocks.length > 0 &&
            block_index === etudiants_blocks.length - 1
          ) {
            return (
              <Page orientation="portrait" style={{ padding: 30 }}>
                {/* Header */}
                {block_index === 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Section */}
                    <View
                      style={{ flex: 1, flexWrap: "wrap", maxWidth: "30%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.universite_fr!}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                        }}
                      >
                        {lastVariable?.etablissement_fr!}
                      </Text>
                    </View>
                    {/* Center Section */}
                    <View
                      style={{ flex: 1, alignItems: "center", maxWidth: "40%" }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Session des {calendrierState.type_examen}{" "}
                        {calendrierState.session}
                      </Text>
                      <Text style={styleGlobalCalendar.secondTitle}>
                        Groupe: {epreuve?.classe?.nom_classe_fr!}
                      </Text>
                      <Text style={styleGlobalCalendar.thirdTitle}>
                        Epreuve de: {epreuve?.matiere?.matiere!}
                      </Text>
                      <Text style={styleGlobalCalendar.fourthTitle}>
                        Le {epreuve?.date!} de {epreuve?.heure_debut!} à{" "}
                        {epreuve?.heure_fin!}
                      </Text>
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
                ) : (
                  <></>
                )}

                {/* Table */}
                {/* Table Header */}
                <View style={stylesCalenderFilter.emergedTableV2}>
                  {block_index === 0 && (
                    <>
                      <View
                        style={[
                          stylesCalenderFilter.row,
                          stylesCalenderFilter.headerRow,
                        ]}
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
                          Entré
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.entreEtudiant,
                          ]}
                        >
                          Sortie
                        </Text>
                        <Text
                          style={[
                            stylesCalenderFilter.cell,
                            stylesCalenderFilter.nbrePages,
                          ]}
                        >
                          # Copie(s)
                        </Text>
                      </View>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
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
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                  {block_index > 0 && (
                    <>
                      {block.map((etudiant: any, index: number) => {
                        return (
                          <>
                            <View style={stylesCalenderFilter.row} key={index}>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.numEtudiant,
                                ]}
                              >
                                {calculateStudentsSumFromCurrentBlock(
                                  block_index
                                ) +
                                  index +
                                  1}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.cinEtudiant,
                                ]}
                              >
                                {etudiant?.num_CIN!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.nameCell,
                                  stylesCalenderFilter.nomEtudiant,
                                ]}
                              >
                                {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                              </Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.entreEtudiant,
                                ]}
                              ></Text>
                              <Text
                                style={[
                                  stylesCalenderFilter.cell,
                                  stylesCalenderFilter.nbrePages,
                                ]}
                              ></Text>
                            </View>
                          </>
                        );
                      })}
                    </>
                  )}
                </View>
                {/* Footer */}
                {block_index === etudiants_blocks.length - 1 ? (
                  <View
                    style={{
                      // marginTop: etudiants.length % 25 === 0 ? 0 : 30,
                      paddingLeft: 30,
                      paddingRight: 30,
                    }}
                  >
                    {/* Table */}
                    <View style={{ borderWidth: 1, borderColor: "#000" }}>
                      {/* Body */}
                      <View style={stylesCalenderFilter.row}>
                        {epreuve.group_surveillants.map(
                          (sur: any, index: any) => (
                            <View
                              style={stylesCalenderFilter.cellFooter}
                              key={index}
                            >
                              <Text>{`${sur.nom_fr} ${sur.prenom_fr}`}</Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber}/${totalPages}`
                  }
                />
              </Page>
            );
          }
        })}
      </Document>
    );
  };

  const QrCodePage = ({ epreuve }: { epreuve: any }) => {
    const [qrCodes, setQrCodes] = useState<any[]>([]);
    const etudiants = useMemo(() => {
      let arr1 = AllEtudiants.filter(
        (etudiant) => etudiant?.groupe_classe?._id! === epreuve?.classe?._id!
      );

      console.log("students", arr1);
      return arr1;
    }, [AllEtudiants, epreuve]);

    const [start, end] = calendrierState.period.split(" / ");
    const [startDay, startMonth, startYear] = start.split("-");
    const monthName = useMemo(() => {
      return new Date(Number(startYear), Number(startMonth) - 1).toLocaleString(
        "fr-FR",
        {
          month: "long",
        }
      );
    }, [startYear, startMonth]);

    const generateQRCode = async (etudiant: any) => {
      const qrData = `${etudiant.nom_fr} ${etudiant.prenom_fr}\n${etudiant.num_CIN
        }\n${epreuve?.matiere?.matiere!}\n${epreuve?.classe
          ?.nom_classe_fr!}\nSession: ${monthName} 2025`;
      const hashedData = CryptoJS.SHA256(qrData).toString(CryptoJS.enc.Hex);
      const shortHashedData = hashedData.substring(0, 14);

      try {
        const qrCode = await QRCode.toDataURL(shortHashedData);
        return { qrCode, hashedCode: shortHashedData };
      } catch (err) {
        console.error("Error generating QR code:", err);
        return null;
      }
    };

    useEffect(() => {
      if (etudiants.length === 0) return;

      const fetchQRCodes = async () => {
        const qrCodeData = await Promise.all(
          etudiants.map((etudiant: any) => generateQRCode(etudiant))
        );
        setQrCodes(qrCodeData);
      };

      fetchQRCodes();
    }, [etudiants]);

    return (
      <Document>
        <Page orientation="portrait" style={{ padding: 30 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              // marginBottom: 10,
            }}
          >
            {/* Left Section (University) */}
            <View style={{ alignItems: "flex-start", maxWidth: "30%" }}>
              <Text style={{ fontSize: 12, fontWeight: "heavy" }}>
                {lastVariable?.universite_fr}
              </Text>
              <Image
                style={stylesCalenderFilter.logo}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoUniversiteFiles/${lastVariable?.logo_universite}`}
              />
            </View>

            {/* Center Section (A.U., Semestre, Période) */}
            <View style={{ alignItems: "center", flex: 1 }}>
              {/* <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                A.U: {startYear}/{endYear}
              </Text> */}
              <Text style={{ fontSize: 12 }}>
                Session de {calendrierState?.type_examen!}{" "}
                {calendrierState?.session!} / {calendrierState?.semestre!}
              </Text>
              <Text style={{ fontSize: 11 }}>
                Matière: {epreuve?.matiere?.matiere!}
              </Text>
              <Text style={{ fontSize: 11 }}>
                Date d'épreuve: {epreuve?.date!} {epreuve?.heure_debut!} -{" "}
                {epreuve?.heure_fin!}
              </Text>
              <Text style={{ fontSize: 11 }}>
                Salle: {epreuve?.salle?.salle!}
              </Text>
              <Text style={{ fontSize: 11 }}>
                Nombre des étudiants: {etudiants.length}
              </Text>
            </View>

            {/* Right Section (Institution) */}
            <View style={{ alignItems: "flex-end", maxWidth: "30%" }}>
              <Text style={{ fontSize: 12, fontWeight: "heavy" }}>
                {lastVariable?.etablissement_fr}
              </Text>
              <Image
                style={stylesCalenderFilter.logo}
                src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/logoEtablissementFiles/${lastVariable?.logo_etablissement}`}
              />
            </View>
          </View>

          {/* Table */}
          <View style={stylesCalenderFilter.timetable}>
            {/* Body */}

            {etudiants.map((etudiant: any, index: any) => {
              const qrCodeData = qrCodes[index];
              if (index % 2 === 0) {
                return (
                  <>
                    {index !== 0 && index % 10 === 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: index,
                        }}
                      >
                        <div style={{ height: `150px` }}></div>
                      </View>
                    )}

                    <View style={[stylesCalenderFilter.row]} key={index}>
                      <View style={stylesCalenderFilter.block}>
                        <View
                          style={[
                            stylesCalenderFilter.cellQRCode,
                            stylesCalenderFilter.codeZone,
                            {
                              flexDirection: "column",
                              alignItems: "center",
                            },
                          ]}
                        >
                          <View
                            style={{
                              borderRightWidth: 2,
                              borderRightColor: "black",
                              borderStyle: "dashed",
                            }}
                          >
                            <Image
                              src={qrCodeData?.qrCode!}
                              style={{ width: 100, height: 91 }}
                            />
                          </View>
                          <Text>{qrCodeData?.hashedCode}</Text>
                        </View>
                        <Text
                          style={[
                            stylesCalenderFilter.cellQRCode,
                            stylesCalenderFilter.infoZone,
                          ]}
                        >
                          {etudiant?.nom_fr!} {etudiant?.prenom_fr!}
                          {"\n"}
                          {etudiant?.num_CIN!} -{" "}
                          {epreuve?.classe?.nom_classe_fr!}
                          {"\n"}
                          {epreuve?.matiere?.matiere!}
                          {"\n"}
                          Session: {calendrierState?.type_examen!} {monthName}{" "}
                          {startYear}
                        </Text>
                      </View>
                      {etudiants[index + 1] && (
                        <View style={stylesCalenderFilter.block}>
                          <View
                            style={[
                              stylesCalenderFilter.cellQRCode,
                              stylesCalenderFilter.codeZone,
                              {
                                flexDirection: "column",
                                alignItems: "center",
                              },
                            ]}
                          >
                            <View
                              style={{
                                borderRightWidth: 2,
                                borderRightColor: "black",
                                borderStyle: "dashed",
                              }}
                            >
                              <Image
                                src={qrCodes[index + 1]?.qrCode!}
                                style={{ width: 100, height: 91 }}
                              />
                            </View>
                            <Text>{qrCodes[index + 1]?.hashedCode}</Text>
                          </View>
                          <Text
                            style={[
                              stylesCalenderFilter.cellQRCode,
                              stylesCalenderFilter.infoZone,
                            ]}
                          >
                            {etudiants[index + 1]?.nom_fr!}{" "}
                            {etudiants[index + 1]?.prenom_fr!}
                            {"\n"}
                            {etudiants[index + 1]?.num_CIN!} -{" "}
                            {epreuve?.classe?.nom_classe_fr!}
                            {"\n"}
                            {epreuve?.matiere?.matiere!}
                            {"\n"}
                            Session: {calendrierState?.type_examen!} {monthName}{" "}
                            {startYear}
                          </Text>
                        </View>
                      )}
                      {etudiants[index + 1] === undefined && (
                        <View style={stylesCalenderFilter.block}>
                          <View
                            style={[
                              stylesCalenderFilter.cellQRCode,
                              stylesCalenderFilter.codeZone,
                              {
                                flexDirection: "column",
                                alignItems: "center",
                              },
                            ]}
                          >
                            <View>
                              <View style={{ width: 100, height: 91 }} />
                            </View>
                            <Text></Text>
                          </View>
                          <Text
                            style={[
                              stylesCalenderFilter.cellQRCode,
                              stylesCalenderFilter.infoZone,
                            ]}
                          ></Text>
                        </View>
                      )}
                    </View>
                  </>
                );
              }
            })}
          </View>
          {/* Footer */}
          {/* <View
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
            render={({ pageNumber }) => (
              <Text style={{ fontSize: 10 }}>Page {pageNumber}</Text>
            )}
          /> */}
        </Page>
      </Document>
    );
  };

  //envoloppe print

  const EnvoloppePDF = ({ epreuve }: { epreuve: any }) => {
    return (
      <Row className="justify-content-center" style={{ display: "none" }}>
        <Col
          xxl={9}
        //   ref={componentRef}
        >
          <div ref={contentRef}>
            <Card id="demo">
              <Col lg={12}>
                <Card.Body className="p-4">
                  <div>
                    <Row className="g-3">
                      <Col lg={4} className="text-center pt-2">
                        <h6>
                          Ministère de l’Enseignement Supérieur et de la
                          Recherche Scientifique
                        </h6>
                        <h6>{lastVariable?.universite_fr!}</h6>
                        <h6>{lastVariable?.etablissement_fr!}</h6>
                      </Col>
                      <Col lg={4} className="text-center">
                        <img
                          className="w-25"
                          src={`${process.env.REACT_APP_API_URL
                            }/files/variableGlobaleFiles/logoRepubliqueFiles/${lastVariable?.logo_republique!}`}
                        />
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        <h6>الجمهورية التونسية</h6>
                        <h6>وزارة التعليم العالي و البحث العلمي</h6>

                        <h6>{lastVariable?.universite_ar!}</h6>
                        <h6>{lastVariable?.etablissement_ar!}</h6>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "50px" }}>
                      <Col lg={12} className="text-center">
                        <span>Session de {calendrierState?.type_examen!}{" "}
                          {calendrierState?.session!} {" "}
                          {calendrierState?.semestre! === 'S1' ? (<>Semestre 1</>) : (<>Semestre 2</>)}</span>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "10px", marginBottom: '50px' }}>
                      <Col lg={12} className="text-center">
                        <h6>Année Universitaire {startYear} / {endYear}</h6>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Matière:
                        </h6>
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        <span> {epreuve?.matiere?.matiere!}</span>
                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6> :المادة</h6>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Filière, niveau d’étude et groupe: {/* {epreuve?.classe?.nom_classe_fr!} */}
                        </h6>
                      </Col>
                      <Col lg={4} className=" pt-2">
                        <div className="hstack gap-5 d-flex justify-content-center">
                          <span> {epreuve?.classe?.nom_classe_fr!}</span> <span> {epreuve?.classe?.nom_classe_ar!}</span>
                        </div>

                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6>:الشعبة، مستوى الدراسة والفريق {/* {epreuve?.classe?.nom_classe_ar!} */}</h6>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Salle:
                        </h6>
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        {epreuve?.salle?.salle!}
                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6> :القاعة</h6>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Date déroulement de l'épreuve:
                        </h6>
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        {epreuve?.date!}
                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6> :تاريخ إجراء الامتحان</h6>
                      </Col>
                    </Row>

                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Horaire du déroulement de l’épreuve:
                        </h6>
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        {epreuve?.heure_debut!} -{" "} {epreuve?.heure_fin!}
                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6> :توقيت إجراء الامتحان</h6>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={4} className="text-sart pt-2 ml-2">
                        <h6>
                          Nom, prénom et signature des enseignants:
                        </h6>
                      </Col>
                      <Col lg={4} className="text-center pt-2">
                        {epreuve.group_responsables.map((enseignant: any) => (
                          <div key={enseignant._id} className="mr-2">
                            {enseignant.nom_fr} {enseignant.prenom_fr}
                          </div>
                        ))}
                      </Col>
                      <Col lg={4} className="text-end pt-2 mr-2">
                        <h6> :إسم ، لقب و إمضاء الأساتذة</h6>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                      <Col lg={6} className="text-sart pt-2 ml-2">
                        <h6>
                          Nom, prénom et signature des enseignants surveillants:
                        </h6>
                      </Col>


                      <Col lg={6} className="text-end pt-2 mr-2">
                        <h6> :إسم ، لقب و إمضاء الأساتذة المراقبين</h6>
                      </Col>
                    </Row>

                    <Row className="mt-5 text-center">
                      {epreuve.group_surveillants.map((enseignant: any, index: number) => {

                        return (
                          <div className="pb-5 text-center" style={{ border: '1px solid #ededed' }}>
                            {enseignant.nom_fr} {enseignant.prenom_fr}
                          </div>

                          // <Row key={index} style={{ border: '1px solid #ededed' }}>
                          //   <Col className="pb-5" style={{ borderRight: '1px solid #ededed' }}>
                          //     {enseignant.nom_fr} {enseignant.prenom_fr}
                          //   </Col>
                          //   {epreuve.group_surveillants[index + 1] ? (
                          //     <Col className="pb-5">
                          //       {epreuve.group_surveillants[index + 1].nom_fr}{" "}
                          //       {epreuve.group_surveillants[index + 1].prenom_fr}
                          //     </Col>
                          //   ) : (
                          //     <Col className="pb-5"></Col> // Empty cell for odd numbers
                          //   )}
                          // </Row>
                        );

                      })}
                    </Row>

                  </div>
                </Card.Body>
              </Col>
            </Card>
          </div>
        </Col>
      </Row>

      // <Document>
      //   <Page size="A4" style={stylesEnveloppe.page}>
      //     {/* Header Section */}
      //     <View style={stylesEnveloppe.header}>
      //       <View style={stylesEnveloppe.headerRow}>
      //         {/* Left Section (French) */}
      //         <View style={stylesEnveloppe.headerLeft}>
      //           <Text style={stylesEnveloppe.headerText}>
      //             Ministère de l’Enseignement Supérieur et de la Recherche
      //             Scientifique
      //           </Text>
      //           <Text style={[stylesEnveloppe.headerText, { marginTop: 5 }]}>
      //             {lastVariable?.universite_fr}
      //           </Text>
      //           <Text style={stylesEnveloppe.headerText}>
      //             {lastVariable?.etablissement_fr}
      //           </Text>
      //         </View>

      //         {/* Center Section (Emblem) */}
      //         <View style={stylesEnveloppe.headerCenter}>
      //           <Image
      //             style={stylesEnveloppe.logo}
      //             src={`${
      //               process.env.REACT_APP_API_URL
      //             }/files/variableGlobaleFiles/logoRepubliqueFiles/${lastVariable?.logo_republique!}`}
      //           />
      //         </View>

      //         {/* Right Section (Arabic) */}
      //         <View style={stylesEnveloppe.headerRight}>
      //           <Text style={stylesEnveloppe.headerText}>
      //             الجمهورية التونسية
      //           </Text>
      //           <Text style={stylesEnveloppe.headerText}>
      //             وزارة التعليم العالي و البحث العلمي
      //           </Text>
      //           <Text style={[stylesEnveloppe.headerText, { marginTop: 5 }]}>
      //             {lastVariable?.universite_ar}
      //           </Text>
      //           <Text style={stylesEnveloppe.headerText}>
      //             {lastVariable?.etablissement_ar}
      //           </Text>
      //         </View>
      //       </View>
      //     </View>

      //     {/* Centered Exam Details */}
      //     <View style={stylesEnveloppe.examDetails}>
      //       <Text style={{ fontSize: 12 }}>
      //         Année Universitaire {startYear} / {endYear}
      //       </Text>
      //       <Text style={{ fontSize: 11 }}>
      //         Session de {calendrierState?.type_examen!}{" "}
      //         {calendrierState?.session!} / {calendrierState?.semestre!}
      //       </Text>
      //     </View>

      //     {/* New Section: Matière */}
      //     <View style={stylesEnveloppe.section}>
      //       <Text style={stylesEnveloppe.sectionTitle}>
      //         Matière : {epreuve?.matiere?.matiere!}
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         Filière, niveau d’étude et groupe:{" "}
      //         {epreuve?.classe?.nom_classe_fr!}
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         Salle: {epreuve?.salle?.salle!}
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         Date du déroulement de l’épreuve: {epreuve?.date!}
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         Horaire du déroulement de l’épreuve: {epreuve?.heure_debut!} -{" "}
      //         {epreuve?.heure_fin!}
      //       </Text>
      //     </View>

      //     {/* New Section: Mâles
      //     <View style={stylesEnveloppe.section}>
      //       <Text style={stylesEnveloppe.sectionTitle}>Mâles</Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         الشعبة، مستوى الدراسة والفريق: ......
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>القاعة: ......</Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         تاريخ إجراء الامتحان: ......
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         توقيت إجراء الامتحان: ......
      //       </Text>
      //       <Text style={stylesEnveloppe.sectionContent}>
      //         اسم، لقب واهضاء الأسئلة: ......
      //       </Text>
      //     </View> */}

      //     {/* Footer Section */}
      //     <View style={stylesEnveloppe.footer}>
      //       <Text style={stylesEnveloppe.rightAlign}>
      //         Noms, prénoms et signatures des enseignants surveillants
      //       </Text>
      //       {epreuve.group_surveillants.map((enseignant: any) => (
      //         <Text key={enseignant._id} style={stylesEnveloppe.rightAlign}>
      //           {enseignant.nom_fr} {enseignant.prenom_fr}
      //         </Text>
      //       ))}
      //     </View>
      //   </Page>
      // </Document>
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
                className="btn btn-secondary"
              >
                Télécharger Convocation
              </PDFDownloadLink>
            </Col>
          )}
        </Row>

        <>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filterApplied && filteredDays.length > 0 ? (
            <Row>
              <table className="table table-bordered table-striped w-100">
                <tbody>
                  {filteredDays.map(({ date, day, epreuve }) => (
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
                              {epreuve.map((exam, idx) => (
                                <li key={idx}>
                                  <strong>
                                    {exam.matiere?.matiere || "Inconnu"}
                                  </strong>
                                  <br />
                                  {`${exam.heure_debut} - ${exam.heure_fin}`}
                                  <br />
                                  {`${exam.salle?.salle || "Non attribuée"}`}
                                  <br />
                                  {`${exam.classe?.nom_classe_fr ||
                                    "Non attribuée"
                                    }`}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Row>
          ) : (
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
                      const startTime = new Date(
                        `1970-01-01T${ep.heure_debut}`
                      );
                      const endTime = new Date(`1970-01-01T${ep.heure_fin}`);
                      const durationMs =
                        endTime.getTime() - startTime.getTime();

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
                                <button
                                  type="button"
                                  className="btn bg-warning-subtle qrcode-btn btn-sm"
                                >
                                  <PDFDownloadLink
                                    document={<QrCodePage epreuve={ep} />}
                                    fileName={`qrcode - ${ep?.classe
                                      ?.nom_classe_fr!}.pdf`}
                                    className="text-decoration-none"
                                  >
                                    <i className="ph ph-qr-code text-dark fs-18"></i>
                                  </PDFDownloadLink>
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="btn bg-primary-subtle text-primary generatefile-btn btn-sm"
                                >
                                  <PDFDownloadLink
                                    document={<ListEmergement epreuve={ep} />}
                                    fileName={`Liste-émergement - ${ep?.classe
                                      ?.nom_classe_fr!}.pdf`}
                                    className="text-decoration-none"
                                  >
                                    <i className="ph ph-clipboard-text fs-18"></i>{" "}
                                  </PDFDownloadLink>
                                </button>
                              </li>

                              <li>
                                <button
                                  type="button"
                                  className="btn bg-danger-subtle text-danger generatefile-btn btn-sm"
                                  onClick={reactToPrintFn}
                                >
                                  <i className="ph ph-envelope fs-18"></i>
                                  {/* <PDFDownloadLink
                                    document={<EnvoloppePDF epreuve={ep} />}
                                    fileName={`Enveloppe - ${ep?.classe
                                      ?.nom_classe_fr!}.pdf`}
                                    className="text-decoration-none"
                                  >
                                    <i className="ph ph-envelope"></i>{" "}
                                  </PDFDownloadLink> */}
                                </button>
                                <EnvoloppePDF epreuve={ep} />
                              </li>
                            </ul>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Row>
          )}
        </>

        <Row className="justify-content-center" style={{ display: "none" }}>
          <Col
            xxl={9}
          //   ref={componentRef}
          >
            <div ref={contentRef}>
              <Card id="demo">
                <Col lg={12}>
                  <Card.Body className="p-4">
                    <div>
                      <Row className="g-3">
                        <Col lg={12}>
                          <Card.Header className="border-bottom-dashed p-4 text-end">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6>جامعة قفصة</h6>
                                <h6>المعهد العالي للعلوم</h6>
                                <h6>التطبيقية و التكنلوجيا بقفصة</h6>
                              </div>
                              <div>
                                <h6>الجمهورية التونسية</h6>
                                <h6>وزارة التعليم العالي</h6>
                                <h6>و البحث العلمي</h6>
                              </div>
                            </div>
                          </Card.Header>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Col>
              </Card>
              {/* Print button for generating PDF */}
            </div>
            <Button
              onClick={() => reactToPrintFn()}
              className="mt-4"
              variant="primary"
            >
              Imprimer Pdf
            </Button>
          </Col>
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
