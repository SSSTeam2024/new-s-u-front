import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Enseignant } from "features/enseignant/enseignantSlice";
import { Etudiant } from "features/etudiant/etudiantSlice";
import { Personnel } from "features/personnel/personnelSlice";
import { TemplateBody } from "features/templateBody/templateBodySlice";

export interface GeneratedDoc {
  _id: string;
  personnel: Personnel;
  etudiant: Etudiant;
  enseignant: Enseignant;
  model: TemplateBody;
  body: string;
  date_generation: string;
  num_ordre: string;
  num_qr_code: string;
}

export const generatedDocSlice = createApi({
  reducerPath: "GeneratedDoc",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/generated-doc/`,
  }),
  tagTypes: ["GeneratedDoc"],
  endpoints(builder) {
    return {
      // fetchClasses: builder.query<Classe[], number | void>({
      //   query() {
      //     return `get-all-classe`;
      //   },
      //   providesTags: ["Classe"],
      // }),

      saveGeneratedDoc: builder.mutation<void, GeneratedDoc>({
        query(payload) {
          return {
            url: "save-generated-doc",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["GeneratedDoc"],
      }),

      getGeneratedDocNextNumberByModelId: builder.query<any, string | void>({
        query: (_id) => ({
          url: `/get-generated-doc-next-number/${_id}`,
          method: "GET",
        }),
        providesTags: ["GeneratedDoc"],
      }),

      // updateClasse: builder.mutation<void, Classe>({
      //   query: ({ _id, ...rest }) => ({
      //     url: `/update-classe/${_id}`,
      //     method: "PUT",
      //     body: rest,
      //   }),
      //   invalidatesTags: ["Classe"],
      // }),

      // deleteClasse: builder.mutation<void, string>({
      //   query: (_id) => ({
      //     url: `delete-classe/${_id}`,
      //     method: "DELETE",
      //   }),
      //   invalidatesTags: ["Classe"],
      // }),
    };
  },
});

export const {
  useSaveGeneratedDocMutation,
  useGetGeneratedDocNextNumberByModelIdQuery,
  // useFetchClassesQuery, 
  // useDeleteClasseMutation,
  // useUpdateClasseMutation,
} = generatedDocSlice;