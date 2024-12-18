import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TypeInscriptionEtudiant {
  _id: string;
  value_type_inscription: string;
  type_ar: string;
  type_fr: string;
  files_type_inscription: { name_ar: string; name_fr: string }[];
}
export const typeInscriptionEtudiantSlice = createApi({
  reducerPath: "TypeInscriptionEtudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/type-inscription-etudiant/",
  }),
  tagTypes: ["TypeInscriptionEtudiant"],
  endpoints(builder) {
    return {
      fetchTypeInscriptionsEtudiant: builder.query<TypeInscriptionEtudiant[], number | void>({
        query() {
          return `get-all-type-inscription-etudiant`;
        },
        providesTags: ["TypeInscriptionEtudiant"],
      }),

      addTypeInscriptionEtudiant: builder.mutation<void, TypeInscriptionEtudiant>({
        query(payload) {
          return {
            url: "/create-type-inscription-etudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["TypeInscriptionEtudiant"],
      }),
      updateTypeInscriptionEtudiant: builder.mutation<void, TypeInscriptionEtudiant>({
        query: ({ _id, ...rest }) => ({
          url: `/update-type-inscription-etudiant/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["TypeInscriptionEtudiant"],
      }),
      deleteTypeInscriptionEtudiant: builder.mutation<void, string>({
        query: (_id) => ({
          url: `/delete-type-inscription-etudiant/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TypeInscriptionEtudiant"],
      }),
    };
  },
});

export const {
useAddTypeInscriptionEtudiantMutation,
useDeleteTypeInscriptionEtudiantMutation,
useFetchTypeInscriptionsEtudiantQuery,
useUpdateTypeInscriptionEtudiantMutation
} = typeInscriptionEtudiantSlice;