import axios from "../services/customAxios";

const GetShopByUserId = (id) => {
  return axios.get(`/api/Shop/GetShop?id=${id}`);
};

const CreateShop = (config, id, name, avatar, uid) => {
  return axios.post(
    `/api/Shop/CreateShop?id=${uid}`,
    { id, name, avatar },
    config
  );
};

const ChangeShop = (config, name, avatar, uid) => {
  return axios.put(
    `/api/Shop/ChangeShopInfor?id=${uid}`,
    { id: "", name, avatar },
    config
  );
};

const DeleteShopByIdUser = (config, id) => {
  return axios.delete(`/api/Shop/DeleteShop?id=${id}`, config);
};

const GetShopByProductId = (id) => {
  return axios.get(`/api/Shop/GetShopByProduct?id=${id}`);
};

export {
  GetShopByUserId,
  CreateShop,
  ChangeShop,
  DeleteShopByIdUser,
  GetShopByProductId,
};
