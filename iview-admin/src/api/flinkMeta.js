import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
export const ajaxGetFlinkMeta = (link) => {
  return axios.request({
    url: basePath + '/flink/getColonyMetrics',
    method: 'get',
    params: link
  })
}
export const ajaxGetFlinkApp = (link) => {
  return axios.request({
    url: basePath + '/flink/list',
    method: 'get',
    params: link
  })
}

export const ajaxStopFlinkApp = (link) => {
  return axios.request({
    url: basePath + '/flink/stopApplication',
    method: 'get',
    params: link
  })
}

export const ajaxGetFlinkAppDetail = (link) => {
  return axios.request({
    url: basePath + '/flink/id',
    method: 'get',
    params: link
  })
}
// =========== 集群元数据结束
