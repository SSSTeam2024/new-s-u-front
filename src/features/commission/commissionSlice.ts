import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CommissionModel {
  _id?: string;
  titre_fr: string;
  titre_ar: string;
  date_creation: string;
  date_fin: string;
  groupes: string[];
  membres: string[];
}
export const commissionSlice = createApi({
  reducerPath: "commission",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/commission/`,
  }),
  tagTypes: ["CommissionModel"],
  endpoints(builder) {
    return {
      fetchAllCommission: builder.query<CommissionModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["CommissionModel"],
      }),
      addCommission: builder.mutation<void, CommissionModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CommissionModel"],
      }),
      updateCommission: builder.mutation<void, CommissionModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["CommissionModel"],
      }),
      deleteCommission: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CommissionModel"],
      }),
    };
  },
});

export const {
  useAddCommissionMutation,
  useDeleteCommissionMutation,
  useFetchAllCommissionQuery,
  useUpdateCommissionMutation,
} = commissionSlice;
