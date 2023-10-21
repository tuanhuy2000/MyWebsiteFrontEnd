import axios from "../services/customAxios";

const signin = (id, name, phoneNumber, email, userName, password) => {
  return axios.post(`/api/User/Signin`, {
    id,
    name,
    phoneNumber,
    email,
    userName,
    password,
    accessToken: "",
    role: "UserRole",
  });
};

const login = (username, password) => {
  return axios.post(`/api/User/Login`, { username, password });
};

const getRefreshToken = (id, config) => {
  return axios.post(`/api/User/GetRefreshToken?IdUser=${id}`, {}, config);
};

const renewToken = () => {
  return axios.post(
    `/api/User/RenewToken?refreshToken=${encodeURIComponent(
      window.localStorage.getItem("RefreshToken")
    )}`
  );
};

const GetUserByRefreshToken = (config) => {
  return axios.post(
    `/api/User/GetUserByRefreshToken?token=${encodeURIComponent(
      window.localStorage.getItem("RefreshToken")
    )}`,
    {},
    config
  );
};

const getPageUser = (config, pageNum, perPage, direction) => {
  return axios.get(
    `/api/User/pageUser?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}`,
    config
  );
};

const deleteUserById = (config, id) => {
  return axios.delete(`/api/User/DeleteUser?id=${id}`, config);
};

const ChangePassword = (config, id, password, newPassword) => {
  return axios.post(
    `/api/User/ChangePassword?id=${id}&pass=${password}&newPass=${newPassword}`,
    {},
    config
  );
};

const ChangeUserInfor = (config, id, name, phoneNumber, email) => {
  return axios.put(
    `/api/User/ChangeInfor`,
    {
      id,
      name,
      phoneNumber,
      email,
      username: "",
      password: "",
      accessToken: "",
      role: "",
    },
    config
  );
};

const SearchUser = (config, pageNum, perPage, direction, key) => {
  return axios.get(
    `/api/User/searchUser?pageNum=${pageNum}&perPage=${perPage}&direction=${direction}&key=${key}`,
    config
  );
};

export {
  signin,
  login,
  getRefreshToken,
  renewToken,
  GetUserByRefreshToken,
  getPageUser,
  deleteUserById,
  ChangePassword,
  ChangeUserInfor,
  SearchUser,
};
