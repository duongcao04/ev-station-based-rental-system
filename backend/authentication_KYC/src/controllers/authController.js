import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User, sequelize } from "../libs/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_TTL,
} from "../services/auth.js";

export const register = async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    if (!email || !phone_number || !password) {
      return res
        .status(400)
        .json({ message: "Không thể thiếu email, số điện thoại và mật khẩu" });
    }

    //check if user exists
    const EmailExists = await User.findOne({ where: { email: email } });
    const PhoneNBExists = await User.findOne({
      where: { phone_number: phone_number },
    });

    if (EmailExists != null || PhoneNBExists != null) {
      return res
        .status(409)
        .json({ message: "Email hoặc số điện thoại đã tồn tại" });
    } else {
      //hash password
      const hashPassword = await bcrypt.hash(password, 10); //salt = 10

      //create new user
      const user = await User.create({
        email,
        phone_number,
        password_hash: hashPassword,
      });

      //return
      return res.status(201).json({
        message: "Đăng ký thành công",
        email,
        phone_number,
      });
    }
  } catch (error) {
    console.error("Error when calling register");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    //get inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Không thể thiếu tài khoản và mật khẩu" });
    }

    const exist = await User.findOne({
      where: {
        [Op.or]: [{ email: username }, { phone_number: username }],
      },
    });
    if (exist != null) {
      //get hashedPassword in db to compare with password input
      const isValid = await bcrypt.compare(password, exist.password_hash);

      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
      }

      //create accessToken with jwt
      const accessToken = await generateAccessToken(exist.dataValues);

      //create refresh token
      const refreshToken = await generateRefreshToken(exist.dataValues);
      //send refresh token in db
      await exist.update({ refreshtoken: refreshToken });

      //send refresh token in a cookie
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: REFRESH_TOKEN_TTL,
      });

      let stationId = null;
      if (exist.role === "staff") {
        const sql = `SELECT id FROM "station" WHERE user_id = :uid LIMIT 1;`;
        const replacements = { uid: exist.id };
        const [results] = await sequelize.query(sql, {
          replacements,
          type: sequelize.QueryTypes.SELECT,
        });
        if (results && results.id) stationId = results.id;
      }

      //send access token in res
      return res.status(200).json({
        message: "Đăng nhập thành công",
        user_id: exist.id,
        email: exist.dataValues.email,
        role: exist.role,
        station_id: stationId,
        accessToken: accessToken,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }
  } catch (error) {
    console.error("Error when calling login");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    //get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "token is empty" });
    }
    //delete refresh token in db
    const user = await User.findOne({ where: { refreshtoken: refreshToken } });
    if (user != null) {
      await user.update({ refreshtoken: null });
    }

    //delete cookie
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Error when calling login");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    //get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Token is not found" });
    }

    //compare with refresh token in db
    const user = await User.findOne({
      where: { refreshtoken: refreshToken },
    });

    if (!user) {
      return res
        .status(403)
        .json({ msg: "invalid token or token is expired!" });
    }

    //check expired or not
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res.status(403).json("Invalid token");
        }
        //create a new access token
        const token = await generateAccessToken(user.dataValues);
        //return
        return res.status(200).json({ accessToken: token });
      }
    );
  } catch (error) {
    console.error("Error when calling refreshToken");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.params;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }
    if (newPassword != confirmPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới và xác nhận không khớp" });
    }
    if (newPassword === oldPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(401).json({ message: "Không tìmm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng" });
    }

    const newHashPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = newHashPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Error when calling changPassword");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};
