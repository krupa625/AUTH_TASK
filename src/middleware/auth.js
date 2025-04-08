const { verifyToken } = require("../utils/jwt.js");
const { readStore } = require("../data/fileHandling.js");
const { STATUS_CODES } = require("../utils/statuscode.js");

function authMiddleware(role) {
  return (req, res, next) => {
    const oToken = req.headers.authorization?.split(" ")[1];

    if (!oToken)
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Token missing" });

    const oPayload = verifyToken(oToken, role);
    // console.log(oPayload);

    if (!oPayload || oPayload.role !== role) {
      return res
        .status(STATUS_CODES.Forbidden)
        .json({ message: "Access denied" });
    }

    const oStore = readStore();
    const oSessions =
      role === "admin" ? oStore.adminSessions : oStore.userSessions;

    if (
      !oSessions[oPayload.email] ||
      !oSessions[oPayload.email].includes(oToken)
    ) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Session expired" });
    }

    req.user = oPayload; //decode the direct access to details of user/admin to use in next route/again and again verify issue solved!
    // console.log(payload);

    next();
  };
}

module.exports = authMiddleware;
