import { Navigate } from "react-router-dom";

import Dashboard from "pages/Dashboard";

//new routes

//Product
import ListView from "pages/Products/ListView";
import GridView from "pages/Products/GridView";
import Overview from "pages/Products/Overview";
import CreateProduct from "pages/Products/CreateProduct";
import Categories from "pages/Products/Categories";
import SubCategories from "pages/Products/SubCategories";

// Orders
import OrdersListView from "pages/Orders/ListView";
import OrdersOverview from "pages/Orders/Overview";

// Calender
import Calendar from "pages/Calendar";

// Sellers
import SellersListView from "pages/Sellers/ListView";
import SellersGridView from "pages/Sellers/GridView";
import SellersOverview from "pages/Sellers/Overview";

// Invoice
import InvoiceList from "pages/Invoices/InvoiceList";
import InvoiceDetails from "pages/Invoices/InvoiceDetails";
import CreateInvoice from "pages/Invoices/CreateInvoice";

// User List
import UsersList from "pages/UsersList";

// Shipping
import Shipments from "pages/Shipping/Shipments";
import ShippingList from "pages/Shipping/ShippingList";

// Coupons
import Coupons from "pages/Coupons";

//Review & Rating
import ReviewRating from "pages/Reviews-Rating";

//Brands
import Brands from "pages/Brands";

//statistics
import Statistics from "pages/Statistics";

// Localization
import Transactions from "pages/Localization/Transactions";
import CurrencyRates from "pages/Localization/CurrencyRates";

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
import AccountPersonnel from "pages/Accounts/AccountPersonnel";
import AjouterEtudiant from "pages/Gestion-etudiant/AjouterEtudiant";
import ListEtudiants from "pages/Gestion-etudiant/ListeEtudiant";
import EditProfilEtudiant from "pages/Gestion-etudiant/EditProfilEtudiant";
import AjouterEnseignant from "pages/Gestion-enseignant/AjouterEnseignant";
import ListEnseignants from "pages/Gestion-enseignant/ListeEnseignant";
import AccountEnseignant from "pages/Accounts/AccountEnseignant";
import AddDossieradministratif from "pages/Gestion-enseignant/Dossieradministratif/AddDossieradministratif";
import ListeDossierAdministratif from "pages/Gestion-enseignant/Dossieradministratif/ListeDossierAdministratif";
import ViewDossierAdministratif from "pages/Gestion-enseignant/Dossieradministratif/ViewDossierAdministratif";
import EditDossierAdministratifEnseignants from "pages/Gestion-enseignant/Dossieradministratif/EditDossierAdministratif";
import AjouterPersonnels from "pages/Gestion-personnel/AjouterPersonnel";
import ListePersonnels from "pages/Gestion-personnel/ListePersonnels";
import AddDossieradministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/AddDossierAdministratifPersonnels";
import ListeDossierAdministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/ListeDossierAdministratifPersonnels";
import ViewDossierAdministratifPersonnel from "pages/Gestion-personnel/Dossieradministratif/ViewDossierAdministratifPersonnel";
import EditDossierAdministratifPersonnels from "pages/Gestion-personnel/Dossieradministratif/EditDossierAdministratif";
import ListeAvisEtudiant from "pages/avis-etudiant/ListeAvisEtudiant";
import AjouterAvisEtudiant from "pages/avis-etudiant/AjouterAvisEtudiant";
import SingleAvisEtudiant from "pages/avis-etudiant/SingleAvisEtudiant";
import EditAvisEtudiant from "pages/avis-etudiant/EditAvisEtudiant";
import ListeActualite from "pages/actualite/ListeActualite";
import AjouterActualite from "pages/actualite/AjouterActualite";
import EditActualite from "pages/actualite/EditActualite";
import SingleActualite from "pages/actualite/SingleActualite";
import EditDemandeEtudiant from "pages/Demande-etudiant/EditDemandeEtudiant";
import AjouterDemandeEtudiant from "pages/Demande-etudiant/AjouterDemandeEtudiant";
import GenerateDemande from "pages/Demande-etudiant/GenerateDemande";
import ListeDemandeEtudiant from "pages/Demande-etudiant/ListeDemandeEtudiant";
import SingleDemandeEtudiant from "pages/Demande-etudiant/SingleDemandeEtudiant";
import ListeDemandeEnseignant from "pages/Demande-enseignant/ListeDemandeEnseignant";
import SingleDemandeEnseignant from "pages/Demande-enseignant/SingleDemandeEnseignant";
import EditDemandeEnseignant from "pages/Demande-enseignant/EditDemandeEnseignant";
import AjouterDemandeEnseignant from "pages/Demande-enseignant/AjouterDemandeEnseignant";
import ListeDemandePersonnel from "pages/Demande-personnel/ListeDemandePersonnel";
import SingleDemandePersonnel from "pages/Demande-personnel/SingleDemandePersonnel";
import EditDemandePersonnel from "pages/Demande-personnel/EditDemandePersonnel";
import AjouterDemandePersonnel from "pages/Demande-personnel/AjouterDemandePersonnel";
import ListeReclamationEtudiant from "pages/Reclamation-etudiant/ListeReclamationEtudiant";
import SingleReclamationEtudiant from "pages/Reclamation-etudiant/SingleReclamationEtudiant";
import EditReclamationEtudiant from "pages/Reclamation-etudiant/EditReclamationEtudiant";
import AjouterReclamationEtudiant from "pages/Reclamation-etudiant/AjouterReclamationEtudiant";
import ListeReclamationEnseignant from "pages/Reclamation-enseignant/ListeReclamationEnseignant";
import SingleReclamationEnseignant from "pages/Reclamation-enseignant/SingleReclamationEnseignant";
import EditReclamationEnseignant from "pages/Reclamation-enseignant/EditReclamationEnseignant";
import AjouterReclamationEnseignant from "pages/Reclamation-enseignant/AjouterReclamationEnseignant";
import ListeReclamationPersonnel from "pages/Reclamation-personnel/ListeReclamationPersonnel";
import SingleReclamationPersonnel from "pages/Reclamation-personnel/SingleReclamationPersonnel";
import EditReclamationPersonnel from "pages/Reclamation-personnel/EditReclamationPersonnel";
import AjouterReclamationPersonnel from "pages/Reclamation-personnel/AjouterReclamationPersonnel";
import ListParametresEtudiants from "pages/Parametres/ParametresEtudiants/EtatEtudiant/ListParametreEtudiants";
import AddEtatEtudiant from "pages/Parametres/ParametresEtudiants/EtatEtudiant/AddEtatEtudiant";
import EditEtatEtudiant from "pages/Parametres/ParametresEtudiants/EtatEtudiant/EditEtatEtudiant";
import ListeInscriptionEtudiants from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/ListeInscriptionEtudiants";
import AddTypeInscriptionEtudiant from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/AddInscriptionEtudiant";
import EditTypeInscriptionEtudiant from "pages/Parametres/ParametresEtudiants/InscriptionEtudiant/EditInscriptionEtudiant";
import ListEtatEnseignants from "pages/Parametres/ParametresEnseignants/ListEtatEnseignants";
import AddEtatEnseignant from "pages/Parametres/ParametresEnseignants/AddEtatEnseignants";
import EditEtatEnseignant from "pages/Parametres/ParametresEnseignants/EditEtatEnseignant";
import ListGradeEnseignants from "pages/Parametres/ParametresEnseignants/ListGradeEnseignant";
import AddGradeEnseignant from "pages/Parametres/ParametresEnseignants/AddGradeEnseignant";
import EditGradeEnseignant from "pages/Parametres/ParametresEnseignants/EditGradeEnseignant";
import ListePostEnseignants from "pages/Parametres/ParametresEnseignants/ListePostEnseignants";
import AddPosteEnseignant from "pages/Parametres/ParametresEnseignants/AddPosteEnseignant";
import EditPosteEnseignant from "pages/Parametres/ParametresEnseignants/EditPosteEnseignant";
import ListSpecialiteEnseignants from "pages/Parametres/ParametresEnseignants/ListSpecialiteEnseignants";
import AddSpecialiteEnseignant from "pages/Parametres/ParametresEnseignants/AddSpecialiteEnseignant";
import EditSpecialiteEnseignant from "pages/Parametres/ParametresEnseignants/EditSpecialiteEnseignant";
import ListEtatPersonnels from "pages/Parametres/ParametresPersonnels/ListEtatPersonnels";
import AddEtatPersonnel from "pages/Parametres/ParametresPersonnels/AddEtatPersonnel";
import EditEtatPersonnel from "pages/Parametres/ParametresPersonnels/EditEtatPersonnel";
import ListGradePersonnels from "pages/Parametres/ParametresPersonnels/ListGradePersonnels";
import AddGradePersonnel from "pages/Parametres/ParametresPersonnels/AddGradePersonnel";
import EditGradePersonnel from "pages/Parametres/ParametresPersonnels/EditGradePersonnel";
import ListServicesPersonnels from "pages/Parametres/ParametresPersonnels/ListServicesPersonnels";
import AddServicesPersonnel from "pages/Parametres/ParametresPersonnels/AddServicePersonnel";
import EditServicesPersonnel from "pages/Parametres/ParametresPersonnels/EditServicesPersonnel";
import ListePostPersonnels from "pages/Parametres/ParametresPersonnels/ListPostePersonnels";
import AddPostePersonnel from "pages/Parametres/ParametresPersonnels/AddPostePersonnel";
import EditPostePersonnel from "pages/Parametres/ParametresPersonnels/EditPostePersonnels";
import ListCategoriePersonnels from "pages/Parametres/ParametresPersonnels/ListCategoriePersonnels";
import AddCategoriePersonnel from "pages/Parametres/ParametresPersonnels/AddCategoriePersonnels";
import EditCategoriePersonnel from "pages/Parametres/ParametresPersonnels/EditCategoriePersonnel";
import ListMatieres from "pages/Departements/GestionMatieres/ListMatieres";
import AddMatiere from "pages/Departements/GestionMatieres/AddMatiere";
import EditMatiere from "pages/Departements/GestionMatieres/EditMatiere";
import ListSalles from "pages/Departements/GestionSalles/ListSalles";
import AddSalle from "pages/Departements/GestionSalles/AjouterSalle";
import EditSalle from "pages/Departements/GestionSalles/EditSalle";
import ListClasses from "pages/Departements/GestionClasses/ListClasses";
import AddClasse from "pages/Departements/GestionClasses/AjouterClasse";
import AffecterMatiere from "pages/AffecterMatiere/AffecterMatiere";
import ListNiveau from "pages/Departements/GestionClasses/NiveauScolaire/ListNiveau";
import AddNiveau from "pages/Departements/GestionClasses/NiveauScolaire/AddNiveau";
import EditNiveau from "pages/Departements/GestionClasses/NiveauScolaire/EditNiveau";
import ListSections from "pages/Departements/GestionClasses/Section/ListSections";
import AddSection from "pages/Departements/GestionClasses/Section/AddSection";
import EditSection from "pages/Departements/GestionClasses/Section/EditSection";
import ListTypeSeances from "pages/Departements/TypeSeances/ListTypeSeances";
import AddTypeSeance from "pages/Departements/TypeSeances/AddTypeSeance";
import ListDepartement from "pages/Departements/GestionDepartements/ListDepartement";
import AddDepartement from "pages/Departements/GestionDepartements/AjouterDepaetement";
import EditDepartement from "pages/Departements/GestionDepartements/EditDepartement";
import AddFicheVoeux from "pages/Departements/FicheVoeux/AddFicheVoeux";
import ListFicheVoeux from "pages/Departements/FicheVoeux/ListeFicheVoeux";
import EditFicheVoeux from "pages/Departements/FicheVoeux/EditFicheVoeux";
const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  //! Avis Etudiant
  {
    path: "/avis-etudiant/liste-avis-etudiant",
    component: <ListeAvisEtudiant />,
  },
  {
    path: "/avis-etudiant/ajouter-avis-etudiant",
    component: <AjouterAvisEtudiant />,
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
  // { path: "/avis-enseignant/liste-avis-enseignant", component: <ListeAvisEnseignant /> },
  // { path: "/avis-enseignant/ajouter-avis-enseignant", component: <AjouterAvisEnseignant /> },
  // { path: "/avis-enseignant/single-avis-enseignant", component: <SingleAvisEnseignant /> },
  //! Avis Personnel
  // {
  //   path: "/avis-personnel/liste-avis-personnel",
  //   component: <ListeAvisPersonnel />,
  // },
  // {
  //   path: "/avis-personnel/ajouter-avis-personnel",
  //   component: <AjouterAvisPersonnel />,
  // },
  // {
  //   path: "/avis-personnel/single-avis-personnel",
  //   component: <SingleAvisPersonnel />,
  // },

  //! Actualite
  { path: "/actualite/liste-actualite", component: <ListeActualite /> },
  { path: "/actualite/ajouter-actualite", component: <AjouterActualite /> },
  { path: "/actualite/details-actualite", component: <SingleActualite /> },
  { path: "/actualite/edit-actualite", component: <EditActualite /> },

  //! Gestion Etudiant
  { path: "/gestion-etudiant/compte-etudiant", component: <MyAccount /> },
  { path: "/gestion-etudiant/liste-etudiants", component: <ListEtudiants /> },
  {
    path: "/gestion-etudiant/ajouter-etudiant",
    component: <AjouterEtudiant />,
  },
  {
    path: "/gestion-etudiant/edit-compte-etudiant",
    component: <EditProfilEtudiant />,
  },
  //! Gestion Enseignant
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

  //! Dossier Administratif Enseignant
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

  //! Gestion Personnel
  {
    path: "/gestion-personnel/ajouter-personnel",
    component: <AjouterPersonnels />,
  },
  {
    path: "/gestion-personnel/liste-personnels",
    component: <ListePersonnels />,
  },
  {
    path: "/gestion-personnel/compte-personnel",
    component: <AccountPersonnel />,
  },

  //! Dossier Administratif Personnel
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

  //! Demande Etudiant
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

  //! Demande Enseignant
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

  //! Demande Personnel
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

  //! Reclamation Etudiant
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
  //! Reclamation Enseignant
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
  //! Reclamation Personnel
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

  //! Parametre Compte  Etudiants (etat et inscription)
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

  //! Parametre Compte Enseignant
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

  //! Parametre Compte Personnel
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

  //! Gestion des matieres
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

  //! Gestion des salles
  {
    path: "/departement/gestion-salles/liste-salles",
    component: <ListSalles />,
  },
  {
    path: "/departement/gestion-salles/ajouter-salle",
    component: <AddSalle />,
  },
  { path: "/departement/gestion-salles/edit-salle", component: <EditSalle /> },

  //! Gestion des classes
  {
    path: "/departement/gestion-classes/liste-classes",
    component: <ListClasses />,
  },
  {
    path: "/departement/gestion-classes/ajouter-classe",
    component: <AddClasse />,
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

  //! Gestion Type seance

  {
    path: "/departement/gestion-types-seances/liste-types-seances",
    component: <ListTypeSeances />,
  },
  { path: "/parametre/add-type-seance", component: <AddTypeSeance /> },

  //! Gestion des departements
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

  // //liste lien utils
  // { path: "/liens-utils", component: <ListLienUtilst /> },

  // // Liste espaces de telechargements
  // { path: "/espace-telechargement", component: <ListEspaceTelechargement /> },

  // //Permission

  // { path: "/permissions", component: <Permissions /> },
  // { path: "/admin/liste-admins", component: <ListeAdmin /> },
  // { path: "/admin/single-admin", component: <SingleAdmin /> },
  // { path: "/admin/edit-admin", component: <EditAdmin /> },
  // { path: "/admin/history-admin", component: <HistoryAdmin /> },
  // { path: "/admin/ajouter-admin", component: <CreateAdmin /> },

  // //template Body
  // { path: "/template/liste-template-body", component: <TemplateBody /> },
  // { path: "/template/ajouter-template-body", component: <NewTemplateBody /> },
  // { path: "/template/single-template-body", component: <TemplateBodyDetail /> },
  // //short code
  // { path: "/shortCode/liste-short-code", component: <ShortCode /> },
  // { path: "/shortCode/ajouter-short-code", component: <NewShortCode /> },
  // // variable globale
  // { path: "/variable/ajouter-variables-globales", component: <AjouterVariablesGlobales /> },

  // // Papier administratif
  // { path: "/papier-administratif/ajouter-papier", component: <AddPapierAdministratif />, },
  // { path: "/papier-administratif/lister-papier", component: <ListePapierAdministratifs />,},

  // // gestion des Types de congés
  // { path: "/type-conge/Liste-type-conge", component: <ListeLeaveType />,},
  // { path: "/type-conge/ajouter-type-conge", component: <AjouterLeaveType />,},
  // { path: "/type-conge/edit-annuel-type-conge", component: <EditAnnuelLeaveType />,},
  // // gestion des demandes congés
  // { path: "/demande-conge/ajouter-demande-conge", component: <AjouterDemandeConge />,},
  // { path: "/demande-conge/liste-demande-conge", component: <ListeDemandeConge />,},
  // { path: "/demande-conge/single-demande-conge", component: <DemandeCongeDetails />,},
  // { path: "/demande-conge/edit-demande-conge", component:<EditDemandeConge/>},

  // // gestion des soldes congés
  // { path: "/solde-conge/Ajouter-solde-conge", component: <AjouterSoldeConge />,},
  // { path: "/solde-conge/liste-solde-conge", component: <ListeSoldeConge />,},

  //! Gestion  Des fiches des voeux
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

  //   // liste des rattrapages
  //   { path: "/ajouter-rattrapage",component: <AjouterRattrapage />,},

  //   //gestion emploi classes periods
  //   { path: "/gestion-emplois/emploi-classe/liste-emplois",component: <ListeEmploisClasse />, }, // liste classe
  //   { path: "/gestion-emplois/emploi-classe/single-emplois", component: <SingleEmploiClasse />, }, //view
  //   { path: "/gestion-emplois/emploi-classe/liste-seance", component: <GestionSeances /> }, //view tableau des seance
  //   { path: "/gestion-emplois/emploi-classe/periodes-classes", component: <ListClassPeriods /> },// creeer periode d emploi

  //   //gestion emploi enseignant
  //  { path: "/gestion-emplois/emlpoi-enseignant/single-emplois", component: <SingleEmploiEnseignant /> },
  //  {path: "/gestion-emplois/emlpoi-enseignant/liste-emplois",component: <ListeEmploiEnseignants />,},
  //  {path: "/gestion-emplois/emlpoi-enseignant/tableau-charges-horaires",component: <TableauChargesHoraires />,},

  //  //liset rattrapages

  //  { path: "/liste-rattrapages", component: <ListeRattrapages /> },

  //Product
  { path: "/products-list", component: <ListView /> },
  { path: "/products-grid", component: <GridView /> },
  { path: "/product-overview", component: <Overview /> },
  { path: "/product-create", component: <CreateProduct /> },
  { path: "/categories", component: <Categories /> },
  { path: "/sub-categories", component: <SubCategories /> },

  // Orders
  { path: "/orders-list-view", component: <OrdersListView /> },
  { path: "/orders-overview", component: <OrdersOverview /> },

  // Sellers
  { path: "/sellers-list-view", component: <SellersListView /> },
  { path: "/seller-grid-view", component: <SellersGridView /> },
  { path: "/seller-overview", component: <SellersOverview /> },

  // Invoice
  { path: "/invoices-list", component: <InvoiceList /> },
  { path: "/invoices-details", component: <InvoiceDetails /> },
  { path: "/invoices-create", component: <CreateInvoice /> },

  // User List
  { path: "/users-list", component: <UsersList /> },

  // Shipping
  { path: "/shipping-list", component: <ShippingList /> },
  { path: "/shipments", component: <Shipments /> },

  // Coupons
  { path: "/coupons", component: <Coupons /> },

  { path: "/calendar", component: <Calendar /> },

  //Review & Rating
  { path: "/reviews-ratings", component: <ReviewRating /> },

  //Review & Rating
  { path: "/brands", component: <Brands /> },

  //statistics
  { path: "/statistics", component: <Statistics /> },

  // Localization
  { path: "/transactions", component: <Transactions /> },
  { path: "/currency-rates", component: <CurrencyRates /> },

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
