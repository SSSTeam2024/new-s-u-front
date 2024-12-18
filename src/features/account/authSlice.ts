import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "./accountSlice"; // Import UserResponse type
import type { RootState } from "../../app/store";

type AuthState = {
  user: UserResponse["user"] | null; // Set user to UserResponse["user"] type for better type safety
};

const initialState: AuthState = {
  user: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: UserResponse["user"] }> // Use UserResponse["user"] for type safety
    ) => {
      state.user = user;
    },
    // Add other reducers for logout or handling login errors (optional)
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
