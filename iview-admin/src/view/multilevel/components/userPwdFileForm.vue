<template>
  <div>
    <Tabs :animated="false">
      <Form ref="pwdformValidate" :model="pwdformValidate" :label-width="80">
        <div v-for="item in envList" :key="item.id" class="envList">
          <userPwdFileFormChild
            :ref="'userPwdFileFormChild_'+item.id"
            :item="item"
            :accountId="accountId"
            :editUserPwdControls="editUserPwdControls"
          />
          <!-- <FormItem label="环境名称">
            <span>{{ item.name }}</span>
          </FormItem>
          <FormItem label="principal">
            <Input v-model="item.password" placeholder="请输入密码" :disabled="editControl===true" />
          </FormItem>
          <FormItem label="文件上传">
            <Upload
              :ref="'upload'+ item.id"
              v-model="fileformValidate.uploadList"
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
          </FormItem>-->
        </div>
        <FormItem style="padding-top:10px;">
          <Button
            v-if="editUserPwdControls===false"
            type="success"
            @click="prevFunc"
            style="float:left;"
          >上一步</Button>
          <Button
            v-if="editUserPwdControls===false && editControl===false"
            type="primary"
            @click="userPwdNextFunc"
            style="float:right"
          >确定</Button>
          <Button
            v-if="editUserPwdControls===true"
            @click="editCancel('pwdformValidate')"
            style="float:left;"
          >取消</Button>
          <Button
            v-if="editUserPwdControls===true"
            type="primary"
            @click="editUserPwdOk('pwdformValidate')"
            style="float:right"
          >保存</Button>
        </FormItem>
      </Form>
    </Tabs>
  </div>
</template>
<script>

import { userFunc } from '@/api/user1.js'
import userPwdFileFormChild from './userPwdFileFormChild.vue'
export default {
  name: 'pwdForm',
  props: [
    'editUserPwdControls',
    'envList',
    'accountId'
  ],
  data() {
    return {
      // userPwd
      pwdformValidate: [],
      editUserPwdDataObj: {},
      editControl: false,
      // file
      newForm: new FormData(),
      fileformValidate: {
        uploadList: []
      }
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
      let postDataArr = []
      let that = this
      this.envList.map(item => {
        let obj = {}
        for (let k in that.$refs['userPwdFileFormChild_' + item.id][0].formValidate) {
          obj[k] = that.$refs['userPwdFileFormChild_' + item.id][0].formValidate[k]
        }
        obj.accountId = this.accountId
        obj.evnId = item.id
        postDataArr.push(obj)
      })
      postDataArr.map(postData => {
        userFunc.addPwdAndFileApi(postData).then((res) => {
          if (res.data.status === 'ok') {
            this.$Message.success(res.data.message)
            //
            // todo fock
            this.pwdformValidate = []
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
      })
      // this.envList.forEach((item) => {
      //   this.pwdformValidate.push({ envId: item.id, userName: item.userName, password: item.password })
      // })
      // const pwdFormObj = {
      //   accountId: this.accountId,
      //   accountInfoQOs: this.pwdformValidate
      // }
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
      // userFunc.editEvnUserPwdApi(this.editUserPwdDataObj).then(response => {
      //   if (response.data.status === 'ok') {
      //     this.$refs[name].resetFields()
      //     this.$emit('oneUserPwdFinishFunc')
      //   } else {
      //     this.$Message.error(response.data.message)
      //   }
      // })

      // userFunc.addPwdAndFileApi(this.editUserPwdDataObj).then(response => {
      //   if (response.data.status === 'ok') {
      //     this.$refs[name].resetFields()
      //     this.$emit('oneUserPwdFinishFunc')
      //   } else {
      //     this.$Message.error(response.data.message)
      //   }
      // })

      let postDataArr = []
      let that = this
      this.envList.map(item => {
        let obj = {}
        for (let k in that.$refs['userPwdFileFormChild_' + item.id][0].formValidate) {
          obj[k] = that.$refs['userPwdFileFormChild_' + item.id][0].formValidate[k]
        }
        obj.accountId = this.accountId
        obj.evnId = item.id
        postDataArr.push(obj)
      })
      postDataArr.map(postData => {
        userFunc.addPwdAndFileApi(postData).then((res) => {
          if (res.data.status === 'ok') {
            this.$Message.success(res.data.message)
            //
            return
            this.pwdformValidate = []
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
      })
    },
    handleUpload(file) {
      this.fileformValidate.uploadList = file
      this.newForm.append('file', file, file.name)
    }
  },
  components: {
    userPwdFileFormChild
  },
  created() { },
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
