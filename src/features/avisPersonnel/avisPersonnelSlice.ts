import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AvisPersonnel {
  _id: string;
  title: string;
  auteurId: string;
  description: string;
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
  export const avisPersonnelSlice = createApi({
    reducerPath: 'avisPersonnelApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/api/avis-personnel/`, // Adjust endpoint base URL
    }),
    tagTypes: ['Avis'],
    endpoints(builder) {
      return {
        fetchAvisPersonnel: builder.query<AvisPersonnel, void>({
          query() {
            return 'get-all-avis-personnels';
          },
          providesTags: ['Avis'],
        }),
         fetchAvisPersonnelById: builder.query<AvisPersonnel, { _id: string }>({
                                query({ _id }) {
                                  return {
                                    url: 'get-avis-personnel',
                                    method: 'POST',
                                    body: { _id },
                                  };
                                },
                                providesTags: ['Avis'],
                              }),
        addAvisPersonnel: builder.mutation<void, Partial<AvisPersonnel>>({
          query(avisPersonnel) {
            return {
              url: 'add-avis-personnel',
              method: 'POST',
              body: avisPersonnel,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        updateAvisPersonnel: builder.mutation<void, AvisPersonnel>({
          query(avisPersonnel) {
            return {
              url: `edit-demande-personnel`,
              method: 'PUT',
              body: avisPersonnel,
            };
          },
          invalidatesTags: ['Avis'],
        }),
        deleteAvisPersonnel: builder.mutation<AvisPersonnel, { _id: string }>({
          query(_id) {
            return {
              url: `delete-demande-personnel`,
              method: 'DELETE',
              body:{ _id }
            };
          },
          invalidatesTags: ['Avis'],
        }),
      };
    },
  });
  
  export const {
    useFetchAvisPersonnelQuery,
    useFetchAvisPersonnelByIdQuery,
    useAddAvisPersonnelMutation,
    useUpdateAvisPersonnelMutation,
    useDeleteAvisPersonnelMutation,
  } = avisPersonnelSlice;