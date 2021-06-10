<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form clearfix">
          <div style="float:left">
            <FormItem>
              <Select placeholder="用户类型"  style="width: 120px" v-model="searchObj.tenantType" >
                <Option value="" >全部</Option>
                <Option value="0" >BDAP租户</Option>
                <Option value="1" >服务层用户</Option>
                <!-- <Option v-for="(item,index) in getUserType " :key="index" :value="item" >{{ item }}</Option> -->
              </Select>
            </FormItem>
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="用户名称"  v-model="searchObj.tenantUser" />
            </FormItem>
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="系统简称" v-model="searchObj.sysName" />
            </FormItem>
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="系统中文名称"  v-model="searchObj.syschName" />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchTenant">查询</Button>
            </FormItem>
          </div>
          <!-- <div style="float:right">
            <FormItem>
                <Button  type="primary" style="margin-right:5px;" @click="addCon">新建</Button>
                <Button type="primary" icon="ios-cloud-upload-outline" style="margin-right:5px;" @click="selectExcel">导入租户信息</Button>
            </FormItem>
          </div> -->
        </Form>
      </i-col>
    </Row>
    <div>
       <Table
        stripe
        border
        :loading="loading"
        ref="tableName"
        :data="tableData"
        :max-height="tableHeight"
        :columns="tableTitle"
      >
        <!-- <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="updata(index)">更新</Button>
          <Button type="error" size="small" @click="remove(index)" style="margin-right: 5px">删除</Button>
        </template> -->
      </Table>
      <Page
        show-total
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
    <!-- <Modal v-model="modal1"  :closable='false' :mask-closable='false' title="上传Excel" footer-hide>
      <subApp
        ref="subExcel"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleUpload="reflesh"
      ></subApp>
    </Modal>
    <Modal v-model="modal2" :title='tip' :closable='false' :mask-closable='false' footer-hide>
      <div style="height:600px;width:90%;margin-left:0px;position:relative;">
        <update
          ref="updateEdit"
          @handleCancle="AfterCancle($event)"
          @handleOk="AfterOk($event)"
          @handleUpdate="reflesh"
          @handleType='getUserType'
        ></update>
      </div>
    </Modal> -->
  </div>
</template>
<script>
// import subApp from './subApp'
// import  update from './update'
import ajaxTenantInfo from '@/api/tenantInfo.js'
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title:'序号',
          width: 80,
          align: 'center',
          fixed: 'left',
          resizable:true,
          render: (h, params) => {
            return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
          }
        },
        {
          title: "用户类型",
          key: "tenantType",
          align: "center",
          width: 120,
          tooltip:true,
          resizable:true
        },
        {
          title: "用户名称",
          key: "tenantUser",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "系统简称",
          key: "sysName",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "系统中文名",
          key: "syschName",
          align: "center",
          width: 120,
          resizable:true,
          tooltip:true,
        },
        {
          title: "项目负责人",
          key: "proManager",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "项目负责人电话",
          key: "proManagerTel",
          align: "center",
          width: 140,
          resizable:true
        },
        {
          title: "项目负责人邮箱",
          key: "proManagerMail",
          align: "center",
          width: 140,
          resizable:true,
          tooltip:true,
        },
        {
          title: "应用管理员",
          key: "appManager",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "系统管理员",
          key: "sysManager",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "接口负责人",
          key: "interfaceManager",
          align: "center",
          width: 120,
          resizable:true
        },
        {
          title: "接口负责人电话",
          key: "interfaceManagerTel",
          align: "center",
          width: 140,
          resizable:true
        },
        {
          title: "创建年份",
          key: "createYear",
          align: "center",
          minWidth: 120,
          // resizable:true
        },
        // {
        //   title: "操作",
        //   slot: "action",
        //   align: "center",
        //   fixed: "right",
        //   width: 200,
        //   resizable:true
        // }
      ],
      tableData: [
        // {
        //   tenantType:"aa"
        // },
        // {
        //   tenantType:"aa"
        // },
        // {
        //   tenantType:""
        // },
        // {
        //   tenantType:"dd"
        // },
        // {
        //   tenantType:""
        // }
      ],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      // modal1:false,
      // modal2:false,
      // exportLoading:false, //下载中
      // editItem:{},
      searchObj:{},
      loading:false,
      // tip:'',
      tableHeight:0,
      num:0,
      tip:'数据努力加载中，请稍候',
      timer:null,
      // userType:[],
    }
  },
  // components:{
  //   subApp,update
  // },
  methods: {
    // 查询
    async searchTenant(){
    this.tip="数据努力加载中，请稍候";
    this.num=0;
        this.timer=setInterval(()=>{
        this.num++;
        console.log(this.num);
        if(this.num==10){
          clearInterval(this.timer);
          this.num=0;
          this.tip="加载失败,请刷新重试";
      }
    },1000);
    this.handleSpinCustom();
      let req=await ajaxTenantInfo.getTenantUser({
        "tenantType":this.searchObj.tenantType,     
        "tenantUser": this.searchObj.tenantUser,            
        "sysName": this.searchObj.sysName,        
        "syschName": this.searchObj.syschName,             
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "userName":sessionStorage.getItem("userName")?sessionStorage.getItem("userName"):""
      })
      if(req.data.code==1){
        // this.loading=false;
        if(req.data.data.length==0&&req.data.total!=0){
          this.currentPage=1;
          return;
        }
        this.$Spin.hide();
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
        this.$Message.success(req.data.message)
      }else{
        this.$Message.error(req.data.message)
      }
    },
    // 添加
    // addCon(){
    //   this.tip="新建用户";
    //   this.modal2=true;
    //   this.$refs.updateEdit.idx=-1;
    //   this.$refs.updateEdit.formValidate={};
    // },
    // // 更新
    // async updata(index){
    //   console.log("点击更新");
    //   this.tip="更新用户"
    //   this.$refs.updateEdit.idx=index;
    //   this.$refs.updateEdit.formValidate=this.tableData[index];
    //   this.modal2=true;
    // },
    // 删除
    // remove(index){
    //   console.log("点击删除"); 
    //   this.$Modal.confirm({
    //     title: "消息提示",
    //     closable: true,
    //     content: "删除该数据后将不可恢复，是否删除?",
    //     onOk: async () => {
    //       //此处调用删除数据接口
    //       let id=this.tableData[index].id;
    //       let tenantT=this.tableData[index].tenantType;
    //       let ind=this.userType.findIndex(item=>item==tenantT);
    //       let res=await ajaxTenantInfo.deleteTenantUser({id});
    //       if(res.data.code==1){
    //         this.userType.splice(ind,1);
    //         await this.$Message.success(res.data.message);
    //         await this.reflesh();
    //         await this.getUserType();
    //       }else{
    //         await this.$Message.error(res.data.message);
    //       }          
    //     }
    //   });
    // },
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
    // selectExcel(){
    //   console.log(111);
    //   this.modal1=true;
    // },
    // 上传点击取消
    // AfterCancle(val){
    //   this[val]=false;
    // },
    // 上传点击确定
    // AfterOk(val){
    //   this[val]=false;
    // },
    // 调用接口数据获取数据
    async reflesh(){
      // console.log(1);
      // clearInterval(this.timer);

      this.tip="数据努力加载中，请稍候";       
      this.handleSpinCustom();
      this.num=0;
        this.timer=setInterval(()=>{
        this.num++;
        console.log(this.num);
        if(this.num==10){
          clearInterval(this.timer);
          this.num=0;
          this.tip="加载失败,请刷新重试";
        }
      },1000);
      // this.loading=true;
      console.log(this.searchObj);
        let req=await ajaxTenantInfo.getTenantUser({
          "tenantType":this.searchObj.tenantType,     
          "tenantUser": this.searchObj.tenantUser,            
          "sysName": this.searchObj.sysName,        
          "syschName": this.searchObj.syschName,             
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
          "userName":sessionStorage.getItem("userName")?sessionStorage.getItem("userName"):""
        })
      console.log(req);
      if(req.data.code==1){
        // this.loading=false;
        this.$Spin.hide();
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
      }
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
    },
    // 获取用户类型
    // async getUserType(){
    //   let res= await ajaxTenantInfo.giveSspTenantUser();
    //   console.log(res.data.data,"用户类型");
    //   if(res.data.code==1){
    //     res.data.data.forEach((item)=>{
    //       if(item&&item.tenantType){
    //         if(this.userType.findIndex(val=>val==item.tenantType)==-1){
    //           this.userType.push(item.tenantType);
    //         }
    //       }
    //     })
    //   }
    //   console.log(this.userType);
    // }
     // 全局加载中
    handleSpinCustom () {
      this.$Spin.show({
          render: (h) => {
            // clearInterval(this.timer);
             
              return h('div', [
                  h('Icon', {
                      'class': 'demo-spin-icon-load',
                      style:{
                        animation: 'ani-demo-spin 1s linear infinite',
                      },
                      props: {
                          type: 'ios-loading',
                          size: 18
                      }
                  }),
                  h('div', this.tip)
              ])
          }
      });
    },
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
    },
    pageSize:function(newval){
      this.onPageSize(newval)
    },
    tip:function(newVal){
      if(newVal=="加载失败,请刷新重试"){
        // console.log("haha");
        document.getElementsByClassName('ivu-spin-fullscreen')[0].addEventListener('click',()=>{
            this.$Spin.hide();
        })
      }
      // else{
      //   document.getElementsByClassName('ivu-spin-fullscreen')[0].removeEventListener('click',()=>{
      //       this.$Spin.hide();
      //   })
      // }
    }
  },
  computed:{ 
    // getUserType:function(){
    //   let arr=[];
    //   if(this.tableData){
    //     this.tableData.forEach(item=>{
    //       if(item.tenantType){
    //         if(arr.findIndex(val=>val==item.tenantType)==-1){
    //           arr.push(item.tenantType);
    //         }
    //       }else{
    //         if(arr.indexOf("null")==-1){
    //           arr.push("null");
    //         }
    //       }
    //     })
    //   }
    //   return arr;
    // }
  },
  async mounted(){
    // await this.getUserType();
    await this.reflesh();
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
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
}
</script>

<style lang='less' scoped>
  .clearfix:after{display:block;clear:both;content:"";visibility:hidden;height:0}
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
