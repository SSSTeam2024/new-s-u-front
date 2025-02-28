import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CoursEnseignant {
  _id?: string;
  classe: string[],
  enseignant: string,
  nom_cours: string,
  file_cours: string,
  pdfBase64String: string,
  pdfExtension: string,
  trimestre: string,
}

export const courSlice = createApi({
  reducerPath: "coursEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/cours-enseignant/`,
  }),
  tagTypes: ["CoursEnseignant"],
  endpoints(builder) {
    return {
      fetchCoursEnseignants: builder.query<CoursEnseignant[], number | void>({
        query() {
          return `get-all-cours`;
        },
        providesTags: ["CoursEnseignant"],
      }),
      addCoursEnseignant: builder.mutation<void, CoursEnseignant>({
        query(payload) {
          return {
            url: "/add-cour",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CoursEnseignant"],
      }),
    };
  },
  
});

export const {
   useAddCoursEnseignantMutation,
  useFetchCoursEnseignantsQuery
} = courSlice;