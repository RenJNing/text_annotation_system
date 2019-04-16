import {
  querySentencesList,
  queryLabelsList,
  queryConnectionsList,
} from "../services";

export default {
  namespace: "manualAnnotationDetail",
  state: {
    sentencesList: [],
    labelCategories: [],
    connectionCategories: [],
  },
  effects: {
    *querySentencesList({ payload }, { call, put }) {
      const { data = [] } = yield call(querySentencesList, payload);
      yield put({ type: "saveSentencesList", payload: data });
      return data;
    },
    *queryLabelsList({ payload }, { call, put }) {
      const { data = [] } = yield call(queryLabelsList, payload);
      yield put({ type: "saveLabelsList", payload: data });
    },
    *queryConnectionsList({ payload }, { call, put }) {
      const { data = [] } = yield call(queryConnectionsList, payload);
      yield put({ type: "saveConnectionsList", payload: data });
    },
  },
  reducers: {
    saveSentencesList: (state, { payload = [] }) => ({
      ...state,
      sentencesList: payload,
    }),
    saveLabelsList: (state, { payload = [] }) => ({
      ...state,
      labelCategories: payload,
    }),
    saveConnectionsList: (state, { payload = [] }) => ({
      ...state,
      connectionCategories: payload,
    }),
  },
};
