import { renewToken } from "./UserServices";
import axios from "../services/customAxios";

const getCookie = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const RenewToken = async () => {
  let res = await renewToken();
  if (res.data) {
    return res.data.data;
  } else {
    return null;
  }
};

const GetLocation = () => {
  return axios.get(
    `https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json`
  );
};

const ConvertDate = (date) => {
  let tmp = new Date(date);
  return (
    tmp.getDate() +
    "/" +
    (tmp.getMonth() + 1).toString() +
    "/" +
    tmp.getFullYear().toString()
  );
};

const ConvertDateInput = (date) => {
  let tmp = new Date(date);
  const month = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(tmp.getMonth() + 1);
  const day = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(tmp.getDate());
  return tmp.getFullYear().toString() + "-" + month + "-" + day;
};

const AnalysisAddress = (add) => {
  let tmp = add.split(",", 3).join(",").length;
  let fsub = add.slice(tmp + 2, add.length);
  let lsub = add.slice(0, tmp);
  return fsub + "\n" + lsub;
};

export {
  getCookie,
  RenewToken,
  GetLocation,
  ConvertDate,
  ConvertDateInput,
  AnalysisAddress,
};
