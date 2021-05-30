module.exports = {
    getNumberOfItems(cart) {
      let n = 0;
      for (const item of cart) {
        n += 1;
      }
  
      return n;
    },
  
    add(cart, item) {
      cart.push(item);
    },
  
    remove(cart, id) {
      for (i = cart.length - 1; i >= 0; i--) {
        if (id === cart[i].id) {
          cart.splice(i, 1);
          return;
        }
      }
    },
    checkItem(cart, id){
      for (i = cart.length - 1; i >= 0; i--) {
        if (id === cart[i].id) {
          return true;
        }
      }
      return false;
    }
  };
  