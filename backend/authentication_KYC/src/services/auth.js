import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14d

const generateAccessToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
    }
  );
  return token;
};

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json("Token not provided");
  }
  jwt.verify(
    token,
    "process.env.ACCESS_TOKEN_SECRET",
    async (error, decoded) => {
      if (error) {
        return res.status(403).json("Token expired");
      }
      next();
    }
  );
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_TTL,
    }
  );
  return token;
};

export {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
};
