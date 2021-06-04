import Cart from "./classes/Cart";
import Course from "./classes/Course";
import User from "./classes/User";

import * as db from '../utils/db';

// interface Order{
//   id:number,
//   date:string,
//   UID:string,
//   total:number
//   orderDetail:OrderDetail[],
// }
// interface OrderDetail{
//   id:number,
//   course:Course,
//   price:number
// }

const orderModel = {
  async add(cart: Cart, UID: string) {
    try {
      let totalPrice = 0;
      cart.courses.forEach((course) => { totalPrice += course.price })
      const orderEntity = {
        UID: UID,
        total: totalPrice
      }
      const [resultOrder, fields] = await db.add1(orderEntity, 'orders');
     
      
      if (resultOrder.insertId){
        cart.courses.forEach(async (course) => {
          const orderDetailEntity = {
            OrderID: resultOrder.insertId,
            CoursesID: course.id,
            Price: course.price
          }
          const [resultOrderDetail, fields] = await db.add1(orderDetailEntity, 'orderdetails');
        })
      }
    }
    catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}

export default orderModel;