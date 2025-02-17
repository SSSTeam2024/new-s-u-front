import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DomaineClasse {
  _id: string;
  name_domaine_fr: string;
  name_domaine_ar: string;
  abreviation: string;
}
export const domaineClasseSlice = createApi({
  reducerPath: "DomaineClasse",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/domaine-classe/`,
  }),
  tagTypes: ["DomaineClasse"],
  endpoints(builder) {
    return {
      fetchDomainesClasse: builder.query<DomaineClasse[], number | void>({
        query() {
          return `get-all-domaine-classe`;
        },
        providesTags: ["DomaineClasse"],
      }),
      getDomaineByValue: builder.mutation<
        {
          id: string;
          name_domaine_fr: string;
          name_domaine_ar: string;
          abreviation: string;
        },
        DomaineClasse
      >({
        query(payload) {
          return {
            url: "/get-domaine-by-value",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["DomaineClasse"],
      }),

      addDomaineClasse: builder.mutation<void, DomaineClasse>({
        query(payload) {
          return {
            url: "/create-domaine-classe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["DomaineClasse"],
      }),
      updateDomaineClasse: builder.mutation<void, DomaineClasse>({
        query: ({ _id, ...rest }) => ({
          url: `/update-domaine-classe/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["DomaineClasse"],
      }),
      deleteDomaineClasse: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-domaine-classe/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DomaineClasse"],
      }),
    };
  },
});

export const {
  useAddDomaineClasseMutation,
  useDeleteDomaineClasseMutation,
  useFetchDomainesClasseQuery,
  useUpdateDomaineClasseMutation,
  useGetDomaineByValueMutation,
} = domaineClasseSlice;
