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
}

export const rattrapageSlice = createApi({
  reducerPath: "Rattrapage",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/rattrapage/",
  }),
  tagTypes: ["Rattrapage"],
  endpoints(builder) {
    return {
      fetchRattrapages: builder.query<Rattrapage[], number | void>({
        query() {
          return `get-all-rattrapage`;
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
          // Log the values before sending the request
          console.log("Updating Rattrapage with ID:", _id);
          console.log("Etat:", etat);
          console.log("Status:", status);

          return {
            url: `/updateRattrapage/${_id}`,
            method: "PUT",
            body: { etat, status },
          };
        },
        invalidatesTags: ["Rattrapage"],
      }),

      //   updateSeance: builder.mutation<void, Seance>({
      //     query: ({ _id, ...rest }) => ({
      //       url: `/update-seance/${_id}`,
      //       method: "PUT",
      //       body: rest,
      //     }),
      //     invalidatesTags: ["Seance"],
      //   }),
      //   deleteSeance: builder.mutation<void, any>({
      //     query: (payload) => ({
      //       url: `delete-seance`,
      //       method: "DELETE",
      //       body: payload,
      //     }),
      //     invalidatesTags: ["Seance"],
      //   }),
    };
  },
});

export const {
  useAddRattrapageMutation,
  useFetchRattrapagesQuery,
  useUpdateRattrapageEtatStatusMutation,
} = rattrapageSlice;