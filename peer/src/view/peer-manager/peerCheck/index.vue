<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <div class="btnL">
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
          <div class="btnR">
            <FormItem>
              <Button type="primary" @click="newCreate">新建</Button>
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
        ref="tableName"
        :loading="loading"
        :data="tableData"
        :max-height="tableHeight"
        :columns="tableTitle"
      >
        <template slot-scope="{ index }" slot="watch">
          <Button type="primary" size="small"  @click="watchDetail(index)">查看详情</Button>
        </template>
        <template slot-scope="{ row,index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="startUse(index)" :disabled="row.peerState=='开启'" >启用</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="endUse(index)" :disabled="row.peerState=='关闭'" >禁用</Button>
          <Button type="error" size="small" @click="remove(index)" >删除</Button>
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
    <Modal v-model="modal1" tip="查看详情" :closable="false" :mask-closable="false" width="660" footer-hide>
      <div>
        <Form :label-width="10" inline >
         <FormItem>
           <Input placeholder="命名空间" style="width:150px;" v-model="detailSearchObj.nameSpace" ></Input>
          </FormItem>
          <FormItem>
            <Input placeholder="表" style="width:150px;" v-model="detailSearchObj.tableName" ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="detailSearchApp">查询</Button>
          </FormItem>
        </Form>
      </div>
      <div style="height:470px;">
        <div style="max-height:380px;overflow:auto;">
          <Table :data="detailTableData" border :columns="detailTableTitle"></Table>
        </div>
        <Page
        show-total
        style="text-align:right;margin-top:10px;"
        :total="detailTotalNum"
        :page-size="detailPageSize"
        :current="detailCurrentPage"
        show-elevator
        show-sizer
        @on-change="detailPageChange"
        @on-page-size-change="detailOnPageSize"
      />
        <div style="overflow:hidden;">
          <Button type="primary" style="float:right;margin-right:20px;margin-top:20px"  @click="modal1=false">确定</Button>
        </div>
      </div>
    </Modal>
    <Modal v-model="modal2" title="新建" :closable="false" :mask-closable="false" footer-hide>
      <createPeer
        ref="newCreate"
        @handleCreate="reflesh"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)">
      </createPeer>
    </Modal>
  </div>
</template>

<script>
import peerCheckAxios from '@/api/peerCheck.js'
import { clusterIter } from '@/api/clusterConfig.js'
import createPeer from './createPeer'
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title:'序号',
          // type: 'index',
          width: 80,
          align: 'center',
          resizable:true,
          render: (h, params) => {
            return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
          }
        },
        {
          title: "peer名称",
          key: "peerId",
          align: "center",
          width: 180,
          resizable:true
        },
        {
          title: "源集群",
          key: "sourceClusterCode",
          align: "center",
          width: 180,
          resizable:true
        },
        {
          title: "目标集群",
          key: "targetClusterCode",
          align: "center",
          width: 200,
          resizable:true
        },
        {
          title: "peer状态",
          key: "peerState",
          align: "center",
          width: 200,
          resizable:true
        },
        {
          title: "详情",
          slot: "watch",
          align: "center",
          fixed:"right",
          width: 180,
          resizable:true
        },
        {
          title: "操作类型",
          slot: "action",
          fixed:"right",
          align: "center",
          minWidth: 300,
          resizable:true
        },
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      modal1:false,
      modal2:false,
      detailTableTitle:[
        {
          title: "命名空间",
          key: "nameSpace",
          align: "center",
          width: 150,
          resizable:true,
        },
        {
          title: "表",
          key: "tableName",
          align: "center",
          width: 150,
          tooltip:true,
          resizable:true,
        },
        {
          title: "列簇",
          key: "colFamily",
          align: "center",
          resizable:true,
          width: 150
        },
        {
          title: "列簇状态",
          key: "colFamilyState",
          align: "center",
          resizable:true,
          width: 150
        }
      ],
      detailTableData:[],
      searchObj:{},
      detailSearchObj:{},
      detailTotalNum:0,
      detailPageSize:10, //每页几条数据
      detailCurrentPage:1,
      watchItem:{},
      cluCode:[],
      loading:false,
      tableHeight:0
    }
  },
  components:{
    createPeer,
  },
  methods: {
    // 查询
    searchApp(){
      console.log("OK",this.searchObj);
      this.loading=true;
      if(this.searchObj.sourceClusterCode=="a"){
        this.searchObj.sourceClusterCode="";
      }
      if(this.searchObj.targetClusterCode=="a"){
        this.searchObj.targetClusterCode="";
      }
      peerCheckAxios.peerSearch({
          "sourceClusterCode": this.searchObj.sourceClusterCode,
          "targetClusterCode":this.searchObj.targetClusterCode,
          "pageNum": this.currentPage,
          "pageSize": this.pageSize
      }).then(res=>{
        console.log(res);
        if(res.data.code==1){
          this.loading=false;
          this.tableData=res.data.data;
          this.totalNum=res.data.total;
          this.$Message.success(res.data.message);
          // this.searchObj={};
        }else{
          this.$Message.error(res.data.message)
        }    
      })      
    },
    // 新建
    newCreate(){
      console.log("点击新建");
      this.$refs.newCreate.cluCode=this.cluCode;
      this.$refs.newCreate.formValidate={};
      this.modal2=true;
    },
    // 启用
    async startUse(index){
      console.log("点击启用");
      this.$Modal.confirm({
        title: "启用提示",
        closable: true,
        content: "确认要启用此peer吗?",
        onOk: async () => {
          let res=await peerCheckAxios.peerEnable({
            "sourceClusterCode": this.tableData[index].sourceClusterCode,
            "peerId": this.tableData[index].peerId
          })
          if(res.data.code==1){
            this.$Message.success(res.data.message);
            await this.reflesh();
          }else{
            this.$Message.error(res.data.message);
          }   
        }
      });
    },
    // 禁用
    async endUse(index){
      console.log("点击禁用");
      this.$Modal.confirm({
        title: "禁用提示",
        closable: true,
        content: "确认要禁用此peer吗?",
        onOk: async () => {
          let res=await peerCheckAxios.peerDisable({
            "sourceClusterCode": this.tableData[index].sourceClusterCode,
            "peerId": this.tableData[index].peerId
          })
          if(res.data.code==1){
            this.$Message.success(res.data.message);
            await this.reflesh();
          }else{
            this.$Message.error(res.data.message);
          }   
        }
      });
    },
    // 删除
    remove(index){
      console.log("点击删除"); 
      this.$Modal.confirm({
        title: "删除提示",
        closable: true,
        content: "确认要删除此peer吗?",
        onOk: async () => {
          // 此处调用删除数据接口
          let peerId=this.tableData[index].peerId;
          let res=await peerCheckAxios.peerDelete({
            "sourceClusterCode": this.tableData[index].sourceClusterCode,
            "peerId": this.tableData[index].peerId
          });
          if(res.data.code==1){
            this.$Message.success(res.data.message);
            await this.reflesh();
          }else{
            this.$Message.error(res.data.message);
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
    detailPageChange(val){
      this.detailCurrentPage=val;
      this.detailSearchApp();
    },
    // 每页条数改变
    onPageSize(val){
      console.log(val);
      this.pageSize=val;
      this.reflesh();
    },
    detailOnPageSize(val){
      this.detailPageSize=val;
      this.detailSearchApp();
    },
    // 新建点击取消
    AfterCancle(val){
      this[val]=false;
    },
    // 新建点击保存
    AfterOk(val){
      this[val]=false;
    },
    // 调用接口数据获取数据
    async reflesh(){
      this.loading=true;
      if(this.searchObj.sourceClusterCode=="a"){
        this.searchObj.sourceClusterCode="";
      }
      if(this.searchObj.targetClusterCode=="a"){
        this.searchObj.targetClusterCode="";
      }
      let res=await peerCheckAxios.peerSearch({
          "sourceClusterCode": this.searchObj.sourceClusterCode,
          "targetClusterCode":this.searchObj.targetClusterCode,
          "pageNum": this.currentPage,
          "pageSize": this.pageSize
      });
      console.log(res);
      if(res.data.code==1){
        this.loading=false;
        this.tableData=res.data.data;
        this.totalNum=res.data.total;
      }  
    },
    // 查看详情
    async watchDetail(index){
      this.detailCurrentPage=1;
      this.detailPageSize=10;
      this.handleSpinCustom();
      this.watchItem=this.tableData[index];
      let res=await peerCheckAxios.peerDeatil({
        "sourceClusterCode": this.watchItem.sourceClusterCode,
        "peerId": this.watchItem.peerId,
        "pageNum": this.detailCurrentPage,
        "pageSize": this.detailPageSize
      });
      if(res.data.code==1){
        this.$Spin.hide();
        this.detailTableData=res.data.data;
        this.detailTotalNum=res.data.total;
        this.$Message.success(res.data.message);
      }else{
        this.$Message.error(res.data.message)
      }        
      this.modal1=true;      
    },
    async detailSearchApp(){
      let res=await peerCheckAxios.peerDeatil({
          "sourceClusterCode": this.watchItem.sourceClusterCode,
          "peerId": this.watchItem.peerId,
          "nameSpace":this.detailSearchObj.nameSpace,
          "tableName":this.detailSearchObj.tableName,
          "pageNum": this.detailCurrentPage,
          "pageSize": this.detailPageSize
      });
      if(res.data.code==1){
        this.detailTableData=res.data.data;
        this.detailTotalNum=res.data.total;
      }else{
        this.$Message.error(res.data.message)
      }        
      this.modal1=true; 
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
    // 全局加载中
    handleSpinCustom () {
      this.$Spin.show({
          render: (h) => {
              return h('div', [
                  h('Icon', {
                      'class': 'demo-spin-icon-load',
                      props: {
                          type: 'ios-loading',
                          size: 18
                      }
                  }),
                  h('div', 'Loading')
              ])
          }
      });
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
	  }
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
    },
    pageSize:function(newval){
      this.onPageSize(newval)
    },
    detailCurrentPage:function(newval){
      this.detailPageChange(newval)
    },
    detailPageSize:function(newval){
      this.detailOnPageSize(newval)
    }
  },
  mounted() {
    console.log("进入页面");
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    this.getClusterCode();
    // this.getStat();
    this.reflesh();
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
  created() {}
}
</script>

<style lang='less' scoped>
.btnL{
  float: left;
}
.btnR{
  float:right;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
