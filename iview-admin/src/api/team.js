import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = '/pipelineDemo'

function getTeamListApi(params) {
  return axios.request({
    url: basePath + `/group/team`,
    method: 'get',
    params: params
  })
}

function addTeamApi(params) {
  return axios.request({
    url: basePath + `/group/team`,
    method: 'post',
    data: params
  })
}

function editTeamApi(params) {
  return axios.request({
    url: basePath + `/group/team/${params.id}`,
    method: 'post',
    data: params
  })
}

function deleteTeamApi(params) {
  return axios.request({
    url: basePath + `/group/team/${params.id}`,
    method: 'delete',
    params: params
  })
}

function getMemberListApi(params) {
  return axios.request({
    url: basePath + `/group/${params.teamId}/member`,
    method: 'get',
    params: params
  })
}

function addMemberApi(params) {
  return axios.request({
    url: basePath + `/group/${params.teamId}/member`,
    method: 'post',
    data: params
  })
}

function editMemberApi(params) {
  return axios.request({
    url: basePath + `/group/${params.teamId}/member/${params.id}`,
    method: 'post',
    data: params
  })
}

function deleteMemberApi(params) {
  return axios.request({
    url: basePath + `/group/${params.teamId}/member/${params.id}`,
    method: 'delete',
    data: params
  })
}
const teamFunc = {
  getTeamListApi,
  deleteTeamApi,
  addTeamApi,
  getMemberListApi,
  addMemberApi,
  editMemberApi,
  deleteMemberApi,
  editTeamApi
}
export {
  teamFunc
}
