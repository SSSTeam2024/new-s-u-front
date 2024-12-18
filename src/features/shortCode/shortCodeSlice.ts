import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ShortCode {
  _id: string;
  titre: string;
  body: string;
  langue:string,
  intended_for: string
}
  export const shortCodeSlice = createApi({
    reducerPath: 'shortCode',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/short-code/`,
    }),
    tagTypes: ['ShortCode'],
    endpoints(builder) {
      return {
        fetchShortCode: builder.query<ShortCode[], void>({
          query() {
            return 'get-all-short-codes';
          },
          providesTags: ['ShortCode'],
        }),
        addNewShortCode: builder.mutation<void, ShortCode>({
          query(payload) {
            return {
              url: 'create-short-code',
              method: 'POST',
              body: payload,
            };
          },
          invalidatesTags: ['ShortCode'],
        }),
      };
    },
  });
  
  export const {
   useAddNewShortCodeMutation,
   useFetchShortCodeQuery
  } = shortCodeSlice;