import { post } from "../utils/request";

/**
 * 登陆
 */
export const login = ({ username, password }) =>
  post("/api/login", { username, password });

/**
 * 注册
 */
export const register = ({ username, password }) =>
  post("/api/register", { username, password });

/**
 * 注销
 */
export const logout = () => post("/api/logout");
