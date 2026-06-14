import axios from "axios";

const cartService = {
  getCart() {
    return axios.get("/api/cart");
  },
  addItem(productId: string, quantity = 1) {
    return axios.post("/api/cart", { productId, quantity });
  },
  removeItem(productId: string) {
    return axios.delete("/api/cart", { data: { productId } });
  },
};

export default cartService;
