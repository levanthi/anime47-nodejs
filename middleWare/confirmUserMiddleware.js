const jwt = require("jsonwebtoken");

function confirmUserMiddleware(req, res, next) {
  const accessToken = req.body.accessToken || req.query.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, process.env.TOKEN_ACCESS_KEY, (err, user) => {
      if (err) {
        res.send({ type: "error", message: "Token is not valid!" });
      }
      req.user = user
      next();
    });
  } else {
    res.send("You're not authenticated!");
  }
}

module.exports = confirmUserMiddleware;
