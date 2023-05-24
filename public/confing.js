/*
 * @Description: 
 * @Author: jmguo2
 * @Date: 2023-03-13 11:24:16
 * @LastEditors: jmguo2
 * @LastEditTime: 2023-03-13 11:24:23
 */
// 开发环境
window.config = {
  adminServerUrl: 'http://10.41.170.230:9020/admin', // 管理端后端接口服务地址
  ssoLoginUrl: 'http://10.41.170.230:9011/sso/login', // 单点登录前端地址
  adminClientUrl: 'http://localhost:8081', // 管理端前端应用地址
  pcWebClientUrl: 'http://localhost:8083' //PC Web学员前端
};

// 阿里云测试环境
// window.config = {
//   adminServerUrl: 'https://test-api.izfou.com/admin', // 管理端后端接口服务地址
//   adminClientUrl: 'http://localhost:8081', // 管理端前端应用地址
//   ssoLoginUrl: 'https://test-sso.izfou.com/sso/login', // 单点登录前端地址
//   pcWebClientUrl: 'http://localhost:8083', //PC Web学员前端
// };

//UAT
// window.config = {
//   adminServerUrl: "https://uat-api.izfou.com/admin", // 管理端后端接口服务地址
//   adminClientUrl: "http://localhost:8081", // 管理端前端应用地址
//   ssoLoginUrl: "https://uat-sso.izfou.com/sso/login", // 单点登录前端地址
//   pcWebClientUrl: 'http://localhost:8083', //PC Web学员前端
// };

// 生产环境
// window.config = {
//   adminServerUrl: 'https://api.izfou.com/admin', // 管理端后端接口服务地址
//   ssoLoginUrl: 'https://sso.izfou.com/sso/login', // 单点登录前端地址
//   adminClientUrl: 'http://localhost:8081', // 管理端前端应用地址
//   pcWebClientUrl: 'http://localhost:8083' //PC Web学员前端
// };
