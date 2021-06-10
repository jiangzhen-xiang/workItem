import axios from '@/libs/api.request'
// import axios from 'axios'
//const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
const basePath = process.env.NODE_ENV === '' ? '/metaData' : ''
export const ajaxGetClusterMeta = (link) => {
  return axios.request({
    url: basePath + '/cluster/list',
    method: 'get',
    params: link
  })
}
export const ajaxDeleteClusterMeta = (link) => {
  return axios.request({
    url: basePath + `/cluster/${link.id}`,
    method: 'delete'
  })
}
export const ajaxAddClusterMeta = (link) => {
  return axios.request({
    url: basePath + '/cluster/save',
    method: 'post',
    data: link
  })
}

export const ajaxEditorClusterMeta = (link) => {
  return axios.request({
    url: basePath + '/cluster/update',
    method: 'PUT',
    data: link
  })
}

// =========== 集群元数据结束

export const ajaxGetGroupInfo = (link) => {
  return axios.request({
    url: basePath + '/cluster/group/list',
    method: 'get',
    params: link
  })
}
export const ajaxGetTopicInfo = (link) => {
  return axios.request({
    url: basePath + '/cluster/topic/list',
    method: 'get',
    params: link
  })
}

export const ajaxGetOffsetInfo = (link) => {
  return axios.request({
    url: basePath + '/kafka/statistics/top',
    method: 'get',
    params: link
  })
}
export const ajaxGetWarrantInfo = (link) => {
  return axios.request({
    url: basePath + '/cluster/acl/list',
    method: 'get',
    params: link
  })
}
export const ajaxGetTopicLastInfo = (link) => {
  return axios.request({
    url: basePath + '/cluster/deal',
    method: 'get',
    params: link
  })
}

//= ========== 群组元数据结束

//= ========== topic =======
export const ajaxGetTopic = (link) => {
  return axios.request({
    url: basePath + '/topic/list',
    method: 'get',
    params: link
  })
}
export const ajaxAddTopic = (link) => {
  return axios.request({
    url: basePath + '/topic/save',
    method: 'post',
    data: link
  })
}

export const ajaxGetGroupByTopic = (link) => {
  return axios.request({
    url: basePath + '/topic/group',
    method: 'get',
    params: link
  })
}
export const ajaxGetWarrantByTopic = (link) => {
  return axios.request({
    url: basePath + '/topic/acl',
    method: 'get',
    params: link
  })
}
export const ajaxGetAnalysisByTopic = (link) => {
  return axios.request({
    url: basePath + '/topic/offset',
    method: 'get',
    params: link
  })
}
//= ==========topic ========= 结束
//= ===========group=======
export const ajaxGetGroupMeta = (link) => {
  return axios.request({
    url: basePath + '/group/list',
    method: 'get',
    params: link
  })
}
export const ajaxAddGroupMeta = (link) => {
  return axios.request({
    url: basePath + '/group/save',
    method: 'post',
    params: link
  })
}
export const ajaxGetTopicByGroup = (link) => {
  return axios.request({
    url: basePath + '/group/list/topic',
    method: 'get',
    params: link
  })
}
export const ajaxGetOffsetByGroup = (link) => {
  return axios.request({
    url: basePath + '/group/list/offset',
    method: 'get',
    params: link
  })
}
export const ajaxGetWarrantByGroup = (link) => {
  return axios.request({
    url: basePath + '/group/list/acl',
    method: 'get',
    params: link
  })
}
//= =======group======end===
//= =========脚本管理=========

export const ajaxGetScriptMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/script/list',
    method: 'get',
    params: link
  })
}
export const ajaxDeleteScriptMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/script/delete',
    method: 'delete',
    params: link
  })
}
export const ajaxAddScriptMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/script/save',
    method: 'post',
    data: link
  })
}
export const ajaxEditorScriptMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/script/update',
    method: 'put',
    data: link
  })
}
export const ajaxDownloadScriptMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/script/deal',
    method: 'post',
    params: link
  })
}
//= =======脚本管理==========
// ==========用户管理==========

export const ajaxGetUserMeta = (link) => {
  return axios.request({
    url: basePath + '/appUser/list',
    method: 'get',
    data: link
  })
}
export const ajaxAddUserMeta = (link) => {
  return axios.request({
    url: basePath + '/appUser/save',
    method: 'post',
    data: link
  })
}
export const ajaxDeleteUserMeta = (link) => {
  return axios.request({
    url: basePath + '/appUser/delete',
    method: 'delete',
    params: link
  })
}
export const ajaxEditorUserMeta = (link) => {
  return axios.request({
    url: basePath + '/appUser/update',
    method: 'put',
    data: link
  })
}
// 用户管理============end=======

// ==========需求申请单======
export const ajaxGetOrderMeta = (link) => {
  return axios.request({
    url: basePath + '/connectedSystemInfo/list',
    method: 'get',
    params: link
  })
}
export const ajaxAddOrderMeta = (link) => {
  return axios.request({
    url: basePath + '/connectedSystemInfo/save',
    method: 'post',
    data: link
  })
}
export const ajaxDeleteOrderMeta = (link) => {
  return axios.request({
    url: basePath + '/connectedSystemInfo/delete',
    method: 'delete',
    params: link
  })
}
export const ajaxEditorOrderMeta = (link) => {
  return axios.request({
    url: basePath + '/connectedSystemInfo/update',
    method: 'put',
    data: link
  })
}
// ===========需求申请单=======
//= ===========维护记录=======
export const ajaxGetHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/list',
    method: 'get',
    params: link
  })
}
export const ajaxDeleteHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/delete',
    method: 'delete',
    params: link
  })
}
export const ajaxRunHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/deal',
    method: 'post',
    params: link
  })
}
export const ajaxAddHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/save',
    method: 'post',
    data: link
  })
}
export const ajaxEditorHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/update',
    method: 'put',
    data: link
  })
}
export const ajaxDownloadHistoryMeta = (link) => {
  return axios.request({
    url: basePath + '/kafka/operation/direct/deal',
    method: 'put',
    data: link
  })
}

//= ============历史记录======end
