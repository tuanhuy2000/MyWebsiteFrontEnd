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
  information,
  address,
  type,
  img,
  uid
) => {
  return axios.post(
    `/api/Product/CreateProduct?id=${uid}`,
    { id, name, price, quantity, information, address, type, img },
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
  information,
  address,
  type,
  img
) => {
  return axios.put(
    `/api/Product/ChangeProduct`,
    { id, name, price, quantity, information, address, type, img },
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

const GetPageProduct = (pageNum, perPage) => {
  return axios.get(
    `/api/Product/pageProduct?pageNum=${pageNum}&perPage=${perPage}`
  );
};

const SearchProduct = (pageNum, perPage, keyWord, address, type, direction) => {
  return axios.get(
    `/api/Product/searchProduct?pageNum=${pageNum}&perPage=${perPage}&keyWord=${keyWord}&address=${address}&type=${type}&direction=${direction}`
  );
};

const CountProductOfShop = (id) => {
  return axios.get(`/api/Product/CountProductOfShop?id=${id}`);
};

const GetPageProductOfShop = (pageNum, perPage, idShop) => {
  return axios.get(
    `/api/Product/pageProductOfShop?pageNum=${pageNum}&perPage=${perPage}&idShop=${idShop}`
  );
};

const SearchProductOfShop = (
  pageNum,
  perPage,
  keyWord,
  address,
  type,
  direction,
  idShop
) => {
  return axios.get(
    `/api/Product/searchProductOfShop?pageNum=${pageNum}&perPage=${perPage}&keyWord=${keyWord}&address=${address}&type=${type}&direction=${direction}&idShop=${idShop}`
  );
};

const GetProductById = (id) => {
  return axios.get(`/api/Product/GetProductById?id=${id}`);
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
  GetPageProduct,
  SearchProduct,
  CountProductOfShop,
  GetPageProductOfShop,
  SearchProductOfShop,
  GetProductById,
};
