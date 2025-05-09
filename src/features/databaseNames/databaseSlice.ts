import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Database {
  _id?: string;
  name: string;
  auteurId: string;
}
  export const databaseSlice = createApi({
    reducerPath: 'database',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/api/databases/`,
    }),
    tagTypes: ['Database'],
    endpoints(builder) {
      return {
        fetchAllDatabases: builder.query<Database[], string | void>({
          query() {
            return `get-all`;
          },
          providesTags: ['Database'],
        }),
        addNewDatabase: builder.mutation<Database,{ payload: Database}>({
          query({payload}) {
            return {
              url: `add-new`,
              method: 'POST',
              body: payload,
            };
          },
          invalidatesTags: ['Database'],
        }),
      };
    },
  });
  
  export const {
    useFetchAllDatabasesQuery,
    useAddNewDatabaseMutation
  } = databaseSlice;