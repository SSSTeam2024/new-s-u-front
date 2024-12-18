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
  createdAt: string
}
  export const avisEnseignantSlice = createApi({
    reducerPath: 'avisEnseignantApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/avis-enseignant/`, // Adjust endpoint base URL
    }),
    tagTypes: ['Avis'],
    endpoints(builder) {
      return {
        fetchAvisEnseignant: builder.query<AvisEnseignant, void>({
          query() {
            return 'get-all-avis-enseignants';
          },
          providesTags: ['Avis'],
        }),
        fetchAvisEnseignantById: builder.query<AvisEnseignant[], void>({
            query(_id) {
              return `get-avis-enseignant/${_id}`;
            },
            providesTags: ['Avis'],
          }),
        addAvisEnseignant: builder.mutation<void, Partial<AvisEnseignant>>({
          query(avisEnseignant) {
            return {
              url: 'add-avis-enseignant',
              method: 'POST',
              body: avisEnseignant,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        updateAvisEnseignant: builder.mutation<void, AvisEnseignant>({
          query(avisEnseignant) {
            const { _id, ...rest } = avisEnseignant;
            return {
              url: `edit-demande-enseignant/${_id}`,
              method: 'PUT',
              body: rest,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        deleteAvisEnseignant: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-demande-enseignant/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['Avis'],
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
  } = avisEnseignantSlice;