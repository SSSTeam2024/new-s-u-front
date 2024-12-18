import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";

import LayoutReducer from "../slices/layouts/reducer";
// Authentication
import ForgetPasswordReducer from "../slices/auth/forgetpwd/reducer";
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
import {reclamationsEtudiantSlice} from "features/reclamationEtudiant/recalamationEtudiantSlice"
import { etudiantSlice } from "features/etudiant/etudiantSlice";
import { enseignantSlice } from "features/enseignant/enseignantSlice";
import { personnelSlice } from "features/personnel/personnelSlice";
import { reclamationsEnseignantSlice } from "features/reclamationEnseignant/reclamationEnseignantSlice";
import { reclamationsPersonnelSlice } from "features/reclamationPersonnel/reclamationPersonnelSlice"
import { demandeEtudiantSlice } from "features/demandeEtudiant/demandeEtudiantSlice";
import { demandePersonnelSlice } from "features/demandePersonnel/demandePersonnelSlice";
import { demandeEnseignantSlice } from "features/demandeEnseignant/demandeEnseignantSlice"
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
import {demandeCongeSlice} from "features/congé/demandeCongeSlice"
import { typeSeanceSlice } from "features/typeSeance/typeSeance";
import { classePeriodSlice } from "features/classPeriod/classPeriod";
import { teachersPeriodsSlice } from "features/teachersPeriods/teachersPeriods";
import { rattrapageSlice } from "features/rattrapage/rattrapage";
import { ficheVoeuxSlice } from "features/ficheVoeux/ficheVoeux";
import { seanceSlice } from "features/seance/seance";

export const store = configureStore({
    reducer: { 
    [accountSlice.reducerPath]: accountSlice.reducer,
    [permissionSlice.reducerPath]: permissionSlice.reducer,
    [etatPersonnelSlice.reducerPath]: etatPersonnelSlice.reducer,
    [etatEtudiantSlice.reducerPath]: etatEtudiantSlice.reducer,
    [typeInscriptionEtudiantSlice.reducerPath]: typeInscriptionEtudiantSlice.reducer,
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
    [reclamationsEnseignantSlice.reducerPath]: reclamationsEnseignantSlice.reducer,
    [reclamationsPersonnelSlice.reducerPath]: reclamationsPersonnelSlice.reducer,
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

      auth: authSlice,
      Layout: LayoutReducer,
      ForgetPassword: ForgetPasswordReducer,
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
      ]
        
      );
    },
  });
  
  setupListeners(store.dispatch);
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  