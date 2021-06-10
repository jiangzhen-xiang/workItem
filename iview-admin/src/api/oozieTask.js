import axios from '@/libs/api.request'


//获取oozie查询地址
export const getOozieUrl = () => {
  return axios.request({
    url: '/meta/oozie/task/url',
    method: 'get'
  })
}

//修改hue查询地址
export const updateOozieUrl = (parameters) => {
  return axios.request({
    url: '/meta/oozie/task/url',
    method: 'put',
    params: parameters
  })
}



// =========== 集群元数据结束
