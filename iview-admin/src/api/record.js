import axios from '@/libs/api.request'
// import axios from 'axios'
const basePath = process.env.NODE_ENV === 'production1' ? '/metaData' : ''
export const ajaxGetRecord = (link) => {
  return axios.request({
    // url: basePath + '/cluster/list',
    url: basePath + '/bdap-metadata-privilege/apply/getApplyDetail',
    method: 'post',
    data: link
  })
}
// =========== 集群元数据结束
