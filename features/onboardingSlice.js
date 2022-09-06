import { createSlice } from "@reduxjs/toolkit";

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    saved: false,
  },
  reducers: {
    setSaved: (state, action) => {
      state.saved = action.payload;
    },
  },
});

export const { setSaved } = onboardingSlice.actions;

export default onboardingSlice.reducer;
