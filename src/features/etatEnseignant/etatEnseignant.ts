import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EtatEnseignant {
  _id: string;
  // value_etat_enseignant: string;
  etat_fr: string;
  etat_ar: string;
}
export const etatEnseignantSlice = createApi({
  reducerPath: "EtatEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/etat-enseignant/",
  }),
  tagTypes: ["EtatEnseignant"],
  endpoints(builder) {
    return {
      fetchEtatsEnseignant: builder.query<EtatEnseignant[], number | void>({
        query() {
          return `get-all-etat-enseignant`;
        },
        providesTags: ["EtatEnseignant"],
      }),

      addEtatEnseignant: builder.mutation<void, EtatEnseignant>({
        query(payload) {
          return {
            url: "/create-etat-enseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["EtatEnseignant"],
      }),
      updateEtatEnseignant: builder.mutation<void, EtatEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-etat-enseignant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["EtatEnseignant"],
      }),
      deleteEtatEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-etat-enseignant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EtatEnseignant"],
      }),
    };
  },
});

export const {
  useAddEtatEnseignantMutation,
  useFetchEtatsEnseignantQuery,
  useDeleteEtatEnseignantMutation,
  useUpdateEtatEnseignantMutation,
} = etatEnseignantSlice;