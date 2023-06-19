import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  dob: "",
  created_at: "",
  token: "",
  id: "",
}

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.dob = action.payload.dob;
      state.created_at = action.payload.created_at;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    resetUserInfo: (state) => {
      state.name = "";
      state.email = "";
      state.dob = "";
      state.created_at = "";
      state.token = "";
      state.id = "";
    }
  }
})

export const { setUserInfo, resetUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;