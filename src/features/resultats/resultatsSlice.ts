import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Resultat {
  _id?: string;
  etudiants: [
    {
      etudiant: String;
      moyenne_sem1: string;
      moyenne_sem2: string;
      moyenne_rattrapage: string;
      moyenne_generale: string;
      avis: string;
    }
  ];
  createdAt?: string;
}
export const resultatSlice = createApi({
  reducerPath: "Resultat",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/resultat/`,
  }),
  tagTypes: ["Resultat"],
  endpoints(builder) {
    return {
      fetchResultats: builder.query<Resultat[], number | void>({
        query() {
          return `get-all`;
        },
        providesTags: ["Resultat"],
      }),

      addResultat: builder.mutation<void, Resultat>({
        query(payload) {
          return {
            url: "/create-new",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Resultat"],
      }),
      updateResultat: builder.mutation<void, Resultat>({
        query: ({ _id, ...rest }) => ({
          url: `/edit/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Resultat"],
      }),
      deleteResultat: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Resultat"],
      }),
    };
  },
});

export const {
  useAddResultatMutation,
  useFetchResultatsQuery,
  useDeleteResultatMutation,
  useUpdateResultatMutation,
} = resultatSlice;
