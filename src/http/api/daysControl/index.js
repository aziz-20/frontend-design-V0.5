import request from '@/http/request'


export default {
   
    daysList(data) {
        return request({
            url:'/day/list',
            method: 'post',
            data: data
        })
    },
}