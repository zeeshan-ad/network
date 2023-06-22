import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bio: null,
  image: null
}

const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.bio = action.payload.bio;
      state.image = action.payload.image
    },
    resetProfileData: (state) => {
      state.bio = null;
      state.image = null;
    }
  }
})

export const {setProfileData, resetProfileData} = editProfileSlice.actions;

export default editProfileSlice.reducer;