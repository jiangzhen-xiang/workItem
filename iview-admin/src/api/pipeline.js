import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = '/pipelineDemo'
export const ajaxAddPipeline = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/static/dataflow',
    method: 'post',
    data: link
  })
}
export const ajaxGetPipeline = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/static/dataflow',
    method: 'get',
    params: link
  })
}

export const ajaxGetPipelineInfo = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/static/dataflow/search',
    method: 'get',
    params: link
  })
}
export const ajaxDeletePipeline = (link) => {
  return axios.request({
    url: basePath + `/pipeline/stream/static/dataflow/${link.dataflow_documentId}`,
    method: 'delete'
  })
}
export const ajaxPublishPipeline = (link) => {
  return axios.request({
    url: basePath + `/pipeline/publish/stream/dynamic/dataflow/flinkdataflow`,
    method: 'post',
    data: link

  })
}

export const ajaxEditPipeline = (link) => {
  return axios.request({
    url: basePath + `/pipeline/stream/static/dataflow/${link.dataflow_documentId}`,
    method: 'post',
    data: link
  })
}

export const ajaxGetDataSource = (link) => {
  return axios.request({
    url: basePath + `/pipeline/publish/stream/dynamic/dataflow/metadata`,
    method: 'post',
    data: link

  })
}
