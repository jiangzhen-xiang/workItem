import axios from '@/libs/api.request'

// 查询租户
const getTenantUser=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/getTenantUser',
        method:"post",
        timeout:10000,
        data:link
    })
}

// 新建租户
const addTenantUser=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/addTenantUser',
        method:"post",
        data:link,
    })
}

// 删除租户
const deleteTenantUser=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/deleteTenantUser',
        method:"post",
        data:link
    })
}

// 更新租户
const updateTenantUser=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/updateTenantUser',
        method:"post",
        data:link
    })
}

// Excel导入数据表
const loadExcelToDatabases=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/loadExcelToDatabases',
        method:"post",
        data:link
    })
}

// 获取用户类型
const giveSspTenantUser=(link)=>{
    return axios.request({
        url:'/bdap-ssp-show/tenant/giveSspTenantUser',
        method:"post",
        data:link
    })
}

export default{
    getTenantUser,addTenantUser,deleteTenantUser,updateTenantUser,loadExcelToDatabases,giveSspTenantUser
}