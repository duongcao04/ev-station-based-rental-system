import jwt from "jsonwebtoken";
import { User } from "../libs/db.js";

export const protectedRoute = (req, res, next) => {
  try {
    //get token from header
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];

    const token = req.cookies?.accessToken

    if (!token) {
      return res.status(401).json({ message: "access token not found" });
    }

    console.log("token:", token);


    //confirm token
    jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);

        return res.status(403).json({ message: "Token expired" });
      }

      //find user
      const user = await User.findOne({
        where: { id: decoded.userId },
        attributes: { exclude: ["password_hash"] },
      });
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      //send user to req
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error verifying JWT in authMiddlware", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: "Insufficient permissions",
          required: allowedRoles,
          current: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("Error in authorize middleware:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

export const checkOwnership = (req, res, next) => {
  try {
    // skip check with admin and staff
    if (req.user.role === "admin" || req.user.role === "staff") {
      return next();
    }

    if (req.user.role === "renter") {
      const requestedUserId =
        req.query?.user_id ||
        req.body?.user_id ||
        req.params?.user_id ||
        req.params?.userId ||
        req.params?.id;

      if (requestedUserId && requestedUserId != req.user.id) {
        return res.status(403).json({
          error: "You can only access your own data",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in checkOwnership middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
