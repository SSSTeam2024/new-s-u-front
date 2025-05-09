import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TeacherPeriod {
  _id?: string;
  semestre: string;
  nbr_heure: string;
  id_classe_period: any;
  id_teacher: any;
}

export interface Payload {
  ids_array: string[];
  semestre: string;
}
export const teachersPeriodsSlice = createApi({
  reducerPath: "TeacherPeriod",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/teacher-period/`,
  }),
  tagTypes: ["TeacherPeriod"],
  endpoints(builder) {
    return {
      getTeacherPeriodsByTeacherId: builder.mutation<void, any>({
        query(payload) {
          return {
            url: "/get-teacher-periods",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TeacherPeriod"],
      }),
      getTeachersPeriods: builder.mutation<void, Payload>({
        query(payload) {
          return {
            url: "/get-teachers-periods",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TeacherPeriod"],
      }),
      getAllTeachersPeriods: builder.query<
        TeacherPeriod[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `/get-all-periods`,
            method: "GET",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["TeacherPeriod"],
      }),
      getTeacherPeriodsBySemesterAndIdTeacherV2: builder.mutation<any, any>({
        query(payload) {
          return {
            url: "/periods",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TeacherPeriod"],
      }),

      getTeacherPeriodsBySemesterAndIdTeacher: builder.query<any, any>({
        query: (payload) => ({
          url: `/periods`,
          body: payload,
          method: "POST",
        }),
        providesTags: ["TeacherPeriod"],
      }),
      deleteManyPeriods: builder.mutation<
        TeacherPeriod,
        { ids: string[]; useNewDb?: boolean }
      >({
        query({ ids, useNewDb }) {
          return {
            url: `delete-many`,
            method: "DELETE",
            body: { ids },
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": String(useNewDb) }
                : undefined,
          };
        },
        invalidatesTags: ["TeacherPeriod"],
      }),
    };
  },
});

export const {
  useGetTeachersPeriodsMutation,
  useGetTeacherPeriodsByTeacherIdMutation,
  useGetTeacherPeriodsBySemesterAndIdTeacherV2Mutation,
  useGetTeacherPeriodsBySemesterAndIdTeacherQuery,
  useGetAllTeachersPeriodsQuery,
  useDeleteManyPeriodsMutation,
} = teachersPeriodsSlice;
