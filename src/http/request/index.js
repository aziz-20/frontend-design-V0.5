import axios from "axios";
import {requestIntersept,responseIntersept} from "../inspector";
import { ElMessage, ElMessageBox,ElNotification  } from 'element-plus'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const request = axios.create({
    
      baseURL: process.env.VUE_APP_API_BASE_URL,
      timeout: 500000
  })
 
request.interceptors.request.use((config) => requestIntersept(config), error => {
  console.log(error);
  return Promise.reject(error);
});

request.interceptors.response.use((config) => responseIntersept(config), error => {
  console.log('err' + error)
  let { message } = error;
  if (message == "Network Error") {
    message = "后端接口连接异常";
  } else if (message.includes("timeout")) {
    message = "系统接口请求超时";
  } else if (message.includes("Request failed with status code")) {
    message = "系统接口" + message.substr(message.length - 3) + "异常";
  }
  ElMessage({ message: message, type: 'error', duration: 5 * 10000 })
  return Promise.reject(error)

});

export default request
