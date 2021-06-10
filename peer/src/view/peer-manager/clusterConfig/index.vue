<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <div class="ipt">
            <FormItem>
              <Input type="text" placeholder="集群名称" v-model="searchObj.clusterName" />
            </FormItem>
            <FormItem>
              <Input type="text" placeholder="集群名标识" v-model="searchObj.clusterCode" />
            </FormItem>
            <FormItem>
            <Button type="primary" style="margin-right:10px;" @click="clusterSearch">查询</Button>
            </FormItem>
          </div>
          <div class="btn">
            <FormItem>
              <Button type="primary" @click="newAdd">新建</Button>
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
          .slice((currentPage-1)*pageSize,currentPage*pageSize)
      -->
      <Table
        stripe
        border
        class="listContent"
        ref="tableName"
        :loading="loading"
        :data="getTableData"
        :max-height="tableHeight"
        :columns="tableTitle"
      >
        <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更新</Button>
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
    <Modal v-model="modal1" :title="tip" :mask-closable="false" :closable="false" footer-hide>
      <modifyAdd
        ref="modifyAdd"
        @handleAdd="reflesh"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
      ></modifyAdd>
    </Modal>
  </div>
</template>

<script>
import { clusterIter } from '@/api/clusterConfig.js'
import modifyAdd from './info'
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
          title: "集群标识",
          key: "clusterCode",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true
        },
        {
          title: "集群名称",
          key: "clusterName",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true
        },
        {
          title: "集群描述",
          key: "clusterDesc",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true
        },
        {
          title: "hbase账户",
          key: "hbaseUser",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true
        },
        {
          title: "hbase密码",
          key: "hbasePwd",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('span', "******")
            ]);
          },
          resizable:true
        },
        {
          title: "krb5conf路径",
          key: "krb5ConfPath",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true
        },
        {
          title: "hbase配置文件路径",
          key: "hbaseConfPath",
          align: "center",
          minWidth: 200,
          tooltip:true,
          // resizable:true
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed:"right",
          width: 300,
          resizable:true
        },
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      modal1:false,
      tip:"",
      formValidate:{},
      editItem:{},
      searchObj:{},
      loading:false,
      tableHeight:0
    }
  },
  components:{
    modifyAdd
  },
  methods: {
    // 新建
    newAdd(){
      this.tip="新增集群配置";
      this.$refs.modifyAdd.idx=-1;
      this.$refs.modifyAdd.formValidate={};
      this.modal1=true;
    },
    // 查询
    async clusterSearch(){
      // let res={
      //   code:1,
      //   data:[
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },

      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },{
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //     {
      //       clusterCode:0,
      //       clusterName:"asd",
      //       clusterDesc:"萨德里克",
      //       hbaseUser:"fads",
      //       hbasePwd:"safd",
      //       krb5ConfPath:"sdafdsf/dgfs",
      //       hbaseConfPath:"dfadg"
      //     },
      //   ]
      // };
      // this.totalNum=res.data.length;
      // this.tableData=res.data;
      let req=await clusterIter.searchClusterConfig({
        "clusterName": this.searchObj.clusterName,
        "clusterCode": this.searchObj.clusterCode,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize
      })
      console.log(req);
      if(req.data.code==1){
          this.tableData=req.data.data;
          this.totalNum=req.data.total;
          this.$Message.success(req.data.message)
          // this.searchObj={};
      }else{
          this.$Message.error(req.data.message)
      }
    },
    // 更新
    update(index){
      console.log("点击更新");
      this.tip="修改集群配置";
      this.idx=index;
      this.$refs.modifyAdd.idx=this.idx;
      this.editItem=this.tableData[this.idx];
      this.$refs.modifyAdd.formValidate=JSON.parse(JSON.stringify(this.editItem));
      this.modal1=true;      
    },
    // 删除
    remove(index){
      console.log("点击删除"); 
      this.$Modal.confirm({
        title: "消息提示",
        closable: true,
        content: "确认要删除此集群吗?",
        onOk: async () => {
          //此处调用删除数据接口
          let clusterCode=this.tableData[index].clusterCode;
          this.tableData.splice(index, 1);
          let res=await clusterIter.deleteClusterConfig({clusterCode});
          if(res.data.code==1){
            await this.$Message.success(res.data.message);
            await this.reflesh();
          }else{
            await this.$Message.error(res.data.message);
          }
        }
      });
    },
  //   // 换页
    pageChange(val){
      console.log(val);
      this.currentPage=val;
    },
    // 每页条数改变
    onPageSize(val){
      console.log(val);
      this.pageSize=val;
    },
    // 点击取消
    AfterCancle(val){
      this[val]=false;
    },
    // 点击确定
    AfterOk(val){
      this[val]=false;
    },
    // 调用接口数据获取数据
    async reflesh(){
      // this.clusterSearch();
      console.log(1111);
      this.loading=true; 
      let req=await clusterIter.searchClusterConfig({
        "clusterName": this.searchObj.clusterName,
        "clusterCode": this.searchObj.clusterCode,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize
      })
      if(req.data.code==1){
        this.loading=false; 
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
      }
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
	  }
  },
  watch:{
    currentPage:function(){
      this.reflesh();
    },
    pageSize:function(){
      this.reflesh();
    }
  },
  created() {
    this.reflesh();
  },
  computed:{
    getTableData:function(){
      return this.tableData?this.tableData:[];
    }
  },
  mounted() {
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    this.reflesh();
    document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    document.getElementById('pageInput').addEventListener('blur', (res) => {
      
      if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
      console.log(Number(res.target.value));
          this.currentPage = Number(res.target.value);
      //   this.pageChange(Math.ceil(this.totalNum / this.pageSize))
      //   res.target.value = Math.ceil(this.totalNum / this.pageSize)
      // } else {
      //   this.pageChange(Number(res.target.value))
      //   this.pageSize = Number(res.target.value)
      }else{
        this.currentPage = 1;
      }
    })
  },
}
</script>

<style lang='less' scoped>
// .form{
//   float:right;
// }
.listShow{
  margin-bottom:50px;
}
.ipt{
  float:left;
}
.btn{
  float:right;
}
</style>

