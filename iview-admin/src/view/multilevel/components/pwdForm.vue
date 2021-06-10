<template>
  <div>
    <Form ref="pwdformValidate" :model="pwdformValidate" :label-width="80">
      <div v-for="item in envList" :key="item.id" class="envList">
        <FormItem label="环境名称">
          <span>{{ item.name }}</span>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="item.userName" placeholder="请输入用户名" />
        </FormItem>
        <FormItem label="密  码">
          <Input v-model="item.password" placeholder="请输入密码" />
        </FormItem>
      </div>
      <FormItem style="padding-top:10px;">
        <Button
          v-if="editUserPwdControls===false"
          type="success"
          @click="prevFunc"
          style="float:left;"
        >上一步</Button>
        <Button
          v-if="editUserPwdControls===false"
          type="primary"
          @click="nextFunc"
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
  </div>
</template>
<script>

import { userFunc } from '@/api/user1.js'
export default {
  name: 'pwdForm',
  props: [
    'editUserPwdControls',
    'envList',
    'accountId'
  ],
  data() {
    return {
      pwdformValidate: [],
      editUserPwdDataObj: {}
    }
  },

  methods: {
    prevFunc() {
      this.$emit('twoPrev')
    },
    nextFunc() {
      this.envList.forEach((item) => {
        this.pwdformValidate.push({ envId: item.id, userName: item.userName, password: item.password })
      })
      const pwdFormObj = {
        accountId: this.accountId,
        accountInfoQOs: this.pwdformValidate
      }
      userFunc.onePwdUserCommitApi(this.envList[0].clusterId, pwdFormObj).then((response) => {
        if (response.data.status === 'ok') {
          this.$Message.success(response.data.message)
          this.pwdformValidate = []
          this.envList = []
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
    }
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
