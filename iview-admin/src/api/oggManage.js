
import axios from '@/libs/api.request'
// import axios from 'axios'
//const basePath = process.env.NODE_ENV === 'production' ? '/metaData' : ''
const basePath = process.env.NODE_ENV === '' ? '/metaData' : ''

// --------------------------------------进程管理-----------------------------------------
// 源系统下拉框数据-源系统管理（源系统查询所有）
// 查询（初始化）
export const queryTargetProcess = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process",
    method: "get",
    params
  })
}
// 新增
export const saveTargetProcess = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process",
    method: "post",
    data: params
  })
}
// 修改
export const updateTargetProcess = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process",
    method: "put",
    data: params
  })
}
// 删除
export const deleteTargetProcess = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/" + params.id,
    method: "delete"
  })
}
// 生成配置文件(旧)
export const saveTargetProcessGenerateScript = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/generateScript",
    method: "post",
    params,
    responseType: 'blob'
  })
}
// 生成配置文件(新)
export const exportTargetProcessConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/config/export",
    method: "post",
    params,
    responseType: 'blob'
  })
}
// 进程详情-关联表查询
export const queryTargetProcessDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/" + params.id,
    method: "get"
  })
}
// 查看进程指标
export const oggQueryPorcess = (params) => {
  return axios.request({
    url: basePath + "/ogg/queryPorcess",
    method: "get",
    params
  })
}



// --------------------------------------ogg采集端配置-----------------------------------------
// 集群下拉框-集群管理 查询（所有）
// 查询（初始化）
export const queryAgentConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/agent/config",
    method: "get",
    params
  })
}
// 新增
export const saveAgentConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/agent/config",
    method: "post",
    data: params
  })
}
// 修改
export const updateAgentConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/agent/config",
    method: "put",
    data: params
  })
}
// 删除
export const deleteAgentConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/agent/config/" + params.id,
    method: "delete"
  })
}

// // 生成配置文件（暂时没有接口）
// export const saveTargetProcessGenerateScript = (params) => {
//   return axios.request({
//     url: basePath + "/meta/ogg/target/process/generateScript",
//     method: "post",
//     params,
//     responseType: 'blob',
//     headers: {
//       'Authorization': store.state.user.token || sessionStorage.getItem("token")
//     }
//   })
// }

// --------------------------------------源系统管理-----------------------------------------
// 源系统查询（初始化）
export const querySourceSystemConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/sourceSystem",
    method: "get",
    params
  })
}
// 源系统查询(所有)
export const querySourceSystemConfigAll = () => {
  return axios.request({
    url: basePath + "/meta/ogg/sourceSystem/all",
    method: "get"
  })
}

// 新增
export const saveSourceSystemConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/sourceSystem",
    method: "post",
    data: params
  })
}

// 修改
export const updateSourceSystemConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/sourceSystem",
    method: "put",
    data: params
  })
}

// 删除
export const deleteSourceSystemConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/sourceSystem/" + params.id,
    method: "delete"
  })
}

// --------------------------------------映射管理（运行）-----------------------------------------
// 查询
export const queryTargetProcessTableTopicRelation = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/relation/detail",
    method: "get",
    params
  })
}
//下载
export const batchExportRelation = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/relation/export/batch",
    method: "post",
    params,
    responseType: 'blob'
  })
}
// 新增
export const saveTargetProcessTableTopicRelation = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/relation",
    method: "post",
    data: params
  })
}
// 修改
export const updateTargetProcessTableTopicRelation = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/relation",
    method: "put",
    data: params
  })
}
// 删除
export const deleteTargetProcessTableTopicRelation = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/relation/" + params.id,
    method: "delete"
  })
}

//集群list
export const queryAllClusterList = (params) => {
  return axios.request({
    url: basePath + "/cluster/list",
    method: "get",
    params
  })
}
//topicList
export const queryAllTopicList = (params) => {
  return axios.request({
    url: basePath + "/topic/list",
    method: "get",
    params
  })
}

//avro数据展示
export const queryRelationAvro = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/target/process/relation/avro",
    method: "get",
    params
  })
}

// --------------------------------------抽取表管理（源表）-----------------------------------------
// 查看(初始化)
export const queryExtractTable = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable",
    method: "get",
    params
  })
}

// 新增
export const saveExtractTable = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable",
    method: "post",
    data: params
  })
}
// 新增(加个文件上传的测试接口)
export const saveExtractTableTest = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/Test",
    method: "post",
    data: params
  })
}
// 修改
export const updateExtractTable = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable",
    method: "put",
    data: params
  })
}
// 修改(加个文件上传的测试接口)
export const updateExtractTableTest = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/Test",
    method: "put",
    data: params
  })
}
// 删除
export const deleteExtractTable = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/" + params.id,
    method: "delete"
  })
}
//更新
export const updateExtractTableDetailById = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/updateDetail",
    method: "post",
    params
  })
}
//下载
export const batchExportExtractTable = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/export/batch",
    method: "post",
    params,
    responseType: 'blob'
  })
}
//导入
export const importExtractTables = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/import",
    method: "post",
    data: params
  })
}
//字段-查看(抽取表跳转进入时的初始化)
export const queryExtractTableDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTableDetail",
    method: "get",
    params
  })
}
//字段-查看(版本页面跳转进入时的初始化)
export const getHistoryDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/history/detail",
    method: "get",
    params
  })
}
// 字段-新增
export const saveExtractTableDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTableDetail",
    method: "post",
    data: params
  })
}
// 字段-修改
export const updateExtractTableDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTableDetail",
    method: "put",
    data: params
  })
}
// 字段-删除
export const deleteExtractTableDetail = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTableDetail/" + params.id,
    method: "delete"
  })
}
// 版本-查看
export const getExtractTableDetailById = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/history",
    method: "get",
    params
  })
}
// 版本-对比
export const compare = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/extractTable/history/compare",
    method: "get",
    params
  })
}

// 版本-字段详情

// --------------------------------------集群管理-----------------------------------------
// 查询（初始化）
export const queryClusterConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/cluster/config",
    method: "get",
    params
  })
}
// 查询（所有）
export const queryClusterConfigAll = () => {
  return axios.request({
    url: basePath + "/meta/ogg/cluster/config/all",
    method: "get"
  })
}
// 新增
export const saveClusterConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/cluster/config",
    method: "post",
    data: params
  })
}
// 修改
export const updateClusterConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/cluster/config",
    method: "put",
    data: params
  })
}
// 删除
export const deleteClusterConfig = (params) => {
  return axios.request({
    url: basePath + "/meta/ogg/cluster/config/" + params.id,
    method: "delete"
  })
}









