<template>
  <div>
    
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <FormItem>
            <Input type="text" placeholder="用户" style="width: 100px" v-model="searchObj.optUser" />
          </FormItem>
          <FormItem>
            <Select placeholder="操作对象" style="width:120px;" v-model="searchObj.optObj">
                <Option  key="a" value="a">全选</Option>
                <Option v-for="(item,index) in logObj" :key="index" :value="item.key">{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select placeholder="操作类型" style="width:120px;" v-model="searchObj.optType">
                <Option  key="a" value="a">全选</Option>
                <Option v-for="(item,index) in logType" :key="index" :value="item.key" >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem>
              <Select placeholder="操作结果" style="width:120px;" v-model="searchObj.optStat">
                <Option  key="a" value="a">全选</Option>
                <Option v-for="(item,index) in stat" :key="index" :value="item.key">{{ item.value }}</Option>
              </Select>
            </FormItem>
          <FormItem>
            <DatePicker type="datetime" placement="bottom-end" placeholder="操作开始时间" style="width: 180px" v-model="searchObj.optBeginTime"></DatePicker> -
            <DatePicker type="datetime" placement="bottom-end" placeholder="操作结束时间" style="width: 180px" v-model="searchObj.optEndTime" @on-change="timeChange" ref="datePicker" ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchApp">查询</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <div class="listShow">
      <Table
        stripe
        border
        :loading="loading"
        class="listContent"
        ref="tableName"
        :max-height="tableHeight"
        :data="tableData"
        :columns="tableTitle"
      >
      <!-- .slice((currentPage-1)*pageSize,currentPage*pageSize) -->
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
  </div>
</template>

<script>
import expand from './expend'
import LogAxios from '@/api/actionLog.js';
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title:'序号',
          width: 80,
          align: 'center',
          // fixed: 'left',
          resizable:true,
          render: (h, params) => {
            return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
          }
        },
        {
          title: "操作对象",
          key: "optObj",
          align: "center",
          width: 150,
          tooltip:true,
          resizable:true,
          render:(h,params)=>{
            for(let i=0;i<this.logObj.length;i++){
              if(this.logObj[i].key==(params.row.optObj)){
                return h('div',this.logObj[i].value)
              }
            }
          }
        },
        {
          title: "对象ID",
          key: "optId",
          align: "center",
          width: 150,
          tooltip:true,
          resizable:true
        },
        {
          title: "操作类型",
          key: "optType",
          align: "center",
          width: 150,
          tooltip:true,
          resizable:true,
          render:(h,params)=>{
            for(let i=0;i<this.logType.length;i++){
              if(this.logType[i].key==(params.row.optType)){
                return h('div',this.logType[i].value)
              }
            }
          }
        },
        {
          title: "用户",
          key: "optUser",
          align: "center",
          width: 150,
          resizable:true
        },
        {
          title: "时间",
          key: "optTime",
          align: "center",
          width: 150,
          resizable:true,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.optTime?this.$formatTime(params.row.optTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
        },
        {
          title: "明细",
          key:'optDesc',
          align: "center",
          width: 320,
          render: (h, params) => {
            return h(expand,{props:{optDesc:params.row.optDesc}})
              // return h('Collapse',{style:{height:'100px'}},[
              //   h('Panel',{},[
              //     h('p',{attrs:{slot:'content'}},params.row.optDesc,)
              //   ],'点击展开>>')
              // ])
          },
          resizable:true,
        },
        // {
        //   title: "明细",
        //   type: 'expand',
        //   align: "center",
        //   width: 320,
        //   render: (h, params) => {
        //       return h('div',{style:{width:500,textAlign:center,textIndent:2}},this.tableData[params.index].optDesc)
        //   },
        //   resizable:true,
        // },
        {
          title: "操作结果",
          key: "optStat",
          align: "center",
          width: 150,
          resizable:true,
          render:(h,params)=>{
            for(let i=0;i<this.stat.length;i++){
              if(this.stat[i].key==(params.row.optStat)){
                return h('div',this.stat[i].value)
              }
            }
          }
        },
        {
          title: "结果信息",
          key: "optMsg",
          align: "center",
          minWidth: 150,
          // resizable:true,
        }, 
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      searchObj:{
        optEndTime:""
      },
      stat:[],
      loading:false,
      logType:[],
      logObj:[],
      tableHeight:0
    }
  },
  components:{
    expand,
  },
  methods: {
    // 查询
    async searchApp(){
      console.log("OK");
      this.loading=true; 
      console.log(this.searchObj,"111")
      let reg=/^\d{4}-\d{2}-\d{2}\ \d{2}:\d{2}:\d{2}$/;
      if(this.searchObj.optBeginTime&&!reg.test(this.searchObj.optBeginTime)){
        this.searchObj.optBeginTime=this.$formatTime(this.searchObj.optBeginTime.getTime(),"yyyy-MM-dd HH:mm:ss");
      }
      if(this.searchObj.optEndTime&&!reg.test(this.searchObj.optEndTime)){
        this.searchObj.optEndTime=this.$formatTime(this.searchObj.optEndTime.getTime(),"yyyy-MM-dd HH:mm:ss");
      }
      if(this.searchObj.optObj=="a"){
        this.searchObj.optObj="";
      }
      if(this.searchObj.optType=="a"){
        this.searchObj.optType="";
      }
      if(this.searchObj.optStat=="a"){
        this.searchObj.optStat="";
      }
      let res=await LogAxios.getActionLog({
        "optUser": this.searchObj.optUser,
        "optObj": this.searchObj.optObj,
        "optType": this.searchObj.optType,
        "optBeginTime": this.searchObj.optBeginTime,
        "optEndTime": this.searchObj.optEndTime,
        "optStat": this.searchObj.optStat,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize
      })  

      if(res.data.code==1){
          this.loading=false; 
          this.tableData=res.data.data;
          this.totalNum=res.data.total;
          this.$Message.success(res.data.message);
      }else{
          this.$Message.error(res.data.message)
      }
    },
    // 调用接口数据获取数据
    async reflesh(id){
      this.loading=true;
        let reg=/^\d{4}-\d{2}-\d{2}\ \d{2}:\d{2}:\d{2}$/;;  
        if(this.searchObj.optBeginTime!=""&&!reg.test(this.searchObj.optBeginTime)){
          this.searchObj.optBeginTime=this.$formatTime(this.searchObj.optBeginTime.getTime(),"yyyy-MM-dd HH:mm:ss");
        }
        if(this.searchObj.optEndTime!=""&&!reg.test(this.searchObj.optEndTime)){
          this.searchObj.optEndTime=this.$formatTime(this.searchObj.optEndTime.getTime(),"yyyy-MM-dd HH:mm:ss");
        }
        if(this.searchObj.optObj=="a"){
          this.searchObj.optObj="";
        }
        if(this.searchObj.optType=="a"){
          this.searchObj.optType="";
        }
        if(this.searchObj.optStat=="a"){
          this.searchObj.optStat="";
        } 
      let res=await LogAxios.getActionLog({
        "optUser": this.searchObj.optUser,
        "optObj": this.searchObj.optObj,
        "optType": this.searchObj.optType,
        "optBeginTime": this.searchObj.optBeginTime,
        "optEndTime": this.searchObj.optEndTime,
        "optStat": this.searchObj.optStat,
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
    // 获取状态列表
    async getStat(){
      let req=await LogAxios.getLogStat();
      console.log(req,"状态列表");
      this.stat=req.data;
    },
    // 获取操作类型列表
    async getActionType(){
      let req=await LogAxios.getLogType();
      console.log(req,"操作类型列表");
      this.logType=req.data;
    },
    // 获取操作类型列表
    async getActionObj(){
      let req=await LogAxios.getLogObj();
      console.log(req,"操作对象列表");
      this.logObj=req.data;
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
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
    },
    timeChange(time){
      if(time.length&&time[0]){
        if(time.search("00:00:00")!=-1){
          this.searchObj.optEndTime=new Date((this.searchObj.optEndTime.getTime())+24*60*60*1000-1000);
          console.log(this.searchObj.optEndTime);
        }
      }
    }
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
    },
    pageSize:function(newval){
      this.onPageSize(newval)
    },
    totalNum:function(){
      for(let i=0;i<this.totalNum;i++){
        this.showOrHide.push(0);
      }
    },
    // searchObj:function(newval,oldval){
    //   console.log(newval);
    // }
  },
  computed:{
  //   showHide:function(h,params){
  //     if(this.showOrHide[params.index]==0){
  //       return h('div',[
  //         h('span',
  //         {style:{
  //           display:'inline-block',
  //           width:'95%',
  //           overflow:'hidden',
  //           textOverflow:'ellipsis',
  //           whiteSpace:'nowrap'
  //         }},params.row.optDesc),
  //         h('span',
  //           {
  //             attrs:{title:'展开'},
  //             on: {'click':() => {
  //                 this.showOrHide[params.index]++;
  //               }
  //             }
  //           },'>')
  //       ])
  //     }else if(this.showOrHide[params.index]==1){
  //       return h('div',[
  //         h('span',params.row.optDesc),
  //         h('span',
  //           {
  //             attrs:{title:'收起'},
  //             on: {'click':() => {
  //                 this.showOrHide[params.index]--;
  //               }
  //             }
  //           },'<')
  //       ])
  //     }
  //   }
  },
  async mounted(){
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    await this.getStat();
    await this.getActionType();
    await this.getActionObj();
    await this.reflesh();
    // let res=await LogAxios.getActionLog();
    // this.tableData=res.data.list;
    // this.totalNum=res.data.list.length;
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
