import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  name: "friend",
  initialState: {
    value: {},
  },
  reducers: {
    friendAction: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { friendAction } = friendSlice.actions;

export default friendSlice.reducer;
