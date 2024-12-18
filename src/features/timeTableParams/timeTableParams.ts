import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TimeTableParams {
  _id: any;
  day_start_time: string;
  day_end_time: string;
  daily_pause_start: string;
  daily_pause_end: string;
  semestre1_end: string;
  semestre1_start: string;
  semestre2_end: string;
  semestre2_start: string;
}

export const timeTableParamsSlice = createApi({
  reducerPath: "TimeTableParams",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/timeTableParams/",
  }),
  tagTypes: ["TimeTableParams"],
  endpoints(builder) {
    return {
      fetchTimeTableParams: builder.query<TimeTableParams[], number | void>({
        query() {
          return `/get-time-table-params`;
        },
        providesTags: ["TimeTableParams"],
      }),

      addTimeTableParams: builder.mutation<void, TimeTableParams>({
        query(payload) {
          return {
            url: "/create-time-table-params",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TimeTableParams"],
      }),
      updateTimeTableParams: builder.mutation<void, TimeTableParams>({
        query: ({ ...rest }) => ({
          url: `/update-time-table-params`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["TimeTableParams"],
      }),
    };
  },
});

export const {
  useAddTimeTableParamsMutation,
  useFetchTimeTableParamsQuery,
  useUpdateTimeTableParamsMutation,
} = timeTableParamsSlice;