import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Subcategory {
  _id?: string;
  name_fr: string;
  name_ar: string;
  maxDays: number;
  sexe: "Homme" | "Femme" | "Both";
  Accumulable: boolean;
}

export interface DemandeConge {

  _id:string,
  personnelId:string,
  leaveType:string,
  subcategory: Subcategory;
  remainingDays:number,
  requestedDays:number,
  startDay:Date,
  endDay:Date,
  status:string,
  dateInterruption:Date,
  fileInterruption: string;
  fileInterruptionBase64String: string;
  fileInterruptionExtension: string;
  daysUsed:number
  year:number,
  lastUpdated:Date,
  file: string;
  fileBase64String: string;
  fileExtension: string;
  adresse_conge: string;
  nature_fichier: string;
  fileReponse: string;
  fileReponseBase64String: string;
  fileReponseExtension: string;
  reponse: string;
  dateResponse: Date;

  }
  export const demandeCongeSlice = createApi({
    reducerPath: 'demandeCongeApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/demandeConge/`, // Adjust endpoint base URL
    }),
    tagTypes: ['DemandeConges'],
    endpoints(builder) {
      return {
        fetchDemandeConge: builder.query<DemandeConge[], void>({
          query() {
            return 'get-all-demande-conge';
          },
          providesTags: ['DemandeConges'],
        }),
        fetchDemandeCongeById: builder.query<DemandeConge[], void>({
            query(_id) {
              return `get-demande-conge/${_id}`;
            },
            providesTags: ['DemandeConges'],
          }),
        addDemandeConge: builder.mutation<void, Partial<DemandeConge>>({
          query(leaveBalance) {
            return {
              url: 'add-demande-conge',
              method: 'POST',
              body: leaveBalance,
            };
          },
          invalidatesTags: ['DemandeConges'],
        }),
    
        updateDemandeConge: builder.mutation<void, Partial<DemandeConge>>({
          query(leaveBalance) {
          
            return {
              url: `edit-demande-conge`,
              method: 'PUT',
              body: leaveBalance,
            };
          },
          invalidatesTags: ['DemandeConges'],
        }),
        deleteDemandeConge: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-demande-conge/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['DemandeConges'],
        }),
      };
    },
  });
  
  export const {
    useFetchDemandeCongeQuery,
    useFetchDemandeCongeByIdQuery,
    useAddDemandeCongeMutation,
    useUpdateDemandeCongeMutation,
    useDeleteDemandeCongeMutation,
  } = demandeCongeSlice;