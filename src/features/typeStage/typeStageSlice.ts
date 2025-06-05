import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TypeStageModel {
  _id?: string;
  nom_fr: string;
  nom_ar: string;
  choix: string;
  niveau: string;
  max_etudiant: string;
  duree_min: string;
  date_debut: string;
  date_fin: string;
  avec_encadrement: string;
  avec_soutenance: string;
  avec_commission: string;
  avec_validation_soutenance: string;
  localite: string;
  classes: string[];
  encadrement: string[];
  soutenance: string[];
  files: {
    nomFr: string;
    nomAr: string;
    type: string;
  }[];
}

export const typeStageSlice = createApi({
  reducerPath: "typestage",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/type-stage/`,
  }),
  tagTypes: ["TypeStage"],
  endpoints(builder) {
    return {
      fetchAllTypeStage: builder.query<TypeStageModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["TypeStage"],
      }),
      addTypeStage: builder.mutation<void, TypeStageModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TypeStage"],
      }),
      getTypeStageById: builder.mutation<TypeStageModel, { typeId: string }>({
        query({ typeId }) {
          return {
            url: "/get-by-id",
            method: "POST",
            body: { typeId },
          };
        },
        invalidatesTags: ["TypeStage"],
      }),
      updateTypeStage: builder.mutation<void, TypeStageModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["TypeStage"],
      }),
      deleteTypeStage: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TypeStage"],
      }),
    };
  },
});

export const {
  useAddTypeStageMutation,
  useDeleteTypeStageMutation,
  useFetchAllTypeStageQuery,
  useUpdateTypeStageMutation,
  useGetTypeStageByIdMutation,
} = typeStageSlice;
