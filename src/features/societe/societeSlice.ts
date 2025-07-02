import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SocieteModel {
  _id?: string;
  nom: string;
  encadrant: string[];
  matricule: string;
  adresse: string;
  responsable: string;
  siteweb: string;
  phone: string;
}
export const societeSlice = createApi({
  reducerPath: "Societe",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/societe/`,
  }),
  tagTypes: ["Societe"],
  endpoints(builder) {
    return {
      fetchAllSocietes: builder.query<SocieteModel[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["Societe"],
      }),

      addSociete: builder.mutation<void, SocieteModel>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
      getByName: builder.mutation<any, { name: string }>({
        query(payload) {
          return {
            url: "/get-by-name",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
      getById: builder.mutation<any, { id: string }>({
        query(payload) {
          return {
            url: "/get-by-id",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Societe"],
      }),
        updateSociete: builder.mutation<void, SocieteModel>({
          query: ({ _id, ...rest }) => ({
            url: `/update/${_id}`,
            method: "PUT",
            body: rest,
          }),
          invalidatesTags: ["Societe"],
        }),
        deleteSociete: builder.mutation<void, string>({
          query: (_id) => ({
            url: `delete/${_id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Societe"],
        }),
    };
  },
});

export const {
  useAddSocieteMutation,
  useFetchAllSocietesQuery,
  useGetByNameMutation,
  useGetByIdMutation,
  useDeleteSocieteMutation,
  useUpdateSocieteMutation
} = societeSlice;
