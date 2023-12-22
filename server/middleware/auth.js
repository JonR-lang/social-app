const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  try {
    let token = req.cookie.jwt;
    if (!token) {
      throw new Error("Access Denied");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        throw new Error("Access Denied");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
