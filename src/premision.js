import router from './router'
import store from './store'
import { getToken, removeToken } from '@/utils/auth'
import { isRelogin } from '@/http/inspector'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function mapRouteToPermission(route, permissions) {
    route.forEach(item => {
      const matchingPermission = permissions.find(p => p.menuId === item.menuId);
  
      if (matchingPermission) {
        item.meta ={...item.meta,perms: matchingPermission.perms} ;
        // item.permission = {
        //   menuId: matchingPermission.menuId,
        //   perms: matchingPermission.perms,
        // };
      }
  
      if (item.children && item.children.length > 0) {
        item.children = mapRouteToPermission(item.children, permissions);
      }
    });

    return route;
  }
NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/register']
router.beforeEach((to, from, next) => {
    NProgress.start()
     console.log(getToken())
    if (getToken()) {
         console.log('已登录')
        to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
        if (to.path === '/login') {
            
            next({ path: '/' })
            NProgress.done()
           

        }
        else if (store.getters.permissions.length === 0) {
            isRelogin.show = true
            store.dispatch('GetInfo').then((res) => {

                isRelogin.show = false
                store.dispatch('getperms').then((perm) => {
                    console.log(perm)
                    store.dispatch('GenerateRoutes').then(res => {
                     let p = mapRouteToPermission(res,perm.result)
                     console.log(p)
                     p.forEach(p=>router.addRoute(p))
        
                        next({...to})
                      // next()
                    })

                })
                console.log('已登录')

            }).catch(() => {
                store.dispatch('LogOut').then(() => {
                    Message.error(err)
                    next({ path: '/' })
                  })
                // removeToken()
                // console.log(getToken())
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
            next(`/login`) 
            NProgress.done()

        }
    }


}
)

router.afterEach(() => {
    NProgress.done()
  })

  
