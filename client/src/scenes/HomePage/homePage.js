/* eslint-disable react/jsx-no-duplicate-props */
import { React, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Navbar from "../Navbar/Navbar";
import Chatbox from "../../chatPages/Chatbox";
import Mychat from "../../chatPages/Mychat";

const HomePage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <Navbar />
      <FlexBetween>
        <Mychat fetchAgain={fetchAgain} />
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </FlexBetween>
    </>
  );
};

export default HomePage;
