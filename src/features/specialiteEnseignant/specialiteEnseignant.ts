import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SpecialiteEnseignant {
  _id: string;
  specialite_fr: string;
  specialite_ar: string;
}
export const specialiteEnseignantSlice = createApi({
  reducerPath: "SpecialiteEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/specialite-enseignant/",
  }),
  tagTypes: ["SpecialiteEnseignant"],
  endpoints(builder) {
    return {
      fetchSpecialitesEnseignant: builder.query<
        SpecialiteEnseignant[],
        number | void
      >({
        query() {
          return `get-all-specialite-enseignant`;
        },
        providesTags: ["SpecialiteEnseignant"],
      }),

      addSpecialiteEnseignant: builder.mutation<void, SpecialiteEnseignant>({
        query(payload) {
          return {
            url: "/create-specialite-enseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["SpecialiteEnseignant"],
      }),
      updateSpecialiteEnseignant: builder.mutation<void, SpecialiteEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-specialite-enseignant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["SpecialiteEnseignant"],
      }),
      deleteSpecialiteEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-specialite-enseignant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["SpecialiteEnseignant"],
      }),
    };
  },
});

export const {
  useFetchSpecialitesEnseignantQuery,
  useAddSpecialiteEnseignantMutation,
  useDeleteSpecialiteEnseignantMutation,
  useUpdateSpecialiteEnseignantMutation,
} = specialiteEnseignantSlice;