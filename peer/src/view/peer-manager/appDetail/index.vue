<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <div v-if="$route.params.id">
            <Button type="primary" @click="$router.go(-1)" style="margin-bottom:10px;">返回</Button>
          </div>
          <div v-else>
          <FormItem>
            <Input type="text" placeholder="申请单ID" style="width: 100px" v-model="searchObj.Id" />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="租户" style="width: 100px"  v-model="searchObj.tenantUser" />
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
            <Select placeholder="源集群" style="width:120px;"  v-model="searchObj.sourceClusterCode">
              <Option  key="a" value="a">全选</Option>
              <Option v-for="(item,index) in cluCode" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select placeholder="目标集群" style="width:120px;"  v-model="searchObj.targetClusterCode">
              <Option  key="a" value="a">全选</Option>
              <Option v-for="(item,index) in cluCode" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchApp">查询</Button>
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
        :loading="loading"
        class="listContent"
        ref="tableName"
        :data="tableData"
        :columns="tableTitle"
        :max-height="tableHeight"
      >
        <!-- <template slot-scope="{ row, index }" slot="action">
          <Button v-for="(item,index) in actionType" :key="index" :type="item.value=='同步'?'primary':'error'" size="small" style="margin-right: 5px" @click="handleBtn(index,item.value)">{{item.value}}</Button>
        </template> -->
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
    <!-- <Modal v-model="modal1" title="上传申请单" footer-hide>
      <subApp
        ref="subExcel"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
      ></subApp>
    </Modal>
    <Modal v-model="modal2" :title="tip" footer-hide>
      <watchEdit
        ref="watchEdit"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)">
      </watchEdit>
    </Modal> -->
  </div>
</template>

<script>
import applyAxios from '@/api/application.js';
import { clusterIter } from '@/api/clusterConfig.js'
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
          width: 80,
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
          title: "peer名称",
          key: "peerId",
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
          title: "源集群",
          key: "sourceClusterCode",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "目标集群",
          key: "targetClusterCode",
          align: "center",
          width: 100,
          resizable:true
        },
        {
          title: "命名空间",
          key: "nameSpace",
          align: "center",
          width: 100,
          resizable:true
        },
        {
          title: "表",
          key: "tableName",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "列簇",
          key:"colFamily",
          align: "center",
          width: 80,
          resizable:true
        },
        {
          title: "操作类型",
          // slot: "action",
          key:"operType",
          align: "center",
          width: 100,
          render:(h,params)=>{
            return h('div', [
              h('span', this.actionType[params.row.operType-1].value)
            ]);
          },
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
          title: "同步时间",
          key:'synTime',
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
          title: "申请时间",
          key: "reqTime",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
          // resizable:true
        }
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      modal1:false,
      modal2:false,
      idx:-1,
      searchObj:{},
      stat:[],
      actionType:[],
      cluCode:[],
      loading:false,
      tableHeight:0
    }
  },
  // components:{
  //   // subApp,watchEdit
  // },
  methods: {
    // 查询
    async searchApp(){
      console.log("OK");
      this.loading=true; 
      let reg=/^\d{4}-\d{2}-\d{2}$/;
      if(this.searchObj.prodBeginDate&&!reg.test(this.searchObj.prodBeginDate)){
        this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.prodEndDate&&!reg.test(this.searchObj.prodEndDate)){
        this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.sourceClusterCode=="a"){
        this.searchObj.sourceClusterCode="";
      }
      if(this.searchObj.targetClusterCode=="a"){
        this.searchObj.targetClusterCode="";
      }
      if(this.searchObj.stat=="a"){
        this.searchObj.stat="";
      }
      let res=await applyAxios.appDetailSearch({
        "applyId": this.searchObj.applyId,
        "tenantUser": this.searchObj.tenantUser,
        "prodBeginDate": this.searchObj.prodBeginDate,
        "prodEndDate": this.searchObj.prodEndDate,
        "sourceClusterCode": this.searchObj.sourceClusterCode, 
        "targetClusterCode": this.searchObj.targetClusterCode,
        "stat": this.searchObj.stat,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize
      })  
      if(res.data.code==1){
          this.loading=false; 
          this.tableData=res.data.data;
          this.totalNum=res.data.total;
          this.$Message.success(res.data.message);
          // this.searchObj={};
      }else{
          this.$Message.error(res.data.message)
      }
    },
    handleBtn(index,value){
      if(value=="同步"){
        this.updata(index);
      }else{
        this.remove(index);
      }
    },
    // 同步
    updata(index){
      console.log("点击同步");
  //     this.tip=t;
  //     this.idx=index;
  //     this.$refs.watchEdit.idx=this.idx;
  //     this.editItem=this.tableData[this.idx];
  //     this.$refs.watchEdit.formValidate=this.editItem;
  //     this.modal2=true;      
    },
    // 取消同步
    remove(index){
      console.log("点击取消"); 
  //     this.$Modal.confirm({
  //       title: "消息提示",
  //       closable: true,
  //       content: "删除该数据后将不可恢复，是否删除?",
  //       onOk: async () => {
  //         //此处调用删除数据接口
  //         // let id=this.tableData[index].userId;
  //         // this.tableData.splice(index, 1);
  //         // let res=await userInfo.delUser(id);
  //         // await this.$Message.success(res.data.msg);
  //         // await this.reflesh();
  //       }
  //     });
    },
  //   // 上传点击取消
  //   AfterCancle(val){
  //     this[val]=false;
  //   },
  //   // 上传点击确定
  //   AfterOk(val){
  //     this[val]=false;
  //   },
    // 调用接口数据获取数据
    async reflesh(id){
      // console.log(111);
      this.loading=true;
      console.log(id,"======id");         
      if(id){
        console.log("从申请单页面来",this.loading);

        this.searchObj.applyId=id;
      }else{
        console.log("直接进入详情页");
        let reg=/^\d{4}-\d{2}-\d{2}$/;  
        if(this.searchObj.prodBeginDate!=""&&!reg.test(this.searchObj.prodBeginDate)){
          this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
        }
        if(this.searchObj.prodEndDate!=""&&!reg.test(this.searchObj.prodEndDate)){
          this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
        }
        if(this.searchObj.sourceClusterCode=="a"){
          this.searchObj.sourceClusterCode="";
        }
        if(this.searchObj.targetClusterCode=="a"){
          this.searchObj.targetClusterCode="";
        }
        if(this.searchObj.stat=="a"){
          this.searchObj.stat="";
        }
      }
      
      let res=await applyAxios.appDetailSearch({
        "applyId": this.searchObj.applyId,
        "tenantUser": this.searchObj.tenantUser,
        "prodBeginDate": this.searchObj.prodBeginDate,
        "prodEndDate": this.searchObj.prodEndDate,
        "sourceClusterCode": this.searchObj.sourceClusterCode, 
        "targetClusterCode": this.searchObj.targetClusterCode,
        "stat": this.searchObj.stat,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize
      })  
      console.log(res,"初始化数据");
      
      if(res.data.code==1){
        this.loading=false;
        this.tableData=res.data.data;
        this.totalNum=res.data.total;
      }
    },
    async getStat(){
      let req=await applyAxios.getApplyStat();
      console.log(req,"状态列表");
      this.stat=req.data;
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
    async getAppDetailActionOperType(){
      let req=await applyAxios.appDetailActionOperType();
      console.log(req,"申请单明细操作类型列表");
      this.actionType=req.data;
    },
    async getClusterCode(){
       let req=await clusterIter.searchClusterConfig({
        "clusterName": "",
        "clusterCode": "",
        "pageNum": 1,
        "pageSize": 100
      })
      console.log(req);
      if(req.data.code==1){
          let arr=req.data.data;
          for(let i=0;i<arr.length;i++){
            let index=this.cluCode.findIndex((item)=>{
              return item==arr[i].clusterCode;
            })
            if(index==-1){
              this.cluCode.push(arr[i].clusterCode);
            }
          }
      }
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
    },
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      this.reflesh(params.id);
    },
    // $route: {
    //  handler:function (val, oldVal){
    //   const { name, query, params, meta } = val;
    //   this.reflesh(params.id);
    //  },
    //  // 深度观察监听
    //  deep:  true
    //  }
  },
  async mounted(){
    console.log(this.$route,"查看路由");
    await window.addEventListener('resize', this.getTableHeight);
    if(this.$route.params.id){
      console.log("从申请单页面来");
      await this.reflesh(this.$route.params.id);
    }else{
      console.log("直接进入详情页");     
      await this.reflesh();
    }  
    await this.getTableHeight();
    await this.getStat();
    await this.getClusterCode();
    await this.getAppDetailActionOperType(); 
    document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    document.getElementById('pageInput').addEventListener('blur', (res) => {
    if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
      console.log(Number(res.target.value));
          this.currentPage = Number(res.target.value);
      }else{
        this.currentPage = 1;
      }
    })
  },
  async created() {
 
  }
}
</script>

<style lang='less' scoped>

</style>
