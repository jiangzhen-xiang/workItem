<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <div style="display:none;">{{ getConnType }}</div>

      <div
        class="environmentWrapper"
        style="border: solid 1px #ddd;border-radius: 5px;padding: 0 10px;"
      >
        <div v-for="(item, index) in authType" :key="index">
          <h4
            class="h2"
            style="border-bottom: 1px solid #e8eaec;padding: 14px 16px 14px 16px;line-height: 1;margin-bottom: 10px;"
          >
            <Icon type="ios-options" />
            {{ item.envName }}
          </h4>
          <div>
            <component
              :ref="'modalForm_' + item.environment"
              :clusterId="stepOneData.clusterId"
              :formValidate="item"
              :index="index"
              @setFilePrev="setFilePrev"
              @handleOk="handleStepTwo"
              @handleCancel="handleStepTwoFail"
              :is="zjName"
            ></component>
          </div>
        </div>
      </div>

      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">上一步</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">测试连接</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import excel from '@/libs/excel'

import kafkaPrev from './kafkaPrev'
import hbasePrev from './hbasePrev'
// import flinkPrev from './hbasePrev'
import { getLink, ajaxAddLink, ajaxSetConnToEnv } from '@/api/link.js'

export default {
  name: 'kafkaTemp',
  props: ['stepOneData', 'linkForm', 'authType'],
  data() {
    return {
      resultArr: [], // 校验的第二步的结果
      formType: '',
      runtimeArr: [
        {
          label: 'AutoResolveIntegrationRuntime',
          value: 'AutoResolveIntegrationRuntime'
        }
      ],
      authTypeArr: [
        {
          label: 'develop',
          value: 'develop'
        },
        {
          label: 'product',
          value: 'product'
        },
        {
          label: 'test',
          value: 'test'
        }
      ],
      saslArr: [
        {
          label: 'PLAIN',
          value: 'PLAIN'
        }
      ],
      ruleValidate: {},
      formValidate: {}
    }
  },
  computed: {
    zjName() {
      ;
      this.formType = this.stepOneData.connType + 'Prev'
      return this.formType
    },
    getConnType() {
      this.formType = this.stepOneData.connType + 'Form'
      this.formValidate.connType = this.connType
      return this.connType
    }
  },
  components: {
    // flinkPrev,
    kafkaPrev,
    hbasePrev
  },
  methods: {
    setFilePrev(item, index) {
      ;
      this.authType[index].files.push(item)
      this.$set(this.authType, index, this.authType[index])
    },
    handleStepTwo(postData) {
      // 赋值
      ;
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }
      // 设置下当前的步骤
      this.step = 1
      this.stepStatus = 'success'
    },
    handleStepTwoFail(status) {
      // 设置下当前的步骤
      this.step = 0
      this.stepStatus = status
    },
    checkForm(formName) {
      let _self = this
      let result = new Promise(function (resolve, reject) {
        _self.$refs[formName][0].$refs.formValidate.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      _self.resultArr.push(result) // push 得到promise的结果
    },
    ok() {
      ;
      let that = this
      that.resultArr = []

      this.authType.map(item => {
        that.checkForm('modalForm_' + item.environment)
      })

      Promise.all(that.resultArr)
        .then(function () {
          // 都通过了
          // 把所有获取到的值给传递到后台
          let envArr = []
          that.authType.map(item => {
            let oo = {}

            let obj = that.$refs[
              'modalForm_' + item.environment
            ][0].getFormData()
            obj.environment = item.environment
            oo = obj
            envArr.push(oo)
          })
          // 已经拿到了所有输入的值
          // 可以去添加
          let postData = JSON.parse(JSON.stringify(that.linkForm))
          postData.environmentArr = envArr
          console.log('===========linkData', postData)
          // TODO test code
          // that.$emit('handleOk', postData)
          // 连接的正常的
          ajaxAddLink(postData)
            .then(res => {
              if (res.data.status == 'ok') {
                that.$Message.success(res.msg || '添加连接成功')
                //  that.$emit('handleOk', postData)
                // TODO  遍历 数组，把关系给搞过去
                postData.environmentArr.map((env, index) => {
                  let postDataEnv = {}
                  postDataEnv.clusterId = +postData.clusterId
                  postDataEnv.envId = env.environment
                  postDataEnv.connId = res.data.data
                  postDataEnv.connectionInfo = env
                  postDataEnv.jsonInfoData = env.jsonInfoData
                  ajaxSetConnToEnv(postDataEnv).then(res => {
                    if (res.data.status == 'ok') {
                      that.$Message.success('设置连接环境映射成功')
                      index == 0 && that.$emit('handleOk', postData)
                    }
                  })
                })
              } else {
                that.$Message.error(res.msg || '添加连接失败')
              }
            })
            .catch(err => {
              that.$Message.error(err || '添加连接失败')
            })
        })
        .catch(function () {
          console.log('err')
        })
    },
    cancel() {
      // this.handleReset('formValidate')
      this.$emit('handleCancel', 'success')
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
        link: '',
        authType: '',
        desc: '',
        sasl: '',
        server: '',
        annotions: []
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.type = 'kafka'
      postData.time = this.$timeFormat(new Date())
      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
