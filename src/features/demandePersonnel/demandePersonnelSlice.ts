import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Demande {

    _id:string,
    personnelId: string,
    title:  string,
    description: string,
    piece_demande: string,
    langue: string,
    nombre_copie: number,
    response: string,
    status: string,
    createdAt:Date,
    updatedAt:Date
  }
  export const demandePersonnelSlice = createApi({
    reducerPath: 'demandePersonnelApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/demande-personnel/`, // Adjust endpoint base URL
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
        updateDemandePersonnel: builder.mutation<void, Demande>({
          query(reclamation) {
            const { _id, ...rest } = reclamation;
            return {
              url: `edit-demande-personnel/${_id}`,
              method: 'PUT',
              body: rest,
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
      };
    },
  });
  
  export const {
    useFetchDemandePersonnelQuery,
    useFetchDemandePersonnelByIdQuery,
    useAddDemandePersonnelMutation,
    useUpdateDemandePersonnelMutation,
    useDeleteDemandePersonnelMutation,
  } = demandePersonnelSlice;