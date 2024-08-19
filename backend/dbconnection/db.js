import mongoose from "mongoose";
const connection = async (username, userpass) => {
  const URL = `mongodb://${username}:${userpass}@ac-pms2eiq-shard-00-00.rug4zb1.mongodb.net:27017,ac-pms2eiq-shard-00-01.rug4zb1.mongodb.net:27017,ac-pms2eiq-shard-00-02.rug4zb1.mongodb.net:27017/?ssl=true&replicaSet=atlas-hllwnc-shard-0&authSource=admin&retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfuly!...");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while connecting Database",
      error,
    });
  }
};

export default connection;
