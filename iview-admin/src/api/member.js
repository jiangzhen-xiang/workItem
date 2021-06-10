import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
export const ajaxGetMember = (link) => {
  return axios.request({
    url: basePath + '/jarmanager',
    method: 'get',
    params: link
  })
}
export const ajaxDeleteMember = (link) => {
  return axios.request({
    url: basePath + `/jarmanager/${link.jarName}`,
    method: 'delete',
    params: link
  })
}
export const ajaxAddMember = (link) => {
  return axios.request({
    url: basePath + '/member/save',
    method: 'post',
    data: link
  })
}

export const ajaxEditorMember = (link) => {
  return axios.request({
    url: basePath + '/member/update',
    method: 'POST',
    data: link
  })
}

// =========== 集群元数据结束
