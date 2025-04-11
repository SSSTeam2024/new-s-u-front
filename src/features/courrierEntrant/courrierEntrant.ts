import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CourrierEntrant {
  _id?: string;
  num_ordre: string;
  date_arrive: string;
  num_courrier: string;
  date_courrier: string;
  source: string;
  destinataire: string;
  sujet: string;
  date_livraison: string;
  file_base64_string: string;
  file_extension: string;
  file: string;
  createdAt?: string
}
export const courrierEntrantSlice = createApi({
  reducerPath: "courrierentrant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/courrier-entrant/`,
  }),
  tagTypes: ["CourrierEntrant"],
  endpoints(builder) {
    return {
      fetchAllCourrierEntrant: builder.query<CourrierEntrant[], number | void>({
        query() {
          return `/get-all`;
        },
        providesTags: ["CourrierEntrant"],
      }),
      fetchLastCourrierEntrant: builder.query<CourrierEntrant, number | void>({
        query() {
          return `/get-last`;
        },
        providesTags: ["CourrierEntrant"],
      }),
      addCourrierEntrant: builder.mutation<void, CourrierEntrant>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CourrierEntrant"],
      }),
      updateCourrierEntrant: builder.mutation<void, CourrierEntrant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-by-id/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["CourrierEntrant"],
      }),
      deleteCourrierEntrant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete-one/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CourrierEntrant"],
      }),
    };
  },
});

export const {
  useAddCourrierEntrantMutation,
  useDeleteCourrierEntrantMutation,
  useFetchAllCourrierEntrantQuery,
  useUpdateCourrierEntrantMutation,
  useFetchLastCourrierEntrantQuery,
} = courrierEntrantSlice;
