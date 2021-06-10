<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
    >
      <div style="display:none;">{{ getConnType }}</div>
      <FormItem label="集群" prop="clusterId">
        <Select
          v-model="formValidate.clusterId"
          placeholder="集群选择"
          @on-change="colonyChange"
        >
          <Option
            v-for="(item, index) in colonyArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.name"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="连接名称" prop="connName">
        <Input v-model="formValidate.connName" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="连接类型" prop="connType">
        <Input
          v-model="formValidate.connType"
          placeholder="请输入"
          disabled
        ></Input>
      </FormItem>
      <FormItem label="描述" prop="description">
        <Input
          v-model="formValidate.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <!-- <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
        <div class="btnWrapper" style="text-align:right;padding:5px 0;">
          <label class="ivu-form-item-label" style="width: 80px;">标签增加</label>
          <Button type="default" @click="handleAddAnnotions">增加</Button>
        </div>
        <div class="itemWrapper">
          <FormItem
            v-for="(item, index) in formValidate.annotions"
            :key="index"
            label="标签"
            :prop="item.name"
          >
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.name" placeholder="请输入"></Input>
              </Col>
              <Col span="4" offset="1" style="text-align:right;float:right;">
                <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
        </div>
      </div>-->
      <FormItem style="text-align:right;padding-top:10px;">
        <!-- <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button> -->
        <Button type="primary" @click="ok" style="margin-right:5px;"
          >下一步</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getLink, ajaxAddLink, getLinkCheck } from '@/api/link.js'
export default {
  name: 'commonForm',
  props: ['connType'],
  data () {
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
                  if (res.data.data) {
                    ;
                    callback(new Error('连接名称重复'))
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
        clusterId: '',
        connName: '',
        connType: '',
        environment: '',
        description: ''
        // annotions: [
        //   {
        //     name: ''
        //   }
        // ]
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
            trigger: 'change'
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
    getConnType () {
      this.formValidate.connType = this.connType
      return this.connType
    }
  },
  methods: {
    colonyChange () {},
    initFormLinkArr () {
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          this.colonyArr = res.data.data.list
        }
      })
    },
    // ok() {
    //   this.$refs.formValidate.validate(validate => {
    //     if (validate) {
    //       let postData = this.getFormData()
    //       ajaxAddLink(postData).then(res => {
    //         if (res.status == '200' && res.code == 'SUCCESS') {
    //           this.$Message.success(res.msg || '添加数据成功')
    //           this.$emit('handleOk', postData)
    //         } else {

    //         }
    //       }).catch(err => {
    //         this.$Message.error(res.msg || '与服务器通信错误,请稍后')
    //       })
    //     }
    //   })
    // },
    ok () {
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData()
          // ajaxAddLink(postData).then(res => {
          //   if (res.status == '200' && res.code == 'SUCCESS') {
          //     this.$Message.success(res.msg || '添加数据成功')
          //     this.$emit('handleOk', postData)
          //   } else {

          //   }
          // }).catch(err => {
          //   this.$Message.error(res.msg || '与服务器通信错误,请稍后')
          // })

          this.$emit('handleOk', postData)
        }
      })
    },
    cancel () {
      this.handleReset('formValidate')
      this.$emit('handleCancel', 'modalLink')
    },
    handleAddAnnotions () {
      this.formValidate.annotions.unshift({ name: '' })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      // this.formValidate.annotions = [].concat({
      //   name: ''
      // })
    },
    handleTestConnServe () {
      let postData = this.getFormData()
      this.$Message.success('连接成功')
    },
    handleRemove (index) {
      this.formValidate.annotions.splice(index, 1)
    },
    getFormData () {
      let postData = {
        connName: '',
        connType: '',
        clusterId: '',
        description: '',
        annotions: []
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created () {
    this.$bus.on('clear-form', this.handleReset1)
  },
  mounted () {
    this.$nextTick(() => {
      this.initFormLinkArr()
    })
  }
}
</script>
