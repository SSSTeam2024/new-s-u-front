import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Examen {
  _id: string;
  annee_universitaire: string,
  semestre: string,
  session: string,
  type_examen: string;
  period: string,
  group_enseignant: {
    enseignant: string[],
    date: string
  }[],
  epreuve: {
    group_surveillants: any [],
    date: string
    heure_debut: string
    heure_fin: string
    salle: any
    matiere: any
    classe: any
  }[],
  
}
export const examenSlice = createApi({
  reducerPath: "Examen",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/examen/`,
  }),
  tagTypes: ["Examen"],
  endpoints(builder) {
    return {
      fetchExamens: builder.query<Examen[], number | void>({
        query() {
          return `get-all-examen`;
        },
        providesTags: ["Examen"],
      }),

      addExamen: builder.mutation<void, Examen>({
        query(payload) {
          return {
            url: "/create-examen",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Examen"],
      }),
      updateExamen: builder.mutation<void, Examen>({
        query: ({ _id, ...rest }) => ({
          url: `/update-examen/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Examen"],
      }),
      deleteExamen: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-examen/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Examen"],
      }),
    };
  },
  
});

export const {
   useAddExamenMutation,
   useDeleteExamenMutation,
   useFetchExamensQuery,
   useUpdateExamenMutation,
} = examenSlice;