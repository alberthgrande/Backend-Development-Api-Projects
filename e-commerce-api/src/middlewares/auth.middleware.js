import { verifyAccessToken } from "../utils/jwt.util.js";
import { getRoleById } from "../repositories/role.repository.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyAccessToken(token);
    req.user = decoded;

    const role = await getRoleById(decoded.role_id);
    req.user.role = role.name;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Token expired",
      });
    }

    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};
