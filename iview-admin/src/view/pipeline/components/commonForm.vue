<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="link">
        <Input v-model="formValidate.link" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input
          v-model="formValidate.desc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
        <div class="btnWrapper" style="text-align:right;padding:5px 0;">
          <label class="ivu-form-item-label" style="width: 80px;">标签增加</label>
          <Button type="default" @click="handleAddAnnotions">增加</Button>
        </div>
        <div class="itemWrapper">
          <FormItem
            v-for="(item, index) in formValidate.annotions"
            :key="index"
            label="标签"
            :prop="item.name"
          >
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.name" placeholder="请输入"></Input>
              </Col>
              <Col span="4" offset="1" style="text-align:right;float:right;">
                <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
        </div>
      </div>
      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="info" @click="handleTestConnServe" style="margin-right:5px;">测试连接</Button>

        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'hbaseForm',
  data () {
    return {
      runtimeArr: [{
        label: 'AutoResolveIntegrationRuntime',
        value: 'AutoResolveIntegrationRuntime'
      }],
      authTypeArr: [{
        label: 'Anonymous',
        value: 'Anonymous'
      }],
      formValidate: {
        link: '',
        authType: '',
        runtime: '',
        url: '',
        desc: '',
        secure: '',
        port: '',
        host: '',
        annotions: [
          {
            name: ''
          }
        ]
      },
      ruleValidate: {
        link: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ok () {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      let str = localStorage.getItem('linkArr')
      let arr = []
      if (str) {
        arr = JSON.parse(str)
        arr.push(postData)
        // 写在缓存里
        localStorage.setItem('linkArr', JSON.stringify(arr))
      } else {
        arr.push(postData)
        localStorage.setItem('linkArr', JSON.stringify(arr))
      }
      this.handleReset('formValidate')
      this.$emit('handleSuccess', postData)
    },
    cancel () {
      this.handleReset('formValidate')
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
        link: '',
        authType: '',
        runtime: '',
        url: '',
        desc: '',
        secure: '',
        port: '',
        host: '',
        annotions: []
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.type = 'hbase'
      return postData
    }
  },
  created () { },
  mounted () { }
}
</script>
