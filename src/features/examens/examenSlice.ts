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
    date: string[]
  }[],
  epreuve: {
    _id?: string,
    group_surveillants: any [],
    group_responsables?: any[],
    nbr_copie?: string,
    date: string
    heure_debut: string
    heure_fin: string
    salle: any
    matiere: any
    classe: any
    epreuveStatus?: string
    nbrePresent?: string
  nbreAbsent?: string
  nbreExclus?: string
  epreuveNotes?: string
  }[],
}

export interface GetExamenByRegime {
    semester: string,
    regime: string
}

export interface DataToEditExamsEpreuve {
  id_Calendrier?: string
  epreuveId?: string
  epreuve_status?: string
  nbre_present?: string
  nbre_absent?: string
  nbre_exclus?: string
  notes?: string
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
      fetchExamenById: builder.query<Examen, number | void>({
        query: (_id) => ({
          url: `get-examen/${_id}`,
          method: "GET",
        }),
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
      ModifierExamenEpreuve: builder.mutation<void, DataToEditExamsEpreuve>({
        query(payload) {
          return {
            url: "/EpeditreuveData",
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
      getExamenByRegime: builder.mutation<void, GetExamenByRegime>({
        query(payload) {
            return{
                url: `get-examen-by-regime-semestre`,
                method: "POST",
                body: payload
            }
        },
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
   useGetExamenByRegimeMutation,
   useFetchExamenByIdQuery,
   useModifierExamenEpreuveMutation
} = examenSlice;