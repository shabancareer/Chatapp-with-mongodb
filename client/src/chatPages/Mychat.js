import { Button, InputBase, useTheme, Box } from "@mui/material";
import { Chat, Search } from "@mui/icons-material";
import { useState, React, useEffect } from "react";
import FlexBetween from "../components/FlexBetween";
import ChatLoading from "../scenes/ChatLoading";
import UserListItem from "../scenes/Navbar/UserListItem";
import axios from "axios";
import List from "@mui/material/List";
import { selectChat, addChat } from "../features/counter/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSender } from "../scenes/config/chatlogic";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ScrollToBottom from "react-scroll-to-bottom";
import ScrollableFeed from "react-scrollable-feed";

export const Mychat = () => {
  const userSelectedChat = useSelector((state) => state.selectChat);
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const alt = theme.palette.background.alt;
  const dispatch = useDispatch();

  const setLoggedUserId = `${user._id}`;

  const handleSearch = async () => {
    if (!search) {
      toast.warn("🦄 Enter Name & Email for search", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.warn("🦄 Failed to Load the Search Results", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id))
        dispatch(addChat([...chats, data]));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      dispatch(addChat(data));
    } catch (error) {
      console.log(error);
    }
  };

  const selectedChat = (chat) => {
    dispatch(selectChat(chat));
  };

  useEffect(() => {
    fetchChats();
  }, [userSelectedChat]);

  return (
    <>
      <Box
        width="30%"
        height={"100vh"}
        backgroundColor={alt}
        flexDirection="column"
        justify-content="center"
      >
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="15px"
          p={"5px"}
          position={"absolute"}
          top={"65px"}
          width={"30%"}
        >
          <InputBase
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>
            {<Search />}
            <ToastContainer />
          </Button>
        </FlexBetween>
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
        <Box
          d="flex"
          flexDir="column"
          pt={5}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          overflowY="hidden"
        >
          {chats && chats.length > 0 ? (
            // <ScrollableFeed>
            <Box>
              {chats.map((chat) => (
                <Box position="relative" width="360px" height="35px">
                  <nav>
                    <List>
                      <ListItem>
                        <ListItemButton>
                          <Box
                            display="flex"
                            width="700px"
                            backgroundColor="rebeccapurple"
                            color="white"
                            justifyContent="center"
                            height={30}
                            onClick={() => selectedChat(chat)}
                          >
                            {!chat.isGroupChat
                              ? getSender(setLoggedUserId, chat.users)
                              : chat.chatName}
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </nav>
                </Box>
              ))}
            </Box>
          ) : (
            // </ScrollableFeed>
            console.log("Not chat has been created!..")
          )}
        </Box>
      </Box>
    </>
  );
};

export default Mychat;
