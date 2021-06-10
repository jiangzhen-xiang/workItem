<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
      size="small"
    >
      <FormItem label="名称" prop="pipeline">
        <Input v-model="formValidate.pipeline" placeholder="请输入" size="small"></Input>
      </FormItem>
      <FormItem label="类别" prop="type">
        <RadioGroup v-model="formValidate.type" size="small">
          <Radio label="消息队列">消息队列</Radio>
          <Radio label="数据库">数据库</Radio>
          <Radio label="已有数据集">已有数据集</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="连接类型" prop="query" v-show="formValidate.type == '消息队列'">
        <Select v-model="formValidate.query" placeholder="请选择" size="small">
          <Option
            v-for="(item, index) in queryArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="连接类型" prop="db" v-show="formValidate.type == '数据库'" size="small">
        <Select v-model="formValidate.db" placeholder="请选择">
          <Option
            v-for="(item, index) in dbArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="连接类型" prop="historyPipeline" v-show="formValidate.type == '已有数据集'">
        <Select v-model="formValidate.historyPipeline" placeholder="请选择">
          <Option
            v-for="(item, index) in historyPipelineArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px;">
        <Button size="small" type="default" @click="cancel" style="margin-right: 5px;">取消</Button>
        <Button size="small" type="primary" @click="ok" style="margin-right: 5px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'hiveForm',
  data() {
    return {
      queryArr: [
        {
          label: 'kafka',
          value: 'kafka'
        },
        {
          label: 'restmq',
          value: 'restmq'
        }
      ],
      dbArr: [
        {
          label: 'hbase',
          value: 'hbase'
        },
        {
          label: 'hive',
          value: 'hive'
        }
      ],
      historyPipelineArr: [],
      formValidate: {
        pipeline: '',
        type: '消息队列',
        query: '',
        db: '',
        historyPipeline: ''
      },
      ruleValidate: {}
    }
  },
  methods: {
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    cancel() {
      this.handleReset('formValidate')
      this.$emit('handleCancel')
    },
    ok() {
      let formData = this.getFormData()
      this.$emit('handleOk', formData)
      this.cancel()
    },
    getFormData() {
      let postData = { pipeline: '' }
      postData.pipeline = this.formValidate.pipeline
      if (this.formValidate.type == '已有数据集') {
        postData.linkType = '已有数据集'
        postData.type = this.formValidate.historyPipeline
      } else if (this.formValidate.type == '消息队列') {
        postData.linkType = '消息队列'
        postData.type = this.formValidate.query
      } else {
        postData.linkType = '数据库'
        postData.type = this.formValidate.db
      }
      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
