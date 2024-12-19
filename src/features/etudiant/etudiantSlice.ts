import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface FileDetail {
  name_ar: string;
  name_fr: string;
  file?: string;
  base64String?: string;
  extension?: string;
}
interface Section {
  _id: string;
  name_section_fr: string;
  name_section_ar: string;
  abreviation: string;
  departements: string[];
}

interface NiveauClasse {
  _id: string;
  name_niveau_ar: string;
  name_niveau_fr: string;
  abreviation: string;
  sections: Section[]; // Ensure this is defined as an array
}

interface GroupeClasse {
  _id: string;
  nom_classe_fr: string;
  nom_classe_ar: string;
  departement: string;
  niveau_classe: NiveauClasse;
  matieres: string[];
}

export interface Etudiant {
  _id?: string;
  nom_fr: string;
  nom_ar: string;
  prenom_fr: string;
  prenom_ar: string;
  lieu_naissance_fr: string;
  lieu_naissance_ar: string;
  date_naissance: string;
  nationalite: string;
  etat_civil: string;
  sexe: string;
  num_CIN: string;
  face_1_CIN: string;
  face_2_CIN: string;
  fiche_paiement: string;
  etat_compte: {
    _id: string;
    value_etat_etudiant: string;
    etat_ar: string;
    etat_fr: string;
  };
  groupe_classe: GroupeClasse;
  state: string;
  dependence: string;
  code_postale: string;
  adress_ar: string;
  adress_fr: string;
  num_phone: string;
  email: string;
  nom_pere: string;
  job_pere: string;
  nom_mere: string;
  num_phone_tuteur: string;
  moyen: string;
  session: string;
  filiere: string;
  niveau_scolaire: string;
  annee_scolaire: string;
  type_inscription: {
    _id: string;
    value_type_inscription: string;
    type_ar: string;
    type_fr: string;
    files_type_inscription: {
      name_ar: string;
      name_fr: string;
    }[];
  };
  Face1CINFileBase64String: string;
  Face1CINFileExtension: string;
  Face2CINFileBase64String: string;
  Face2CINFileExtension: string;
  FichePaiementFileBase64String: string;
  FichePaiementFileExtension: string;
  files: FileDetail[];
  photo_profil: string;
  PhotoProfilFileExtension: string;
  PhotoProfilFileBase64String: string;
}

export const etudiantSlice = createApi({
  reducerPath: "Etudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/etudiant/`,
  }),
  tagTypes: ["Etudiant"],
  endpoints(builder) {
    return {
      fetchEtudiants: builder.query<Etudiant[], number | void>({
        query() {
          return `get-all-etudiant`;
        },
        providesTags: ["Etudiant"],
      }),
      fetchEtudiantById: builder.query<Etudiant, { _id: string }>({
        query({ _id }) {
          return {
            url: 'get-etudiant',
            method: 'POST',
            body: { _id },
          };
        },
        providesTags: ['Etudiant'],
      }),

      addEtudiant: builder.mutation<void, Etudiant>({
        query(payload) {
          return {
            url: "/create-etudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Etudiant"],
      }),
      updateEtudiant: builder.mutation<void, Etudiant>({
        query: ({ _id, ...rest }) => {
          console.log("Payload being sent to the backend:", { id: _id, ...rest });
      
          if (!_id) {
            throw new Error("No student ID provided");
          }
      
          return {
            url: `/update-etudiant`,
            method: "PUT",
            body: { id: _id, ...rest },
          };
        },
        invalidatesTags: ["Etudiant"],
      }),
        deleteEtudiant: builder.mutation<Etudiant, {_id: string}>({
          query: (_id) => ({
            url: `/delete-etudiant`,
            method: "DELETE",
            body:{ _id }
          }),
          invalidatesTags: ["Etudiant"],
        }),
        getTypeInscriptionByIdStudent: builder.mutation<any, { studentId: string }>({
          query: ({ studentId }) => ({
            url: `/type-inscription`,
            method: "POST",
            body: { studentId },
          }),
          invalidatesTags: ["Etudiant"],
        }),
    };
  },
});

export const { useAddEtudiantMutation, useFetchEtudiantsQuery, useFetchEtudiantByIdQuery, useDeleteEtudiantMutation, useUpdateEtudiantMutation, useGetTypeInscriptionByIdStudentMutation } = etudiantSlice;