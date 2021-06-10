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
        <Select v-model="formValidate.colony" placeholder="集群选择" @on-change="colonyChange">
          <Option
            v-for="(item,index) in colonyArr"
            :key="index"
            :value="item.id"
            :label="item.name"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号类型" prop="type">
        <Select v-model="formValidate.type" placeholder="请选择账号类型" @on-change="typeEventFunc">
          <Option
            v-for="(item,index) in typeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="账号名称" prop="username">
        <Input v-model="formValidate.username" placeholder="请输入账号名称"></Input>
      </FormItem>
      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="primary" @click="oneNext" style="margin-right:5px;">下一步</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'userFormOne',
  props: ['editFormData'],
  data() {
    return {
      teamNameArr: [{
        label: 'BDAP',
        value: 'BDAP'
      },
      {
        label: 'NRDP',
        value: 'NRDP'
      }],
      colonyArr: [],
      typeArr: [
        {
          label: 'kerberos',
          type: 'file',
          value: '1'
        },
        {
          label: 'ldap',
          type: 'pwd',
          value: '2'
        },
        {
          label: 'jaas',
          type: 'pwd',
          value: '3'
        },
        {
          label: 'redis',
          type: 'pwd',
          value: '4'
        },
        {
          label: 'mysql',
          type: 'pwd',
          value: '5'
        },
        {
          label: 'cdh manager',
          type: 'pwd',
          value: '6'
        },
        {
          label: 'hive',
          type: 'file',
          value: '7'
        },
        {
          label: 'hdfs',
          type: 'file',
          value: '8'
        },
        {
          label: 'hbase',
          type: 'file',
          value: '9'
        },
        {
          label: 'kafka',
          type: 'pwd',
          value: '10'
        },
        {
          label: 'flink',
          type: 'userPwd',
          value: '11'
        }
      ],
      formValidate: {
        teamName: '',
        colony: '',
        type: '',
        username: '',
        typeValue: ''
      },
      ruleValidate: {
        teamName: [
          {
            required: true,
            message: '应用团队不能为空',
            trigger: 'blur'
          }
        ],
        colony: [
          {
            required: true,
            message: '集群不能为空',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '账户名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    typeEventFunc(event) {
      let obj = {}
      obj = this.typeArr.find((item) => { // model就是上面的数据源
        return item.value === event // 筛选出匹配数据
      })
      this.formValidate.typeValue = obj.type
    },
    getColonyArr() {
      let colonyStr = localStorage.getItem('colonyArr')
      if (colonyStr) {
        this.colonyArr = JSON.parse(colonyStr)
      }
    },
    colonyChange(val) {
      this.colonyArr.map(item => {
        if (item.colony == val) {
          this.environmentArr = [].concat(JSON.parse(JSON.stringify(item.rowEnvironmentArr)))
          this.formValidate.username = item.username || ''
        }
      })
    },
    // getEnviromentArr() {
    //   let enviromentStr = localStorage.getItem('environmentArr')
    //   if (enviromentStr) {
    //     this.environmentArr = JSON.parse(enviromentStr)
    //   }
    // },
    oneNext() {
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          this.$emit('oneNext', this.formValidate)
        } else {
          this.handleReset('formValidate')
          this.$emit('oneCancel')
        }
      })
      // console.log('this.formValidate', this.formValidate)
      // let postData = this.getFormData()
      // let str = localStorage.getItem('userArr')
      // let arr = []
      // if (str) {
      //   arr = JSON.parse(str)
      //   arr.push(postData)
      //   // 写在缓存里
      //   localStorage.setItem('userArr', JSON.stringify(arr))
      // } else {
      //   arr.push(postData)
      //   localStorage.setItem('userArr', JSON.stringify(arr))
      // }
      // let index = ''
      // this.colonyArr.map((item, idx) => {
      //   if (item.colony == this.formValidate.colony) {
      //     item.username = this.formValidate.username
      //     index = idx
      //   }
      // })
      // if (index != '') {
      //   localStorage.setItem('colonyArr', JSON.stringify(this.colonyArr))
      // }
      // this.handleReset('formValidate')
    },
    cancel() {
      this.$emit('oneCancel')
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
  watch() {
    console.log('子组件', this.editFormData)
  },
  mounted() {
    // this.getEnviromentArr()
    this.getColonyArr()
  }
}
</script>
