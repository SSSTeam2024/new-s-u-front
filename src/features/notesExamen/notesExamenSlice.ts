import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface NoteExamen {
  _id?: string;
  enseignant: string,
  semestre: string,
  groupe: string,
  matiere: string,
  type_examen: string,
  etudiants?: {
    etudiant: string,
    note: string
  }[],
  completed: string
}

export const notesExamenSlice = createApi({
  reducerPath: "NotesExamen",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/notes/`,
  }),
  tagTypes: ["NoteExamen"],
  endpoints(builder) {
    return {
      fetchNotesExamen: builder.query<NoteExamen[], number | void>({
        query() {
          return `get-all-notes`;
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
      updateNoteExamen: builder.mutation<NoteExamen, { id: string; updateData: any }>({
        query: ({ id, updateData }) => ({
          url: `update-note-examen/${id}`,
          method: 'PATCH',
          body: updateData,
        }),
        invalidatesTags: ['NoteExamen'],
      }),
    };
  },
  
});

export const {
   useAddNewNoteExamenMutation,
   useFetchNotesExamenQuery,
   useUpdateNoteExamenMutation
} = notesExamenSlice;