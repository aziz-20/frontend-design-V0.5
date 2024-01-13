import request from '@/http/request'


export default {

    deleteUsesAvatar(id) {
        return request({
            url: 'user/deleteAvatar',
            method: 'delete'
        })
    },
    UploadAvatar(data) {
        return request({
            url: '/user/uploadAvatar',
            method: 'post',
            data: data
        })
    },
    image(id) {
        return  'http://181.215.79.209:9005' + id
    }

}