<template>
  <div>
    <!-- <div style="display:none;">{{ getCurEnvId }}{{ getLength }}</div> -->

    <!-- <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="110"
    >
      <FormItem label="账号" prop="user">
        <div style="display:flex">
          <div class="flexItem" style="width:90%;">
            <Select
              v-model="formValidate.user"
              placeholder="请选择"
              size="small"
            >
              <Option
                v-for="(item, index) in userArr"
                :key="index"
                :value="item.id"
                :label="item.name"
                >{{ item.name }}({{ item.clusterName }})</Option
              >
            </Select>
          </div>
          <div class="flexItem" style="margin-left:10px;flex-grow:1;">
            <Button type="primary" size="small" @click="handleFireTestConn"
              >测试连接</Button
            >
          </div>
        </div>
      </FormItem>
      <FormItem label="名称" prop="files">
        <div class="wrapper">
          <list>
            <ListItem v-for="(item, index) in this.formValidate.files">
              <div style="width:100%">
                <div class="ivu-list-item">
                  <div class="ivu-list-item-meta">
                    <div class="ivu-list-item-meta-avatar">
                      <span
                        class="ivu-avatar ivu-avatar-circle ivu-avatar-image ivu-avatar-default"
                      >
                        <img :src="fileStr" />
                      </span>
                    </div>
                    <div class="ivu-list-item-meta-content">
                      <div class="ivu-list-item-meta-title">
                        {{ item.name || item.fileName }}
                      </div>
                    </div>
                  </div>
                  <ul class="ivu-list-item-action">
                    <li><a @click="setFilePrev(item, index)">预览</a></li>
                  </ul>
                </div>
              </div>
            </ListItem>
          </list>
        </div>
      </FormItem>
    </Form>-->
    <fileConnPrev
      ref="fileConnPrev"
      :clusterId="clusterId"
      :index="index"
      :stepOneData="stepOneData"
      :formValidate="formValidate"
    />
  </div>
</template>
<script>
import fileConnPrev from './common/fileConnPrev'

import {
  ajaxGetAccount,
  ajaxFilePrev,
  ajaxSetConnToEnvTestConn
} from '@/api/link.js'
let fileStr = require('@/assets/images/file.png')
export default {
  name: 'flinkPrev',
  props: ['formValidate', 'clusterId', 'index', 'stepOneData'],
  data() {
    return {
      fileStr: fileStr,
      formValidate: {
        user: '',
        files: []
      },
      ruleValidate: {},
      userArr: [
        {
          label: 'kafkauser1',
          value: 'kafkauser1'
        },
        {
          label: 'kafkauser2',
          value: 'kafkauser2'
        }
      ],

      runtimeArr: [
        {
          label: 'AutoResolveIntegrationRuntime',
          value: 'AutoResolveIntegrationRuntime'
        }
      ],
      authTypeArr: [
        {
          label: 'SASL_PLAINTEXT',
          value: 'SASL_PLAINTEXT'
        }
      ],
      saslArr: [
        {
          label: 'PLAIN',
          value: 'PLAIN'
        }
      ]
    }
  },
  components: {
    fileConnPrev
  },
  computed: {
    // getCurEnvId() {
    //   ;
    //   let postData = {};
    //   postData.pageSize = 1000;
    //   postData.pageNum = 1;
    //   postData.clusterId = this.clusterId;
    //   postData.categoryAccountName = this.stepOneData.connType;
    //   ajaxGetAccount(postData).then(res => {
    //     if (res.data.status == "ok") {
    //       this.userArr = [].concat(res.data.data.list);
    //     }
    //   });
    //   return this.formValidate.environment;
    // },
    // getLength() {
    //   ;
    //   return this.formValidate.files.length;
    //   return this.formValidate.files;
    // }
  },
  methods: {
    handleFireTestConn() {
      let postDataEnv = {}
      let that = this
      postDataEnv.clusterId = +this.stepOneData.clusterId
      postDataEnv.envId = this.formValidate.environment
      postDataEnv.connId = this.stepOneData.connId
      postDataEnv.accountId = this.formValidate.user

      let arr = this.userArr.filter(user => {
        return user.id == this.formValidate.user
      })
      if (arr.length) {
        postDataEnv.categoryAccountType = arr[0].categoryAccountType
      }
      if (arr.length == 0) {
        this.$Message.warning('请先选择账号')
        return
      }

      ajaxSetConnToEnvTestConn(postDataEnv).then(res => {
        if (res.data.status == 'ok') {
          that.$Message.success('测试连接成功')
        }
      })
    },
    handleOpen(item, index) {
      item.isOpen = true
      this.$set(this.formValidate.files, index, item)
      this.$forceUpdate()
    },
    handleClose(item, index) {
      item.isOpen = false
      this.$set(this.formValidate.files, index, item)
      this.$forceUpdate()
    },
    setFilePrev(item, index) {
      let that = this
      if (!item.fileId) {

        let fr = new FileReader()
        fr.onloadend = function () {
          var result = this.result

          item.code = result
          // item.isOpen = true;
          // item.isShowPrev = true;
          // that.$set(that.formValidate.files, index, item);
          // that.$forceUpdate();
          that.$bus.emit('showModal12', {
            text: 'showModal12',
            code: result,
            fileName: item.name
          })
        }
        fr.readAsText(item)
      } else {
        let postData = {}
        postData.clusterId = this.clusterId
        postData.connId = item.connId
        postData.envId = item.environment
        postData.fileId = item.fileId

        ajaxFilePrev(postData)
          .then(res => {
            if (res.data.status == 'ok') {
              var result = res.data.data
              item.code = result
              item.isOpen = true
              item.isShowPrev = true
              that.$set(that.formValidate.files, index, item)
              that.$forceUpdate()
            }
          })
          .catch(err => {
            this.$Message.error(err.message || '与服务器通信失败,请联系管理员')
          })
      }
    },
    handleUpload(files) {
      this.formValidate.files.push(files)
      this.$forceUpdate()
      // this.formValidate.files.push(files);
    },
    ok() {
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData()
          this.$emit('handleOk', postData)
        } else {
          this.$emit('handleCancel', 'error')
        }
      })
    },
    cancel() {
      // this.handleReset('formValidate')
      this.$emit('handleCancel', 'success')
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
      let postData = {
        user: '',
        files: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }

      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
