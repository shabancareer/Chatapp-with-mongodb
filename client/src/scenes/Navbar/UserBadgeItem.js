import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      sx={{
        px: 2,
        py: 1,
        borderRadius: "lg",
        m: 1,
        mb: 2,
        variant: "solid",
        fontSize: 12,
        backgroundColor: "#4169E1",
        color: "white",
        cursor: "pointer",
      }}
      onClick={handleFunction}
    >
      {user.name}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
