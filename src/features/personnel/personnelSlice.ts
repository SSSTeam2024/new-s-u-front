import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DossierAdministratif } from "features/dossierAdministratif/dossierAdministratif";

export interface HistoriquePosition {
  poste?: string;
  grade?: string;
  categorie?: string;
  date_affectation?: string;
  date_titularisation?: string;
  date_depart?: string;
  fichier_affectation?: string;
  fichier_titularisation?: string;
  fichier_depart?: string;
  fichier_affectationBase64?: string;
  fichier_affectationExtension?: string;
  fichier_titularisationBase64?: string;
  fichier_titularisationExtension?: string;
  fichier_departBase64?: string;
  fichier_departExtension?: string;

}
export interface HistoriqueService {
  service?: string;
  date_affectation?: string;
  fichier_affectation?: string;
  fichier_affectationBase64?: string;
  fichier_affectationExtension?: string;

  date_depart?: string;
  fichier_depart?: string;
  fichier_departBase64?: string;
  fichier_departExtension?: string;
}

export interface Personnel {
  dossier?: DossierAdministratif;
  _id: string;
  nom_fr: string;
  nom_ar?: string;
  mat_cnrps: string;
  matricule: string;
  prenom_fr: string;
  prenom_ar?: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  date_naissance: string;
  date_designation: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  etat_compte?: {
    _id: string;
    value: string;
    etat_fr: string;
    etat_ar: string;
  };
  poste?: {
    _id: string;
    value: string;
    poste_fr: string;
    poste_ar: string;
  };
  grade?: {
    _id: string;
    value_grade_personnel: string;
    grade_fr: string;
    grade_ar: string;
  };
  categorie?: {
    _id: string;
    value: string;
    categorie_fr: string;
    categorie_ar: string;
  };
  service?: {
    _id: string;
    value: string;
    service_fr: string;
    service_ar: string;
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
  photo_profil?: string;
  PhotoProfilFileExtension?: string;
  PhotoProfilFileBase64String?: string;
  papers?: string[];
  historique_positions?: HistoriquePosition[];
  historique_services?: HistoriqueService[];

}

export interface PersonnelEXCEL {
  dossier?: DossierAdministratif;
  _id?: string;
  nom_fr: string;
  nom_ar?: string;
  mat_cnrps: string;
  matricule: string;
  prenom_fr: string;
  prenom_ar?: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar?: string;
  date_naissance: string;
  date_designation: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  etat_compte?: string;
  poste?: string;
  grade?: string;
  categorie?: string;
  service?: string;

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
  photo_profil?: string;
  PhotoProfilFileExtension?: string;
  PhotoProfilFileBase64String?: string;
  papers?: string[];
  historique_positions?: HistoriquePosition[];
  historique_services?: HistoriqueService[];

}
export const personnelSlice = createApi({
  reducerPath: "Personnel",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/personnel/`,
  }),
  tagTypes: ["Personnel"],
  endpoints(builder) {
    return {
      fetchPersonnels: builder.query<Personnel[], number | void>({
        query() {
          return `get-all-personnel`;
        },
        providesTags: ["Personnel"],
      }),

      addPersonnel: builder.mutation<void, PersonnelEXCEL>({
        query(payload) {
          return {
            url: "/create-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Personnel"],
      }),
      updatePersonnel: builder.mutation<void, Personnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-personnel`, // Remove the _id from the URL
          method: "PUT",
          body: { _id, ...rest }, // Include _id in the body
        }),
        invalidatesTags: ["Personnel"],
      }),

      deletePersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Personnel"],
      }),
      getPersonnelById: builder.query<Personnel, { _id: string }>({
        query: ({ _id }) => ({
          url: `get-personnel`,
          method: "POST",
          body: { _id }, // Adjust this to match your backend requirement
        }),
        providesTags: ["Personnel"],
      }),
    };
  },
});

export const {
  useAddPersonnelMutation,
  useFetchPersonnelsQuery,
  useDeletePersonnelMutation,
  useUpdatePersonnelMutation,
  useGetPersonnelByIdQuery,
} = personnelSlice;
