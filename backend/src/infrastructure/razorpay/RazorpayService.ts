import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../config/config";
import { IPaymentService } from "../../application/repositories/IPaymentService";

console.log("KEY_ID:", config.razorpay.RAZORPAY_API_KEY);
console.log("KEY_SECRET:", config.razorpay.RAZORPAY_API_SECRET);

let razorpay: Razorpay | null = null;

if (config.razorpay?.RAZORPAY_API_KEY && config.razorpay?.RAZORPAY_API_SECRET) {
  razorpay = new Razorpay({
    key_id: config.razorpay.RAZORPAY_API_KEY,
    key_secret: config.razorpay.RAZORPAY_API_SECRET,
  });
} else {
  console.warn("Razorpay not configured. Payments disabled.");
}

export class RazorpayService implements IPaymentService {

  /**
   * 🔹 STEP 1: Create Razorpay Order
   * (Stripe Checkout Session ka equivalent)
   */
  async createCheckOutSession(
    orderId: string,
    courses: any[],
    userId: string,
    uniqueOrderId: string
  ): Promise<string> {
    if (!razorpay) {
      throw new Error("Razorpay keys missing in env");
    }

    const amount = courses.reduce(
      (sum, course) => sum + course.coursePrice,
      0
    );

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: uniqueOrderId,
      notes: {
        orderId,
        userId,
        courses: JSON.stringify(
          courses.map((course) => ({
            courseId: course.courseId,
            title: course.courseTitle,
            price: course.coursePrice,
          }))
        ),
      },
    });

    // frontend ko order_id chahiye
    return order.id;
  }

  /**
   * 🔹 STEP 2: Verify Payment
   * (Stripe webhook / retrieveSession equivalent)
   */
  async retrieveSession(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    if (!razorpay) {
      throw new Error("Razorpay not configured");
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      payload;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.RAZORPAY_API_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === razorpay_signature;
  }
}
