import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IntervenantsModel {
  _id?: string;
  nom_fr: string;
  nom_ar: string;
  cin: string;
  matricule: string;
  phone: string;
  email: string;
  site: string;
  address: string;
  abbreviation: string;
}
export const intervenantsSlice = createApi({
  reducerPath: "intervenants",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/intervenant`,
  }),
  tagTypes: ["IntervenantsModel"],
  endpoints(builder) {
    return {
      fetchAllIntervenants: builder.query<IntervenantsModel[], number | void>({
        query() {
          return "/get-all";
        },
        providesTags: ["IntervenantsModel"],
      }),

      addIntervenant: builder.mutation<void, IntervenantsModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["IntervenantsModel"],
      }),
      updateIntervenant: builder.mutation<void, IntervenantsModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-one/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["IntervenantsModel"],
      }),
      deleteIntervenant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete-one/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["IntervenantsModel"],
      }),
    };
  },
});

export const {
  useAddIntervenantMutation,
  useDeleteIntervenantMutation,
  useFetchAllIntervenantsQuery,
  useUpdateIntervenantMutation,
} = intervenantsSlice;
