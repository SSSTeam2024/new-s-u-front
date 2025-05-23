import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Mission {
  _id: string;
  motif: string;
  enseignant: string;
  personnel: string;
  date_affectation: string;
  date_fin: string;
  objectif: string;
  etat: string;
  createdAt?: string;
}
export const missionSlice = createApi({
  reducerPath: "missionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/mission/`,
  }),
  tagTypes: ["Mission"],
  endpoints(builder) {
    return {
      fetchMission: builder.query<Mission[], { useNewDb?: string } | void>({
        query(useNewDb) {
          return {
            url: `get-all-missions`,
            headers:
              useNewDb !== undefined
                ? { "x-use-new-db": useNewDb.useNewDb }
                : undefined,
          };
        },
        providesTags: ["Mission"],
      }),
      fetchMissionById: builder.query<Mission, { _id: string }>({
        query({ _id }) {
          return {
            url: "get-mission",
            method: "POST",
            body: { _id },
          };
        },
        providesTags: ["Mission"],
      }),
      addMission: builder.mutation<void, Partial<Mission>>({
        query(misson) {
          return {
            url: "add-mission",
            method: "POST",
            body: misson,
          };
        },
        invalidatesTags: ["Mission"],
      }),
      updateMission: builder.mutation<void, Mission>({
        query(misson) {
          return {
            url: `edit-mission`,
            method: "PUT",
            body: misson,
          };
        },
        invalidatesTags: ["Mission"],
      }),
      deleteMission: builder.mutation<Mission, { _id: string }>({
        query(_id) {
          return {
            url: `delete-mission`,
            method: "DELETE",
            body: { _id },
          };
        },
        invalidatesTags: ["Mission"],
      }),
      deleteManyMissions: builder.mutation<
        Mission,
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
        invalidatesTags: ["Mission"],
      }),
    };
  },
});

export const {
  useFetchMissionQuery,
  useFetchMissionByIdQuery,
  useAddMissionMutation,
  useUpdateMissionMutation,
  useDeleteMissionMutation,
  useDeleteManyMissionsMutation,
} = missionSlice;
