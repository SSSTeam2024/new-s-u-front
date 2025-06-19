import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeneratedDoc } from "features/generatedDoc/generatedDocSlice";

export interface ExtraObject {
  name?: string,
  value?: string,
  body?: string
}

export interface Demande {
  _id: string,
  personnelId: string,
  generated_doc?: string | GeneratedDoc;
  title: string,
  description: string,
  piece_demande: string,
  langue: string,
  nombre_copie: number,
  response: string,
  FileBase64?: string,
  FileExtension?: string,
  file?: string,
  status: string;
  extra_data?: ExtraObject[];
  createdAt: Date,
  updatedAt: Date,
  added_by: string;
  current_status: string;
  status_history: {
    value: string,
    date: string
  }[]

}
export const demandePersonnelSlice = createApi({
  reducerPath: "demandePersonnelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/demande-personnel/`,
  }),
  tagTypes: ["Demandes"],
  endpoints(builder) {
    return {
      fetchDemandePersonnel: builder.query<
        Demande[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-demande-personnels`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Demandes"],
      }),
      fetchDemandePersonnelById: builder.query<Demande[], void>({
        query(_id) {
          return `get-demande-personnel/${_id}`;
        },
        providesTags: ["Demandes"],
      }),
      addDemandePersonnel: builder.mutation<void, Partial<Demande>>({
        query(demande) {
          return {
            url: "add-demande-personnel",
            method: "POST",
            body: demande,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      updateDemandePersonnel: builder.mutation<void, Partial<Demande>>({
        query(demande) {

          return {
            url: `edit-demande-personnel`,
            method: "PUT",
            body: demande,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      deleteDemandePersonnel: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-demande-personnel/${_id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      deleteManyDemandePersonnel: builder.mutation<
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
      handleDemandePersonnel: builder.mutation<void, any>({
        query(demande) {
          return {
            url: 'handle-demande-personnel',
            method: 'POST',
            body: demande,
          };
        },
        invalidatesTags: ['Demandes'],
      }),
    };
  },
});

export const {
  useFetchDemandePersonnelQuery,
  useFetchDemandePersonnelByIdQuery,
  useAddDemandePersonnelMutation,
  useUpdateDemandePersonnelMutation,
  useDeleteDemandePersonnelMutation,
  useHandleDemandePersonnelMutation,
  useDeleteManyDemandePersonnelMutation,
} = demandePersonnelSlice;


