import { login, logout, register } from "../services/public";

export default {
  namespace: "public",
  state: {
    username: "Unknown",
    roleLevel: 0,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { data = {}, errCode } = yield call(login, payload);
      yield put({ type: "save/loginInfo", payload: data });
      return errCode;
    },
    *register({ payload }, { call }) {
      const { errCode } = yield call(register, payload);
      return errCode;
    },
    *logout({ payload }, { call }) {
      const { errCode } = yield call(logout);
      return errCode;
    },
  },
  reducers: {
    "save/loginInfo": (state, { payload: { userName, role } = {} }) => {
      let roleLevel;
      switch (role) {
        case "guest":
          roleLevel = 1;
          break;
        case "user":
          roleLevel = 2;
          break;
        case "admin":
          roleLevel = 3;
          break;
        default:
          roleLevel = 0;
      }
      return {
        ...state,
        username: userName,
        roleLevel,
      };
    },
  },
};
