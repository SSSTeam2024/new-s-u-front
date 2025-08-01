import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeneratedDoc } from "features/generatedDoc/generatedDocSlice";

export interface ExtraObject {
  name?: string,
  value?: string,
  body?: string,
  FileBase64?: string,
  FileExtension?: string
  filePath?: string
}

export interface Demande {
  _id: string;
  enseignantId: string;
  generated_doc?: string | GeneratedDoc;
  title: string;
  description: string;
  piece_demande: string;
  langue: string;
  nombre_copie: number;
  response: string;
  FileBase64?: string,
  FileExtension?: string,
  file?: string,
  status: string;
  extra_data?: ExtraObject[];
  createdAt: Date;
  updatedAt: Date;
  added_by: string;
  current_status: string;
  status_history: {
    value: string,
    date: string,
    handled_by: any,
    time: string
  }[]
}
export const demandeEnseignantSlice = createApi({
  reducerPath: "DemandeEnseignantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/demande-enseignant/`,
  }),
  tagTypes: ["Demandes"],
  endpoints(builder) {
    return {
      fetchDemandeEnseignant: builder.query<
        Demande[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-demande-enseignants`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Demandes"],
      }),
      fetchDemandeEnseignantById: builder.query<Demande[], void>({
        query(_id) {
          return `get-demande-enseignant/${_id}`;
        },
        providesTags: ["Demandes"],
      }),
      addDemandeEnseignant: builder.mutation<void, Partial<Demande>>({
        query(reclamation) {
          return {
            url: "add-demande-Enseignant",
            method: "POST",
            body: reclamation,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      updateDemandeEnseignant: builder.mutation<void, Partial<Demande>>({
        query(demande) {

          return {
            url: `edit-demande-Enseignant`,
            method: 'PUT',
            body: demande,
          };
        },
        invalidatesTags: ['Demandes'],
      }),
      deleteDemandeEnseignant: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-demande-enseignant/${_id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      handleDemandeEnseignant: builder.mutation<void, any>({
        query(demande) {
          return {
            url: 'handle-demande-enseignant',
            method: 'POST',
            body: demande,
          };
        },
        invalidatesTags: ['Demandes'],
      }),
      deleteManyDemandeEnseignant: builder.mutation<
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
      fetchDemandesByAdminId: builder.query<Demande[], string>({
        query: (adminId) => `by-admin/${adminId}`,
        providesTags: ['Demandes'],
      }),

    };
  },
});

export const {
  useFetchDemandeEnseignantQuery,
  useFetchDemandeEnseignantByIdQuery,
  useAddDemandeEnseignantMutation,
  useUpdateDemandeEnseignantMutation,
  useDeleteDemandeEnseignantMutation,
  useHandleDemandeEnseignantMutation,
  useDeleteManyDemandeEnseignantMutation,
  useFetchDemandesByAdminIdQuery
} = demandeEnseignantSlice;
