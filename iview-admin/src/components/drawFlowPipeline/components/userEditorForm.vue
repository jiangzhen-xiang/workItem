<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="应用团队" prop="teamName">
        <Select v-model="formValidate.teamName" placeholder="应用团队选择">
          <Option
            v-for="(item,index) in teamNameArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="集群" prop="colony">
        <Select v-model="formValidate.colony" placeholder="应用团队选择" @on-change="colonyChange">
          <Option
            v-for="(item,index) in colonyArr"
            :key="index"
            :value="item.colony"
            :label="item.colony"
          >{{item.colony}}</Option>
        </Select>
      </FormItem>
      <FormItem label="环境" prop="environment">
        <Select v-model="formValidate.environment" placeholder="请选择">
          <Option
            v-for="(item,index) in environmentArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号名称" prop="username">
        <Input v-model="formValidate.username" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="账号" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入" disabled></Input>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formValidate.password" placeholder="请输入"></Input>
      </FormItem>

      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'userEditorForm',
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
      environmentArr: this.userData.environmentArr,
      formValidate: {
        teamName: this.userData.teamName,
        environment: this.userData.environment,
        colony: this.userData.colony,
        name: this.userData.name,
        runtime: this.userData.runtime,
        password: this.userData.password,
        username: this.userData.username
      },
      formEditorValidate: {
        teamName: this.userData.teamName,
        environment: this.userData.environment,
        colony: this.userData.colony,
        name: this.userData.name,
        runtime: this.userData.runtime,
        password: this.userData.password,
        username: this.userData.username
      },
      ruleValidate: {
        teamName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ]
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
      for (let k in this.formEditorValidate) {
        this.formValidate[k] = this.formEditorValidate[k]
      }

      this.environmentArr = [].concat(this.userData.environmentArr)
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
