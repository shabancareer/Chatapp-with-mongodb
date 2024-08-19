import User from "../models/userModel.js";
import generateToken from "../dbconnection/generatetoken.js";

export const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if ((!name, !email, !password)) {
    res.status(400).send({
      success: false,
      message: "Fill all the fildes",
    });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send({
      success: false,
      message: "This user already Exists",
    });
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send({
      success: false,
      message: "User not Found",
    });
  }
};

export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  if (users.length === 0) {
    res.status(404).send({
      success: false,
      message: "No users found matching the search criteria",
    });
  } else {
    res.send(users);
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send({
      success: false,
      message: "Invalid Email or Password",
    });
  }
};

export default { allUsers, registerUser, authUser };
