import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7231",
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response ? response : { statusCode: response.status };
  },
  function (error) {
    if (error.response) {
      return error.response.status;
    } else {
      return Promise.reject("Unknow Server");
    }
  }
);

export default instance;
