import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bio: null,
  image: null,
  theme: null,
  is_public: false,
  user_id: null,
}

const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.bio = action.payload.bio;
      state.image = action.payload.image;
      state.theme = action.payload.theme;
      state.is_public = action.payload.is_public;
      state.user_id = action.payload.user_id;
    },
    resetProfileData: (state) => {
      state.bio = null;
      state.image = null;
      state.theme = null;
      state.is_public = null;
      state.user_id = null;
    }
  }
})

export const {setProfileData, resetProfileData} = editProfileSlice.actions;

export default editProfileSlice.reducer;