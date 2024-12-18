import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Departement {
  _id: string;
  description: string,
  volume_horaire: string,
  nom_chef_dep: string,
  name_ar: string,
  name_fr: string,
  SignatureFileExtension:string;
  SignatureFileBase64String:string;
  signature:string
}
export const departementSlice = createApi({
  reducerPath: "Departement",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/department/`,
  }),
  tagTypes: ["Departement"],
  endpoints(builder) {
    return {
      fetchDepartements: builder.query<Departement[], number | void>({
        query() {
          return `get-all-department`;
        },
        providesTags: ["Departement"],
      }),

      addDepartement: builder.mutation<void, Departement>({
        query(payload) {
          return {
            url: "/create-department",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Departement"],
      }),
      updateDepartement: builder.mutation<void, Departement>({
        query: ({ _id, ...rest }) => ({
          url: `/update-department/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Departement"],
      }),
      deleteDepartement: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-department/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Departement"],
      }),
    };
  },
});

export const {
  useAddDepartementMutation,
  useDeleteDepartementMutation,
  useFetchDepartementsQuery,
  useUpdateDepartementMutation
} = departementSlice;