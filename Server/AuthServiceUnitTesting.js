const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async ({ body }) => {
  const { email, password, firstName, lastName, phone, maleOrFemale } = body;

  // تحقق من الحقول المطلوبة
  if (!email || !password || !firstName || !lastName) {
    throw new Error("Missing required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    maleOrFemale,
    password: hashedPassword,
  });

  await newUser.save();

  return { message: "User registered successfully!" };
};

const login = async ({ body }) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error("Missing required fields");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "secretkey");

  return { email: user.email, token };
};

const getUser = async (token) => {
  if (!token) throw new Error("No token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
  } catch (err) {
    throw new Error("Invalid token");
  }

  const { email } = decoded;

  const currentUser = await User.findOne({ email }).select("-password -__v");
  if (!currentUser) throw new Error("User not found");

  return currentUser;
};

module.exports = { register, login, getUser };
