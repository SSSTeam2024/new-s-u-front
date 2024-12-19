import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TypeSeance {
  _id: string;
  seance_ar: string;
  seance_fr: string;
  abreviation: string;
  charge: string;
}
export const typeSeanceSlice = createApi({
  reducerPath: "TypeSeance",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/type-seance/`,
  }),
  tagTypes: ["TypeSeance"],
  endpoints(builder) {
    return {
      fetchTypeSeances: builder.query<TypeSeance[], number | void>({
        query() {
          return `get-all-type-seance`;
        },
        providesTags: ["TypeSeance"],
      }),

      addTypeSeance: builder.mutation<void, TypeSeance>({
        query(payload) {
          return {
            url: "/create-type-seance",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TypeSeance"],
      }),

      deleteTypeSeance: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-type-seance/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TypeSeance"],
      }),
      updateTypeSeance: builder.mutation<void, TypeSeance>({
        query: ({ _id, ...rest }) => ({
          url: `/update-type-seance`,
          method: "PUT",
          body: { _id, ...rest },
        }),
        invalidatesTags: ["TypeSeance"],
      }),
    };
  },
});

export const {
  useAddTypeSeanceMutation,
  useDeleteTypeSeanceMutation,
  useFetchTypeSeancesQuery,
  useUpdateTypeSeanceMutation,
} = typeSeanceSlice;