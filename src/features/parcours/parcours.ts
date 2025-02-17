import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Parcours {
  _id?: string;
  type_parcours?: any;
  mention?: any;
  domaine?: any;
  nom_parcours: string;
  code_parcours: string;
  semestre_parcours?: string;
}

export const parcoursSlice = createApi({
  reducerPath: "Parcours",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/parcours/`,
  }),
  tagTypes: ["Parcours"],
  endpoints(builder) {
    return {
      fetchParcours: builder.query<Parcours[], number | void>({
        query() {
          return `get-all-parcours`;
        },
        providesTags: ["Parcours"],
      }),
      getParcoursByValue: builder.mutation<
        { id: string; nom_parcours: string; code_parcours: string },
        Parcours
      >({
        query(payload) {
          return {
            url: "/get-parcours-by-value",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Parcours"],
      }),
      addParcours: builder.mutation<Parcours, Parcours>({
        query(payload) {
          return {
            url: "/create-parcours",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Parcours"],
      }),
      updateParcours: builder.mutation<void, Parcours>({
        query: ({ _id, ...rest }) => ({
          url: `/update-parcours/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Parcours"],
      }),
      deleteParcours: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-parcours/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Parcours"],
      }),
    };
  },
});

export const {
  useAddParcoursMutation,
  useDeleteParcoursMutation,
  useFetchParcoursQuery,
  useUpdateParcoursMutation,
  useGetParcoursByValueMutation,
} = parcoursSlice;
