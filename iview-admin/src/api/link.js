import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = ''
export const getLink = (link) => {
  return axios.request({
    url: basePath + '/cluster',
    method: 'get',
    params: link
  })
}
export const ajaxAddLink = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.clusterId}/connection`,
    method: 'post',
    data: link

  })
}
export const ajaxAddCluster = (link) => {
  return axios.request({
    url: basePath + '/cluster',
    method: 'post',
    data: link
  })
}
export const ajaxEditorCluster = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.id}`,
    method: 'post',
    data: link

  })
}
export const ajaxGetCluster = (link) => {
  return axios.request({
    url: basePath + `/cluster?pageSize=${link.pageSize}&pageNum=${link.pageNum}`,
    method: 'get',
    params: link

  })
}
export const ajaxDeleteCluster = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.id}`,
    method: 'delete',
    data: {
      link
    }
  })
}

export const ajaxSetDefaultClusterEnv = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.id}/env/${row.defaultEnv}/default`,
    method: 'post'

  })
}
export const ajaxGetAccount = (row) => {
  return axios.request({
    url: basePath + `/account`,
    method: 'get',
    params: row
  })
}
export const ajaxSetConnToEnv = (row) => {
  let formData = new FormData()
  if (row.connectionInfo.files) {
    for (var i = 0; i < row.connectionInfo.files.length; i++) {
      formData.append('multipartFiles', row.connectionInfo.files[i], row.connectionInfo.files[i].name)
    }
  }
  formData.append('config', JSON.stringify(row['jsonInfoData'] || ''))
  formData.append('envId', row['envId'])

  // TODO 这个后期要维护

  // if (row.connectionInfo.files) { // hbase
  //   return axios.request({
  //     url: basePath+ `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}`,
  //     method: 'post',
  //     data: formData,
  //     headers: {
  //       // 'contentType': 'application/json'
  //       'Content-Type': 'multipart/form-data;'
  //       // 'enctype': 'multipart/form-data'
  //     }
  //   })
  // } else {
  //   row.config = row['jsonInfoData']
  //   return axios.request({
  //     url: basePath+ `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}`,
  //     method: 'post',
  //     params: row

  //   })
  // }

  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}`,
    method: 'post',
    data: formData,
    headers: {
      // 'contentType': 'application/json'
      'Content-Type': 'multipart/form-data;'
      // 'enctype': 'multipart/form-data'
    }
  })
}
export const ajaxGetConn = (row) => {
  return axios.request({
    url: basePath + `/connection`,
    method: 'get',
    params: row
  })
}
export const getLinkCheck = (name, clusterId) => {
  return axios.request({
    url: basePath + `/cluster/${clusterId}/search/connection/${name}`,
    method: 'get'

  })
}

export const ajaxDeleteConn = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}`,
    method: 'delete'

  })
}
export const ajaxEditorConn = (row) => {
  let url = `/cluster/${row.clusterId}/connection`
  if ('connId' in row) {
    url = `/cluster/${row.clusterId}/connection/${row.connId}`
  }
  return axios.request({
    url: basePath + url,
    method: 'post',
    data: row

  })
}
export const ajaxGetConnEnv = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}`,
    method: 'get',
    data: row

  })
}

export const ajaxConnBatchAdd = (row) => {
  return axios.request({
    url: basePath + `/batch/fetch/connection`,
    method: 'post',
    params: row

  })
}

export const ajaxFileDown = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}/file/download`,
    method: 'get',
    params: row

  })
}

export const ajaxFilePrev = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}/file/preview`,
    method: 'get',
    params: row

  })
}
export const ajaxGetEnvInfo = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}`,
    method: 'get',
    params: row

  })
}

export const getColonyCheck = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}`,
    method: 'get',
    params: row

  })
}

export const ajaxSetConnToEnvTestConn = (row) => {
  return axios.request({
    url: basePath + `/cluster/${row.clusterId}/connection/${row.connId}/env/${row.envId}/validation`,
    method: 'post',
    params: row

  })
}

export const ajaxGetClusterType = () => {
  return axios.request({
    url: basePath + `/category/cluster`,
    method: 'get'

  })
}

// 上传jar包
export const ajaxUploadJar = (row) => {
  let formData = new FormData()
  if (row.files) {
    for (var i = 0; i < row.files.length; i++) {
      formData.append('file', row.files[i], row.files[i].name)
    }
  }

  return axios.request({
    url: basePath + `/managerjar/upload`,
    method: 'post',
    data: formData,
    headers: {

      'Content-Type': 'multipart/form-data;'

    }
  })
}
export const ajaxJarSubmit = (row) => {
  return axios.request({
    url: basePath + `/managerjar/submit`,
    method: 'post',
    params: row

  })
}
