import request from '@/http/request'

export default {
    login(data) {
        return request({
            url: '/auth/login',
            method: 'post',
            data
        })
    },
    logout(data) {
        return request({
            url: '/auth/logout',
            method: 'post',
            // data
            
        })
    },
    getInfo() {
        return request({
            url: '/auth/getCurrentUserInfo',
            method: 'get',
            
        })
    },
    userperm() {
        return request({
            url: '/userPerms',
            method: 'get',
            
        })
    },
    getmenue(){
        return request({
            url: '/menu/listHierarchy',
            method: 'post',
            data: {'pageNo':0,'pageSize':0}
            
        })
    }
    
}