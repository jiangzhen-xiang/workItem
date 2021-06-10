<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="120"
    >
      <FormItem label="系统对接名称" prop="connectedSystemName">
        <Input
          v-model="formValidate.connectedSystemName"
          placeholder="系统对接名称建议英文字母"
        ></Input>
      </FormItem>
      <FormItem label="系统对接简称" prop="connectedSystemCode">
        <Input
          v-model="formValidate.connectedSystemCode"
          placeholder="系统对接简称建议英文字母"
        ></Input>
      </FormItem>
      <FormItem label="需求名称(首个)" prop="firstDemandName">
        <Input
          v-model="formValidate.firstDemandName"
          placeholder="需求名称(首个)建议英文字母"
        ></Input>
      </FormItem>
      <FormItem label="上线时间" prop="firstPublishDate">
        <DatePicker
          type="datetime"
          placeholder="请选择"
          v-model="formValidate.firstPublishDate"
          style="width: 100%"
        ></DatePicker>
      </FormItem>
      <FormItem label="增量数据量" prop="incrementData">
        <Input
          v-model="formValidate.incrementData"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="kafka分区数" prop="kafkaPartitionCount">
        <Input
          v-model="formValidate.kafkaPartitionCount"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="是否加载存量" prop="loadingStockRemark">
        <Select v-model="formValidate.loadingStockRemark" transfer>
          <Option
            v-for="(item, index) in scriptTypeArr"
            :key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="主题名称" prop="kafkaTopicName">
        <Input
          v-model="formValidate.kafkaTopicName"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="OGG版本" prop="oracleOggVersion">
        <Input
          v-model="formValidate.oracleOggVersion"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="源端ORACLE字符集" prop="originalOracleCharset">
        <Input
          v-model="formValidate.originalOracleCharset"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="源端SCHEMA" prop="originalSchema">
        <Input v-model="formValidate.originalSchema"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formValidate.remark" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="replicate进程名" prop="replicateName">
        <Input
          v-model="formValidate.replicateName"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="存量数据量" prop="stockData">
        <Input v-model="formValidate.stockData" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="涉及系统简称" prop="systemInvolved">
        <Input
          v-model="formValidate.systemInvolved"
          placeholder="请输入"
        ></Input>
      </FormItem>
      <FormItem label="表英文名" prop="tableCode">
        <Input v-model="formValidate.tableCode" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="表中文名" prop="tableName">
        <Input v-model="formValidate.tableName" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="trail文件首字母" prop="tailFileFirstName">
        <Input
          v-model="formValidate.tailFileFirstName"
          placeholder="请输入"
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
import { ajaxAddOrderMeta } from '@/api/datametaCluster.js'
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
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      colonyArr: [],
      typeArr: [],
      formValidate: {
        connectedSystemName: '',
        connectedSystemCode: '',
        firstDemandName: '',
        firstPublishDate: '',
        incrementData: '',
        kafkaPartitionCount: '',
        loadingStockRemark: '',
        kafkaTopicName: '',
        oracleOggVersion: '',
        originalOracleCharset: '',
        originalSchema: '',
        remark: '',
        replicateName: '',
        stockData: '',
        systemInvolved: '',
        tableCode: '',
        tableName: '',
        tailFileFirstName: ''
      },
      ruleValidate: {
        name: [
          // {
          //   required: true,
          //   message: '名称不能为空',
          //   trigger: 'blur'
          // }
          // {
          //   validator: checkLink,
          //   trigger: ['change', 'blur']
          // }
        ]

      }
    }
  },
  methods: {

    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          ajaxAddOrderMeta(postData).then(res => {
            if (res.data.status == '1') {
              this.$Message.success('添加成功')
              this.handleReset('formValidate')
              this.$emit('handleSuccess', postData)
            } else {
              this.$Message.error(res.data.message || '添加失败')
            }
          })
        }
      })
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
        connectedSystemName: '',
        connectedSystemCode: '',
        firstDemandName: '',
        firstPublishDate: '',
        incrementData: '',
        kafkaPartitionCount: '',
        loadingStockRemark: '',
        kafkaTopicName: '',
        oracleOggVersion: '',
        originalOracleCharset: '',
        originalSchema: '',
        remark: '',
        replicateName: '',
        stockData: '',
        systemInvolved: '',
        tableCode: '',
        tableName: '',
        tailFileFirstName: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created() { },
  mounted() {

  }
}
</script>
