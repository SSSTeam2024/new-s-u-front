import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface EtatPersonnel {
  _id: string;
  //value:string,
  etat_fr: string;
  etat_ar: string;
}
export const etatPersonnelSlice = createApi({
  reducerPath: "EtatPersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/etat-personnel/",
  }),
  tagTypes: ["EtatPersonnel"],
  endpoints(builder) {
    return {
      fetchEtatsPersonnel: builder.query<EtatPersonnel[], number | void>({
        query() {
          return `get-all-etat-personnel`;
        },
        providesTags: ["EtatPersonnel"],
      }),

      addEtatPersonnel: builder.mutation<void, EtatPersonnel>({
        query(payload) {
          return {
            url: "/create-etat-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["EtatPersonnel"],
      }),
      updateEtatPersonnel: builder.mutation<void, EtatPersonnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-etat-personnel/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["EtatPersonnel"],
      }),
      deleteEtatPersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-etat-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EtatPersonnel"],
      }),
    };
  },
});

export const {
  useAddEtatPersonnelMutation,
  useFetchEtatsPersonnelQuery,
  useDeleteEtatPersonnelMutation,
  useUpdateEtatPersonnelMutation,
} = etatPersonnelSlice;