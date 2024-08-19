import { Stack, Skeleton } from "@mui/material";
// import  from "@mui/material/Skeleton";

const ChatLoading = () => {
  return (
    <Stack position={"absolute"} width={"30%"} top={"110px"}>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  );
};

export default ChatLoading;
