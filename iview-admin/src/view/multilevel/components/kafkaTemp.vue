<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="关联环境" prop="authType">
        <Select v-model="formValidate.authType" multiple placeholder="请选择">
          <Option
            v-for="(item,index) in devArr"
            :key="index"
            :value="item.id"
            :label="item.name"
          >{{item.name}}</Option>
        </Select>
      </FormItem>

      <div
        class="environmentWrapper"
        style="border: solid 1px #ddd;
    border-radius: 5px;
    padding: 0 10px;
}"
      >
        <div v-for="(item,index) in formValidate.authType" :key="index">
          <h4
            class="h2"
            style="border-bottom: 1px solid #e8eaec;
    padding: 14px 16px 14px 16px;
    line-height: 1;
    margin-bottom: 10px;"
          >
            <Icon type="ios-options" />
            {{getEnvName(item)}}
          </h4>
          <div>
            <component
              :ref="'modalForm_'+item"
              @handleOk="handleStepTwo"
              @handleCancel="handleStepTwoFail"
              :is="zjName"
            ></component>
          </div>
        </div>
      </div>

      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">上一步</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">下一步</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import mongodbForm from './mongodbForm'
import mongodbEditorForm from './mongodbEditorForm'
import implaEditorForm from './implaEditorForm'
import hiveEditorForm from './hiveEditorForm'
import kafkaEditorForm from './kafkaEditorForm'
import hbaseEditorForm from './hbaseEditorForm'
import kafkaForm from './kafkaForm'
import restmqForm from './restmqForm'
import restmqEditorForm from './restmqEditorForm'
import hiveForm from './hiveForm'
import hbaseForm from './hbaseForm'
import implaForm from './implaForm'
import commonForm from './commonForm'
import { ajaxGetEnv } from '@/api/env.js'
export default {
  name: 'kafkaTemp',
  props: ['stepOneData'],
  data() {
    return {
      resultArr: [], // 校验的第二步的结果
      formType: '',
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      devArr: [],
      saslArr: [{
        label: 'PLAIN',
        value: 'PLAIN'
      }],
      ruleValidate: {

      },
      formValidate: {

        authType: ''
      }
    }
  },
  computed: {
    zjName() {

      this.formType = this.stepOneData.connType + 'Form'
      return this.formType
    }
  },
  components: {
    hbaseForm,
    hbaseEditorForm,
    kafkaForm,
    kafkaEditorForm,
    hiveForm,
    hiveEditorForm,
    restmqForm,
    restmqEditorForm,
    commonForm
  },
  methods: {
    getEnvName(id) {
      let oo = this.devArr.filter(item => {
        return item.id == id
      })
      return oo[0].name
    },
    getDevArr() {
      let postData = {}
      postData.clusterId = this.stepOneData.clusterId
      postData.pageSize = 1000
      postData.pageNum = 1
      ajaxGetEnv(postData).then(res => {
        if (res.data.status == 'ok') {
          this.devArr = [].concat(res.data.data.list || [])
        }
        this.formValidate.authType = res.data.data.list.map(item => {
          return item.id
        })
      })
    },
    handleStepTwo(postData) {
      // 赋值
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
        _self.$refs[formName][0].$refs.formValidate.validate((valid) => {
          if (valid) {
            resolve()
          } else { reject() }
        })
      })
      _self.resultArr.push(result) // push 得到promise的结果
    },
    ok() {

      let that = this
      that.resultArr = []
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData()
          let isValidate = true

          this.formValidate.authType.map(item => {
            that.checkForm('modalForm_' + item)
          })
          Promise.all(that.resultArr).then(function () { // 都通过了

            // 所有校验都通过了，把数据获取到
            let envArr = []
            that.formValidate.authType.map(item => {
              let oo = {}
              oo.environment = item
              oo.envName = that.getEnvName(item)
              let obj = that.$refs['modalForm_' + item][0].formValidate
              for (let k in obj) {
                oo[k] = obj[k]
              }
              envArr.push(oo)
            })

            that.$emit('handleOk', { authType: envArr })
          }).catch(function () {
            console.log('err')
          })
        } else {
          this.$emit('handleCancel', 'error')
        }
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

        authType: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
