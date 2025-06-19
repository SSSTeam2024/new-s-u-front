import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AvisCommissionModel {
  _id?: string;
  commission: string;
  type_stage: string;
  liste: {
    etudiant: string;
    groupe: string;
    sujet: string;
    lieu: string;
    avis: string;
    remarques: string;
  }[];
  etat: string;
}
export const avisCommissionSlice = createApi({
  reducerPath: "avisCommission",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/avis-commission/`,
  }),
  tagTypes: ["AvisCommissionModel"],
  endpoints(builder) {
    return {
      fetchAllAvisCommission: builder.query<AvisCommissionModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["AvisCommissionModel"],
      }),
      addAvisCommission: builder.mutation<AvisCommissionModel, AvisCommissionModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["AvisCommissionModel"],
      }),
      updateAvisCommission: builder.mutation<void, AvisCommissionModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["AvisCommissionModel"],
      }),
      deleteAvisCommission: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AvisCommissionModel"],
      }),
    };
  },
});

export const {
  useAddAvisCommissionMutation,
  useDeleteAvisCommissionMutation,
  useFetchAllAvisCommissionQuery,
  useUpdateAvisCommissionMutation,
} = avisCommissionSlice;
