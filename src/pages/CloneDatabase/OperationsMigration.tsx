import { useFetchAvisEnseignantQuery } from "features/avisEnseignant/avisEnseignantSlice";
import { useFetchAvisEtudiantQuery } from "features/avisEtudiant/avisEtudiantSlice";
import { useFetchAvisPersonnelQuery } from "features/avisPersonnel/avisPersonnelSlice";
import React, { useState, useRef, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import progressAnimation from "../../assets/images/Animation - 1744894898081.json";
import {
  useDeleteManyActualitesMutation,
  useFetchActualiteQuery,
} from "features/actualite/actualiteSlice";
import {
  useDeleteManyPeriodsMutation,
  useGetAllTeachersPeriodsQuery,
} from "features/teachersPeriods/teachersPeriods";
import { useFetchReclamationsPersonnelQuery } from "features/reclamationPersonnel/reclamationPersonnelSlice";
import { useFetchReclamationsQuery } from "features/reclamationEtudiant/recalamationEtudiantSlice";
import { useFetchReclamationsEnseignantQuery } from "features/reclamationEnseignant/reclamationEnseignantSlice";
import {
  useDeleteManyDeplacementMutation,
  useFetchDeplacementQuery,
} from "features/deplacement/deplacementSlice";
import {
  useDeleteManyNotesProMutation,
  useFetchNotesProQuery,
} from "features/notesPro/notesProSlice";
import {
  useDeleteManyMissionsMutation,
  useFetchMissionQuery,
} from "features/mission/missionSlice";
import { useFetchDemandePersonnelQuery } from "features/demandePersonnel/demandePersonnelSlice";
import { useFetchDemandeEnseignantQuery } from "features/demandeEnseignant/demandeEnseignantSlice";
import { useFetchDemandeEtudiantQuery } from "features/demandeEtudiant/demandeEtudiantSlice";
import {
  useDeleteManyDemandesTiragesMutation,
  useFetchDemandeTiragesQuery,
} from "features/demandeTirage/demandeTirageSlice";
import { swalWithBootstrapButtons } from "helpers/swalButtons";
import Swal from "sweetalert2";
import DemandeComponent from "./DemandeComponent";
import AvisComponent from "./AvisComponent";
import {
  useDeleteManyNoteExamenMutation,
  useFetchNotesExamenQuery,
} from "features/notesExamen/notesExamenSlice";
import ReclamationComponent from "./ReclamationComponent";
import {
  useDeleteExamenMutation,
  useFetchExamensQuery,
} from "features/examens/examenSlice";
import {
  useDeleteManyRattrapageMutation,
  useFetchRattrapagesQuery,
} from "features/rattrapage/rattrapage";
import { useFetchEtudiantsQuery } from "features/etudiant/etudiantSlice";

const OperationsMigration = ({
  onValueChange,
}: {
  onValueChange: (value: any) => void;
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  //! Avis
  const { data: dataFromNewDatabase = [] } = useFetchAvisEtudiantQuery({
    useNewDb: "true",
  });
  const { data: avisEtudiantFromOldDatabase = [] } =
    useFetchAvisEtudiantQuery();
  const { data: avisPeronnels = [] } = useFetchAvisPersonnelQuery({
    useNewDb: "true",
  });
  const { data: avisPeronnelsFromOldDatabase = [] } =
    useFetchAvisPersonnelQuery();
  const { data: avisEnseignants = [] } = useFetchAvisEnseignantQuery({
    useNewDb: "true",
  });
  const { data: avisEnseignantsFromOldDatabase = [] } =
    useFetchAvisEnseignantQuery();

  const { data: AllActualités = [] } = useFetchActualiteQuery({
    useNewDb: "true",
  });

  const { data: AllPeriods = [] } = useGetAllTeachersPeriodsQuery({
    useNewDb: "true",
  });

  const { data: AllActualitésFromTheOldDatabase = [] } =
    useFetchActualiteQuery();

  const { data: AllReclamationPersonnel = [] } =
    useFetchReclamationsPersonnelQuery({ useNewDb: "true" });

  const { data: AllReclamationEtudiant = [] } = useFetchReclamationsQuery({
    useNewDb: "true",
  });

  const { data: AllReclamationEnseignant = [] } =
    useFetchReclamationsEnseignantQuery({ useNewDb: "true" });

  const { data: AllReclamationPersonnelFromTheOldDatabase = [] } =
    useFetchReclamationsPersonnelQuery();

  const { data: AllReclamationEtudiantFromTheOldDatabase = [] } =
    useFetchReclamationsQuery();

  const { data: AllReclamationEnseignantFromTheOldDatabase = [] } =
    useFetchReclamationsEnseignantQuery();

  const { data: AllDeplacements = [] } = useFetchDeplacementQuery({
    useNewDb: "true",
  });

  const { data: AllDeplacementsFromOldDatabase = [] } =
    useFetchDeplacementQuery();

  const { data: AllNotePro = [] } = useFetchNotesProQuery({ useNewDb: "true" });

  const { data: AllNoteProFromOldDatabase = [] } = useFetchNotesProQuery();

  const { data: AllMissions = [] } = useFetchMissionQuery({ useNewDb: "true" });

  const { data: AllMissionsFromOldDatabase = [] } = useFetchMissionQuery();

  const { data: AllDemandesPersonnel = [] } = useFetchDemandePersonnelQuery({
    useNewDb: "true",
  });

  const { data: AllDemancesPersonnelFromOldDatabase = [] } =
    useFetchDemandePersonnelQuery();

  const { data: AllDemandesEnseignants = [] } = useFetchDemandeEnseignantQuery({
    useNewDb: "true",
  });

  const { data: AllDemancesEnseignantsFromOldDatabase = [] } =
    useFetchDemandeEnseignantQuery();

  const { data: AllDemandesEtudiants = [] } = useFetchDemandeEtudiantQuery({
    useNewDb: "true",
  });

  const { data: AllDemancesEtudiantsFromOldDatabase = [] } =
    useFetchDemandeEtudiantQuery();

  const filtredDemandePersonnels = AllDemandesPersonnel.filter(
    (demande) => demande.status === "traité"
  );

  const filtredDemandeEnseignants = AllDemandesEnseignants.filter(
    (demande) => demande.status === "traité"
  );

  const filtredDemandeEtudiants = AllDemandesEtudiants.filter(
    (demande) => demande.status === "traité"
  );

  const filtredDemandePersonnelsFromOldDatabase =
    AllDemancesPersonnelFromOldDatabase.filter(
      (demande) => demande.status === "traité"
    );

  const filtredDemandeEnseignantsFromOldDatabase =
    AllDemancesEnseignantsFromOldDatabase.filter(
      (demande) => demande.status === "traité"
    );

  const filtredDemandeEtudiantsFromOldDatabase =
    AllDemancesEtudiantsFromOldDatabase.filter(
      (demande) => demande.status === "traité"
    );

  const { data: AllDemancesTiragesFromOldDatabase = [] } =
    useFetchDemandeTiragesQuery();

  const { data: AllDemandesTirages = [] } = useFetchDemandeTiragesQuery({
    useNewDb: "true",
  });

  const { data: AllNotesExamensFromOldDatabase = [] } =
    useFetchNotesExamenQuery();

  const { data: AllNotesExamens = [] } = useFetchNotesExamenQuery({
    useNewDb: "true",
  });

  const { data: AllExamensFromOldDatabase = [] } = useFetchExamensQuery();

  const { data: AllExamens = [] } = useFetchExamensQuery({ useNewDb: "true" });

  const { data: AllRattrapagesFromOldDatabase = [] } =
    useFetchRattrapagesQuery();

  const { data: AllRattrapages = [] } = useFetchRattrapagesQuery({
    useNewDb: "true",
  });

  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery({
    useNewDb: "true",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const allIds = AllRattrapages.map((r) => r._id);
  const allSelected = selectedIds.length === allIds.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected || someSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleCheckboxChange = (id: any) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return updated;
    });
  };

  const handleDropdownSelect = (key: any) => {
    if (key === "select") {
      setSelectedIds(allIds);
    } else if (key === "deselect") {
      setSelectedIds([]);
    }
    setShowDropdown(false);
  };

  const getSquareIcon = () => {
    if (allSelected) return "ri-checkbox-line";
    if (someSelected) return "ri-checkbox-indeterminate-line";
    return "ri-checkbox-blank-line";
  };

  const [deleteActualites] = useDeleteManyActualitesMutation();
  const [deleteManyDeplacements] = useDeleteManyDeplacementMutation();
  const [deleteTaches] = useDeleteManyMissionsMutation();
  const [deleteDemandesTirages] = useDeleteManyDemandesTiragesMutation();
  const [deleteManyNoteExamens] = useDeleteManyNoteExamenMutation();
  const [deleteOneExam] = useDeleteExamenMutation();
  const [deleteManyNotePro] = useDeleteManyNotesProMutation();
  const [deleteManyRattrapages] = useDeleteManyRattrapageMutation();
  const [deleteManyPeriods] = useDeleteManyPeriodsMutation();

  const [card, setCard] = useState<string>("Avis");

  const handleCardDisplay = (item: string) => {
    setCard(item);
  };

  //! Dates

  const today = new Date().toISOString().split("T")[0];
  const [dateActualité, setDateActualité] = useState(today);
  const [dateDeplacement, setDateDeplacement] = useState(today);
  const [dateTaches, setDateTaches] = useState(today);
  const [dateDemandesTirages, setDateDemandesTirages] = useState(today);
  const [dateNotePro, setDateNotePro] = useState(today);
  const [dateNoteExamens, setDateNoteExamens] = useState(today);

  //! Click on The flatpicker

  const [isClickedActualité, setIsClickedActualité] = useState<boolean>(false);
  const [isClickedDeplacement, setIsClickedDeplacement] =
    useState<boolean>(false);
  const [isClickedTache, setIsClickedTache] = useState<boolean>(false);
  const [isClickedNotePro, setIsClickedNotePro] = useState<boolean>(false);
  const [isClickedDemandeTirage, setIsClickedDemandeTirage] =
    useState<boolean>(false);
  const [isClickedNoteExamen, setIsClickedNoteExamen] =
    useState<boolean>(false);

  //! Filtred Ids

  const [noteProArray, setNoteProArray] = useState<string[]>([]);
  const [noteExamenArray, setNoteExamenArray] = useState<string[]>([]);
  const [deplacementArray, setDeplacementArray] = useState<string[]>([]);
  const [actualitéArray, setActualitéArray] = useState<string[]>([]);
  const [tacheArray, setTacheArray] = useState<string[]>([]);
  const [demandeTirageArray, setDemandeTirageArray] = useState<string[]>([]);

  const handleSelectDate = (
    e: any,
    setDate: Function,
    data: any[],
    setIds: Function,
    setIsClicked: Function
  ) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);

    const filtered = data.filter(
      (item) => item?.createdAt?.split("T")[0]! < selectedDate
    );
    setIds(filtered.map((d) => d?._id));
    setIsClicked(true);
  };

  const handleDeleteAlert = async ({
    ids,
    useNewDb,
    deleteFn,
    successMessage,
    cancelMessage,
    resetClicked,
  }: {
    ids: string[];
    useNewDb: boolean;
    deleteFn: Function;
    successMessage: string;
    cancelMessage: string;
    resetClicked: Function;
  }) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteFn({ ids, useNewDb });
          resetClicked(false);
          swalWithBootstrapButtons.fire("Supprimé!", successMessage, "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Annulé", cancelMessage, "error");
        }
      });
  };

  const alertDeleteOneExam = async (exam: {
    _id: string;
    useNewDb: boolean;
  }) => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-le !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteOneExam({
            _id: exam._id,
            useNewDb: true,
          });
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le calendrier a été supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le calendrier est en sécurité :)",
            "info"
          );
        }
      });
  };

  const AlertDeleteRattrapages = async (exam: {
    ids: string[];
    useNewDb: boolean;
  }) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteManyRattrapages({
            ids: exam.ids,
            useNewDb: true,
          });
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Rattrapages ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Rattrapages sont en sécurité :)",
            "error"
          );
        }
      });
  };

  const AlertDeleteNotePro = async (exam: {
    ids: string[];
    useNewDb: boolean;
  }) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteManyNotePro({
            ids: exam.ids,
            useNewDb: true,
          });
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Rattrapages ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Rattrapages sont en sécurité :)",
            "error"
          );
        }
      });
  };

  const AlertDeleteAllTeachersPeriods = async (periods: {
    ids: string[];
    useNewDb: true;
  }) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le!",
        cancelButtonText: "Non, annuler!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteManyPeriods({
            ids: periods.ids,
            useNewDb: true,
          });
          swalWithBootstrapButtons.fire(
            "Supprimé!",
            "Emplois des enseignants ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Emplois des enseignants sont en sécurité :)",
            "error"
          );
        }
      });
  };

  const steps = [
    {
      id: "Avis",
      isCompleted:
        (avisEtudiantFromOldDatabase.length > dataFromNewDatabase.length ||
          dataFromNewDatabase.length === 0) &&
        (avisPeronnelsFromOldDatabase.length > avisPeronnels.length ||
          avisPeronnels.length === 0) &&
        (avisEnseignantsFromOldDatabase.length > avisEnseignants.length ||
          avisEnseignants.length === 0),
    },
    {
      id: "Actualités",
      isCompleted:
        AllActualitésFromTheOldDatabase.length > AllActualités.length,
    },
    {
      id: "Emplois",
      isCompleted: AllPeriods.length === 0,
    },
    {
      id: "Examens",
      isCompleted:
        AllExamensFromOldDatabase.length > AllExamens.length ||
        AllExamens.length === 0,
    },
    {
      id: "Rattrapages",
      isCompleted:
        AllRattrapagesFromOldDatabase.length > AllRattrapages.length ||
        AllRattrapages.length === 0,
    },
    {
      id: "Demandes",
      isCompleted:
        (filtredDemandeEnseignantsFromOldDatabase.length >
          filtredDemandeEtudiants.length ||
          filtredDemandeEtudiants.length === 0) &&
        (filtredDemandeEtudiantsFromOldDatabase.length >
          filtredDemandeEnseignants.length ||
          filtredDemandeEnseignants.length === 0) &&
        (filtredDemandePersonnelsFromOldDatabase.length >
          filtredDemandePersonnels.length ||
          filtredDemandePersonnels.length === 0),
    },
    {
      id: "Notes",
      isCompleted:
        AllNotesExamensFromOldDatabase.length > AllNotesExamens.length ||
        AllNotesExamens.length === 0,
    },
    {
      id: "Déplacements",
      isCompleted:
        AllDeplacementsFromOldDatabase.length > AllDeplacements.length ||
        AllDeplacements.length === 0,
    },
    {
      id: "Notes Professionnelles",
      isCompleted:
        AllNoteProFromOldDatabase.length > AllNotePro.length ||
        AllNotePro.length === 0,
    },
    {
      id: "Tâches",
      isCompleted:
        AllMissionsFromOldDatabase.length > AllMissions.length ||
        AllMissions.length === 0,
    },
    {
      id: "Tirages",
      isCompleted:
        AllDemancesTiragesFromOldDatabase.length > AllDemandesTirages.length ||
        AllDemandesTirages.length === 0,
    },
    {
      id: "Réclamations",
      isCompleted:
        (AllReclamationPersonnelFromTheOldDatabase > AllReclamationPersonnel ||
          AllReclamationPersonnel.length === 0) &&
        (AllReclamationEtudiantFromTheOldDatabase > AllReclamationEtudiant ||
          AllReclamationEtudiant.length === 0) &&
        (AllReclamationEnseignantFromTheOldDatabase >
          AllReclamationEnseignant ||
          AllReclamationEnseignant.length === 0),
    },
    {
      id: "Etudiants",
      isCompleted: AllEtudiants.length !== 0,
    },
  ];

  const sections = [
    {
      key: "Tâches",
      data: AllMissions,
      oldData: AllMissionsFromOldDatabase,
      date: dateTaches,
      setDate: setDateTaches,
      isClicked: isClickedTache,
      setIsClicked: setIsClickedTache,
      idArray: tacheArray,
      setIdArray: setTacheArray,
      deleteFn: deleteTaches,
      successMsg: "Tâches ont été supprimées.",
      cancelMsg: "Tâches sont en sécurité :)",
      icon: "ph ph-list-numbers",
    },
    {
      key: "Tirages",
      data: AllDemandesTirages,
      oldData: AllDemancesTiragesFromOldDatabase,
      date: dateDemandesTirages,
      setDate: setDateDemandesTirages,
      isClicked: isClickedDemandeTirage,
      setIsClicked: setIsClickedDemandeTirage,
      idArray: demandeTirageArray,
      setIdArray: setDemandeTirageArray,
      deleteFn: deleteDemandesTirages,
      successMsg: "Demandes Tirages ont été supprimées.",
      cancelMsg: "Demandes Tirages sont en sécurité :)",
      icon: "ph ph-printer",
    },
    {
      key: "Notes Professionnelles",
      data: AllNotePro,
      oldData: AllNoteProFromOldDatabase,
      date: dateNotePro,
      setDate: setDateNotePro,
      isClicked: isClickedNotePro,
      setIsClicked: setIsClickedNotePro,
      idArray: noteProArray,
      setIdArray: setNoteProArray,
      deleteFn: deleteManyNotePro,
      successMsg: "Notes Professionnelles ont été supprimées.",
      cancelMsg: "Notes Professionnelles sont en sécurité :)",
      icon: "ph ph-medal",
    },
    {
      key: "Déplacements",
      data: AllDeplacements,
      oldData: AllDeplacementsFromOldDatabase,
      date: dateDeplacement,
      setDate: setDateDeplacement,
      isClicked: isClickedDeplacement,
      setIsClicked: setIsClickedDeplacement,
      idArray: deplacementArray,
      setIdArray: setDeplacementArray,
      deleteFn: deleteManyDeplacements,
      successMsg: "Déplacements ont été supprimées.",
      cancelMsg: "Déplacements sont en sécurité :)",
      icon: "ph ph-car",
    },
    {
      key: "Actualités",
      data: AllActualités,
      oldData: AllActualitésFromTheOldDatabase,
      date: dateActualité,
      setDate: setDateActualité,
      isClicked: isClickedActualité,
      setIsClicked: setIsClickedActualité,
      idArray: actualitéArray,
      setIdArray: setActualitéArray,
      deleteFn: deleteActualites,
      successMsg: "Actualités ont été supprimées.",
      cancelMsg: "Actualités sont en sécurité :)",
      icon: "ph ph-newspaper",
    },
    {
      key: "Notes des Etudiants",
      data: AllNotesExamens,
      oldData: AllNotesExamensFromOldDatabase,
      date: dateNoteExamens,
      setDate: setDateNoteExamens,
      isClicked: isClickedNoteExamen,
      setIsClicked: setIsClickedNoteExamen,
      idArray: noteExamenArray,
      setIdArray: setNoteExamenArray,
      deleteFn: deleteManyNoteExamens,
      successMsg: "Notes des Etudiants ont été supprimées.",
      cancelMsg: "Notes des Etudiants sont en sécurité :)",
      icon: "ph ph-graduation-cap",
    },
  ];

  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => step.isCompleted).length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  useEffect(() => {
    onValueChange(percentage);
  }, [percentage, onValueChange]);

  return (
    <React.Fragment>
      <Row className="p-2">
        <div className="d-flex align-items-center py-2">
          <div className="flex-shrink-0 me-3">
            <div>
              <div className="fs-16">
                <Lottie
                  lottieRef={lottieRef}
                  onComplete={() => {
                    lottieRef.current?.goToAndPlay(5, true);
                  }}
                  animationData={progressAnimation}
                  loop={false}
                  style={{ width: 60 }}
                />
              </div>
            </div>
          </div>
          <div className="flex-grow-1 mt-3">
            <div className="progress animated-progress custom-progress progress-label">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: `${percentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="label">{percentage}%</div>
              </div>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <Col lg={4}>
          <div className="list-group list-group-fill-success">
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Avis" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Avis")}
            >
              <i className="ri-notification-3-line align-middle me-2"></i>
              <span className="flex-grow-1">Avis</span>
              {(avisEtudiantFromOldDatabase.length >
                dataFromNewDatabase.length ||
                dataFromNewDatabase.length === 0) &&
                (avisPeronnelsFromOldDatabase.length > avisPeronnels.length ||
                  avisPeronnels.length === 0) &&
                (avisEnseignantsFromOldDatabase.length >
                  avisEnseignants.length ||
                  avisEnseignants.length === 0) && (
                  <i
                    className={`ri-check-double-line align-middle fs-22 ms-auto ${
                      card === "Avis" ? "text-light" : "text-success"
                    }`}
                  ></i>
                )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Réclamations" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Réclamations")}
            >
              <i className="ri-thumb-down-line align-middle me-2"></i>
              <span className="flex-grow-1">Réclamations</span>
              {(AllReclamationPersonnelFromTheOldDatabase >
                AllReclamationPersonnel ||
                AllReclamationPersonnel.length === 0) &&
                (AllReclamationEtudiantFromTheOldDatabase >
                  AllReclamationEtudiant ||
                  AllReclamationEtudiant.length === 0) &&
                (AllReclamationEnseignantFromTheOldDatabase >
                  AllReclamationEnseignant ||
                  AllReclamationEnseignant.length === 0) && (
                  <i
                    className={`ri-check-double-line align-middle fs-22 ms-auto ${
                      card === "Réclamations" ? "text-light" : "text-success"
                    }`}
                  ></i>
                )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Demandes" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Demandes")}
            >
              <i className="ri-mail-check-line align-middle me-2"></i>
              <span className="flex-grow-1">Demandes</span>
              {(filtredDemandeEnseignantsFromOldDatabase.length >
                filtredDemandeEtudiants.length ||
                filtredDemandeEtudiants.length === 0) &&
                (filtredDemandeEtudiantsFromOldDatabase.length >
                  filtredDemandeEnseignants.length ||
                  filtredDemandeEnseignants.length === 0) &&
                (filtredDemandePersonnelsFromOldDatabase.length >
                  filtredDemandePersonnels.length ||
                  filtredDemandePersonnels.length === 0) && (
                  <i
                    className={`ri-check-double-line align-middle fs-22 ms-auto ${
                      card === "Demandes" ? "text-light" : "text-success"
                    }`}
                  ></i>
                )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Emplois" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Emplois")}
            >
              <i className="ri-calendar-2-line align-middle me-2"></i>
              <span className="flex-grow-1">Emplois</span>
              {AllPeriods.length === 0 && (
                <i
                  className={`ri-check-double-line align-middle fs-22 ms-auto ${
                    card === "Emplois" ? "text-light" : "text-success"
                  }`}
                ></i>
              )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Examens" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Examens")}
            >
              <i className="ph ph-exam align-middle me-2"></i>
              <span className="flex-grow-1">Examens</span>
              {(AllExamensFromOldDatabase.length > AllExamens.length ||
                AllExamens.length === 0) && (
                <i
                  className={`ri-check-double-line align-middle fs-22 ms-auto ${
                    card === "Examens" ? "text-light" : "text-success"
                  }`}
                ></i>
              )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Rattrapages" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Rattrapages")}
            >
              <i className="ph ph-calendar align-middle me-2"></i>
              <span className="flex-grow-1">Rattrapages</span>
              {(AllRattrapagesFromOldDatabase.length > AllRattrapages.length ||
                AllRattrapages.length === 0) && (
                <i
                  className={`ri-check-double-line align-middle fs-22 ms-auto ${
                    card === "Rattrapages" ? "text-light" : "text-success"
                  }`}
                ></i>
              )}
            </a>
            <a
              href="#"
              className={`list-group-item list-group-item-action d-flex align-items-center ${
                card === "Etudiants" ? "active" : ""
              }`}
              onClick={() => handleCardDisplay("Etudiants")}
            >
              <i className="ph ph-calendar align-middle me-2"></i>
              <span className="flex-grow-1">Etudiants</span>
              {AllEtudiants.length !== 0 && (
                <i
                  className={`ri-check-double-line align-middle fs-22 ms-auto ${
                    card === "Etudiants" ? "text-light" : "text-success"
                  }`}
                ></i>
              )}
            </a>
            {sections.map((section) => (
              <a
                key={section.key}
                href="#"
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  card === section.key ? "active" : ""
                }`}
                onClick={() => handleCardDisplay(section.key)}
              >
                <i className={`${section.icon} align-middle me-2`}></i>
                <span className="flex-grow-1">{section.key}</span>
                {(section.oldData.length > section.data.length ||
                  section.data.length === 0) && (
                  <i
                    className={`ri-check-double-line align-middle fs-22 ms-auto ${
                      card === section.key ? "text-light" : "text-success"
                    }`}
                  ></i>
                )}
              </a>
            ))}
          </div>
        </Col>
        <Col>
          {percentage === 100 && (
            <Row className="mb-1">
              <Col>
                <small>
                  Pour terminer la migration veuillez vous rendre dans la
                  section <strong className="text-danger">Terminer</strong>
                </small>
              </Col>
            </Row>
          )}
          {card === "Avis" && <AvisComponent today={today} />}
          {card === "Emplois" && (
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {AllPeriods.length === 0 ? (
                  <div className="hstack gap-2">
                    <span>Emplois des Enseignants</span>
                    <span className="badge bg-success">
                      <i className="ph ph-check fs-16"></i>
                    </span>
                  </div>
                ) : (
                  <span>Emplois des Enseignants ({AllPeriods.length})</span>
                )}
                {AllPeriods.length !== 0 && (
                  <span
                    className="badge bg-success"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      AlertDeleteAllTeachersPeriods({
                        ids: AllPeriods.map((period: any) => period._id),
                        useNewDb: true,
                      })
                    }
                  >
                    Nettoyer
                  </span>
                )}
                {/* <ul>
                    {AllEnseignants.map((enseignant) => (
                      <li>
                        {enseignant.prenom_fr} {enseignant.nom_fr}
                      </li>
                    ))}
                  </ul> */}
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                  {avisPeronnels.length === 0 ? (
                    <div className="hstack gap-2">
                      <span>Emplois des Enseignants</span>
                      <span className="badge bg-success">
                        <i className="ph ph-check fs-16"></i>
                      </span>
                    </div>
                  ) : (
                    <span>
                      Emplois des Enseignants ({avisPeronnels.length})
                    </span>
                  )}
                  {avisPeronnels.length !== 0 && (
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={handleSelectDate}
                      className="w-50 text-center"
                      min={today}
                    />
                  )}
                  {avisPeronnels.length !== 0 && (
                    <span
                      className="badge bg-success"
                      style={{ cursor: "pointer" }}
                      onClick={alertDeleteAvisEnseignant}
                    >
                      Nettoyer
                    </span>
                  )}
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {avisEnseignants.length === 0 ? (
                    <div className="hstack gap-2">
                      <span>Fiches des Voeux</span>
                      <span className="badge bg-success">
                        <i className="ph ph-check fs-16"></i>
                      </span>
                    </div>
                  ) : (
                    <span>Fiches des Voeux ({avisEnseignants.length})</span>
                  )}
                  {avisEnseignants.length !== 0 && (
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={handleSelectDateAvisEnseignant}
                      className="w-50 text-center"
                      max={today}
                    />
                  )}
                  {avisEnseignants.length !== 0 && (
                    <span
                      className="badge bg-success"
                      style={{ cursor: "pointer" }}
                      onClick={alertDeleteAvisEnseignant}
                    >
                      Nettoyer
                    </span>
                  )}
                </li> */}
            </ul>
          )}
          {card === "Réclamations" && <ReclamationComponent today={today} />}
          {card === "Demandes" && <DemandeComponent today={today} />}
          {sections
            .filter((section) => section.key === card)
            .map((section) => (
              <Card className="p-3" key={section.key}>
                <Row className="d-flex align-items-center">
                  <Col>
                    {section.data.length === 0 ? (
                      <div className="hstack gap-2">
                        <span>{section.key}</span>
                        <span className="badge bg-success">
                          <i className="ph ph-check fs-16"></i>
                        </span>
                      </div>
                    ) : (
                      <Form.Label>
                        {section.key} ({section.data.length})
                      </Form.Label>
                    )}
                  </Col>
                  {section.data.length !== 0 && (
                    <Col>
                      <Form.Control
                        type="date"
                        value={section.date}
                        onChange={(e) =>
                          handleSelectDate(
                            e,
                            section.setDate,
                            section.data,
                            section.setIdArray,
                            section.setIsClicked
                          )
                        }
                        className="w-75 text-center"
                        max={today}
                      />
                    </Col>
                  )}
                </Row>
                {section.isClicked && (
                  <Row>
                    <Col>
                      <span>{section.key} avant </span>
                      <strong>{section.date}</strong> ({section.idArray.length}/
                      {section.data.length})
                    </Col>
                    <Col className="text-end">
                      <span
                        className="badge bg-success"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleDeleteAlert({
                            ids: section.idArray,
                            useNewDb: true,
                            deleteFn: section.deleteFn,
                            successMessage: section.successMsg,
                            cancelMessage: section.cancelMsg,
                            resetClicked: section.setIsClicked,
                          })
                        }
                      >
                        Nettoyer
                      </span>
                    </Col>
                  </Row>
                )}
              </Card>
            ))}
          {card === "Examens" && (
            <Card>
              <ul>
                {AllExamens.map((exam) => (
                  <li className="mb-3">
                    <Row>
                      <Col lg={9}>
                        <strong>
                          {exam.type_examen} _ {exam.session} _ {exam.semestre}
                        </strong>{" "}
                        de <strong>{exam.period.split("/")[0]}</strong> jusqu'au{" "}
                        <strong>{exam.period.split("/")[1]}</strong>
                      </Col>
                      <Col>
                        <span
                          className="badge bg-success"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            alertDeleteOneExam({
                              _id: exam?._id!,
                              useNewDb: true,
                            })
                          }
                        >
                          Nettoyer
                        </span>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {card === "Rattrapages" && (
            <Card>
              <Row className="p-1">
                <Col lg={1}>
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <i
                      className={getSquareIcon()}
                      style={{
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                      onClick={toggleSelectAll}
                    ></i>
                    <i
                      className="ri-arrow-down-s-fill"
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => setShowDropdown((prev) => !prev)}
                    ></i>

                    {showDropdown && (
                      <div
                        className="dropdown-menu show"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1000,
                        }}
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => handleDropdownSelect("select")}
                        >
                          Tout sélectionner
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDropdownSelect("deselect")}
                        >
                          Tout désélectionner
                        </button>
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg={1} className="text-end mt-2">
                  {allSelected ||
                    (someSelected && (
                      <span
                        className="badge bg-light text-dark fs-15"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          AlertDeleteRattrapages({
                            ids: selectedIds,
                            useNewDb: true,
                          })
                        }
                      >
                        <i className="ri-delete-bin-line"></i>
                      </span>
                    ))}
                </Col>
              </Row>
              <Row className="p-3">
                <div className="list-group">
                  {AllRattrapages.map((rattrapage) => (
                    <label className="list-group-item">
                      <input
                        className="form-check-input me-1"
                        type="checkbox"
                        checked={selectedIds.includes(rattrapage._id)}
                        onChange={() => handleCheckboxChange(rattrapage._id)}
                      />
                      <strong>S{rattrapage.semestre}</strong> le{" "}
                      <strong>{rattrapage.date} </strong>
                      de <strong>{rattrapage.heure_debut}</strong> au{" "}
                      <strong>{rattrapage.heure_fin}</strong>
                    </label>
                  ))}
                </div>
              </Row>
            </Card>
          )}
          {card === "Etudiants" && (
            <Card className="p-2">Etudiants ({AllEtudiants.length})</Card>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OperationsMigration;
