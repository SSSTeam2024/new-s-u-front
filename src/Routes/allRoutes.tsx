import { Navigate } from "react-router-dom";

import Dashboard from "pages/Dashboard";

// Accounts
import MyAccount from "pages/Accounts/AccountEtudiant";
import Settings from "pages/Accounts/Settings";
import SignUp from "pages/Accounts/AuthenticationInner/SignUp";
import SignIn from "pages/Accounts/AuthenticationInner/SignIn";
import PasswordReset from "pages/Accounts/AuthenticationInner/PasswordReset";
import PasswordCreate from "pages/Accounts/AuthenticationInner/PasswordCreate";
import SuccessMessage from "pages/Accounts/AuthenticationInner/SuccessMessage";
import TwoStepVerify from "pages/Accounts/AuthenticationInner/TwoStepVerify";
import BasicLogout from "pages/Accounts/AuthenticationInner/Logout";
import Error404 from "pages/Accounts/AuthenticationInner/Error404";
import Error500 from "pages/Accounts/AuthenticationInner/Error500";
import ComingSoon from "pages/Accounts/AuthenticationInner/ComingSoon";

// Authentication
import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/Logout";
import Register from "pages/Authentication/Register";
import ForgotPassword from "pages/Authentication/ForgotPassword";
import UserProfile from "pages/Authentication/user-profile";

import DemandeEnseignant from "pages/Demande-enseignant/ListeDemandeEnseignant";

import AjouterEnseignant from "pages/Gestion-enseignant/AjouterEnseignant";

import AjouterAvisEtudiant from "pages/avis-etudiant/AjouterAvisEtudiant";
import ListeAvisEtudiant from "pages/avis-etudiant/ListeAvisEtudiant";
import ListeAvisEnseignant from "pages/avis-enseignant/ListeAvisEnseignant";
import AjouterAvisEnseignant from "pages/avis-enseignant/AjouterAvisEnseignant";
import AjouterAvisPersonnel from "pages/avis-personnel/AjouterAvisPersonnel";
import ListeAvisPersonnel from "pages/avis-personnel/ListeAvisPersonnel";
import ListeActualite from "pages/actualite/ListeActualite";
import AjouterActualite from "pages/actualite/AjouterActualite";
import SingleAvisEtudiant from "pages/avis-etudiant/SingleAvisEtudiant";
import SingleAvisEnseignant from "pages/avis-enseignant/SingleAvisEnseignant";
import SingleAvisPersonnel from "pages/avis-personnel/SingleAvisPersonnel";
import ListeDemandeEtudiant from "pages/Demande-etudiant/ListeDemandeEtudiant";
import SingleDemandeEtudiant from "pages/Demande-etudiant/SingleDemandeEtudiant";
import EditDemandeEtudiant from "pages/Demande-etudiant/EditDemandeEtudiant";
import SingleActualite from "pages/actualite/SingleActualite";
import ListeDemandeEnseignant from "pages/Demande-enseignant/ListeDemandeEnseignant";
import SingleDemandeEnseignant from "pages/Demande-enseignant/SingleDemandeEnseignant";
import EditDemandeEnseignant from "pages/Demande-enseignant/EditDemandeEnseignant";
import ListeDemandePersonnel from "pages/Demande-personnel/ListeDemandePersonnel";
import SingleDemandePersonnel from "pages/Demande-personnel/SingleDemandePersonnel";
import EditDemandePersonnel from "pages/Demande-personnel/EditDemandePersonnel";
import AccountEnseignant from "pages/Accounts/AccountEnseignant";
import AccountPersonnel from "pages/Accounts/AccountPersonnel";
import ListeReclamationEtudiant from "pages/Reclamation-etudiant/ListeReclamationEtudiant";
import SingleReclamationEtudiant from "pages/Reclamation-etudiant/SingleReclamationEtudiant";
import EditReclamationEtudiant from "pages/Reclamation-etudiant/EditReclamationEtudiant";
import ListeReclamationEnseignant from "pages/Reclamation-enseignant/ListeReclamationEnseignant";
import SingleReclamationEnseignant from "pages/Reclamation-enseignant/SingleReclamationEnseignant";
import EditReclamationEnseignant from "pages/Reclamation-enseignant/EditReclamationEnseignant";
import ListeReclamationPersonnel from "pages/Reclamation-personnel/ListeReclamationPersonnel";
import SingleReclamationPersonnel from "pages/Reclamation-personnel/SingleReclamationPersonnel";
import EditReclamationPersonnel from "pages/Reclamation-personnel/EditReclamationPersonnel";
import ListEtudiants from "pages/Gestion-etudiant/ListeEtudiant";
import ListEnseignants from "pages/Gestion-enseignant/ListeEnseignant";
import AjouterPersonnels from "pages/Gestion-personnel/AjouterPersonnel";
import ListPersonnels from "pages/Gestion-personnel/ListePersonnels";
import ListParametresEtudiants from "pages/Parametres/ParametresEtudiants/EtatEtudiant/ListParametreEtudiants";
import ListeInscriptionEtudiants from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/ListeInscriptionEtudiants";
import ListEtatEnseignants from "pages/Parametres/ParametresEnseignants/ListEtatEnseignants";
import ListGradeEnseignants from "pages/Parametres/ParametresEnseignants/ListGradeEnseignant";
import ListePostEnseignants from "pages/Parametres/ParametresEnseignants/ListePostEnseignants";
import ListSpecialiteEnseignants from "pages/Parametres/ParametresEnseignants/ListSpecialiteEnseignants";
import ListEtatPersonnels from "pages/Parametres/ParametresPersonnels/ListEtatPersonnels";
import ListGradePersonnels from "pages/Parametres/ParametresPersonnels/ListGradePersonnels";
import ListePostPersonnels from "pages/Parametres/ParametresPersonnels/ListPostePersonnels";
import ListCategoriePersonnels from "pages/Parametres/ParametresPersonnels/ListCategoriePersonnels";
import ListMatieres from "pages/Departements/GestionMatieres/ListMatieres";
import AffecterMatiere from "pages/AffecterMatiere/AffecterMatiere";
import ListSalles from "pages/Departements/GestionSalles/ListSalles";
import ListDepartement from "pages/Departements/GestionDepartements/ListDepartement";
import ListClasses from "pages/Departements/GestionClasses/ListClasses";
import ListNiveau from "pages/Departements/GestionClasses/NiveauScolaire/ListNiveau";
import ListSections from "pages/Departements/GestionClasses/Section/ListSections";
import ListEspaceTelechargement from "pages/EspaceTelechargement/ListEspaceTelechargement";
import ListLienUtilst from "pages/LiensUtils/ListLienUtils";
import AjouterEtudiant from "pages/Gestion-etudiant/AjouterEtudiant";
import Permissions from "pages/Permissions/Permissions";
import ListeAdmin from "pages/Permissions/ListeAdmin";
import AddEtatEtudiant from "pages/Parametres/ParametresEtudiants/EtatEtudiant/AddEtatEtudiant";
import EditEtatEtudiant from "pages/Parametres/ParametresEtudiants/EtatEtudiant/EditEtatEtudiant";
import AddTypeInscriptionEtudiant from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/AddInscriptionEtudiant";
import EditTypeInscriptionEtudiant from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/EditInscriptionEtudiant";
import AddEtatEnseignant from "pages/Parametres/ParametresEnseignants/AddEtatEnseignants";
import EditEtatEnseignant from "pages/Parametres/ParametresEnseignants/EditEtatEnseignant";
import AddGradeEnseignant from "pages/Parametres/ParametresEnseignants/AddGradeEnseignant";
import EditGradeEnseignant from "pages/Parametres/ParametresEnseignants/EditGradeEnseignant";
import AddPosteEnseignant from "pages/Parametres/ParametresEnseignants/AddPosteEnseignant";
import EditPosteEnseignant from "pages/Parametres/ParametresEnseignants/EditPosteEnseignant";
import AddSpecialiteEnseignant from "pages/Parametres/ParametresEnseignants/AddSpecialiteEnseignant";
import EditSpecialiteEnseignant from "pages/Parametres/ParametresEnseignants/EditSpecialiteEnseignant";
import AddEtatPersonnel from "pages/Parametres/ParametresPersonnels/AddEtatPersonnel";
import EditEtatPersonnel from "pages/Parametres/ParametresPersonnels/EditEtatPersonnel";
import AddGradePersonnel from "pages/Parametres/ParametresPersonnels/AddGradePersonnel";
import EditGradePersonnel from "pages/Parametres/ParametresPersonnels/EditGradePersonnel";
import AddPostePersonnel from "pages/Parametres/ParametresPersonnels/AddPostePersonnel";
import EditPostePersonnel from "pages/Parametres/ParametresPersonnels/EditPostePersonnels";
import AddCategoriePersonnel from "pages/Parametres/ParametresPersonnels/AddCategoriePersonnels";
import EditCategoriePersonnel from "pages/Parametres/ParametresPersonnels/EditCategoriePersonnel";
import ListServicesPersonnels from "pages/Parametres/ParametresPersonnels/ListServicesPersonnels";
import AddServicesPersonnel from "pages/Parametres/ParametresPersonnels/AddServicePersonnel";
import EditServicesPersonnel from "pages/Parametres/ParametresPersonnels/EditServicesPersonnel";
import AddMatiere from "pages/Departements/GestionMatieres/AddMatiere";
import EditMatiere from "pages/Departements/GestionMatieres/EditMatiere";
import AddSalle from "pages/Departements/GestionSalles/AjouterSalle";
import EditSalle from "pages/Departements/GestionSalles/EditSalle";
import AddClasse from "pages/Departements/GestionClasses/AjouterClasse";
import AddNiveau from "pages/Departements/GestionClasses/NiveauScolaire/AddNiveau";
import EditNiveau from "pages/Departements/GestionClasses/NiveauScolaire/EditNiveau";
import AddSection from "pages/Departements/GestionClasses/Section/AddSection";
import EditSection from "pages/Departements/GestionClasses/Section/EditSection";
import AddDepartement from "pages/Departements/GestionDepartements/AjouterDepaetement";
import EditDepartement from "pages/Departements/GestionDepartements/EditDepartement";
import SingleAdmin from "pages/Permissions/SingleAdmin";
import EditAdmin from "pages/Permissions/EditAdmin";
import HistoryAdmin from "pages/Permissions/HistoryAdmin";
import TemplateBody from "pages/TemplateBody";
import NewTemplateBody from "pages/TemplateBody/NewTemplateBody";
import ShortCode from "pages/ShortCode";
import NewShortCode from "pages/ShortCode/NewShortCode";
import AjouterVariablesGlobales from "pages/VariableGlobal/AjouterVariableGlobale";
import ListeVariablesGlobales from "pages/VariableGlobal/ListeVariableGlobale";
import EditActualite from "pages/actualite/EditActualite";
import ProfilEnseignant from "pages/Accounts/AccountEnseignant/ProfilEnseignant";
import EditAvisEtudiant from "pages/avis-etudiant/EditAvisEtudiant";
import AjouterReclamationEnseignant from "pages/Reclamation-enseignant/AjouterReclamationEnseignant";
import AjouterReclamationPersonnel from "pages/Reclamation-personnel/AjouterReclamationPersonnel";
import AjouterReclamationEtudiant from "pages/Reclamation-etudiant/AjouterReclamationEtudiant";
import AjouterDemandeEnseignant from "pages/Demande-enseignant/AjouterDemandeEnseignant";
import AjouterDemandePersonnel from "pages/Demande-personnel/AjouterDemandePersonnel";
import AjouterDemandeEtudiant from "pages/Demande-etudiant/AjouterDemandeEtudiant";
import TemplateBodyDetail from "pages/TemplateBody/singleTemplateBody";
import EditDossierAdministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/EditDossierAdministratif";
import ViewDossierAdministratifPersonnel from "pages/Gestion-personnel/Dossieradministratif/ViewDossierAdministratifPersonnel";
import ListeDossierAdministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/ListeDossierAdministratifPersonnels";
import AddDossieradministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/AddDossierAdministratifPersonnels";
import ViewDossierAdministratif from "pages/Gestion-enseignant/Dossieradministratif/ViewDossierAdministratif";
import ListeDossierAdministratif from "pages/Gestion-enseignant/Dossieradministratif/ListeDossierAdministratif";
import AddDossieradministratif from "pages/Gestion-enseignant/Dossieradministratif/AddDossieradministratif";
import AddPapierAdministratif from "pages/Papier-Administratif/AddPapierAdministratif";
import ListePapierAdministratifs from "pages/Papier-Administratif/ListePapierAdministratif";

import EditDossierAdministratifEnseignants from "pages/Gestion-enseignant/Dossieradministratif/EditDossierAdministratif";
import CreateAdmin from "pages/Permissions/AjouterAdmin";
import GenerateDemande from "pages/Demande-etudiant/GenerateDemande";
import ListeLeaveType from "pages/Gestion-solde-conge/ListeTypeConge";
import AjouterLeaveType from "pages/Gestion-solde-conge/AjouterTypeConge";
import ListeSoldeConge from "pages/Gestion-solde-conge/ListeSoldeConge";
import AjouterDemandeConge from "pages/Gestion-demande-conge/AjouterDemandeConge";
import ListeDemandeConge from "pages/Gestion-demande-conge/ListeDemandeConge";
import DemandeCongeDetails from "pages/Gestion-demande-conge/DemandeCongeDetails";
import EditDemandeConge from "pages/Gestion-demande-conge/EditDemandeConge";
import AjouterSoldeConge from "pages/Gestion-solde-conge/AjouterSoldeConge";
import EditAnnuelLeaveType from "pages/Gestion-solde-conge/ParamCongeAnnuel";
import EditProfilEtudiant from "pages/Gestion-etudiant/EditProfilEtudiant";
import ListTypeSeances from "pages/Departements/TypeSeances/ListTypeSeances";
import AddTypeSeance from "pages/Departements/TypeSeances/AddTypeSeance";
import ListClassPeriods from "pages/Departements/Emploi/ClassPeriods";
import TableauChargesHoraires from "pages/Departements/EmploiEnseignant/TableauChargesHoraires";
import GestionSeances from "pages/Departements/Emploi/GestionSeances";
import AjouterRattrapage from "pages/Rattrapages/AjouterRattrapage";
import ListeRattrapages from "pages/Rattrapages/ListeRattrapages";
import ListeEmploiEnseignants from "pages/Departements/EmploiEnseignant/ListeEmploiEnseignants";
import TeacherPeriod from "pages/Departements/EmploiEnseignant/TeacherPeriod";
import SingleEmploiEnseignant from "pages/Departements/EmploiEnseignant/GestionEmploiEnseignant";
import AddFicheVoeux from "pages/Departements/FicheVoeux/AddFicheVoeux";
import ListFicheVoeux from "pages/Departements/FicheVoeux/ListeFicheVoeux";
import EditFicheVoeux from "pages/Departements/FicheVoeux/EditFicheVoeux";
import SingleEmploiClasse from "pages/Departements/Emploi/GestionEmploiClasse";
import ListeEmploisClasse from "pages/Departements/Emploi/ListeEmploisClasse";
import EditProfilEnseignant from "pages/Gestion-enseignant/EditProfilEnseignant";
import GestionEmploiEnseignant from "pages/Departements/EmploiEnseignant/GestionEmploiEnseignant";
import TableauChargesHorairesClasses from "pages/Departements/Emploi/TableauChargesHorairesClasses";
import EditProfilPersonnel from "pages/Gestion-personnel/EditProfilPersonnel";
import EquilibreHorairesGrade from "pages/Departements/EmploiEnseignant/EquilibreHorairesGrade";
import ListeDossierAdministratifEnseignantsArchives from "pages/Gestion-enseignant/Dossieradministratif/ListeDossierAdministratifEnseignantsArchives";
import ListeDossiersAdministratifsPersonnelsArchives from "pages/Gestion-personnel/Dossieradministratif/ListeDossiersAdministratifsPersonnelsArchives";
import AjouterCalendrierExamen from "pages/GestionExamens/AjouterCalendrierExamen";
import ListCalendrier from "pages/GestionExamens/ListCalendrier";
import ProgrammerCalendrier from "pages/GestionExamens/ProgrammerCalendrier";
import CalendrierDetails from "pages/GestionExamens/CalendrierDetails";
import ListDomaineClass from "pages/Departements/GestionClasses/DomaineClasse/ListDomaineClasse";
import ListMentionClasse from "pages/Departements/GestionClasses/MentionClasse/ListMentionClasse";
//! Gestion des Notes Examen
import GestionNotesExamen from "pages/GestionNotesExamen";
import AjouterNotesExamen from "pages/GestionNotesExamen/AjouterNotesExamen";

import GenerateDemandeEnseignant from "pages/Demande-enseignant/GenerateDemandeEnseignant";
import GenerateDemandePersonnel from "pages/Demande-personnel/GenerateDemandePersonnel";
import AjouterDeplacement from "pages/Deplacement/AjouterDeplacement";
import ListeDeplacements from "pages/Deplacement/ListeDeplacements";
import AjouterNotePro from "pages/Notes-professionnels/AjouterNotePro";
import ListeNotesPro from "pages/Notes-professionnels/ListeNotesPro";
import AjouterMission from "pages/Mission/AjouterMission";
import ListeMissions from "pages/Mission/ListeMission";
import GenerateFicheTache from "pages/Mission/GenererFichierTache";
import ListeParcours from "pages/GestionParcours/Parcours/ListeParcours";
import ListeModulesParcours from "pages/GestionParcours/ModulesParcours/ListeModulesParcours";
import ListTypeParcours from "pages/GestionParcours/TypeParcours/ListTypeParcours";
import AddPlanParcours from "pages/GestionParcours/Parcours/AddPlanParcours";

//! Application Enseignant
import AbsenceEtudiant from "pages/ApplicationEnseignant/AbsenceEtudiant";
import Cours from "pages/ApplicationEnseignant/Cours";
import AjouterAbsence from "pages/ApplicationEnseignant/AbsenceEtudiant/AjouterAbsence";

import AjouterAbsencePersonnel from "pages/AbsencePersonnel/AjouterAbsencePersonnel";
import ListeCycle from "pages/GestionParcours/Cycle/ListeCycle";
import ViewParcours from "pages/GestionParcours/Parcours/ViewParcours";
import ParametresEmploi from "pages/Departements/ParametresEmploi/ParametresEmploi";
import AjouterCours from "pages/ApplicationEnseignant/Cours/AjouterCours";
import FicheEtudiant from "pages/Accounts/AccountEtudiant/FicheEtudiant";
import FicheEtudiantAr from "pages/Accounts/AccountEtudiant/FicheEtudiantAr";
import FicheEnseignant from "pages/Accounts/AccountEnseignant/FicheEnseignant";
import FicheEnseignantAr from "pages/Accounts/AccountEnseignant/FicheEnseignantAr";
import EditClasse from "pages/Departements/GestionClasses/EditClasse";
import ViewAbsence from "pages/ApplicationEnseignant/AbsenceEtudiant/ViewAbsence";
import EditAbsence from "pages/ApplicationEnseignant/AbsenceEtudiant/EditAbsence";
import ViewCours from "pages/ApplicationEnseignant/Cours/ViewCours";
import EditCours from "pages/ApplicationEnseignant/Cours/EditCours";
import AddDemandeTirage from "pages/ServiceTirage/AddDemandeTirage";
import DemandesTirage from "pages/ServiceTirage";
import RepartitionGroupe from "pages/Gestion-etudiant/RepartitionGroupes";
import RepartitionEnseignant from "pages/Gestion-enseignant/RepartitionEnseignant";
import RechercheAvance from "pages/Gestion-etudiant/RechercheAvance";
import RepartitionPersonnel from "pages/Gestion-personnel/RepartitionPersonnel";
const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  //service Tirage
  {
    path: "/service-tirage/liste-tirages",
    component: <DemandesTirage />,
  },
  {
    path: "/service-tirage/ajouter-tirage",
    component: <AddDemandeTirage />,
  },
  // view parcours
  {
    path: "/parcours/gestion-parcours/view-parcours",
    component: <ViewParcours />,
  },
  // liste cycles
  {
    path: "/parcours/gestion-parcours/liste-cycle",
    component: <ListeCycle />,
  },

  //Parcours Part

  {
    path: "/parcours/gestion-parcours/liste-parcours",
    component: <ListeParcours />,
  },
  //ajouter parcours
  {
    path: "/parcours/gestion-parcours/ajouter-plan-parcours",
    component: <AddPlanParcours />,
  },

  {
    path: "/parcours/gestion-parcours/liste-modules",
    component: <ListeModulesParcours />,
  },
  {
    path: "/parcours/gestion-parcours/liste-type-parcours",
    component: <ListTypeParcours />,
  },
  //avis etudiant
  {
    path: "/avis-etudiant/ajouter-avis-etudiant",
    component: <AjouterAvisEtudiant />,
  },
  {
    path: "/avis-etudiant/liste-avis-etudiant",
    component: <ListeAvisEtudiant />,
  },
  {
    path: "/avis-etudiant/single-avis-etudiant",
    component: <SingleAvisEtudiant />,
  },
  {
    path: "/avis-etudiant/edit-avis-etudiant",
    component: <EditAvisEtudiant />,
  },

  //avis enseignant
  {
    path: "/avis-enseignant/liste-avis-enseignant",
    component: <ListeAvisEnseignant />,
  },
  {
    path: "/avis-enseignant/ajouter-avis-enseignant",
    component: <AjouterAvisEnseignant />,
  },
  {
    path: "/avis-enseignant/single-avis-enseignant",
    component: <SingleAvisEnseignant />,
  },
  // avis personnel
  {
    path: "/avis-personnel/liste-avis-personnel",
    component: <ListeAvisPersonnel />,
  },
  {
    path: "/avis-personnel/ajouter-avis-personnel",
    component: <AjouterAvisPersonnel />,
  },
  {
    path: "/avis-personnel/single-avis-personnel",
    component: <SingleAvisPersonnel />,
  },
  // actualite
  { path: "/actualite/liste-actualite", component: <ListeActualite /> },
  { path: "/actualite/ajouter-actualite", component: <AjouterActualite /> },
  { path: "/actualite/details-actualite", component: <SingleActualite /> },
  { path: "/actualite/edit-actualite", component: <EditActualite /> },

  // gestion etudiant
  { path: "/gestion-etudiant/compte-etudiant", component: <MyAccount /> },
  { path: "/gestion-etudiant/liste-etudiants", component: <ListEtudiants /> },
  {
    path: "/gestion-etudiant/repartition-groupe",
    component: <RepartitionGroupe />,
  },
  {
    path: "/gestion-etudiant/recherche-avance",
    component: <RechercheAvance />,
  },
  {
    path: "/gestion-etudiant/ajouter-etudiant",
    component: <AjouterEtudiant />,
  },
  {
    path: "/gestion-etudiant/edit-compte-etudiant",
    component: <EditProfilEtudiant />,
  },
  {
    path: "/gestion-etudiant/print-compte-etudiant",
    component: <FicheEtudiant />,
  },
  {
    path: "/gestion-etudiant/ar-print-compte-etudiant",
    component: <FicheEtudiantAr />,
  },

  //! Gestion des Notes Examen
  {
    path: "/gestion-examen/liste-des-notes-examen",
    component: <GestionNotesExamen />,
  },
  {
    path: "/gestion-examen/ajouter-des-notes-examen",
    component: <AjouterNotesExamen />,
  },

  //! Application Enseignant
  {
    path: "/application-enseignant/lister-absence",
    component: <AbsenceEtudiant />,
  },
  {
    path: "/application-enseignant/ajouter-absence",
    component: <AjouterAbsence />,
  },

  {
    path: "/application-enseignant/visualiser-absence-etudiant",
    component: <ViewAbsence />,
  },
  {
    path: "/application-enseignant/modifier-absence-etudiant",
    component: <EditAbsence />,
  },
  {
    path: "/application-enseignant/lister-cours",
    component: <Cours />,
  },
  {
    path: "/application-enseignant/ajouter-cours",
    component: <AjouterCours />,
  },
  {
    path: "/application-enseignant/visualiser-support-cours",
    component: <ViewCours />,
  },
  {
    path: "/application-enseignant/modifier-support-cours",
    component: <EditCours />,
  },
  //gestion enseignant
  {
    path: "/gestion-enseignant/ajouter-enseignant",
    component: <AjouterEnseignant />,
  },
  {
    path: "/gestion-enseignant/liste-enseignants",
    component: <ListEnseignants />,
  },
  {
    path: "/gestion-enseignant/compte-enseignant",
    component: <AccountEnseignant />,
  },
  {
    path: "/gestion-enseignant/repartition-enseignant",
    component: <RepartitionEnseignant />,
  },
  {
    path: "/gestion-enseignant/edit-compte-enseignant",
    component: <EditProfilEnseignant />,
  },
  {
    path: "/gestion-enseignant/print-compte-enseignant",
    component: <FicheEnseignant />,
  },
  {
    path: "/gestion-enseignant/ar-print-compte-enseignant",
    component: <FicheEnseignantAr />,
  },

  // Dossier Administratif Enseignant
  {
    path: "/gestion-enseignant/ajouter-dossier-administartif",
    component: <AddDossieradministratif />,
  },
  {
    path: "/gestion-enseignant/liste-dossier-administartif",
    component: <ListeDossierAdministratif />,
  },
  {
    path: "/gestion-enseignant/details-dossier-administratif",
    component: <ViewDossierAdministratif />,
  },
  {
    path: "/gestion-enseignant/edit-dossier-administratif",
    component: <EditDossierAdministratifEnseignants />,
  },
  {
    path: "/gestion-enseignant/liste-archive-dossier-administratif",
    component: <ListeDossierAdministratifEnseignantsArchives />,
  },
  //gestion personnel
  {
    path: "/gestion-personnel/ajouter-personnel",
    component: <AjouterPersonnels />,
  },
  {
    path: "/gestion-personnel/liste-personnels",
    component: <ListPersonnels />,
  },
  {
    path: "/gestion-personnel/repartition-personnel",
    component: <RepartitionPersonnel />,
  },
  {
    path: "/gestion-personnel/compte-personnel",
    component: <AccountPersonnel />,
  },
  {
    path: "/gestion-personnel/edit-compte-personnel",
    component: <EditProfilPersonnel />,
  },
  //Dossier administratif personnel
  {
    path: "/gestion-personnel/ajouter-dossier-administartif",
    component: <AddDossieradministratifPersonnels />,
  },
  {
    path: "/gestion-personnel/liste-dossier-administartif",
    component: <ListeDossierAdministratifPersonnels />,
  },
  {
    path: "/gestion-personnel/details-dossier-administratif",
    component: <ViewDossierAdministratifPersonnel />,
  },
  {
    path: "/gestion-personnel/edit-dossier-administratif",
    component: <EditDossierAdministratifPersonnels />,
  },
  {
    path: "/gestion-personnel/liste-archive-dossier-administratif",
    component: <ListeDossiersAdministratifsPersonnelsArchives />,
  },

  //demande etudiant
  {
    path: "/demandes-etudiant/Liste-demandes-etudiant",
    component: <ListeDemandeEtudiant />,
  },
  {
    path: "/demandes-etudiant/Single-demande-etudiant",
    component: <SingleDemandeEtudiant />,
  },
  {
    path: "/demandes-etudiant/Edit-demande-etudiant",
    component: <EditDemandeEtudiant />,
  },
  {
    path: "/demandes-etudiant/ajouter-demande-etudiant",
    component: <AjouterDemandeEtudiant />,
  },
  {
    path: "/demandes-etudiant/generer-demande-etudiant",
    component: <GenerateDemande />,
  },

  //demande enseignant
  {
    path: "/demandes-enseignant/liste-demande-enseignant",
    component: <ListeDemandeEnseignant />,
  },
  {
    path: "/demandes-enseignant/single-demande-enseignant",
    component: <SingleDemandeEnseignant />,
  },
  {
    path: "/demandes-enseignant/edit-demande-enseignant",
    component: <EditDemandeEnseignant />,
  },
  {
    path: "/demandes-enseignant/ajouter-demande-enseignant",
    component: <AjouterDemandeEnseignant />,
  },
  {
    path: "/demandes-enseignant/generer-demande-enseignant",
    component: <GenerateDemandeEnseignant />,
  },

  //demande personnel
  {
    path: "/demandes-personnel/liste-demande-personnel",
    component: <ListeDemandePersonnel />,
  },
  {
    path: "/demandes-personnel/single-demande-personnel",
    component: <SingleDemandePersonnel />,
  },
  {
    path: "/demandes-personnel/edit-demande-personnel",
    component: <EditDemandePersonnel />,
  },
  {
    path: "/demandes-personnel/ajouter-demande-personnel",
    component: <AjouterDemandePersonnel />,
  },
  {
    path: "/demandes-personnel/generer-demande-personnel",
    component: <GenerateDemandePersonnel />,
  },

  //reclamation etudiant
  {
    path: "/reclamation-etudiant/liste-reclamation-etudiant",
    component: <ListeReclamationEtudiant />,
  },
  {
    path: "/reclamation-etudiant/single-reclamation-etudiant",
    component: <SingleReclamationEtudiant />,
  },
  {
    path: "/reclamation-etudiant/edit-reclamation-etudiant",
    component: <EditReclamationEtudiant />,
  },
  {
    path: "/reclamation-etudiant/ajouter-reclamation-etudiant",
    component: <AjouterReclamationEtudiant />,
  },
  //reclamation enseignant
  {
    path: "/reclamation-enseignant/liste-reclamation-enseignant",
    component: <ListeReclamationEnseignant />,
  },
  {
    path: "/reclamation-enseignant/single-reclamation-enseignant",
    component: <SingleReclamationEnseignant />,
  },
  {
    path: "/reclamation-enseignant/edit-reclamation-enseignant",
    component: <EditReclamationEnseignant />,
  },
  {
    path: "/reclamation-enseignant/ajouter-reclamation-enseignant",
    component: <AjouterReclamationEnseignant />,
  },
  //reclamation personnel
  {
    path: "/reclamation-personnel/liste-reclamation-personnel",
    component: <ListeReclamationPersonnel />,
  },
  {
    path: "/reclamation-personnel/single-reclamation-personnel",
    component: <SingleReclamationPersonnel />,
  },
  {
    path: "/reclamation-personnel/edit-reclamation-personnel",
    component: <EditReclamationPersonnel />,
  },
  {
    path: "/reclamation-personnel/ajouter-reclamation-personnel",
    component: <AjouterReclamationPersonnel />,
  },

  //parametre Compte  Etudiants (etat et inscription)
  {
    path: "/parametre-etudiant/etat/liste-etat-etudiant",
    component: <ListParametresEtudiants />,
  },
  {
    path: "/parametre-etudiant/etat/ajouter-etat-etudiant",
    component: <AddEtatEtudiant />,
  },
  {
    path: "/parametre-etudiant/etat/edit-etat-etudiant",
    component: <EditEtatEtudiant />,
  },
  {
    path: "/parametre-etudiant/inscription/liste-inscription-etudiant",
    component: <ListeInscriptionEtudiants />,
  },
  {
    path: "/parametre-etudiant/inscription/add-inscription-etudiant",
    component: <AddTypeInscriptionEtudiant />,
  },
  {
    path: "/parametre-etudiant/inscription/edit-type-inscription-etudiant",
    component: <EditTypeInscriptionEtudiant />,
  },

  //parametre Compte Enseignant
  {
    path: "/parametre-enseignant/etat/liste-etat-enseignant",
    component: <ListEtatEnseignants />,
  },
  {
    path: "/parametre-enseignant/etat/ajouter-etat-enseignant",
    component: <AddEtatEnseignant />,
  },
  {
    path: "/parametre-enseignant/etat/edit-etat-enseignant",
    component: <EditEtatEnseignant />,
  },
  {
    path: "/parametre-enseignant/grade/liste-grade-enseignant",
    component: <ListGradeEnseignants />,
  },
  {
    path: "/parametre-enseignant/grade/ajouter-grade-enseignant",
    component: <AddGradeEnseignant />,
  },
  {
    path: "/parametre-enseignant/grade/edit-grade-enseignant",
    component: <EditGradeEnseignant />,
  },
  {
    path: "/parametre-enseignant/poste/liste-poste-enseignant",
    component: <ListePostEnseignants />,
  },
  {
    path: "/parametre-enseignant/poste/ajouter-poste-enseignant",
    component: <AddPosteEnseignant />,
  },
  {
    path: "/parametre-enseignant/poste/edit-poste-enseignant",
    component: <EditPosteEnseignant />,
  },
  {
    path: "/parametre-enseignant/specialite/liste-specialite-enseignant",
    component: <ListSpecialiteEnseignants />,
  },
  {
    path: "/parametre-enseignant/specialite/ajouter-specialite-enseignant",
    component: <AddSpecialiteEnseignant />,
  },
  {
    path: "/parametre-enseignant/specialite/edit-specialite-enseignant",
    component: <EditSpecialiteEnseignant />,
  },

  //parametre Compte Personnel
  {
    path: "/parametre-personnel/etat/liste-etat-personnel",
    component: <ListEtatPersonnels />,
  },
  {
    path: "/parametre-personnel/etat/add-etat-personnel",
    component: <AddEtatPersonnel />,
  },
  {
    path: "/parametre-personnel/etat/edit-etat-personnel",
    component: <EditEtatPersonnel />,
  },
  {
    path: "/parametre-personnel/grade/liste-grade-personnel",
    component: <ListGradePersonnels />,
  },
  {
    path: "/parametre-personnel/grade/ajouter-grade-personnel",
    component: <AddGradePersonnel />,
  },
  {
    path: "/parametre-personnel/grade/edit-grade-personnel",
    component: <EditGradePersonnel />,
  },
  {
    path: "/parametre-personnel/service/liste-service-personnel",
    component: <ListServicesPersonnels />,
  },
  {
    path: "/parametre-personnel/service/ajouter-service-personnel",
    component: <AddServicesPersonnel />,
  },
  {
    path: "/parametre-personnel/service/edit-service-personnel",
    component: <EditServicesPersonnel />,
  },
  {
    path: "/parametre-personnel/poste/liste-poste-personnel",
    component: <ListePostPersonnels />,
  },
  {
    path: "/parametre-personnel/poste/ajouter-poste-personnel",
    component: <AddPostePersonnel />,
  },
  {
    path: "/parametre-personnel/poste/edit-poste-personnel",
    component: <EditPostePersonnel />,
  },
  {
    path: "/parametre-personnel/categorie/liste-categorie-personnel",
    component: <ListCategoriePersonnels />,
  },
  {
    path: "/parametre-personnel/categorie/ajouter-categorie-personnel",
    component: <AddCategoriePersonnel />,
  },
  {
    path: "/parametre-personnel/categorie/edit-categorie-personnel",
    component: <EditCategoriePersonnel />,
  },

  // Gestion des matieres
  {
    path: "/departement/gestion-matieres/liste-matieres",
    component: <ListMatieres />,
  },
  {
    path: "/departement/gestion-matieres/ajouter-matiere",
    component: <AddMatiere />,
  },
  {
    path: "/departement/gestion-matieres/edit-matiere",
    component: <EditMatiere />,
  },

  // Gestion des salles
  {
    path: "/departement/gestion-salles/liste-salles",
    component: <ListSalles />,
  },
  {
    path: "/departement/gestion-salles/ajouter-salle",
    component: <AddSalle />,
  },
  { path: "/departement/gestion-salles/edit-salle", component: <EditSalle /> },

  // Gestion des classes
  {
    path: "/departement/gestion-classes/liste-classes",
    component: <ListClasses />,
  },
  {
    path: "/departement/gestion-classes/ajouter-classe",
    component: <AddClasse />,
  },
  {
    path: "/departement/gestion-departements/classes/edit-classe",
    component: <EditClasse />,
  },
  {
    path: "/departement/gestion-classes/affecter-matiere",
    component: <AffecterMatiere />,
  },
  {
    path: "/departement/gestion-classes/liste-niveau",
    component: <ListNiveau />,
  },
  {
    path: "/departement/gestion-classes/ajouter-niveau",
    component: <AddNiveau />,
  },
  {
    path: "/departement/gestion-classes/edit-niveau",
    component: <EditNiveau />,
  },
  {
    path: "/departement/gestion-classes/liste-section",
    component: <ListSections />,
  },
  {
    path: "/departement/gestion-classes/ajouter-section",
    component: <AddSection />,
  },
  {
    path: "/departement/gestion-classes/edit-section",
    component: <EditSection />,
  },
  // domaine classe

  {
    path: "/departement/gestion-classes/liste-domaines",
    component: <ListDomaineClass />,
  },

  // mention classe

  {
    path: "/departement/gestion-classes/liste-mentions",
    component: <ListMentionClasse />,
  },
  // Gestion Type seance

  {
    path: "/departement/gestion-types-seances/liste-types-seances",
    component: <ListTypeSeances />,
  },
  { path: "/parametre/add-type-seance", component: <AddTypeSeance /> },

  //Gestion des departements
  {
    path: "/departement/gestion-departements/liste-departements",
    component: <ListDepartement />,
  },
  {
    path: "/departement/gestion-departements/departements/add-departement",
    component: <AddDepartement />,
  },
  {
    path: "/departement/gestion-departements/departements/edit-departement",
    component: <EditDepartement />,
  },

  //liste lien utils
  { path: "/liens-utils", component: <ListLienUtilst /> },

  // Liste espaces de telechargements
  { path: "/espace-telechargement", component: <ListEspaceTelechargement /> },

  //Permission

  { path: "/permissions", component: <Permissions /> },
  { path: "/admin/liste-admins", component: <ListeAdmin /> },
  { path: "/admin/single-admin", component: <SingleAdmin /> },
  { path: "/admin/edit-admin", component: <EditAdmin /> },
  { path: "/admin/history-admin", component: <HistoryAdmin /> },
  { path: "/admin/ajouter-admin", component: <CreateAdmin /> },

  //template Body
  { path: "/template/liste-template-body", component: <TemplateBody /> },
  { path: "/template/ajouter-template-body", component: <NewTemplateBody /> },
  { path: "/template/single-template-body", component: <TemplateBodyDetail /> },
  //short code
  { path: "/shortCode/liste-short-code", component: <ShortCode /> },
  { path: "/shortCode/ajouter-short-code", component: <NewShortCode /> },
  // variable globale
  {
    path: "/variable/ajouter-variables-globales",
    component: <AjouterVariablesGlobales />,
  },
  {
    path: "/variable/liste-variables-globales",
    component: <ListeVariablesGlobales />,
  },

  // Papier administratif
  {
    path: "/papier-administratif/ajouter-papier",
    component: <AddPapierAdministratif />,
  },
  {
    path: "/papier-administratif/lister-papier",
    component: <ListePapierAdministratifs />,
  },

  // gestion des Types de congés
  { path: "/type-conge/Liste-type-conge", component: <ListeLeaveType /> },
  { path: "/type-conge/ajouter-type-conge", component: <AjouterLeaveType /> },
  {
    path: "/type-conge/edit-annuel-type-conge",
    component: <EditAnnuelLeaveType />,
  },
  // gestion des demandes congés
  {
    path: "/demande-conge/ajouter-demande-conge",
    component: <AjouterDemandeConge />,
  },
  {
    path: "/demande-conge/liste-demande-conge",
    component: <ListeDemandeConge />,
  },
  {
    path: "/demande-conge/single-demande-conge",
    component: <DemandeCongeDetails />,
  },
  {
    path: "/demande-conge/edit-demande-conge",
    component: <EditDemandeConge />,
  },

  // gestion des soldes congés
  {
    path: "/solde-conge/Ajouter-solde-conge",
    component: <AjouterSoldeConge />,
  },
  { path: "/solde-conge/liste-solde-conge", component: <ListeSoldeConge /> },

  // Gestion des deplacements

  {
    path: "/gestion-deplacement/Ajouter-deplacement",
    component: <AjouterDeplacement />,
  },

  {
    path: "/gestion-deplacement/Liste-deplacements",
    component: <ListeDeplacements />,
  },
  // Gestion des missions

  {
    path: "/gestion-mission/ajouter-mission",
    component: <AjouterMission />,
  },

  {
    path: "/gestion-mission/liste-mission",
    component: <ListeMissions />,
  },
  {
    path: "/gestion-mission/generer-fiche",
    component: <GenerateFicheTache />,
  },
  // Gestion des notes professionelles

  {
    path: "/gestion-notes-professionelles/Ajouter-notes-professionelles",
    component: <AjouterNotePro />,
  },

  {
    path: "gestion-notes-professionelles/Liste-notes-professionelles",
    component: <ListeNotesPro />,
  },

  // Gestion  Des fiches des voeux
  {
    path: "/gestion-emplois/gestion-fiche-voeux/add-fiche-voeux",
    component: <AddFicheVoeux />,
  },
  {
    path: "/gestion-emplois/gestion-fiche-voeux/liste-fiche-voeux",
    component: <ListFicheVoeux />,
  },
  {
    path: "/gestion-emplois/gestion-fiche-voeux/edit-fiche-voeux",
    component: <EditFicheVoeux />,
  },

  // liste des rattrapages
  { path: "/rattrapage/ajouter-rattrapage", component: <AjouterRattrapage /> },
  { path: "/rattrapage/liste-rattrapages", component: <ListeRattrapages /> },

  //! Calendrier Examen
  {
    path: "/gestion-examen/ajouter-calendrier-examen",
    component: <AjouterCalendrierExamen />,
  },
  // claendrier details
  {
    path: "/gestion-examen/details-calendrier-examen",
    component: <CalendrierDetails />,
  },
  {
    path: "/gestion-examen/liste-des-calendrier",
    component: <ListCalendrier />,
  },
  {
    path: "/gestion-examen/programmer-calendrier",
    component: <ProgrammerCalendrier />,
  },

  //gestion emploi classes periods
  {
    path: "/gestion-emplois/emploi-classe/liste-emplois",
    component: <ListeEmploisClasse />,
  }, // liste classe
  {
    path: "/gestion-emplois/emploi-classe/single-emplois",
    component: <SingleEmploiClasse />,
  }, //view
  {
    path: "/gestion-emplois/emploi-classe/liste-seance",
    component: <GestionSeances />,
  }, //view tableau des seance
  {
    path: "/gestion-emplois/emploi-classe/periodes-classes",
    component: <ListClassPeriods />,
  }, // creeer periode d emploi
  {
    path: "/gestion-emplois/emploi-classe/tableau-des-charges-horaires-classes",
    component: <TableauChargesHorairesClasses />,
  },

  //gestion emploi enseignant
  {
    path: "/gestion-emplois/emlpoi-enseignant/single-emplois",
    component: <SingleEmploiEnseignant />,
  },
  {
    path: "/gestion-emplois/emlpoi-enseignant/liste-emplois",
    component: <ListeEmploiEnseignants />,
  },
  {
    path: "/gestion-emplois/emlpoi-enseignant/tableau-charges-horaires",
    component: <TableauChargesHoraires />,
  },
  {
    path: "/gestion-emplois/emlpoi-enseignant/teacher-period",
    component: <TeacherPeriod />,
  },
  {
    path: "/gestion-emplois/emlpoi-enseignant/liste-charges-grade",
    component: <EquilibreHorairesGrade />,
  },

  {
    path: "gestion-emplois-classe/parametres-emplois-classe",
    component: <ParametresEmploi />,
  },

  // absence personnel

  {
    path: "/absence-personnel/ajouter-absence-personnel",
    component: <AjouterAbsencePersonnel />,
  },

  // Accounts
  { path: "/account", component: <MyAccount /> },
  { path: "/settings", component: <Settings /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes = [
  // Authentication
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgotPassword /> },

  // AuthenticationInner
  { path: "/auth-signup-basic", component: <SignUp /> },
  { path: "/auth-signin-basic", component: <SignIn /> },
  { path: "/auth-pass-reset-basic", component: <PasswordReset /> },
  { path: "/auth-pass-change-basic", component: <PasswordCreate /> },
  { path: "/auth-success-msg-basic", component: <SuccessMessage /> },
  { path: "/auth-twostep-basic", component: <TwoStepVerify /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-404", component: <Error404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/coming-soon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
