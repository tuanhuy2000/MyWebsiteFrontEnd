import axios from "../services/customAxios";

const CreateTransport = (
  config,
  id,
  shippingCode,
  shippingUnit,
  shippingWay
) => {
  return axios.post(
    `/api/Order/CreateTransport`,
    { id, shippingCode, shippingUnit, shippingWay },
    config
  );
};

const CreateOrder = (
  config,
  id,
  paymentType,
  totalCost,
  discount,
  status,
  shippingWay,
  uId,
  sId,
  aId
) => {
  return axios.post(
    `/api/Order/CreateOrder?uId=${uId}&sId=${sId}&aId=${aId}`,
    { id, paymentType, totalCost, discount, status, shippingWay },
    config
  );
};

const AddCouponToOrder = (config, oId, cId) => {
  return axios.post(
    `/api/Order/AddCouponToOrder?oId=${oId}&cId=${cId}`,
    {},
    config
  );
};

const AddProductToOrder = (config, oId, pId, quantity) => {
  return axios.post(
    `/api/Order/AddProductToOrder?oId=${oId}&pId=${pId}&quantity=${quantity}`,
    {},
    config
  );
};

const GetOrderByShopOrUser = (
  config,
  pageNum,
  perPage,
  direction,
  tId,
  type
) => {
  return axios.get(
    `/api/Order/GetOrderByShopOrUser?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&tId=${tId}&type=${type}`,
    config
  );
};

const SearchOrderOfShopOrUser = (
  config,
  pageNum,
  perPage,
  direction,
  key,
  tId,
  type
) => {
  return axios.get(
    `/api/Order/SearchOrderOfShopOrUser?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&tId=${tId}&type=${type}`,
    config
  );
};

const CountOrderOfShop = (config, sId) => {
  return axios.get(`/api/Order/CountOrderOfShop?id=${sId}`, config);
};

const AddTransportToOrder = (config, tId, oId) => {
  return axios.post(
    `/api/Order/AddTransportToOrder?tId=${tId}&oId=${oId}`,
    {},
    config
  );
};

const GetAddressOfOrder = (config, oId) => {
  return axios.get(`/api/Order/GetAddressOfOrderById?oId=${oId}`, config);
};

const GetTransportOfOrder = (config, oId) => {
  return axios.get(`/api/Order/GetTransportOfOrderById?oId=${oId}`, config);
};

const GetProductOfOrder = (config, oId) => {
  return axios.get(`/api/Order/GetProductOfOrderById?oId=${oId}`, config);
};

const GetShopOfOrder = (config, oId) => {
  return axios.get(`/api/Order/GetShopOfOrderById?oId=${oId}`, config);
};

const DeleteOrderById = (config, oId) => {
  return axios.delete(`/api/Order/CancelOrder?oId=${oId}`, config);
};

const CheckBeforeOrder = (config, uId, pId) => {
  return axios.get(`/api/Order/CheckBeforeOrder?uId=${uId}&pId=${pId}`, config);
};

const FinishOrder = (config, oId) => {
  return axios.post(`/api/Order/FinishOrder?oId=${oId}`, {}, config);
};

const SearchOrderOfShopOrUserByStatus = (
  config,
  pageNum,
  perPage,
  direction,
  status,
  tId,
  type
) => {
  return axios.get(
    `/api/Order/SearchOrderOfShopOrUserByStatus?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&status=${status}&tId=${tId}&type=${type}`,
    config
  );
};

export {
  CreateTransport,
  CreateOrder,
  AddCouponToOrder,
  AddProductToOrder,
  GetOrderByShopOrUser,
  SearchOrderOfShopOrUser,
  CountOrderOfShop,
  AddTransportToOrder,
  GetAddressOfOrder,
  GetTransportOfOrder,
  GetProductOfOrder,
  GetShopOfOrder,
  DeleteOrderById,
  CheckBeforeOrder,
  FinishOrder,
  SearchOrderOfShopOrUserByStatus,
};
