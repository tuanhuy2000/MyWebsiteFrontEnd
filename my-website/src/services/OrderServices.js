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
  uId,
  tId,
  aId
) => {
  return axios.post(
    `/api/Order/CreateOrder?uId=${uId}&tId=${tId}&aId=${aId}`,
    { id, paymentType, totalCost, discount },
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

export { CreateTransport, CreateOrder, AddCouponToOrder, AddProductToOrder };
