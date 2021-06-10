<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="应用团队:" prop="teamName">
        <span>{{formValidate.teamName}}</span>
      </FormItem>
      <FormItem label="集群:" prop="colony">
        <span>{{formValidate.colony}}</span>
      </FormItem>
      <FormItem label="环境:" prop="environment">
        <span>{{formValidate.environment}}</span>
      </FormItem>
      <FormItem label="账号名称:" prop="username">
        <span>{{formValidate.username}}</span>
      </FormItem>
      <FormItem label="账号:" prop="name">
        <span>{{formValidate.name}}</span>
      </FormItem>

      <FormItem label="密码:" prop="password">
        <span>{{formValidate.password}}</span>
      </FormItem>
      <!--
      <FormItem style="text-align:right;padding-top:10px;display:none">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>-->
    </Form>
  </div>
</template>
<script>
export default {
  name: 'userLookForm',
  props: ['userData'],
  data() {
    return {
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      teamNameArr: [{
        label: 'BDAP',
        value: 'BDAP'
      },
      {
        label: 'NRDP',
        value: 'NRDP'
      }],
      colonyArr: [],
      // environmentArr: [],
      environmentArr: '',
      formValidate: {
        teamName: '',
        environment: '',
        colony: '',
        name: '',
        runtime: '',
        password: '',
        username: ''
      },

      ruleValidate: {

      }
    }
  },
  computed: {
    getEnvironmentArr() {
      let val = this.formValidate.environment

      this.colonyArr.map(item => {
        (item.colony == val) && (this.environmentArr = [].concat(JSON.parse(JSON.stringify(item.rowEnvironmentArr))))
      })
    }
  },
  methods: {
    getColonyArr() {
      let colonyStr = localStorage.getItem('colonyArr')
      if (colonyStr) {
        this.colonyArr = JSON.parse(colonyStr)
      }
    },
    colonyChange(val) {
      this.colonyArr.map(item => {
        (item.colony == val) && (this.environmentArr = [].concat(JSON.parse(JSON.stringify(item.rowEnvironmentArr))))
      })
    },

    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.handleReset('formValidate')
      this.$emit('handleSuccess', postData)
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
      let postData = {
        teamName: '',
        environment: '',
        runtime: '',
        colony: '',
        password: '',
        name: '',
        username: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.Operator = 'admin'
      postData.curEnvironment = postData.environment
      postData.environmentArr = JSON.parse(JSON.stringify(this.environmentArr))
      postData.time = this.$timeFormat(new Date())
      return postData
    }
  },
  created() { },

  mounted() {

    console.log('===========userData', this.userData)
    // this.getEnviromentArr()
    this.getColonyArr()
  }
}
</script>
