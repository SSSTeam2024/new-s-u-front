import React, { useEffect, useState } from "react";
import { selectCurrentUser } from "features/account/authSlice";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useFetchUserPermissionsByUserIdQuery } from "../features/userPermissions/userPermissionSlice";

const Navdata = () => {
  const user: any = useSelector((state: RootState) => selectCurrentUser(state));
  const {
    data: userPermissions,
    error,
    isLoading,
  } = useFetchUserPermissionsByUserIdQuery({ userId: user?._id! });

  useEffect(() => {
    if (error) {
      console.error("Error fetching user permissions:", error);
    } else if (isLoading) {
      console.log("Fetching user permissions...");
    } else {
      // console.log('User permissions:', userPermissions);
    }
  }, [userPermissions, error, isLoading]);

  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isAvisEtudiant, setIsAvisEtudiant] = useState(false);
  const [isAvisEnseignant, setIsAvisEnseignant] = useState(false);
  const [isAvisPersonnel, setIsAvisPersonnel] = useState(false);
  const [isActualite, setIsActualite] = useState(false);
  const [isParametreEtudiant, setIsParametreEtudiant] = useState(false);
  const [isParametreEnseignant, setIsParametreEnseignant] = useState(false);
  const [isParametrePersonnel, setIsParametrePersonnel] = useState(false);
  const [isSellers, setIsSellers] = useState(false);
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
  const [isEmplois, setIsEmplois] = useState(false);
  const [isRattrapage, setIsRattrapage] = useState(false);
  const [isExamen, setIsExamen] = useState(false);
  const [isNotesExamen, setIsNotesExamen] = useState(false);
  const [isConge, setIsConge] = useState(false);
  const [isDeplacement, setIsDeplacement] = useState(false);
  const [isNotesProfessionnelles, setIsNotesProfessionnelles] = useState(false);
  const [isModele, setIsModele] = useState(false);
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);
  const [isLevel3, setIsLevel3] = useState(false);
  const [isLevel4, setIsLevel4] = useState(false);
  const [isLevel5, setIsLevel5] = useState(false);
  const [isLevel6, setIsLevel6] = useState(false);
  const [isLevel7, setIsLevel7] = useState(false);
  const [isLevel8, setIsLevel8] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        // var id: any = item.getAttribute("subitems");
        // if (document.getElementById(id)){
        //     document.getElementById(id).classList.remove("show");
        // }
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
        // Keep the item if it has subItems left after filtering
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
    if (iscurrentState !== "Orders") {
      setIsOrder(false);
    }
    if (iscurrentState !== "Sellers") {
      setIsSellers(false);
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
    if (iscurrentState !== "Conge") {
      setIsConge(false);
    }
    if (iscurrentState !== "Deplacement") {
      setIsDeplacement(false);
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
    if (iscurrentState !== "ParametreEnseignant") {
      setIsParametreEnseignant(false);
    }
    if (iscurrentState !== "ParametrePersonnel") {
      setIsParametrePersonnel(false);
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
    isParametreEtudiant,
    isExamen,
    isNotesExamen,
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
      icon: "bi bi-person-fill-gear",
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
      ],
    },
    // gestion enseignant
    {
      id: "gestion-enseignant",
      label: "Gestion Enseignants",
      link: "/#",
      icon: "bi bi-person-fill-gear",
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
      icon: "bi bi-person-fill-gear",
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
      link: "/#",
      icon: "bi bi-megaphone",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisEtudiant(!isAvisEtudiant);
        setIscurrentState("AvisEtudiant");
        updateIconSidebar(e);
      },
      stateVariables: isAvisEtudiant,
      subItems: [
        {
          id: "AjouterAvisEtudiant",
          label: "Ajouter un Avis",
          link: "/avis-etudiant/ajouter-avis-etudiant",
          parentId: "Gestion-des-Avis",
          icon: "bi bi-file-earmark-plus",
        },
        {
          id: "GestionAvisEtudiant",
          label: "Liste des avis",
          link: "/avis-etudiant/liste-avis-etudiant",
          parentId: "Gestion-des-Avis",
          icon: "bi bi-list-ul",
        },
      ],
    },
    // avis enseignant
    {
      id: "Avis-enseignant",
      label: "Avis Enseignant",
      link: "/#",
      icon: "bi bi-megaphone",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisEnseignant(!isAvisEnseignant);
        setIscurrentState("AvisEnseignant");
        updateIconSidebar(e);
      },
      stateVariables: isAvisEnseignant,
      subItems: [
        {
          id: "AjouterAvisEnseignant",
          label: "Ajouter un Avis",
          link: "/avis-enseignant/ajouter-avis-enseignant",
          parentId: "Avis-enseignant",
          icon: "bi bi-file-earmark-plus",
        },
        {
          id: "GestionAvisEnseignant",
          label: "Liste des avis",
          link: "/avis-enseignant/liste-avis-enseignant",
          parentId: "Avis-enseignant",
          icon: "bi bi-list-ul",
        },
      ],
    },
    //avis personnel
    {
      id: "Avis-Personnel",
      label: "Avis Personnel",
      link: "/#",
      icon: "bi bi-megaphone",
      click: function (e: any) {
        e.preventDefault();
        setIsAvisPersonnel(!isAvisPersonnel);
        setIscurrentState("AvisPersonnel");
        updateIconSidebar(e);
      },
      stateVariables: isAvisPersonnel,
      subItems: [
        {
          id: "AjouterAvisPersonnel",
          label: "Ajouter un avis",
          link: "/avis-personnel/ajouter-avis-personnel",
          parentId: "Avis-Personnel",
          icon: "bi bi-file-earmark-plus",
        },
        {
          id: "GestionAvisPersonnel",
          label: "Liste des avis",
          link: "/avis-personnel/liste-avis-personnel",
          parentId: "Avis-Personnel",
          icon: "bi bi-list-ul",
        },
      ],
    },
    // actualite
    {
      id: "Actualite",
      label: "Actualités",
      link: "/#",
      icon: "bi bi-chat-quote",
      click: function (e: any) {
        e.preventDefault();
        setIsActualite(!isActualite);
        setIscurrentState("Actualite");
        updateIconSidebar(e);
      },
      stateVariables: isActualite,
      subItems: [
        {
          id: "Ajouterctualite",
          label: "Ajouter une actualité",
          link: "/actualite/ajouter-actualite",
          parentId: "Actualite",
          icon: "bi bi-file-earmark-plus",
        },
        {
          id: "listeActualite",
          label: "Liste des actualités",
          link: "/actualite/liste-actualite",
          parentId: "Actualite",
          icon: "bi bi-list-ul",
        },
      ],
    },
    // demande etudiant
    {
      id: "Demande-etudiant",
      label: "Demande Etudiant",
      link: "/demandes-etudiant/Liste-demandes-etudiant",
      icon: "bi bi-telephone-forward",
    },
    // demande enseignant
    {
      id: "Demande-enseignant",
      label: "Demande Enseignant",
      link: "/demandes-enseignant/liste-demande-enseignant",
      icon: "bi bi-telephone-forward",
    },
    // demande personnel
    {
      id: "Demande-personnel",
      label: "Demande Personnel",
      link: "/demandes-personnel/liste-demande-personnel",
      icon: "bi bi-telephone-forward",
    },
    // reclamation etudiant
    {
      id: "Reclamation-etudiant",
      label: "Réclamation Etudiant",
      link: "/reclamation-etudiant/liste-reclamation-etudiant",
      icon: "bi bi-envelope-exclamation",
    },
    // reclamation enseignant
    {
      id: "Reclamation-enseignant",
      label: "Réclamation Enseignant",
      link: "/reclamation-enseignant/liste-reclamation-enseignant",
      icon: "bi bi-envelope-exclamation",
    },
    // reclamation personnel
    {
      id: "Reclamation-personnel",
      label: "Réclamation Personnel",
      link: "/reclamation-personnel/liste-reclamation-personnel",
      icon: "bi bi-envelope-exclamation",
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
    //parametre compte etudiant
    {
      id: "parametreEtudiant",
      label: "Paramètres Comptes Etudiants",
      link: "/#",
      icon: "bi bi-sliders",
      click: function (e: any) {
        e.preventDefault();
        setIsParametreEtudiant(!isParametreEtudiant);
        setIscurrentState("ParametreEtudiant");
        updateIconSidebar(e);
      },
      stateVariables: isParametreEtudiant,
      subItems: [
        {
          id: "EtatEtudiant",
          label: "Etat",
          link: "/parametre-etudiant/etat/liste-etat-etudiant",
          parentId: "parametreEtudiant",
          icon: "bi bi-person-fill-exclamation",
        },
        {
          id: "InscriptionEtudiant",
          label: "Inscription",
          link: "/parametre-etudiant/inscription/liste-inscription-etudiant",
          parentId: "parametreEtudiant",
          icon: "bi bi-person-plus-fill",
        },
      ],
    },
    // parametre compte enseignant
    {
      id: "parametreEnseignant",
      label: "Paramètres Comptes Enseignants",
      link: "/#",
      icon: "bi bi-sliders",
      click: function (e: any) {
        e.preventDefault();
        setIsParametreEnseignant(!isParametreEnseignant);
        setIscurrentState("ParametreEnseignant");
        updateIconSidebar(e);
      },
      stateVariables: isParametreEnseignant,
      subItems: [
        {
          id: "EtatEnseignat",
          label: "Etat",
          link: "/parametre-enseignant/etat/liste-etat-enseignant",
          parentId: "parametreEnseignant",
          icon: "bi bi-person-fill-exclamation",
        },
        {
          id: "GradeEnseignant",
          label: "Grade",
          link: "/parametre-enseignant/grade/liste-grade-enseignant",
          icon: "bi bi-award-fill",
          parentId: "parametreEnseignant",
        },
        {
          id: "posteEnseignant",
          label: "Poste",
          link: "/parametre-enseignant/poste/liste-poste-enseignant",
          icon: "bi bi-book",
          parentId: "parametreEnseignant",
        },
        {
          id: "specialiteEnseingnat",
          label: "Spécialité",
          link: "/parametre-enseignant/specialite/liste-specialite-enseignant",
          icon: "bi bi-briefcase-fill",
          parentId: "parametreEnseignant",
        },
      ],
    },
    // parametre compte personnel
    {
      id: "parametrePersonnel",
      label: "Paramètres Comptes Personnels",
      link: "/#",
      icon: "bi bi-sliders",
      click: function (e: any) {
        e.preventDefault();
        setIsParametrePersonnel(!isParametrePersonnel);
        setIscurrentState("ParametrePersonnel");
        updateIconSidebar(e);
      },
      stateVariables: isParametrePersonnel,
      subItems: [
        {
          id: "EtatEtudiant",
          label: "Etat",
          link: "/parametre-personnel/etat/liste-etat-personnel",
          parentId: "parametrePersonnel",
          icon: "bi bi-person-fill-exclamation",
        },
        {
          id: "gradePersonnel",
          label: "Grade",
          link: "/parametre-personnel/grade/liste-grade-personnel",
          icon: "bi bi-award-fill",
          parentId: "parametrePersonnel",
        },
        {
          id: "postePersonnel",
          label: "Poste",
          link: "/parametre-personnel/poste/liste-poste-personnel",
          icon: "bi bi-book",
          parentId: "parametrePersonnel",
        },
        {
          id: "categoriePersonnel",
          label: "Catégorie",
          link: "/parametre-personnel/categorie/liste-categorie-personnel",
          icon: "bi bi-grid",
          parentId: "parametrePersonnel",
        },
        {
          id: "servicePersonnel",
          label: "Service",
          link: "/parametre-personnel/service/liste-service-personnel",
          icon: "bi bi-grid",
          parentId: "parametrePersonnel",
        },
      ],
    },

    //gestion departement
    {
      id: "departement",
      label: "Gestion Département",
      icon: "bi bi-house-gear-fill",
      link: "/departement",
      click: function (e: any) {
        e.preventDefault();
        setIsDeaprtement(!isDeaprtement);
        setIscurrentState("Departement");
        updateIconSidebar(e);
      },
      stateVariables: isDeaprtement,
      subItems: [
        {
          id: "matieres",
          label: "Matières",
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
              label: "Liste Des matières",
              link: "/departement/gestion-matieres/liste-matieres",
              icon: "bi bi-journal-text",
            },
            {
              id: 1,
              label: "Ajouter matière",
              link: "/departement/gestion-matieres/ajouter-matiere",
              icon: "bi bi-journal-text",
            },
          ],
        },
        {
          id: "salles",
          label: "Salles",
          icon: "bi bi-door-closed-fill",
          link: "/departement/gestion-salles/liste-salles",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel2(!isLevel2);
          },
          stateVariables: isLevel2,
          childItems: [
            {
              id: 1,
              label: "Liste Des Salles",
              link: "/departement/gestion-salles/liste-salles",
              icon: "bi bi-person-fill-exclamation",
            },
            {
              id: 1,
              label: "Ajouter salle",
              link: "/departement/gestion-salles/ajouter-salle",
              icon: "bi bi-person-fill-exclamation",
            },
          ],
        },
        {
          id: "classes",
          label: "Classes",
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
              label: "Liste des classes",
              link: "/departement/gestion-classes/liste-classes",
              icon: "bi bi-people-fill",
            },
            {
              id: 2,
              label: "Listes des niveaux",
              link: "/departement/gestion-classes/liste-niveau",
              icon: "bi bi-sliders2-vertical",
            },
            {
              id: 3,
              label: "Listes des séctions",
              link: "/departement/gestion-classes/liste-section",
              icon: "bi bi-diagram-3-fill",
            },
            //added liste mentions classess
            {
              id: 4,
              label: "Listes des mentions",
              link: "/departement/gestion-classes/liste-mentions",
              icon: "bi bi-diagram-3-fill",
            },
            //added liste domaines classess
            {
              id: 5,
              label: "Listes des domaines",
              link: "/departement/gestion-classes/liste-domaines",
              icon: "bi bi-diagram-3-fill",
            },
          ],
        },
        {
          id: "departements",
          label: "Départements",
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
              label: "Liste Des Départements",
              link: "/departement/gestion-departements/liste-departements",
              icon: "bi bi-diagram-3-fill",
            },
            {
              id: 1,
              label: "Ajouter département",
              link: "/departement/gestion-departements/departements/add-departement",
              icon: "bi bi-diagram-3-fill",
            },
          ],
        },
      ],
    },

    //gestion emploi
    {
      id: "emplois",
      label: "Gestion Emplois",
      icon: "bi bi-house-gear-fill",
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
            // { id: 1, label: "Ajouter Un Département", link: "/gestion-departements/Ajout-departement",  icon: "bi bi-person-plus-fill"},
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
          id: "parametre-emploi",
          label: "Parametres Des emplois",
          link: "/gestion-emplois-classe/parametres-emplois-classe",
          icon: "bi bi-gear-fill",
        },
        {
          id: "ficheVoeux",
          label: "Fiches des Voeux Enseignants",
          icon: "bi bi-postcard-heart",
          link: "/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel7(!isLevel7);
          },
          stateVariables: isLevel7,
          childItems: [
            {
              id: 1,
              label: "Liste Des Voeux",
              link: "/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux",
              icon: "bi bi-list-task",
            },
          ],
        },
      ],
    },

    // gestion rattrapages
    {
      id: "Gestion-des-rattrapages",
      label: "Gestion des Rattrapages",
      link: "/#",
      icon: "bi bi-calendar-event",
      click: function (e: any) {
        e.preventDefault();
        setIsRattrapage(!isRattrapage);
        setIscurrentState("Rattrapages");
        updateIconSidebar(e);
      },
      stateVariables: isRattrapage,
      subItems: [
        {
          id: "AjouterRattrapage",
          label: "Ajouter un Rattrapage",
          link: "/rattrapage/ajouter-rattrapage",
          parentId: "Gestion-des-rattrapages",
          icon: "bi bi-calendar2-plus",
        },
        {
          id: "GestionRattrapages",
          label: "Liste Des Rattrapages",
          link: "/rattrapage/liste-rattrapages",
          parentId: "Gestion-des-rattrapages",
          icon: "bi bi-card-list",
        },
      ],
    },
    //! Gestion Examens
    {
      id: "Gestion-des-examens",
      label: "Gestion des Examens",
      link: "/#",
      icon: "bi bi-calendar-event",
      click: function (e: any) {
        e.preventDefault();
        setIsExamen(!isExamen);
        setIscurrentState("Examen");
        updateIconSidebar(e);
      },
      stateVariables: isExamen,
      subItems: [
        {
          id: "AjouterCalendrierExamen",
          label: "Ajouter Calendrier Examen",
          link: "/gestion-examen/ajouter-calendrier-examen",
          parentId: "Gestion-des-examens",
          icon: "bi bi-calendar2-plus",
        },
        {
          id: "ListCalendrierExamen",
          label: "Liste Des Calendrier",
          link: "/gestion-examen/liste-des-calendrier",
          parentId: "Gestion-des-examens",
          icon: "bi bi-card-list",
        },
      ],
    },
    //! Gestion Notes Examen
    {
      id: "Gestion-des-Notes",
      label: "Gestion des Notes",
      link: "/#",
      icon: "bi bi-123",
      click: function (e: any) {
        e.preventDefault();
        setIsNotesExamen(!isNotesExamen);
        setIscurrentState("NotesExamen");
        updateIconSidebar(e);
      },
      stateVariables: isNotesExamen,
      subItems: [
        {
          id: "AjouterNoteExamen",
          label: "Ajouter Note Examen",
          link: "/gestion-examen/ajouter-des-notes-examen",
          parentId: "Gestion-des-Notes",
          icon: "bi bi-calendar2-plus",
        },
        {
          id: "ListeNotesExamen",
          label: "Liste Des Notes Examen",
          link: "/gestion-examen/liste-des-notes-examen",
          parentId: "Gestion-des-Notes",
          icon: "bi bi-card-list",
        },
      ],
    },
    //Gestion des congés
    {
      id: "congés",
      label: "Gestion des congés",
      icon: "bi bi-house-gear-fill",
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
          icon: "bi bi-person-fill-add",
        },
        // {
        //   id: "shortCode",
        //   label: "Liste Des codes courts",
        //   link: "/shortCode/liste-short-code",
        //   parentId: "modele",
        //   icon: "bi bi-person-fill-add",
        // },
      ],
    },
    // deplacement
    {
      id: "déplacement",
      label: "Gestion des déplacements",
      icon: "bi bi-car-front",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsDeplacement(!isDeplacement);
        setIscurrentState("Deplacement");
        updateIconSidebar(e);
      },
      stateVariables: isDeplacement,
      subItems: [
        {
          id: "ajouter-deplacement",
          label: "Ajouter un déplacement",
          link: "/gestion-deplacement/Ajouter-deplacement",
          parentId: "déplacement",
          icon: "bi bi-clipboard2-plus",
        },
        // {
        //   id: "Solde-Conge",
        //   label: "Solde des Congés",
        //   link: "/solde-conge/liste-solde-conge",
        //   parentId: "congés",
        //   icon: "bi bi-person-fill-add",
        // },
        // {
        //   id: "demande-Conge",
        //   label: "Ajouter Demande de Congé",
        //   link: "/demande-conge/ajouter-demande-conge",
        //   parentId: "congés",
        //   icon: "bi bi-person-fill-add",
        // },
        {
          id: "liste_deplacements",
          label: "Liste des déplacements",
          link: "/gestion-deplacement/Liste-deplacements",
          parentId: "déplacement",
          icon: "bi bi-journal-text",
        },
      ],
    },

    // notes pro
    {
      id: "notes-professionnels",
      label: "Gestion des notes professionnelles",
      icon: "bi bi-card-list",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsNotesProfessionnelles(!isNotesProfessionnelles);
        setIscurrentState("NotesProfessionelles");
        updateIconSidebar(e);
      },
      stateVariables: isNotesProfessionnelles,
      subItems: [
        {
          id: "ajouter-notes-professionelles",
          label: "Ajouter des notes professionelles",
          link: "/gestion-notes-professionelles/Ajouter-notes-professionelles",
          parentId: "notes-professionnels",
          icon: "bi bi-clipboard2-plus",
        },
        // {
        //   id: "Solde-Conge",
        //   label: "Solde des Congés",
        //   link: "/solde-conge/liste-solde-conge",
        //   parentId: "congés",
        //   icon: "bi bi-person-fill-add",
        // },
        // {
        //   id: "demande-Conge",
        //   label: "Ajouter Demande de Congé",
        //   link: "/demande-conge/ajouter-demande-conge",
        //   parentId: "congés",
        //   icon: "bi bi-person-fill-add",
        // },
        {
          id: "liste_notes_professionelles",
          label: "Liste des notes professionelles",
          link: "/gestion-notes-professionelles/Liste-notes-professionelles",
          parentId: "notes-professionnels",
          icon: "bi bi-journal-text",
        },
      ],
    },

    //modele
    {
      id: "modele",
      label: "Gestion des modèles",
      icon: "bi bi-house-gear-fill",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsModele(!isModele);
        setIscurrentState("Modele");
        updateIconSidebar(e);
      },
      stateVariables: isModele,
      subItems: [
        {
          id: "template",
          label: "Liste Des modeles",
          link: "/template/liste-template-body",
          parentId: "modele",
          icon: "bi bi-journal-text",
        },
        {
          id: "template",
          label: "Ajouter modele",
          link: "/template/ajouter-template-body",
          parentId: "modele",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "shortCode",
          label: "Liste Des codes courts",
          link: "/shortCode/liste-short-code",
          parentId: "modele",
          icon: "bi bi-person-fill-add",
        },
      ],
    },

    {
      id: "telechargement",
      label: "Espace téléchargement",
      icon: "bi bi-cloud-arrow-down-fill",
      link: "/espace-telechargement",
    },
    {
      id: "lien",
      label: "Liens Utils",
      icon: "bi bi-link-45deg",
      link: "/liens-utils",
    },
    {
      id: "variable-globales",
      label: "Variables Globales",
      icon: "bi bi-cloud-arrow-down-fill",
      link: "/variable/ajouter-variables-globales",
    },
    // gestion des admins
    {
      id: "Gestion-des-admin",
      label: "Gestion des admins",
      link: "/#",
      icon: "bi bi-person-fill-gear",
      click: function (e: any) {
        e.preventDefault();
        setIsAdmin(!isAdmin);
        setIscurrentState("Admin");
        updateIconSidebar(e);
      },
      stateVariables: isAdmin,
      subItems: [
        {
          id: "AjouterAdmin",
          label: "Liste des Admins",
          link: "/admin/liste-admins",
          parentId: "Gestion-des-admin",
          icon: "bi bi-person-fill-add",
        },
        {
          id: "AjouterPermission",
          label: "Ajouter des permissions",
          link: "/permissions",
          parentId: "Gestion-des-admin",
          icon: "bi bi-person-lines-fill",
        },
        {
          id: "AjouterAdmin",
          label: "Ajouter Admin",
          link: "/admin/ajouter-admin",
          parentId: "Gestion-des-admin",
          icon: "bi bi-person-lines-fill",
        },
      ],
    },
    // Papier administratif
    {
      id: "Papier-administratif",
      label: "Papier administartif",
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
          id: "ListerPapier",
          label: "Liste Papier Administratif",
          link: "/papier-administratif/lister-papier",
          parentId: "Papier-admin",
          icon: "bi bi-list",
        },
        {
          id: "AjouterPapier",
          label: "Ajouter Papier Administratif",
          link: "/papier-administratif/ajouter-papier",
          parentId: "Papier-admin",
          icon: "bi bi-file-earmark-plus",
        },
      ],
    },
  ];
  const filteredMenuItems = filterMenuItems(menuItems, routes);
  return <React.Fragment>{filteredMenuItems}</React.Fragment>;
};
export default Navdata;
