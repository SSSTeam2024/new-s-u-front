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
      // fetchClassePeriodsByClassId: builder.query<
      //   TeacherPeriod[],
      //   number | void
      // >({
      //   query(id) {
      //     return `create-teacher-period/${id}`;
      //   },
      //   providesTags: ["TeacherPeriod"],
      // }),

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
      // getTeacherPeriodsBySemesterAndIdTeacher: builder.mutation<void, any>({
      //   query(payload) {
      //     return {
      //       url: "/periods",
      //       method: "POST",
      //       body: payload,
      //     };
      //   },
      //   invalidatesTags: ["TeacherPeriod"],
      // }),

      getTeacherPeriodsBySemesterAndIdTeacher: builder.query<any, any>({
        query: (payload) => ({
          url: `/periods`,
          body: payload,
          method: "POST",
        }),
        providesTags: ["TeacherPeriod"],
      }),
      // updateClassePeriod: builder.mutation<void, TeacherPeriod>({
      //   query: (payload) => ({
      //     url: `/update-class-emploi-period`,
      //     method: "PUT",
      //     body: payload,
      //   }),
      //   invalidatesTags: ["TeacherPeriod"],
      // }),
    };
  },
});

export const {
  useGetTeachersPeriodsMutation,
  useGetTeacherPeriodsByTeacherIdMutation,
  // useGetTeacherPeriodsBySemesterAndIdTeacherMutation,
  useGetTeacherPeriodsBySemesterAndIdTeacherQuery,
} = teachersPeriodsSlice;