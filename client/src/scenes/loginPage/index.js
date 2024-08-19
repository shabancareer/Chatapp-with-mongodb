import { Box, Typography, useTheme } from "@mui/material";
import Form from "./form";

const LoginPage = () => {
  const theme = useTheme();
  //   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="20px" color="primary">
          chatApp Clone
        </Typography>
      </Box>

      <Box
        width="30%"
        p="1.5rem"
        m="0.5rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to My chatapp the for Sociopaths!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
