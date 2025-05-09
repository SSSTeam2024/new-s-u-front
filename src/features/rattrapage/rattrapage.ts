import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Rattrapage {
  _id: string;
  matiere: string;
  enseignant: any;
  classe: any;
  salle: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  semestre: string;
  etat?: string;
  status?: string;
  date: string;
}

export const rattrapageSlice = createApi({
  reducerPath: "Rattrapage",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/rattrapage/`,
  }),
  tagTypes: ["Rattrapage"],
  endpoints(builder) {
    return {
      fetchRattrapages: builder.query<
        Rattrapage[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-rattrapage`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Rattrapage"],
      }),
      addRattrapage: builder.mutation<void, Rattrapage>({
        query(payload) {
          return {
            url: "/create-rattrapage",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Rattrapage"],
      }),

      updateRattrapageEtatStatus: builder.mutation<
        Rattrapage,
        { _id: string; etat: string; status: string }
      >({
        query({ _id, etat, status }) {
          return {
            url: `/updateRattrapage/${_id}`,
            method: "PUT",
            body: { etat, status },
          };
        },
        invalidatesTags: ["Rattrapage"],
      }),
      deleteManyRattrapage: builder.mutation<
        Rattrapage,
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
        invalidatesTags: ["Rattrapage"],
      }),
    };
  },
});

export const {
  useAddRattrapageMutation,
  useFetchRattrapagesQuery,
  useUpdateRattrapageEtatStatusMutation,
  useDeleteManyRattrapageMutation,
} = rattrapageSlice;
