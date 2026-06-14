import axios from "axios";

const authService = {
  register(name: string, email: string, password: string) {
    return axios.post("/api/auth/register", { name, email, password });
  },
};

export default authService;
