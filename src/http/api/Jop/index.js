import request from '@/http/request'


export default {
   
    getJob(jobId) {
        return request({
            url:'/job'+ deptId,
            method: 'get'
        })
    },
    
    addJob(data) {
        return request({
            url: '/job',
            method: 'post',
            data: data
        })
    }
    ,
    updateJob(data) {
        return request({
            url: '/job',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteJob(id) {
        return request({
            url: '/job/' + id,
            method: 'delete'
        })
    }
    ,
    //plan data
    listJob(data) {
        
        return request({
            url: '/job/list',
            method: 'post',
            data: data
        })
    },

  
}