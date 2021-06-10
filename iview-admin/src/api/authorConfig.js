import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production1' ? '/metaData' : ''
export const ajaxGetConfig = (link) => {
  return axios.request({
    // url: basePath + '/cluster/list',
    url: basePath + '/bdap-metadata-privilege/cluster/getCluster',
    method: 'post',
    data: link
  })
}
export const ajaxDeleteConfig = (link) => {
  return axios.request({
    url: basePath + `/bdap-metadata-privilege/cluster/deleteCluster`,
    method: 'POST',
    data: {
      clusterCode: link.clusterCode
    }
  })
}
export const ajaxAddConfig = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/cluster/addCluster',
    method: 'post',
    data: link
  })
}

export const ajaxEditorConfig = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/cluster/updateCluster',
    method: 'POST',
    data: link
  })
}
export const ajaxCheckHiveConnect = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/cluster/checkHiveConnect',
    method: 'POST',
    data: link
  })
}
export const ajaxCheckImpalaConnect = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/cluster/checkImpalaConnect',
    method: 'POST',
    data: link
  })
}
// =========== 集群元数据结束
