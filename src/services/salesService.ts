import axios from "axios";

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

const salesService = {
  createSale(items: SaleItem[], total: number) {
    return axios.post("/api/sales", { items, total });
  },
};

export default salesService;
