import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CourrierSortant {
  _id?: string;
  num_inscription: string;
  date_edition: string;
  voie_envoi: string[];
  destinataire: string;
  sujet: string;
  observations: string;
  file_base64_string: string;
  file_extension: string;
  file: string;
}
export const courrierSortantSlice = createApi({
  reducerPath: "courrierSortant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/courrier-sortant/`,
  }),
  tagTypes: ["CourrierSortant"],
  endpoints(builder) {
    return {
      fetchAllCourrierSortant: builder.query<CourrierSortant[], number | void>({
        query() {
          return `/get-all`;
        },
        providesTags: ["CourrierSortant"],
      }),

      addCourrierSortant: builder.mutation<void, CourrierSortant>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CourrierSortant"],
      }),
      updateCourrierSortant: builder.mutation<void, CourrierSortant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-by-id/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["CourrierSortant"],
      }),
      deleteCourrierSortant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete-one/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CourrierSortant"],
      }),
    };
  },
});

export const {
  useAddCourrierSortantMutation,
  useDeleteCourrierSortantMutation,
  useFetchAllCourrierSortantQuery,
  useUpdateCourrierSortantMutation,
} = courrierSortantSlice;
