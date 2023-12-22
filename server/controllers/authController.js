const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

//LOGGING IN

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //this is good to use and locate one user, because, remember, each email is unique.
    if (!user) {
      throw new Error("User does not exist");
    }
    //JOHNNY YOU ARE HERE OOO!
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid user credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });
    // res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 3 });

    res.status(200).json({ token, user });
  } catch (err) {
    const errors = handleError(err);
    res.status(500).json({ errors });
  }
};

function handleError(error) {
  let err = { firstName: "", lastName: "", email: "", password: "" };
  if (error.message.includes("User validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    });
  } else if (error.code === 11000) {
    err = { email: "This email already exists in our database" };
  } else if (error.message.includes("Invalid user credentials")) {
    err.password = "Please input the right password";
  } else if (error.message.includes("User does not exist")) {
    err.email = "User does not exist";
  }

  return err;
}
