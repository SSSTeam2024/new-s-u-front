import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Reclamation {

    _id:string,
    enseignantId: string,
    title:  string,
    description: string,
    response: string,
    status: String,
    createdAt:String,
    updatedAt:String,
    pdf: string;
    pdfBase64String: string;
    pdfExtension: string;
    video: string;
    videoBase64String: string;
    videoExtension: string;
    photos: string[];
    galleryBase64Strings: string[];
    galleryExtensions: string[];
  }
  export const reclamationsEnseignantSlice = createApi({
    reducerPath: 'reclamationsEnseignantApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/reclamation-enseignant/`, // Adjust endpoint base URL
    }),
    tagTypes: ['Reclamations'],
    endpoints(builder) {
      return {
        fetchReclamationsEnseignant: builder.query<Reclamation[], void>({
          query() {
            return 'get-all-reclamations';
          },
          providesTags: ['Reclamations'],
        }),
        fetchReclamationEnseignantById: builder.query<Reclamation[], void>({
            query(_id) {
              return `get-reclamation/${_id}`;
            },
            providesTags: ['Reclamations'],
          }),
        addReclamationEnseignant: builder.mutation<void, Partial<Reclamation>>({
          query(reclamation) {
            return {
              url: 'add-reclamation',
              method: 'POST',
              body: reclamation,
            };
          },
          invalidatesTags: ['Reclamations'],
        }),
        updateReclamationEnseignant: builder.mutation<void, Partial<Reclamation>>({
          query(reclamation) {
           
            return {
              url: `edit-reclamation`,
              method: 'PUT',
              body: reclamation,
            };
          },
          invalidatesTags: ['Reclamations'],
        }),
        deleteReclamationEnseignant: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-reclamation/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['Reclamations'],
        }),
      };
    },
  });
  
  export const {
    useFetchReclamationsEnseignantQuery,
    useFetchReclamationEnseignantByIdQuery,
    useAddReclamationEnseignantMutation,
    useUpdateReclamationEnseignantMutation,
    useDeleteReclamationEnseignantMutation,
  } = reclamationsEnseignantSlice;