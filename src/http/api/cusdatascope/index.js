import request from '@/http/request'

export default {

    customDatascopelist(data) {

        return request({
            url: '/customDatascope/list',
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
    edit(data) {
        return request({
            url: "/customDatascope",
            method: "put",
            data: data
        })

    },
    add(data) {
        return request({
            url: "/customDatascope",
            method: "post",
            data: data
        })

    },
    delet(id) {
        return request({
            url: `/customDatascope/${id}`,
            method: "delete",
        })
    },
    


}