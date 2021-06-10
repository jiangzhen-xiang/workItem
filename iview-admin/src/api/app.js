import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production1' ? '/metaData' : ''
export const ajaxGetApp = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/apply/getApply',
    method: 'post',
    data: link
  })
}
export const ajaxDeleteApp = (link) => {
  return axios.request({
    url: basePath + `/bdap-metadata-privilege/apply/deleteApply`,
    method: 'post',
    data: {
      id: link.id
    }
  })
}
export const ajaxAddApp = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/apply/uploadApply',
    method: 'post',
    data: link
    // headers: {
    //   'Content-Type': 'multipart/form-data;',

    // }
  })
}

export const ajaxEditorApp = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/apply/updateApply',
    method: 'POST',
    data: link

  })
}

export const ajaxDownApp = (link) => {
  return axios.request({
    url: basePath + '/bdap-metadata-privilege/apply/downloadApply',
    method: 'POST'
  })
}

// =========== 集群元数据结束
