import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Demande {
  _id: string;
  enseignantId: string;
  title: string;
  description: string;
  piece_demande: string;
  langue: string;
  nombre_copie: number;
  response: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export const demandeEnseignantSlice = createApi({
  reducerPath: "DemandeEnseignantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/demande-enseignant/`, // Adjust endpoint base URL
  }),
  tagTypes: ["Demandes"],
  endpoints(builder) {
    return {
      fetchDemandeEnseignant: builder.query<Demande[], void>({
        query() {
          return "get-all-demande-enseignants";
        },
        providesTags: ["Demandes"],
      }),
      fetchDemandeEnseignantById: builder.query<Demande[], void>({
        query(_id) {
          return `get-demande-enseignant/${_id}`;
        },
        providesTags: ["Demandes"],
      }),
      addDemandeEnseignant: builder.mutation<void, Partial<Demande>>({
        query(reclamation) {
          return {
            url: "add-demande-Enseignant",
            method: "POST",
            body: reclamation,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      updateDemandeEnseignant: builder.mutation<void, Demande>({
        query(reclamation) {
          const { _id, ...rest } = reclamation;
          return {
            url: `edit-demande-enseignant/${_id}`,
            method: "PUT",
            body: rest,
          };
        },
        invalidatesTags: ["Demandes"],
      }),
      deleteDemandeEnseignant: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-demande-enseignant/${_id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Demandes"],
      }),
    };
  },
});

export const {
  useFetchDemandeEnseignantQuery,
  useFetchDemandeEnseignantByIdQuery,
  useAddDemandeEnseignantMutation,
  useUpdateDemandeEnseignantMutation,
  useDeleteDemandeEnseignantMutation,
} = demandeEnseignantSlice;
