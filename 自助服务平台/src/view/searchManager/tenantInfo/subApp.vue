<template>
  <div class="subWin">
      <Row>
        <Upload action="" type="drag" :before-upload="handleBeforeUpload" v-model="uploadFrom.uploadFile" accept=".xls, .xlsx" > 
          <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
        </Upload>
      </Row>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="ios-stats"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"></Icon>
              <span>成功</span>
            </div>
          </Progress>
        </transition>
      </Row>
      <div class="actionBtn clearfix">
        <Button type="primary" @click="cancle" class="cancelBtn">取消</Button>
        <Button type="primary" @click="ok" class="okBtn">确定</Button>
      </div>
  </div>
</template>

<script>
import excel from '@/libs/excel'
import axiosTenant from '@/api/tenantInfo.js'
export default {
  data: function() {
    return {
        uploadLoading:false,
        textarea:"",
        progressPercent: 0,
        showRemoveFile: false,
        showProgress: false,
        file: null,
        uploadFrom: {
          memo: '',
          uploadFile: '',
          id: ''
        },
    }
  },
  methods: {
    cancle(){
      this.$emit('handleCancle','modal1')
    },
    // 上传申请单点击确定let formData = new FormData();
    async ok(){
      console.log(this.file);
      if(this.file!=null){
        let formData=new FormData();
        formData.append("file",this.file);
        // formData.append("applyFileName",this.file.name);
        let res=await axiosTenant.loadExcelToDatabases(formData); //此处传入上传的文件数据
        if(res.data.code==1){
          await this.$emit('handleUpload')
          this.$Message.success(res.data.message);
        }else{
          this.$Message.error(res.data.message);
        }
        // // // 此处要传入表格数据信息到父组件       
        await this.$emit('handleOk','modal1')
      }
    },
    initUpload () {
      this.file = null
      this.showProgress = false
      this.progressPercent = 0
    },
    handleUploadFile () {
      this.initUpload()
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    // 选择文件点击确定后执行
    handleBeforeUpload (file) {
      console.log(file,"aaa");
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功') //获取上传文件的数据
        const data = e.target.result
        console.log(data,111111);
        
        const { header, results } = excel.read(data, 'array')

        console.log(excel.read(data, 'array'));
        
        this.uploadLoading = false
        this.showRemoveFile = true
      }
    }
  },
  created(){}
}
</script>

<style lang='less' scoped>
 @import "./common.less";
 .subWin{
   overflow: hidden;
 }
 .actionBtn{
   float:right;
   padding-top:10px;
 }
</style>
