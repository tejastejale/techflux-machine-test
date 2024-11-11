import axios from "axios";
import { baseUrl } from "./apiContants";

const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const get_all_products = () => API.get(`${baseUrl}/posts`);

export { get_all_products };
