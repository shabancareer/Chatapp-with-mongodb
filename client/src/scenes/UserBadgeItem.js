import React from "react";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";

export const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      sx={{
        px: "12px",
        py: "10px",
        borderRadius: "lg",
        m: "1px",
        mb: "2px",
        variant: "solid",
        fontSize: "12px",
        background: "#4169E1",
        cursor: "pointer",
        color: "white",
        "&:hover": {
          background: "#1E90FF",
        },
      }}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Badge>
  );
};

// export default UserBadgeItem;
