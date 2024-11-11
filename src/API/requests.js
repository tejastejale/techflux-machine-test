import { get_all_products } from "./index";
import * as API from "./index";

const getProducts = async (dispatch) => {
  try {
    const res = await API.get_all_products();
    dispatch({ type: "posts", payload: res });
    return res;
  } catch (error) {
    return error;
  }
};

export { getProducts };
