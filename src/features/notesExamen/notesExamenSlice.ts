import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NoteExamen {
  _id?: string;
  enseignant: string;
  semestre: string;
  groupe: string;
  matiere: string;
  type_examen: string;
  etudiants?: {
    etudiant: string;
    note: string;
  }[];
  completed: string;
}

export const notesExamenSlice = createApi({
  reducerPath: "NotesExamen",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/notes/`,
  }),
  tagTypes: ["NoteExamen"],
  endpoints(builder) {
    return {
      fetchNotesExamen: builder.query<
        NoteExamen[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-notes`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["NoteExamen"],
      }),
      addNewNoteExamen: builder.mutation<void, NoteExamen>({
        query(payload) {
          return {
            url: "/create-note-examen",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["NoteExamen"],
      }),
      updateNoteExamen: builder.mutation<
        NoteExamen,
        { id: string; updateData: any }
      >({
        query: ({ id, updateData }) => ({
          url: `update-note-examen/${id}`,
          method: "PATCH",
          body: updateData,
        }),
        invalidatesTags: ["NoteExamen"],
      }),
      deleteManyNoteExamen: builder.mutation<
        NoteExamen,
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
        invalidatesTags: ["NoteExamen"],
      }),
    };
  },
});

export const {
  useAddNewNoteExamenMutation,
  useFetchNotesExamenQuery,
  useUpdateNoteExamenMutation,
  useDeleteManyNoteExamenMutation,
} = notesExamenSlice;
