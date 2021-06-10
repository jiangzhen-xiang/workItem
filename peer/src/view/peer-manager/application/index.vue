<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <div style="float:left">
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="申请单名称" v-model="searchObj.applyFileName" />
            </FormItem>
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="租户"  v-model="searchObj.tenantUser" />
            </FormItem>
            <FormItem>
              <DatePicker type="date" placement="bottom-end" placeholder="投产时间" style="width: 110px" v-model="searchObj.prodBeginDate"></DatePicker> -
              <DatePicker type="date" placement="bottom-end" placeholder="投产时间" style="width: 110px" v-model="searchObj.prodEndDate"></DatePicker>
            </FormItem>
            <FormItem>
              <Select placeholder="状态" style="width:120px;" v-model="searchObj.stat">
                <Option  key="a" value="a">全选</Option>
                <Option v-for="(item,index) in stat" :key="index" :value="item.key">{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchApp">查询</Button>
            </FormItem>
          </div>
          <div style="float:right">
            <FormItem>
                <Button type="primary" class="btn2" icon="ios-cloud-upload-outline" @click="submitApplication">提交申请单</Button>
                <!-- <Button type="primary" class="btn1" icon="md-download" :loading="exportLoading"><a href="http://localhost:38001/bdap-metadata-syn/apply/downloadApply?token="+ getToken()  >申请单模板下载</a></Button> -->
                <Button type="primary" class="btn1" icon="md-download" :loading="exportLoading" @click="applicationDownload" >申请单模板下载</Button>
            </FormItem>
          </div>
        </Form>
      </i-col>
    </Row>
    <div class="listShow">
      <!-- 
          stripe=>显示斑马纹
          data=>表数据
          columns=>显示表头信息
          height=>表格高度 如果大于此值固定表头
          loading=>表格是否加载中
      -->
       <Table
        stripe
        border
        class="listContent"
        :loading="loading"
        ref="tableName"
        :data="tableData"
        :max-height="tableHeight"
        :columns="tableTitle"
      >
        <template slot-scope="{ index }" slot="watch">
          <Button type="primary" size="small"  @click="watchDetail(index)">查看详情</Button>
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="updata(index)">更新</Button>
          <Button type="error" size="small" @click="remove(index)" style="margin-right: 5px">删除</Button>
        </template>
      </Table>
      <Page
        show-total
        class="listPage"
        style="text-align:right;margin-top:10px;"
        :total="totalNum"
        :page-size="pageSize"
        :current="currentPage"
        show-elevator
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="onPageSize"
      />
    </div>
    <Modal v-model="modal1" title="上传申请单" footer-hide>
      <subApp
        ref="subExcel"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleUpload="reflesh"
      ></subApp>
    </Modal>
    <Modal v-model="modal2" title="更新" footer-hide>
      <update
        ref="updateEdit"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleUpdate="reflesh"
      ></update>
    </Modal>
  </div>
</template>
<script>
// import { getToken } from "@/libs/util.js18810096102"
import subApp from './subApp'
import watchEdit from './watchEdit'
import  update from './update'
import applyAxios from '@/api/application.js'
// import { dragTable } from '@/utils/dragTable.js'
// import axios from 'axios'
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title:'序号',
          // type: 'index',
          width: 80,
          align: 'center',
          fixed: 'left',
          resizable:true,
          render: (h, params) => {
            return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
          }
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "申请单名称",
          key: "applyFileName",
          align: "center",
          width: 120,
          tooltip:true,
          resizable:true
        },
        {
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "投产时间",
          key: "prodDate",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
            ]);
          },
          resizable:true
        },
        {
          title: "联系人",
          key: "contacts",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "联系方式",
          key: "contactWay",
          align: "center",
          width: 100,
          resizable:true
        },
        {
          title: "状态",
          key: "stat",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', this.stat[params.row.stat].value)
            ]);
          },
          resizable:true
        },
        {
          title: "结果信息",
          key: "synMsg",
          align: "center",
          width: 100,
          resizable:true,
          tooltip:true,
        },
        {
          title: "申请人",
          key: "reqUser",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "申请时间",
          key: "reqTime",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
          resizable:true
        },
        {
          title: "同步人",
          key: "synUser",
          align: "center",
          width: 100,
          resizable:true
        },
        {
          title: "同步时间",
          key: "synTime",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.synTime?this.$formatTime(params.row.synTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
          resizable:true
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 80,
          // resizable:true,
          tooltip:true,
        },
        {
          title: "详情",
          slot:"watch",
          fixed: "right",
          align: "center",
          width: 90,
          resizable:true
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 180,
          resizable:true
        }
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      modal1:false,
      modal2:false,
      exportLoading:false, //下载中
      editItem:{},
      watchItem:{},
      searchObj:{},
      stat:[],
      loading:false,
      tableHeight:0,
    }
  },
  components:{
    subApp,watchEdit,update
  },
  methods: {
    // 查询
    async searchApp(){
      console.log("OK");
      this.loading=true;
      let reg=/^\d{4}-\d{2}-\d{2}$/;
      if(this.searchObj.stat=="a"){
        this.searchObj.stat="";
      }
      if(this.searchObj.prodBeginDate&&!reg.test(this.searchObj.prodBeginDate)){
        this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.prodEndDate&&!reg.test(this.searchObj.prodEndDate)){
        this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
      }
      // console.log(this.searchObj);
      // this.searchObj={};
      let req=await applyAxios.applySearch({
        "applyFileName":this.searchObj.applyFileName,          // "资源申请单20200101.xsl",
        "tenantUser": this.searchObj.tenantUser,               //"租户1",
        "prodBeginDate": this.searchObj.prodBeginDate,         //"2020-01-01",
        "prodEndDate": this.searchObj.prodEndDate,             //"2020-01-30",
        "stat": this.searchObj.stat,                           //"0",
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
      })
      console.log(req);
      if(req.data.code==1){
        this.loading=false;
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
        this.$Message.success(req.data.message)
        // this.searchObj={};
      }else{
        this.$Message.error(req.data.message)
      }
     
    },
    // 更新
    async updata(index){
      console.log("点击更新");
      this.$refs.updateEdit.applyId=this.tableData[index].id;
      this.$refs.updateEdit.file=null;
      this.$refs.updateEdit.showProgress = false;
      this.$refs.updateEdit.progressPercent = 0;
      this.$refs.updateEdit.textarea = "";
      this.$refs.updateEdit.isUpload = false;
      this.modal2=true;
      // let id=this.tableData[index].id;
      // let formData=new FormData();
      // formData.append("applyFile",this.tableData[index]).file);
      // formData.append("remark",this.tableData[index]).remark);
      // formData.append("applyId",id);
      // let res=await applyAxios.applyUpdate(formData);
      // if(res.data.code==1){
      //     this.$Message.success(res.data.message);
      // }else{
      //     this.$Message.error(res.data.message);
      // }
      // await this.reflesh();
    },
    // 删除
    remove(index){
      console.log("点击删除"); 
      this.$Modal.confirm({
        title: "消息提示",
        closable: true,
        content: "确定要删除此申请单吗?",
        onOk: async () => {
          //此处调用删除数据接口
          let id=this.tableData[index].id;
          // this.tableData.splice(index, 1);
          let res=await applyAxios.applyDelete({id});
          if(res.data.code==1){
            await this.$Message.success(res.data.message);
            await this.reflesh();
          }else{
            await this.$Message.error(res.data.message);
          }          
        }
      });
    },
    // 换页
    pageChange(val){
      console.log(val);
      this.currentPage=val;
      this.reflesh();
    },
    // 每页条数改变
    onPageSize(val){
      console.log(val);
      this.pageSize=val;
      this.reflesh();
    },
    // 提交申请单
    submitApplication(){
      this.$refs.subExcel.file=null;
      this.$refs.subExcel.showProgress = false;
      this.$refs.subExcel.progressPercent = 0;
      this.$refs.subExcel.textarea = "";
      this.$refs.subExcel.isUpload = false;
      this.modal1=true;
    },
    // 上传点击取消
    AfterCancle(val){
      this[val]=false;
    },
    // 上传点击确定
    AfterOk(val){
      this[val]=false;
    },
    // 申请单模板下载
    async applicationDownload(){
       
      let res=await applyAxios.applyDownload();
      console.log(res);
      //这里res.data是返回的blob对象""
      // var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}); 
      // var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
      //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
      var blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'}); 
      var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeade("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
      var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
      var result = patt.exec(contentDisposition);
      console.log(result,"result");
      var filename = decodeURIComponent(result[1]);
      console.log(filename,'filename');
      var downloadElement = document.createElement('a');
      var href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.style.display = 'none';
      downloadElement.href = href;
      downloadElement.download =filename ; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
      // })
      // if (this.tableData.length) {
      //   this.exportLoading = true;
      //   // 获取文件流
      //   const params = {
      //     title: [],// ['一级分类', '二级分类', '三级分类']
      //     key: [],  // ['category1', 'category2', 'category3'],
      //     data: this.tableData,
      //     autoWidth: true,
      //     filename: '分类列表' //文件名
      //   }
      //   excel.export_array_to_excel(params)
      //   this.exportLoading = false
      // } else {
      //   this.$Message.info('表格数据不能为空！')
      // }
    },

    exportBatch () {
      if (this.selectArr == '') {
        this.$Message.error('请选中数据')
        return
      }
      let str = ''
      this.selectArr.forEach((item, index) => {
        if (index == 0) {
          str += item.id
        } else {
          str += ',' + item.id
        }
      })
      let params = {
        ids: str
      }
      batchExportRelation(params).then(res => {
        let that_ = this
        const r = new FileReader()
        r.onload = function () {
          try {
            const resData = JSON.parse(this.result)
            that_.$Message.error(resData.message)
          } catch (err) {
            // 兼容ie11
             if (window.navigator.msSaveOrOpenBlob) {
               try {
                  const blobObject = new Blob([res.data])
                  let fileName = res.headers["content-disposition"].split('filename=')[1];
                  window.navigator.msSaveOrOpenBlob(blobObject, fileName);
               } catch (e) {
                 console.log(e)
               }
               return
             };
            let link = document.createElement('a');
            let blob = new Blob([res.data], { type: res.data.type });
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            let fileName = res.headers["content-disposition"].split('filename=')
            link.download = fileName[1];
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
        r.readAsText(res.data)
      })
    },
    // 调用接口数据获取数据
    async reflesh(){
      console.log("点击更新查询页面数据")
      this.loading=true;
      let reg=/^\d{4}-\d{2}-\d{2}$/;
      if(this.searchObj.stat=="a"){
        this.searchObj.stat="";
      }
      if(this.searchObj.prodBeginDate!=""&&!reg.test(this.searchObj.prodBeginDate)){
        console.log(this.searchObj.prodBeginDate);
        
        this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.prodEndDate!=""&&!reg.test(this.searchObj.prodEndDate)){
        console.log(this.searchObj.prodEndDate);
        
        this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
      }
      let req=await applyAxios.applySearch({
          "applyFileName":this.searchObj.applyFileName,          // "资源申请单20200101.xsl",
          "tenantUser": this.searchObj.tenantUser,               //"租户1",
          "prodBeginDate": this.searchObj.prodBeginDate,         //"2020-01-01",
          "prodEndDate": this.searchObj.prodEndDate,             //"2020-01-30",
          "stat": this.searchObj.stat,                           //"0",
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
      })
      // console.log(req);
      if(req.data.code==1){
        this.loading=false;
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
        // this.$Message.success(req.data.message)
      }
    },
    // 查看详情
    watchDetail(index){
      this.watchItem=this.tableData[index];
      console.log(this.watchItem);     
      // sessionStorage.setItem("watchItem",JSON.stringify(this.watchItem));
       this.$router.push({
        path:'/appDetail/'+this.watchItem.id,
      });
    },
    async getStat(){
      let req=await applyAxios.getApplyStat();
      console.log(req,"状态列表");
      this.stat=req.data;
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
	  }
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
      // this.reflesh();
    },
    pageSize:function(newval){
      this.onPageSize(newval)
      // this.reflesh();
    }
  },
  mounted(){
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    this.reflesh();
    document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    document.getElementById('pageInput').addEventListener('blur', (res) => {
      // console.log(res.target.value);
    if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
      console.log(Number(res.target.value));
        this.currentPage = Number(res.target.value);
      }else{
        this.currentPage = 1;
      }
    })
  },
  created() {
    // this.reflesh();
    this.getStat();
  },
}
</script>

<style lang='less' scoped>

</style>
