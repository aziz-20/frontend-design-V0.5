import request from '@/http/request'

export default {

    permlist(data) {

        return request({
            url: '/perm/list',
            method: 'post',
            data: data
        })

    },
    getbyid(id) {
        return request({
            url: `/Perm`,
            method: 'get',
            params: { id }
        })
    },
    editDeper(data) {
        return request({
            url: "/perm",
            method: "put",
            data: data
        })

    },
    addDeper(data) {
        return request({
            url: "/perm",
            method: "post",
            data: data
        })

    },
    deletDeper(id) {
        return request({
            url: `/perm/${id}`,
            method: "delete",
            
        })
    },
    


}