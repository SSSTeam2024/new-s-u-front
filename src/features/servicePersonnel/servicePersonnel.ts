import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ServicePersonnel {
  _id: string;
  //value: string;
  service_fr: string;
  service_ar: string;
}
export const servicePersonnelSlice = createApi({
  reducerPath: "ServicePersonnel",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/service-personnel/",
  }),
  tagTypes: ["ServicePersonnel"],
  endpoints(builder) {
    return {
      fetchServicesPersonnel: builder.query<ServicePersonnel[], number | void>({
        query() {
          return `get-all-service-personnel`;
        },
        providesTags: ["ServicePersonnel"],
      }),

      addServicePersonnel: builder.mutation<void, ServicePersonnel>({
        query(payload) {
          return {
            url: "/create-service-personnel",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ServicePersonnel"],
      }),
      updateServicePersonnel: builder.mutation<void, ServicePersonnel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-service-personnel/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["ServicePersonnel"],
      }),
      deleteServicePersonnel: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-service-personnel/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ServicePersonnel"],
      }),
    };
  },
});

export const {
  useAddServicePersonnelMutation,
  useDeleteServicePersonnelMutation,
  useFetchServicesPersonnelQuery,
  useUpdateServicePersonnelMutation,
} = servicePersonnelSlice;