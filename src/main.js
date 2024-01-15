import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import './premision'
import Element from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/assets/styles/global.css' // global css
import '@/assets/icons' // icon
import SvgIcon from '@/components/SvgIcon'// svg component
import http from './http'
import plugins from './plugins'
import RightToolbar from "@/components/RightToolbar"



import Vue3Progress from "vue3-progress";
const options = {
  position: "fixed",
  height: "3px",
  color: "green",
};





export const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$http = http
app.use(store).use(router).component('svg-icon', SvgIcon).use(Vue3Progress, options).use(Element,{
    size:'medium' // set element-ui default size
  }).use(plugins).mount('#app')
