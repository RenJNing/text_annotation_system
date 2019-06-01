import { post as postRequest } from "@cbd/fetch-web";
import router from "umi/router";

const checkCode = res => {
  const { errCode } = res;
  if (errCode === -401) {
    router.push("/login");
  }
  if (errCode === -403) {
    router.push("/exception/403");
  }
  return res;
};

export const post = (url, params) => postRequest(url, params).then(checkCode);
