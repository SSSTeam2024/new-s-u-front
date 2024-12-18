import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Avis {
  _id: string;
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
  createdAt: string
}
  export const avisEtudiantSlice = createApi({
    reducerPath: 'avisEtudiantApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/avis-etudiant/`, // Adjust endpoint base URL
    }),
    tagTypes: ['Avis'],
    endpoints(builder) {
      return {
        fetchAvisEtudiant: builder.query<Avis, void>({
          query() {
            return 'get-all-avis-etudiants';
          },
          providesTags: ['Avis'],
        }),
        fetchAvisEtudiantById: builder.query<Avis[], void>({
            query(_id) {
              return `get-avis-etudiant/${_id}`;
            },
            providesTags: ['Avis'],
          }),
        addAvisEtudiant: builder.mutation<void, Partial<Avis>>({
          query(avisEtudiant) {
            return {
              url: 'add-avis-etudiant',
              method: 'POST',
              body: avisEtudiant,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        updateAvisEtudiant: builder.mutation<void, Avis>({
          query(avisEtudiant) {
            const { _id, ...rest } = avisEtudiant;
            return {
              url: `edit-avis-etudiant/${_id}`,
              method: 'PUT',
              body: rest,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        deleteAvisEtudiant: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-avis-etudiant/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['Avis'],
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
  } = avisEtudiantSlice;