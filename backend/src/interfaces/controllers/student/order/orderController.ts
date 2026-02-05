// import { NextFunction, Request, Response } from "express";
// import { CreateOrderUseCase } from "../../../../application/use-cases/student/createOrder";
// import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
// import { IOrder, OrderModel } from "../../../../domain/models/Orders";
// import { StripeService } from "../../../../infrastructure/stripe/StripeService";
// import { CustomError } from "../../../middlewares/errorMiddleWare";

// const orderRepository = new OrderRepository();
// const stripeService = new StripeService()
// const createOrderUseCase = new CreateOrderUseCase(orderRepository, stripeService)

// interface CourseFromFrontEndProps {
//     courseId: string ;
//       courseTitle : string;
//       coursePrice : Number;
//       courseImage: string;
//       courseInstructor ?: string;
//       courseLevel ?: string;
//       courseDescription ?:string ;
//       courseDuration ?: number
//       courseLecturesCount ?: number
//       courseInstructorImage ?: string;
//       courseCategory?: string;
//   }
// export const createOrderController = async(req:Request, res: Response, next:NextFunction) => {
//     try {
//         const user = req.user
//         if(!user){
//             throw new CustomError('User not logged in', 401)
//         }
//         const { courses } = req.body;
//         const totalAmount = courses.reduce((total:any, course:CourseFromFrontEndProps) => total + course.coursePrice, 0)
//         const stripeCheckoutSessionId  = await createOrderUseCase.execute({
//             orderId: `OD_${Date.now()}`,
//             userId:user?.id,
//             courses,
//             totalAmount,
//             paymentType: 'stripe',
//             paymentStatus: 'pending',
//             createdAt: new Date(),
//             updatedAt: new Date(),

//         });
//         res.status(200).json({sessionId: stripeCheckoutSessionId })
//     } catch (error) {
//         console.error('create order' , error)
//         next(error)
//     }
// }

import { NextFunction, Request, Response } from "express";
import { CreateOrderUseCase } from "../../../../application/use-cases/student/createOrder";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { RazorpayService } from "../../../../infrastructure/razorpay/RazorpayService";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { config } from "../../../../infrastructure/config/config";


const orderRepository = new OrderRepository();
const razorpayService = new RazorpayService();
const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  razorpayService,
);

interface CourseFromFrontEndProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseImage: string;
  courseInstructor?: string;
  courseLevel?: string;
  courseDescription?: string;
  courseDuration?: number;
  courseLecturesCount?: number;
  courseInstructorImage?: string;
  courseCategory?: string;
}

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new CustomError("User not logged in", 401);
    }

    const { courses } = req.body;

    if (!courses || courses.length === 0) {
      throw new CustomError("No courses provided", 400);
    }

    const totalAmount = courses.reduce(
      (total: number, course: CourseFromFrontEndProps) =>
        total + Number(course.coursePrice),
      0,
    );

    const orderId = `OD_${Date.now()}`;

    // 🔥 Create DB order + Razorpay order
    const razorpayOrderId = await createOrderUseCase.execute({
      orderId,
      userId: user.id,
      courses,
      totalAmount,
      paymentType: "razorpay",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // frontend ko Razorpay order details chahiye
    res.status(200).json({
      razorpayOrderId,
      key: config.razorpay.RAZORPAY_API_KEY, // ✅ CORRECT
      amount: totalAmount * 100,
      currency: "INR",
      orderId,
    });
  } catch (error) {
    console.error("create order (razorpay)", error);
    next(error);
  }
};
