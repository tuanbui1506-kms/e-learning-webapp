import Cart from "./classes/Cart";
import Course from "./classes/Course";

const cartModel = {
  getNumberOfItems(cart:Cart):number {
    return cart.courses.length;
  },

  add(cart:Cart, item:Course | null):void {
    if(item) 
      cart.courses.push(item);
  },

  remove(cart:Cart, id:number):void {
    cart.courses.forEach((course,index) =>{
      if(course.id == id){
        cart.courses.splice(index,1);
        return;
      }
    })
  },
  checkItem(cart:Cart, id:number):boolean {
    for (let i = cart.courses.length - 1; i >= 0; i--) {
      if (id === cart.courses[i].id) {
        return true;
      }
    }
    return false;
  }
};

export default cartModel;