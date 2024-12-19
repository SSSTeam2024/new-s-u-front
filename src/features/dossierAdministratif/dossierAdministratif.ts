import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface PapierAdministratif {
  _id?: string;
  nom_ar: string;
  nom_fr: string;
  category: string[];
}

export interface Paper {
  papier_administratif: PapierAdministratif;
  annee: string;
  remarques: string; 
  file: string;
  FileExtension:string;
  FileBase64String:string

}

export interface DossierAdministratif {
  _id?: string;
  dossierId?: string;
  papers: Paper[];
  enseignant?: {
    _id: string;
    nom_fr: string;
    nom_ar: string;
    prenom_fr: string;
    prenom_ar: string;
  };
  personnel?: {
    _id: string;
    nom_fr: string;
    nom_ar: string;
    prenom_fr: string;
    prenom_ar: string;
  };
  isArchived?: boolean;
}


export const dossierAdministratifSlice = createApi({
  reducerPath: "DossierAdministratif",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/dossierAdministratif/`,
  }),
  tagTypes: ["DossierAdministratif"],
  endpoints(builder) {
    return {
      addDossierAdministratif: builder.mutation<void, DossierAdministratif>({
        query(payload) {
          return {
            url: "/create-dossier-administratif",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["DossierAdministratif"],
      }),
      fetchDossierAdministratif: builder.query<DossierAdministratif[], number | void>({
        query() {
          return `get-all-dossiers`;
        },
        providesTags: ["DossierAdministratif"],
      }),
      updateDossierAdministratif: builder.mutation<void, DossierAdministratif>({
        query: ({ dossierId, ...rest }) => ({
          url: `/update-dossier`,
          method: "PUT",
          body: { dossierId, ...rest },
        }),
        invalidatesTags: ["DossierAdministratif"],
      }),

      removeSpecificPaper: builder.mutation<void, { dossierId: string; userId: string; userType: string; paperDetails: { paperId: string; annee: string; remarques: string; file: string; } }>({
        query: ({ dossierId, userId, userType, paperDetails }) => ({
          url: `/remove-paper`,
          method: "DELETE",
          body: { dossierId, userId, userType, ...paperDetails },
        }),
        invalidatesTags: ["DossierAdministratif"], // Invalidate to refetch data
      }),
      archiveDossierAdministratif: builder.mutation<void, { dossierId: string }>({
        query: ({ dossierId }) => ({
          url: `/archive-dossier`,
          method: "PUT",
          body: { dossierId },
        }),
        invalidatesTags: ["DossierAdministratif"],
      }),
      restoreDossierAdministratif: builder.mutation<void, { dossierId: string }>({
        query: ({ dossierId }) => ({
          url: `/restore-dossier`,
          method: "PUT",
          body: { dossierId },
        }),
        invalidatesTags: ["DossierAdministratif"],
      }),
      
    };
  },
});

export const {
useAddDossierAdministratifMutation,
useFetchDossierAdministratifQuery,
useUpdateDossierAdministratifMutation,
useRemoveSpecificPaperMutation,
useArchiveDossierAdministratifMutation,
useRestoreDossierAdministratifMutation
} = dossierAdministratifSlice;