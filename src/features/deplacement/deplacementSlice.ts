import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Deplacement {
  _id: string;
  title: string;
  enseignant: string;
  personnel: string;
  date_depart: string;
  date_retour: string;
  lieu_depart: string;
  lieu_arrive: string;
  accompagnants: string;
  info_voiture: string;
  pdfBase64String: string;
  pdfExtension: string;
  etat: string;
  createdAt?: string;
}
export const deplacementSlice = createApi({
  reducerPath: "deplacementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/deplacement/`,
  }),
  tagTypes: ["Deplacement"],
  endpoints(builder) {
    return {
      fetchDeplacement: builder.query<
        Deplacement[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-deplacements`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Deplacement"],
      }),
      fetchDeplacementById: builder.query<Deplacement, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-deplacement",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Deplacement"],
      }),
      addDeplacement: builder.mutation<void, Partial<Deplacement>>({
        query(deplacement) {
          return {
            url: "add-deplacement",
            method: "POST",
            body: deplacement,
          };
        },
        invalidatesTags: ["Deplacement"],
      }),
      updateDeplacement: builder.mutation<void, Deplacement>({
        query(deplacement) {
          return {
            url: `edit-deplacement`,
            method: "PUT",
            body: deplacement,
          };
        },
        invalidatesTags: ["Deplacement"],
      }),
      deleteDeplacement: builder.mutation<Deplacement, { _id: string }>({
        query(_id) {
          return {
            url: `delete-deplacement`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["Deplacement"],
      }),
      deleteManyDeplacement: builder.mutation<
        Deplacement,
        { ids: string[]; useNewDb?: boolean }
      >({
        query({ ids, useNewDb }) {
          return {
            url: `delete-many`,
            method: "DELETE",
            body: { ids },
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": String(useNewDb) }
                : undefined,
          };
        },
        invalidatesTags: ["Deplacement"],
      }),
    };
  },
});

export const {
  useFetchDeplacementQuery,
  useFetchDeplacementByIdQuery,
  useAddDeplacementMutation,
  useUpdateDeplacementMutation,
  useDeleteDeplacementMutation,
  useDeleteManyDeplacementMutation,
} = deplacementSlice;
