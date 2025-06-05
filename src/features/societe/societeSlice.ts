import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Societe {
  _id?: string;
  nom: string;
  encadrant: string[];
  infos: string
}
export const societeSlice = createApi({
  reducerPath: "Societe",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/societe/`,
  }),
  tagTypes: ["Societe"],
  endpoints(builder) {
    return {
      fetchAllSocietes: builder.query<Societe[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["Societe"],
      }),

      addSociete: builder.mutation<void, Societe>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
      getByName: builder.mutation<any, {name: string}>({
        query(payload) {
          return {
            url: "/get-by-name",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
      getById: builder.mutation<any, {id: string}>({
        query(payload) {
          return {
            url: "/get-by-id",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
    //   getCycleByValue: builder.mutation<
    //     { id: string; cycle_fr: string; cycle_ar: string },
    //     Cycle
    //   >({
    //     query(payload) {
    //       return {
    //         url: "/get-cycle-value",
    //         method: "POST",
    //         body: payload,
    //       };
    //     },
    //     invalidatesTags: ["Cycle"],
    //   }),
    //   updateCycle: builder.mutation<void, Cycle>({
    //     query: ({ _id, ...rest }) => ({
    //       url: `/update-cycle/${_id}`,
    //       method: "PUT",
    //       body: rest,
    //     }),
    //     invalidatesTags: ["Cycle"],
    //   }),
    //   deleteCycle: builder.mutation<void, string>({
    //     query: (_id) => ({
    //       url: `delete-cycle/${_id}`,
    //       method: "DELETE",
    //     }),
    //     invalidatesTags: ["Cycle"],
    //   }),
    };
  },
});

export const {
  useAddSocieteMutation,
  useFetchAllSocietesQuery,
  useGetByNameMutation,
  useGetByIdMutation
} = societeSlice;
