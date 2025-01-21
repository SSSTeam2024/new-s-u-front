import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MentionsClasse {
  _id: string;
  name_mention_ar: string;
  name_mention_fr: string;
  abreviation: string;
  domaine: any;
}
export const mentionClasseSlice = createApi({
  reducerPath: "MentionsClasse",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/mention-classe/`,
  }),
  tagTypes: ["MentionsClasse"],
  endpoints(builder) {
    return {
      fetchMentionsClasse: builder.query<MentionsClasse[], number | void>({
        query() {
          return `get-all-mention-classe`;
        },
        providesTags: ["MentionsClasse"],
      }),

      addMentionsClasse: builder.mutation<void, MentionsClasse>({
        query(payload) {
          return {
            url: "/create-mention-classe",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["MentionsClasse"],
      }),
      updateMentionsClasse: builder.mutation<void, MentionsClasse>({
        query: ({ _id, ...rest }) => ({
          url: `/update-mention-classe/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["MentionsClasse"],
      }),
      deleteMentionsClasse: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-mention-classe/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["MentionsClasse"],
      }),
    };
  },
});

export const {
  useAddMentionsClasseMutation,
  useDeleteMentionsClasseMutation,
  useFetchMentionsClasseQuery,
  useUpdateMentionsClasseMutation,
} = mentionClasseSlice;
