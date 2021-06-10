<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <div style="display:none;">{{ getConnType }}</div>
      <FormItem label="集群" prop="clusterId">
        <Select
          v-model="formValidate.clusterId"
          placeholder="集群选择"
          :disabled="getClusterId"
          @on-change="colonyChange"
        >
          <Option
            v-for="(item, index) in colonyArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.name"
          >{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="连接名称" prop="connName">
        <Input v-model="formValidate.connName" placeholder="请输入" :disabled="formType =='editor'"></Input>
      </FormItem>
      <FormItem label="连接类型" prop="connType">
        <Input v-model="formValidate.connType" placeholder="请输入" disabled></Input>
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
import { getLink, ajaxEditorConn, getLinkCheck } from '@/api/link.js'
export default {
  name: 'commonEditorForm',
  props: ['connType', 'formType'],
  data() {
    let isCanCheckLink = true
    const checkLink = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('连接名称不能为空'))
      } else {
        // 请求后端，获取这个账号名称，如果有数据，就提示有数据
        if (isCanCheckLink) {
          isCanCheckLink = false
          setTimeout(() => {
            console.log('校验字段，校验连接名称')

            getLinkCheck(value, this.formValidate.clusterId)
              .then(res => {
                isCanCheckLink = true
                // res.data 不为空，就是有数据

                if (res.data.status == 'ok') {
                  if (this.formType == 'editor') {
                    if (
                      res.data.data &&
                      res.data.data != this.formValidate.connId
                    ) {
                      callback(new Error('连接名称重复'))
                    } else {
                      callback()
                    }
                  } else {
                    if (res.data.data) {
                      callback(new Error('连接名称重复'))
                    } else {
                      callback()
                    }
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
      authTypeArr: [
        {
          label: 'none',
          value: 'none'
        },
        {
          label: 'kerberos',
          value: 'kerberos'
        }
      ],
      formValidate: {
        connId: '',
        clusterId: '',
        connName: '',
        connType: '',
        description: ''
      },
      ruleValidate: {
        connName: [
          {
            required: true,
            message: '连接名称不能为空',
            trigger: 'blur'
          },
          // TODO 测试接口时放开
          {
            validator: checkLink,
            trigger: ['change', 'blur']
          }
        ],
        connType: [
          {
            required: true,
            message: '连接类型为空',
            trigger: 'change'
          }
        ],
        clusterId: [
          {
            required: true,
            message: '集群名称不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    getClusterId() {
      return this.$route.query.id || ((this.formType == 'editor') && this.formValidate.clusterId)
    },
    getConnType() {
      this.formValidate.connType = this.connType
      return this.connType
    }
  },
  activated() {
    this.initFormLinkArr()
  },
  methods: {
    colonyChange() { },
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
    ok() {
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData()
          ajaxEditorConn(postData)
            .then(res => {
              if (res.data.status == 'ok') {
                if (this.formType == 'editor') {
                  this.$Message.success(res.msg || '编辑连接成功')
                } else {
                  this.$Message.success(res.msg || '添加连接成功')
                }

                this.$emit('handleOk', 'modalEditorLink')
                this.handleReset('formValidate')
              } else {
              }
            })
            .catch(err => {
              this.$Message.error(res.msg || '与服务器通信错误,请稍后')
            })
        }
      })
    },
    cancel() {
      this.handleReset('formValidate')
      this.$emit('handleCancel', 'modalEditorLink')
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    getFormData() {
      let postData = {
        connId: '',
        connName: '',
        connType: '',
        clusterId: '',
        description: ''
      }
      if (this.formType != 'editor') {
        delete postData.connId
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.initFormLinkArr()
    })
  }
}
</script>
