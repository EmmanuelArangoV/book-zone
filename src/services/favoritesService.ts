import axios from "axios";

const favoritesService = {
  getFavorites() {
    return axios.get("/api/favorites");
  },
  addFavorite(productId: string) {
    return axios.post("/api/favorites", { productId });
  },
  removeFavorite(productId: string) {
    return axios.delete("/api/favorites", { data: { productId } });
  },
};

export default favoritesService;
