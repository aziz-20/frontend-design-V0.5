import request from '@/http/request'


export default {
   
    uploadImage(data) {
        return request({
            url:'/upload/upload',
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }

        })
    },
    deleteUsesAvatar(id) {
        return request({
            url: 'user/deleteAvatar',
            method: 'delete'
        })
    },

    image(id) {
        return  'http://181.215.79.209:9005' + id
    }

    
   

}