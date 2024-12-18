import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Reclamation {

    _id:string,
    studentId: string,
    title:  string,
    description: string,
    response: string,
    status: string,
    createdAt:Date,
    updatedAt:Date,
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
  export const reclamationsEtudiantSlice = createApi({
    reducerPath: 'reclamationsEtudiantApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/reclamation-etudiant/`, // Adjust endpoint base URL
    }),
    tagTypes: ['Reclamations'],
    endpoints(builder) {
      return {
        fetchReclamations: builder.query<Reclamation[], void>({
          query() {
            return 'get-all-reclamations';
          },
          providesTags: ['Reclamations'],
        }),
        fetchReclamationById: builder.query<Reclamation[], void>({
            query(_id) {
              return `get-reclamation/${_id}`;
            },
            providesTags: ['Reclamations'],
          }),
        addReclamation: builder.mutation<void, Partial<Reclamation>>({
          query(reclamation) {
            return {
              url: 'add-reclamation',
              method: 'POST',
              body: reclamation,
            };
          },
          invalidatesTags: ['Reclamations'],
        }),
        updateReclamation: builder.mutation<void,  Partial<Reclamation>>({
          query(reclamation) {
          
            return {
              url: `edit-reclamation`,
              method: 'PUT',
              body: reclamation,
            };
          },
          invalidatesTags: ['Reclamations'],
        }),
        deleteReclamation: builder.mutation<void, string>({
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
    useFetchReclamationsQuery,
    useFetchReclamationByIdQuery,
    useAddReclamationMutation,
    useUpdateReclamationMutation,
    useDeleteReclamationMutation,
  } = reclamationsEtudiantSlice;