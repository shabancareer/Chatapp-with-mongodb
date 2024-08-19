import React from "react";
import ScrollableFeed from "react-scrollable-feed";
// import ScrollToBottom from "react-scroll-to-bottom";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import {
  isSameSenderMargin,
  isSameSender,
  isLastMessage,
  isSameUser,
} from "../scenes/config/chatlogic";

export const ScrollableChat = ({ messages }) => {
  const selectedChat = useSelector((state) => state.selectChat);
  const chats = useSelector((state) => state.Chats);
  const user = useSelector((state) => state.user);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Box style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
