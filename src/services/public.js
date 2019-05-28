import { post } from "@cbd/fetch-web";

/**
 * 登陆
 */
export const login = ({ username, password }) =>
  post("/api/login", { username, password });

/**
 * 注销
 */
export const logout = () => post("/api/logout");
