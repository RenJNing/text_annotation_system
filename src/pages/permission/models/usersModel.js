import { queryUsersList, assignRole } from "../services/usersService";

export default {
  namespace: "usersDetail",
  state: {
    usersList: [],
  },
  effects: {
    *queryUsersList({ payload }, { call, put }) {
      const { data = [] } = yield call(queryUsersList, payload);
      yield put({ type: "saveUsersList", payload: data });
    },
    *assignRole({ payload }, { call }) {
      const { errCode } = yield call(assignRole, payload);
      return errCode;
    },
  },
  reducers: {
    saveUsersList: (state, { payload = [] }) => ({
      ...state,
      usersList: payload,
    }),
  },
};
