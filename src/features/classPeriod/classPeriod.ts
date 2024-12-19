import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ClassePeriod {
  _id?: string;
  date_debut: string;
  date_fin: string;
  semestre: string;
  id_classe: any;
  etat: string;
}

export interface AssignMatieresPayload {
  _id: string;
}
export const classePeriodSlice = createApi({
  reducerPath: "ClassePeriod",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/class-period/`,
  }),
  tagTypes: ["ClassePeriod"],
  endpoints(builder) {
    return {
      fetchClassePeriodsByClassId: builder.query<ClassePeriod[], number | void>(
        {
          query(id) {
            return `get-class-emploi-period/${id}`;
          },
          providesTags: ["ClassePeriod"],
        }
      ),

      addClassePeriod: builder.mutation<void, ClassePeriod>({
        query(payload) {
          return {
            url: "/create-class-emploi-period",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ClassePeriod"],
      }),

      getPeriodByClass: builder.mutation<ClassePeriod[], any>({
        query(payload) {
          return {
            url: "/get-emploi-period-classe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ClassePeriod"],
      }),

      updateClassePeriod: builder.mutation<void, ClassePeriod>({
        query: (payload) => ({
          url: `/update-class-emploi-period`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: ["ClassePeriod"],
      }),
    };
  },
});

export const {
  useAddClassePeriodMutation,
  useFetchClassePeriodsByClassIdQuery,
  useUpdateClassePeriodMutation,
  useGetPeriodByClassMutation,
} = classePeriodSlice;