import axios from '@/libs/api.request'
// import axios from 'axios'

export const ajaxExport = (postData) => {
  return axios.request({
    url: `/cluster/export/all`,
    method: 'get',
    params: postData

  })
}
export const ajaxImport = (file) => {
  let formData = new FormData()
  formData.append('file', file, file.name)
  return axios.request({
    url: `/cluster/import/all`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;'

    }

  })
}
export const ajaxGetTempList = (postData) => {
  return axios.request({
    url: `/pipeline/stream/template`,
    method: 'get',
    params: postData

  })
}
export const ajaxAddTemp = (postData) => {
  return axios.request({
    url: `/pipeline/stream/template`,
    method: 'post',
    data: postData

  })
}
