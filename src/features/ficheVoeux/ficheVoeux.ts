import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FicheVoeux {
  _id: string;
  fiche_voeux_classes: ClasseFicheVoeux[];
  enseignant: any;
  semestre: string;
  jours: {
    jour: string,
    temps: string
  }[];
}

export interface ClasseFicheVoeux {
  matieres: string[];
  classe: any;
}

export const ficheVoeuxSlice = createApi({
  reducerPath: "FicheVoeux",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/fiche-voeux/`,
  }),
  tagTypes: ["FicheVoeux"],
  endpoints(builder) {
    return {
      fetchFicheVoeuxs: builder.query<FicheVoeux[], number | void>({
        query() {
          return `get-all-fiche-voeux`;
        },
        providesTags: ["FicheVoeux"],
      }),

      addFicheVoeux: builder.mutation<void, FicheVoeux>({
        query(payload) {
          return {
            url: "/create-fiche-voeux",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["FicheVoeux"],
      }),
      updateClasse: builder.mutation<void, FicheVoeux>({
        query: ({ _id, ...rest }) => ({
          url: `/update-classe/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["FicheVoeux"],
      }),
      deleteFicheVoeux: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-fiche-voeux/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FicheVoeux"],
      }),
      fetchClasseById: builder.mutation<void, FicheVoeux>({
        query: ({ _id, ...rest }) => ({
          url: `/get-classe/${_id}`,
          method: "GET",
          body: rest,
        }),
        invalidatesTags: ["FicheVoeux"],
      }),
      updateFicheVoeux: builder.mutation<void, FicheVoeux>({
        query: ({ _id, ...rest }) => ({
          url: `/edit-fiche-voeux`, // Remove the _id from the URL
          method: "PUT",
          body: { _id, ...rest }, // Include _id in the body
        }),
        invalidatesTags: ["FicheVoeux"],
      }),

      //   deleteAssignedMatiereFromClasse: builder.mutation<void, { classeId: string; matiereId: string }>({
      //     query: ({ classeId, matiereId }) => ({
      //       url: `delete-assigned-matiere/${classeId}/${matiereId}`,
      //       method: "DELETE",
      //     }),
      //     invalidatesTags: ["Classe"],
      //   }),
      //   getAssignedMatieres: builder.query<Matiere[], string>({
      //     query: (classeId) => `get-assigned-matieres/${classeId}`,
      //     providesTags: ["Classe"],
      //   }),
    };
  },
});

export const { useAddFicheVoeuxMutation, useFetchFicheVoeuxsQuery, useDeleteFicheVoeuxMutation, useUpdateFicheVoeuxMutation } =
  ficheVoeuxSlice;