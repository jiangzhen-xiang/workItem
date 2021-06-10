import {
  ajaxGetMember
} from '@/api/member.js'
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
        postData.name = value
        postData.pageSize = 1000
        postData.pageNum = 1
        ajaxGetMember(postData)
          .then(res => {
            isCanCheckLink = true
            // res.data 不为空，就是有数据
            if (res.data.status == 'ok') {
              if (res.data.data.length) {
                callback(new Error('家庭名称重复'))
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

const checkEditorLink = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('家庭名称不能为空'))
  } else {
    // 请求后端，获取这个账号名称，如果有数据，就提示有数据
    if (isCanCheckLink) {
      isCanCheckLink = false
      setTimeout(() => {
        let postData = {}
        postData.name = value
        postData.pageSize = 1000
        postData.pageNum = 1

        ajaxGetMember(postData)
          .then(res => {
            isCanCheckLink = true
            // res.data 不为空，就是有数据
            if (res.data.status == 'ok') {
              let filterArr = res.data.data.filter(item => {
                return (item.name == postData.name && item.id != editorForm.model.id)
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
            isCanCheckLink = true
          })
      }, 1000)
    }
  }
}
export const addForm = {
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
      validator: checkLink,
      message: '成员名称不能为空',
      trigger: ['change', 'blur']
    }
    ]

  },
  model: {
    ishouseholder: '',
    name: '',
    belongFamily: '',
    card: '',
    belonghouseholderrole: ''
  },
  items: [{
    type: 'input',
    label: '成员名称',
    prop: 'name',
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '是否为户主',
    prop: 'ishouseholder',
    placeholder: '请输入',
    options: [{
      key: 'key1',
      value: 'true',
      label: '是'
    },
    {
      key: 'key2',
      value: 'false',
      label: '否'

    }
    ]

  },
  {
    type: 'select',
    label: '所属家庭',
    prop: 'belongFamily',
    placeholder: '请输入',
    options: []

  },
  {
    type: 'input',
    label: '证件号',
    prop: 'card',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: '家庭角色',
    prop: 'belonghouseholderrole',
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
    id: '',
    ishouseholder: '',
    name: '',
    belongFamily: '',
    card: '',
    belonghouseholderrole: ''
  },
  items: [{
    type: 'input',
    label: '成员名称',
    prop: 'name',
    placeholder: '请输入'
  },

  {
    type: 'select',
    label: '是否为户主',
    prop: 'ishouseholder',
    placeholder: '请输入',
    options: [{
      key: 'key1',
      value: 'true',
      label: '是'
    },
    {
      key: 'key2',
      value: 'false',
      label: '否'

    }
    ]

  },
  {
    type: 'select',
    label: '所属家庭',
    prop: 'belongFamily',
    placeholder: '请输入',
    options: []

  },

  {
    type: 'input',
    label: '证件号',
    prop: 'card',
    placeholder: '请输入'
  }, {
    type: 'input',
    label: '家庭角色',
    prop: 'belonghouseholderrole',
    placeholder: '请输入'
  }
  ]
}
