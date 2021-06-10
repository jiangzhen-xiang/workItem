import axios from '@/libs/api.request'

// 查询资源详情数据
const getResource=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/resource/getResource',
        method:"post",
        timeout:10000,
        data:link
    })
}

// 查询资源详情明细数据
const getResourceDetail=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/resource/getDetailsResource',
        method:"post",
        data:link
    })
}

export default{
    getResource,getResourceDetail
}