import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GradePersonnel {
  _id: string;
  // value_grade_personnel: string;
  grade_fr: string;
  grade_ar: string;
}
export const gradePersonnelSlice = createApi({
  reducerPath: "GradePersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/grade-personnel/`,
  }),
  tagTypes: ["GradePersonnel"],
  endpoints(builder) {
    return {
      fetchGradesPersonnel: builder.query<GradePersonnel[], number | void>({
        query() {
          return `get-all-grades-personnel`;
        },
        providesTags: ["GradePersonnel"],
      }),

      addGradePersonnel: builder.mutation<void, GradePersonnel>({
        query(payload) {
          return {
            url: "/create-grade-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["GradePersonnel"],
      }),
      updateGradePersonnel: builder.mutation<void, GradePersonnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-grade-personnel/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["GradePersonnel"],
      }),
      deleteGradePersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-grade-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GradePersonnel"],
      }),
    };
  },
});

export const {
  useFetchGradesPersonnelQuery,
  useAddGradePersonnelMutation,
  useUpdateGradePersonnelMutation,
  useDeleteGradePersonnelMutation,
} = gradePersonnelSlice;