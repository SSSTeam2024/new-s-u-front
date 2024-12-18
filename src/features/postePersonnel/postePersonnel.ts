import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PostePersonnel {
  _id: string;
  // value: string;
  poste_fr: string;
  poste_ar: string;
}
export const postePersonnelSlice = createApi({
  reducerPath: "PostePersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/poste-personnel/",
  }),
  tagTypes: ["PostePersonnel"],
  endpoints(builder) {
    return {
      fetchPostesPersonnel: builder.query<PostePersonnel[], number | void>({
        query() {
          return `get-all-poste-personnel`;
        },
        providesTags: ["PostePersonnel"],
      }),

      addPostePersonnel: builder.mutation<void, PostePersonnel>({
        query(payload) {
          return {
            url: "/create-poste-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PostePersonnel"],
      }),
      updatePostePersonnel: builder.mutation<void, PostePersonnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-poste-personnel/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["PostePersonnel"],
      }),
      deletePostePersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-poste-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PostePersonnel"],
      }),
    };
  },
});

export const {
  useAddPostePersonnelMutation,
  useFetchPostesPersonnelQuery,
  useDeletePostePersonnelMutation,
  useUpdatePostePersonnelMutation,
} = postePersonnelSlice;