import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface StageProModel {
  _id?: string;
  etudiant: string;
  type_stage: string;
  binome: string;
  encadrant_univ: string;
  encadrant_societe: string;
  societe: string;
  status_stage: string;
  date_debut: string;
  date_fin: string;
  date_soutenance: string;
  sujet: string;
  description: string;
  avis: string;
  note: string;
  rapporteur: string;
  chef_jury: string;
  createdAt?: string;
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
export const stageProSlice = createApi({
  reducerPath: "stagepro",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/stage-pro/`,
  }),
  tagTypes: ["StagePro"],
  endpoints(builder) {
    return {
      fetchAllStagePro: builder.query<StageProModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["StagePro"],
      }),
      updateStagePro: builder.mutation<void, Partial<StageProModel>>({
        query: ({ _id, ...rest }) => ({
          url: `/update-one/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["StagePro"],
      }),
      deleteStagePro: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["StagePro"],
      }),
    };
  },
});

export const {
  useDeleteStageProMutation,
  useFetchAllStageProQuery,
  useUpdateStageProMutation,
} = stageProSlice;
