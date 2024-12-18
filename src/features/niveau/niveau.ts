import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Section } from "features/section/section";

export interface Niveau {
  _id: string;
  name_niveau_ar: string,
  name_niveau_fr: string,
  abreviation: string,
  sections: Section[];
  
}
export const niveauSlice = createApi({
  reducerPath: "Niveau",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/niveau-classe/",
  }),
  tagTypes: ["Niveau"],
  endpoints(builder) {
    return {
      fetchNiveaux: builder.query<Niveau[], number | void>({
        query() {
          return `get-all-niveau-classe`;
        },
        providesTags: ["Niveau"],
      }),

      addNiveau: builder.mutation<void, Niveau>({
        query(payload) {
          return {
            url: "/create-niveau-classe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Niveau"],
      }),
      updateNiveau: builder.mutation<void, Niveau>({
        query: ({ _id, ...rest }) => ({
          url: `/update-niveau-classe/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Niveau"],
      }),
      deleteNiveau: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-niveau-classe/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Niveau"],
      }),
      fetchSectionsByNiveauId: builder.query<Niveau, string>({
        query: (niveauClasseId) => ({
          url: `${niveauClasseId}/sections`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Niveau", id }],
      }),
    };
  },
  
});

export const {
   useAddNiveauMutation,
   useDeleteNiveauMutation,
   useFetchNiveauxQuery,
   useUpdateNiveauMutation,
   useFetchSectionsByNiveauIdQuery
} = niveauSlice;