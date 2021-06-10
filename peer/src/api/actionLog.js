import axios from '@/libs/api.request'
import { get } from 'sortablejs'

// 查询操作日志
const getActionLog=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/log/getLog',
        method:'POST',
        data:link
    })

    // return axios.request({
    //     url:'http://rap2api.taobao.org/app/mock/274348/userManager',
    //     method:'get'
    // })
}

// 获取日志状态列表
const getLogStat=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/log/getLogOptStat',
        method:'POST',
        data:link
    })
}

// 获取日志操作类型列表
const getLogType=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/log/getLogOptType',
        method:'POST',
        data:link
    })
}

// 获取日志操作对象列表
const getLogObj=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/log/getLogOptObj',
        method:'POST',
        data:link
    })
}

export default {
    getActionLog,getLogStat,getLogType,getLogObj
}