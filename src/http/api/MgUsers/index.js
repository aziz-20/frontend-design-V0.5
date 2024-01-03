import request from '@/http/request'


export default {
   
    getUsers(userId) {
        return request({
            //url: `/dept/${deptId}`,
            url:'/user/'+ userId,
            method: 'get'
        })
    },
    
    addUsers(data) {
        return request({
            url: '/user/',
            method: 'post',
            data: data
        })
    }
    ,
    updateUsers(data) {
        return request({
            url: '/user/',
            method: 'put',
            data: data
        })
    },
    deleteUsers(id) {
        return request({
            url: '/user/' + id,
            method: 'delete',
            url: 'user/deleteAvatar',
            method: 'delete'
        })
    },
    deleteUsesAvatar(id) {
        return request({
            url: 'user/deleteAvatar',
            method: 'delete'
        })
    },
    listUsers(data) {
        return request({
            url: '/user/list',
            method: 'post',
            data: data
        })
    },

    UploadAvatar(data) {
        return request({
            url: '/user/uploadAvatar',
            method: 'post',
            data: data
        })
    },
        // querydepa(query) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(res.slice(0, 3));
    //           }
    //             , 300);
    //         }
    //             )
    // },
    
}