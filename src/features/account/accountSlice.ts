import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";

export interface UserResponse {
  user: {
    _id?: string;
    personnelId?: string;
    enseignantId: string;
    login: string;
    service: string;
    password: string;
    api_token: string;
    app_name: string;
    status: string;
    permissions: any[];
  };
}
export interface AddUser {
  _id?: string;
  personnelId: string;
  enseignantId: string;
  login: string;
  service: string;
  password: string;
  app_name: string;
  status: string;
}
export interface LoginRequest {
  login: string;
  password: string;
}
export interface UserToken {
  token: string;
}
export const accountSlice = createApi({
  reducerPath: "account",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/api/user/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.user?.api_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints(builder) {
    return {
      login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/login-user",
          method: "POST",
          body: credentials,
        }),
        invalidatesTags: ["Account"],
      }),
      getUser: builder.mutation<void, UserToken>({
        query(payload) {
          return {
            url: "/get-user-by-token",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Account"],
      }),
      addUser: builder.mutation<AddUser, Partial<AddUser>>({
        query(payload) {
          return {
            url: "/create-user",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Account"],
      }),
      fetchAllUsers: builder.query<any[], void>({
        query: () => ({
          url: `/get-all-users`,
          method: "GET",
        }),
        providesTags: ["Account"],
      }),
      deleteUser: builder.mutation<void, string>({
        query: (_id) => ({
          url: `delete-user/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Account"],
      }),
    };
  },
});

export const {
  useLoginMutation,
  useAddUserMutation,
  useGetUserMutation,
  useFetchAllUsersQuery,
  useDeleteUserMutation,
} = accountSlice;
