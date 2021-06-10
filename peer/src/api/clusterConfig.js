import axios from '@/libs/api.request'
const basePath = ''
// 查询集群配置
const searchClusterConfig=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/cluster/getCluster',
        method:'POST',
        data:link
    })
}

// 新增集群配置
const addClusterConfig=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/cluster/addCluster',
        method:'POST',
        data:link
    })
}

// 修改集群配置
const modifyClusterConfig=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/cluster/updateCluster',
        method:'POST',
        data:link
    })
}

// 删除集群配置
const deleteClusterConfig=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/cluster/deleteCluster',
        method:'POST',
        data:link
    })
}

// 验证Hbase连接
const checkHbaseConnect=function(link){
    return axios.request({
        url:'/bdap-metadata-syn/cluster/checkHbaseConnect',
        method:'POST',
        data:link
    })
}


const clusterIter = {
    searchClusterConfig,addClusterConfig,modifyClusterConfig,deleteClusterConfig,checkHbaseConnect
}
export {
    clusterIter
}