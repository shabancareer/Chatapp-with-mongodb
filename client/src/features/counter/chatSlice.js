import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [], // An array to store chat objects
  selectedChatId: null, // Store the currently selected chat ID
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
});

export const { addChat, selectChat, sendMessage } = chatSlice.actions;

export default chatSlice.reducer;
