import React, { useEffect, useState } from "react";
import { selectCurrentUser } from "features/account/authSlice";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useFetchUserPermissionsByUserIdQuery } from "../features/userPermissions/userPermissionSlice";
import { useFetchMigrateValueQuery } from "features/cloneDb/cloneDb";

const Navdata = () => {
  const user: any = useSelector((state: RootState) => selectCurrentUser(state));
  const {
    data: userPermissions,
    error,
    isLoading,
  } = useFetchUserPermissionsByUserIdQuery({ userId: user?._id! });

  const { data: migrationValue } = useFetchMigrateValueQuery();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  useEffect(() => {
    if (error) {
      console.error("Error fetching user permissions:", error);
    }
  }, [userPermissions, error, isLoading, migrationValue]);

  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isResultat, setIsResultat] = useState(false);
  const [isMigration, setIsMigration] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isAvisEtudiant, setIsAvisEtudiant] = useState(false);
  const [isAvisEnseignant, setIsAvisEnseignant] = useState(false);
  const [isAvisPersonnel, setIsAvisPersonnel] = useState(false);
  const [isActualite, setIsActualite] = useState(false);
  const [isParametreEtudiant, setIsParametreEtudiant] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [isParametre, setIsParametre] = useState(false);
  const [isLocalization, setIsLocalization] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isEtudiant, setIsEtudiant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPapier, setIsPapier] = useState(false);
  const [isEnseignant, setIsEnseignant] = useState(false);
  const [isPersonnel, setIsPersonnel] = useState(false);
  const [isDeaprtement, setIsDeaprtement] = useState(false);
  const [isParametrage, setIsParametrage] = useState(false);
  const [isEmplois, setIsEmplois] = useState(false);
  const [isRattrapage, setIsRattrapage] = useState(false);
  const [isExamen, setIsExamen] = useState(false);
  const [isVariable, setIsVariable] = useState(false);
  const [isNotesExamen, setIsNotesExamen] = useState(false);
  const [isConge, setIsConge] = useState(false);
  const [isStage, setIsStage] = useState(false);
  const [isDirecteurStage, setIsDirecteurStage] = useState(false);
  const [isDeplacement, setIsDeplacement] = useState(false);
  const [isParcours, setIsParcours] = useState(false);
  const [isNotesProfessionnelles, setIsNotesProfessionnelles] = useState(false);
  const [isApplicationEnseignant, setIsApplicationEnseignant] = useState(false);
  const [isMission, setIsMission] = useState(false);
  const [isModele, setIsModele] = useState(false);
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel3, setIsLevel3] = useState(false);
  const [isLevel4, setIsLevel4] = useState(false);
  const [isLevel5, setIsLevel5] = useState(false);
  const [isLevel6, setIsLevel6] = useState(false);
  const [isLevel7, setIsLevel7] = useState(false);
  const [isBureauOrdre, setIsBureauOrdre] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
      });
    }
  }
  function linkInRoutes(link: string, routes: string[]): boolean {
    return routes.includes(link);
  }

  function filterMenuItems(menuItems: any[], routes: string[]): any[] {
    return menuItems.filter((item) => {
      if (item.subItems) {
        item.subItems = filterMenuItems(item.subItems, routes);

        return item.subItems.length > 0;
      }
      return linkInRoutes(item.link, routes);
    });
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Ecommerce") {
      setIsEcommerce(false);
    }
    if (iscurrentState !== "Resultat") {
      setIsResultat(false);
    }
    if (iscurrentState !== "Stage") {
      setIsStage(false);
    }
    if (iscurrentState !== "DirecteurStage") {
      setIsDirecteurStage(false);
    }
    if (iscurrentState !== "Migration") {
      setIsMigration(false);
    }
    if (iscurrentState !== "Orders") {
      setIsOrder(false);
    }
    if (iscurrentState !== "Invoice") {
      setIsInvoice(false);
    }
    if (iscurrentState !== "Parametre") {
      setIsParametre(false);
    }
    if (iscurrentState !== "Localization") {
      setIsLocalization(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "AvisEtudiant") {
      setIsAvisEtudiant(false);
    }
    if (iscurrentState !== "AvisEnseignant") {
      setIsAvisEnseignant(false);
    }
    if (iscurrentState !== "AvisPersonnel") {
      setIsAvisPersonnel(false);
    }
    if (iscurrentState !== "Actualite") {
      setIsActualite(false);
    }
    if (iscurrentState !== "Etudiant") {
      setIsEtudiant(false);
    }
    if (iscurrentState !== "Admin") {
      setIsAdmin(false);
    }
    if (iscurrentState !== "Enseignant") {
      setIsEnseignant(false);
    }
    if (iscurrentState !== "Personnel") {
      setIsPersonnel(false);
    }
    if (iscurrentState !== "Departement") {
      setIsDeaprtement(false);
    }
    if (iscurrentState !== "Parametrage") {
      setIsParametrage(false);
    }
    if (iscurrentState !== "Conge") {
      setIsConge(false);
    }
    if (iscurrentState !== "Deplacement") {
      setIsDeplacement(false);
    }
    if (iscurrentState !== "Mission") {
      setIsMission(false);
    }
    if (iscurrentState !== "NotesProfessionelles") {
      setIsNotesProfessionnelles(false);
    }
    if (iscurrentState !== "Modele") {
      setIsModele(false);
    }
    if (iscurrentState !== "ParametreEtudiant") {
      setIsParametreEtudiant(false);
    }
    if (iscurrentState !== "PapierAdministratif") {
      setIsPapier(false);
    }
    if (iscurrentState !== "Rattrapages") {
      setIsRattrapage(false);
    }
    if (iscurrentState !== "Emplois") {
      setIsEmplois(false);
    }
    if (iscurrentState !== "Examen") {
      setIsExamen(false);
    }
    if (iscurrentState !== "NotesExamen") {
      setIsNotesExamen(false);
    }
    if (iscurrentState !== "Parcours") {
      setIsParcours(false);
    }
    if (iscurrentState !== "ApplicationEnseignant") {
      setIsApplicationEnseignant(false);
    }
    if (iscurrentState !== "Variable") {
      setIsVariable(false);
    }
    if (iscurrentState !== "bureau_ordre") {
      setIsBureauOrdre(false);
    }
    if (iscurrentState !== "Paramétrages") {
      setIsSettings(false);
    }
  }, [
    iscurrentState,
    isEcommerce,
    isOrder,
    isInvoice,
    isParametre,
    isLocalization,
    isAuth,
    isMultiLevel,
    isAvisEtudiant,
    isAvisEnseignant,
    isAvisPersonnel,
    isEtudiant,
    isAdmin,
    isPapier,
    isEnseignant,
    isPersonnel,
    isDeaprtement,
    isParametrage,
    isMission,
    isParametreEtudiant,
    isExamen,
    isNotesExamen,
    isParcours,
    isApplicationEnseignant,
    isVariable,
    isBureauOrdre,
    isSettings,
    isMigration,
    isResultat,
    isStage,
    isDirecteurStage,
  ]);
  let routes = userPermissions
    ? userPermissions.map((permission) => permission.path)
    : [];

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    //dashboard
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "bi bi-speedometer2",
      link: "/dashboard",
    },

    // gestion etudiant
    {
      id: "Gestion-des-Etudiants",
      label: "Gestion des Etudiants",
      link: "/#",
      icon: "bi bi-person-gear",
      click: function (e: any) {
        e.preventDefault();
        setIsEtudiant(!isEtudiant);
        setIscurrentState("Etudiant");
        updateIconSidebar(e);
      },
      stateVariables: isEtudiant,
      subItems: [
        {
          id: "AjouterEtudiant",
          label: "Ajouter un Etudiant",
          link: "/gestion-etudiant/ajouter-etudiant",
          parentId: "Gestion-des-Etudiant",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "GestionEtudiant",
          label: "Liste Des Etudiants",
          link: "/gestion-etudiant/liste-etudiants",
          parentId: "Gestion-des-Etudiants",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "RepartitionGroupes",
          label: "Répartition des groupes",
          link: "/gestion-etudiant/repartition-groupe",
          parentId: "Gestion-des-Etudiants",
          icon: "bi bi-person-plus-fill",
        },
        {
          id: "RechercheAvance",
          label: "Recherche avancé",
          link: "/gestion-etudiant/recherche-avance",
          parentId: "Gestion-des-Etudiants",
          icon: "bi bi-person-plus-fill",
        },
      ],
    },
    // gestion enseignant
    {
      id: "gestion-enseignant",
      label: "Gestion Enseignants",
      link: "/#",
      icon: "bi bi-person-video3",
      click: function (e: any) {
        e.preventDefault();
        setIsEnseignant(!isEnseignant);
        setIscurrentState("Enseignant");
        updateIconSidebar(e);
      },
      stateVariables: isEnseignant,
      subItems: [
        {
          id: "AjouterEnseignant",
          label: "Ajouter un Enseignant",
          link: "/gestion-enseignant/ajouter-enseignant",
          parentId: "Gestion-enseignant",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "GestionEnseignant",
          label: "Liste Des Enseignants",
          link: "/gestion-enseignant/liste-enseignants",
          parentId: "Gestion-enseignant",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "RepartitionEnseignants",
          label: "Répartition des enseignants",
          link: "/gestion-enseignant/repartition-enseignant",
          parentId: "Gestion-enseignant",
          icon: "bi bi-person-plus-fill",
        },
        {
          id: "GestionEnseignant",
          label: "Dossier Administratif",
          link: "/gestion-enseignant/liste-dossier-administartif",
          parentId: "Gestion-enseignant",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "GestionEnseignant",
          label: "Liste des dossiers archivés",
          link: "/gestion-enseignant/liste-archive-dossier-administratif",
          parentId: "Gestion-enseignant",
          icon: "bi bi-person-lines-fill",
        },
      ],
    },
    //gestion personnel
    {
      id: "Gestion-Personnel",
      label: "Gestion Personnels",
      link: "/#",
      icon: "bi bi-person-square",
      click: function (e: any) {
        e.preventDefault();
        setIsPersonnel(!isPersonnel);
        setIscurrentState("Personnel");
        updateIconSidebar(e);
      },
      stateVariables: isPersonnel,
      subItems: [
        {
          id: "AjouterPersonnel",
          label: "Ajouter un Personnel",
          link: "/gestion-personnel/ajouter-personnel",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "GestionPersonnel",
          label: "Liste Des Personnels",
          link: "/gestion-personnel/liste-personnels",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "RepartitionPersonnels",
          label: "Répartition des Personnels",
          link: "/gestion-personnel/repartition-personnel",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-plus-fill",
        },
        {
          id: "AbsencePersonnels",
          label: "Absence des Personnels",
          link: "/gestion-personnel/absence-personnel",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-plus-fill",
        },
        {
          id: "GestionPersonnel",
          label: "Dossier Administratif",
          link: "/gestion-personnel/liste-dossier-administartif",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "GestionPersonnel",
          label: "Liste des dossiers archivés",
          link: "/gestion-personnel/liste-archive-dossier-administratif",
          parentId: "Gestion-Personnel",
          icon: "bi bi-person-lines-fill",
        },
      ],
    },

    // avis etudiant
    {
      id: "Gestion-des-Avis",
      label: "Avis Etudiant",
      link: "/avis-etudiant/liste-avis-etudiant",
      icon: "bi bi-megaphone",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisEtudiant(!isAvisEtudiant);
        setIscurrentState("AvisEtudiant");
        updateIconSidebar(e);
      },
      stateVariables: isAvisEtudiant,
    },
    // avis enseignant
    {
      id: "Avis-enseignant",
      label: "Avis Enseignant",
      link: "/avis-enseignant/liste-avis-enseignant",
      icon: "bi bi-bell",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisEnseignant(!isAvisEnseignant);
        setIscurrentState("AvisEnseignant");
        updateIconSidebar(e);
      },
      stateVariables: isAvisEnseignant,
    },
    //avis personnel
    {
      id: "Avis-Personnel",
      label: "Avis Personnel",
      link: "/avis-personnel/liste-avis-personnel",
      icon: "bi bi-patch-exclamation",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisPersonnel(!isAvisPersonnel);
        setIscurrentState("AvisPersonnel");
        updateIconSidebar(e);
      },
      stateVariables: isAvisPersonnel,
    },
    // actualite
    {
      id: "Actualite",
      label: "Actualités",
      link: "/actualite/liste-actualite",
      icon: "bi bi-chat-quote",
      click: function (e: any) {
        e.preventDefault();
        setIsActualite(!isActualite);
        setIscurrentState("Actualite");
        updateIconSidebar(e);
      },
      stateVariables: isActualite,
    },
    // demande etudiant
    {
      id: "Demande-etudiant",
      label: "Demande Etudiant",
      link: "/demandes-etudiant/Liste-demandes-etudiant",
      icon: "bi bi-patch-question",
    },
    // demande enseignant
    {
      id: "Demande-enseignant",
      label: "Demande Enseignant",
      link: "/demandes-enseignant/liste-demande-enseignant",
      icon: "bi bi-envelope-exclamation",
    },
    // demande personnel
    {
      id: "Demande-personnel",
      label: "Demande Personnel",
      link: "/demandes-personnel/liste-demande-personnel",
      icon: "bi bi-inboxes",
    },
    // reclamation etudiant
    {
      id: "Reclamation-etudiant",
      label: "Réclamation Etudiant",
      link: "/reclamation-etudiant/liste-reclamation-etudiant",
      icon: "bi bi-person-exclamation",
    },
    // reclamation enseignant
    {
      id: "Reclamation-enseignant",
      label: "Réclamation Enseignant",
      link: "/reclamation-enseignant/liste-reclamation-enseignant",
      icon: "bi bi-emoji-frown",
    },
    // reclamation personnel
    {
      id: "Reclamation-personnel",
      label: "Réclamation Personnel",
      link: "/reclamation-personnel/liste-reclamation-personnel",
      icon: "bi bi-hand-thumbs-down",
    },
    // Rattrapage
    {
      id: "Avis-rattrapage",
      label: "Avis Rattrapage",
      link: "/AvisRattrapage",
      icon: "bi bi-book-half",
    },
    // gestion presence
    {
      id: "gestionPresence",
      label: "Gestion des Présences",
      icon: "bi bi-person-check",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsOrder(!isOrder);
        setIscurrentState("Orders");
        updateIconSidebar(e);
      },
      stateVariables: isOrder,
      subItems: [
        {
          id: "Pointages-enseignants",
          label: "Pointage Enseignant",
          link: "/orders-list-view",
          parentId: "gestionPresence",
          icon: "bi bi-fingerprint",
        },
        {
          id: "Absence-enseignant",
          label: "Absence Enseignant",
          link: "/orders-overview",
          parentId: "gestionPresence",
          icon: "bi bi-person-exclamation",
        },
      ],
    },
    //! Application Enseignant
    {
      id: "application_enseignant",
      label: "Application Enseignant",
      icon: "bi bi-window-split",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsApplicationEnseignant(!isApplicationEnseignant);
        setIscurrentState("ApplicationEnseignant");
        updateIconSidebar(e);
      },
      stateVariables: isApplicationEnseignant,
      subItems: [
        {
          id: "Absences",
          label: "Absences",
          link: "/application-enseignant/lister-absence",
          parentId: "application_enseignant",
          icon: "bi bi-fingerprint",
        },
        {
          id: "Cours",
          label: "Supports",
          link: "/application-enseignant/lister-cours",
          parentId: "application_enseignant",
          icon: "bi bi-person-exclamation",
        },
      ],
    },
    //gestion departement
    {
      id: "departement",
      label: "Gestion Département",
      icon: "bi bi-building-gear",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsDeaprtement(!isDeaprtement);
        setIscurrentState("Departement");
        updateIconSidebar(e);
      },
      stateVariables: isDeaprtement,
      subItems: [
        {
          id: "salles",
          label: "Salles",
          icon: "bi bi-door-closed-fill",
          link: "/departement/gestion-salles/liste-salles",
        },
        {
          id: "classes",
          label: "Groupes",
          icon: "bi bi-people-fill",
          link: "/departement/gestion-classes/liste-classes",
        },
        {
          id: "departements",
          label: "Départements",
          icon: "bi bi-house-gear-fill",
          link: "/departement/gestion-departements/liste-departements",
        },
      ],
    },
    //gestion parcours
    {
      id: "parcours",
      label: "Plan d'études",
      icon: "bi bi-list-check",
      link: "/parcours",
      click: function (e: any) {
        e.preventDefault();
        setIsParcours(!isParcours);
        setIscurrentState("Parcours");
        updateIconSidebar(e);
      },
      stateVariables: isParcours,
      subItems: [
        {
          id: "matieres",
          label: "Matières",
          icon: "bi bi-journals",
          link: "/departement/gestion-matieres/liste-matieres",
          parentId: "matiere",
        },

        {
          id: 1,
          label: "Parcours",
          link: "/parcours/gestion-parcours/liste-parcours",
          icon: "bi bi-list",
        },
        {
          id: 3,
          label: "Types des parcours",
          link: "/parcours/gestion-parcours/liste-type-parcours",
          icon: "bi bi-list",
        },

        {
          id: 2,
          label: "Niveaux",
          link: "/departement/gestion-classes/liste-niveau",
          icon: "bi bi-sliders2-vertical",
        },
        {
          id: 2,
          label: "Cycles",
          link: "/parcours/gestion-parcours/liste-cycle",
          icon: "bi bi-bar-chart-step",
        },
        {
          id: 3,
          label: "Spécialités",
          link: "/departement/gestion-classes/liste-section",
          icon: "bi bi-diagram-3-fill",
        },
        //added liste mentions classess
        {
          id: 4,
          label: "Mentions",
          link: "/departement/gestion-classes/liste-mentions",
          icon: "bi bi-trophy-fill",
        },
        //added liste domaines classess
        {
          id: 5,
          label: "Domaines",
          link: "/departement/gestion-classes/liste-domaines",
          icon: "bi bi-globe2",
        },
      ],
    },

    //gestion emploi
    {
      id: "emplois",
      label: "Gestion Emplois",
      icon: "bi bi-calendar-range",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsEmplois(!isEmplois);
        setIscurrentState("Emplois");
        updateIconSidebar(e);
      },
      stateVariables: isEmplois,
      subItems: [
        {
          id: "emplois-enseignants",
          label: "Emplois de Temps Enseignants",
          icon: "bi bi-calendar-week-fill",
          link: "/gestion-emplois/emlpoi-enseignant/liste-emplois",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel5(!isLevel5);
          },
          stateVariables: isLevel5,
          childItems: [
            {
              id: 1,
              label: "Liste Des Emplois",
              link: "/gestion-emplois/emlpoi-enseignant/liste-emplois",
              icon: "bi bi-list-task",
            },
            {
              id: 2,
              label: "Equilibre horaires",
              link: "/gestion-emplois/emlpoi-enseignant/tableau-charges-horaires",
              icon: "bi bi-table",
            },
          ],
        },
        {
          id: "emplois-classes",
          label: "Emplois de Temps Classes",
          icon: "bi bi-calendar-week-fill",
          link: "/gestion-emplois/emploi-classe/liste-emplois",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel6(!isLevel6);
          },
          stateVariables: isLevel6,
          childItems: [
            {
              id: 1,
              label: "Liste Des Emplois",
              link: "/gestion-emplois/emploi-classe/liste-emplois",
              icon: "bi bi-list-task",
            },
            {
              id: 2,
              label: "Equilibre horaires",
              link: "/gestion-emplois/emploi-classe/tableau-des-charges-horaires-classes",
              icon: "bi bi-list-task",
            },
          ],
        },
        {
          id: "ficheVoeux",
          label: "Fiches des Voeux Enseignants",
          icon: "bi bi-postcard-heart",
          link: "/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux",
          click: function (e: any) {
            e.preventDefault();
            setIsLevel7(!isLevel7);
          },
          stateVariables: isLevel7,
        },
      ],
    },

    // gestion rattrapages
    {
      id: "Gestion-des-rattrapages",
      label: "Gestion des Rattrapages",
      link: "/rattrapage/liste-rattrapages",
      icon: "bi bi-calendar-event",
      click: function (e: any) {
        e.preventDefault();
        setIsRattrapage(!isRattrapage);
        setIscurrentState("Rattrapages");
        updateIconSidebar(e);
      },
      stateVariables: isRattrapage,
    },
    //* Gestion Examens
    {
      id: "Gestion-des-examens",
      label: "Planification des Examens",
      link: "/gestion-examen/liste-des-calendrier",
      icon: "bi bi-file-medical",
      click: function (e: any) {
        e.preventDefault();
        setIsExamen(!isExamen);
        setIscurrentState("Examen");
        updateIconSidebar(e);
      },
      stateVariables: isExamen,
    },
    //* Gestion Notes Examen
    {
      id: "Gestion-des-Notes",
      label: "Gestion des Notes",
      link: "/gestion-examen/liste-des-notes-examen",
      icon: "bi bi-123",
      click: function (e: any) {
        e.preventDefault();
        setIsNotesExamen(!isNotesExamen);
        setIscurrentState("NotesExamen");
        updateIconSidebar(e);
      },
      stateVariables: isNotesExamen,
    },
    //! Resultats
    {
      id: "Resultats",
      label: "Gestion des resultats",
      link: "/gestion-des-resultats/liste",
      icon: "bi bi-check-all",
    },
    //! Gestion des stages
    {
      id: "Stage",
      label: "Gestion des stages",
      icon: "bi bi-buildings",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsStage(!isStage);
        setIscurrentState("Stage");
        updateIconSidebar(e);
      },
      stateVariables: isStage,
      subItems: [
        {
          id: "stages",
          label: "Stages",
          link: "/gestion-des-stages/liste-stages",
          parentId: "Stage",
          icon: "bi bi-journal-text",
        },
        {
          id: "type-stage",
          label: "Types Stage",
          link: "/gestion-des-stages/liste-types-stage",
          parentId: "Stage",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "partenaires",
          label: "Partenaires",
          link: "/gestion-des-stages/liste-partenaires",
          parentId: "Stage",
          icon: "bi bi-person-fill-add",
        },
      ],
    },
    //! Directeur de stage
    {
      id: "DirecteurStage",
      label: "Directeur des stages",
      icon: "bi bi-buildings",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsDirecteurStage(!isDirecteurStage);
        setIscurrentState("DirecteurStage");
        updateIconSidebar(e);
      },
      stateVariables: isDirecteurStage,
      subItems: [
        {
          id: "commission",
          label: "Commissions",
          link: "/directeur-de-stage/liste-des-commissions",
          parentId: "DirecteurStage",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "avis_commission",
          label: "Avis de Commission",
          link: "/directeur-de-stage/liste-des-avis-de-commission",
          parentId: "DirecteurStage",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "ajouter_avis_commission",
          label: "Ajouter Avis de Commission",
          link: "/directeur-de-stage/ajouter-avis-de-commission",
          parentId: "DirecteurStage",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "pv_generer",
          label: "Liste des PV",
          link: "/directeur-de-stage/liste-des-pv",
          parentId: "DirecteurStage",
          icon: "bi bi-person-fill-add",
        },
      ],
    },
    //Gestion des congés
    {
      id: "congés",
      label: "Gestion des congés",
      icon: "bi bi-shop-window",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsConge(!isConge);
        setIscurrentState("conge");
        updateIconSidebar(e);
      },
      stateVariables: isConge,
      subItems: [
        {
          id: "liste-conge",
          label: "Liste Des Congés",
          link: "/type-conge/Liste-type-conge",
          parentId: "congés",
          icon: "bi bi-journal-text",
        },
        {
          id: "Solde-Conge",
          label: "Solde des Congés",
          link: "/solde-conge/liste-solde-conge",
          parentId: "congés",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "demande-Conge",
          label: "Ajouter Demande de Congé",
          link: "/demande-conge/ajouter-demande-conge",
          parentId: "congés",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "liste_demande-Conge",
          label: "Les Demandes de Congés",
          link: "/demande-conge/liste-demande-conge",
          parentId: "congés",
          icon: "bi bi-luggage",
        },
      ],
    },
    // deplacement
    {
      id: "déplacement",
      label: "Gestion des déplacements",
      icon: "bi bi-car-front",
      link: "/gestion-deplacement/Liste-deplacements",
      click: function (e: any) {
        e.preventDefault();
        setIsDeplacement(!isDeplacement);
        setIscurrentState("Deplacement");
        updateIconSidebar(e);
      },
      stateVariables: isDeplacement,
    },
    // Mission
    {
      id: "Mission",
      label: "Gestion des taches",
      icon: "bi bi-list-task",
      link: "/gestion-mission/liste-mission",
      click: function (e: any) {
        e.preventDefault();
        setIsMission(!isMission);
        setIscurrentState("Mission");
        updateIconSidebar(e);
      },
      stateVariables: isMission,
    },
    // notes pro
    {
      id: "notes-professionnels",
      label: "Gestion des notes professionnelles",
      icon: "bi bi-award",
      link: "/gestion-notes-professionelles/Liste-notes-professionelles",
      click: function (e: any) {
        e.preventDefault();
        setIsNotesProfessionnelles(!isNotesProfessionnelles);
        setIscurrentState("NotesProfessionelles");
        updateIconSidebar(e);
      },
      stateVariables: isNotesProfessionnelles,
    },

    {
      id: "lien",
      label: "Liens Utils",
      icon: "bi bi-link-45deg",
      link: "/liens-utils",
    },
    // gestion des admins
    {
      id: "Gestion-des-admin",
      label: "Gestion des admins",
      link: "/admin/liste-admins",
      icon: "bi bi-person-vcard",
      click: function (e: any) {
        e.preventDefault();
        setIsAdmin(!isAdmin);
        setIscurrentState("Admin");
        updateIconSidebar(e);
      },
      stateVariables: isAdmin,
    },
    //! E-Administration
    {
      id: "Papier-administratif",
      label: "E-Administration",
      link: "/#",
      icon: "bi bi-envelope-paper",
      click: function (e: any) {
        e.preventDefault();
        setIsPapier(!isPapier);
        setIscurrentState("PapierAdministratif");
        updateIconSidebar(e);
      },
      stateVariables: isPapier,
      subItems: [
        {
          id: "Papiers",
          label: "Papiers Administratives",
          link: "/papier-administratif/lister-papier",
          parentId: "Papier-administratif",
          icon: "bi bi-envelope-paper",
        },
        {
          id: "modele",
          label: "Gestion des Modèles",
          link: "/template/liste-template-body",
          parentId: "Papier-administratif",
          icon: "bi bi-file-earmark-plus",
        },
        {
          id: "telechargement",
          label: "Espace téléchargement",
          icon: "bi bi-cloud-arrow-down",
          link: "/espace-telechargement",
          parentId: "Papier-administratif",
        },
      ],
    },
    //! Messagerie
    {
      id: "messagerie",
      label: "Messagerie",
      icon: "bi bi-envelope",
      link: "/messagerie/liste-message",
    },
    {
      id: "tirage",
      label: "Service Tirage",
      icon: "bi bi-printer",
      link: "/service-tirage/liste-tirages",
    },
    //! Bureau Ordre
    {
      id: "bureau_ordre",
      label: "Bureau Ordre",
      icon: "bi bi-mailbox",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsBureauOrdre(!isBureauOrdre);
        setIscurrentState("bureau_ordre");
        updateIconSidebar(e);
      },
      stateVariables: isBureauOrdre,
      subItems: [
        {
          id: "Courriers-Entrants",
          label: "Courriers Entrants",
          link: "/bureau-ordre/courriers-entrants/lister-courriers-entrants",
          parentId: "bureau_ordre",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "Courriers-Sortants",
          label: "Courriers Sortants",
          link: "/bureau-ordre/courriers-sortants/lister-courriers-sortants",
          parentId: "bureau_ordre",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "liste_intervenant",
          label: "Intervenants",
          link: "/bureau-ordre/intervenants/lister-intervenants",
          parentId: "bureau_ordre",
          icon: "bi bi-person-fill-add",
        },
      ],
    },
    //! Paramétrages
    {
      id: "parametrages",
      label: "Paramétrages",
      icon: "bi bi-gear-wide-connected",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsSettings(!isSettings);
        setIscurrentState("Paramétrages");
        updateIconSidebar(e);
      },
      stateVariables: isSettings,
      subItems: [
        {
          id: "variable-globales",
          label: "Variables Globales",
          link: "/variable/liste-variables-globales",
          parentId: "parametrages",
        },
        {
          id: "parametre-emploi",
          label: "Parametres Des emplois",
          link: "/gestion-emplois-classe/parametres-emplois-classe",
          parentId: "parametrages",
        },
        {
          id: "heure_de_travail",
          label: "Heures de Travail",
          link: "/parametre-personnel/periode/liste-periode-travail-personnel",
          parentId: "parametrages",
        },
        {
          id: "voie-envoi",
          label: "Gestion des voie d'envoi",
          link: "/bureau-ordre/voie-envoi/gestion-voie-envoi",
          parentId: "parametrages",
          icon: "bi bi-journal-text",
        },
        {
          id: "pce",
          label: "Comptes Etudiants",
          icon: "bi bi-journals",
          link: "/departement/gestion-matieres/liste-matieres",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel1(!isLevel1);
          },
          stateVariables: isLevel1,
          childItems: [
            {
              id: 1,
              label: "Etat",
              link: "/parametre-etudiant/etat/liste-etat-etudiant",
              icon: "bi bi-journal-text",
            },
            {
              id: 2,
              label: "Inscription",
              link: "/parametre-etudiant/inscription/liste-inscription-etudiant",
              icon: "bi bi-journal-text",
            },
          ],
        },
        {
          id: "pcen",
          label: "Comptes Enseignants",
          icon: "bi bi-people-fill",
          link: "/departement/gestion-classes/liste-classes",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel3(!isLevel3);
          },
          stateVariables: isLevel3,
          childItems: [
            {
              id: 1,
              label: "Etat",
              link: "/parametre-enseignant/etat/liste-etat-enseignant",
              icon: "bi bi-people-fill",
            },
            {
              id: 2,
              label: "Grade",
              link: "/parametre-enseignant/grade/liste-grade-enseignant",
              icon: "bi bi-award-fill",
            },
            {
              id: 3,
              label: "Poste",
              link: "/parametre-enseignant/poste/liste-poste-enseignant",
              icon: "bi bi-book",
            },
            {
              id: 4,
              label: "Spécialité",
              link: "/parametre-enseignant/specialite/liste-specialite-enseignant",
              icon: "bi bi-briefcase-fill",
            },
          ],
        },
        {
          id: "cp",
          label: "Comptes Personnels",
          icon: "bi bi-house-gear-fill",
          link: "/departement/gestion-departements/liste-departements",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel4(!isLevel4);
          },
          stateVariables: isLevel4,
          childItems: [
            {
              id: 1,
              label: "Etat",
              link: "/parametre-personnel/etat/liste-etat-personnel",
              icon: "bi bi-diagram-3-fill",
            },
            {
              id: 2,
              label: "Grade",
              link: "/parametre-personnel/grade/liste-grade-personnel",
              icon: "bi bi-diagram-3-fill",
            },
            {
              id: 3,
              label: "Poste",
              link: "/parametre-personnel/poste/liste-poste-personnel",
              icon: "bi bi-book",
            },
            {
              id: 4,
              label: "Catégorie",
              link: "/parametre-personnel/categorie/liste-categorie-personnel",
              icon: "bi bi-grid",
            },
            {
              id: 5,
              label: "Service",
              link: "/parametre-personnel/service/liste-service-personnel",
              icon: "bi bi-grid",
            },
          ],
        },
      ],
    },

    //! Migration
    // {
    //   id: "migration",
    //   label: "Migration",
    //   icon: "bi bi-file-zip",
    //   link: "/migration",
    // },
  ];

  if (currentMonth === 5) {
    menuItems.push({
      id: "migration",
      label: "Migration",
      icon: "bi bi-file-zip",
      link: "/migration",
    });
  }
  const filteredMenuItems = filterMenuItems(menuItems, routes);
  return (
    <React.Fragment>
      {migrationValue === true && filteredMenuItems}
    </React.Fragment>
  );
};
export default Navdata;
