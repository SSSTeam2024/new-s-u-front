import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Place {
  _id?: string;
  longitude: string;
  latitude: string;
  placeName: string;
  rayon: string
}

export interface VaribaleGlobale {
  _id?: string;
  directeur_ar: string;
  directeur_fr: string;
  secretaire_ar: string;
  secretaire_fr: string;
  abreviation: string;
  annee_universitaire: string;
  signature_directeur_base64: string;
  signature_directeur_extension: string;
  signature_secretaire_base64: string;
  signature_secretaire_extension: string;
  etablissement_ar: string;
  etablissement_fr: string;
  logo_etablissement_base64: string;
  logo_etablissement_extension: string;
  logo_universite_base64: string;
  logo_universite_extension: string;
  logo_republique_base64: string;
  logo_republique_extension: string;
  universite_ar: string;
  universite_fr: string;
  address_ar: string;
  address_fr: string;
  gouvernorat_ar: string,
  gouvernorat_fr: string,
  code_postal: string,
  phone: string;
  fax: string;
  website: string;
  signature_directeur: string;
  signature_secretaire: string;
  logo_etablissement: string;
  logo_universite: string;
  logo_republique: string;
  places: Place[];
  createdAt: string;
  [key: string]: string | Place[] | undefined; // Allow dynamic properties

}
  export const varibaleGlobaleSlice = createApi({
    reducerPath: 'varibaleGlobale',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/api/variable-globale/`,
    }),
    tagTypes: ['VaribaleGlobale'],
    endpoints(builder) {
      return {
        fetchVaribaleGlobale: builder.query<VaribaleGlobale[], void>({
          query() {
            return 'get-all-variables-globales';
          },
          providesTags: ['VaribaleGlobale'],
        }),
        addNewVaribaleGlobale: builder.mutation<void, VaribaleGlobale>({
          query(payload) {
            return {
              url: 'create-variable-globale',
              method: 'POST',
              body: payload,
            };
          },
          invalidatesTags: ['VaribaleGlobale'],
        }),
      };
    },
  });
  
  export const {
   useAddNewVaribaleGlobaleMutation,
   useFetchVaribaleGlobaleQuery
  } = varibaleGlobaleSlice;