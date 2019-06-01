import { post } from "../../../utils/request";

/**
 * User查询
 */
export const queryUsersList = () => post("/api/queryUsersList");

/**
 * User分配角色
 */
export const assignRole = ({ userId, role }) =>
  post("/api/assignRole", { userId, role });
