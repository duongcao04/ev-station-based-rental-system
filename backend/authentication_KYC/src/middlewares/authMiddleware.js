import jwt from "jsonwebtoken";
import { User } from "../libs/db.js";

export const protectedRoute = (req, res, next) => {
  try {
    //get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "access token not found" });
    }

    //confirm token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired" });
      }

      //find renter
      const renter = await User.findOne({
        where: { id: decoded.userId },
        attributes: { exclude: ["password_hash"] },
      });
      if (!renter) {
        return res.status(404).json({ message: "renter not found" });
      }

      //send renter to req
      req.user = renter;
      next();
    });
  } catch (error) {
    console.error("Error verifying JWT in authMiddlware", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};
