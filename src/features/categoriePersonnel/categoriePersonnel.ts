import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CategoriePersonnel {
  _id: string;
  // value: string;
  categorie_fr: string;
  categorie_ar: string;
}
export const categoriePersonnelSlice = createApi({
  reducerPath: "CategoriePersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/categorie-personnel/",
  }),
  tagTypes: ["CategoriePersonnel"],
  endpoints(builder) {
    return {
      fetchCategoriesPersonnel: builder.query<
        CategoriePersonnel[],
        number | void
      >({
        query() {
          return `get-all-categorie-personnel`;
        },
        providesTags: ["CategoriePersonnel"],
      }),

      addCategoriePersonnel: builder.mutation<void, CategoriePersonnel>({
        query(payload) {
          return {
            url: "/create-categorie-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CategoriePersonnel"],
      }),
      updateCategoriePersonnel: builder.mutation<void, CategoriePersonnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-categorie-personnel/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["CategoriePersonnel"],
      }),
      deleteCategoriePersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-categorie-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CategoriePersonnel"],
      }),
    };
  },
});

export const {
  useFetchCategoriesPersonnelQuery,
  useAddCategoriePersonnelMutation,
  useUpdateCategoriePersonnelMutation,
  useDeleteCategoriePersonnelMutation,
} = categoriePersonnelSlice;