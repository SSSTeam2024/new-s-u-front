import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DossierAdministratif } from "features/dossierAdministratif/dossierAdministratif";

export interface Education {
  institution: string;
  degree: string;
  graduationYear: string;
}
export interface HistoriquePosition {
  poste?: string;
  grade?: string;
  date_affectation?: string;       
  date_titularisation?: string;    
  date_depart?: string;            
}

export interface Enseignant {
  dossier?: DossierAdministratif;
  _id: string;
  nom_fr: string;
  nom_ar?: string;
  matricule: string;
  mat_cnrps: string;
  prenom_fr: string;
  prenom_ar?: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  date_naissance: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  etat_compte?: {
    _id: string;
    value_etat_enseignant: string;
    etat_ar: string;
    etat_fr: string;
  };
  poste?: {
    _id: string;
    value_poste_enseignant: string;
    poste_ar: string;
    poste_fr: string;
  };
  grade?: {
    _id: string;
    value_grade_enseignant: string;
    grade_ar: string;
    grade_fr: string;
    charge_horaire?: {
      annualMinHE: string;
      annualMaxHE: string;

      s1MinHE: string;
      s1MaxHE: string;

      s2MinHE: string;
      s2MaxHE: string;

      annualMinHS: string;
      annualMaxHS: string;

      s1MinHS: string;
      s1MaxHS: string;

      s2MinHS: string;
      s2MaxHS: string;

      annualMinHX: string;
      annualMaxHX: string;

      s1MinHX: string;
      s1MaxHX: string;

      s2MinHX: string;
      s2MaxHX: string;

      totalAnnualMin: string;
      totalAnnualMax: string;

      totalS1Min: string;
      totalS1Max: string;

      totalS2Min: string;
      totalS2Max: string;
    };
  };
  specilaite?: {
    _id: string;
    value_specialite_enseignant: string;
    specialite_ar: string;
    specialite_fr: string;
  };
  departements?: {
    _id: string;
    description: string;
    volume_horaire: string;
    nom_chef_dep: string;
    name_ar: string;
    name_fr: string;
    SignatureFileExtension: string;
    SignatureFileBase64String: string;
    signature: string;
  };
  date_affectation: string;
  compte_courant: string;
  identifinat_unique: string;
  num_cin: string;
  date_delivrance: string;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar?: string;
  adress_fr: string;
  email: string;
  num_phone1: string;
  num_phone2: string;
  nom_conjoint: string;
  job_conjoint: string;
  nombre_fils: string;
  entreprise1: string;
  annee_certif1: string;
  certif1: string;

  entreprise2: string;
  annee_certif2: string;
  certif2: string;

  entreprise3: string;
  annee_certif3: string;
  certif3: string;
  photo_profil?: string;
  PhotoProfilFileExtension?: string;
  PhotoProfilFileBase64String?: string;
  papers?: string[];
  situation_fr?: string;
  situation_ar?: string;
  educations?: Education[];
  historique_positions?: HistoriquePosition[]; 
}

export interface EnseignantGroupedByGrade {
  _id: string;
  gradeLabel: string;
  teachers: {
    id: string;
    fullName: string;
  }[];
}

export interface EnseignantExcel {
  nom_fr: string;
  nom_ar: string;
  matricule: string;
  mat_cnrps: string;
  prenom_fr: string;
  prenom_ar: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  date_naissance: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  etat_compte?: string;
  poste?: string;

  grade?: string;
  specilaite?: string;
  departements?: {
    _id: string;
    description: string;
    volume_horaire: string;
    nom_chef_dep: string;
    name_ar: string;
    name_fr: string;
    SignatureFileExtension: string;
    SignatureFileBase64String: string;
    signature: string;
  };
  date_affectation: string;
  compte_courant: string;
  identifinat_unique: string;
  num_cin: string;
  date_delivrance: string;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar?: string;
  adress_fr: string;
  email: string;
  num_phone1: string;
  num_phone2: string;
  nom_conjoint: string;
  job_conjoint: string;
  nombre_fils: string;
  entreprise1: string;
  annee_certif1: string;
  certif1: string;

  entreprise2: string;
  annee_certif2: string;
  certif2: string;

  entreprise3: string;
  annee_certif3: string;
  certif3: string;
  photo_profil?: string;
  PhotoProfilFileExtension?: string;
  PhotoProfilFileBase64String?: string;
  papers?: string[];
  situation_fr?: string;
  educations?: Education[];
  historique_positions?: HistoriquePosition[]; 
  situation_ar?: string;}

export const enseignantSlice = createApi({
  reducerPath: "Enseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/enseignant/`,
  }),
  tagTypes: ["Enseignant", "TeacherPeriod", "EnseignantGroupedByGrade"],
  endpoints(builder) {
    return {
      fetchEnseignants: builder.query<
        Enseignant[],
        { useNewDb?: string } | void
      >({
        query: (useNewDb) => {
          return {
            url: `/get-all-enseignant`,
            method: "GET",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Enseignant"],
      }),
      fetchTeachersPeriods: builder.query<any, void>({
        query: () => ({
          url: `charges-periodic`,
          method: "GET",
        }),
        providesTags: ["TeacherPeriod"],
      }),
      fetchEnseignantsGroupedByGrade: builder.query<
        EnseignantGroupedByGrade[],
        number | void
      >({
        query: () => ({
          url: `/get-enseignants-grouped-by-grade`,
          method: "GET",
        }),
        providesTags: ["EnseignantGroupedByGrade"],
      }),

      addEnseignant: builder.mutation<void, EnseignantExcel>({
        query(payload) {
          return {
            url: "/create-enseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Enseignant"],
      }),
      updateEnseignant: builder.mutation<void, Enseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-enseignant`,
          method: "PUT",
          body: { _id, ...rest },
        }),
        invalidatesTags: ["Enseignant"],
      }),
      fetchEnseignantById: builder.query<Enseignant, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-enseignant",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Enseignant"],
      }),
      deleteEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-enseignant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Enseignant"],
      }),
    };
  },
});

export const {
  useAddEnseignantMutation,
  useFetchEnseignantsQuery,
  useFetchEnseignantByIdQuery,
  useDeleteEnseignantMutation,
  useUpdateEnseignantMutation,
  useFetchTeachersPeriodsQuery,
  useFetchEnseignantsGroupedByGradeQuery,
} = enseignantSlice;
