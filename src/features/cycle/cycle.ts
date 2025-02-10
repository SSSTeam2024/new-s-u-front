import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Cycle {
  _id: string;
  // value_etat_enseignant: string;
  cycle_fr: string;
  cycle_ar: string;
}
export const cycleSlice = createApi({
  reducerPath: "Cycle",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/cycle/`,
  }),
  tagTypes: ["Cycle"],
  endpoints(builder) {
    return {
      fetchAllCycle: builder.query<Cycle[], number | void>({
        query() {
          return `get-all-cycle`;
        },
        providesTags: ["Cycle"],
      }),

      addCycle: builder.mutation<void, Cycle>({
        query(payload) {
          return {
            url: "/create-cycle",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Cycle"],
      }),
      getCycleByValue: builder.mutation<
        { id: string; cycle_fr: string; cycle_ar: string },
        Cycle
      >({
        query(payload) {
          return {
            url: "/get-cycle-value",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Cycle"],
      }),
      updateCycle: builder.mutation<void, Cycle>({
        query: ({ _id, ...rest }) => ({
          url: `/update-cycle/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Cycle"],
      }),
      deleteCycle: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-cycle/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cycle"],
      }),
    };
  },
});

export const {
  useAddCycleMutation,
  useDeleteCycleMutation,
  useFetchAllCycleQuery,
  useGetCycleByValueMutation,
  useUpdateCycleMutation,
} = cycleSlice;
