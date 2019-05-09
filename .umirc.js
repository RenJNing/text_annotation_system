import umircConfig from "@cbd/umirc-dva";

const umircExport = {
  ...umircConfig,
  publicPath: "/",
  proxy: {
    // 需要转发的API前缀
    "/api": {
      target: "http://127.0.0.1:8080", //转发接口地址
      changeOrigin: true,
      secure: false,
      bypass: req => {
        /* 不需要转发的情况 */
        // if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
        //   return req.originalUrl;
        // }
        return false;
      },
    },
  },
};
export default umircExport;
