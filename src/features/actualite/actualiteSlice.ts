import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Actualite {
  _id?: string;
  title: string;
  auteurId: string;
  description: string;
  category: string;
  address: string;
  date_actualite: Date | null;
  lien: string;
  pdf: string;
  pdfBase64String: string;
  pdfExtension: string;
  gallery: string[];
  galleryBase64Strings: string[];
  galleryExtensions: string[];
  createdAt: string;
}
export const actualiteSlice = createApi({
  reducerPath: "actualiteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/actualite/`,
  }),
  tagTypes: ["Actualite"],
  endpoints(builder) {
    return {
      fetchActualite: builder.query<Actualite[], { useNewDb?: string } | void>({
        query(useNewDb) {
          return {
            url: "get-all-actualites",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Actualite"],
      }),
      fetchActualiteById: builder.query<Actualite, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-actualite",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Actualite"],
      }),
      addActualite: builder.mutation<void, Partial<Actualite>>({
        query(actualite) {
          return {
            url: "add-actualite",
            method: "POST",
            body: actualite,
          };
        },
        invalidatesTags: ["Actualite"],
      }),
      updateActualite: builder.mutation<void, Actualite>({
        query(actualite) {
          return {
            url: `edit-actualite`,
            method: "PUT",
            body: actualite,
          };
        },
        invalidatesTags: ["Actualite"],
      }),
      deleteActualite: builder.mutation<Actualite, { _id: string }>({
        query(_id) {
          return {
            url: `delete-actualite`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["Actualite"],
      }),
      deleteManyActualites: builder.mutation<
        Actualite,
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
        invalidatesTags: ["Actualite"],
      }),
    };
  },
});

export const {
  useFetchActualiteQuery,
  useFetchActualiteByIdQuery,
  useAddActualiteMutation,
  useUpdateActualiteMutation,
  useDeleteActualiteMutation,
  useDeleteManyActualitesMutation,
} = actualiteSlice;
