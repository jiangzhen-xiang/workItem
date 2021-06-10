import axios from '@/libs/api.request'
const basePath = '/'
export const login = ({
  userName,
  password
}) => {
  const data = {
    username: userName,
    password: password
  }
  return axios.request({
    url: '/myLoginForm',
    params: data,
    method: 'post'
  })
}

// 获取用户信息
export const getUserInfo = (token) => {
  return axios.request({
    url: '/get_info',
    params: {
      token
    },
    method: 'get'
  })
}

// 获取用户菜单
export const getUserMenu = () => {
  return axios.request({
    url: '/menu/getMenu',
    method: 'get'
  })
}



// export const aa = (admin) => {
//   return axios.request({
//     url: '/swagger-ui.html',
//     params: {
//       admin
//     },
//     method: 'get'
//   })
// }

export const logout = () => {
  return axios.request({
    url:'/logout',
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: '/message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: basePath + 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: basePath + 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: basePath + 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: basePath + 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: basePath + 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const resetPassword = (link) => {
  return axios.request({
    url: '/user/updatePasswd',
    method: 'put',
    data: link,
  })
}
