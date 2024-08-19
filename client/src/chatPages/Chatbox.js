import React from "react";
import { useState } from "react";
import FlexBetween from "../components/FlexBetween";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, addChat } from "../features/counter/authSlice";
// import { getSenderAll } from "../scenes/config/chatlogic";
import { SingleChat } from "../chatPages/SingleChat";
import ScrollToBottom from "react-scroll-to-bottom";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.selectChat);
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  // const setLoggedUserId = `${user._id}`;

  return (
    <>
      <Box backgroundColor={alt} width="69.75%" mt={1} height="100vh">
        <Box
          alignItems="center"
          flexDir="column"
          p={3}
          borderWidth="1px"
          borderRadius="lg"
        >
          <ScrollToBottom>
            {/* <Box>{selectedChat.chatName}</Box> */}
            <SingleChat />
          </ScrollToBottom>
        </Box>
      </Box>
    </>
  );
};

export default Chatbox;
