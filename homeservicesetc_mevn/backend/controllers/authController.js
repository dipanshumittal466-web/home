const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, config.jwtSecret, { expiresIn: "7d" });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, acceptedIndemnity } = req.body;

    if (!acceptedIndemnity) {
      return res.status(400).json({ message: "Indemnity must be accepted" });
    }

    const user = await User.create({ name, email, password, role, acceptedIndemnity });
    res.json({
      token: generateToken(user._id, user.role),
      role: user.role,
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id, user.role),
      role: user.role,
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
