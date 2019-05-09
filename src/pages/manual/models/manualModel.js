import {
  querySentencesList,
  queryLabelsList,
  queryConnectionsList,
  queryProjectsList,
  deleteLabel,
  updateLabel,
  addLabel,
  deleteConnection,
  updateConnection,
  addConnection,
  saveAnnotation,
  queryAnnotation,
  exportProject,
} from "../services";

export default {
  namespace: "manualAnnotationDetail",
  state: {
    projectName: "",
    projectId: null,
    sentencesList: [],
    labelCategories: [],
    connectionCategories: [],
    projectsList: [],
    annotationData: {},
  },
  effects: {
    *queryProjectsList({ payload }, { call, put }) {
      const { data = [] } = yield call(queryProjectsList, payload);
      yield put({ type: "saveProjectsList", payload: data });
    },
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
    *deleteLabel({ payload }, { call }) {
      const { errCode } = yield call(deleteLabel, payload);
      return errCode;
    },
    *updateLabel({ payload }, { call }) {
      const { errCode } = yield call(updateLabel, payload);
      return errCode;
    },
    *addLabel({ payload }, { call }) {
      const { errCode } = yield call(addLabel, payload);
      return errCode;
    },
    *deleteConnection({ payload }, { call }) {
      const { errCode } = yield call(deleteConnection, payload);
      return errCode;
    },
    *addConnection({ payload }, { call }) {
      const { errCode } = yield call(addConnection, payload);
      return errCode;
    },
    *updateConnection({ payload }, { call }) {
      const { errCode } = yield call(updateConnection, payload);
      return errCode;
    },
    *saveAnnotation({ payload }, { call }) {
      const { errCode } = yield call(saveAnnotation, payload);
      return errCode;
    },
    *queryAnnotation({ payload }, { call, put }) {
      const { data = {} } = yield call(queryAnnotation, payload);
      yield put({ type: "saveAnnotationData", payload: data });
      return data;
    },
    *exportProject({ payload }, { call }) {
      yield call(exportProject, payload);
    },
  },
  reducers: {
    saveProjectsList: (state, { payload = [] }) => ({
      ...state,
      projectsList: payload,
    }),
    saveProjectInfo: (state, { payload = {} }) => ({
      ...state,
      projectName: payload.name,
      projectId: payload.projectId,
    }),
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
    saveAnnotationData: (state, { payload = {} }) => ({
      ...state,
      annotationData: payload,
    }),
  },
};
