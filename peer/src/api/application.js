import axios from '@/libs/api.request'

// 申请单模板下载
const applyDownload=function(){
    return axios.request({
        url:'/bdap-metadata-syn/apply/downloadApply?data='+encodeURI(JSON.stringify(this.value)),
        // url:'/bdap-metadata-syn/apply/downloadApply',
        method:'get',
        responseType:'arraybuffer',
    })
}

// 申请单上传
const applyUpload=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/uploadApply',
        method:'POST',
        data:link
    })
}

// 申请单查询
const applySearch=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/getApply',
        method:'POST',
        data:link
    })
}

// 申请单更新
const applyUpdate=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/updateApply',
        method:'POST',
        data:link
    })
}

// 申请单删除
const applyDelete=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/deleteApply',
        method:'POST',
        data:link
    })
}

// 获取申请单状态列表
const getApplyStat=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/getApplyStat',
        method:'POST',
        data:link
    })
}


// 申请单详情查询
const appDetailSearch=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/getApplyDetail',
        method:'POST',
        data:link
    })
}

// 获取申请单明细操作类型列表
const appDetailActionOperType=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/apply/getApplyDetailOperType',
        method:'POST',
        data:link
    })
}

export default {
    applyDownload,applyUpload,applySearch,applyUpdate,applyDelete,getApplyStat,appDetailSearch,appDetailActionOperType
}