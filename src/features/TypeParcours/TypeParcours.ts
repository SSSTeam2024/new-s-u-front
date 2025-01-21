import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TypeParcours {
  _id: string;
  name_type_parcours_fr: string;
  name_type_parcours_ar: string;
  abreviation: string;
}

export const typeParcoursSlice = createApi({
  reducerPath: "TypeParcours",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/type-parcours/`,
  }),
  tagTypes: ["TypeParcours"],
  endpoints(builder) {
    return {
      fetchTypeParcours: builder.query<TypeParcours[], number | void>({
        query() {
          return `get-all-type-parcours`;
        },
        providesTags: ["TypeParcours"],
      }),

      addTypeParcours: builder.mutation<void, TypeParcours>({
        query(payload) {
          return {
            url: "/create-type-parcours",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TypeParcours"],
      }),
      updateTypeParcours: builder.mutation<void, TypeParcours>({
        query: ({ _id, ...rest }) => ({
          url: `/update-type-parcours/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["TypeParcours"],
      }),
      deleteTypeParcours: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-type-parcours/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TypeParcours"],
      }),
    };
  },
});

export const {
  useAddTypeParcoursMutation,
  useDeleteTypeParcoursMutation,
  useFetchTypeParcoursQuery,
  useUpdateTypeParcoursMutation,
} = typeParcoursSlice;
