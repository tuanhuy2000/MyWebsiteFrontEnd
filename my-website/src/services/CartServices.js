import axios from "../services/customAxios";

const AddToCart = (config, uId, pId, quantity) => {
  return axios.post(
    `/api/Cart/AddToCart?uId=${uId}&pId=${pId}&quantity=${quantity}`,
    { uId, pId, quantity },
    config
  );
};

const GetProductInCart = (config, uId) => {
  return axios.post(`/api/Cart/GetProductInCart?uId=${uId}`, uId, config);
};

const ChangeQuantity = (config, uId, pId, quantity) => {
  return axios.put(
    `/api/Cart/ChangeQuantity?uId=${uId}&pId=${pId}&quantity=${quantity}`,
    { uId, pId, quantity },
    config
  );
};

const DeleteProductInCart = (config, uId, pId) => {
  return axios.delete(
    `/api/Cart/DeleteProductInCart?uId=${uId}&pId=${pId}`,
    config
  );
};

export { AddToCart, GetProductInCart, ChangeQuantity, DeleteProductInCart };
