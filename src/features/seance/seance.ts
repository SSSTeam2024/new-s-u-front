import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Seance {
  _id: string;
  matiere: string;
  enseignant: any;
  classe: any;
  salle: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  type_seance: string;
  semestre: string;
  emploiPeriodique_id: any;
}

export interface teacherSessionsPayload {
  teacher_id: any;
  jour: string;
  emplois_periodiques_ids: string[];
}

export const seanceSlice = createApi({
  reducerPath: "Seance",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/seance/`,
  }),
  tagTypes: ["Seance"],
  endpoints(builder) {
    return {
      fetchSeances: builder.query<Seance[], number | void>({
        query() {
          return `get-all-seance`;
        },
        providesTags: ["Seance"],
      }),
      fetchAllSeancesByTimeTableId: builder.query<Seance[], string | void>({
        query: (_id) => ({
          url: `/get-all-seance/${_id}`,
          method: "GET",
        }),
        providesTags: ["Seance"],
      }),

      fetchAllSessionsByRoomId: builder.mutation<Seance[], string | void>({
        query: (_id) => ({
          url: `/get-sessions-by-room/${_id}`,
          method: "GET",
        }),
        invalidatesTags: ["Seance"],
      }),

      addSeance: builder.mutation<void, Seance>({
        query(payload) {
          return {
            url: "/create-seance",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Seance"],
      }),

      getAllSessionsByScheduleId: builder.mutation<Seance[], any>({
        query: ({ _id, ...rest }) => ({
          url: `/get-all-seance/${_id}`,
          method: "GET",
        }),
        invalidatesTags: ["Seance"],
      }),

      getSeancesByTeacher: builder.mutation<Seance[][], teacherSessionsPayload>(
        {
          query(payload) {
            return {
              url: "/get-seances-by-teacher",
              method: "POST",
              body: payload,
            };
          },
          invalidatesTags: ["Seance"],
        }
      ),

      getPeriodicSessionsByTeacher: builder.query<any, any>({
        query: (payload) => ({
          url: `/get-periodic-sessions-by-teacher`,
          body: payload,
          method: "POST",
        }),
        providesTags: ["Seance"],
      }),

      updateSeance: builder.mutation<void, Seance>({
        query: ({ _id, ...rest }) => ({
          url: `/update-seance/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Seance"],
      }),
      deleteSeance: builder.mutation<void, any>({
        query: (payload) => ({
          url: `delete-seance`,
          method: "DELETE",
          body: payload,
        }),
        invalidatesTags: ["Seance"],
      }),

      getSeancesByIdTeacherAndSemestre: builder.query<
        Seance[],
        { enseignantId: string; semestre: string }
      >({
        query: ({ enseignantId, semestre }) => ({
          url: `/seances/${enseignantId}/${semestre}`,
          method: "GET",
        }),
        providesTags: ["Seance"],
      }),
    };
  },
});

export const {
  useAddSeanceMutation,
  useDeleteSeanceMutation,
  useFetchSeancesQuery,
  useUpdateSeanceMutation,
  useFetchAllSeancesByTimeTableIdQuery,
  useFetchAllSessionsByRoomIdMutation,
  useGetSeancesByTeacherMutation,
  useGetAllSessionsByScheduleIdMutation,
  useGetSeancesByIdTeacherAndSemestreQuery,
  useGetPeriodicSessionsByTeacherQuery,
} = seanceSlice;