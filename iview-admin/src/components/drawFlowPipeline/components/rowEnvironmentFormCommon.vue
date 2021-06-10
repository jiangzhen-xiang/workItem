<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="环境名称" prop="colony">
        <Input v-model="formValidate.environment" placeholder="请输入"></Input>
      </FormItem>
      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ajaxAddEnv } from '@/api/env.js'
export default {
  name: 'rowEnvironmentFormCommon',
  props: ['index', 'curColony'],
  data() {
    return {
      colonyArr: [],
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      environmentArr: [],
      formValidate: {
        colony: '',
        environment: '',
        colony: '',
        environment: '',
        creator: '',
        time: '',
        linkInfo: ''
      },
      ruleValidate: {
        environment: [
          {
            required: true,
            message: '环境名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getenvironmentArr() {
      let environmentStr = localStorage.getItem('environmentArr')
      if (environmentStr) {
        this.environmentArr = JSON.parse(environmentStr)
      }
    },
    ok() {

      let curColonyObj = JSON.parse(this.curColony)
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      curColonyObj.rowEnvironmentArr.push({ label: postData.environment, value: postData.environment })
      let str = localStorage.getItem('commonArr')
      let arr = []
      if (str) {
        arr = JSON.parse(str)
        // 将环境写进rowenvironment里面
        // this.$set(arr, this.index, curColonyObj)
        curColonyObj.index = this.index
        arr.splice(this.index, 1, curColonyObj)

        localStorage.setItem('commonArr', JSON.stringify(arr))
      } else {

      }
      this.handleReset('formValidate')
      this.$emit('handleSuccess', curColonyObj)

      // 设置环境
      this.getenvironmentArr()
      this.environmentArr.push({ label: postData.environment, value: postData.environment })
      localStorage.setItem('environmentArr', JSON.stringify(this.environmentArr))
    },
    cancel() {
      this.handleReset('formValidate')
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
        environment: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.index = this.index
      return postData
    }
  },
  created() { },
  mounted() {
    this.getenvironmentArr()
  }
}
</script>
