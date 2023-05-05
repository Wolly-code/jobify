const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.get("x-auth-token");
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    console.log(decoded);
    req.savedToken = token;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token." });
  }
};
