import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketConnected: false,
  socketId: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;  // ✅ FIXED
    },
    setSocketID: (state, action) => {
      state.socketId = action.payload;
    }
  },
});

export const { setSocketConnected, setSocketID } = socketSlice.actions;
export default socketSlice.reducer;
