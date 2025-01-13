import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VirtualService {
  _id?: string;
  title: string;
}
export const virtualServiceSlice = createApi({
  reducerPath: "virtualServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/virtual-service/`,
  }),
  tagTypes: ["VirtualService"],
  endpoints(builder) {
    return {
      fetchVirtualServices: builder.query<VirtualService[], void>({
        query() {
          return "get-all-virtual-services";
        },
        providesTags: ["VirtualService"],
      }),
      fetchVirtualServiceById: builder.query<VirtualService, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-virtual-service",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["VirtualService"],
      }),
      addVirtualService: builder.mutation<void, Partial<VirtualService>>({
        query(virtualService) {
          return {
            url: "add-virtual-service",
            method: "POST",
            body: virtualService,
          };
        },
        invalidatesTags: ["VirtualService"],
      }),
      updateVirtualService: builder.mutation<void, VirtualService>({
        query(virtualService) {
          return {
            url: `edit-virtual-service`,
            method: "PUT",
            body: virtualService,
          };
        },
        invalidatesTags: ["VirtualService"],
      }),
      deleteVirtualService: builder.mutation<VirtualService, { _id: string }>({
        query(_id) {
          return {
            url: `delete-virtual-service`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["VirtualService"],
      }),
    };
  },
});

export const {
  useFetchVirtualServicesQuery,
  useFetchVirtualServiceByIdQuery,
  useAddVirtualServiceMutation,
  useUpdateVirtualServiceMutation,
  useDeleteVirtualServiceMutation,
} = virtualServiceSlice;
