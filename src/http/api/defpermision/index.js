import request from '@/http/request'

export default {

    permlist(data) {

        return request({
            url: '/defPerm/list',
            method: 'post',
            data: data
        })

    },
    getbyid(id) {
        return request({
            url: `/defPerm/${id}`,
            method: 'get'
        })
    },
    editDeper(data) {
        return request({
            url: "/defPerm",
            method: "put",
            data: data
        })

    },
    addDeper(data) {
        return request({
            url: "/defPerm",
            method: "post",
            data: data
        })

    },
    deletDeper(id) {
        return request({
            url: `/defPerm/${id}`,
            method: "delete",
        })
    },
    applyChange() {
        return request({
            url: '/defPerm/applyChange',
            method: 'get'
        })
    },
    resetFactory() {
        return request({
            url: '/defPerm/resetFactory',
            method: 'get'
        })
    }


}