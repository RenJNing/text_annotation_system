import { post } from "@cbd/fetch-web";

/**
 * Project查询
 */
export const queryProjectsList = () => post("/api/manual/queryProjectsList");

/**
 * Project导出
 */
export const exportProject = () => post("/api/manual/exportProject");

/**
 * 句子列表查询
 */
export const querySentencesList = projectId =>
  post("/api/manual/querySentencesList", { projectId });

/**
 * 实体类型查询
 */
export const queryLabelsList = projectId =>
  post("/api/manual/queryLabelsList", { projectId });

/**
 * 实体类型修改
 */
export const updateLabel = ({ labelId, text, color, bordercolor }) =>
  post("/api/manual/updateLabel", { labelId, text, color, bordercolor });

/**
 * 实体类型新增
 */
export const addLabel = ({
  projectId,
  label: { text, color, bordercolor } = {},
}) =>
  post("/api/manual/addLabel", {
    projectId,
    label: { text, color, bordercolor },
  });

/**
 * 实体类型删除
 */
export const deleteLabel = labelId =>
  post("/api/manual/deleteLabel", { labelId });

/**
 * 关系类型查询
 */
export const queryConnectionsList = projectId =>
  post("/api/manual/queryConnectionsList", { projectId });

/**
 * 关系类型删除
 */
export const deleteConnection = connectionId =>
  post("/api/manual/deleteConnection", { connectionId });

/**
 * 关系类型修改
 */
export const updateConnection = ({ connectionId, text }) =>
  post("/api/manual/updateConnection", {
    connectionId,
    text,
  });

/**
 * 关系类型新增
 */
export const addConnection = ({ projectId, connection: { text } = {} }) =>
  post("/api/manual/addConnection", {
    projectId,
    connection: { text },
  });

/**
 * Annotation新增
 */
export const saveAnnotation = ({
  projectId,
  sentenceId,
  labels = [],
  connections = [],
}) =>
  post("/api/manual/saveAnnotation", {
    projectId,
    sentenceId,
    labels,
    connections,
  });

/**
 * Annotation查询
 */
export const queryAnnotation = ({ projectId, sentenceId }) =>
  post("/api/manual/queryAnnotation", { projectId, sentenceId });
