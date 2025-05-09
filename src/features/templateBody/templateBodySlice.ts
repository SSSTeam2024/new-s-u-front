import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TemplateBody {
  _id: string;
  title: string;
  doc?: string; // docx file name from db
  fileBase64?: string;
  fileExtension?: string;
  fileName?: string; // original file name from upload
  langue: string;
  intended_for: string;
  has_code: string;
  has_number: string;
}
export const templateBodySlice = createApi({
  reducerPath: 'templateBody',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/template-body/`,
  }),
  tagTypes: ['TemplateBody'],
  endpoints(builder) {
    return {
      fetchTemplateBody: builder.query<TemplateBody[], void>({
        query() {
          return 'get-all-template-body';
        },
        providesTags: ['TemplateBody'],
      }),
      addNewTemplateBody: builder.mutation<void, TemplateBody>({
        query(payload) {
          return {
            url: 'create-template-body',
            method: 'POST',
            body: payload,
          };
        },
        invalidatesTags: ['TemplateBody'],
      }),
      deleteTemplateBody: builder.mutation<void, string>({
        query(_id) {
          return {
            url: `delete-template-body/${_id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["TemplateBody"],
      }),

      updateTemplateBody: builder.mutation<void, { _id: string; data: Partial<TemplateBody> }>({
        query({ _id, data }) {
          return {
            url: `update-template/${_id}`,
            method: "PUT",
            body: data,
          };
        },
        invalidatesTags: ['TemplateBody'], // 🔁 This will refetch the updated data
      }),

    };

  },


});

export const {
  useAddNewTemplateBodyMutation,
  useFetchTemplateBodyQuery,
  useDeleteTemplateBodyMutation,
  useUpdateTemplateBodyMutation
} = templateBodySlice;