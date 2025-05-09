import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AvisEnseignant {
  _id: string;
  title: string;
  auteurId: string;
  description: string;
  departement: string[];
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
export const avisEnseignantSlice = createApi({
  reducerPath: "avisEnseignantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/avis-enseignant/`,
  }),
  tagTypes: ["AvisEnseignant"],
  endpoints(builder) {
    return {
      fetchAvisEnseignant: builder.query<
        AvisEnseignant[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: "get-all-avis-enseignants",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["AvisEnseignant"],
      }),
      fetchAvisEnseignantById: builder.query<AvisEnseignant, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-avis-enseignant",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["AvisEnseignant"],
      }),
      addAvisEnseignant: builder.mutation<void, Partial<AvisEnseignant>>({
        query(avisEnseignant) {
          return {
            url: "add-avis-enseignant",
            method: "POST",
            body: avisEnseignant,
          };
        },
        invalidatesTags: ["AvisEnseignant"],
      }),
      updateAvisEnseignant: builder.mutation<void, AvisEnseignant>({
        query(avisEnseignant) {
          return {
            url: `edit-demande-enseignant`,
            method: "PUT",
            body: avisEnseignant,
          };
        },
        invalidatesTags: ["AvisEnseignant"],
      }),
      deleteAvisEnseignant: builder.mutation<AvisEnseignant, { _id: string }>({
        query(_id) {
          return {
            url: `delete-demande-enseignant`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["AvisEnseignant"],
      }),
      deleteManyAvisEnseignants: builder.mutation<
        AvisEnseignant,
        { ids: string[]; useNewDb: boolean }
      >({
        query({ ids, useNewDb }) {
          return {
            url: "delete-many",
            method: "DELETE",
            body: { ids },
            headers:
            useNewDb !== undefined
              ? { "x-use-new-db": String(useNewDb) }
              : undefined,
          };
        },
        invalidatesTags: ["AvisEnseignant"],
      }),
    };
  },
});

export const {
  useFetchAvisEnseignantQuery,
  useFetchAvisEnseignantByIdQuery,
  useAddAvisEnseignantMutation,
  useUpdateAvisEnseignantMutation,
  useDeleteAvisEnseignantMutation,
  useDeleteManyAvisEnseignantsMutation,
} = avisEnseignantSlice;
