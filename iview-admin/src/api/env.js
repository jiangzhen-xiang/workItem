import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = ''
export const ajaxGetEnv = (link) => {
  return axios.request({
    url: basePath + `/env`,
    method: 'get',
    params: link

  })
}

export const ajaxAddEnv = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.clusterId}/env`,
    method: 'post',
    data: link

  })
}
export const ajaxEditorEnv = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.clusterId}/env/${link.id}`,
    method: 'post',
    data: link

  })
}
export const ajaxDeleteEnv = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/env/${row.id}`,
    method: 'delete',
    params: row

  })
}

export const getClusterEnv = (postData) => {
  return axios.request({
    url: basePath + `/env`,
    method: 'get',
    params: postData

  })
}
