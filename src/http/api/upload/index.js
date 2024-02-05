import request from '@/http/request'


export default {
   
    uploadImage(data,progress) {
        return request({
            url:'/upload/upload',
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // onUploadProgress: progressEvent => {
            //     progress(progressEvent)
            // }
            onUploadProgress(event){
                console.log(event)
                let v = Math.floor(event.loaded/event.total*100)
                console.log(progress)	
                console.log(v)
                progress = v == 100 ? 80 : v
                console.log(progress)
            }

        })
    },
    deleteUsesAvatar(data) {
        return request({
            url: '/upload/delete',
            method: 'post',
            data: data

        })
    },

    image(id) {
        return  'http://181.215.79.209:9005' + id
    }

    
   

}