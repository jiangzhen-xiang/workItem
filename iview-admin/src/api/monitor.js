import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = '/pipelineDemo'
export const ajaxGetMonitorList = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/dashboard/dataflow',
    method: 'get',
    params: link
  })
}

export const ajaxGetSourceChartData = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/dashboard/metrics/sourcedata',
    method: 'get',
    params: link
  })
}
export const ajaxGetSinkChartData = (link) => {
  return axios.request({
    url: basePath + '/pipeline/stream/dashboard/metrics/sinkdata',
    method: 'get',
    params: link
  })
}

export const ajaxGetMonitor = (link) => {
  return axios.request({
    url: basePath + `/pipeline/stream/dashboard/dataflow/detail/${link.documentId}`,
    method: 'get',
    params: link
  })
}
