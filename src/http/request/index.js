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
    message = "The backend interface is abnormally connected";
  } else if (message.includes("timeout")) {
    message = "The system interface request timed out";
  } else if (message.includes("Request failed with status code")) {
    message = "System interfaces" + message.substr(message.length - 3) + "abnormal";
  }
  ElMessage({ message: message, type: 'error', duration: 5 * 10000 })
  return Promise.reject(error)

});
export default request
