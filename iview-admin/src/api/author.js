import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production1' ? '/metaData' : ''
export const ajaxGetAuthor = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/grant/getGrant',
    method: 'post',
    data: link
  })
}
export const ajaxCheckAuthor = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/grant/doGrant',
    method: 'post',
    data: link
  })
}
export const ajaxCheckAuthorBefore = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/grant/checkBeforeGrant',
    method: 'post',
    data: link
  })
}
export const ajaxCheckAuthorAfter = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/grant/checkAfterGrant',
    method: 'post',
    data: link
  })
}

export const ajaxExportApplyAuthor = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/apply/exportApply',
    method: 'post',
    data: link
  })
}
// =========== 集群元数据结束
