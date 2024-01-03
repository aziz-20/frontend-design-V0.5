import request from '@/http/request'


export default {
   
    getRolebyId(roleId) {
        return request({
            url:'/role/'+ roleId,
            method: 'get'
        })
    },
    
    addRole(data) {
        return request({
            url: '/role',
            method: 'post',
            data: data
        })
    }
    ,
    updateRole(data) {
        return request({
            url: '/role',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteRole(id) {
        return request({
            url: '/role/' + id,
            method: 'delete'
        })
    }
    ,
    //plan data
    listRole(data) {
        
        return request({
            url: '/role/list',
            method: 'post',
            data: data
        })
    },

}