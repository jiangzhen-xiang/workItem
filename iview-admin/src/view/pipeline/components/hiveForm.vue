<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="认证方式" prop="authType">
        <Select v-model="formValidate.authType" placeholder="请选择">
          <Option
            v-for="(item,index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="用户名" prop="username">
        <Input v-model="formValidate.username" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="口令类型" prop="witch">
        <i-switch v-model="formValidate.witch" size="large">
          <span slot="open">密码</span>
          <span slot="close">口令</span>
        </i-switch>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input v-model="formValidate.password" type="password"></Input>
      </FormItem>
      <FormItem label="名称" prop="linkName">
        <Input v-model="formValidate.linkName" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="服务模式" prop="mode">
        <RadioGroup v-model="formValidate.mode">
          <Radio label="Enable">Enable</Radio>
          <Radio label="Disable">Disable</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="ZOO Keeper命名空间" prop="namespace">
        <Input v-model="formValidate.namespace" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="使用本地队列" prop="query">
        <RadioGroup v-model="formValidate.query">
          <Radio label="Enable">Enable</Radio>
          <Radio label="Disable">Disable</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="HTTP路径" prop="url">
        <Input v-model="formValidate.url" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="Secure Transmission" prop="secure">
        <RadioGroup v-model="formValidate.secure">
          <Radio label="Enable SSL">Enable SSL</Radio>
          <Radio label="Disable SSL<">Disable SSL</Radio>
        </RadioGroup>
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
  name: 'hiveForm',
  data() {
    return {
      authTypeArr: [{
        label: '用户名和密码',
        value: '用户名和密码'
      }],
      formValidate: {
        linkName: '',
        authType: '',
        witch: '',
        url: '',
        mode: '',
        nameSpace: '',
        desc: '',
        username: '',
        password: '',
        annotions: [
          {
            name: ''
          }
        ]
      },
      ruleValidate: {
        linkName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }

        ],
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }

        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }

        ]
      }
    }
  },
  methods: {
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
        linkName: '',
        authType: '',
        witch: '',
        url: '',
        mode: '',
        nameSpace: '',
        desc: '',
        username: '',
        password: '',
        annotions: []
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.type = 'hive'
      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
