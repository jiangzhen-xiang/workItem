<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="120"
    >
      <FormItem label="任务名称" prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="任务名称建议英文字母"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>
      <FormItem label="脚本类型" prop="operationType">
        <Select v-model="formValidate.operationType" transfer disabled>
          <Option
            v-for="(item, index) in scriptTypeArr"
            :key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="集群" prop="cluster">
        <Select
          v-model="formValidate.cluster"
          transfer
          @on-change="handleChangeCluster"
        >
          <Option
            v-for="(item, index) in colonyArr"
            :key="index"
            :label="item.name"
            :value="item.code"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="topic名称" prop="topicName">
        <Select v-model="formValidate.topicName" transfer filterable>
          <Option
            v-for="(item, index) in topicArr"
            :key="index"
            :label="item.name"
            :value="item.name"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="group名称" prop="groupPrefixName">
        <Input
          v-model="formValidate.groupPrefixName"
          placeholder="请输入group前缀"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem label="用户名" prop="userName">
        <Input
          v-model="formValidate.userName"
          placeholder="请输入用户名"
          minlength="5"
          maxlength="20"
          show-word-limit
        ></Input>
      </FormItem>

      <FormItem style="text-align: right; padding-top: 10px">
        <Button type="default" @click="cancel" style="margin-right: 5px"
          >取消</Button
        >
        <Button type="primary" @click="ok" style="margin-right: 5px"
          >确定</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ajaxAddHistoryMeta, ajaxGetClusterMeta, ajaxGetTopic } from '@/api/datametaCluster.js'
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
      scriptTypeArr: [
        { label: '创建topic', value: '1' },
        { label: '授权', value: '2' },
        { label: '更改配置', value: '3' }
      ],
      colonyArr: [],
      typeArr: [],
      topicArr: [],
      formValidate: {
        operationType: '2',
        name: '',
        cluster: '',
        topicName: '',
        groupPrefixName: '',
        userName: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
          // {
          //   validator: checkLink,
          //   trigger: ['change', 'blur']
          // }
        ],
        typeId: [
          {
            required: true,
            message: '账号类型不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleChangeCluster(val) {
      this.getTopicArr(val)
    },
    getTopicArr(val) {
      let postData = {
        pageNum: 1,
        pageSize: 1000,
        cluster: this.formValidate.cluster
      }
      ajaxGetTopic(postData).then(res => {
        if (res.data.status == '1') {
          this.topicArr = res.data.data.list
        }
      })
    },
    getColonyArr() {
      let postData = { pageNum: 1, pageSize: 1000 }
      ajaxGetClusterMeta(postData).then(res => {
        if (res.data.status == 1) {
          this.colonyArr = res.data.data.list
        }
      })
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxAddHistoryMeta(postData).then(res => {
            if (res.data.status == '1') {
              this.$Message.success('添加成功')
              this.handleReset('formValidate')
              this.$emit('handleSuccess', 'modalColony1')
            } else {
              this.$Message.error(res.data.message || '添加失败')
            }
          })
        }
      })
    },
    cancel() {
      this.handleReset('formValidate')
      this.$emit('handleCancel', 'modalColony1')
    },
    handleAddAnnotions() {
      this.formValidate.annotions.unshift({ name: '' })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
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
        operationType: '',
        name: '',
        cluster: '',
        topicName: '',
        groupPrefixName: '',
        userName: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created() { },
  mounted() {
    this.getColonyArr()
  }
}
</script>
