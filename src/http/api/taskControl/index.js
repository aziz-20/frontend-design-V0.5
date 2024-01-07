import request from '@/http/request'


export default {
   
    getTaskId(roleId) {
        return request({
            url:'/task/'+ roleId,
            method: 'get'
        })
    },
    
    addTask(data) {
        return request({
            url: '/task',
            method: 'post',
            data: data
        })
    }
    ,
    updateTask(data) {
        return request({
            url: '/task',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteTask(id) {
        return request({
            url: '/task/' + id,
            method: 'delete'
        })
    }
    ,
    //plan data
    listTask(data) {
        return request({
            url: '/task/list',
            method: 'post',
            data: data
        })
        
    },
    listTaskLogs(data) {
        
        return request({
            url: '/taskLog/list',
            method: 'post',
            data: data
        })
    },

}