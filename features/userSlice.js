import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userType: null,
    userData: null,
    temperoryId: null,
    userVerified: null,
    temperoryData: null,
    isLoading: false,
  },
  reducers: {
    login:  (state, action) => {
      state.user = action.payload;
      console.log(action.payload)
      try {
       AsyncStorage.setItem('user', action.payload)
      } catch (e) {
        console.log("userslice login error " + e);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserType:  (state, action) => {
      state.userType = action.payload;
      try {
        AsyncStorage.setItem('userType',action.payload)
      } catch (e) {
      }
    },
    setUserVerified: (state, action) => {
      console.log("userVerified: " + action.payload)
      state.userVerified = action.payload;
      try {
        AsyncStorage.setItem('userVerified',JSON.stringify(action.payload))
      } catch (e) {
        console.log("userslice userVerified error " + e);
      }
    },
    setTemperoryID: (state, action) => {
      state.temperoryId = action.payload;
    },
    setTemperoryData: (state, action) => {
      state.temperoryData = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.userVerified = null;
      state.UserData = null;
      AsyncStorage.setItem('user', "")
      AsyncStorage.setItem('userType',"")
      AsyncStorage.setItem('userVerified',"")
    },
  },
});

export const {
  login,
  setDbID,
  setUserType,
  setUserData,
  logout,
  setTemperoryID,
  setUserVerified,
  setTemperoryData,
  setLoading
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserType = (state) => state.user.userType;
export const selectUserData = (state) => state.user.userData;
export const selectTemperoryId = (state) => state.user.temperoryId;
export const selectTemperoryData = (state) => state.user.temperoryData;
export const selectUserVerified = (state) => state.user.userVerified;
export const selectLoading = (state) => state.user.isLoading;

export default userSlice.reducer;
