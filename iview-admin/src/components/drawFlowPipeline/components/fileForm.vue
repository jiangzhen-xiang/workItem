<template>
  <div>
    <Form ref="fileformValidate" :model="fileformValidate" :label-width="80">
      <FormItem label="选择文件">
        <div v-for="item in envList" :key="item.id" style="position:relative;">
          <span>{{ item.name }}</span>
          <!-- <Button
            type="primary"
            @click="fileuploadFunc(item.id)"
            style="position:absolute; right:0px; top:0px; margin-bottom:10px;"
          >保存</Button>-->
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
        </div>
      </FormItem>
      <FormItem style="padding-top:10px;">
        <Button type="success" @click="prevFunc" style="float:left;">上一步</Button>
        <Button type="primary" @click="nextFunc" style="float:right">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { userFunc } from '@/api/user1.js'
export default {
  name: 'fileForm',
  props: [
    'envList',
    'accountId'
  ],
  data() {
    return {
      newForm: new FormData(),
      fileformValidate: {
        uploadList: []
      }
    }
  },
  methods: {
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
    nextFunc() {
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
    },
    handleUpload(file) {
      this.fileformValidate.uploadList = file
      this.newForm.append('file', file, file.name)
      // return false
    },
    fileuploadFunc(id) {
      userFunc.oneFileCommitApi(id, this.accountId, this.newForm).then((response) => {
        if (response.data.status === 'ok') {
          this.$Message.success(response.data.message)
          this.newForm = new FormData()
          const mainImg = this.$refs['upload' + id] // 如果已经有文件  侧删除列表中的文件
          if (mainImg && mainImg.length) {
            mainImg.forEach(item => {
              // item.uploadFiles.length = 0;
              item.clearFiles()
            })
          }
        } else {
          this.$Message.error(response.data.message)
        }
      })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  created() { },
  mounted() {
  }
}
</script>
