import axios from '@/libs/api.request'

// 同步前校验
const checkBeforeSync=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/syn/checkBeforeSync',
        method:'POST',
        data:link
    })
}

// 执行同步 && 申请单查询
const carrySync=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/syn/doSync',
        method:'POST',
        data:link
    })
}

export default {
    checkBeforeSync,carrySync,
}