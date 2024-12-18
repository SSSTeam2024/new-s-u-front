import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Subcategory {
  _id?: string;
  name_fr: string;
  name_ar: string;
  maxDays: number;
  sexe: "Homme" | "Femme" | "Both";
  Accumulable: boolean;
}
export interface LeaveBalance {

    _id:string,
  personnelId:string,
  leaveType:string,
  subcategory:Subcategory,
  remainingDays:number,
  daysUsed:number
  year:number,
  lastUpdated:Date
  }
  export const leaveBalanceSlice = createApi({
    reducerPath: 'leaveBalanceApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_URL}/LeaveBalance/`, // Adjust endpoint base URL
    }),
    tagTypes: ['LeaveBalances'],
    endpoints(builder) {
      return {
        fetchLeaveBalance: builder.query<LeaveBalance[], void>({
          query() {
            return 'get-all-leave-balances';
          },
          providesTags: ['LeaveBalances'],
        }),
        fetchLeaveBalanceById: builder.query<LeaveBalance[], void>({
            query(_id) {
              return `get-leave-balance/${_id}`;
            },
            providesTags: ['LeaveBalances'],
          }),
        addLeaveBalance: builder.mutation<void, Partial<LeaveBalance>>({
          query(leaveBalance) {
            return {
              url: 'add-leave-balance',
              method: 'POST',
              body: leaveBalance,
            };
          },
          invalidatesTags: ['LeaveBalances'],
        }),
        addOrUpdateLeaveBalance: builder.mutation<void, Partial<LeaveBalance>>({
          query(leaveBalance) {
            return {
              url: 'add-edit-leave-balance',
              method: 'POST',
              body: leaveBalance,
            };
          },
          invalidatesTags: ['LeaveBalances'],
        }),
        updateLeaveBalance: builder.mutation<void, Partial<LeaveBalance>>({
          query(leaveBalance) {
          
            return {
              url: `edit-leave-balance`,
              method: 'PUT',
              body: leaveBalance,
            };
          },
          invalidatesTags: ['LeaveBalances'],
        }),
        deleteLeaveBalance: builder.mutation<void, string>({
          query(_id) {
            return {
              url: `delete-leave-balance/${_id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags: ['LeaveBalances'],
        }),
      };
    },
  });
  
  export const {
    useFetchLeaveBalanceQuery,
    useFetchLeaveBalanceByIdQuery,
    useAddLeaveBalanceMutation,
    useAddOrUpdateLeaveBalanceMutation,
    useUpdateLeaveBalanceMutation,
    useDeleteLeaveBalanceMutation,
  } = leaveBalanceSlice;