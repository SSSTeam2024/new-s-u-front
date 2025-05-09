import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GeneratedDoc } from "features/generatedDoc/generatedDocSlice";

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
  status: string,
  createdAt: Date,
  updatedAt: Date
}
export const demandePersonnelSlice = createApi({
  reducerPath: 'demandePersonnelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/demande-personnel/`, // Adjust endpoint base URL
  }),
  tagTypes: ['Demandes'],
  endpoints(builder) {
    return {
      fetchDemandePersonnel: builder.query<Demande[], void>({
        query() {
          return 'get-all-demande-personnels';
        },
        providesTags: ['Demandes'],
      }),
      fetchDemandePersonnelById: builder.query<Demande[], void>({
        query(_id) {
          return `get-demande-personnel/${_id}`;
        },
        providesTags: ['Demandes'],
      }),
      addDemandePersonnel: builder.mutation<void, Partial<Demande>>({
        query(demande) {
          return {
            url: 'add-demande-personnel',
            method: 'POST',
            body: demande,
          };
        },
        invalidatesTags: ['Demandes'],
      }),
      updateDemandePersonnel: builder.mutation<void, Partial<Demande>>({
        query(demande) {

          return {
            url: `edit-demande-personnel`,
            method: 'PUT',
            body: demande,
          };
        },
        invalidatesTags: ['Demandes'],
      }),
      deleteDemandePersonnel: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-demande-personnel/${_id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['Demandes'],
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
  useHandleDemandePersonnelMutation
} = demandePersonnelSlice;