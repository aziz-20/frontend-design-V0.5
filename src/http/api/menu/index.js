import request from '@/http/request'


export default {
   
    getMenu(menuId) {
        return request({
            
            url:'/menu/'+ menuId,
            method: 'get'
        })
    },
    
    addMenu(data) {
        return request({
            url: '/menu',
            method: 'post',
            data: data
        })
    }
    ,
    updateMenu(data) {
        return request({
            url: '/menu',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteMenuid(id) {
        return request({
            url: '/menu/' + id,
            method: 'delete'
        })
    }
    ,
    // querydepa(query) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(res.slice(0, 3));
    //           }
    //             , 300);
    //         }
    //             )
    // },

    //plan data
    normal_listMenu(data) {
        
        return request({
            url: '/menu/list',
            method: 'post',
            data: data
        })
    },

    MenuHierarchy(data) {
        return request({
            url: '/menu/listHierarchy',
            method: 'post',
            data: data
        })
    }
    ,

}