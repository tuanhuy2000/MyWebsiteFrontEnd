import axios from "../services/customAxios";

const GetAllTypeCoupon = () => {
  return axios.get(`/api/Coupon/GetAllTypeCoupon`);
};

const CreateShopCoupon = (
  config,
  id,
  code,
  quantity,
  worth,
  describe,
  from,
  to,
  type,
  productType,
  uid
) => {
  return axios.post(
    `/api/Coupon/CreateShopCoupon?id=${uid}`,
    { id, code, quantity, worth, describe, from, to, type, productType },
    config
  );
};

const getPageCouponByIdUser = (config, pageNum, perPage, direction, id) => {
  return axios.get(
    `/api/Coupon/pageCouponByIdUser?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&id=${id}`,
    config
  );
};

const DeleteCouponById = (config, id) => {
  return axios.delete(`/api/Coupon/DeleteCouponById?id=${id}`, config);
};

const ChangeCoupon = (
  config,
  id,
  code,
  quantity,
  worth,
  describe,
  from,
  to,
  type,
  productType
) => {
  return axios.put(
    `/api/Coupon/ChangeCoupon`,
    { id, code, quantity, worth, describe, from, to, type, productType },
    config
  );
};

const SearchCouponOfUserByType = (
  config,
  pageNum,
  perPage,
  direction,
  key,
  id
) => {
  return axios.get(
    `/api/Coupon/searchCouponOfUserByType?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&id=${id}`,
    config
  );
};

const SearchCouponOfUserByProductType = (
  config,
  pageNum,
  perPage,
  direction,
  key,
  id
) => {
  return axios.get(
    `/api/Coupon/searchCouponOfUserByProductType?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}&id=${id}`,
    config
  );
};

const SearchCouponOfUserByDate = (
  config,
  pageNum,
  perPage,
  direction,
  from,
  to,
  id
) => {
  return axios.get(
    `/api/Coupon/searchCouponOfUserByDate?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&from=${from}&to=${to}&id=${id}`,
    config
  );
};

const CreateAdminCoupon = (
  config,
  id,
  code,
  quantity,
  worth,
  describe,
  from,
  to,
  type,
  productType
) => {
  return axios.post(
    `/api/Coupon/CreateAdminCoupon`,
    { id, code, quantity, worth, describe, from, to, type, productType },
    config
  );
};

const getPageAdminCoupon = (config, pageNum, perPage, direction) => {
  return axios.get(
    `/api/Coupon/pageAdminCoupon?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}`,
    config
  );
};

const SearchAdminCouponByType = (config, pageNum, perPage, direction, key) => {
  return axios.get(
    `/api/Coupon/searchAdminCouponByType?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}`,
    config
  );
};

const SearchAdminCouponByProductType = (
  config,
  pageNum,
  perPage,
  direction,
  key
) => {
  return axios.get(
    `/api/Coupon/searchAdminCouponByProductType?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}`,
    config
  );
};

const SearchAdminCouponByDate = (
  config,
  pageNum,
  perPage,
  direction,
  from,
  to
) => {
  return axios.get(
    `/api/Coupon/searchAdminCouponByDate?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&from=${from}&to=${to}`,
    config
  );
};

const CountCouponOfUser = (id) => {
  return axios.get(`/api/Coupon/CountCouponByIdUser?id=${id}`);
};

const CountAdminCoupon = () => {
  return axios.get(`/api/Coupon/CountAdminCoupon`);
};

export {
  GetAllTypeCoupon,
  CreateShopCoupon,
  getPageCouponByIdUser,
  DeleteCouponById,
  ChangeCoupon,
  SearchCouponOfUserByType,
  SearchCouponOfUserByProductType,
  SearchCouponOfUserByDate,
  CreateAdminCoupon,
  getPageAdminCoupon,
  SearchAdminCouponByType,
  SearchAdminCouponByProductType,
  SearchAdminCouponByDate,
  CountCouponOfUser,
  CountAdminCoupon,
};
