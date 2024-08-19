import express from "express";
import dotenv from "dotenv";
import connection from "./dbconnection/db.js";
import userRoutes from "./router/userRouter.js";
import chatRoutes from "./router/chatRoutes.js";
import messageRoutes from "./router/messageRoutes.js";
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js";
// import { Server } from "socket.io";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use("/api/user", upload.single("picture"), userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

//

// --------------------------deployment------------------------------

const PORT = process.env.PORT || 8080;
app.use(notFound);
app.use(errorHandler);

const username = process.env.DB_NAME;
const userpass = process.env.DB_PASS;

const server = createServer(app);

connection(username, userpass);

const httpServer = server.listen(PORT, () => {
  console.log(`Server is Running on the port ${PORT}`);
});

const io = new SocketServer(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");
    // if (chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
