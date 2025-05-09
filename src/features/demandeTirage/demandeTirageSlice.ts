import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DemandeTirage {
  _id?: string;
  classes: string[];
  enseignant: string;
  matiere: string;
  file_document?: string;
  docFileBase64String?: string;
  docFileExtension?: string;
  titre: string;
  nbr_page: string;
  recto_verso: string;
  nbr_copies: string;
  format: string;
  date_envoi_demande: string;
  heure_envoi_demande: string;
  date_limite: string;
  heure_limite: string;
  date_recuperation: string;
  heure_recuperation: string;
  date_impression: string;
  heure_impression: string;
  etat: string;
  semestre: string;
  added_by?: string;
  couleur: string;
  note: string;
  createdAt?: string;
}

export const demandeTirageSlice = createApi({
  reducerPath: "DemandeTirage",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/demande-tirage/`,
  }),
  tagTypes: ["DemandeTirage"],
  endpoints(builder) {
    return {
      fetchDemandeTirages: builder.query<
        DemandeTirage[],
        { useNewDb?: string } | void
      >({
        query(useNewDb) {
          return {
            url: `get-all-demandes-tirage`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["DemandeTirage"],
      }),
      addDemandeTirage: builder.mutation<void, DemandeTirage>({
        query(payload) {
          return {
            url: "/create-demande-tirage",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["DemandeTirage"],
      }),
      deleteManyDemandesTirages: builder.mutation<
        DemandeTirage,
        { ids: string[]; useNewDb: boolean }
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
        invalidatesTags: ["DemandeTirage"],
      }),
    };
  },
});

export const {
  useAddDemandeTirageMutation,
  useFetchDemandeTiragesQuery,
  useDeleteManyDemandesTiragesMutation,
} = demandeTirageSlice;
