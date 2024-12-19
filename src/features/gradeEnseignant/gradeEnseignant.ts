import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GradeEnseignant {
  _id: string;
  //value_grade_enseignant: string;
  grade_fr: string;
  grade_ar: string;
  charge_horaire: {
    annualMinHE: string;
    annualMaxHE: string;

    s1MinHE: string;
    s1MaxHE: string;

    s2MinHE: string;
    s2MaxHE: string;

    annualMinHS: string;
    annualMaxHS: string;

    s1MinHS: string;
    s1MaxHS: string;

    s2MinHS: string;
    s2MaxHS: string;

    annualMinHX: string;
    annualMaxHX: string;

    s1MinHX: string;
    s1MaxHX: string;

    s2MinHX: string;
    s2MaxHX: string;

    totalAnnualMin: string;
    totalAnnualMax: string;

    totalS1Min: string;
    totalS1Max: string;

    totalS2Min: string;
    totalS2Max: string;
  };
}

export const gradeEnseignantSlice = createApi({
  reducerPath: "GradeEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/grade-enseignant/`,
  }),
  tagTypes: ["GradeEnseignant"],
  endpoints(builder) {
    return {
      fetchGradesEnseignant: builder.query<GradeEnseignant[], number | void>({
        query() {
          return `get-all-grade-enseignant`;
        },
        providesTags: ["GradeEnseignant"],
      }),

      addGradeEnseignant: builder.mutation<void, GradeEnseignant>({
        query(payload) {
          return {
            url: "/create-grade-enseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["GradeEnseignant"],
      }),
      updateGradeEnseignant: builder.mutation<void, GradeEnseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-grade-enseignant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["GradeEnseignant"],
      }),
      deleteGradeEnseignant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-grade-enseignant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GradeEnseignant"],
      }),
    };
  },
});

export const {
  useAddGradeEnseignantMutation,
  useDeleteGradeEnseignantMutation,
  useFetchGradesEnseignantQuery,
  useUpdateGradeEnseignantMutation,
} = gradeEnseignantSlice;