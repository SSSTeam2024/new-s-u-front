import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface StagePfeModel {
  _id?: string;
  etudiant: string;
  type_stage?: string | null;
  binome?: string | null;
  encadrant_univ1?: string | null;
  encadrant_univ2?: string | null;
  encadrant_societe1: string;
  encadrant_societe2: string;
  societe?: string | null;
  status_stage: string;
  date_debut: string; 
  date_fin: string;
  date_soutenance: string;
  sujet: string; 
  description: string; 
  avis: string;
  mention?: string;
  mot_cle?: string; 
  biblio?:string; 
  salle?: string; 
  remarque?: string; 
  note: string;
  rapporteur1?: string;
  rapporteur2?: string;
  examinateur1?: string;
  examinateur2?: string;
  invite1?: string;
  invite2?: string;
  chef_jury?: string;
  createdAt?: string;
  heure_debut?: string;
  heure_fin?:string;
  file_affectation_etudiant_base64?: string;
  file_affectation_etudiant_extension?: string;
  file_affectation_binome_base64?: string;
  file_affectation_binome_extension?: string;
  file_proposition_base64?: string;
  file_proposition_extension?: string;
  file_proposition_signe_base64?: string;
  file_proposition_signe_extension?: string;
  file_attestation_base64?: string;
  file_attestation_extension?: string;
  file_rapport_base64?: string;
  file_rapport_extension?: string;
  file_affectation_etudiant?: string;
  file_affectation_binome?: string;
  file_proposition?: string;
  file_proposition_signe?: string;
  file_attestation?: string;
  file_rapport?: string;
}
export const stagePfeSlice = createApi({
  reducerPath: "stagepfe",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/stage-pfe/`,
  }),
  tagTypes: ["StagePfe"],
  endpoints(builder) {
    return {
      fetchAllStagePfe: builder.query<StagePfeModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["StagePfe"],
      }),
      addNewPfe: builder.mutation<void, StagePfeModel>({
              query(payload) {
                return {
                  url: "/create-new",
                  method: "POST",
                  body: payload,
                };
              },
              invalidatesTags: ["StagePfe"],
            }),
      updateStagePfe: builder.mutation<void, Partial<StagePfeModel>>({
        query: ({ _id, ...rest }) => ({
          url: `/update-one/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["StagePfe"],
      }),
      deleteStagePfe: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["StagePfe"],
      }),
    };
  },
});

export const {
  useDeleteStagePfeMutation,
  useAddNewPfeMutation,
  useFetchAllStagePfeQuery,
  useUpdateStagePfeMutation,
} = stagePfeSlice;
