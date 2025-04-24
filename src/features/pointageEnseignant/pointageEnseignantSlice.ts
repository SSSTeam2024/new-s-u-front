import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PointageEnseignant {
  _id?: string;
  id_enseignant: string;
  id_seance: string;
  date_pointage: string;
 
}
export const pointageSlice = createApi({
  reducerPath: "pointageEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/pointage-enseignant/`,
  }),
  tagTypes: ["PointageEnseignant"],
  endpoints(builder) {
    return {
      fetchPointageEnseignants: builder.query<PointageEnseignant[], number | void>({
        query() {
          return "get-all";
        },
        providesTags: ["PointageEnseignant"],
      }),
      addPointageEnseignant: builder.mutation<void, PointageEnseignant>({
        query(payload) {
          return {
            url: "create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PointageEnseignant"],
      }),
      updatePointageEnseignant: builder.mutation<void, PointageEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-one/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["PointageEnseignant"],
      }),
      deletePointageEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-one/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PointageEnseignant"],
      }),
      fetchPointageEnseignantById: builder.mutation<void, PointageEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/get-by-id/${_id}`,
          method: "GET",
          body: rest,
        }),
        invalidatesTags: ["PointageEnseignant"],
      }),
    };
  },
});

export const {
  useAddPointageEnseignantMutation,
  useDeletePointageEnseignantMutation,
  useFetchPointageEnseignantByIdMutation,
  useFetchPointageEnseignantsQuery,
  useUpdatePointageEnseignantMutation,
} = pointageSlice;