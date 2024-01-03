import request from '@/http/request'

export default {

    permlistHierarchy(data) {

        return request({
            url: 'permGroup/listHierarchy',
            method: 'post',
            data: data
        })

    },
    getbyid(id) {
        return request({
            url: `/permGroup/${id}`,
            method: 'get'
        })
    },
    editDeper(data) {
        return request({
            url: "/permGroup",
            method: "put",
            data: data
        })

    },
    addDeper(data) {
        return request({
            url: "/permGroup",
            method: "post",
            data: data
        })

    },
    deletDeper(id) {
        return request({
            url: `/permGroup/${id}`,
            method: "delete",
        })
    },
    


}