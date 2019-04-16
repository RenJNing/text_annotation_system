import { post } from "@cbd/fetch-web";

/**
 * 句子列表查询
 */
export const querySentencesList = () => post("/api/manual/querySentencesList");

/**
 * 实体类型查询
 */
export const queryLabelsList = () => post("/api/manual/queryLabelsList");

/**
 * 关系类型查询
 */
export const queryConnectionsList = () =>
  post("/api/manual/queryConnectionsList");
