<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="集群名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="集群类型" prop="typeId">
        <Select v-model="formValidate.typeId" placeholder="请选择" disabled>
          <Option
            v-for="(item, index) in typeArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.showName"
          >{{ item.showName }}-{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="描述" prop="description">
        <Input
          v-model="formValidate.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入"
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
import { ajaxEditorCluster, ajaxGetClusterType, ajaxGetCluster } from '@/api/link.js'
export default {
  name: 'colonyForm',
  props: ['row'],
  data () {
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
                  if (res.data.data.list.length && (res.data.data.list[0].id !== this.formValidate.id)) {
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
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      enviromentArr: [],
      formValidate: {
        id: '',
        typeId: this.row.typeId,
        name: this.row.name,
        description: this.row.description

      },
      formEditorValidate: {
        id: '',
        name: this.row.name,
        typeId: this.row.typeId,
        description: this.row.description
      },
      ruleValidate: {
        name: [
          {
            validator: checkLink,
            trigger: ['change', 'blur']
          }

        ]
      }
    }
  },
  methods: {
    getClusterTypeArr () {
      ajaxGetClusterType().then(res => {
        if (res.data.status == 'ok') {
          this.typeArr = res.data.data
        }
      })
    },
    ok () {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxEditorCluster(postData).then(res => {
            if (res.data.status == 'ok') {
              this.$Message.success('编辑成功')
              this.handleReset('formValidate')
              this.$emit('handleSuccess', postData)
            } else {
              this.$Message.error(res.data.message || '编辑成功')
            }
          })
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
    cancel () {
      this.handleReset('formValidate')
      for (let k in this.formEditorValidate) {
        this.formValidate[k] = this.formEditorValidate[k]
      }
      this.$emit('handleCancel', 'modalEditorColony')
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
        id: '',
        name: '',
        typeId: '',
        description: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    }
  },
  created () { },
  mounted () {
    this.getClusterTypeArr()
  }
}
</script>
