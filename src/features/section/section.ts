import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Section {
  _id: string;
  name_section_fr: string,
  name_section_ar: string,
  abreviation: string,
  departements: string[]
}
export const sectionSlice = createApi({
  reducerPath: "Section",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/section-classe/`,
  }),
  tagTypes: ["Section"],
  endpoints(builder) {
    return {
      fetchSections: builder.query<Section[], number | void>({
        query() {
          return `get-all-section-classe`;
        },
        providesTags: ["Section"],
      }),

      addSection: builder.mutation<void, Section>({
        query(payload) {
          return {
            url: "/create-section-classe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Section"],
      }),
      updateSection: builder.mutation<void, Section>({
        query: ({ _id, ...rest }) => ({
          url: `/update-section-classe/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Section"],
      }),
      deleteSection: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-section-classe/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Section"],
      }),
    };
  },
});

export const {
 useAddSectionMutation,
 useDeleteSectionMutation,
 useFetchSectionsQuery,
 useUpdateSectionMutation
} = sectionSlice;