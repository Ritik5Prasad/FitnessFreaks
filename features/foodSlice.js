import { createSlice } from "@reduxjs/toolkit";

export const foodSlice = createSlice({
  name: "food",
  initialState: {
    foodList: [],
    exerciseList: [],
    firebaseExerciseList: [],
  },
  reducers: {
    setFoodList: (state, action) => {
      state.foodList = action.payload;
    },
    setExerciseList: (state, action) => {
      state.exerciseList = action.payload;
    },
    setFirebaseExerciseList: (state, action) => {
      state.firebaseExerciseList = action.payload;
    },
  },
});

export const { setFoodList, setExerciseList, setFirebaseExerciseList } =
  foodSlice.actions;

export const getFoodList = (state) => state.food.foodList;
export const getExerciseList = (state) => state.food.exerciseList;
export const getFirebaseExerciseList = (state) =>
  state.food.firebaseExerciseList;

export default foodSlice.reducer;
