import { React, useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
// import ScrollToBottom from "react-scroll-to-bottom";
import { ScrollableChat } from "./ScrollableChat.js";
import "react-toastify/dist/ReactToastify.css";
import "../components/style.css";
// import { IconButton } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getSender,
  getSenderChat,
  getSenderFull,
} from "../scenes/config/chatlogic";
import { ProfileModal } from "../scenes/ProfileModal.js";
import { UpdateGroupChatModal } from "../scenes/UpdateGroupChatModal.js";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../typing.json";
// import { addNotification } from "../features/counter/authSlice";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

export const SingleChat = () => {
  const selectedChat = useSelector((state) => state.selectChat);
  const user = useSelector((state) => state.user);
  // const chats = useSelector((state) => state.Chats);
  // const dispatch = useDispatch();
  // const notifications = useSelector((state) => state.notifications);
  // console.log("notifications chat uper", notifications);
  // const userMessages = useSelector((state) => state.sendMessage);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.warn({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // console.log("notifications single-----------------", notifications);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            // chatId: selectedChat,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        console.log(data);
      } catch (error) {
        toast.warn({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    let typingTimeout;
    const setTypingTimeout = () => {
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 5000);
    };
    if (istyping) {
      setTypingTimeout();
    } else {
      clearTimeout(typingTimeout);
    }
    return () => clearTimeout(typingTimeout);
  }, [istyping]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderChat(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  // messages={setMessages}
                  // fetchAgain={fetchAgain}
                  // setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Typography>
          <Box
            display="flex"
            borderRadius="10px"
            p={3}
            backgroundColor="#E8E8E8"
            width="100%"
            height="80vh"
            // overflowY="hidden"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              padding={3}
              background="#E8E8E8"
              width="100%"
              height="100%"
              borderRadius="lg"
              // overflowY="hidden"
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <Box className="messages">
                  {" "}
                  <ScrollableChat messages={messages} />{" "}
                </Box>
              )}

              <FormControl onKeyDown={sendMessage} isRequired>
                {istyping ? (
                  <Box
                    height="15px"
                    width="40px"
                    marginBottom={3}
                    borderRadius="50px"
                  >
                    <Lottie
                      animationData={animationData}
                      options={defaultOptions}
                    />
                  </Box>
                ) : null}
                <TextField
                  style={{
                    width: "700px",
                    paddingBottom: "10px",
                    marginLeft: "120px",
                  }}
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <Box d="flex" mx="auto" my="auto" h="100%">
          <Typography fontSize="xx-large" pb={3} mt={20}>
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};
