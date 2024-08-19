import React from "react";
// import { Counter } from "./features/counter/Counter";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./scenes/HomePage/homePage";
import LoginPage from "./scenes/loginPage";
// import Navbar from "./scenes/Navbar/Navbar";
import ProfilePage from "./scenes/ProfilePage/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import "./App.css";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* <Route path="/nav" element={<Navbar />} /> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />
            {/* <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
