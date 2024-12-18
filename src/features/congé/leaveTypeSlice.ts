import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LeaveSubcategory {
  _id?: string;
  name_fr: string;
   name_ar: string;
  maxDays?: number;
  sexe: 'Homme' | 'Femme' | 'Both';
  Accumulable?: boolean;
  GradePersonnel: string[]
}

export interface LeaveType {
 
  _id: string;
  category: string;
  name_fr: string;
  name_ar: string;
  description?: string;
  maxDays?: number;
  Accumulable: boolean;
  sexe: 'Homme' | 'Femme' | 'Both';
  subcategories?: LeaveSubcategory[];
}


export type UpdateLeaveTypePayload = {
  leaveTypeId: string;
} & Partial<LeaveType>;


  export const leaveTypeSlice = createApi({
    reducerPath: 'leaveTypeApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/LeaveType/`, // Adjust endpoint base URL
    }),
    tagTypes: ['leaveTypes'],
    endpoints(builder) {
      return {
        fetchLeaveType: builder.query<LeaveType[], void>({
          query() {
            return 'get-all-leave-types';
          },
          providesTags: ['leaveTypes'],
        }),
        fetchLeaveTypeById: builder.query<LeaveType, { _id: string }>({
          query({ _id }) {
            return {
              url: 'get-leave-type-by-id',
              method: 'POST',
              body: { _id },
            };
          },
          providesTags: ['leaveTypes'],
        }),
        addLeaveType: builder.mutation<void, Partial<LeaveType>>({
          query(leaveType) {
            return {
              url: 'add-leave-type',
              method: 'POST',
              body: leaveType,
            };
          },
          invalidatesTags: ['leaveTypes'],
        }),
        updateLeaveType: builder.mutation<void, Partial<LeaveType>>({
          query(leaveType) {
          
            return {
              url: `edit-leave-type`,
              method: 'PUT',
              body: leaveType,
            };
          },
          invalidatesTags: ['leaveTypes'],
        }),
        deleteLeaveType: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-leave-type/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['leaveTypes'],
        }),
        fetchLeaveSubcategoryById: builder.query<LeaveSubcategory, void>({
          query(_id) {
            return {
              url: 'subcategory',
              method: 'POST',
              body: _id,
            };
          },
          providesTags: ['leaveTypes'],
        }),
      };
    },
  });
  
  export const {
    useFetchLeaveTypeQuery,
    useFetchLeaveTypeByIdQuery,
    useAddLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
    useDeleteLeaveTypeMutation,
    useFetchLeaveSubcategoryByIdQuery
  } = leaveTypeSlice;