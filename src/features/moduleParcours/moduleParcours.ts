import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ModuleParcours {
  _id?: string;
  semestre: string;
  code_Ue: string;
  libelle: string;
  credit: string;
  coef: string;
  nature: string;
  regime: string;
  parcours: string;
  matiere?: [string];
}

export const moduleParcoursSlice = createApi({
  reducerPath: "ModuleParcours",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/module-parcours/`,
  }),
  tagTypes: ["ModuleParcours"],
  endpoints(builder) {
    return {
      fetchModulesParcours: builder.query<ModuleParcours[], number | void>({
        query() {
          return `get-all-module-parcours`;
        },
        providesTags: ["ModuleParcours"],
      }),

      addModuleParcours: builder.mutation<ModuleParcours, ModuleParcours>({
        query(payload) {
          return {
            url: "/create-module-parcours",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ModuleParcours"],
      }),
      getModuleParcoursByCode: builder.mutation<
        { id: string; code_Ue: string },
        ModuleParcours
      >({
        query(payload) {
          return {
            url: "/get-module-by-code",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ModuleParcours"],
      }),
      updateModuleParcours: builder.mutation<void, ModuleParcours>({
        query: ({ _id, ...rest }) => ({
          url: `/update-module-parcours/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["ModuleParcours"],
      }),
      deleteModuleParcours: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-module-parcours/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ModuleParcours"],
      }),
    };
  },
});

export const {
  useAddModuleParcoursMutation,
  useDeleteModuleParcoursMutation,
  useFetchModulesParcoursQuery,
  useUpdateModuleParcoursMutation,
  useGetModuleParcoursByCodeMutation,
} = moduleParcoursSlice;
