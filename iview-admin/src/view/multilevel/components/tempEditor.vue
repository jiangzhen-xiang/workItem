<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="关联环境" prop="authType">
        <Select v-model="formValidate.authType" multiple placeholder="请选择">
          <Option
            v-for="(item, index) in devArr"
            :key="index"
            :value="item.id"
            :label="item.name"
          >{{ item.name }}</Option>
        </Select>
      </FormItem>

      <div class="environmentWrapper" style="padding: 0 10px;}">
        <!-- <div v-for="(item, index) in formValidate.authType" :key="index">
          <h4
            class="h2"
            style="border-bottom: 1px solid #e8eaec;padding: 14px 16px 14px 16px;line-height: 1;margin-bottom: 10px;"
          >
            <Icon type="ios-options" />
            {{ getEnvName(item) }}
          </h4>
          <div>
            <component
              :ref="'modalForm_' + item"
              @handleOk="handleStepTwo"
              @handleCancel="handleStepTwoFail"
              :is="zjName"
            ></component>
          </div>
        </div>-->
        <Collapse v-model="value1">
          <Panel :name="index.toString()" v-for="(item, index) in formValidate.authType">
            {{ getEnvName(item) }}
            <div slot="content">
              <keep-alive include>
                <component
                  :ref="'modalForm_' + item"
                  @handleOk="handleStepTwo"
                  @handleCancel="handleStepTwoFail"
                  :is="zjName"
                ></component>
              </keep-alive>
            </div>
          </Panel>
        </Collapse>
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
// import kafkaEditorForm from './kafkaEditorForm'
import kafkaForm from './kafkaForm'
import restmqForm from './restmqForm'
import restmqEditorForm from './restmqEditorForm'
import hiveForm from './hiveForm'
import hbaseForm from './hbaseForm'
import implaForm from './implaForm'

// 已经用到的代码
import cmEditorForm from './cmEditorForm'
import yarnEditorForm from './yarnEditorForm'
import flinkEditorForm from './flinkEditorForm'
import hdfsEditorForm from './hdfsEditorForm'
import hbaseEditorForm from './hbaseEditorForm'
import kafkaEditorForm from './kafkaEditorForm'
import hiveMetastoreEditorForm from './hiveMetastoreEditorForm'

import commonForm from './commonForm'
import { ajaxGetEnv } from '@/api/env.js'
import { ajaxGetConnEnv } from '@/api/link.js'
import { handleParseData } from '@/utils/parseData.js'
export default {
  name: 'kafkaTemp',
  props: ['stepOneData'],
  data () {
    return {
      value1: '0',
      resultArr: [], // 校验的第二步的结果
      formType: '',
      runtimeArr: [
        {
          label: 'AutoResolveIntegrationRuntime',
          value: 'AutoResolveIntegrationRuntime'
        }
      ],
      devArr: [],
      saslArr: [
        {
          label: 'PLAIN',
          value: 'PLAIN'
        }
      ],
      ruleValidate: {},
      formValidate: {
        authType: ''
      }
    }
  },
  computed: {
    zjName () {
      if (this.stepOneData.connType == 'hive-metastore') {
        this.formType = 'hiveMetastoreEditorForm'
      } else {
        this.formType = this.stepOneData.connType + 'EditorForm'
      }
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
    flinkEditorForm,
    cmEditorForm,
    yarnEditorForm,
    hdfsEditorForm,
    hiveMetastoreEditorForm,
    commonForm
  },
  methods: {
    getEnvName (id) {
      let oo = this.devArr.filter(item => {
        return item.id == id
      })
      return oo[0].name
    },
    getDevArr () {
      let postData = {}
      let that = this
      postData.clusterId = this.stepOneData.clusterId
      postData.pageSize = 1000
      postData.pageNum = 1
      ajaxGetEnv(postData).then(res => {
        if (res.data.status == 'ok') {
          that.devArr = [].concat(res.data.data.list || [])
        }
        // 获取这个这个集群下的所有数据
        ajaxGetConnEnv(this.stepOneData).then(res => {
          if (res.data.status == 'ok') {
            // TODO 要把每个form中的值给赋值进去

            that.formValidate.authType = res.data.data.map(item => {
              return item.envId
            })
            that.$nextTick(() => {
              res.data.data.map(item => {
                let targetData = handleParseData[
                  that.stepOneData.connType + 'ParseData'
                ](item)
                for (let k in that.$refs['modalForm_' + item.envId][0]
                  .formValidate) {
                  that.$refs['modalForm_' + item.envId][0].formValidate[k] =
                    targetData[k]
                }
                // that.$refs['modalForm_' + item.envId][0].formValidate['files'] =
                //   item.files || []
                // that.$refs['modalForm_' + item.envId][0].formValidate['files'] =
                //   item.connectionEnvConfig || []
              })
            })
          }
        })
      })
    },
    handleStepTwo (postData) {
      // 赋值
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }
      // 设置下当前的步骤
      this.stepEditor = 1
      this.stepEditorStatus = 'success'
    },
    handleStepTwoFail (status) {
      // 设置下当前的步骤
      this.stepEditor = 0
      this.stepEditorStatus = status
    },
    checkForm (formName) {
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
    ok () {
      let that = this
      that.resultArr = []
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData()
          let isValidate = true

          this.formValidate.authType.map(item => {
            that.checkForm('modalForm_' + item)
          })
          Promise.all(that.resultArr)
            .then(function () {
              // 都通过了

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
            })
            .catch(function () {
              console.log('err')
            })
        } else {
          this.$emit('handleCancel', 'error')
        }
      })
    },
    cancel () {
      // this.handleReset('formValidate')
      this.$emit('handleCancel', 'success')
    },
    handleAddAnnotions () {
      this.formValidate.annotions.unshift({ name: '' })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.formValidate.annotions = [].concat({
        name: ''
      })
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
        authType: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    }
  },
  created () { },
  mounted () { }
}
</script>
