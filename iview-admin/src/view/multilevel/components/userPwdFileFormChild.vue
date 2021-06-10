<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :label-width="80">
      <FormItem label="环境名称">
        <span>{{ item.name }}</span>
      </FormItem>

      <FormItem label="principal" prop="password">
        <Input v-model="formValidate.password" placeholder="请输入密码" :disabled="editControl===true" />
      </FormItem>
      <FormItem label="文件上传">
        <Upload
          ref="upload"
          v-model="formValidate.uploadList"
          multiple
          :before-upload="handleUpload"
          type="drag"
          :action="'/batch/account/file/'+accountId+'/evn/'+item.id"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或拖拽上传</p>
          </div>
        </Upload>
      </FormItem>
    </Form>
  </div>
</template>
<script>

import { userFunc } from '@/api/user1.js'
export default {
  name: 'pwdForm',
  props: [
    'editUserPwdControls',
    'envList',
    'accountId',
    'item'
  ],
  data() {
    return {
      // userPwd
      formValidate: {
        uploadList: [],
        password: ''
      },
      editUserPwdDataObj: {},
      editControl: false,
      // file
      newForm: new FormData()
    }
  },

  methods: {
    /**
     * 上一步
     */
    prevFunc() {
      for (const i in this.envList) {
        const mainImg = this.$refs['upload' + this.envList[i].id] // 如果已经有文件  侧删除列表中的文件
        if (mainImg && mainImg.length) {
          mainImg.forEach(item => {
            // item.uploadFiles.length = 0;
            item.clearFiles()
          })
        }
      }
      this.$emit('twoPrev')
    },
    /**
     * 确定
     */
    userPwdNextFunc() {

      this.envList.forEach((item) => {
        this.formValidate.push({ envId: item.id, userName: item.userName, password: item.password })
      })
      const pwdFormObj = {
        accountId: this.accountId,
        accountInfoQOs: this.formValidate
      }
      userFunc.onePwdUserCommitApi(this.envList[0].clusterId, pwdFormObj).then((response) => {
        if (response.data.status === 'ok') {
          this.$Message.success(response.data.message)
          this.formValidate = []
          this.envList = []
          this.editControl = true
          this.newForm = new FormData()
          for (const i in this.envList) {
            const mainImg = this.$refs['upload' + this.envList[i].id] // 如果已经有文件  侧删除列表中的文件
            if (mainImg && mainImg.length) {
              mainImg.forEach(item => {
                // item.uploadFiles.length = 0;
                item.clearFiles()
              })
            }
          }
          this.$emit('twoNext')
        } else {
          cosnole.log('commit fail')
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    // 取消编辑弹窗
    editCancel(name) {
      this.$emit('oneUserPwdEditCancelFunc')
    },
    // 单条编辑
    editUserPwdOk(name) {
      this.editUserPwdDataObj.accountId = this.accountId
      this.editUserPwdDataObj.evnid = this.envList[0].id
      this.editUserPwdDataObj.userName = this.envList[0].userName
      this.editUserPwdDataObj.password = this.envList[0].password
      userFunc.editEvnUserPwdApi(this.editUserPwdDataObj).then(response => {
        if (response.data.status === 'ok') {
          this.$refs[name].resetFields()
          this.$emit('oneUserPwdFinishFunc')
        } else {
          this.$Message.error(response.data.message)
        }
      })
    },
    handleUpload(file) {
      this.formValidate.uploadList.push(file)
    },
    initFormData(formData) {

      for (let k in this.formValidate) {
        this.formValidate[k] = formData[k]
      }
      this.$forceUpdate()
      // this.$nextTick(() => {

      // })
    }
  },
  created() {
    this.$bus.on('setFormData', this.initFormData)
  },
  mounted() {
  }
}
</script>
<style>
.envList {
  border-bottom: 1px solid #dcdee2;
}
.envList:last-child {
  border-bottom: none;
}
</style>
