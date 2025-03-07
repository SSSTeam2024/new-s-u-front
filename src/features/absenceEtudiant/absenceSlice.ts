import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AbsenceEtudiant {
  _id?: string;
  classe: string;
  enseignant: string;
  seance: string;
  etudiants: {
    etudiant: string;
    typeAbsent: string;
  }[];
  date: string;
  trimestre: string;
  added_by?: string;
}

export const absenceSlice = createApi({
  reducerPath: "AbsenceEtudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/absence-etudiant/`,
  }),
  tagTypes: ["AbsenceEtudiant"],
  endpoints(builder) {
    return {
      fetchAbsenceEtudiants: builder.query<AbsenceEtudiant[], number | void>({
        query() {
          return `get-all-absence-etudiant`;
        },
        providesTags: ["AbsenceEtudiant"],
      }),
      //   fetchExamenById: builder.query<AbsenceEtudiant, number | void>({
      //     query: (_id) => ({
      //       url: `get-examen/${_id}`,
      //       method: "GET",
      //     }),
      //     providesTags: ["AbsenceEtudiant"],
      //   }),
      addAbsenceEtudiant: builder.mutation<void, AbsenceEtudiant>({
        query(payload) {
          return {
            url: "/create-absence-etudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["AbsenceEtudiant"],
      }),
      //   ModifierExamenEpreuve: builder.mutation<void, AbsenceEtudiant>({
      //     query(payload) {
      //       return {
      //         url: "/EpeditreuveData",
      //         method: "POST",
      //         body: payload,
      //       };
      //     },
      //     invalidatesTags: ["AbsenceEtudiant"],
      //   }),
      //   updateExamen: builder.mutation<void, AbsenceEtudiant>({
      //     query: ({ _id, ...rest }) => ({
      //       url: `/update-examen/${_id}`,
      //       method: "PUT",
      //       body: rest,
      //     }),
      //     invalidatesTags: ["AbsenceEtudiant"],
      //   }),
      //   deleteExamen: builder.mutation<void, string>({
      //     query: (_id) => ({
      //       url: `delete-examen/${_id}`,
      //       method: "DELETE",
      //     }),
      //     invalidatesTags: ["AbsenceEtudiant"],
      //   }),
      //   getExamenByRegime: builder.mutation<void, AbsenceEtudiant>({
      //     query(payload) {
      //         return{
      //             url: `get-examen-by-regime-semestre`,
      //             method: "POST",
      //             body: payload
      //         }
      //     },
      //     invalidatesTags: ["AbsenceEtudiant"],
      //   }),
    };
  },
});

export const { useAddAbsenceEtudiantMutation, useFetchAbsenceEtudiantsQuery } =
  absenceSlice;
