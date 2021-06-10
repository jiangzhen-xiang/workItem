import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production1' ? '/metaData' : ''
export const ajaxGetUngrantAppy = (link) => {
  return axios.request({
    // url: basePath + '/cluster/list',
    url: basePath + '/bdap-metadata-privilege/home/getUngrantApply',
    method: 'post'
  })
}
export const ajaxGetGrantAppy = (link) => {
  return axios.request({
    url: basePath + `/bdap-metadata-privilege/home/getGrantApply`,
    method: 'POST'
  })
}
export const ajaxGetTopGrantTenant = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/home/getTopGrantTenant',
    method: 'post',
    data: link
  })
}

export const ajaxGetTopGrantTable = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/home/getTopGrantTable',
    method: 'POST',
    data: link
  })
}
// =========== 集群元数据结束
