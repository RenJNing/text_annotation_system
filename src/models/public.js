import { login, logout } from "../services/public";

export default {
  namespace: "public",
  state: {
    username: "Unknown",
    role: "",
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { data = {}, errCode } = yield call(login, payload);
      yield put({ type: "save/loginInfo", payload: data });
      return errCode;
    },
    *logout({ payload }, { call }) {
      const { errCode } = yield call(logout);
      return errCode;
    },
  },
  reducers: {
    "save/loginInfo": (state, { payload: { userName, role } = {} }) => ({
      ...state,
      username: userName,
      role,
    }),
  },
};
