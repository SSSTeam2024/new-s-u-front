import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NotesPro {
  _id?: string;
  personnel: any;
  note1: string;
  note2: string;
  note3: string;
  note4: string;
  note5: string;
  note_finale: string;
  annee: string;
  observation: string;
}
export const notesProSlice = createApi({
  reducerPath: "notesProApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/note-pro/`,
  }),
  tagTypes: ["NotesPro"],
  endpoints(builder) {
    return {
      fetchNotesPro: builder.query<NotesPro[], { useNewDb?: string } | void>({
        query(useNewDb) {
          return {
            url: `get-all-notes-pro`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["NotesPro"],
      }),
      fetchNotesProById: builder.query<NotesPro, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-note-pro",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["NotesPro"],
      }),
      getNotesProByYear: builder.mutation<void, any>({
        query(reqBody) {
          return {
            url: "get-note-pro-by-year",
            method: "POST",
            body: reqBody,
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
      addNotesPro: builder.mutation<void, any>({
        query(notesProArray) {
          return {
            url: "add-note-pro",
            method: "POST",
            body: notesProArray,
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
      updateNotesPro: builder.mutation<void, NotesPro>({
        query(notesProArray) {
          return {
            url: `edit-note-pro`,
            method: "PUT",
            body: notesProArray,
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
      deleteNotesPro: builder.mutation<NotesPro, { _id: string }>({
        query(_id) {
          return {
            url: `delete-note-pro`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
      deleteManyNotesPro: builder.mutation<
        NotesPro,
        { ids: string[]; useNewDb?: boolean }
      >({
        query({ ids, useNewDb }) {
          return {
            url: `delete-many`,
            method: "DELETE",
            body: { ids },
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": String(useNewDb) }
                : undefined,
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
    };
  },
});

export const {
  useFetchNotesProQuery,
  useFetchNotesProByIdQuery,
  useAddNotesProMutation,
  useUpdateNotesProMutation,
  useDeleteNotesProMutation,
  useGetNotesProByYearMutation,
  useDeleteManyNotesProMutation,
} = notesProSlice;
