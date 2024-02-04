import { createRouter, createWebHistory } from 'vue-router'


import Layout from "@/Layout"


 export const dynamicRoutes = [ ]
 export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    // component: () => import('@/views/register'),
    hidden: true
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "not-found",
  //   component: () => import('@/views/error/404'),
  // },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true

  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    hidden:false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path : '/about',
    component : Layout,
    hidden:false,
    children : [
      {
        path : 'about',
        name : 'about',
        hidden:false,
        component : () => import('@/views/about'),
        meta : {title : 'about', icon : 'dashboard'}
        
      }
    ]
  } ,
  // {
  //   path : '/permission',
  //   component : Layout,
  //   hidden:false,
   
  //   children : [
  //     {
  //       path : 'permission',
  //       hidden:false,
  //       name : 'permission',
  //       component : () => import('@/views/system/permission'),
  //       meta : {title : 'permission', icon : 'dashboard'}
  //     }
  //   ]
  // },
  // {
  //   path : '/grpermission',
  //   component : Layout,
  //   hidden:false,
   
  //   children : [
  //     {
  //       path : 'grpermission',
  //       hidden:false,
  //       name : 'grpermission',
  //       component : () => import('@/views/system/grpermission'),
  //       meta : {title : 'grpermission', icon : 'dashboard'}
  //     }
  //   ]
  // },
  
  // ,
  // {
  //   path: '/products',
  //   component : Layout,
  //   hidden : false,
  //   children:[
  //     {  
  //         hidden:false,
  //         path : 'products',
  //         name : 'products',
  //         component :() =>import('@/views/system/dept'),
  //         meta : {title : 'product', icon : 'dashboard', affix : false ,"noCache": true,
  //         "link": null},
          
  //     }

  //   ]
  // },
  // {
  //   path : '/menu',
  //   component : Layout,
   
  //   children : [
  //     {
  //       path : 'menu',
  //       name : 'Menu',
  //       component : () => import('@/views/system/menu'),
  //       meta : {title : 'Menu', icon : 'dashboard'}
  //     }
  //   ]
  // },
  // {
  //   path : '/jop',
  //   component : Layout,
   
  //   children : [
  //     {
  //       path : 'jop',
  //       name : 'Job',
  //       component : () => import('@/views/system/jop'),
  //       meta : {title : 'job', icon : 'dashboard', affix : false ,"noCache": true,
  //       "link": null}
  //     }
  //   ]
  // },
  // {
  //   path: '/dept',
  //   component : Layout,
  //   hidden : false,
  //   children:[
  //     {  
  //         path : 'dept',
  //         name : 'Departments',
  //         component :() =>import('@/views/system/dept'),
  //         meta : {title : 'departments', icon : 'dashboard', affix : false ,"noCache": true,
  //         "link": null},
          
  //     }

  //   ]
  // },
  // {
  //   path: '/MgUsers',
  //   component : Layout,
  //   hidden : false,
  //   children:[
  //     {  
  //         path : 'MgUsers',
  //         name : 'MgUsers',
  //         component :() =>import('@/views/system/MgUsers'),
  //         meta : {title : 'Users', icon : 'dashboard', affix : false ,"noCache": true,
  //         "link": null},   
  //     }

  //   ]
  // },
  // {
  //   path: '/role',
  //   component : Layout,
  //   hidden : false,
  //   children:[
  //     {  
  //         path : 'role',
  //         name : 'Roles',
  //         component :() =>import('@/views/system/role'),
  //         meta : {title : 'Roles Management', icon : 'dashboard', affix : false ,"noCache": true,
  //         "link": null},   
  //     }

  //   ]
  // },
]

const router = createRouter({
  history:  createWebHistory(),
  routes:constantRoutes
})

export default router
