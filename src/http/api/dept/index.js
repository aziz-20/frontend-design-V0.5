import request from '@/http/request'


export default {
    getDeptyid(deptId) {
        return request({
            //url: `/dept/${deptId}`,
            url:'/dept/'+ deptId,
            method: 'get'
        })
    },
    
    addDept(data) {
        return request({
            url: '/dept',
            method: 'post',
            data: data
        })
    }
    ,
    updateDept(data) {
        return request({
            url: '/dept',
            method: 'put',
            data: data
        })
    }
    ,
   
    deleteDepid(id) {
        return request({
            url: '/dept/' + id,
            method: 'delete'
        })
    }
    ,
    querydepa(query) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(res.slice(0, 3));
              }
                , 300);
            }
                )
    },

    //plan data
    listDept(data) {
        
        return request({
            url: '/dept/list',
            method: 'post',
            data: data
        })
    },

    DeptlistHierarchy(data) {
        return request({
            url: '/dept/listHierarchy',
            method: 'post',
            data: data
        })
    }
    ,
    xxx() {
        return request({
            method: 'get',
            url: '/emp/getAllEmps3',

        })
    }
}