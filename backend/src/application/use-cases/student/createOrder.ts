// import { ObjectId } from "mongoose";
// import { IOrder } from "../../../domain/models/Orders";
// import { OrderRepository } from "../../../infrastructure/repositories/orderRepository";
// import { StripeService } from "../../../infrastructure/stripe/StripeService";
// import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

// export class CreateOrderUseCase {
//     constructor(private orderRepository: OrderRepository,
//         private stripeService : StripeService
//     ){}

//     async execute(order: IOrder) : Promise<string> {

//         if(order.courses.length === 0){
//             throw new CustomError('An order must contain atleast one course', 400)
//         }
//         if(order.subTotal && order.subTotal <= 0 || order.totalAmount <= 0){
//             throw new CustomError('Invalid order amount', 400)
//         }

//         const courseIdsArray = order.courses.map((course)=> course.courseId.toString())
//         //check if user has already purchased the course
//         const alreadyPurchasedCourses = await this.checkCoursesAlreadyPurchased(order.userId.toString(), courseIdsArray)

//         if(alreadyPurchasedCourses.length> 0){
//             throw new CustomError(`You have already purchased the following courses: ${alreadyPurchasedCourses}`, 400)
//         }
        
//         const createdOrder = await this.orderRepository.createOrder({
//          ...order,
//          paymentStatus: 'pending',
//         })
//         if(!createdOrder){
//             throw new CustomError('Order creation failed', 400)
//         }

//        const stripeCheckoutUrl = await this.stripeService.createCheckOutSession(
//         createdOrder._id as string,
//         order.courses,
//         order.userId.toString(),
//         order.orderId
//        )
//         return stripeCheckoutUrl;
//     }

//     /**
//      * userId -id of the user
//      * courses - array of course ids the user is attempting to purchase
//      * returns array of course ids that user already purchased
//      */

//     private async checkCoursesAlreadyPurchased (userId: string, courses: string[]):Promise<string[]>{
//         const purchasedOrders = await this.orderRepository.getOrdersByUserIdWithPaymentStatus(userId, 'completed');
        
//         const purchasedCoursesIds:any = purchasedOrders.flatMap(order => {
//            return order.courses.map((course:any) => course.courseId.toString())
//         });
//         const alreadyPurchased = courses.filter(course => purchasedCoursesIds.includes(course));
//         return alreadyPurchased;
//     }
// }

import { IOrder } from "../../../domain/models/Orders";
import { OrderRepository } from "../../../infrastructure/repositories/orderRepository";
import { RazorpayService } from "../../../infrastructure/razorpay/RazorpayService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private razorpayService: RazorpayService
  ) {}

  async execute(order: IOrder): Promise<string> {
    // basic validations
    if (order.courses.length === 0) {
      throw new CustomError(
        "An order must contain at least one course",
        400
      );
    }

    if (
      (order.subTotal && order.subTotal <= 0) ||
      order.totalAmount <= 0
    ) {
      throw new CustomError("Invalid order amount", 400);
    }

    // check already purchased courses
    const courseIdsArray = order.courses.map((course) =>
      course.courseId.toString()
    );

    const alreadyPurchasedCourses =
      await this.checkCoursesAlreadyPurchased(
        order.userId.toString(),
        courseIdsArray
      );

    if (alreadyPurchasedCourses.length > 0) {
      throw new CustomError(
        `You have already purchased the following courses: ${alreadyPurchasedCourses}`,
        400
      );
    }

    // create order in DB
    const createdOrder = await this.orderRepository.createOrder({
      ...order,
      paymentStatus: "pending",
    });

    if (!createdOrder) {
      throw new CustomError("Order creation failed", 400);
    }

    // 🔥 Razorpay order creation (Stripe checkout replacement)
    const razorpayOrderId =
      await this.razorpayService.createCheckOutSession(
        createdOrder._id as string,
        order.courses,
        order.userId.toString(),
        order.orderId
      );

    // frontend ko Razorpay order_id milega
    return razorpayOrderId;
  }

  /**
   * userId - id of the user
   * courses - array of course ids user is attempting to purchase
   * returns array of already purchased course ids
   */
  private async checkCoursesAlreadyPurchased(
    userId: string,
    courses: string[]
  ): Promise<string[]> {
    const purchasedOrders =
      await this.orderRepository.getOrdersByUserIdWithPaymentStatus(
        userId,
        "completed"
      );

    const purchasedCoursesIds: string[] = purchasedOrders.flatMap(
      (order: any) =>
        order.courses.map((course: any) =>
          course.courseId.toString()
        )
    );

    return courses.filter((course) =>
      purchasedCoursesIds.includes(course)
    );
  }
}
