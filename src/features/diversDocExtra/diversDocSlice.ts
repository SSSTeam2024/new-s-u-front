import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DiversDocExtra {
  _id?: string;
  model_id: any,
  extra_data: {
    options: string[],
    data_type: string,
    fieldName: string,
    fieldBody: string
  }[]
}
export const diversDocSlice = createApi({
  reducerPath: "DiversDocExtra",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/divers-doc-extra/`,
  }),
  tagTypes: ["DiversDocExtra"],
  endpoints(builder) {
    return {
      fetchDiversDocExtra: builder.query<DiversDocExtra[], number | void>({
        query() {
          return `get-all-divers-doc-extra`;
        },
        providesTags: ["DiversDocExtra"],
      }),

      createDiversDocExtra: builder.mutation<void, DiversDocExtra>({
        query(payload) {
          return {
            url: "/create-divers-doc-extra",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["DiversDocExtra"],
      }),
      updateDiversDocExtra: builder.mutation<void, DiversDocExtra>({
        query: ({ _id, ...rest }) => ({
          url: `/update-divers-doc-extra/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["DiversDocExtra"],
      }),
      deleteDiversDocExtra: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-divers-doc-extra/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DiversDocExtra"],
      }),
      getDiversDocExtraByModelId: builder.mutation<DiversDocExtra[], number | void>({
        query(_id) {
          return {
            url: `get-divers-doc-extra-by-model-id/${_id}`,
            method: "GET",
          };
        },
        invalidatesTags: ["DiversDocExtra"],
      }),

    };
  },
});

export const {
  useCreateDiversDocExtraMutation,
  useDeleteDiversDocExtraMutation,
  useFetchDiversDocExtraQuery,
  useUpdateDiversDocExtraMutation,
  useGetDiversDocExtraByModelIdMutation
} = diversDocSlice;