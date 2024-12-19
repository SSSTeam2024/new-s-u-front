import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Swal from "sweetalert2";
import { useFetchFicheVoeuxsQuery } from "features/ficheVoeux/ficheVoeux";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import Flatpickr from "react-flatpickr";

import {
  Classe,
  useFetchClasseByIdQuery,
  useFetchClassesByTeacherMutation,
} from "features/classe/classe";
import {
  useAddSeanceMutation,
  useDeleteSeanceMutation,
  useFetchAllSeancesByTimeTableIdQuery,
  useGetAllSessionsByScheduleIdMutation,
  useGetSeancesByTeacherMutation,
} from "features/seance/seance";
import CustomLoaderForButton from "Common/CustomLoaderForButton/CustomLoaderForButton";
import { useFetchTimeTableParamsQuery } from "features/timeTableParams/timeTableParams";
import {
  useGetSalleByDayAndTimeMutation,
  useGetSallesDispoRattrapgeMutation,
} from "features/salles/salles";
import TimeRange from "@harveyconnor/react-timeline-range-slider";
import {
  TeacherPeriod,
  useGetTeacherPeriodsByTeacherIdMutation,
  useGetTeachersPeriodsMutation,
} from "features/teachersPeriods/teachersPeriods";
import {
  Enseignant,
  useFetchEnseignantsQuery,
} from "features/enseignant/enseignantSlice";
import CustomLoader from "Common/CustomLoader/CustomLoader";
import { endOfToday, format, set } from "date-fns";
import {
  useAddRattrapageMutation,
  useFetchRattrapagesQuery,
} from "features/rattrapage/rattrapage";
import { Matiere, useFetchMatiereQuery } from "features/matiere/matiere";
import { useGetPeriodByClassMutation } from "features/classPeriod/classPeriod";
import DatePicker from "react-datepicker";

const AjouterRattrapage = () => {
  document.title = " Gestion des rattrapages | Application Smart Institute";
  const { data: paramsData = [] } = useFetchTimeTableParamsQuery();

  const convertTimeStringToMs = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now.getTime();
  };

  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [selectedStart, setSelectedStart] = useState<any>(null);
  const [selectedEnd, setSelectedEnd] = useState<any>(null);
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
        if (formattedTime[0] !== "NaN:NaN") {
          setFormData((prevState) => ({
            ...prevState,
            heure_debut: formattedTime[0],
            heure_fin: formattedTime[1],
          }));
        }
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
    useGetSallesDispoRattrapgeMutation();
  const [disponibiliteSalles, setDisponibiliteSalles] = useState<any[]>([]);
  const [modal_AddParametreModals, setmodal_AddParametreModals] =
    useState<boolean>(false);
  const [heuresFin, setHeuresFin] = useState<any[]>([]);
  const [selectedVoeux, setSelectedVoeux] = useState<any>([]);
  const [selectedJourVoeux, setSelectedJourVoeux] = useState<any>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [availableDays, setAvailableDays] = useState<any[]>([]);
  const [canAddSession, setCanAddSession] = useState<boolean>(false);
  const [teacherSessionsForSingleDay, setTeacherSessionsForSingleDay] =
    useState<any[]>([]);

  //******************************************************************** */
  const [getTeacherPeriodsByTeacherId] =
    useGetTeacherPeriodsByTeacherIdMutation();

  const [getClassesByTeacherId] = useFetchClassesByTeacherMutation();
  const [createRattrapage] = useAddRattrapageMutation();

  const [getEmploiPeriodiqueByClass] = useGetPeriodByClassMutation();

  const [getClassSessionsByScheduleId] =
    useGetAllSessionsByScheduleIdMutation();

  const { data: allRattrapages = [] } = useFetchRattrapagesQuery();

  console.log("allRattrapages", allRattrapages);

  const { data: allTeachers = [] } = useFetchEnseignantsQuery();

  //console.log("allTeachers", allTeachers);

  //? const { data: allMatieres = [] } = useFetchMatiereQuery();
  //? console.log("allMatieres", allMatieres);

  const [classesList, setClassesList] = useState<Classe[]>();

  const [subjectsList, setSubjectsList] = useState<Matiere[]>();

  const [teacherPeriods, setTeacherPeriods] = useState<TeacherPeriod[]>();

  const [classSessionsList, setClassSessionsList] = useState<any>();

  const [classSchedule, setClassSchedule] = useState<any>();

  const [periodicSchedulesIds, setPeriodicSchedulesIds] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<any>(null);

  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState({
    _id: "",
    matiere: "",
    enseignant: {
      nom_fr: "",
      prenom_fr: "",
    },
    classe: {
      nom_classe_fr: "",
    },
    salle: "",
    jour: "1",
    date: "",
    heure_debut: "",
    heure_fin: "",
    semestre: "1",
    etat: "En Cours",
    status: "",
  });

  //**---------------------Functions------------------------------ */

  const handleChangeFiltredMatiere = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      matiere: e.target.value,
    }));

    const givenStart = parseDate(classSchedule?.date_debut!);
    const givenEnd = parseDate(classSchedule?.date_fin!);

    const intersectingIntervals: any = teacherPeriods?.filter((period: any) => {
      const intervalStart = parseDate(period?.id_classe_period?.date_debut!);
      const intervalEnd = parseDate(period?.id_classe_period?.date_fin!);
      return intervalStart <= givenEnd && intervalEnd >= givenStart;
    });

    console.log("intersectingIntervals", intersectingIntervals);

    let periodicIds = intersectingIntervals.map(
      (interval: any) => interval.id_classe_period._id
    );

    console.log("periodicIds", periodicIds);

    setPeriodicSchedulesIds(periodicIds);

    switch (formData.semestre) {
      case "1":
        setMaxDate(parseDate(paramsData[0].semestre1_end));
        break;
      case "2":
        setMaxDate(parseDate(paramsData[0].semestre2_end));
        break;
      default:
        break;
    }
  };

  const handleChangeTeacher = async (e: any) => {
    console.log("e.target.value", e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      enseignant: e.target.value,
      classe: {
        nom_classe_fr: "",
      },
      matiere: "",
      date: "",
      jour: "",
      heure_debut: "",
      heure_fin: "",
      salle: "",
    }));

    let periodsRequestData = {
      id: e.target.value,
      semestre: formData.semestre,
    };

    let res: any = await getTeacherPeriodsByTeacherId(
      periodsRequestData
    ).unwrap();

    console.log("Teacher's periods", res);

    setTeacherPeriods(res);

    let classesRequestData = {
      teacherId: e.target.value,
      semestre: formData.semestre,
    };

    let classes = await getClassesByTeacherId(classesRequestData).unwrap();

    console.log("classes", classes);

    setClassesList(classes);
    setSelectedDate(null);
    setSubjectsList([]);
    setDisponibiliteSalles([]);
    setDisabledIntervals([]);
    setEndTime(null);
    setStartTime(null);
    setSelectedEnd(null);
    setSelectedStart(null);
  };

  const handleChangeClasse = async (e: any) => {
    console.log("e.target.value", e.target.value);

    setFormData((prevState) => ({
      ...prevState,
      classe: e.target.value,
      matiere: "",
      date: "",
      jour: "",
      heure_debut: "",
      heure_fin: "",
      salle: "",
    }));

    let arr: any = [];
    let classe: any = classesList?.filter((c) => c?._id! === e.target.value);
    console.log("classe filter subjects", classe);
    if (formData.semestre == "1") {
      arr = classe[0].matieres?.filter((m: any) => m?.semestre! === "S1");
    } else {
      arr = classe[0].matieres?.filter((m: any) => m?.semestre! === "S2");
    }
    console.log("arr filter subjects", arr);

    let scheduleRequestData = {
      class_id: e.target.value,
      semestre: formData.semestre,
    };

    let periodicSchedule: any = await getEmploiPeriodiqueByClass(
      scheduleRequestData
    ).unwrap();

    console.log("periodicSchedule", periodicSchedule);

    setClassSchedule(periodicSchedule[0]);

    let sessionsRequestData = {
      _id: periodicSchedule[0]._id,
    };

    let classSessions = await getClassSessionsByScheduleId(
      sessionsRequestData
    ).unwrap();

    console.log("classSessions", classSessions);

    let orderedSessions = groupSessionsByDay(classSessions);

    setClassSessionsList(orderedSessions);

    setSubjectsList(arr);
    setDisponibiliteSalles([]);
    setDisabledIntervals([]);
    setEndTime(null);
    setStartTime(null);
    setSelectedEnd(null);
    setSelectedStart(null);
  };

  const handleDateChangeRattrapage = async (
    /* selectedDates: Date[] */ /* event: any */ date: Date
  ) => {
    console.log(formData.matiere);
    // const selectedDate = event.target.value; /* selectedDates[0]; */

    if (date) {
      const formattedDate = format(date, "dd-MM-yyyy");
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      //var d = new Date(selectedDate);
      var dayName = days[date.getDay()];

      let frenshDay = getFrenshDayName(dayName);

      console.log(frenshDay);

      if (frenshDay === "Dimanche") {
        alert("Choisir une autre date!");
        setSelectedDate(null);
        //event.target.value = "";
        // selectedDates = [];
      } else if (formData.matiere === "") {
        showSelectionWarning("Veuillez sélectionner une matière!");
        console.log("no subject");
        setSelectedDate(null);
        //event.target.value = "";
        // selectedDates[0] = null;
      } else {
        console.log("here");
        setSelectedDate(date);
        setFormData((prevState) => ({
          ...prevState,
          date: formattedDate,
        }));
        await runAvailabilityProcess(frenshDay);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        date: "",
        jour: "",
      }));
    }
  };

  const runAvailabilityProcess = async (jourRattrapage: string) => {
    let requestData = {
      teacher_id: formData.enseignant,
      jour: jourRattrapage,
      emplois_periodiques_ids: periodicSchedulesIds,
    };

    let res = await getSessionsByTeacherId(requestData).unwrap();

    console.log("Teacher's sessions", res);

    const teacherSessions = [];

    for (const array of res) {
      for (const session of array) {
        teacherSessions.push(session);
      }
    }

    console.log("teacherSessions", teacherSessions);

    console.log("Class sessions List", classSessionsList[jourRattrapage]);

    setStartTime(convertTimeStringToMs(paramsData[0].day_start_time));
    setEndTime(convertTimeStringToMs(paramsData[0].day_end_time));
    setSelectedStart(convertTimeStringToMs(paramsData[0].day_start_time));
    setSelectedEnd(convertTimeStringToMs("09:00"));

    const filteredRecoverSessions: any = allRattrapages.filter(
      (r) =>
        r?.jour! === jourRattrapage && r?.classe?._id! === formData?.classe!
    );

    console.log("filteredRecoverSessions", filteredRecoverSessions);

    let normalAndRecoverSessions: any[] = [];

    if (classSessionsList[jourRattrapage]) {
      normalAndRecoverSessions = normalAndRecoverSessions.concat(
        classSessionsList[jourRattrapage]
      );
    }

    normalAndRecoverSessions = normalAndRecoverSessions.concat(
      filteredRecoverSessions
    );

    let classIntervals = await findAvailableIntervals(
      normalAndRecoverSessions,
      paramsData[0].day_start_time,
      paramsData[0].day_end_time,
      "class"
    );
    let teacherIntervals = await findAvailableIntervals(
      teacherSessions,
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
      jour: jourRattrapage,
      heure_debut: "",
      heure_fin: "",
      salle: "",
    }));
    setDisponibiliteSalles([]);
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

  const toggleSemestre = () => {
    setFormData((prevState) => {
      return {
        ...prevState,
        semestre: prevState.semestre === "1" ? "2" : "1",
        enseignant: {
          nom_fr: "",
          prenom_fr: "",
        },
        classe: {
          nom_classe_fr: "",
        },
        matiere: "",
        date: "",
        jour: "",
        heure_debut: "",
        heure_fin: "",
        salle: "",
      };
    });
    setSelectedDate(null);
    setClassesList([]);
    setSubjectsList([]);
    setDisponibiliteSalles([]);
    setDisabledIntervals([]);
    setEndTime(null);
    setStartTime(null);
    setSelectedEnd(null);
    setSelectedStart(null);
  };

  const getFrenshDayName = (englishDayName: string) => {
    let dayName = "";
    switch (englishDayName) {
      case "Sunday":
        dayName = "Dimanche";
        break;
      case "Monday":
        dayName = "Lundi";
        break;
      case "Tuesday":
        dayName = "Mardi";
        break;
      case "Wednesday":
        dayName = "Mercredi";
        break;
      case "Thursday":
        dayName = "Jeudi";
        break;
      case "Friday":
        dayName = "Vendredi";
        break;
      case "Saturday":
        dayName = "Samedi";
        break;

      default:
        break;
    }

    return dayName;
  };

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
        classe,
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

  const findAvailableIntervals = async (
    sessions: any[],
    startOfDay: string,
    endOfDay: string,
    who: string
  ) => {
    const available_intervals: { start: string; end: string }[] = [];

    // Convert start and end of day to minutes
    const startOfDayMinutes = timeToMinutes(startOfDay);
    const endOfDayMinutes = timeToMinutes(endOfDay);

    if (sessions && sessions.length > 0) {
      let arr = [...sessions];

      // Sort sessions by start time in ascending order
      arr.sort(
        (a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_debut)
      );

      let previousEndTime = startOfDayMinutes;

      for (const session of arr) {
        const sessionStartTime = timeToMinutes(session.heure_debut);
        const sessionEndTime = timeToMinutes(session.heure_fin);

        // Only record an available interval if there's a gap between previous end time and current session start
        if (sessionStartTime > previousEndTime) {
          available_intervals.push({
            start: minutesToTime(previousEndTime),
            end: minutesToTime(sessionStartTime),
          });
        }

        // Update previousEndTime to cover overlapping sessions properly
        previousEndTime = Math.max(previousEndTime, sessionEndTime);
      }

      // Add any remaining availability after the last session
      if (previousEndTime < endOfDayMinutes) {
        available_intervals.push({
          start: minutesToTime(previousEndTime),
          end: minutesToTime(endOfDayMinutes),
        });
      }
    } else {
      // If no sessions exist, the entire day is available
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

    // Iterate through both lists of intervals
    while (i < classIntervals.length && j < teacherIntervals.length) {
      const classStart = timeToMinutes(classIntervals[i].start);
      const classEnd = timeToMinutes(classIntervals[i].end);
      const teacherStart = timeToMinutes(teacherIntervals[j].start);
      const teacherEnd = timeToMinutes(teacherIntervals[j].end);

      // Find the maximum of the start times (to get the latest start)
      const overlapStart = Math.max(classStart, teacherStart);

      // Find the minimum of the end times (to get the earliest end)
      const overlapEnd = Math.min(classEnd, teacherEnd);

      // If there is a valid overlap
      if (overlapStart < overlapEnd) {
        common_itervals.push({
          start: minutesToTime(overlapStart),
          end: minutesToTime(overlapEnd),
        });
      }

      // Move to the next interval (based on which interval ends first)
      if (classEnd < teacherEnd) {
        i++; // Move to the next class interval
      } else {
        j++; // Move to the next teacher interval
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
    let lastEndTime = timeToMinutes(dayStart); // Starting from the beginning of the day

    for (const interval of commonIntervals) {
      const currentStartTime = timeToMinutes(interval.start);
      if (lastEndTime < currentStartTime) {
        // Add the gap before the current common available interval
        unavailable_intervals.push({
          start: minutesToTime(lastEndTime),
          end: minutesToTime(currentStartTime),
        });
      }
      lastEndTime = timeToMinutes(interval.end);
    }

    // Add the unavailability after the last common interval until the end of the day
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

  //**---------------------Functions------------------------------ */

  //******************************************************************* */

  const navigate = useNavigate();
  const location = useLocation();
  const classeDetails = location.state;
  const [createSeance, sessionCreationRequestStatus] = useAddSeanceMutation();
  const [getSessionsByTeacherId] = useGetSeancesByTeacherMutation();

  const [getTeachersPeriods] = useGetTeachersPeriodsMutation();
  const { data: allVoeux = [] } = useFetchFicheVoeuxsQuery();
  const voeux = allVoeux;

  // const { data: classe } = useFetchClasseByIdQuery(
  //   classeDetails?.id_classe?._id
  // );
  // const { data: allSessions = [], isSuccess: sessionClassFetched } =
  //   useFetchAllSeancesByTimeTableIdQuery(classeDetails?._id!);

  const [deleteSessionById] = useDeleteSeanceMutation();

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setAlertMessage] = useState("");

  const [averageTeachers, setAverageTeachers] = useState<any[]>([]);

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

  const filteredSessions: any = []; /* allSessions.filter(
    (session) => session?.semestre! === classeDetails?.semestre!
  ); */

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

  const groupedSessions = groupSessionsByDay(filteredSessions);

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const maxSessions = Math.max(
    ...days.map((day) =>
      groupedSessions[day] ? groupedSessions[day].length : 0
    )
  );

  function tog_retourParametres() {
    navigate("/gestion-emplois-classe/liste-emplois-classe");
  }

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
        // if (classe?._id === v.classe?._id) {
        //   consernedVoeux = v;
        //   wishList.push({
        //     teacher: element.enseignant,
        //     voeux: consernedVoeux,
        //   });
        //   break;
        // }
      }
    }
  }

  //console.log("wishList", wishList);

  // const selectChangeJour = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const value = event.target.value;
  //   let requestData = {
  //     teacher_id: selectedTeacher?.id,
  //     jour: value,
  //     emplois_periodiques_ids: periodicSchedulesIds,
  //   };

  //   console.log("periodicSchedulesIds", periodicSchedulesIds);

  //   let res = await getSessionsByTeacherId(requestData).unwrap();

  //   console.log("Teacher's sessions", res);

  //   const sessions = [];

  //   for (const array of res) {
  //     for (const session of array) {
  //       sessions.push(session);
  //     }
  //   }

  //   console.log("Final sessions", sessions);

  //   setTeacherSessionsForSingleDay(sessions);

  //   setStartTime(convertTimeStringToMs(paramsData[0].day_start_time));
  //   setEndTime(convertTimeStringToMs(paramsData[0].day_end_time));
  //   setSelectedStart(convertTimeStringToMs(paramsData[0].day_start_time));
  //   setSelectedEnd(convertTimeStringToMs("09:00"));
  //   if (formData.type_seance === "1") {
  //     let classIntervals = await findAvailableIntervals(
  //       groupedSessions[value],
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time,
  //       "class"
  //     );
  //     let teacherIntervals = await findAvailableIntervals(
  //       sessions,
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time,
  //       "teacher"
  //     );
  //     let common = await findCommonIntervals(classIntervals, teacherIntervals);
  //     console.log(common);
  //     await extractUnavailability(
  //       common,
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time
  //     );

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       jour: value,
  //       heure_debut: "",
  //       heure_fin: "",
  //       salle: "",
  //     }));
  //     setDisponibiliteSalles([]);
  //   } else {
  //     let classIntervals = await findFortnightAvailableIntervals(
  //       groupedSessions[value],
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time,
  //       "class"
  //     );

  //     let teacherIntervals = await findFortnightAvailableIntervals(
  //       sessions,
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time,
  //       "teacher"
  //     );

  //     let common = await findCommonIntervals(classIntervals, teacherIntervals);
  //     console.log(common);
  //     await extractUnavailability(
  //       common,
  //       paramsData[0].day_start_time,
  //       paramsData[0].day_end_time
  //     );

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       jour: value,
  //       heure_debut: "",
  //       heure_fin: "",
  //       salle: "",
  //     }));
  //     setDisponibiliteSalles([]);
  //   }
  // };

  const handleFetchDisponibiliteSalles = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        start_time: formData.heure_debut,
        end_time: formData.heure_fin,
        day: formData.jour,
        date_rattrapage: formData.date,
        semestre: formData.semestre,
        date_debut_emploi_period: classSchedule.date_debut,
        date_fin_emploi_period: classSchedule.date_fin,
      };
      console.log("payload", payload);
      let result: any[] = await fetchDisponibiliteSalles(payload).unwrap();
      console.log("disponibilites", result);

      setDisponibiliteSalles(result);
    } catch (err) {
      console.error("Failed to fetch disponibilite salles: ", err);
    }
  };

  const onSubmitRattrapage = async () => {
    try {
      console.log(formData);
      await createRattrapage(formData).unwrap();
      notify();
      navigate("/liste-rattrapages");
      setDisabledIntervals([]);
      setDisponibiliteSalles([]);
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

  const showDeleteAlert = async (session: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const requestData = {
            _id: session._id,
            roomId: session.salle._id,
            startTime: session.heure_debut,
            endTime: session.heure_fin,
            day: session.jour,
          };
          await deleteSessionById(requestData).unwrap();
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Séance a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Annulé", "", "error");
        }
      });
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Séance Ajoutée",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // async function tog_AddSeanceModals() {
  //   setShowForm(true);
  //   let tempIds = [];
  //   for (const wish of wishList) {
  //     tempIds.push(wish?.teacher?._id!);
  //   }

  //   let payload = {
  //     ids_array: tempIds,
  //     semestre: classeDetails.semestre,
  //   };

  //   let result: any = await getTeachersPeriods(payload).unwrap();

  //   console.log("result", result);
  //   setTeachersPeriods(result);

  //   let averages = [];
  //   for (const element of result) {
  //     if (element?.periods!.length === 0) {
  //       let wish_teacher = wishList.filter(
  //         (wish) => wish.teacher._id === element.id_teacher
  //       );
  //       let average = {
  //         teacher: wish_teacher[0].teacher,
  //         hours: 0,
  //       };
  //       averages.push(average);
  //     } else {
  //       let merged = mergeIntervals(element?.periods!);
  //       console.log("MERGED", merged);
  //       let wish_teacher = wishList.filter(
  //         (wish) => wish.teacher._id === element.id_teacher
  //       );
  //       console.log(wish_teacher);
  //       const average = getTeacherAverageHoursPerWeek(
  //         wish_teacher[0].teacher,
  //         merged
  //       );
  //       console.log("AVERAGE", average);
  //       averages.push(average);
  //     }
  //   }
  //   setAverageTeachers(averages);
  //   setShowForm(false);
  //   setCanAddSession(true);
  // }

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

  // const parseDate = (dateStr: string) => {
  //   const [day, month, year] = dateStr.split("-").map(Number);
  //   return new Date(year, month - 1, day);
  // };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const mergeIntervals = (intervals: any[]) => {
    const sortedIntervals = [...intervals];

    sortedIntervals.sort(
      (a: any, b: any) =>
        parseDate(a?.id_classe_period?.date_debut!).getTime() -
        parseDate(b?.id_classe_period?.date_debut!).getTime()
    );

    const splitIntervals: any[] = [];
    for (let interval of sortedIntervals) {
      const startDate = parseDate(interval.id_classe_period?.date_debut!);
      const endDate = parseDate(interval.id_classe_period?.date_fin!);
      const hours = Number(interval.nbr_heure);

      splitIntervals.push({ date: startDate, hours });
      splitIntervals.push({
        date: new Date(endDate.getTime() + 1),
        hours: -hours,
      });
    }

    splitIntervals.sort((a, b) => a.date.getTime() - b.date.getTime());

    const result: any[] = [];
    let currentStartDate = splitIntervals[0].date;
    let currentHours = 0;

    for (let i = 0; i < splitIntervals.length - 1; i++) {
      const { date, hours } = splitIntervals[i];
      currentHours += hours;

      // Determine if this is the end of a unique period
      const nextDate = splitIntervals[i + 1].date;
      if (date.getTime() !== nextDate.getTime()) {
        result.push({
          start_date: formatDate(currentStartDate),
          end_date: formatDate(new Date(nextDate.getTime() - 1)), // Adjust end date by one day
          nbr_heure: currentHours,
        });
        currentStartDate = nextDate;
      }
    }

    let refinedResult = [];

    for (const element of result) {
      if (element.start_date !== element.end_date) {
        refinedResult.push(element);
      }
    }

    return refinedResult;
  };

  const calculateWeeksInInterval = (start_date: string, end_date: string) => {
    // Parse the dates in "DD-MM-YYYY" format
    const [startDay, startMonth, startYear] = start_date.split("-").map(Number);
    const [endDay, endMonth, endYear] = end_date.split("-").map(Number);

    // Create Date objects in "YYYY-MM-DD" format
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // Calculate the difference in time between the two dates
    const diffInTime = endDate.getTime() - startDate.getTime();

    // Convert the time difference from milliseconds to days
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // Calculate the number of weeks, including partial weeks
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

  const handleChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      enseignant: e.target.value,
    }));
  };

  const extractColorClass = (className: string) => {
    // Regular expression to match the color name after 'bg-'
    const match = className.match(/bg-([a-zA-Z0-9-]+)/);

    // Return the matched color name or null if no match is found
    return match ? match[1] : null;
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

  const findFortnightAvailableIntervals = async (
    sessions: any[],
    startOfDay: string,
    endOfDay: string,
    who: string
  ) => {
    const available_intervals: any[] = [];

    // Convert start and end of day to minutes
    const startOfDayMinutes = timeToMinutes(startOfDay);
    const endOfDayMinutes = timeToMinutes(endOfDay);

    if (sessions != undefined) {
      let arr = [...sessions];
      // Sort sessions by start time in ascending order
      arr.sort(
        (a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_fin)
      );

      let previousEndTime = startOfDayMinutes; // Initial previous end time is the start of the day

      for (const session of arr) {
        const sessionStartTime = timeToMinutes(session.heure_debut);
        const sessionEndTime = timeToMinutes(session.heure_fin);

        // If there's a gap between the previous session end and the current session start
        if (sessionStartTime > previousEndTime) {
          available_intervals.push({
            start: minutesToTime(previousEndTime),
            end: minutesToTime(sessionStartTime),
          });
        }

        // Update previousEndTime to the end of the current session
        previousEndTime = Math.max(previousEndTime, sessionEndTime);
        if (session.type_seance === "1/15") {
          available_intervals.push({
            start: session.heure_debut,
            end: session.heure_fin,
          });
        }
      }

      // Check for availability after the last session
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

  const [selectedDateRatt, setSelectedDateRatt] = useState(new Date());
  // const minDate = new Date("2024-11-04");
  // const maxDate = new Date("2024-11-15");

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
                  <div className="mb-3 text-center">
                    <Form.Label htmlFor="semestre">
                      Nouveau Rattrapage
                    </Form.Label>
                  </div>
                </Row>

                <Row
                  style={{
                    paddingLeft: "150px",
                    paddingRight: "150px",
                    marginTop: "50px",
                  }}
                >
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="semestre">Semestre</Form.Label>
                      <div className="form-check form-switch form-switch-lg from-switch-info">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="SwitchCheck6"
                          checked={formData.semestre === "2"}
                          onChange={toggleSemestre}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="SwitchCheck6"
                        >
                          S{formData.semestre}
                        </label>
                      </div>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="enseignant">Enseignant</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="enseignant"
                        id="enseignant"
                        value={formData?.enseignant.nom_fr}
                        onChange={handleChangeTeacher}
                        // onClick={(e) => {
                        //   if (formData.enseignant.nom_fr === "") {
                        //     showSelectionWarning(
                        //       "Veuillez sélectionner un enseignant à partir du liste des voeux!"
                        //     );
                        //   }
                        // }}
                      >
                        <option value="">Sélectionner Enseignant</option>
                        {allTeachers?.map((teacher: any) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.nom_fr} {teacher.prenom_fr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="matiere">Classe</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="matiere"
                        id="matiere"
                        value={formData?.classe?.nom_classe_fr}
                        onChange={handleChangeClasse}
                        onClick={(e) => {
                          if (formData.enseignant.nom_fr === "") {
                            showSelectionWarning(
                              "Veuillez sélectionner un enseignant!"
                            );
                          }
                        }}
                      >
                        <option value="">Sélectionner Classe</option>
                        {classesList?.map((classe: any) => (
                          <option key={classe?._id!} value={classe?._id!}>
                            {classe?.nom_classe_fr!}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="matiere">Matière</Form.Label>
                      <select
                        className="form-select text-muted"
                        name="matiere"
                        id="matiere"
                        value={formData?.matiere}
                        onChange={handleChangeFiltredMatiere}
                        onClick={(e) => {
                          if (formData.classe.nom_classe_fr === "") {
                            showSelectionWarning(
                              "Veuillez sélectionner une classe à partir du liste des classes!"
                            );
                          }
                        }}
                      >
                        <option value="">Sélectionner Matière</option>
                        {subjectsList?.map((mat: any) => (
                          <option key={mat?._id!} value={mat?._id!}>
                            {mat?.matiere!}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="date_rattrapage">Date</Form.Label>
                      {/* <Flatpickr
                        value={formData?.date!}
                        onChange={handleDateChangeRattrapage}
                        //onClick={checkForSubjectSelection}
                        className="form-control flatpickr-input"
                        placeholder="Sélectionner Date"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                        id="date_rattrapage"
                      /> */}
                      <br />
                      {/* <input
                        style={{
                          borderRadius: "5px",
                          borderColor: "#e3e3e3",
                          padding: "8px",
                        }}
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChangeRattrapage}
                      /> */}
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: any) =>
                          handleDateChangeRattrapage(date)
                        }
                        className="form-control"
                        minDate={minDate}
                        maxDate={maxDate}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </Col>
                </Row>
                <Row
                  style={{
                    paddingLeft: "150px",
                    paddingRight: "150px",
                    marginTop: "50px",
                  }}
                >
                  <Col lg={8}>
                    {/* {formData?.jour! !== "" ? ( */}
                    <TimeRange
                      error={error}
                      ticksNumber={132}
                      selectedInterval={[selectedStart, selectedEnd]}
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
                    {/* ) : (
                      <></>
                    )} */}
                  </Col>

                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="heure_debut">Heure début</Form.Label>
                      <Flatpickr
                        className="form-control"
                        id="heure_debut"
                        placeholder="--:--"
                        options={{
                          enableTime: false,
                          noCalendar: true,
                          dateFormat: "H:i",
                          onOpen: (selectedDates, dateStr, instance) =>
                            instance.close(),
                          time_24hr: true,
                        }}
                        value={formData.heure_debut}
                      />
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="mb-3">
                      <Form.Label htmlFor="heure_fin">Heure fin</Form.Label>
                      <Flatpickr
                        className="form-control"
                        id="heure_fin"
                        placeholder="--:--"
                        readOnly={true}
                        options={{
                          enableTime: false,
                          noCalendar: true,
                          onOpen: (selectedDates, dateStr, instance) =>
                            instance.close(),
                          dateFormat: "H:i",
                          time_24hr: true,
                        }}
                        value={formData.heure_fin}
                      />
                    </div>
                  </Col>
                </Row>
                <Row
                  style={{
                    paddingLeft: "350px",
                    paddingRight: "350px",
                    marginTop: "50px",
                  }}
                >
                  <Col lg={6}>
                    {disponibiliteSalles.length === 0 ? (
                      <div className="d-flex flex-column">
                        <Button
                          variant="secondary"
                          onClick={handleFetchDisponibiliteSalles}
                          disabled={
                            formData.heure_debut === "" &&
                            formData.heure_fin === ""
                          }
                        >
                          {roomsAvailabilityRequestStatus.isLoading === true ? (
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
                          {disponibiliteSalles.map((salleDisponible) => (
                            <option
                              key={salleDisponible._id}
                              value={salleDisponible._id}
                            >
                              {salleDisponible.salle}
                            </option>
                          ))}
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
                          onSubmitRattrapage();
                        }}
                        disabled={formData.salle === ""}
                      >
                        {sessionCreationRequestStatus.isLoading === true ? (
                          <CustomLoaderForButton></CustomLoaderForButton>
                        ) : (
                          <>Ajouter Rattrapage</>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>

                <div className="modal-footer"></div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AjouterRattrapage;