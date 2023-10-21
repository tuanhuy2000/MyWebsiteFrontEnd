import {
  CHANGE_INFOR,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../actions/userAction";

const INITIAL_STATE = {
  account: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_ERROR:
      return {
        ...state,
        account: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        account: {
          id: action.data.id,
          name: action.data.name,
          phoneNumber: action.data.phoneNumber,
          email: action.data.email,
          role: action.data.role,
        },
      };
    case LOGOUT:
      localStorage.removeItem("RefreshToken");
      document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      return {
        ...state,
        account: null,
      };
    case CHANGE_INFOR:
      let newAccount = state.account;
      newAccount.name = action.data.name;
      newAccount.phoneNumber = action.data.phoneNumber;
      newAccount.email = action.data.email;
      return {
        ...state,
        account: newAccount,
      };
    default:
      return state;
  }
};

export default userReducer;
