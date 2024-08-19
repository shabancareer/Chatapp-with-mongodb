import {
  IconButton,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Typography,
  Drawer,
  List,
  ListItem,
  // ListItemText,
  Box,
  Button,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  // Notifications,
  // Help,
} from "@mui/icons-material";
import ArrowCircleRightSharpIcon from "@mui/icons-material/ArrowCircleRightSharp";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, addChat } from "../../features/counter/authSlice";
import FlexBetween from "../../components/FlexBetween";
import GroupsIcon from "@mui/icons-material/Groups";
import { Search } from "@mui/icons-material";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { getSender } from "../config/chatlogic";
import Tooltip from "@mui/material/Tooltip";
import { clearNotifications } from "../../features/counter/authSlice";

// import { selectChat, addChat } from "../features/counter/authSlice";
// import ChatLoading from "../ChatLoading";

export const Navbar = () => {
  const chats = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  // console.log("notifications nav", notifications);
  const selectedChat = useSelector((state) => state.selectChat);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;
  const fullName = `${user.name}`;
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSecondDrawerOpen, setSecondDrawerOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
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

  const handleGroup = async (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warn("🦄 User Already exisited!...!", {
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
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  const openSecondDrawer = () => {
    setSecondDrawerOpen(true);
  };

  const closeSecondDrawer = () => {
    setSecondDrawerOpen(false);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warn("🦄 Plz fill all the fields...!", {
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      dispatch(addChat([...chats, data]));

      closeSecondDrawer();
      toast.success("🦄 New chat has been created!...", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("🦄 Faild to create chat", {
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

  return (
    <>
      <FlexBetween p={"10px"} width="30%" backgroundColor={alt}>
        <FlexBetween gap="15px">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "20px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "20px" }} />
            )}
          </IconButton>
          <Message
            style={{
              fontSize: "20px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          ></Message>
          {/* {!notifications
            ? "No new message...!"
            : notifications.chat.users[1].name} */}
          {/* <Badge badgeContent={notifications?.length ?? 0}></Badge> */}
          <FormControl variant="standard">
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "100px",
                borderRadius: "0.25rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "2rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>

              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
        <GroupsIcon
          sx={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }}
          onClick={toggleDrawer}
        />

        <Drawer open={isSecondDrawerOpen} onClose={closeSecondDrawer}>
          <List>
            <ListItem>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="15px"
                p={"5px"}
                top={"65px"}
                width={"100%"}
              >
                <InputBase
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FlexBetween>
            </ListItem>
            <Button onClick={handleSubmit}>
              <ToastContainer />
              <TaskAltIcon
                sx={{
                  variant: "solid",
                  backgroundColor: "#4169E1",
                  cursor: "pointer",
                  borderRadius: "100%",
                  width: "30px",
                  height: "30px",
                  color: "white",
                }}
              />
            </Button>
          </List>
        </Drawer>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem>
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="15px"
                p={"5px"}
                top={"65px"}
                width={"100%"}
              >
                <InputBase
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  {" "}
                  {<Search />}
                  <ToastContainer />
                </Button>
              </FlexBetween>
            </ListItem>
            <ListItem>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              <Box>
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </Box>
            </ListItem>
          </List>
          {selectedUsers.length === 0 ? (
            ""
          ) : (
            <ArrowCircleRightSharpIcon
              sx={{
                variant: "solid",
                fontSize: 24,
                backgroundColor: "#4169E1",
                cursor: "pointer",
                borderRadius: "100%",
                width: "40px",
                height: "40px",
                color: "white",
              }}
              onClick={openSecondDrawer}
            />
          )}
        </Drawer>
      </FlexBetween>
    </>
  );
};

export default Navbar;
