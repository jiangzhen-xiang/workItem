import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
export const ajaxGetFamily = (link) => {
  return axios.request({
    url: basePath + '/family/list',
    method: 'get',
    params: link
  })
}
export const ajaxDeleteFamily = (link) => {
  return axios.request({
    url: basePath + `/family/delete/${link.id}`,
    method: 'delete'
  })
}
export const ajaxAddFamily = (link) => {
  return axios.request({
    url: basePath + '/family/save',
    method: 'post',
    data: link
  })
}

export const ajaxEditorFamily = (link) => {
  return axios.request({
    url: basePath + '/family/update',
    method: 'POST',
    data: link
  })
}

// =========== 集群元数据结束
