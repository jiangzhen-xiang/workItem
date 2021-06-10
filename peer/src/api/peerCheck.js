import axios from '@/libs/api.request'

// peer查询
const peerSearch=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/getPeer',
        method:'POST',
        data:link
    })
}

// 详情---列出同步的列簇
const peerDeatil=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/getPeerDetail',
        method:'POST',
        data:link
    })
}

// 创建peer
const peerCreate=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/createPeer',
        method:'POST',
        data:link
    })
}

// 禁用Peer
const peerDisable=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/disablePeer',
        method:'POST',
        data:link
    })
}

// 开启Peer
const peerEnable=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/enablePeer',
        method:'POST',
        data:link
    })
}

// 删除peer
const peerDelete=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/peer/deletePeer',
        method:'POST',
        data:link
    })
}

export default {
    peerCreate,peerDisable,peerSearch,peerDeatil,peerEnable,peerDelete,
}