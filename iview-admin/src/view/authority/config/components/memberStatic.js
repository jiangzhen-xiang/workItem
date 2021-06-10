import {
  ajaxGetConfig, ajaxCheckHiveConnect, ajaxCheckImpalaConnect
} from '@/api/authorConfig.js'
import { Message } from 'iview'
let isCanCheckLink = true
const checkLink = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('家庭名称不能为空'))
  } else {
    // 请求后端，获取这个账号名称，如果有数据，就提示有数据
    if (isCanCheckLink) {
      isCanCheckLink = false
      setTimeout(() => {
        let postData = {}
        postData.clusterCode = value
        postData.pageSize = 1000
        postData.pageNum = 1
        ajaxGetConfig(postData)
          .then(res => {
            isCanCheckLink = true
            // res.data 不为空，就是有数据
            if (res.data.status == 'ok') {
              if (res.data.data.list.length) {
                callback(new Error('集群名称重复'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          })
          .catch(err => {
            isCanCheckLink = true
          })
      }, 1000)
    }
  }
}

let isCanCheckLinkEditor = true

const checkEditorLink = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('家庭名称不能为空'))
  } else {
    // 请求后端，获取这个账号名称，如果有数据，就提示有数据
    if (isCanCheckLinkEditor) {
      isCanCheckLinkEditor = false
      setTimeout(() => {
        let postData = {}
        postData.clusterCode = value
        postData.pageSize = 1000
        postData.pageNum = 1

        ajaxGetConfig(postData)
          .then(res => {
            isCanCheckLinkEditor = true
            // res.data 不为空，就是有数据
            if (res.data.status == 'ok') {
              let filterArr = res.data.data.filter(item => {
                return (item.name == postData.name && item.clusterCode != editorForm.model['clusterCode'])
              })
              if (filterArr.length) {
                callback(new Error('家庭名称重复'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          })
          .catch(err => {
            isCanCheckLinkEditor = true
          })
      }, 1000)
    }
  }
}
export const addForm = {
  ref: 'formValidate',
  rules: {
    clusterCode: [{
      required: true,
      message: '集群名称不能为空',
      trigger: 'blur'
    }
    // {
    //   validator: checkLink,
    //   message: '集群名称不能为空',
    //   trigger: ['change', 'blur']
    // }
    ]

  },
  model: {
    clusterCode: '',
    clusterName: '',
    clusterDesc: '',
    hs2Addr: '',
    hs2User: '',
    hs2Pwd: '',
    impalaAddr: '',
    impalaUser: '',
    impalaPwd: '',
    hs2Krb5Path: '',
    impalaKrb5Path: ''
  },
  items: [{
    type: 'input',
    label: '集群标识',
    prop: 'clusterCode',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '集群中文名',
    prop: 'clusterName',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'hs2地址',
    prop: 'hs2Addr',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'hs2用户',
    prop: 'hs2User',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'hs2密码',
    prop: 'hs2Pwd',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'krb路径(hive)',
    prop: 'hs2Krb5Path',
    placeholder: '请输入',
    button: true,
    buttonText: '测试连接',
    buttonFun: () => {
      let postData = {
        'hs2Addr': addForm.model.hs2Addr,
        'hs2User': addForm.model.hs2User,
        'hs2Pwd': addForm.model.hs2Pwd,
        hs2Krb5Path: addForm.model.hs2Krb5Path
      }
      ajaxCheckHiveConnect(postData).then(res => {
        if (res.data.code == '1') {
          Message.success(res.msg || '连接成功')
        } else {
          Message.error(res.msg || '连接失败')
        }
      })
    }

  }, {
    type: 'input',
    label: 'impala地址',
    prop: 'impalaAddr',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'impala用户',
    prop: 'impalaUser',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'impala密码',
    prop: 'impalaPwd',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'krb路径(impala)',
    prop: 'impalaKrb5Path',
    placeholder: '请输入',
    button: true,
    buttonText: '测试连接',
    buttonFun: () => {
      let postData = {
        'impalaAddr': addForm.model.impalaAddr,
        'impalaUser': addForm.model.impalaUser,
        'impalaPwd': addForm.model.impalaPwd,
        impalaKrb5Path: addForm.model.impalaKrb5Path
      }
      ajaxCheckImpalaConnect(postData).then(res => {
        if (res.data.code == '1') {
          Message.success(res.msg || '连接成功')
        } else {
          Message.error(res.msg || '连接失败')
        }
      })
    }

  }, {
    type: 'textarea',
    label: '集群描述',
    prop: 'clusterDesc',
    placeholder: '请输入'
  }
  ]
}

export const editorForm = {
  ref: 'formValidate',
  rules: {
    belongFamily: [{
      required: true,
      message: '所属家庭不能为空',
      trigger: 'change'
    }],
    ishouseholder: [{
      required: true,
      message: '是否是户主不能为空',
      trigger: 'change'
    }],
    name: [{
      required: true,
      message: '成员名称不能为空',
      trigger: 'blur'
    },
    {
      validator: checkEditorLink,
      message: '成员名称不能为空',
      trigger: ['change', 'blur']
    }
    ]

  },
  model: {
    clusterCode: '',
    clusterName: '',
    clusterDesc: '',
    hs2Addr: '',
    hs2User: '',
    hs2Pwd: '',
    impalaAddr: '',
    impalaUser: '',
    impalaPwd: '',
    hs2Krb5Path: '',
    impalaKrb5Path: ''
  },
  items: [{
    type: 'input',
    label: '集群标识',
    prop: 'clusterCode',
    placeholder: '请输入',
    disabled: true
  },
  {
    type: 'input',
    label: '集群中文名',
    prop: 'clusterName',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: 'hs2地址',
    prop: 'hs2Addr',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'hs2用户',
    prop: 'hs2User',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'hs2密码',
    prop: 'hs2Pwd',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: 'krb路径(hive)',
    prop: 'hs2Krb5Path',
    placeholder: '请输入',
    button: true,
    buttonText: '测试连接',
    buttonFun: () => {
      let postData = {
        'hs2Addr': editorForm.model.hs2Addr,
        'hs2User': editorForm.model.hs2User,
        'hs2Pwd': editorForm.model.hs2Pwd,
        hs2Krb5Path: editorForm.model.hs2Krb5Path
      }
      ajaxCheckHiveConnect(postData).then(res => {
        if (res.data.code == '1') {
          Message.success(res.msg || '连接成功')
        } else {
          Message.error(res.msg || '连接失败')
        }
      })
    }
  }, {
    type: 'input',
    label: 'impala地址',
    prop: 'impalaAddr',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'impala用户',
    prop: 'impalaUser',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: 'impala密码',
    prop: 'impalaPwd',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: 'krb路径(impala)',
    prop: 'impalaKrb5Path',
    placeholder: '请输入',
    button: true,
    buttonText: '测试连接',
    buttonFun: () => {
      let postData = {
        'impalaAddr': editorForm.model.impalaAddr,
        'impalaUser': editorForm.model.impalaUser,
        'impalaPwd': editorForm.model.impalaPwd,
        impalaKrb5Path: editorForm.model.impalaKrb5Path
      }
      ajaxCheckImpalaConnect(postData).then(res => {
        if (res.data.code == '1') {
          Message.success(res.msg || '连接成功')
        } else {
          Message.error(res.msg || '连接失败')
        }
      })
    }

  }, {
    type: 'textarea',
    label: '集群描述',
    prop: 'clusterDesc',
    placeholder: '请输入'
  }
  ]
}
