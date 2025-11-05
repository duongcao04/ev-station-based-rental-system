import { registerUser } from "../services/auth.js";

export const createAccount = async (req, res) => {
  try {
    const { email, phone_number, password, role } = req.body;
    const user = await registerUser({
      email,
      phone_number,
      password,
      role,
    });
    return res.status(201).json({
      message: "Dăng ký thành công",
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal Error";
    return res.status(status).json({ message });
  }
};
