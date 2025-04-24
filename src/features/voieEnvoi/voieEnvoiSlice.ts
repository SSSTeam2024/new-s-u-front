import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface VoieEnvoiModel {
  _id?: string;
  titre: string;
}
export const voieEnvoiSlice = createApi({
  reducerPath: "voieenvoi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/voie-envoie/`,
  }),
  tagTypes: ["VoieEnvoiModel"],
  endpoints(builder) {
    return {
      fetchAllVoieEnvoi: builder.query<VoieEnvoiModel[], number | void>({
        query() {
          return `get-all-VoieEnvoi`;
        },
        providesTags: ["VoieEnvoiModel"],
      }),

      addVoieEnvoi: builder.mutation<void, VoieEnvoiModel>({
        query(payload) {
          return {
            url: "/create-voie-envoi",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["VoieEnvoiModel"],
      }),
      updateVoieEnvoi: builder.mutation<void, VoieEnvoiModel>({
        query: ({ _id, ...rest }) => ({
          url: `/update-VoieEnvoi/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["VoieEnvoiModel"],
      }),
      deleteVoieEnvoi: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-VoieEnvoi/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["VoieEnvoiModel"],
      }),
    };
  },
});

export const {
  useAddVoieEnvoiMutation,
  useDeleteVoieEnvoiMutation,
  useFetchAllVoieEnvoiQuery,
  useUpdateVoieEnvoiMutation,
} = voieEnvoiSlice;
