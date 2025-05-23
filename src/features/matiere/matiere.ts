import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Matiere {
  _id?: string;
  code_matiere?: string;
  matiere?: string;
  type?: string;
  semestre?: string;
  volume?: string;
  nbr_elimination?: string;
  regime_matiere?: string;
  classes?: any[];
  types: {
    type: string;
    volume: string;
    nbr_elimination: string;
  }[];
  credit_matiere?: string;
  coefficient_matiere?: string;
}
export const matiereSlice = createApi({
  reducerPath: "Matiere",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/matiere/`,
  }),
  tagTypes: ["Matiere"],
  endpoints(builder) {
    return {
      fetchMatiere: builder.query<Matiere[], number | void>({
        query() {
          return `get-all-matiere`;
        },
        providesTags: ["Matiere"],
      }),

      addMatiere: builder.mutation<void, Matiere>({
        query(payload) {
          return {
            url: "/create-matiere",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Matiere"],
      }),
      updateMatiere: builder.mutation<void, Matiere>({
        query: ({ _id, ...rest }) => ({
          url: `/update-matiere/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Matiere"],
      }),
      getMatiereByCode: builder.mutation<
        { id: string; code_matiere: string },
        Matiere
      >({
        query(payload) {
          return {
            url: "/get-matiere-by-code",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Matiere"],
      }),
      deleteMatiere: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-matiere/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Matiere"],
      }),
    };
  },
});

export const {
  useAddMatiereMutation,
  useDeleteMatiereMutation,
  useFetchMatiereQuery,
  useUpdateMatiereMutation,
  useGetMatiereByCodeMutation,
} = matiereSlice;
