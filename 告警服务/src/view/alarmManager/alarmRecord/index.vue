<template>
  <div >
     <Row class="row">
      <i-col>
        <Form :label-width="10" inline>
          <FormItem>
            <Select placeholder="事件级别" v-model="searchObj.customerSeverity" >
              <Option value="" >请选择</Option>
              <Option v-for="(item,index) in cusSeverity" :key="index" :value="item" >{{ cusSeverityShow[index] }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="项目名称" v-model="searchObj.componentId" />
          </FormItem>
          <FormItem>
            <Select placeholder="告警类型" v-model="searchObj.componentTypeId" >
              <Option value="" >请选择</Option>
              <Option v-for="(item,index) in comTypeId" :key="index" :value="item" >{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <DatePicker type="date" placement="bottom-end" placeholder="发生时间" style="width: 180px" v-model="searchObj.insertTime"></DatePicker> 
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchRecord">搜索</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Table
        stripe
        ref="tableName"
        :data="tableData"
        :columns="tableTitle"
        :max-height="tableHeight"
      >
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
</template>

<script>
import alarmAjax from '@/api/alarmManager.js'
export default {
  data: function() {

    return {
      tableTitle: [
        {
          title: "节点IP",
          key: "nodeAlias",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "节点名称",
          key: "nodeName",
          align: "center",
          width: 90,
          tooltip: true
        },
        {
          title: "项目编码",
          key: "appCode",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "事件级别",
          key: "customerSeverity",
          align: "center",
          width: 100,
          tooltip: true
        },
        {
          title: "项目名称",
          key: "componentId",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "告警类型",
          key: "componentTypeId",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "实例ID",
          key: "instanceId",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "事件名称",
          key: "eventId",
          align: "center",
          width: 200,
          tooltip: true
        },
        {
          title: "实例值",
          key: "instanceValue",
          align: "center",
          width: 120,
          tooltip: true
        },
        {
          title: "事件描述",
          key: "summaryCN",
          align: "center",
          width: 300,
          tooltip: true
        },
        {
          title: "告警服务",
          key: "alarmConfigId",
          align: "center",
          width: 200,
          tooltip: true
        },
      ],
      tableData: [],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      searchObj:{},
      tableHeight:0,
      comTypeId:[],
      cusSeverity:[],
      cusSeverityShow:['故障','报警','预警','提示','信息'],
    }
  },
  methods: {
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
    async reflesh(){
      let num;
      if(this.searchObj.insertTime){
        num=this.$formatTime(this.searchObj.insertTime.getTime(),"yyyy-MM-dd");;
      }else{
        num="";
      }
      let res = await alarmAjax.getRecord({
        "customerSeverity":this.searchObj.customerSeverity,
        "componentId":this.searchObj.componentId,
        "componentTypeId":this.searchObj.componentTypeId,
        "insertTime":num,
      },this.pageSize,this.currentPage);
        this.tableData=res.data.list;
        this.totalNum=res.data.total;
    },

    async searchRecord(){
      let num;
      if(this.searchObj.insertTime){
        num=this.$formatTime(this.searchObj.insertTime.getTime(),"yyyy-MM-dd");;
      }else{
        num="";
      }
      // console.log({
      //   "customerSeverity":this.searchObj.customerSeverity,
      //   "componentId":this.searchObj.componentId,
      //   "componentTypeId":this.searchObj.componentTypeId,
      //   "insertTime":num,
      // });
      let res = await alarmAjax.getRecord({
        "customerSeverity":this.searchObj.customerSeverity,
        "componentId":this.searchObj.componentId,
        "componentTypeId":this.searchObj.componentTypeId,
        "insertTime":num
      },this.pageSize,this.currentPage);
        this.tableData=res.data.list;
        this.totalNum=res.data.total;
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
    },
    async getSelect(){
      let res=await alarmAjax.getSyslogSelect();
      this.comTypeId=res.data.componentTypeId;
      this.cusSeverity=res.data.customerSeverity;
    }
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
    },
    pageSize:function(newval){
      this.onPageSize(newval)
    },
  },
  async mounted() {
    await this.getSelect();
    await this.reflesh();
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
  },
  created() {
  },
  computed:{
  }
}
</script>

<style lang='less' scoped>
.row{
  margin:10px 0;
  background-color:#fff;
  padding:10px 20px 0;
  height:52px;
}
.form{
  float: right;
}
</style>
