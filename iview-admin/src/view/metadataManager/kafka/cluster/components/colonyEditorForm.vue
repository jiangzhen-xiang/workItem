<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="集群名称" prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>
      <FormItem label="编码" prop="code">
        <Input
          v-model="formValidate.code"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>
      <FormItem label="用户" prop="user">
        <Input
          v-model="formValidate.user"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input
          v-model="formValidate.password"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
          type="password"
        ></Input>
      </FormItem>
      <FormItem label="集群信息" prop="node">
        <Input
          v-model="formValidate.node"
          placeholder="集群名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem label="zookeeper连接信息" prop="zookeeperConnect">
        <Input
          v-model="formValidate.zookeeperConnect"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入"
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
import axios from 'axios'
import { ajaxEditorClusterMeta } from '@/api/datametaCluster.js'
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
        code: this.row.code,
        name: this.row.name,
        user: this.row.user,
        password: this.row.password,
        node: this.row.node,
        zookeeperConnect: this.row.zookeeperConnect

      },
      formEditorValidate: {
        id: '',
        code: this.row.code,
        name: this.row.name,
        user: this.row.user,
        password: this.row.password,
        node: this.row.node,
        zookeeperConnect: this.row.zookeeperConnect
      },
      ruleValidate: {
        name: [
          // {
          //   validator: checkLink,
          //   trigger: ['change', 'blur']
          // }

        ]
      }
    }
  },
  methods: {
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxEditorClusterMeta(postData).then(res => {
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
        'id': '',
        'code': '',
        'name': '',
        'user': '',
        'password': '',
        'node': '',
        'zookeeperConnect': ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    }
  },
  created() { },
  mounted() {

  }
}
</script>
