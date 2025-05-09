import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeneratedDoc } from "features/generatedDoc/generatedDocSlice";

export interface Demande {
  _id: string;
  studentId: string;
  generated_doc?: string | GeneratedDoc;
  title: string;
  description: string;
  piece_demande: string;
  langue: string;
  nombre_copie: number;
  response: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export const demandeEtudiantSlice = createApi({
  reducerPath: "demandeEtudiantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/demande-etudiant/`,
  }),
  tagTypes: ["Demandes"],
  endpoints(builder) {
    return {
      fetchDemandeEtudiant: builder.query<
        Demande[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          
          return {
            url: `get-all-demande-etudiants`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Demandes"],
      }),
      fetchDemandeEtudiantById: builder.query<Demande[], void>({
        query(_id) {
          return `get-demande-etudiant/${_id}`;
        },
        providesTags: ["Demandes"],
      }),
      addDemandeEtudiant: builder.mutation<void, Partial<Demande>>({
        query(demande) {
          return {
            url: "add-demande-etudiant",
            method: "POST",
            body: demande,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      updateDemandeEtudiant: builder.mutation<void, Partial<Demande>>({
        query(demande) {
          return {
            url: `edit-demande-etudiant`,
            method: "PUT",
            body: demande,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      deleteDemandeEtudiant: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-demande-etudiant/${_id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      deleteManyDemandeEtudiant: builder.mutation<
        Demande,
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
        invalidatesTags: ["Demandes"],
      }),
    };
  },
});

export const {
  useFetchDemandeEtudiantQuery,
  useFetchDemandeEtudiantByIdQuery,
  useAddDemandeEtudiantMutation,
  useUpdateDemandeEtudiantMutation,
  useDeleteDemandeEtudiantMutation,
  useDeleteManyDemandeEtudiantMutation,
} = demandeEtudiantSlice;
