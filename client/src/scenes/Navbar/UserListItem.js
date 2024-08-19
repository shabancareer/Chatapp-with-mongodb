import { Avatar, Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      position="relative"
      top="65px"
      width="100%"
      borderRadius={15}
      height="auto"
      overflowX="hidden"
    >
      <nav>
        <List>
          <ListItem
            disablePadding
            sx={{
              position: "relative",
              borderRadius: 20,
              bottom: 10,
              // cursor: "pointer",
            }}
          >
            <ListItemButton
              sx={{
                // backgroundColor: user ? "#38B2AC" : "#E8E8E8",
                px: 3,
                py: 2,
                borderRadius: "lg",
                key: user._id,
                width: "300px",
              }}
            >
              <Avatar src={user.pic} />
              <Box padding="0px 10px">{user.name}</Box>
              <Box>{user.email}</Box>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
};
export default UserListItem;
