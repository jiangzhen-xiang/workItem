<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
      <FormItem label="集群名称" prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="集群名称建议英文字母"
        ></Input>
      </FormItem>
      <FormItem label="集群简称" prop="code">
        <Input
          v-model="formValidate.code"
          placeholder="请输入集群简称"
        ></Input>
      </FormItem>
      <FormItem label="用户" prop="user">
        <Input
          v-model="formValidate.user"
          placeholder="请输入用户"
        ></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input
          v-model="formValidate.password"
          placeholder="请输入密码"
          type="password"
        ></Input>
      </FormItem>
      <FormItem label="集群信息" prop="node">
        <Input
          v-model="formValidate.node"
          placeholder="请输入集群信息"
        ></Input>
      </FormItem>
      <FormItem label="消费组" prop="groupId">
        <Input
          v-model="formValidate.groupId"
          placeholder="请输入消费组"
        ></Input>
      </FormItem>
      <FormItem label="zookeeper连接信息" prop="zk">
        <Input
          v-model="formValidate.zk"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入zookeeper连接信息"
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
import axios from 'axios'
import { ajaxGetClusterMeta, ajaxDeleteClusterMeta, ajaxAddClusterMeta } from '@/api/datametaCluster.js'
export default {
  name: 'colonyForm',
  data() {
    let isCanCheckLink = true
    const checkLink = (rule, value, callback) => {
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
            ajaxGetCluster(postData)
              .then(res => {
                isCanCheckLink = true
                // res.data 不为空，就是有数据
                if (res.data.status == 'ok') {
                  if (res.data.data.list.length) {
                    callback(new Error('集群名称重复'))
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
      typeArr: [],
      formValidate: {
        // type: '',
        code: '',
        name: '',
        user: '',
        password: '',
        node: '',
        zk: '',
        groupId:''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '集群名称不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 20, message: '最多输入20个字符', trigger: 'blur' }
          // {
          //   validator: checkLink,
          //   trigger: ['change', 'blur']
          // }
        ],
        user: [
          {
            required: true,
            message: '用户不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '集群简称不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        node: [
          {
            required: true,
            message: '集群信息不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        groupId: [
          {
            required: true,
            message: '消费组不能为空',
            trigger: 'blur'
          },
          {  min: 5, message: '至少输入5个字符', trigger: 'blur' },
          {  max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        zk: [
          {
            required: true,
            message: 'zookeeper连接信息不能为空',
            trigger: 'blur'
          },
        ],
      }
    }
  },
  methods: {
    getClusterTypeArr() {
      ajaxGetClusterType().then(res => {
        if (res.data.status == 'ok') {
          this.typeArr = res.data.data
        }
      })
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      console.log(postData);
      
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          console.log(postData);
          
          ajaxAddClusterMeta(postData).then(res => {
            if (res.data.status == '1') {
              this.$Message.success('添加成功')
              this.handleReset('formValidate')
              this.$emit('handleSuccess', postData)
            } else {
              this.$Message.error(res.data.message || '添加失败')
            }
          })
          // axios.post('http://172.16.6.207:8815/cluster/save', {

          //   'code': postData.code,
          //   'name': postData.name,
          //   'user': postData.user,
          //   'password': postData.password,
          //   'node': postData.node,
          //   'zk': postData.zk

          // }).then(res => {
          //   alert('res')
          // }).error(err => {
          //   alert('error')
          // })
        }
      })
      // let str = localStorage.getItem('colonyArr')
      // let arr = []
      // if (str) {
      //   arr = JSON.parse(str)
      //   arr.unshift(postData)
      //   // 写在缓存里
      //   localStorage.setItem('colonyArr', JSON.stringify(arr))
      // } else {
      //   arr.push(postData)
      //   localStorage.setItem('colonyArr', JSON.stringify(arr))
      // }
      // this.handleReset('formValidate')
      // this.$emit('handleSuccess', postData)
    },
    cancel() {
      this.handleReset('formValidate')
      this.$emit('handleCancel', 'modalColony')
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
      // let time = this.$timeFormat(new Date().getTime())
      // console.log('====time', time)
      let postData = {
        // type: '',
        // code: '',
        // name: '',
        // user: '',
        // password: '',
        // node: '',
        // zk: ''
        code: '',
        name: '',
        user: '',
        password: '',
        node: '',
        groupId:'',
        zk:'',
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created() { },
  mounted() {
    this.getClusterTypeArr()
  }
}
</script>
