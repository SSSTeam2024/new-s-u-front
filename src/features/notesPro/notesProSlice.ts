import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NotesPro {
  _id: string;
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
      fetchNotesPro: builder.query<NotesPro, void>({
        query() {
          return "get-all-notes-pro";
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
      addNotesPro: builder.mutation<void, Partial<NotesPro>>({
        query(deplacement) {
          return {
            url: "add-note-pro",
            method: "POST",
            body: deplacement,
          };
        },
        invalidatesTags: ["NotesPro"],
      }),
      updateNotesPro: builder.mutation<void, NotesPro>({
        query(deplacement) {
          return {
            url: `edit-note-pro`,
            method: "PUT",
            body: deplacement,
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
    };
  },
});

export const {
  useFetchNotesProQuery,
  useFetchNotesProByIdQuery,
  useAddNotesProMutation,
  useUpdateNotesProMutation,
  useDeleteNotesProMutation,
} = notesProSlice;
