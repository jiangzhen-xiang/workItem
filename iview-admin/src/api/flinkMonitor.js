import axios from '@/libs/api.request'

export const getMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor/list',
    method: 'get',
    params: parameters
  })
}

export const getLog = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor/log',
    method: 'get',
    params: parameters
  })
}
export const deleteMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor',
    method: 'delete',
    params: parameters
  })
}

export const updateMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor',
    method: 'put',
    params: parameters
  })
}

export const saveMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor',
    method: 'post',
    params: parameters
  })
}

export const closeMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor/closeMonitor',
    method: 'put',
    params: parameters
  })
}

export const openMonitorConfig = (parameters) => {
  return axios.request({
    url: '/meta/flink/monitor/openMonitor',
    method: 'put',
    params: parameters
  })
}
// =========== 集群元数据结束
