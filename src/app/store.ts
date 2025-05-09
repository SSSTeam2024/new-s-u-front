import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";

import LayoutReducer from "../slices/layouts/reducer";
// Authentication
// import ForgetPasswordReducer from "../slices/auth/forgetpwd/reducer";
import ProfileReducer from "../slices/auth/profile/reducer";
import DashboardReducer from "../slices/dashboard/reducer";
import authSlice from "features/account/authSlice";
import { accountSlice } from "features/account/accountSlice";
import { permissionSlice } from "features/userPermissions/userPermissionSlice";
import { etatPersonnelSlice } from "features/etatPersonnel/etatPersonnelSlice";
import { postePersonnelSlice } from "features/postePersonnel/postePersonnel";
import { categoriePersonnelSlice } from "features/categoriePersonnel/categoriePersonnel";
import { gradePersonnelSlice } from "features/gradePersonnel/gradePersonnel";
import { etatEnseignantSlice } from "features/etatEnseignant/etatEnseignant";
import { posteEnseignantSlice } from "features/posteEnseignant/posteEnseignant";
import { gradeEnseignantSlice } from "features/gradeEnseignant/gradeEnseignant";
import { specialiteEnseignantSlice } from "features/specialiteEnseignant/specialiteEnseignant";
import { servicePersonnelSlice } from "features/servicePersonnel/servicePersonnel";
import { etatEtudiantSlice } from "features/etatEtudiants/etatEtudiants";
import { typeInscriptionEtudiantSlice } from "features/typeInscriptionEtudiant/typeInscriptionEtudiant";
import { matiereSlice } from "features/matiere/matiere";
import { niveauSlice } from "features/niveau/niveau";
import { departementSlice } from "features/departement/departement";
import { salleSlice } from "features/salles/salles";
import { sectionSlice } from "features/section/section";
import { classeSlice } from "features/classe/classe";
import { reclamationsEtudiantSlice } from "features/reclamationEtudiant/recalamationEtudiantSlice";
import { etudiantSlice } from "features/etudiant/etudiantSlice";
import { enseignantSlice } from "features/enseignant/enseignantSlice";
import { personnelSlice } from "features/personnel/personnelSlice";
import { reclamationsEnseignantSlice } from "features/reclamationEnseignant/reclamationEnseignantSlice";
import { reclamationsPersonnelSlice } from "features/reclamationPersonnel/reclamationPersonnelSlice";
import { demandeEtudiantSlice } from "features/demandeEtudiant/demandeEtudiantSlice";
import { demandePersonnelSlice } from "features/demandePersonnel/demandePersonnelSlice";
import { demandeEnseignantSlice } from "features/demandeEnseignant/demandeEnseignantSlice";
import { avisEtudiantSlice } from "features/avisEtudiant/avisEtudiantSlice";
import { avisEnseignantSlice } from "features/avisEnseignant/avisEnseignantSlice";
import { avisPersonnelSlice } from "features/avisPersonnel/avisPersonnelSlice";
import { actualiteSlice } from "features/actualite/actualiteSlice";
import { templateBodySlice } from "features/templateBody/templateBodySlice";
import { shortCodeSlice } from "features/shortCode/shortCodeSlice";
import { varibaleGlobaleSlice } from "features/variableGlobale/variableGlobaleSlice";
import { papierAdministratifSlice } from "features/papierAdministratif/papierAdministratif";
import { dossierAdministratifSlice } from "features/dossierAdministratif/dossierAdministratif";
import { leaveBalanceSlice } from "features/congé/leaveBalanceSlice";
import { leaveTypeSlice } from "features/congé/leaveTypeSlice";
import { timeTableParamsSlice } from "features/timeTableParams/timeTableParams";
import { demandeCongeSlice } from "features/congé/demandeCongeSlice";
import { typeSeanceSlice } from "features/typeSeance/typeSeance";
import { classePeriodSlice } from "features/classPeriod/classPeriod";
import { teachersPeriodsSlice } from "features/teachersPeriods/teachersPeriods";
import { rattrapageSlice } from "features/rattrapage/rattrapage";
import { ficheVoeuxSlice } from "features/ficheVoeux/ficheVoeux";
import { seanceSlice } from "features/seance/seance";
import { examenSlice } from "features/examens/examenSlice";
import { domaineClasseSlice } from "features/domaineClasse/domaineClasse";
import { mentionClasseSlice } from "features/mentionClasse/mentionClasse";
import { deplacementSlice } from "features/deplacement/deplacementSlice";
import { missionSlice } from "features/mission/missionSlice";
import { notesProSlice } from "features/notesPro/notesProSlice";
import { virtualServiceSlice } from "features/virtualService/virtualServiceSlice";

//! Notes Examen
import { notesExamenSlice } from "features/notesExamen/notesExamenSlice";
import { typeParcoursSlice } from "features/TypeParcours/TypeParcours";
import { parcoursSlice } from "features/parcours/parcours";
import { moduleParcoursSlice } from "features/moduleParcours/moduleParcours";
import { absenceSlice } from "features/absenceEtudiant/absenceSlice";
import { courSlice } from "features/coursEnseignant/coursSlice";
import { generatedDocSlice } from "features/generatedDoc/generatedDocSlice";
import { cycleSlice } from "features/cycle/cycle";
import { messagesSlice } from "features/messagerie/messagerieSlice";
import { messageSlice } from "features/messages/messagesSlice";
import { demandeTirageSlice } from "features/demandeTirage/demandeTirageSlice";
import { absencePersonnelSlice } from "features/absencePersonnel/absencePersonnel";
import { personnelWorkingDaySlice } from "features/personnelWorkingDay/personnelWorkingDaySlice";
import { voieEnvoiSlice } from "features/voieEnvoi/voieEnvoiSlice";
import { courrierEntrantSlice } from "features/courrierEntrant/courrierEntrant";
import { courrierSortantSlice } from "features/courrierSortant/courrierSortantSlice";
import { intervenantsSlice } from "features/intervenants/intervenantsSlice";
import { pointageSlice } from "features/pointageEnseignant/pointageEnseignantSlice";
import { cloneSlice } from "features/cloneDb/cloneDb";
import { databaseSlice } from "features/databaseNames/databaseSlice";

export const store = configureStore({
  reducer: {
    [accountSlice.reducerPath]: accountSlice.reducer,
    [permissionSlice.reducerPath]: permissionSlice.reducer,
    [etatPersonnelSlice.reducerPath]: etatPersonnelSlice.reducer,
    [etatEtudiantSlice.reducerPath]: etatEtudiantSlice.reducer,
    [typeInscriptionEtudiantSlice.reducerPath]:
      typeInscriptionEtudiantSlice.reducer,
    [postePersonnelSlice.reducerPath]: postePersonnelSlice.reducer,
    [categoriePersonnelSlice.reducerPath]: categoriePersonnelSlice.reducer,
    [gradePersonnelSlice.reducerPath]: gradePersonnelSlice.reducer,
    [servicePersonnelSlice.reducerPath]: servicePersonnelSlice.reducer,
    [etatEnseignantSlice.reducerPath]: etatEnseignantSlice.reducer,
    [posteEnseignantSlice.reducerPath]: posteEnseignantSlice.reducer,
    [gradeEnseignantSlice.reducerPath]: gradeEnseignantSlice.reducer,
    [specialiteEnseignantSlice.reducerPath]: specialiteEnseignantSlice.reducer,
    [matiereSlice.reducerPath]: matiereSlice.reducer,
    [niveauSlice.reducerPath]: niveauSlice.reducer,
    [departementSlice.reducerPath]: departementSlice.reducer,
    [salleSlice.reducerPath]: salleSlice.reducer,
    [sectionSlice.reducerPath]: sectionSlice.reducer,
    [classeSlice.reducerPath]: classeSlice.reducer,
    [reclamationsEtudiantSlice.reducerPath]: reclamationsEtudiantSlice.reducer,
    [reclamationsEnseignantSlice.reducerPath]:
      reclamationsEnseignantSlice.reducer,
    [reclamationsPersonnelSlice.reducerPath]:
      reclamationsPersonnelSlice.reducer,
    [demandePersonnelSlice.reducerPath]: demandePersonnelSlice.reducer,
    [demandeEnseignantSlice.reducerPath]: demandeEnseignantSlice.reducer,
    [demandeEtudiantSlice.reducerPath]: demandeEtudiantSlice.reducer,
    [etudiantSlice.reducerPath]: etudiantSlice.reducer,
    [enseignantSlice.reducerPath]: enseignantSlice.reducer,
    [personnelSlice.reducerPath]: personnelSlice.reducer,
    [avisEtudiantSlice.reducerPath]: avisEtudiantSlice.reducer,
    [avisEnseignantSlice.reducerPath]: avisEnseignantSlice.reducer,
    [avisPersonnelSlice.reducerPath]: avisPersonnelSlice.reducer,
    [actualiteSlice.reducerPath]: actualiteSlice.reducer,
    [templateBodySlice.reducerPath]: templateBodySlice.reducer,
    [shortCodeSlice.reducerPath]: shortCodeSlice.reducer,
    [varibaleGlobaleSlice.reducerPath]: varibaleGlobaleSlice.reducer,
    [papierAdministratifSlice.reducerPath]: papierAdministratifSlice.reducer,
    [dossierAdministratifSlice.reducerPath]: dossierAdministratifSlice.reducer,
    [leaveBalanceSlice.reducerPath]: leaveBalanceSlice.reducer,
    [leaveTypeSlice.reducerPath]: leaveTypeSlice.reducer,
    [demandeCongeSlice.reducerPath]: demandeCongeSlice.reducer,
    [timeTableParamsSlice.reducerPath]: timeTableParamsSlice.reducer,
    [typeSeanceSlice.reducerPath]: typeSeanceSlice.reducer,
    [classePeriodSlice.reducerPath]: classePeriodSlice.reducer,
    [teachersPeriodsSlice.reducerPath]: teachersPeriodsSlice.reducer,
    [rattrapageSlice.reducerPath]: rattrapageSlice.reducer,
    [ficheVoeuxSlice.reducerPath]: ficheVoeuxSlice.reducer,
    [seanceSlice.reducerPath]: seanceSlice.reducer,
    [examenSlice.reducerPath]: examenSlice.reducer,
    [missionSlice.reducerPath]: missionSlice.reducer,
    [deplacementSlice.reducerPath]: deplacementSlice.reducer,
    [virtualServiceSlice.reducerPath]: virtualServiceSlice.reducer,
    [notesProSlice.reducerPath]: notesProSlice.reducer,
    [domaineClasseSlice.reducerPath]: domaineClasseSlice.reducer,
    [mentionClasseSlice.reducerPath]: mentionClasseSlice.reducer,
    [typeParcoursSlice.reducerPath]: typeParcoursSlice.reducer,
    [parcoursSlice.reducerPath]: parcoursSlice.reducer,
    [moduleParcoursSlice.reducerPath]: moduleParcoursSlice.reducer,
    [cycleSlice.reducerPath]: cycleSlice.reducer,
    //! Notes Examen
    [notesExamenSlice.reducerPath]: notesExamenSlice.reducer,
    //! Absence Etudiant
    [absenceSlice.reducerPath]: absenceSlice.reducer,
    //! Cour Enseignant
    [courSlice.reducerPath]: courSlice.reducer,
    [generatedDocSlice.reducerPath]: generatedDocSlice.reducer,
    [messagesSlice.reducerPath]: messagesSlice.reducer,
    [messageSlice.reducerPath]: messageSlice.reducer,
    [demandeTirageSlice.reducerPath]: demandeTirageSlice.reducer,
    [absencePersonnelSlice.reducerPath]: absencePersonnelSlice.reducer,
    [personnelWorkingDaySlice.reducerPath]: personnelWorkingDaySlice.reducer,
    [voieEnvoiSlice.reducerPath]: voieEnvoiSlice.reducer,
    [courrierEntrantSlice.reducerPath]: courrierEntrantSlice.reducer,
    [courrierSortantSlice.reducerPath]: courrierSortantSlice.reducer,
    //! Intervenants
    [intervenantsSlice.reducerPath]: intervenantsSlice.reducer,
     //! Pointage Enseignant
     [pointageSlice.reducerPath]: pointageSlice.reducer,
     //! Clone Database
     [cloneSlice.reducerPath]: cloneSlice.reducer,
     //! Create DatabaseName
     [databaseSlice.reducerPath]: databaseSlice.reducer,
    auth: authSlice,
    Layout: LayoutReducer,
    // ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Dashboard: DashboardReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      accountSlice.middleware,
      permissionSlice.middleware,
      etatPersonnelSlice.middleware,
      postePersonnelSlice.middleware,
      categoriePersonnelSlice.middleware,
      gradePersonnelSlice.middleware,
      etatEnseignantSlice.middleware,
      posteEnseignantSlice.middleware,
      gradeEnseignantSlice.middleware,
      specialiteEnseignantSlice.middleware,
      servicePersonnelSlice.middleware,
      etatEtudiantSlice.middleware,
      typeInscriptionEtudiantSlice.middleware,
      matiereSlice.middleware,
      niveauSlice.middleware,
      departementSlice.middleware,
      salleSlice.middleware,
      sectionSlice.middleware,
      classeSlice.middleware,
      etudiantSlice.middleware,
      enseignantSlice.middleware,
      personnelSlice.middleware,
      reclamationsEtudiantSlice.middleware,
      reclamationsEnseignantSlice.middleware,
      reclamationsPersonnelSlice.middleware,
      demandePersonnelSlice.middleware,
      demandeEtudiantSlice.middleware,
      demandeEnseignantSlice.middleware,
      avisEtudiantSlice.middleware,
      avisEnseignantSlice.middleware,
      avisPersonnelSlice.middleware,
      actualiteSlice.middleware,
      templateBodySlice.middleware,
      shortCodeSlice.middleware,
      varibaleGlobaleSlice.middleware,
      papierAdministratifSlice.middleware,
      dossierAdministratifSlice.middleware,
      leaveBalanceSlice.middleware,
      leaveTypeSlice.middleware,
      demandeCongeSlice.middleware,
      timeTableParamsSlice.middleware,
      typeSeanceSlice.middleware,
      classePeriodSlice.middleware,
      teachersPeriodsSlice.middleware,
      rattrapageSlice.middleware,
      ficheVoeuxSlice.middleware,
      seanceSlice.middleware,
      examenSlice.middleware,
      mentionClasseSlice.middleware,
      domaineClasseSlice.middleware,
      deplacementSlice.middleware,
      missionSlice.middleware,
      virtualServiceSlice.middleware,
      notesProSlice.middleware,
      notesExamenSlice.middleware,
      typeParcoursSlice.middleware,
      parcoursSlice.middleware,
      moduleParcoursSlice.middleware,
      absenceSlice.middleware,
      courSlice.middleware,
      generatedDocSlice.middleware,
      cycleSlice.middleware,
      messagesSlice.middleware,
      messageSlice.middleware,
      demandeTirageSlice.middleware,
      absencePersonnelSlice.middleware,
      personnelWorkingDaySlice.middleware,
      voieEnvoiSlice.middleware,
      courrierEntrantSlice.middleware,
      courrierSortantSlice.middleware,
      intervenantsSlice.middleware,
      pointageSlice.middleware,
      cloneSlice.middleware,
      databaseSlice.middleware,
    ]);
  },
});

setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
