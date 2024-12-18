import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Permission {
  _id: string;
  name: string;
  path: string;
  section: string;
  sub_section:string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  login: string;
  role_id: string;
  departement_id: string;
  password: string;
  api_token: string;
  photo: string;
  app_name: string;
  status: string;
  permissions: Permission[];
}
export interface UserPermissionHistoryItem {
  _id: string;
  user_id: string;
  permissions: Permission[];
  assigned_at: string;
  removed_at: string;
  __v: number;
}


export const permissionSlice = createApi({
  reducerPath: "permissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/user-permissions/`,
  }),
  tagTypes: ["Permissions", "UserPermissions"],
  endpoints: (builder) => ({
    // Add permission
    addPermission: builder.mutation<Permission, Partial<Permission>>({
      query: (permission) => ({
        url: `/add-permission`,
        method: "POST",
        body: permission,
      }),
      invalidatesTags: ["Permissions"],
    }),
    // Fetch all permissions
    fetchAllPermissions: builder.query<Permission[], void>({
      query: () => ({
        url: `/get-permissions`,
        method: "GET",
      }),
      providesTags: ["Permissions"],
    }),
    // Assign permissions to a user
    assignUserPermissions: builder.mutation<void, { userId: string; permissionIds: string[] }>({
      query: ({ userId, permissionIds }) => ({
        url: `/assign-user-permissions`,
        method: "POST",
        body: { userId,permissionIds },
      }),
      invalidatesTags: ["UserPermissions"],
    }),
    //updtae permissions to user 
    updateUserPermissions: builder.mutation<void, { userId: string; permissionIds: string[] }>({
      query: ({ userId, permissionIds }) => ({
        url: `/update-permissions`,
        method: "PUT",
        body: { userId,permissionIds },
      }),
      invalidatesTags: ["UserPermissions"],
    }),
     //updtae permissions to user History
     updateUserPermissionsHistory: builder.mutation<void, { userId: string; permissionIds: string[] }>({
      query: ({ userId, permissionIds }) => ({
        url: `/update-permissions-history`,
        method: "PUT",
        body: { userId,permissionIds },
      }),
      invalidatesTags: ["UserPermissions"],
    }),
    // Fetch permissions by user ID
    fetchUserPermissionsByUserId: builder.query<Permission[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/${userId}/permissions`,
        method: "GET",
      }),
      providesTags: ["UserPermissions"],
    }),
// fetch permissions history by user id 
 // Fetch permissions history by user id 
 fetchUserPermissionsHistoryByUserId: builder.query<UserPermissionHistoryItem[], { userId: string }>({
  query: ({ userId }) => ({
    url: `/${userId}/permissions-history`,
    method: "GET",
  }),
  providesTags: ["UserPermissions"],
}),
    deleteUserPermissions: builder.mutation<void, {userId:string ; permissionIds: string[] }>({
      query(payload) {
        return {
          url: "/delete-user-permissions",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["UserPermissions"]
    })
    
  }),
});


export const {
  useAddPermissionMutation,
  useFetchAllPermissionsQuery,
  useAssignUserPermissionsMutation,
  useFetchUserPermissionsByUserIdQuery,
  useDeleteUserPermissionsMutation,
  useUpdateUserPermissionsMutation,
  useUpdateUserPermissionsHistoryMutation,
  useFetchUserPermissionsHistoryByUserIdQuery
} = permissionSlice;