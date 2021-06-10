<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="集群" prop="clusterId">
        <Select v-model="formValidate.clusterId" placeholder="集群选择" disabled>
          <Option
            v-for="(item, index) in colonyArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.name"
          >{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="环境名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="描述" prop="description">
        <Input
          v-model="formValidate.description"
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
import { ajaxGetEnv, ajaxEditorEnv, ajaxDeleteEnv } from '@/api/env.js'
import { getLink } from '@/api/link.js'
export default {
  name: 'colonyForm',
  props: ['index', 'curColony'],
  data() {
    let isCanCheckLink = true
    const checkLink = (rule, value, callback) => {
      let that = this
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
            postData.clusterId = this.formValidate.clusterId
            ajaxGetEnv(postData)
              .then(res => {
                isCanCheckLink = true
                // res.data 不为空，就是有数据

                if (res.data.status == 'ok') {
                  if (
                    res.data.data.list.length &&
                    res.data.data.list[0].id != this.formValidate.id
                  ) {

                    callback(new Error('当前集群下环境名称重复'))
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
      runtimeArr: [
        {
          label: 'AutoResolveIntegrationRuntime',
          value: 'AutoResolveIntegrationRuntime'
        }
      ],
      environmentArr: [],
      formValidate: {
        clusterId: '',
        id: '',
        name: '',
        description: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '环境名称不能为空',
            trigger: 'blur'
          },
          {
            validator: checkLink,
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    initFormLinkArr() {
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          this.colonyArr = res.data.data.list
        }
      })
    },
    handleConn() {
      this.$Message.success('连接成功')
    },

    ok() {

      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxEditorEnv(postData)
            .then(res => {
              if (res.data.status == 'ok') {
                this.$Message.success('编辑环境成功')

                this.handleReset('formValidate')
                this.$emit('handleSuccess', postData)
              } else {
                this.$Message.error('编辑环境失败')
              }
            })
            .catch(err => {
              this.$Message.error('与服务器通信失败')
            })
        }
      })
    },
    cancel() {
      this.handleReset('formValidate')
      this.$emit('handleCancel', 'modalEditorRowEnvironment')
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
      let time = this.$timeFormat(new Date().getTime())
      console.log('====time', time)
      let postData = {
        id: '',
        name: '',
        description: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.clusterId = this.$route.query.id

      return postData
    }
  },
  created() { },
  mounted() {
    this.initFormLinkArr()
  }
}
</script>
