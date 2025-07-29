import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Etudiant } from "features/etudiant/etudiantSlice";

export interface Encadrement {
  _id?: string;
  enseignant?: string;
  etudiant?: string;
  stage?: string;
  seance?: string;
  avancement?: string;
  remarque?: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  mode: "Présentiel" | "En ligne";
  createdAt?: string;
}

// export interface GroupedEncadrements {
//   etudiant: {
//     _id: string;
//     nom: string;
//     prenom: string;
//     groupe_classe: { nom: string };
//   };
//   encadrements: Encadrement[];
// }
// export interface EtudiantGrouped {
//   _id: string;
//   nom: string;
//   prenom: string;
//   groupe_classe: {
//     _id?: string;
//     nom: string;
//   };
// }

export interface StagePfeGrouped {
  _id: string;
  sujet: string;
  societe?: string;
  encadrant_univ1?: string; // or Enseignant if populated
  encadrant_univ2?: string;
  date_debut?: string;
  date_fin?: string;
  date_soutenance?: string;
  salle?: string;
  // ...add more if needed
}

export interface GroupedEncadrements {
  etudiant: Etudiant;
  stage?: StagePfeGrouped;
  encadrements: Encadrement[];
}

export const encadrementSlice = createApi({
  reducerPath: "encadrementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/encadrement/`,
  }),
  tagTypes: ["Encadrement"],
  endpoints(builder) {
    return {
      // Get all encadrements
      fetchEncadrements: builder.query<Encadrement[], { useNewDb?: string } | void>({
        query(useNewDb) {
          return {
            url: "get-all-encadrements",
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Encadrement"],
      }),

      // Get by ID
      fetchEncadrementById: builder.query<Encadrement, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-encadrement",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Encadrement"],
      }),

      // Get by enseignant (grouped by student)
      fetchGroupedByEnseignant: builder.query<GroupedEncadrements[], { enseignantId: string }>({
        query({ enseignantId }) {
          return {
            url: `by-enseignant`,
            method: "POST",
            body: { enseignantId },
          };
        },
        providesTags: ["Encadrement"],
      }),

      // Create
      addEncadrement: builder.mutation<void, Partial<Encadrement>>({
        query(encadrement) {
          return {
            url: "create",
            method: "POST",
            body: encadrement,
          };
        },
        invalidatesTags: ["Encadrement"],
      }),

      // Update
      updateEncadrement: builder.mutation<void, Encadrement>({
        query(encadrement) {
          return {
            url: `edit-encadrement`,
            method: "PUT",
            body: encadrement,
          };
        },
        invalidatesTags: ["Encadrement"],
      }),

      // Delete one
      deleteEncadrement: builder.mutation<Encadrement, { _id: string }>({
        query(_id) {
          return {
            url: `delete-encadrement`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["Encadrement"],
      }),

      // Delete multiple
      deleteManyEncadrements: builder.mutation<
        Encadrement,
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
        invalidatesTags: ["Encadrement"],
      }),
    };
  },
});

export const {
  useFetchEncadrementsQuery,
  useFetchEncadrementByIdQuery,
  useFetchGroupedByEnseignantQuery,
  useAddEncadrementMutation,
  useUpdateEncadrementMutation,
  useDeleteEncadrementMutation,
  useDeleteManyEncadrementsMutation,
} = encadrementSlice;
