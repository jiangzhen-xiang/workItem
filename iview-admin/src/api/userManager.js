import axios from '@/libs/api.request'
const basePath = ''
// 获取用户列表数据
function getUserData(page,size) {
  return axios.request({
    // url:'http://rap2api.taobao.org/app/mock/274348/userManager',
    url:"/user",
    params:{
      page,
      size
    },
    method: 'get',
  })
}

function editUserData(link) {
  return axios.request({
    url:"/user/updateUser",
    data:link,
    method:'post',
  })
}

function searchUserData(userName="",fullName="",size,page) {
  return axios.request({
    url:"/user",
    params:{
      userName,
      fullName,
      size,
      page,
    },
    method:'get',
  })
}

function assignRole() {
  return axios.request({
    url:"/role/listSelectedRole",
    params:{},
    method:'get',
  })
}

// 获取用户信息
function addUser() {
  return axios.request({
    url:"/menu/getUser",
    method:'get',
  })
}

// 新增用户
function addNewUser(link) {
  return axios.request({
    url:"/user",
    data:link,
    method:'post',
  })
}


function delUser(id) {
  return axios.request({
    url:"/user/"+id,
    method:'delete',
  })
}

function roleAssign(link) {
  return axios.request({
    url:"/user/updateUserRole",
    data:link,
    method:'put',
  })
}

const userInfo={
    getUserData,editUserData,searchUserData,assignRole,addUser,addNewUser,delUser,roleAssign
}
export {
    userInfo
}