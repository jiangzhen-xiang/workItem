import axios from '@/libs/api.request'
const basePath = ''
// 获取table列表数据
function getTableDataAai(params) {
  return axios.request({
    url: basePath + `/account`,
    method: 'get',
    params: params
  })
}
// 通过账号名称获取环境列表展示信息
function getTableEvnListApi(params) {
  return axios.request({
    url: basePath + `/account/accountInfo`,
    method: 'get',
    params: params
  })
}
// 查看详细信息
function getLookInfoApi(params) {
  return axios.request({
    url: basePath + `/cluster/${params.clusterId}/account/${params.id}`,
    method: 'get'
  })
}
// 获取团队
function getTeamDataAai(params) {
  return axios.request({
    url: basePath + `/group/team`,
    method: 'get',
    params: params
  })
}
// 获取集群
function getClusterDataApi(params) {
  return axios.request({
    url: basePath + `/cluster`,
    method: 'get',
    params: params
  })
}
// 通过集群获取环境
function getEvnListrDataApi(params) {
  return axios.request({
    url: basePath + `/env`,
    method: 'get',
    params: params
  })
}
// 获取类型
function getTypeDataApi(params) {
  return axios.request({
    url: basePath + `/category/account`,
    method: 'get',
    params: params
  })
}
// 单条添加只保存账号不配置环境
function addAccountDataApi(params) {
  return axios.request({
    url: basePath + `/cluster/${params.clusterId}/account`,
    method: 'post',
    data: params
  })
}
// 编辑单条环境用户密码
function editEvnUserPwdApi(params) {
  return axios.request({
    url: basePath + `/account/password/${params.accountId}/evn/${params.evnid}`,
    method: 'post',
    params: params
  })
}
// 添加账号用户密码文件
function addEvnUserPwdFileApi(params) {
  return axios.request({
    url: basePath + `/account/passfile/${params.accountId}/evn/${params.evnid}`,
    method: 'post',
    params: params
  })
}
// 编辑账号用户密码文件
function editEvnUserPwdFileApi(params) {
  return axios.request({
    url: basePath + `/account/passfile/${params.accountId}/evn/${params.evnid}`,
    method: 'post',
    params: params
  })
}

// 单条or多条用户密码添加
function onePwdUserCommitApi(id, params) {
  return axios.request({
    url: basePath + `/cluster/${id}/batch/account/password/${params.accountId}`,
    method: 'post',
    data: params.accountInfoQOs
  })
}
// 单条or多条文件环境添加
function oneFileCommitApi(evnid, accountId, params) {
  return axios.request({
    url: basePath + `/batch/account/file/${accountId}/evn/${evnid}`,
    method: 'post',
    data: params
  })
}
// 删除账号环境id
function removeEnvIdApi(id, params) {
  return axios.request({
    url: basePath + `/account/env/${id}`,
    method: 'DELETE',
    params: params
  })
}
// 编辑账号
function editAccountInfoApi(id, params) {
  return axios.request({
    url: basePath + `/account/${id}`,
    method: 'post',
    params: params
  })
}
// 删除账号
function removeAccouintIdApi(id) {
  return axios.request({
    url: basePath + `/account/${id}`,
    method: 'DELETE'
  })
}
// 删除文件
function removeFileIdApi(params) {
  return axios.request({
    url: basePath + `/file/${params}`,
    method: 'DELETE'
  })
}
// 批量添加账号
function batchGetDataApi(params) {
  return axios.request({
    url: basePath + `/account/${params.accountId}/env/${params.envId}/ldap`,
    method: 'get',
    params: params.obj
  })
}

// 批量添加账号
function batchAddAccountDataApi(params) {
  return axios.request({
    url: basePath + `/cluster/${params.clusterId}/batch/fetch/account`,
    method: 'post',
    params: params

  })
}
// 批量获取账号
function batchGetAccountDataApi(params) {
  return axios.request({
    url: basePath + `/cluster/${params.clusterId}/batch/fetch/account`,
    method: 'get',

    params: params
  })
}
// 确定添加批量账号
function okBatchCommitApi(params) {
  return axios.request({
    url: basePath + `/account/${params.accountId}/env/${params.envId}/ldap`,
    method: 'post',
    data: params
  })
}
// 下载
function downloadApi(params) {
  return axios.request({
    url: basePath + `/file/${params.id}`,
    method: 'get'
  })
}

// 编辑file 和 密码 添加
function addPwdAndFileApi(row) {
  let formData = new FormData()
  if (row.uploadList) {
    for (var i = 0; i < row.uploadList.length; i++) {
      formData.append('file', row.uploadList[i], row.uploadList[i].name)
    }
  }
  for (let k in row) {
    (k != 'uploadList') && (formData.append(k, row[k]))
  }
  return axios.request({
    url: basePath + `/account/passfile/${row.accountId}/evn/${row.evnId}`,
    method: 'post',
    data: formData,
    headers: {
      // 'contentType': 'application/json'
      'Content-Type': 'multipart/form-data;'
      // 'enctype': 'multipart/form-data'
    }
  })
}
const userFunc = {
  addPwdAndFileApi,
  batchGetAccountDataApi,
  batchAddAccountDataApi,
  getTableDataAai,
  getTableEvnListApi,
  editEvnUserPwdApi,
  getLookInfoApi,
  getTeamDataAai,
  getClusterDataApi,
  getEvnListrDataApi,
  getTypeDataApi,
  addAccountDataApi,
  onePwdUserCommitApi,
  oneFileCommitApi,
  removeEnvIdApi,
  batchGetDataApi,
  okBatchCommitApi,
  downloadApi,
  removeAccouintIdApi,
  removeFileIdApi,
  editAccountInfoApi,
  addEvnUserPwdFileApi,
  editEvnUserPwdFileApi
}
export {
  userFunc
}
