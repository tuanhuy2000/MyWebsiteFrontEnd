import { RenewToken, getCookie } from "../../services/Common";
import {
  ChangeUserInfor,
  GetUserByRefreshToken,
  getRefreshToken,
  login,
} from "../../services/UserServices";
import { toast } from "react-toastify";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const CHANGE_INFOR = "CHANGE_INFOR";

export const handleLoginRedux = (username, password) => {
  return async (dispatch, getState) => {
    let res = await login(username.trim(), password);
    if (res.data) {
      if (res.data.success) {
        document.cookie = "Token=" + res.data.data.accessToken + ";";
        dispatch({
          type: LOGIN_SUCCESS,
          data: {
            id: res.data.data.id,
            name: res.data.data.name,
            phoneNumber: res.data.data.phoneNumber,
            email: res.data.data.email,
            role: res.data.data.role,
          },
        });
        const config = {
          headers: { Authorization: `Bearer ${getCookie("Token")}` },
        };
        let res2 = await getRefreshToken(res.data.data.id, config);
        if (res2.data) {
          if (res2.data.success) {
            localStorage.setItem("RefreshToken", res2.data.data);
          } else {
            toast.error(res2.data.message);
            dispatch({ type: LOGIN_ERROR });
          }
        } else {
          toast.error("Error");
          dispatch({ type: LOGIN_ERROR });
        }
      } else {
        toast.error(res.data.message);
        dispatch({ type: LOGIN_ERROR });
      }
    } else {
      toast.error("Error");
      dispatch({ type: LOGIN_ERROR });
    }
  };
};

export const handleLogoutRedux = () => {
  return (dispatch, getState) => {
    dispatch({
      type: LOGOUT,
    });
  };
};

export const handleRefresh = () => {
  return async (dispatch, getState) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await GetUserByRefreshToken(config);
    if (res.data) {
      if (res.data.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          data: {
            id: res.data.data.id,
            name: res.data.data.name,
            phoneNumber: res.data.data.phoneNumber,
            email: res.data.data.email,
            role: res.data.data.role,
          },
        });
      } else {
        toast.error(res.data.message);
        dispatch({ type: LOGOUT });
      }
    } else {
      if (+res === 401) {
        RenewToken().then((token) => {
          if (token !== null) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            GetUserByRefreshToken(config2).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  dispatch({
                    type: LOGIN_SUCCESS,
                    data: {
                      id: res.data.data.id,
                      name: res.data.data.name,
                      phoneNumber: res.data.data.phoneNumber,
                      email: res.data.data.email,
                      role: res.data.data.role,
                    },
                  });
                } else {
                  toast.error(res.data.message);
                  dispatch({ type: LOGOUT });
                }
              } else {
                toast.error("Error");
                dispatch({ type: LOGOUT });
              }
            });
          } else {
            toast.error("PLease login to continue");
            dispatch({ type: LOGOUT });
          }
        });
      } else {
        toast.error("Error");
        dispatch({ type: LOGOUT });
      }
    }
  };
};

export const handleChangeInforRedux = (id, name, phoneNumber, email) => {
  return async (dispatch) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await ChangeUserInfor(config, id, name, phoneNumber, email);
    if (res.data) {
      if (res.data.success) {
        dispatch({
          type: CHANGE_INFOR,
          data: {
            name: name,
            phoneNumber: phoneNumber,
            email: email,
          },
        });
        toast.success("Change user infor success");
      } else {
        toast.warning(res.data.message);
      }
    } else {
      if (+res === 401) {
        RenewToken().then((token) => {
          if (token != null) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            ChangeUserInfor(config2, id, name, phoneNumber, email).then(
              (res) => {
                if (res.data) {
                  if (res.data.success) {
                    dispatch({
                      type: CHANGE_INFOR,
                      data: {
                        name: name,
                        phoneNumber: phoneNumber,
                        email: email,
                      },
                    });
                    toast.success("Change user infor success");
                  } else {
                    toast.warning(res.data.message);
                  }
                }
              }
            );
          } else {
            toast.error("PLease login to continue");
            dispatch({ type: LOGOUT });
          }
        });
      } else {
        toast.error("Error");
      }
    }
  };
};
