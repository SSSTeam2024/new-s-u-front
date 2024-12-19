import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PapierAdministratif {
  _id?:string;
  nom_ar:string;
  nom_fr:string;
  category:string[]
}

export const papierAdministratifSlice = createApi({
  reducerPath: "PapierAdministratif",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/papierAdministratif/`,
  }),
  tagTypes: ["PapierAdministratif"],
  endpoints(builder) {
    return {
 
      fetchPapierAdministratif: builder.query<PapierAdministratif[], number | void>({
        query() {
          return `get-all-papier-administratif`;
        },
        providesTags: ["PapierAdministratif"],
      }),

      addPapierAdministratif: builder.mutation<void, PapierAdministratif>({
        query(payload) {
          return {
            url: "/create-papier-administratif",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PapierAdministratif"],
      }),
      updatePapierAdministratif: builder.mutation<void, PapierAdministratif>({
        query: ({ _id, ...rest }) => ({
          url: `/update-papier-administratif`,
          method: "PUT",
          body: { _id, ...rest },
        }),
        invalidatesTags: ["PapierAdministratif"],
      }),
      
      deletePapierAdministratif: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete-papier-administratif/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PapierAdministratif"],
      }),
    };
  },
});

export const {
useAddPapierAdministratifMutation,
useFetchPapierAdministratifQuery,
useDeletePapierAdministratifMutation,
useUpdatePapierAdministratifMutation
} = papierAdministratifSlice;