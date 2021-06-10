import axios from '@/libs/api.request'
const basePath = ''
// 获取角色列表数据
function getRoleData(link) {
  return axios.request({
    url:'/role',
    params:link,
    method: 'get',
  })
}

function delRole(id) {
  return axios.request({
    url:"/role/"+id,
    method:'delete',
  })
}


function addRole(link) {
  return axios.request({
    url:'/role',
    data:link,
    method: 'post',
  })
}

function updateRole(link) {
  return axios.request({
    url:'/role',
    data:link,
    method:'put',
  })
}

// 获取菜单列表
function getRoleMenu(roleId) {
  return axios.request({
    url:'/privilege/listResTree?roleId='+roleId,
    method:'get',
  })
}

// 提交菜单权限
function submitMenu(link){
  return axios.request({
    url:'/privilege/allocationPrivilege',
    data:link,
    method:"post"
  })
}



const roleInfo={
    getRoleData,delRole,addRole,updateRole,getRoleMenu,submitMenu
}
export {
    roleInfo
}