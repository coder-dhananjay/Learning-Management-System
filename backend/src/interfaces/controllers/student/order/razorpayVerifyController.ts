import { NextFunction, Request, Response } from "express";
import { RazorpayService } from "../../../../infrastructure/razorpay/RazorpayService";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { CustomError } from "../../../middlewares/errorMiddleWare";

const razorpayService = new RazorpayService();
const orderRepository = new OrderRepository();

export const verifyRazorpayPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      throw new CustomError("Missing payment details", 400);
    }

    const isValid = await razorpayService.retrieveSession({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      throw new CustomError("Invalid Razorpay signature", 400);
    }

    const updatedOrder = await orderRepository.updateOrder(orderId, {
      paymentStatus: "completed",
      transactionId: razorpay_payment_id,
      paymentDate: new Date(),
      updatedAt: new Date(),
    });

    if (!updatedOrder) {
      throw new CustomError("Order not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
