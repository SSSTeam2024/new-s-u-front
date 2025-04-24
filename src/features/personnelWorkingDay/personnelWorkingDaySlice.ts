import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PersonnelWorkingDay {
  _id?: any;
  name: any;
  day_start_time: string;
  day_end_time: string;
  daily_pause_start: string;
  daily_pause_end: string;
  period_start: string;
  period_end: string;
  part_time: string
}

export const personnelWorkingDaySlice = createApi({
  reducerPath: "PersonnelWorkingDay",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/personnelWorkingDay/`,
  }),
  tagTypes: ["PersonnelWorkingDay"],
  endpoints(builder) {
    return {
      fetchPersonnelWorkingDay: builder.query<PersonnelWorkingDay[], number | void>({
        query() {
          return `/get-personnel-working-day-params`;
        },
        providesTags: ["PersonnelWorkingDay"],
      }),

      addPersonnelWorkingDay: builder.mutation<void, PersonnelWorkingDay>({
        query(payload) {
          return {
            url: "/create-personnel-working-day-params",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["PersonnelWorkingDay"],
      }),
      updatePersonnelWorkingDay: builder.mutation<void, PersonnelWorkingDay>({
                query: ({ _id, ...rest }) => ({
                  url: `/update-personnel-working-day/${_id}`,
                  method: "PUT",
                  body: rest,
                }),
                invalidatesTags: ["PersonnelWorkingDay"],
              }),
      deletePersonnelWorkingDay: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-personnel-working-day-params/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PersonnelWorkingDay"],
      }),
    };
  },
});

export const {
  useAddPersonnelWorkingDayMutation,
  useFetchPersonnelWorkingDayQuery,
  useUpdatePersonnelWorkingDayMutation,
  useDeletePersonnelWorkingDayMutation
} = personnelWorkingDaySlice;