import axios from "../services/customAxios";

const GetAllTypeProduct = () => {
  return axios.get(`/api/Product/GetAllTypeProduct`);
};

const CreateProduct = (
  config,
  id,
  name,
  price,
  quantity,
  address,
  type,
  img,
  uid
) => {
  return axios.post(
    `/api/Product/CreateProduct?id=${uid}`,
    { id, name, price, quantity, address, type, img },
    config
  );
};

const getPageProductByIdUser = (col, pageNum, perPage, direction, id) => {
  return axios.get(
    `/api/Product/pageProductByIdUser?col=${col}&pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&id=${id}`
  );
};

const SearchProductOfUserByName = (pageNum, perPage, direction, key, id) => {
  return axios.get(
    `/api/Product/searchProductOfUserByName?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&id=${id}`
  );
};

const DeleteProductById = (config, id) => {
  return axios.delete(`/api/Product/DeleteProductById?id=${id}`, config);
};

const GetImgByIdProduct = (id) => {
  return axios.get(`/api/Product/GetImgByIdProduct?id=${id}`);
};

const ChangeProduct = (
  config,
  id,
  name,
  price,
  quantity,
  address,
  type,
  img
) => {
  return axios.put(
    `/api/Product/ChangeProduct`,
    { id, name, price, quantity, address, type, img },
    config
  );
};

const SearchProductOfUserByAddress = (pageNum, perPage, direction, key, id) => {
  return axios.get(
    `/api/Product/searchProductOfUserByAddress?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&id=${id}`
  );
};

const SearchProductOfUserByType = (pageNum, perPage, direction, key, id) => {
  return axios.get(
    `/api/Product/searchProductOfUserByType?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&id=${id}`
  );
};

const CountProductOfUser = (id) => {
  return axios.get(`/api/Product/CountProductOfUser?id=${id}`);
};

export {
  GetAllTypeProduct,
  CreateProduct,
  getPageProductByIdUser,
  SearchProductOfUserByName,
  DeleteProductById,
  GetImgByIdProduct,
  ChangeProduct,
  SearchProductOfUserByAddress,
  SearchProductOfUserByType,
  CountProductOfUser,
};
