// import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
// import { getRouters } from '@/api/menu'
// import Layout from '@/layout/index'
// import ParentView from '@/components/ParentView'
// import InnerLink from '@/layout/components/InnerLink'
import Layout from '@/Layout/index'
import User from '@/http/api/user'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    routePerms: []
  },
  mutations: {
    SET_ROUTES_PERMS: (state,perm) =>{
      state.routePerms = perm
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        // 向后端请求路由数据
        User.getmenue().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.result.data))

          const r = {
            id: 1545,
            path: '/system',
            hidden: 1,
            type: 0,
            meta: {
              icon: 'dashboard',
              title: 'System',
            },
            component: 'Layout',
            children: [
              {
                id: 1223,
                name: 'grpermission',
                path: 'grpermission',
                type: 0,
                hidden: 1,
                meta: {
                  icon: 'permission',
                  title: 'Group permission',
                },
                component: 'system/grpermission',
                children: [
                  {
                    id: 13,
                    name: 'gdrpermission',
                    path: 'g1',
                    type: 1,
                    hidden: 1,
                    meta: {
                      icon: 'permission',
                      title: 'g1',
                    },
                    component: 'system/grpermission',
                  },
                  {
                    id: 1213,
                    name: 'gdrpermission',
                    path: 'g2',
                    type: 0,
                    hidden: 1,
                    meta: {
                      icon: 'permission',
                      title: 'g2',
                    },
                    component: 'system/grpermission',
                    children: [
                      {
                        id: 13,
                        name: 'gdrpermission',
                        path: 'grpermission',
                        type: 1,
                        hidden: 1,
                        meta: {
                          icon: 'permission',
                          title: 'g3',
                        },
                        component: 'system/grpermission',
                      }, {
                        id: 153,
                        name: 'gdrpermission',
                        path: 'grpermission',
                        type: 1,
                        hidden: 1,
                        meta: {
                          icon: 'permission',
                          title: 'g12',
                        },
                        component: 'system/grpermission',
                      }
                    ]
                  }
                ]

              },
              {
                id: 123,
                name: 'cudatascope',
                path: 'cudatascope',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'custompermission',
                  title: 'Custom permission',
                },
                component: 'system/cudatascope',
              },
              {
                id: 888,
                name: 'defaultpermission',
                path: 'defaultpermission',
                type: 1,
                hidden: 1,
                component: 'system/defaultpermission',
                meta: { title: 'defaultpermission', icon: 'dashboard' }
              },
              {
                id: 881,
                name: 'permission',
                path: 'permission',
                type: 1,
                hidden: 1,
                component: 'system/permission',
                meta: { title: 'permission', icon: 'dashboard' }

              },
              {
                id: 124,
                name: 'jop',
                path: 'jop',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'job',
                  title: 'jop',
                },
                component: 'system/jop',
              },
              {
                id: 125,
                name: 'dept',
                path: 'dept',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'tab',
                  title: 'dept',
                },
                component: 'system/dept',
              },
              {
                id: 126,
                name: 'menu',
                path: 'menu',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'nested',
                  title: 'menu',
                },
                component: 'system/menu',
              },
              {
                id: 127,
                name: 'role',
                path: 'role',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'skill',
                  title: 'role',
                },
                component: 'system/role',
              },
              {
                id: 128,
                name: 'MgUsers',
                path: 'MgUsers',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'user',
                  title: 'MgUsers',
                },
                component: 'system/MgUsers',
              },
              {
                id: 129,
                name: 'TaskControl',
                path: 'TaskControl',
                hidden: 1,
                type: 1,
                meta: {
                  icon: 'log',
                  title: 'TaskControl',
                },
                component: 'system/TaskControl',
              },
              {
                id: 131,
                name: 'taskLogs',
                path: 'taskLogs',
                hidden: 1,
                type: 1,
                meta:
                {
                  icon: 'log',
                  title: 'TaskLogs',
                },
                component: 'system/taskLogs',
              },
              {
                id: 65,
                path: 'permission',
                name: 'permission',
                type: 1,
                component: 'system/permission',
                meta: { title: 'permission', icon: 'dashboard' }
              },
              {
                id: 101,
                path: 'address',
                name: 'address',
                type: 1,
                hidden: 1,
                component: 'system/address',
                meta: { title: 'Addresses', icon: 'location' }
              },
              // {
              //   id: 132,
              //   name: 'taskLogs',
              //   path: 'taskLogs',
              //   hidden: 1,
              //   meta: 
              //   {
              //     icon: 'log',
              //     title: 'TaskLogs',
              //   },
              //   component: 'system/taskLogs',
              // } ,

            ]

          }
          const sidebarRoutes = convertToSidebarRouters(sdata)
          sidebarRoutes.push(r)
          const rewriteRoutes = asy(sdata)
          console.log(rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
          resolve(rewriteRoutes)
        }).catch(error => {
          reject(error)
        })
      })
    },


    //save each route's permission into store
    RoutePerms({commit},perm){
      commit('SET_ROUTES_PERMS',perm)
        }
  },
}

// 遍历后台传来的路由字符串，转换为组件对象
// function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
//   return asyncRouterMap.map(route => {
//     const {
//       menuId,
//       parentId,
//       name,
//       orderNum,
//       type,
//       path,
//       component,
//       icon,
//       remark,
//       hierarchy,
//       children,
//       parentName
//     } = route;

//     // Transform your data structure to match the expected structure in the code
//     const transformedRoute = {
//       menuId,
//       parentId,
//       name,
//       orderNum,
//       type,
//       path,
//       component: component || 'Layout', // Use 'Layout' if component is null
//       icon,
//       remark,
//       hierarchy,
//       children,
//       parentName
//     };

//     if (type && transformedRoute.children) {
//       transformedRoute.children = filterChildren(transformedRoute.children);
//     }

//     if (transformedRoute.component === 'Layout') {
//       transformedRoute.component = Layout;
//     } else if (transformedRoute.component === 'ParentView') {
//       transformedRoute.component = ParentView;
//     } else if (transformedRoute.component === 'InnerLink') {
//       transformedRoute.component = InnerLink;
//     } else {
//       transformedRoute.component = loadView(transformedRoute.component);
//     }

//     if (transformedRoute.children != null && transformedRoute.children && transformedRoute.children.length) {
//       transformedRoute.children = filterAsyncRouter(transformedRoute.children, transformedRoute, type);
//     } else {
//       delete transformedRoute['children'];
//       delete transformedRoute['redirect'];
//     }

//     return transformedRoute;
//   });
// }
// function filterChildren(childrenMap, lastRouter = false) {
//   var children = []
//   childrenMap.forEach((el, index) => {
//     if (el.children && el.children.length) {
//       if (el.component === 'ParentView' && !lastRouter) {
//         el.children.forEach(c => {
//           c.path = el.path + '/' + c.path
//           if (c.children && c.children.length) {
//             children = children.concat(filterChildren(c.children, c))
//             return
//           }
//           children.push(c)
//         })
//         return
//       }
//     }
//     if (lastRouter) {
//       el.path = lastRouter.path + '/' + el.path
//     }
//     children = children.concat(el)
//   })
//   return children
// // }
// function filterAsyncRouter(asyncRouterMap, lastRouter = false, filterType = false) {
//   return asyncRouterMap.map(route => {
//     const {
//       menuId,
//       parentId,
//       name,
//       orderNum,
//       type,
//       path,
//       component,
//       icon,
//       remark,
//       hierarchy,
//       children,
//       parentName
//     } = route;

//     if (type === filterType || filterType === false) {
      // Include only routes with the specified type
      // const transformedRoute = {
      //   menuId,
      //   parentId,
      //   name,
      //   orderNum,
      //   type,
      //   path: parentId === 0 ? '/' + path : path,
        // component, // Use 'Layout' if component is null
    //     icon,
    //     meta: {
    //       icon: icon,
    //       title: name,
    //       affix: true,
    //     },
    //     remark,
    //     hierarchy,
    //     children,
    //     parentName
    //   };

    //   if (filterType && transformedRoute.children) {
    //     transformedRoute.children = filterChildren(transformedRoute.children, filterType);
    //   }

    //   if (transformedRoute.component === 'Layout') {
    //     transformedRoute.component = Layout;
    //   } else if (transformedRoute.component === 'ParentView') {
    //     transformedRoute.component = ParentView;
    //   } else if (transformedRoute.component === 'InnerLink') {
    //     transformedRoute.component = InnerLink;
    //   } else {
    //     transformedRoute.component = loadView(transformedRoute.component);
    //   }

    //   if (transformedRoute.children != null && transformedRoute.children && transformedRoute.children.length) {
    //     transformedRoute.children = filterAsyncRouter(transformedRoute.children, transformedRoute, filterType);
    //   } else {
    //     delete transformedRoute['children'];
    //     delete transformedRoute['redirect'];
    //   }

    //   return transformedRoute;
    // }

    // return null; // Exclude routes with type different from the specified filterType
  // }).filter(route => route !== null); // Filter out null values
// }

// function filterChildren(childrenMap, filterType) {
//   var children = [];
//   childrenMap.forEach((el, index) => {
//     if (el.children && el.children.length) {
//       if (el.component === 'ParentView') {
//         el.children.forEach(c => {
//           c.path = el.path + '/' + c.path;
//           if (c.children && c.children.length) {
//             children = children.concat(filterChildren(c.children, filterType));
//             return;
//           }
//           children.push(c);
//         });
//         return;
//       }
//     }
//     if (filterType && el.type === filterType) {
//       if (el.component !== 'ParentView') {
//         el.component = loadView(el.component);
//       }
//       if (el.children != null && el.children && el.children.length) {
//         el.children = filterChildren(el.children, filterType);
//       } else {
//         delete el['children'];
//         delete el['redirect'];
//       }
//       children.push(el);
//     }
//   });
//   return children;
// }


// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {

    res.push(route)

  })
  return res
}

// export const loadView = async (view) => {
//   const viewPath = `@/views/${view}`;

//   if (process.env.NODE_ENV === 'development') {
//     console.log('Development mode');

//     // Use require in development
//     try {
//       const module = await import(`@/views/${view}`);
//       return (resolve) => module;
//     } catch (error) {
//       console.error(`Error loading view: ${viewPath}`, error);
//       return (resolve) => `${view}` // Return an empty function in case of an error
//     }
//   } else {
//     console.log('Production mode');

//     // Use import in production
//     try {
//       return () => import(`@/views/${view}`);
//     } catch (error) {
//       console.error(`Error loading view: ${viewPath}`, error);
//       return () => Promise.resolve(); // Return a resolved promise in case of an error
//     }
//   }
// };
export const loadView = (view) => {
  // if (process.env.NODE_ENV === 'development') {
  //     console.log('Development mode')
  //   return (resolve) => require([`@/views/${view}`], resolve)
  // } else {
  //   // 使用 import 实现生产环境的路由懒加载
  //   return () => import(`@/views/${view}`)

  let a = true

  try {
    console.log(`@/views/${view}/index.vue`)
    return  require(`@/views/${view}/index.vue`).default;
  } catch (e) {
    a = false
  }
  if (a) {
    console.log(view)
    return  require('@/views/index.vue').default;
  }

}



function convertToSidebarRouters(data, targetType = null) {
  const sidebarRouters = [];

  // Helper function to recursively process children
  function processChildren(menu) {
    const children = [];
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(item => {
        // Check if the item should be included based on targetType
        if (targetType === null || targetType === item.type) {
          const childItem = {
            parentId: item.parentId,
            orderNum: item.orderNum,
            type: item.type,
            id: item.menuId,
            name: item.name,
            path: item.path,
            hidden: item.hidden,
            redirect: item.redirect,
            meta: {
              icon: item.icon || 'dashboard',
              title: item.name,
              affix: true,
            },
            component: item.component === 'Layout' ? Layout : loadView(item.component),
            remark: item.remark,
            hierarchy: item.hierarchy,
            parentName: item.parentName,
            children: processChildren(item),
          };
          children.push(childItem);
        }
      });
    }
    return children;
  }

  data.forEach(item => {


    // Check if the item should be included based on targetType
    if (targetType === null || targetType === item.type) {
      const sidebarItem = {
        parentId: item.parentId,
        orderNum: item.orderNum,
        type: item.type,
        id: item.menuId,
        name: item.name,
        path: item.parentId === 0 ? '/' + item.path : item.path,
        hidden: item.hidden,
        redirect: item.redirect,
        meta: {
          icon: item.icon || 'dashboard',
          title: item.name,
          affix: true,
        },
        component: item.component === 'Layout' ? Layout : loadView(item.component),
        remark: item.remark,
        hierarchy: item.hierarchy,
        parentName: item.parentName,
        children: processChildren(item),
      };

      sidebarRouters.push(sidebarItem);
    }
  });

  return sidebarRouters;
}

function asy(asyncRouterMap) {
  const newArr = []
  asyncRouterMap.forEach((item, index) => {
    const component =item.component === 'Layout' ? Layout : loadView(item.component)
    let routeTemplet = {
      path: item.parentId === 0 ? '/' + item.path : item.path,
      name: item.name,
      parentId: item.parentId,
      type: item.type,
      menuId: item.menuId,
      permission: item.permission,
      redirects: item.redirect,
      hidden: item.hidden,
      // redirect: item.redirect,
      component: component,
      meta: { title: item.name, icon: 'dashboard' }
    }
    if (item.children && item.children.length) {
      routeTemplet.children = asy(item.children)
    }
    newArr.push(routeTemplet)
  })
  return newArr
}



export default permission
