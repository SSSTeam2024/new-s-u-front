import React, { useCallback, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useFetchFicheVoeuxsQuery } from "features/ficheVoeux/ficheVoeux";
import "./GestionEmploiClasse.css";
import SimpleBar from "simplebar-react";
import Flatpickr from "react-flatpickr";

import { useFetchClasseByIdQuery } from "features/classe/classe";
import {
  useAddSeanceMutation,
  useDeleteSeanceMutation,
  useFetchAllSeancesByTimeTableIdQuery,
  useGetSeancesByTeacherMutation,
} from "features/seance/seance";
import CustomLoaderForButton from "Common/CustomLoaderForButton/CustomLoaderForButton";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import { useGetSalleByDayAndTimeMutation } from "features/salles/salles";
import TimeRange from "@harveyconnor/react-timeline-range-slider";
import { useGetTeachersPeriodsMutation } from "features/teachersPeriods/teachersPeriods";
import { Enseignant } from "features/enseignant/enseignantSlice";
import CustomLoader from "Common/CustomLoader/CustomLoader";
import "jspdf-autotable";
import {
  pdf,
  StyleSheet,
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import { useFetchVaribaleGlobaleQuery } from "features/variableGlobale/variableGlobaleSlice";

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
    fontSize: 15,
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
    // marginBottom: 10,
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
    // marginTop: 0,
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
    width: 60,
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
  },
  periodicDate: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontSize: 10,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 11,
    marginBottom: 2,
  },
  footerRightText: {
    fontSize: 11,
    textAlign: "right",
    marginBottom: 2,
  },
  footerleftColumn: {
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  rightColumn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 20,
  },
  typeSeance: {
    backgroundColor: "grey",
    color: "white",
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    textAlign: "right",
    marginTop: 5,
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
  enseignant: {
    prenom_fr: string;
    nom_fr: string;
  };
  type_seance: string;
}

type GroupedSessions = {
  [day: string]: Session[];
};
interface TimetablePDFProps {
  days: string[];
  groupedSessions: GroupedSessions;
  maxSessions: number;
}

const GestionEmploiClasse = () => {
  document.title = " Gestion emploi classe | Application Smart Institute";
  const { data: paramsData = [] } = useFetchTimeTableParamsQuery();
  const { data: variableGlobales = [] } = useFetchVaribaleGlobaleQuery();
  const convertTimeStringToMs = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now.getTime();
  };

  const [startTime, setStartTime] = useState<any>();
  const [endTime, setEndTime] = useState<any>();
  const [selectedStart, setSelectedStart] = useState<any>();
  const [selectedEnd, setSelectedEnd] = useState<any>();
  const [disabledIntervals, setDisabledIntervals] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const errorHandler = useCallback(({ error }: { error: boolean }) => {
    console.log("Error", error);
    setError(error);
  }, []);

  const onChangeCallback = useCallback(
    (interval: Date[]) => {
      setDisponibiliteSalles([]);
      console.log("Debut pause", paramsData[0]?.daily_pause_start);
      console.log("Fin pause", paramsData[0]?.daily_pause_end);
      let formattedTime = formatStartEndTimes(interval[0], interval[1]);
      let pauseInterctionResult = doIntervalsIntersect(
        { start: formattedTime[0], end: formattedTime[1] },
        {
          start: paramsData[0]?.daily_pause_start,
          end: paramsData[0]?.daily_pause_end,
        }
      );
      console.log(pauseInterctionResult);
      if (pauseInterctionResult === true && error === false) {
        addSessionOnPauseTimeAlert(formattedTime);
      } else {
        console.log("inside else");
        setFormData((prevState) => ({
          ...prevState,
          heure_debut: formattedTime[0],
          heure_fin: formattedTime[1],
        }));
      }

      console.log("error", error);
      if (error == true) {
        console.log(formattedTime[1] + " " + formattedTime[0]);
        setFormData((prevState) => ({
          ...prevState,
          heure_debut: "",
          heure_fin: "",
        }));
      }
    },
    [disabledIntervals, error]
  );

  const addSessionOnPauseTimeAlert = async (selectedInterval: any[]) => {
    const { value: formValues } = await Swal.fire({
      icon: "warning",
      title: "Chevauchement de la Période de Pause!",
      html: `
        <p class="text-center mb-4">
          Veuillez confirmer votre choix.
        </p>
        <div class="text-start">
          <input type="checkbox" id="tcCheckbox1" onclick="document.getElementById('tcCheckbox2').checked = false" />
          <label for="tcCheckbox1">continuer</label><br>
          <input type="checkbox" id="tcCheckbox2" onclick="document.getElementById('tcCheckbox1').checked = false" />
          <label for="tcCheckbox2">annuler</label>
        </div>
      `,
      confirmButtonText: `Confirmer&nbsp;<i class="fa fa-check"></i>`,
      showCloseButton: true,
      customClass: {
        popup: "w-30 p-4",
        closeButton:
          "position-absolute start-0 ms-3 mt-3 bg-light rounded-circle border",
      },
      preConfirm: () => {
        const tcCheckbox1 = (
          document.getElementById("tcCheckbox1") as HTMLInputElement
        )?.checked;
        const tcCheckbox2 = (
          document.getElementById("tcCheckbox2") as HTMLInputElement
        )?.checked;

        if (!tcCheckbox1 && !tcCheckbox2) {
          Swal.showValidationMessage("Veuillez sélectionner une option.");
        }

        return { tcCheckbox1, tcCheckbox2 };
      },
    });

    if (formValues) {
      const selectedOption = formValues.tcCheckbox1
        ? "continuer"
        : formValues.tcCheckbox2
        ? "annuler"
        : "aucune sélection";
      Swal.fire(
        "Option sélectionnée",
        `Vous avez choisi de: ${selectedOption}`,
        "info"
      );
    }

    if (formValues) {
      if (formValues.tcCheckbox1 == true) {
        Swal.fire("Sélection Confirmée", "", "success").then(() => {
          setFormData((prevState) => ({
            ...prevState,
            heure_debut: selectedInterval[0],
            heure_fin: selectedInterval[1],
          }));
        });
      } else {
        Swal.fire("Sélection Annulée", "", "error").then(() => {
          setFormData((prevState) => ({
            ...prevState,
            heure_debut: "",
            heure_fin: "",
          }));
        });
      }
    }
  };

  const doIntervalsIntersect = (interval1: any, interval2: any) => {
    // Convert time strings to Date objects for comparison
    const start1 = new Date(`1970-01-01T${interval1.start}:00`);
    const end1 = new Date(`1970-01-01T${interval1.end}:00`);
    const start2 = new Date(`1970-01-01T${interval2.start}:00`);
    const end2 = new Date(`1970-01-01T${interval2.end}:00`);

    // Check for intersection
    return start1 < end2 && start2 < end1;
  };

  const formatStartEndTimes = (start: any, end: any) => {
    const ds =
      String(start.getHours()).padStart(2, "0") +
      ":" +
      String(start.getMinutes()).padStart(2, "0");
    console.log("ds", ds);
    const fs =
      String(end.getHours()).padStart(2, "0") +
      ":" +
      String(end.getMinutes()).padStart(2, "0");
    console.log("fs", fs);

    return [ds, fs];
  };

  const [fetchDisponibiliteSalles, roomsAvailabilityRequestStatus] =
    useGetSalleByDayAndTimeMutation();
  const [disponibiliteSalles, setDisponibiliteSalles] = useState<any[]>([]);
  const [heuresFin, setHeuresFin] = useState<any[]>([]);
  const [selectedVoeux, setSelectedVoeux] = useState<any>([]);
  const [selectedJourVoeux, setSelectedJourVoeux] = useState<any>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [availableDays, setAvailableDays] = useState<any[]>([]);
  const [canAddSession, setCanAddSession] = useState<boolean>(false);
  const [teacherSessionsForSingleDay, setTeacherSessionsForSingleDay] =
    useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const classeDetails = location.state;

  const [createSeance, sessionCreationRequestStatus] = useAddSeanceMutation();
  const [getSessionsByTeacherId] = useGetSeancesByTeacherMutation();
  const [getTeachersPeriods] = useGetTeachersPeriodsMutation();
  const { data: allVoeux = [] } = useFetchFicheVoeuxsQuery();
  const voeux = allVoeux;
  const { data: classe } = useFetchClasseByIdQuery(
    classeDetails?.id_classe?._id
  );
  console.log("classe gestion emploi classe", classe);
  const { data: allSessions = [], isSuccess: sessionClassFetched } =
    useFetchAllSeancesByTimeTableIdQuery(classeDetails?._id!);
  console.log(allSessions);
  const [deleteSessionById] = useDeleteSeanceMutation();
  const [formData, setFormData] = useState({
    _id: "",
    matiere: "",
    enseignant: {
      _id: "",
      nom_fr: "",
      nom_ar: "",
      prenom_fr: "",
      prenom_ar: "",
      grade: {
        _id: "",
        value_grade_enseignant: "",
        grade_ar: "",
        grade_fr: "",
        charge_horaire: {
          annualMinHE: "",
          annualMaxHE: "",

          s1MinHE: "",
          s1MaxHE: "",

          s2MinHE: "",
          s2MaxHE: "",

          annualMinHS: "",
          annualMaxHS: "",

          s1MinHS: "",
          s1MaxHS: "",

          s2MinHS: "",
          s2MaxHS: "",

          annualMinHX: "",
          annualMaxHX: "",

          s1MinHX: "",
          s1MaxHX: "",

          s2MinHX: "",
          s2MaxHX: "",

          totalAnnualMin: "",
          totalAnnualMax: "",

          totalS1Min: "",
          totalS1Max: "",

          totalS2Min: "",
          totalS2Max: "",
        },
      },
    },
    classe: classeDetails?.id_classe?._id,
    salle: "",
    jour: "",
    heure_debut: "",
    heure_fin: "",
    type_seance: "",
    semestre: classeDetails?.semestre,
    emploiPeriodique_id: classeDetails?._id,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setAlertMessage] = useState("");

  const [averageTeachers, setAverageTeachers] = useState<any[]>([]);

  const [teachersPeriods, setTeachersPeriods] = useState<any[]>([]);

  const [periodicSchedulesIds, setPeriodicSchedulesIds] = useState<any[]>([]);

  const [showForm, setShowForm] = useState<Boolean>(false);

  const timeSlots: any = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  const filteredSessions = allSessions.filter(
    (session) => session?.semestre! === classeDetails?.semestre!
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
    sessions.forEach((session: any) => {
      const {
        _id,
        jour,
        heure_debut,
        heure_fin,
        matiere,
        enseignant,
        salle,
        semestre,
        hasBreak,
        type_seance,
      } = session;
      if (!grouped[jour]) {
        grouped[jour] = [];
      }
      grouped[jour].push({
        _id,
        jour,
        semestre,
        type_seance,
        classe,
        heure_debut,
        heure_fin,
        matiere,
        enseignant,
        salle,
        hasBreak,
      });
    });

    if (grouped["Lundi"]) {
      grouped["Lundi"] = sortSessions(grouped["Lundi"]);
    }
    if (grouped["Mardi"]) {
      grouped["Mardi"] = sortSessions(grouped["Mardi"]);
    }
    if (grouped["Mercredi"]) {
      grouped["Mercredi"] = sortSessions(grouped["Mercredi"]);
    }
    if (grouped["Jeudi"]) {
      grouped["Jeudi"] = sortSessions(grouped["Jeudi"]);
    }
    if (grouped["Vendredi"]) {
      grouped["Vendredi"] = sortSessions(grouped["Vendredi"]);
    }
    if (grouped["Samedi"]) {
      grouped["Samedi"] = sortSessions(grouped["Samedi"]);
    }

    return grouped;
  };
  const groupedSessions = groupSessionsByDay(filteredSessions);

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const maxSessions = Math.max(
    ...days.map((day) =>
      groupedSessions[day] ? groupedSessions[day].length : 0
    )
  );

  let key = "";
  if (classeDetails?.semestre === "1") {
    key = "S1";
  } else {
    key = "S2";
  }

  let wishList: any[] = [];
  for (let element of allVoeux) {
    let consernedVoeux;
    if (key === element.semestre) {
      for (let v of element.fiche_voeux_classes) {
        if (classe?._id === v.classe?._id) {
          consernedVoeux = v;
          wishList.push({
            teacher: element.enseignant,
            voeux: consernedVoeux,
          });
          break;
        }
      }
    }
  }

  const selectChangeJour = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    let requestData = {
      teacher_id: selectedTeacher?.id,
      jour: value,
      emplois_periodiques_ids: periodicSchedulesIds,
    };

    console.log("periodicSchedulesIds", periodicSchedulesIds);

    let res = await getSessionsByTeacherId(requestData).unwrap();

    console.log("Teacher's sessions", res);

    const sessions = [];

    for (const array of res) {
      for (const session of array) {
        sessions.push(session);
      }
    }

    console.log("Final sessions", sessions);

    setTeacherSessionsForSingleDay(sessions);

    setStartTime(convertTimeStringToMs(paramsData[0].day_start_time));
    setEndTime(convertTimeStringToMs(paramsData[0].day_end_time));
    setSelectedStart(convertTimeStringToMs(paramsData[0].day_start_time));
    setSelectedEnd(convertTimeStringToMs("09:00"));
    if (formData.type_seance === "1") {
      let classIntervals = await findAvailableIntervals(
        groupedSessions[value],
        paramsData[0].day_start_time,
        paramsData[0].day_end_time,
        "class"
      );
      let teacherIntervals = await findAvailableIntervals(
        sessions,
        paramsData[0].day_start_time,
        paramsData[0].day_end_time,
        "teacher"
      );
      let common = await findCommonIntervals(classIntervals, teacherIntervals);
      console.log(common);
      await extractUnavailability(
        common,
        paramsData[0].day_start_time,
        paramsData[0].day_end_time
      );

      setFormData((prevState) => ({
        ...prevState,
        jour: value,
        heure_debut: "",
        heure_fin: "",
        salle: "",
      }));
      setDisponibiliteSalles([]);
    } else {
      let classIntervals = await findFortnightAvailableIntervals(
        groupedSessions[value],
        paramsData[0].day_start_time,
        paramsData[0].day_end_time,
        "class"
      );

      let teacherIntervals = await findFortnightAvailableIntervals(
        sessions,
        paramsData[0].day_start_time,
        paramsData[0].day_end_time,
        "teacher"
      );

      let common = await findCommonIntervals(classIntervals, teacherIntervals);
      console.log(common);
      await extractUnavailability(
        common,
        paramsData[0].day_start_time,
        paramsData[0].day_end_time
      );

      setFormData((prevState) => ({
        ...prevState,
        jour: value,
        heure_debut: "",
        heure_fin: "",
        salle: "",
      }));
      setDisponibiliteSalles([]);
    }
  };

  const handleFetchDisponibiliteSalles = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        start_time: formData.heure_debut,
        end_time: formData.heure_fin,
        day: formData.jour,
        session_type: formData.type_seance,
        semestre: formData.semestre,
        date_debut_emploi_period: classeDetails.date_debut,
        date_fin_emploi_period: classeDetails.date_fin,
      };
      console.log("payload", payload);
      let result: any[] = await fetchDisponibiliteSalles(payload).unwrap();
      console.log("disponibilites", result);

      setDisponibiliteSalles(result);
    } catch (err) {
      console.error("Failed to fetch disponibilite salles: ", err);
    }
  };

  const onSubmitSeance = async () => {
    try {
      console.log(formData);
      await createSeance(formData).unwrap();
      notify();
      setCanAddSession(false);
      setDisabledIntervals([]);
      setDisponibiliteSalles([]);
      setSelectedVoeux([]);
      setSelectedJourVoeux([]);
      setSelectedTeacher({
        name: "",
        id: "",
      });
      setFormData((prevState) => ({
        ...prevState,
        enseignant: {
          _id: "",
          nom_fr: "",
          nom_ar: "",
          prenom_fr: "",
          prenom_ar: "",
          grade: {
            _id: "",
            value_grade_enseignant: "",
            grade_ar: "",
            grade_fr: "",
            charge_horaire: {
              annualMinHE: "",
              annualMaxHE: "",

              s1MinHE: "",
              s1MaxHE: "",

              s2MinHE: "",
              s2MaxHE: "",

              annualMinHS: "",
              annualMaxHS: "",

              s1MinHS: "",
              s1MaxHS: "",

              s2MinHS: "",
              s2MaxHS: "",

              annualMinHX: "",
              annualMaxHX: "",

              s1MinHX: "",
              s1MaxHX: "",

              s2MinHX: "",
              s2MaxHX: "",

              totalAnnualMin: "",
              totalAnnualMax: "",

              totalS1Min: "",
              totalS1Max: "",

              totalS2Min: "",
              totalS2Max: "",
            },
          },
          jour: "",
          type_seance: "",
          heure_debut: "",
          heure_fin: "",
        },
      }));
    } catch (error: any) {
      console.log(error);
    }
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Séance Ajoutée",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  async function tog_AddSeanceModals() {
    setShowForm(true);
    let tempIds = [];
    for (const wish of wishList) {
      tempIds.push(wish?.teacher?._id!);
    }

    let payload = {
      ids_array: tempIds,
      semestre: classeDetails.semestre,
    };

    let result: any = await getTeachersPeriods(payload).unwrap();

    console.log("result", result);
    setTeachersPeriods(result);

    let averages = [];
    for (const element of result) {
      if (element?.periods!.length === 0) {
        let wish_teacher = wishList.filter(
          (wish) => wish.teacher._id === element.id_teacher
        );
        let average = {
          teacher: wish_teacher[0].teacher,
          hours: 0,
        };
        averages.push(average);
      } else {
        let merged = mergeIntervals(element?.periods!);
        console.log("MERGED", merged);
        let wish_teacher = wishList.filter(
          (wish) => wish.teacher._id === element.id_teacher
        );
        console.log(wish_teacher);
        const average = getTeacherAverageHoursPerWeek(
          wish_teacher[0].teacher,
          merged
        );
        console.log("AVERAGE", average);
        averages.push(average);
      }
    }
    setAverageTeachers(averages);
    setShowForm(false);
    setCanAddSession(true);
  }

  const getTeacherAverageHoursPerWeek = (
    enseignant: Enseignant,
    merged: any
  ) => {
    let totalWeightedHours = 0;
    let totalWeeks = 0;

    for (const element of merged) {
      const weeksInInterval = calculateWeeksInInterval(
        element.start_date,
        element.end_date
      );
      const weightedHours = element.nbr_heure * weeksInInterval;
      totalWeightedHours += weightedHours;
      totalWeeks += weeksInInterval;
    }
    const averageHoursPerWeek =
      totalWeeks > 0 ? totalWeightedHours / totalWeeks : 0;
    return {
      teacher: enseignant,
      hours: Number.isInteger(averageHoursPerWeek)
        ? String(averageHoursPerWeek)
        : averageHoursPerWeek.toFixed(2),
    };
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // const formatDate = (date: Date) => {
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // const mergeIntervals = (intervals: any[]) => {
  //   const sortedIntervals = [...intervals];

  //   sortedIntervals.sort(
  //     (a: any, b: any) =>
  //       parseDate(a?.id_classe_period?.date_debut!).getTime() -
  //       parseDate(b?.id_classe_period?.date_debut!).getTime()
  //   );

  //   const splitIntervals: any[] = [];
  //   for (let interval of sortedIntervals) {
  //     const startDate = parseDate(interval.id_classe_period?.date_debut!);
  //     const endDate = parseDate(interval.id_classe_period?.date_fin!);
  //     const hours = Number(interval.nbr_heure);

  //     splitIntervals.push({ date: startDate, hours });
  //     splitIntervals.push({
  //       date: new Date(endDate.getTime() + 1),
  //       hours: -hours,
  //     });
  //   }

  //   splitIntervals.sort((a, b) => a.date.getTime() - b.date.getTime());

  //   const result: any[] = [];
  //   let currentStartDate = splitIntervals[0].date;
  //   let currentHours = 0;

  //   for (let i = 0; i < splitIntervals.length - 1; i++) {
  //     const { date, hours } = splitIntervals[i];
  //     currentHours += hours;
  //     const nextDate = splitIntervals[i + 1].date;
  //     if (date.getTime() !== nextDate.getTime()) {
  //       result.push({
  //         start_date: formatDate(currentStartDate),
  //         end_date: formatDate(new Date(nextDate.getTime() - 1)),
  //         nbr_heure: currentHours,
  //       });
  //       currentStartDate = nextDate;
  //     }
  //   }

  //   let refinedResult = [];

  //   for (const element of result) {
  //     if (element.start_date !== element.end_date) {
  //       refinedResult.push(element);
  //     }
  //   }

  //   return refinedResult;
  // };

  const mergeIntervals = (intervals: any) => {
    const sortedIntervals = [...intervals];

    // Sort intervals by start date
    sortedIntervals.sort(
      (a, b) =>
        parseDateV2(a.id_classe_period.date_debut).getTime() -
        parseDateV2(b.id_classe_period.date_debut).getTime()
    );

    const splitIntervals = [];
    for (let interval of sortedIntervals) {
      const startDate = parseDateV2(interval.id_classe_period.date_debut);
      const endDate = parseDateV2(interval.id_classe_period.date_fin);
      const hours = Number(interval.nbr_heure);

      splitIntervals.push({
        date: startDate,
        hours,
        id: interval.id_classe_period._id,
      });
      splitIntervals.push({
        date: new Date(endDate.getTime() + 86400000), // Add one day to include the end date
        hours: -hours,
        id: interval.id_classe_period._id,
      });
    }

    // Sort by date
    splitIntervals.sort((a, b) => a.date.getTime() - b.date.getTime());

    const result = [];
    let currentStartDate = splitIntervals[0].date;
    let currentHours = 0;
    let currentIds = new Set();

    for (let i = 0; i < splitIntervals.length - 1; i++) {
      const { date, hours, id } = splitIntervals[i];
      currentHours += hours;

      // Add or remove ids based on hours being added or subtracted
      if (hours > 0) {
        currentIds.add(id);
      } else {
        currentIds.delete(id);
      }

      const nextDate = splitIntervals[i + 1].date;
      if (date.getTime() !== nextDate.getTime()) {
        result.push({
          ids: Array.from(currentIds),
          start_date: formatDate(currentStartDate),
          end_date: formatDate(new Date(nextDate.getTime() - 86400000)), // Subtract one day
          nbr_heure: currentHours,
        });
        currentStartDate = nextDate;
      }
    }

    let refinedResult = [];

    // Filter out intervals where start_date equals end_date
    for (const element of result) {
      if (element.start_date !== element.end_date) {
        refinedResult.push(element);
      }
    }

    return refinedResult;
  };

  const parseDateV2 = (dateStr: any) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  const formatDate = (date: any) => {
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateWeeksInInterval = (start_date: string, end_date: string) => {
    const [startDay, startMonth, startYear] = start_date.split("-").map(Number);
    const [endDay, endMonth, endYear] = end_date.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    let numberOfWeeks = Math.ceil(diffInDays / 7);

    return numberOfWeeks;
  };

  const prepareWhishListDays = (currentWhishDays: any) => {
    console.log(currentWhishDays);
    let preAvailableDays: any[] = [
      {
        day: "Lundi",
        time: "",
      },
      {
        day: "Mardi",
        time: "",
      },
      {
        day: "Mercredi",
        time: "",
      },
      {
        day: "Jeudi",
        time: "",
      },
      {
        day: "Vendredi",
        time: "",
      },
      {
        day: "Samedi",
        time: "",
      },
    ];

    for (const day of preAvailableDays) {
      for (const whishDay of currentWhishDays) {
        if (day.day === whishDay.jour) {
          day.time = whishDay.temps;
        }
      }
    }

    console.log(preAvailableDays);
    setAvailableDays(preAvailableDays);
  };
  const handleChangeSelectedVoeuxEnseignant = (e: any) => {
    if (e.target.value !== "") {
      setDisabledIntervals([]);
      setDisponibiliteSalles([]);

      let allPeriods = [...teachersPeriods];

      let currentPeriods = allPeriods.filter(
        (p) => p.id_teacher === e.target.value
      );

      console.log("currentPeriods", currentPeriods);
      console.log("classeDetails", classeDetails);

      const givenStart = parseDate(classeDetails?.date_debut!);
      const givenEnd = parseDate(classeDetails?.date_fin!);

      const intersectingIntervals = currentPeriods[0]?.periods?.filter(
        (period: any) => {
          const intervalStart = parseDate(
            period?.id_classe_period?.date_debut!
          );
          const intervalEnd = parseDate(period?.id_classe_period?.date_fin!);
          return intervalStart <= givenEnd && intervalEnd >= givenStart;
        }
      );

      console.log("intersectingIntervals", intersectingIntervals);

      let periodicIds = intersectingIntervals.map(
        (interval: any) => interval.id_classe_period._id
      );

      console.log("periodicIds", periodicIds);

      setPeriodicSchedulesIds(periodicIds);

      let consernedVoeux0: any = voeux.filter(
        (v) => v.enseignant._id === e.target.value
      );

      console.log("consernedVoeux", consernedVoeux0);
      let consernedVoeux: any[] = [];
      for (const element of consernedVoeux0) {
        if (classeDetails.semestre === "1") {
          if (element.semestre === "S1") {
            consernedVoeux.push(element);
          }
        } else {
          if (element.semestre === "S2") {
            consernedVoeux.push(element);
          }
        }
      }

      let currentVoeux: any = consernedVoeux[0]?.fiche_voeux_classes!.filter(
        (v: any) => v.classe._id === classe!._id
      );

      prepareWhishListDays(consernedVoeux[0].jours);

      setSelectedTeacher({
        name:
          consernedVoeux[0]?.enseignant?.prenom_fr! +
          " " +
          consernedVoeux[0]?.enseignant?.nom_fr!,
        id: consernedVoeux[0]?.enseignant?._id!,
      });

      let tempMat = [];
      for (let mat of currentVoeux[0]?.matieres!) {
        tempMat.push({
          name: mat.matiere + " " + mat.type,
          id: mat._id,
        });
      }
      setFormData((prevState) => ({
        ...prevState,
        enseignant: e.target.value,
        jour: "",
        type_seance: "",
        heure_debut: "",
        heure_fin: "",
        matiere: "",
      }));

      setSelectedVoeux(tempMat);
      let tempJour = [];
      for (let jour of consernedVoeux[0]?.jours!) {
        tempJour.push(jour);
      }
      setSelectedJourVoeux(tempJour);
    } else {
      setSelectedTeacher(null);
    }
  };

  const extractColorClass = (className: string) => {
    const match = className.match(/bg-([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  const handleChangeFiltredMatiere = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      matiere: e.target.value,
    }));
  };

  const handleChangeSalle = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      salle: e.target.value,
    }));
  };

  const handleDebutSeance = (selectedDates: any) => {
    const formattedTime = selectedDates[0];
    const ds =
      String(formattedTime.getHours()).padStart(2, "0") +
      ":" +
      String(formattedTime.getMinutes()).padStart(2, "0");

    if (formData.jour === "") {
      alert("Veuillez séléctionner un jour d'abord");
    } else {
      setFormData((prevState) => ({
        ...prevState,
        heure_debut: ds,
        heure_fin: "",
        salle: "",
      }));
      setDisponibiliteSalles([]);
    }
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };
  const findAvailableIntervals = async (
    sessions: any[],
    startOfDay: string,
    endOfDay: string,
    who: string
  ) => {
    const available_intervals: { start: string; end: string }[] = [];
    const startOfDayMinutes = timeToMinutes(startOfDay);
    const endOfDayMinutes = timeToMinutes(endOfDay);

    if (sessions && sessions.length > 0) {
      let arr = [...sessions];
      arr.sort(
        (a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_debut)
      );

      let previousEndTime = startOfDayMinutes;

      for (const session of arr) {
        const sessionStartTime = timeToMinutes(session.heure_debut);
        const sessionEndTime = timeToMinutes(session.heure_fin);
        if (sessionStartTime > previousEndTime) {
          available_intervals.push({
            start: minutesToTime(previousEndTime),
            end: minutesToTime(sessionStartTime),
          });
        }
        previousEndTime = Math.max(previousEndTime, sessionEndTime);
      }
      if (previousEndTime < endOfDayMinutes) {
        available_intervals.push({
          start: minutesToTime(previousEndTime),
          end: minutesToTime(endOfDayMinutes),
        });
      }
    } else {
      available_intervals.push({
        start: startOfDay,
        end: endOfDay,
      });
    }

    console.log("available_intervals", available_intervals);
    return available_intervals;
  };

  const findFortnightAvailableIntervals = async (
    sessions: any[],
    startOfDay: string,
    endOfDay: string,
    who: string
  ) => {
    const available_intervals: any[] = [];
    const startOfDayMinutes = timeToMinutes(startOfDay);
    const endOfDayMinutes = timeToMinutes(endOfDay);

    if (sessions != undefined) {
      let arr = [...sessions];
      arr.sort(
        (a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_fin)
      );

      let previousEndTime = startOfDayMinutes;

      for (const session of arr) {
        const sessionStartTime = timeToMinutes(session.heure_debut);
        const sessionEndTime = timeToMinutes(session.heure_fin);
        if (sessionStartTime > previousEndTime) {
          available_intervals.push({
            start: minutesToTime(previousEndTime),
            end: minutesToTime(sessionStartTime),
          });
        }
        previousEndTime = Math.max(previousEndTime, sessionEndTime);
        if (session.type_seance === "1/15") {
          available_intervals.push({
            start: session.heure_debut,
            end: session.heure_fin,
          });
        }
      }
      if (previousEndTime < endOfDayMinutes) {
        available_intervals.push({
          start: minutesToTime(previousEndTime),
          end: minutesToTime(endOfDayMinutes),
        });
      }
    } else {
      available_intervals.push({
        start: startOfDay,
        end: endOfDay,
      });
    }
    console.log("available_intervals", available_intervals);
    return available_intervals;
  };

  const findCommonIntervals = async (
    classIntervals: any[],
    teacherIntervals: any[]
  ) => {
    const common_itervals: any[] = [];

    let i = 0,
      j = 0;
    while (i < classIntervals.length && j < teacherIntervals.length) {
      const classStart = timeToMinutes(classIntervals[i].start);
      const classEnd = timeToMinutes(classIntervals[i].end);
      const teacherStart = timeToMinutes(teacherIntervals[j].start);
      const teacherEnd = timeToMinutes(teacherIntervals[j].end);
      const overlapStart = Math.max(classStart, teacherStart);
      const overlapEnd = Math.min(classEnd, teacherEnd);
      if (overlapStart < overlapEnd) {
        common_itervals.push({
          start: minutesToTime(overlapStart),
          end: minutesToTime(overlapEnd),
        });
      }
      if (classEnd < teacherEnd) {
        i++;
      } else {
        j++;
      }
    }
    console.log("common_itervals", common_itervals);
    return common_itervals;
  };

  const extractUnavailability = async (
    commonIntervals: any[],
    dayStart: string,
    dayEnd: string
  ) => {
    const unavailable_intervals: any[] = [];
    let lastEndTime = timeToMinutes(dayStart);

    for (const interval of commonIntervals) {
      const currentStartTime = timeToMinutes(interval.start);
      if (lastEndTime < currentStartTime) {
        unavailable_intervals.push({
          start: minutesToTime(lastEndTime),
          end: minutesToTime(currentStartTime),
        });
      }
      lastEndTime = timeToMinutes(interval.end);
    }
    const dayEndTime = timeToMinutes(dayEnd);
    if (lastEndTime < dayEndTime) {
      unavailable_intervals.push({
        start: minutesToTime(lastEndTime),
        end: minutesToTime(dayEndTime),
      });
    }

    console.log("unavailableIntervals", unavailable_intervals);

    setDisabledIntervals(
      unavailable_intervals.map((interval: { start: string; end: string }) => ({
        start: convertTimeStringToMs(interval.start),
        end: convertTimeStringToMs(interval.end),
      }))
    );
    return unavailable_intervals;
  };
  const closeAddSessionForm = () => {
    setCanAddSession(false);
    setDisabledIntervals([]);
    setAvailableDays([]);
    setDisponibiliteSalles([]);
    setSelectedVoeux([]);
    setSelectedTeacher({
      name: "",
      id: "",
    });
    setFormData((prevState) => ({
      ...prevState,
      enseignant: {
        _id: "",
        nom_fr: "",
        nom_ar: "",
        prenom_fr: "",
        prenom_ar: "",
        grade: {
          _id: "",
          value_grade_enseignant: "",
          grade_ar: "",
          grade_fr: "",
          charge_horaire: {
            annualMinHE: "",
            annualMaxHE: "",

            s1MinHE: "",
            s1MaxHE: "",

            s2MinHE: "",
            s2MaxHE: "",

            annualMinHS: "",
            annualMaxHS: "",

            s1MinHS: "",
            s1MaxHS: "",

            s2MinHS: "",
            s2MaxHS: "",

            annualMinHX: "",
            annualMaxHX: "",

            s1MinHX: "",
            s1MaxHX: "",

            s2MinHX: "",
            s2MaxHX: "",

            totalAnnualMin: "",
            totalAnnualMax: "",

            totalS1Min: "",
            totalS1Max: "",

            totalS2Min: "",
            totalS2Max: "",
          },
        },
      },
      jour: "",
      type_seance: "",
      heure_debut: "",
      heure_fin: "",
    }));
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const showSelectionWarning = (message: string) => {
    setShowAlert(true);
    setAlertMessage(message);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 7000);
  };
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // January = 0, December = 11

  // Determine academic year based on September as the starting month
  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1; // August is 8
  const endYear = startYear + 1;

  const getStyle = (
    teaching_Hours: string,
    charge_horaire: any,
    semestre: string
  ) => {
    console.log("teachingHours", teaching_Hours);
    const teachingHours = Number(teaching_Hours);
    console.log("charge_horaire", charge_horaire);
    console.log("semestre", semestre);
    const annualVolume = Number(charge_horaire?.annualMaxHE!);
    const HS_Max_S1 =
      Number(charge_horaire?.s1MaxHE!) + Number(charge_horaire?.s1MaxHS!);
    const HS_Max_S2 =
      Number(charge_horaire?.s2MaxHE!) + Number(charge_horaire?.s2MaxHS!);
    let background = "";
    let textColor = "black";
    let className = "d-flex";
    if (semestre == "1") {
      if (teachingHours <= Number(charge_horaire?.s1MinHE!)) {
        background = "#ff0000b5";
      } else if (
        teachingHours < annualVolume &&
        teachingHours > Number(charge_horaire?.s1MinHE!)
      ) {
        background = "#ffff0096";
      } else if (teachingHours == annualVolume) {
        background = "#8cf78c";
      } else if (
        teachingHours > annualVolume &&
        teachingHours <= Number(charge_horaire?.s1MaxHE!)
      ) {
        background = "lightblue";
      } else if (
        teachingHours > Number(charge_horaire?.s1MaxHE!) &&
        teachingHours <= HS_Max_S1
      ) {
        background = "#1717f5cc";
        textColor = "white";
      } else if (
        teachingHours > HS_Max_S1 &&
        teachingHours <= Number(charge_horaire?.totalS1Max!)
      ) {
        background = "#e1ae00a1";
      } else {
        className = "d-none";
      }
    } else {
      if (teachingHours <= Number(charge_horaire?.s2MinHE!)) {
        background = "#ff0000b5";
      } else if (
        teachingHours < annualVolume &&
        teachingHours > Number(charge_horaire?.s2MinHE!)
      ) {
        background = "#ffff0096";
      } else if (teachingHours == annualVolume) {
        background = "#8cf78c";
      } else if (
        teachingHours > annualVolume &&
        teachingHours <= Number(charge_horaire?.s2MaxHE!)
      ) {
        background = "lightblue";
      } else if (
        teachingHours > Number(charge_horaire?.s2MaxHE!) &&
        teachingHours <= HS_Max_S2
      ) {
        background = "#1717f5cc";
        textColor = "white";
      } else if (
        teachingHours > HS_Max_S2 &&
        teachingHours <= Number(charge_horaire?.totalS2Max!)
      ) {
        background = "#e1ae00a1";
      } else {
        className = "d-none";
      }
    }
    return { class: className, bg: background, textColor: textColor };
  };
  const TimetablePDF: React.FC<TimetablePDFProps> = ({
    days,
    groupedSessions,
    maxSessions,
    //enseignant,
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
                Emploi de temps {classeDetails?.id_classe?.nom_classe_fr!}
              </Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.headerText}>
                A.U: {startYear}/{endYear}
              </Text>
              <Text style={styles.headerText}>
                Semestre: {classeDetails.semestre}
              </Text>
              <Text style={styles.headerText}>
                Période: {classeDetails?.date_debut!} /{" "}
                {classeDetails?.date_fin!}
              </Text>
            </View>
          </View>

          {/* Middle Row */}

          {/* Bottom Row */}
          {/* <View style={styles.headerRow}>
           
            <View style={styles.periodicDateContainer}>
              <Text style={styles.periodicDate}>
                Période: {classeDetails?.date_debut!} /{" "}
                {classeDetails?.date_fin!}
              </Text>
            </View>
          </View> */}
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
                    {session.enseignant.prenom_fr} {session.enseignant.nom_fr}
                    {"\n"}
                    {session.type_seance !== "1" && (
                      <Text style={styles.typeSeance}>
                        {session.type_seance}
                      </Text>
                    )}
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
          {/* Left Column */}
          <View style={styles.footerleftColumn}>
            <Text style={styles.footerText}>Chef de département</Text>
            <Text style={styles.footerText}>
              {classe?.departement?.nom_chef_dep!}
            </Text>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <Text style={styles.footerRightText}>Secrétaire Générale</Text>
            <Text style={styles.footerRightText}>
              {variableGlobales[2].secretaire_fr}
            </Text>
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
          //enseignant={}
        />
      );
      const pdfBlob = await pdfInstance.toBlob();

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "emploiTempsClasse.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
      setShowAlert(true);
      setAlertMessage("Failed to generate PDF. Please try again.");
    }
  };
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
                  {classeDetails.etat !== "Cloturé" ? (
                    <div className="d-flex justify-content-between">
                      <>
                        {canAddSession === false ? (
                          <Button
                            variant="success"
                            onClick={() => tog_AddSeanceModals()}
                            className="add-btn"
                            disabled={showForm === true}
                          >
                            {showForm === true ? (
                              <CustomLoaderForButton></CustomLoaderForButton>
                            ) : (
                              <>
                                <i className="bi bi-plus-circle me-1 align-middle"></i>
                                Ajouter Séance
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="btn-danger"
                            onClick={() => {
                              closeAddSessionForm();
                            }}
                          >
                            <i className="ri-close-line align-bottom me-1"></i>{" "}
                            Fermer
                          </Button>
                        )}
                      </>
                      <>
                        <Link
                          to="/gestion-emplois/emploi-classe/liste-seance"
                          state={classeDetails}
                        >
                          <Button
                            className="btn btn-soft-dark btn-border"
                            onClick={() => {}}
                          >
                            <i className="ri-edit-2-line align-bottom me-1"></i>{" "}
                            Gestion des séances
                          </Button>
                        </Link>
                      </>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="mb-3 text-center">
                    <Form.Label htmlFor="semestre">
                      Emploi De Temps {classeDetails?.id_classe?.nom_classe_fr}{" "}
                      - Semestre {classeDetails?.semestre}
                    </Form.Label>
                  </div>
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
                                      {groupedSessions[day]
                                        .reduce((acc: any, session: any) => {
                                          const isFullTime =
                                            session.type_seance === "1";
                                          const isFortnight =
                                            session.type_seance === "1/15";

                                          const lastSession =
                                            acc[acc.length - 1];

                                          if (
                                            isFortnight &&
                                            lastSession &&
                                            lastSession.heure_debut ===
                                              session.heure_debut &&
                                            lastSession.heure_fin ===
                                              session.heure_fin &&
                                            lastSession.type_seance === "1/15"
                                          ) {
                                            lastSession.sessions.push(session);
                                          } else {
                                            acc.push({
                                              heure_debut: session.heure_debut,
                                              heure_fin: session.heure_fin,
                                              type_seance: session.type_seance,
                                              sessions: [session],
                                            });
                                          }
                                          return acc;
                                        }, [])
                                        .map(
                                          (sessionGroup: any, index: any) => (
                                            <td
                                              key={index}
                                              className="py-3 px-4 text-center position-relative"
                                            >
                                              <div className="mb-2 rounded-pill bg-light text-dark py-1 fw-bold">
                                                {sessionGroup.heure_debut} -{" "}
                                                {sessionGroup.heure_fin}
                                              </div>
                                              {sessionGroup.sessions.map(
                                                (session: any, idx: any) => (
                                                  <div
                                                    key={idx}
                                                    className="mt-2"
                                                  >
                                                    <div className="mb-1 text-dark fw-bold">
                                                      {session.matiere.matiere}
                                                    </div>
                                                    <div
                                                      style={{
                                                        color: "#c66bff",
                                                        fontWeight: "700",
                                                      }}
                                                    >
                                                      {
                                                        session.enseignant
                                                          .nom_fr
                                                      }{" "}
                                                      {
                                                        session.enseignant
                                                          .prenom_fr
                                                      }
                                                    </div>
                                                    <div
                                                      style={{
                                                        color: "#6bb4ff",
                                                        fontWeight: "700",
                                                      }}
                                                    >
                                                      {session.salle.salle}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                              {sessionGroup.type_seance ===
                                              "1/15" ? (
                                                <div
                                                  className="position-absolute p-1 m-1 bottom-0 end-0 rounded"
                                                  style={{
                                                    background:
                                                      "rgb(157 157 157)",
                                                  }}
                                                >
                                                  <span
                                                    style={{ color: "white" }}
                                                  >
                                                    {sessionGroup.type_seance}
                                                  </span>
                                                </div>
                                              ) : (
                                                <></>
                                              )}
                                            </td>
                                          )
                                        )}
                                      {[
                                        ...Array(
                                          maxSessions -
                                            groupedSessions[day].length
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
                  <Row>
                    <Col lg={3} className="mt-5">
                      <Card>
                        <Card.Header className="d-flex align-items-center">
                          <h5 className="card-title mb-0 flex-grow-1">
                            Sélectionner Enseignant
                          </h5>
                          <div className="">
                            <select
                              className="form-select text-muted"
                              name="etat_compte"
                              id="etat_compte"
                              value={formData.enseignant.nom_ar}
                              onChange={handleChangeSelectedVoeuxEnseignant}
                            >
                              <option value="">Sélectionner Enseignant</option>
                              {averageTeachers?.map((element) => {
                                const annualMaxHE =
                                  element?.teacher?.grade?.charge_horaire
                                    ?.annualMaxHE || 0;

                                const dynamicStyle = getStyle(
                                  element?.hours!,
                                  element?.teacher?.grade?.charge_horaire!,
                                  classeDetails.semestre
                                );

                                return (
                                  <option
                                    key={element?.teacher?._id!}
                                    value={element?.teacher?._id!}
                                    className={dynamicStyle?.class!}
                                    style={{
                                      background: dynamicStyle?.bg!,
                                      color: dynamicStyle?.textColor!,
                                    }}
                                  >
                                    {`${element?.teacher?.prenom_fr!} ${element
                                      ?.teacher
                                      ?.nom_fr!}  ${element?.hours!}/${annualMaxHE}`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <SimpleBar
                            data-simplebar
                            style={{ maxHeight: "440px" }}
                          >
                            <div className="w-100 d-flex justify-content-center fs-17">
                              Liste des voeux
                            </div>
                            <div className="acitivity-timeline acitivity-main">
                              <div className="acitivity-item d-flex">
                                <div className="flex-shrink-0 acitivity-avatar"></div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-0 lh-base">Matières</h6>
                                  {selectedVoeux?.map(
                                    (matiere: any, index: number) => (
                                      <p
                                        className="text-muted mb-0"
                                        key={index}
                                      >
                                        <strong>-</strong> {matiere.name}
                                      </p>
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="acitivity-item py-3 d-flex">
                                <div className="flex-shrink-0">
                                  <div className="acitivity-avatar"></div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-0 lh-base">Jours</h6>
                                  {selectedJourVoeux?.map(
                                    (jour: any, index: number) => (
                                      <p
                                        className="mb-2 text-muted"
                                        key={index}
                                      >
                                        {jour.jour} | {jour.temps}
                                      </p>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </SimpleBar>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={9} className="mt-5">
                      <Form className="tablelist-form">
                        <Row className="mb-3">
                          <h5
                            className="modal-title fs-18"
                            id="exampleModalLabel"
                          >
                            Ajouter Séance
                          </h5>
                        </Row>

                        <Row>
                          <Row>
                            <div
                              id="alert-error-msg"
                              className="d-none alert alert-danger py-2"
                            ></div>
                            <input type="hidden" id="id-field" />
                            <Col lg={4}>
                              <div className="mb-3">
                                <Form.Label htmlFor="matiere">
                                  Matière
                                </Form.Label>
                                <select
                                  className="form-select text-muted"
                                  name="matiere"
                                  id="matiere"
                                  value={formData?.matiere}
                                  onChange={handleChangeFiltredMatiere}
                                  onClick={(e) => {
                                    if (formData.enseignant.nom_fr === "") {
                                      showSelectionWarning(
                                        "Veuillez sélectionner un enseignant à partir du liste des voeux!"
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Sélectionner Matière</option>
                                  {selectedVoeux?.map((mat: any) => (
                                    <option key={mat.id} value={mat.id}>
                                      {mat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3 d-flex flex-column">
                                <Form.Label htmlFor="semestre">
                                  Type Séance
                                </Form.Label>
                                <div
                                  className="btn-group"
                                  role="group"
                                  aria-label="Basic radio toggle button group"
                                >
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="btnradio"
                                    id="btnradio1"
                                    autoComplete="off"
                                    checked={formData.type_seance === "1"}
                                    onChange={() => {
                                      if (formData.matiere === "") {
                                        showSelectionWarning(
                                          "Veuillez sélectionner une matière d'abord!"
                                        );
                                      } else {
                                        setFormData({
                                          ...formData,
                                          type_seance: "1",
                                          jour: "",
                                        });
                                      }
                                    }}
                                  />
                                  <label
                                    className="btn btn-outline-secondary"
                                    htmlFor="btnradio1"
                                  >
                                    Ordinaire
                                  </label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="btnradio"
                                    id="btnradio2"
                                    autoComplete="off"
                                    checked={formData.type_seance === "1/15"}
                                    onChange={() => {
                                      if (formData.matiere === "") {
                                        showSelectionWarning(
                                          "Veuillez sélectionner une matière d'abord!"
                                        );
                                      } else {
                                        setFormData({
                                          ...formData,
                                          type_seance: "1/15",
                                          jour: "",
                                        });
                                      }
                                    }}
                                  />
                                  <label
                                    className="btn btn-outline-secondary"
                                    htmlFor="btnradio2"
                                  >
                                    Par quinzaine
                                  </label>
                                </div>
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div className="mb-3">
                                <Form.Label htmlFor="jour">Jour</Form.Label>
                                <select
                                  className="form-select"
                                  name="jour"
                                  id="jour"
                                  onChange={selectChangeJour}
                                  value={formData.jour}
                                  onClick={(e) => {
                                    if (formData.type_seance === "") {
                                      showSelectionWarning(
                                        "Veuillez sélectionner un type de séance d'abord!"
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Sélectionner Jour</option>
                                  {formData.matiere !== "" ? (
                                    availableDays.map((day) => (
                                      <>
                                        {day.time === "" ? (
                                          <option
                                            value={day.day}
                                            style={{
                                              background: "#9B7EBD",
                                              color: "#fff",
                                            }}
                                          >
                                            {day.day}
                                          </option>
                                        ) : (
                                          <option
                                            value={day.day}
                                            style={{
                                              background: "#D4BEE4",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {day.day + " | " + day.time}
                                          </option>
                                        )}
                                      </>
                                    ))
                                  ) : (
                                    <></>
                                  )}
                                </select>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={8}>
                              {formData.jour != "" ? (
                                <TimeRange
                                  error={error}
                                  ticksNumber={132}
                                  selectedInterval={[
                                    selectedStart,
                                    selectedEnd,
                                  ]}
                                  timelineInterval={[startTime, endTime]}
                                  onUpdateCallback={errorHandler}
                                  onChangeCallback={onChangeCallback}
                                  disabledIntervals={disabledIntervals}
                                  step={5 * 60 * 1000}
                                  formatTick={(ms) =>
                                    new Date(ms).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  }
                                />
                              ) : (
                                <></>
                              )}
                            </Col>
                            <Col lg={2}>
                              <div className="mb-3">
                                <Form.Label htmlFor="heure_debut">
                                  Heure début
                                </Form.Label>
                                <Flatpickr
                                  className="form-control"
                                  id="heure_debut"
                                  placeholder="--:--"
                                  options={{
                                    enableTime: false,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    onOpen: (
                                      selectedDates,
                                      dateStr,
                                      instance
                                    ) => instance.close(),
                                    time_24hr: true,
                                  }}
                                  value={formData.heure_debut}
                                />
                              </div>
                            </Col>

                            <Col lg={2}>
                              <div className="mb-3">
                                <Form.Label htmlFor="heure_fin">
                                  Heure fin
                                </Form.Label>
                                <Flatpickr
                                  className="form-control"
                                  id="heure_fin"
                                  placeholder="--:--"
                                  readOnly={true}
                                  options={{
                                    enableTime: false,
                                    noCalendar: true,
                                    onOpen: (
                                      selectedDates,
                                      dateStr,
                                      instance
                                    ) => instance.close(),
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                  }}
                                  value={formData.heure_fin}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row className="mt-5">
                            <Col lg={6}>
                              {disponibiliteSalles.length === 0 ? (
                                <div className="d-flex flex-column">
                                  <Button
                                    variant="secondary"
                                    onClick={handleFetchDisponibiliteSalles}
                                    disabled={formData.heure_fin === ""}
                                  >
                                    {roomsAvailabilityRequestStatus.isLoading ===
                                    true ? (
                                      <CustomLoaderForButton></CustomLoaderForButton>
                                    ) : (
                                      <>Salles disponibles?</>
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <div className="mb-3">
                                  {" "}
                                  <select
                                    className="form-select text-muted"
                                    name="etat_compte"
                                    id="etat_compte"
                                    value={formData?.salle}
                                    onChange={handleChangeSalle}
                                  >
                                    <option value="">Sélectionner Salle</option>
                                    {disponibiliteSalles.map(
                                      (salleDisponible) => (
                                        <option
                                          key={salleDisponible._id}
                                          value={salleDisponible._id}
                                        >
                                          {salleDisponible.salle}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              )}
                            </Col>
                            <Col lg={6}>
                              <div className="d-flex flex-column">
                                <Button
                                  variant="primary"
                                  id="add-btn"
                                  onClick={() => {
                                    onSubmitSeance();
                                  }}
                                  disabled={formData.salle === ""}
                                >
                                  {sessionCreationRequestStatus.isLoading ===
                                  true ? (
                                    <CustomLoaderForButton></CustomLoaderForButton>
                                  ) : (
                                    <>Ajouter Séance</>
                                  )}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                )}

                <div className="modal-footer">
                  {canAddSession == false ? (
                    <Button
                      variant="dark"
                      style={{ height: "50px", marginBottom: "10px" }}
                      onClick={handlePrintPDF}
                    >
                      Télécharger PDF
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GestionEmploiClasse;