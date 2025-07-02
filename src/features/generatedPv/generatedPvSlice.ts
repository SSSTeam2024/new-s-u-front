import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GeneratedPvModel {
  _id?: string;
  titre: string;
  content: string;
  commission: string;
  fichier_base64_string?: string;
  fichier_extension?: string;
  fichier?: string;
  createdAt?: string
}
export const generatedPvSlice = createApi({
  reducerPath: "generatedPv",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/generated-pv/`,
  }),
  tagTypes: ["GeneratedPvModel"],
  endpoints(builder) {
    return {
      fetchAllGeneratedPvs: builder.query<GeneratedPvModel[], number | void>({
        query() {
          return `/get-all`;
        },
        providesTags: ["GeneratedPvModel"],
      }),
      addGeneratedPv: builder.mutation<void, GeneratedPvModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["GeneratedPvModel"],
      }),
      updateGeneratedPv: builder.mutation<void, GeneratedPvModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["GeneratedPvModel"],
      }),
      deleteGeneratedPv: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GeneratedPvModel"],
      }),
    };
  },
});

export const {
  useAddGeneratedPvMutation,
  useDeleteGeneratedPvMutation,
  useFetchAllGeneratedPvsQuery,
  useUpdateGeneratedPvMutation,
} = generatedPvSlice;
