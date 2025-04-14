import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AbsencePersonnel {
  _id?: string;
  jour: string;
  personnels: {
    personnel: string;
    autorisation: string;
    evening: string;
    morning: string;
    fullDay: string;
    duree: string;
    en_conge: string
  }[];
  added_by?: string;
}

export const absencePersonnelSlice = createApi({
  reducerPath: "absencepersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/absence/`,
  }),
  tagTypes: ["AbsencePersonnel"],
  endpoints(builder) {
    return {
      fetchAbsencePersonnels: builder.query<AbsencePersonnel[], number | void>({
        query() {
          return `get-all-absence-personnel`;
        },
        providesTags: ["AbsencePersonnel"],
      }),
      addAbsencePersonnel: builder.mutation<void, AbsencePersonnel>({
        query(payload) {
          return {
            url: "/add-absence-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["AbsencePersonnel"],
      }),

      deleteAbsence: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-absence-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AbsencePersonnel"],
      }),
        updateAbsence: builder.mutation<void, AbsencePersonnel>({
          query: ({ _id, ...rest }) => ({
            url: `/edit-absence-personnel/${_id}`,
            method: "PUT",
            body: rest,
          }),
          invalidatesTags: ["AbsencePersonnel"],
        }),
    };
  },
});

export const {
  useAddAbsencePersonnelMutation,
  useFetchAbsencePersonnelsQuery,
  useDeleteAbsenceMutation,
  useUpdateAbsenceMutation
} = absencePersonnelSlice;
