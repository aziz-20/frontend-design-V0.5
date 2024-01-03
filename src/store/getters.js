const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    dict: state => state.dict.dict,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    permission_routes: state => state.permission.routes,
    topbarRouters:state => state.permission.topbarRouters,
    defaultRoutes:state => state.permission.defaultRoutes,
  //   sidebarRouters:state => state = [ {
  //     id: 1,
  //     name: 'home',
  //     path: '/index',
  //     meta: {
  //       icon: 'dashboard',
  //       title: 'home',
  //       affix: true
        
  //     },
  //     children: [
  //       {
  //         id: 4,
  //         name: 'home',
  //         path: '/index/home',
  //         meta: {
  //           icon: 'dashboard',
  //           title: 'home',
  //           affix: true
            
  //         },
          

  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'about',
  //     path: '/about/about',
  //     meta: {
  //      icon: 'edit',
  //      title: 'about',
  //      "noCache": false,
  //      "link": null

  //     }
  //   },
  //   {
  //     id: 3,
  //     name: 'Products',
  //     path: '/products/products',
  //     meta: {
  //       icon: 'edit',
  //       title: 'Products',
  //       "noCache": false,
  //       "link": null

  //     }
  //   },
  //   {
  //     id: 4,
  //     name: 'defaultpermission',
  //     path: '/defaultpermission/defaultpermission',
  //     meta: {
  //       icon: 'edit',
  //       title: 'defaultpermission',
  //       "noCache": false,
  //       "link": null

  //     }
  //   }
  //   ,
  //   {
  //     id: 5,
  //     name: 'permission',
  //     path: '/permission/permission',
  //     meta: {
  //       icon: 'edit',
  //       title: 'permission',
  //       "noCache": false,
  //       "link": null

  //     }
  //   },
  //   {
  //     id: 5,
  //     name: 'grpermission',
  //     path: '/grpermission/grpermission',
  //     meta: {
  //       icon: 'edit',
  //       title: 'grpermission',
  //       "noCache": false,
  //       "link": null

  //     }
  //   }
  // ]
  sidebarRouters:state => state.permission.sidebarRouters,

     
  }
  export default getters
  