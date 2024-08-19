import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      console.error(error);
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "There is no chat with in group!..",
    });
    throw new Error(error.message);
  }
};

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({
      success: false,
      message: "Please Fill all the feilds",
    });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 1) {
    return res.status(400).send({
      success: false,
      message: "More than 1 users are required to form a group chat",
    });
  }
  if (users.includes(req.user)) {
    return res.status(400).send({
      success: false,
      message: "You are already a member of this group chat",
    });
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "No Group Chat",
    });
    throw new Error(error.message);
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send({
      success: false,
      message: "Chat Not Found",
    });
  } else {
    res.json(updatedChat);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).send({
      success: false,
      message: "Chat Not Found",
    });
  } else {
    res.json(removed);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if the requester is an admin (you can implement this logic if needed)

  try {
    // Check if the user is already a member of the group chat
    const chat = await Chat.findOne({ _id: chatId, users: userId });
    if (chat) {
      return res.status(400).send({
        success: false,
        message: "User is already a member of this group chat",
      });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error adding user to the group chat",
    });
    throw new Error(error.message);
  }
};

export default {
  accessChat,
  fetchChats,
  addToGroup,
  removeFromGroup,
  createGroupChat,
  renameGroup,
};
