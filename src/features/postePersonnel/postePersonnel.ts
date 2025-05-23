import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PostePersonnel {
  _id?: string;
  // value: string;
  poste_fr: string;
  poste_ar: string;
}
export const postePersonnelSlice = createApi({
  reducerPath: "PostePersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/poste-personnel/`,
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

      addPostePersonnel: builder.mutation<PostePersonnel, PostePersonnel>({
        query(payload) {
          return {
            url: "/create-poste-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PostePersonnel"],
      }),
      getPostePersonnelValue: builder.mutation<
        { id: string; poste_fr: string; poste_ar: string },
        PostePersonnel
      >({
        query(payload) {
          return {
            url: "/get-poste-by-value",
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
  useGetPostePersonnelValueMutation,
} = postePersonnelSlice;
