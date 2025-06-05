import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ExtraShortCode {
  _id: string;
  titre: string;
  body: string;
  langue: string;
  data_type: string;
  options: string[];

}
export const extraShortCodeSlice = createApi({
  reducerPath: "extraShortCode",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/extra-short-code/`,
  }),
  tagTypes: ["ExtraShortCode"],
  endpoints(builder) {
    return {
      fetchExtraShortCode: builder.query<ExtraShortCode[], void>({
        query() {
          return "get-all-extra-short-codes";
        },
        providesTags: ["ExtraShortCode"],
      }),
      addNewExtraShortCode: builder.mutation<void, ExtraShortCode>({
        query(payload) {
          return {
            url: "create-extra-short-code",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ExtraShortCode"],
      }),
    };
  },
});

export const { useAddNewExtraShortCodeMutation, useFetchExtraShortCodeQuery } =
  extraShortCodeSlice;
