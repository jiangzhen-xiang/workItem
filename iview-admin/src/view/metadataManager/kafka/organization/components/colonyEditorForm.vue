<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem label="系统名称" prop="systemName">
        <Input
          v-model="formValidate.systemName"
          placeholder="系统名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem label="系统简称" prop="systemCode">
        <Input
          v-model="formValidate.systemCode"
          placeholder="请输入系统简称"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>
      <FormItem label="集群" prop="cluster">
        <Input
          v-model="formValidate.cluster"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ajaxEditorUserMeta } from '@/api/datametaCluster.js'
export default {
  name: 'colonyForm',
  props: ['row'],
  data() {
    let isCanCheckLink = true
    const checkLink = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('集群名称不能为空'))
      } else {
        // 请求后端，获取这个账号名称，如果有数据，就提示有数据
        if (isCanCheckLink) {
          isCanCheckLink = false
          setTimeout(() => {
            let postData = {}
            postData.name = value
            postData.pageSize = 1000
            postData.pageNum = 1
            ajaxGetCluster(postData)
              .then(res => {
                isCanCheckLink = true
                // res.data 不为空，就是有数据
                if (res.data.status == 'ok') {
                  if (res.data.data.list.length && (res.data.data.list[0].id !== this.formValidate.id)) {
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
    return {
      colonyArr: [],
      typeArr: [],
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      enviromentArr: [],
      formValidate: {
        id: '',
        systemName: '',
        systemCode: '',
        name: '',
        cluster: ''

      },
      formEditorValidate: {
        id: '',
        systemName: '',
        systemCode: '',
        name: '',
        cluster: ''
      },
      ruleValidate: {
        name: [
          // {
          //   validator: checkLink,
          //   trigger: ['change', 'blur']
          // }
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }

        ]
      }
    }
  },
  methods: {
    getClusterTypeArr() {
      ajaxGetClusterType().then(res => {
        if (res.data.status == 'ok') {
          this.typeArr = res.data.data
        }
      })
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxEditorUserMeta(postData).then(res => {
            if (res.data.status == '1') {
              this.$Message.success('编辑成功')
              this.handleReset('formValidate')
              this.$emit('handleSuccess', postData)
            } else {
              this.$Message.error(res.data.message || '编辑失败')
            }
          })
        }
      })
      // let str = localStorage.getItem('colonyArr')
      // let arr = []
      // if (str) {
      //   arr = JSON.parse(str)
      //   arr.unshift(postData)
      //   // 写在缓存里
      //   localStorage.setItem('colonyArr', JSON.stringify(arr))
      // } else {
      //   arr.push(postData)
      //   localStorage.setItem('colonyArr', JSON.stringify(arr))
      // }
      // this.handleReset('formValidate')
      // this.$emit('handleSuccess', postData)
    },
    cancel() {
      this.handleReset('formValidate')
      for (let k in this.formEditorValidate) {
        this.formValidate[k] = this.formEditorValidate[k]
      }
      this.$emit('handleCancel', 'modalEditorColony')
    },
    handleAddAnnotions() {
      this.formValidate.annotions.unshift({ name: '' })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
      this.formValidate.annotions = [].concat({
        name: ''
      })
    },
    handleTestConnServe() {
      let postData = this.getFormData()
      this.$Message.success('连接成功')
    },
    handleRemove(index) {
      this.formValidate.annotions.splice(index, 1)
    },
    getFormData() {
      let postData = {
        id: '',
        systemName: '',
        systemCode: '',
        name: '',
        cluster: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    }
  },
  created() { },
  mounted() {
    this.getClusterTypeArr()
  }
}
</script>
