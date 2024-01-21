import request from '@/http/request'


export default {
   
    getAddress(id) {
        return request({
            url:'/address/'+ id,
            method: 'get'
        })
    },
    
    addAddress(data) {
        return request({
            url: '/address',
            method: 'post',
            data: data
        })
    }
    ,
    updateAddress(data) {
        return request({
            url: '/address',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteAddress(id) {
        return request({
            url: '/address/' + id,
            method: 'delete'
        })
    },
    //plan data
    listAddress(data) {
        return request({
            url: '/address/list',
            method: 'post',
            data: data
        })
        
    },
}