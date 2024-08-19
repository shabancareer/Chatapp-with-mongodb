import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Preview";
import { useSelector, useDispatch } from "react-redux";
import { UserBadgeItem } from "../scenes/UserBadgeItem.js";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import UserListItem from "./Navbar/UserListItem.js";
import { selectChat } from "../features/counter/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const UpdateGroupChatModal = (fetchMessages) => {
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [renameloading, setRenameLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.selectChat);
  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const leaveGroup = () => {
  //   console.log("leaveGroup");
  // };
  const handleRemove = async (user1) => {
    if (selectedChat.isAdmin !== user._id && user1._id !== user._id) {
      toast.warn({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      // setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch(selectChat(data));
      fetchMessages();
    } catch (error) {
      toast.warn({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.warn({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.warn({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.warn({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch(selectChat(data));
      // setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      dispatch(selectChat(data));
      // setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.warn({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <>
      <Button onClick={handleOpen}>
        <PreviewIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500 }}>
          <Box pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>

          <Box
            display="grid"
            gap="5px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >
            <TextField
              placeholder="Chat Name"
              sx={{ gridColumn: "span 3" }}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button variant="contained" color="success" onClick={handleRename}>
              Update
            </Button>
            <TextField
              placeholder="Add new user to chat"
              sx={{ gridColumn: "span 3" }}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemove(user)}
          >
            Leave group
          </Button>
          {loading ? (
            <CircularProgress color="inherit" />
          ) : (
            searchResult
              ?.slice(0, 3)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
};
