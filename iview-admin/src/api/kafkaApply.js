import axios from '@/libs/api.request'
// import axios from 'axios'
//const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
const basePath = process.env.NODE_ENV === '' ? '/metaData' : ''

// --------------------------------------kafka资源申请-----------------------------------------
// 模板下载
export const downLoadApplicationForm = () => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/download",
    method: "get",
  })
}

// 查询（表格初始化）
export const queryApplicationForm = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/list",
    method: "get",
    params
  })
}

// 预览
export const previewApplicationForm = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/preview",
    method: "get",
    params
  })
}

// 查询历史
export const queryApplicationFormHistory = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/history",
    method: "get",
    params
  })
}

// 更新
export const updateApplicationForm = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/update",
    method: "post",
    // headers: {
    //   'Content-Type': 'multipart/form-data;',
    // },
    data: params
  })
}

// 上传
export const uploadLoadApplicationForm = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/upload",
    method: "post",
    data: params
  })
}

// 删除
export const deleteApplicationForm = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/" + params.id,
    method: "delete",
  })
}



// 校验
export const grant = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/grant",
    method: "post",
    params
  })
}
// 授权后校验
export const postGrant = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/postGrant",
    method: "post",
    params
  })
}
// 授权前校验
export const preGrant = (params) => {
  return axios.request({
    url: basePath + "/meta/kafka/applicationForm/preGrant",
    method: "post",
    params
  })
}
