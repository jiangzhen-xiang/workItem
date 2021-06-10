import axios from '@/libs/api.request'

// 告警记录搜索
const getRecord = (link,pageSize,currentPage) => {
  return axios.request({
    url: 'alarmManager/SyslogShow?pageSize='+pageSize+'&currentPage='+currentPage,
    method: 'post',
    data:link
  })
}

// 告警配置信息搜索
const getConfigInfo = () => {
  return axios.request({
    url: 'alarmManager/SyslogConfigShow',
    method: 'get'
  })
}

const getSyslogSelect = () => {
  return axios.request({
    url: 'alarmManager/SyslogSelect',
    method: 'get'
  })
}

export default{
    getRecord,getConfigInfo,getSyslogSelect
}

