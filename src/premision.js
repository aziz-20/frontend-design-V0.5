import router from './router'
import store from './store'
import { getToken, removeToken } from '@/utils/auth'
import { isRelogin } from '@/http/inspector'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
    NProgress.start()
    
    if (getToken()) {

        to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
        if (to.path === '/login') {
            
            next({ path: '/' })
            NProgress.done()
           

        }
        else if (store.getters.permissions.length === 0) {
            isRelogin.show = true
            store.dispatch('GetInfo').then((res) => {

                isRelogin.show = false
                store.dispatch('getperms').then((res) => {

                    store.dispatch('GenerateRoutes').then(res => {

                        next({...to})
                    })

                })
                console.log('已登录')

            }).catch(() => {
                // store.dispatch('LogOut').then(() => {
                //     Message.error(err)
                //     next({ path: '/' })
                //   })
                removeToken()
                console.log(getToken())

            })
        }
        else {
            next()
        }


    }
    else {
        if (whiteList.indexOf(to.path) !== -1) {
            //path is in whitelist
            next()
        } else {
            next(`/login`) // 否则全部重定向到登录页
            NProgress.done()

        }
    }


}
)
router.afterEach(() => {
    NProgress.done()
  })
