import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EtatEtudiant {
  _id: string;
  value_etat_etudiant: string;
  etat_fr: string;
  etat_ar: string;
}
export const etatEtudiantSlice = createApi({
  reducerPath: "EtatEtudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/etat-etudiant/`,
  }),
  tagTypes: ["EtatEtudiant"],
  endpoints(builder) {
    return {
      fetchEtatsEtudiant: builder.query<EtatEtudiant[], number | void>({
        query() {
          return `get-all-etat-etudiant`;
        },
        providesTags: ["EtatEtudiant"],
      }),

      addEtatEtudiant: builder.mutation<void, EtatEtudiant>({
        query(payload) {
          return {
            url: "/create-etat-etudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["EtatEtudiant"],
      }),
      updateEtatEtudiant: builder.mutation<void, EtatEtudiant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-etat-etudiant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["EtatEtudiant"],
      }),
      deleteEtatEtudiant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-etat-etudiant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EtatEtudiant"],
      }),
    };
  },
});

export const {
useAddEtatEtudiantMutation,
useDeleteEtatEtudiantMutation,
useFetchEtatsEtudiantQuery,
useUpdateEtatEtudiantMutation
} = etatEtudiantSlice;