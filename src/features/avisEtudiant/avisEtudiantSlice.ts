import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Avis {
  _id?: string;
  title: string;
  auteurId: string;
  description: string;
  groupe_classe: string[];
  date_avis: string;
  lien: string;
  pdf: string;
  pdfBase64String: string;
  pdfExtension: string;
  gallery: string[];
  galleryBase64Strings: string[];
  galleryExtensions: string[];
  createdAt: string;
}
export const avisEtudiantSlice = createApi({
  reducerPath: "avisEtudiantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/avis-etudiant/`,
  }),
  tagTypes: ["Avis"],
  endpoints(builder) {
    return {
      fetchAvisEtudiant: builder.query<Avis[], { useNewDb?: string } | void>({
        query(useNewDb) {
          return {
            url: "get-all-avis-etudiants",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Avis"],
      }),
      fetchAvisEtudiantById: builder.query<Avis, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-avis-etudiant",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Avis"],
      }),
      addAvisEtudiant: builder.mutation<void, Partial<Avis>>({
        query(avisEtudiant) {
          return {
            url: "add-avis-etudiant",
            method: "POST",
            body: avisEtudiant,
          };
        },
        invalidatesTags: ["Avis"],
      }),
      updateAvisEtudiant: builder.mutation<void, Avis>({
        query(avisEtudiant) {
          return {
            url: `edit-avis-etudiant`,
            method: "PUT",
            body: avisEtudiant,
          };
        },
        invalidatesTags: ["Avis"],
      }),
      deleteAvisEtudiant: builder.mutation<Avis, { _id: string }>({
        query(_id) {
          return {
            url: `delete-avis-etudiant`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["Avis"],
      }),
      deleteManyAvisEtudiant: builder.mutation<
        Avis,
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
        invalidatesTags: ["Avis"],
      }),
    };
  },
});

export const {
  useFetchAvisEtudiantQuery,
  useFetchAvisEtudiantByIdQuery,
  useAddAvisEtudiantMutation,
  useUpdateAvisEtudiantMutation,
  useDeleteAvisEtudiantMutation,
  useDeleteManyAvisEtudiantMutation,
} = avisEtudiantSlice;
