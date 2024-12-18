import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PosteEnseignant {
  _id: string;
  //  value_poste_enseignant: string;
  poste_fr: string;
  poste_ar: string;
}
export const posteEnseignantSlice = createApi({
  reducerPath: "PosteEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/poste-enseignant/",
  }),
  tagTypes: ["PosteEnseignant"],
  endpoints(builder) {
    return {
      fetchPostesEnseignant: builder.query<PosteEnseignant[], number | void>({
        query() {
          return `get-all-poste-enseignant`;
        },
        providesTags: ["PosteEnseignant"],
      }),

      addPosteEnseignant: builder.mutation<void, PosteEnseignant>({
        query(payload) {
          return {
            url: "/create-poste-enseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PosteEnseignant"],
      }),
      updatePosteEnseignant: builder.mutation<void, PosteEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-poste-enseignant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["PosteEnseignant"],
      }),
      deletePosteEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-poste-enseignant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PosteEnseignant"],
      }),
    };
  },
});

export const {
  useAddPosteEnseignantMutation,
  useDeletePosteEnseignantMutation,
  useFetchPostesEnseignantQuery,
  useUpdatePosteEnseignantMutation,
} = posteEnseignantSlice;