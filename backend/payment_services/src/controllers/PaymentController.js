
import { PaymentModel } from "../models/PaymentModel.js";


// Post v1/api/payments

export const createPayment = async (req, res) => {
  const { booking_id, amount, type, payment_method, provider, description } = req.body;
  const user_id = req.user?.id;

  // validation

  if (!booking_id || !amount || !type) {
    return res.status(400).json({
      error: "Missing required fields"
    })
  }

  // crate payments
  return PaymentModel.create({
    booking_id,
    user_id,
    amount,
    type,
    payment_method,
    provider,
    description,
  })
    .then((payment) => {
      return res.status(201).json({
        message: "Payment created successfully",
        payment,
      });
    })
    .catch((err) => {
      console.error("createPayment error:", err);
      return res.status(500).json({ error: "Internal server error" });
    });

}

// GET /v1/api/payments/



