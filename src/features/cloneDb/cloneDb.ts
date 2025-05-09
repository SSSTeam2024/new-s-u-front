import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cloneSlice = createApi({
  reducerPath: "cloneDB",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/clone/`,
  }),
  tagTypes: ["CloneDB"],
  endpoints(builder) {
    return {
       fetchMigrateValue: builder.query<boolean, void>({
              query() {
                return `migration-status`;
              },
              providesTags: ["CloneDB"],
            }),
      addClone: builder.mutation<void, void>({
        query() {
          return {
            url: "clone-db",
            method: "POST",
          };
        },
        invalidatesTags: ["CloneDB"],
      }),
      promoteDatabase: builder.mutation<void, void>({
        query() {
          return {
            url: "promote",
            method: "POST",
          };
        },
        invalidatesTags: ["CloneDB"],
      }),
    };
  },
});

export const {
  useAddCloneMutation,
  usePromoteDatabaseMutation,
  useFetchMigrateValueQuery
} = cloneSlice;
