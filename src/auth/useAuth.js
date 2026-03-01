import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => useContext(AuthContext);


const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role", response.data.role);

  return response.data; // VERY IMPORTANT
};