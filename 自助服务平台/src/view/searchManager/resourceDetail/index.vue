<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <!-- <div v-if="!isDeatil" style="float:left"> -->
            <FormItem>
              <Select placeholder="组件"  style="width: 100px" v-model="searchObj.component" >
                <Option value="1"  >hdfs</Option>
                <Option value="2"  >hive</Option>
                <Option value="3"  >hbase</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input type="text" style="width: 100px" placeholder="租户" v-model="searchObj.tenantUser" />
            </FormItem>
            <FormItem>
              <DatePicker v-model="searchObj.date" type="date" placeholder="选择日期"  ></DatePicker>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchApp">查询</Button>
            </FormItem>
          <!-- </div> -->
          <!-- <div v-else>
            <FormItem>
              <Button type="primary" @click="reflesh()">返回</Button>
            </FormItem>
          </div> -->
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
          <!-- <template slot="action" slot-scope="{ index }" >
            <Button type="primary" size="small" @click="watchDeatil(index)" :disabled="haveDetail" >详情</Button>
          </template> -->
      </Table>
      <!-- <Page
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
      /> -->
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import ajaxResource from '@/api/resourceInfo.js'
Vue.filter('dateFormat',function(date){
  return date>=10?date:'0'+date;
});
// Vue.filter('numberFormat',function(n){
//   let arr0=n.split(".");
//   let num=arr0[0];
//   let arr=[];
//   let str='';
//   for(let i=0;i<Math.ceil(num.length/3);i++){
//     if((num.length-3*i)>=3){
//       str=num.substr(((num.length-3*i)-3),3)
//     }else{
//       str=num.slice(0,num.length%3);
//     }
//     arr.unshift(str);
//   }
//   if(arr0[1]){
//     return arr.join(',')+"."+n.split(".")[1];
//   }else{
//     return arr.join(',');
//   }
// });
Vue.filter('numberFormat',function(d){
  if(!d){
    return "";
  }
  let num=String(Math.round(d));
  console.log(num);
  let str='';
  let n=num.length%3;
  console.log(n);
  for(let i=0;i<num.length;i++){
    str+=num.charAt(i);
    if(n==0){
      if((i+1)%3==0&&i!=(num.length-1)){
        str+=","
      }
    }else{
      if(i==n-1&&num.length>3){
        str+=","
      }
      if((i-n+1)%3==0&&(i-n+1)!=0&&i!=num.length-1){
        str+=","
      }
    }
  }
    return str;
});
export default {
  data: function() {
    return {
      // num:7,
      tableTitle: [
        {
          title:'序号',
          width: 80,
          align: 'center',
          fixed: 'left',
          resizable:true,
          render: (h, params) => {
            return h('span', params.index+1);
          }
        },
        {
          title: "租户",
          key: "user",
          align: "center",
          width: 200,
          resizable:true
        },
        {
          title: "已使用空间（单位G）",
          key: "userd",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](parseInt(params.row.userd)))
          }
        },
        {
          title: "总空间（单位G）",
          key: "total",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](params.row.total))
          }
          
        },
        {
          title: "剩余空间（单位G）",
          key: "free",
          align: "center",
          width: 300,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](parseInt(params.row.free)))
          }
        },
        {
          title: "已使用空间占比",
          key: "persent",
          align: "center",
          minWidth: 200,
          // resizable:true,
          // render:(h,params)=>{
          //   return h('div',this.$options.filters['numberFormat'](params.row.spaceQuota))
          // }
        },
        // {
        //   title: "hive已使用空间（单位G）",
        //   key: "hiveUserd",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        // //   render:(h,params)=>{
        // //     return h('div',this.$options.filters['numberFormat'](params.row.quota))
        // //   }
        // },
        // {
        //   title: "hive总空间（单位G）",
        //   key: "hiveTotal",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        // //   render:(h,params)=>{
        // //     return h('div',this.$options.filters['numberFormat'](params.row.remQuota))
        // //   }
        // },
        // {
        //   title: "hive剩余空间（单位G）",
        //   key: "hiveFree",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   // render:(h,params)=>{
        //   //   return h('div',this.$options.filters['numberFormat'](params.row.spaceQuota))
        //   // }
        // },
        // {
        //   title: "hive已使用空间占比",
        //   key: "hivePersent",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   // render:(h,params)=>{
        //   //   return h('div',this.$options.filters['numberFormat'](params.row.spaceQuota))
        //   // }
        // },
        //  {
        //   title: "hbase已使用空间（单位G）",
        //   key: "hbaseUsed",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        // //   render:(h,params)=>{
        // //     return h('div',this.$options.filters['numberFormat'](params.row.quota))
        // //   }
        // },
        // {
        //   title: "剩余可用配额（多副本 单位G）",
        //   key: "remSpaceQuota",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.remSpaceQuota))
        //   }
        // },
        // {
        //   title: "目录数量",
        //   key: "dirCount",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.dirCount))
        //   }
        // },
        // {
        //   title: "文件数量",
        //   key: "fileCount",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.fileCount))
        //   }
        // },
        // {
        //   title: "文件大小（多副本 单位G）",
        //   key: "contentSize",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.contentSize))
        //   }
        // },
        // {
        //   title: "路径",
        //   key: "pathName",
        //   align: "center",
        //   width: 150,
        //   resizable:true,
        //   tooltip:true,
        // },
        // {
        //   title:"日期",
        //   key:'date',
        //   align: "center",
        //   minWidth: 150,
        //   // resizable:true,
        //   tooltip:true,
        //   // render:(h,params)=>{
        //   //   return h('div',this.tableData(params.index).year+"-"+this.tableData(params.index).month+"-"+this.tableData(params.index).day)
        //   // }
        // },
      ],
      tableTitle1: [
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
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 200,
          resizable:true
        },
        // {
        //   title: "配额",
        //   key: "quota",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.quota))
        //   }
        // },
        // {
        //   title: "剩余可用配额",
        //   key: "remQuota",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.remQuota))
        //   }
        // },
        // {
        //   title: "总配额（多副本 单位G）",
        //   key: "spaceQuota",
        //   align: "center",
        //   width: 200,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.spaceQuota))
        //   }
        // },
        // {
        //   title: "剩余可用配额（多副本 单位G）",
        //   key: "remSpaceQuota",
        //   align: "center",
        //   width: 200,
        //   tooltip:true,
        //   resizable:true,
        //   render:(h,params)=>{
        //     return h('div',this.$options.filters['numberFormat'](params.row.remSpaceQuota))
        //   }
        // },
        {
          title: "目录数量",
          key: "dirCount",
          align: "center",
          width: 200,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](params.row.dirCount))
          }
        },
        {
          title: "文件数量",
          key: "fileCount",
          align: "center",
          width: 200,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](params.row.fileCount))
          }
        },
        {
          title: "文件大小（多副本 单位G）",
          key: "contentSize",
          align: "center",
          width: 220,
          resizable:true,
          render:(h,params)=>{
            return h('div',this.$options.filters['numberFormat'](params.row.contentSize))
          }
        },
        {
          title: "路径",
          key: "pathName",
          align: "center",
          width: 150,
          resizable:true,
          tooltip:true,
        },
        {
          title:"日期",
          key:'date',
          align: "center",
          minWidth: 150,
          // resizable:true,
          tooltip:true,
          // render:(h,params)=>{
          //   return h('div',this.tableData(params.index).year+"-"+this.tableData(params.index).month+"-"+this.tableData(params.index).day)
          // }
        },
        // {
        //   title: "年",
        //   key: "year",
        //   align: "center",
        //   width: 100,
        //   resizable:true
        // },
        // {
        //   title: "月",
        //   key: "month",
        //   align: "center",
        //   width: 100,
        //   resizable:true
        // },
        // {
        //   title: "日",
        //   key: "day",
        //   align: "center",
        //   width: 100,
        //   resizable:true
        // },
        {
          title: "查看详情",
          slot:'action',
          align: "center",
          width: 100,
          resizable:true,
          fixed:'right'
        },
      ],
      tableData: [],
      // totalNum:0,
      pageSize:200, //每页几条数据
      currentPage:1,
      searchObj:{
        date:new Date(new Date().getTime() - 24*60*60*1000),
        component:"1"
      },
      // days:[31,28,31,30,31,30,31,31,30,31,30,31],
      loading:false,
      tableHeight:0,
      // haveDetail:false,
      // componentDetail:1,
      // isDeatil:false,
      idx:-1,
      timer:null,
      num:0,
      tip:'数据努力加载中，请稍候',
    }
  },
  methods: {
    // 查询
    async searchApp(){
      this.num=0;
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
      // console.log(111);
      // this.componentDetail=this.searchObj.component;
      // this.isDeatil=false;
      // if(this.searchObj.component=="1"){
      //   this.haveDetail=true;
      // }else{
      //   this.haveDetail=false;
      // }
      let year,month,day;
      if(this.searchObj.date){
        year=this.searchObj.date.getFullYear();
        month=this.searchObj.date.getMonth()+1;
        day=this.searchObj.date.getDate();
      }else{
        year="";
        month="";
        day="";
      }
      // this.loading=true;
      let req=await ajaxResource.getResource({
        "component":this.searchObj.component,          
        "user": this.searchObj.tenantUser, 
        "currentDate":month!=""?String(year)+"-"+String(this.$options.filters['dateFormat'](month))+"-"+String(this.$options.filters['dateFormat'](day)):"",             
        // "year": String(year),         
        // "month":month!=""?String(this.$options.filters['dateFormat'](month)):"",             
        // "day":day!=""?String(this.$options.filters['dateFormat'](day)):"",                           
        // "pageNum": this.currentPage,
        // "pageSize": this.pageSize,
        "userName":sessionStorage.getItem("userName")?sessionStorage.getItem("userName"):""
      })
      console.log(req);
      if(req.data.code==1){
        // this.loading=false;
        this.$Spin.hide();
        this.tableData=req.data.list;
        // this.totalNum=this.tableData.length;
        this.$Message.success(req.data.message)
      }else{
        this.$Message.error(req.data.message)
      }
    //  this.timer=null;
    },
    // searchA(){
    //   this.$fangdou(this.searchApp,3000)();
    // },
    // 查看详情
    // async watchDeatil(index){
    //   this.loading=true;
    //   this.idx=index;
    //   let req=await ajaxResource.getResourceDetail({
    //     "component":this.componentDetail,          
    //     "tenantUser": this.tableData[index].tenantUser,               
    //     "year": String(this.tableData[index].year),         
    //     "month":String(this.tableData[index].month),             
    //     "day":String(this.tableData[index].day),                           
    //     "pageNum": this.currentPage,
    //     "pageSize": this.pageSize,
    //   });
    //   if(req.data.code==1){
    //     this.isDeatil=true;
    //     this.haveDetail=true;
    //     this.loading=false;
    //     this.tableData=req.data.data;
        // this.totalNum=req.data.total;
    //   }
    // },
    // 换页
    // pageChange(val){
    //   console.log(val);
    //   this.currentPage=val;
      // if(!this.isDeatil){
      //   this.reflesh();
      // }else{
      //   this.watchDeatil(this.idx);
      // }
    // },
    // 每页条数改变
    // onPageSize(val){
    //   console.log(val);
    //   this.pageSize=val;
      // if(!this.isDeatil){
      //   this.reflesh();
      // }else{
      //   this.watchDeatil(this.idx);
      // }
    // },
    // 调用接口数据获取数据
    async reflesh(){
      // this.loading=true;
      this.tip="数据努力加载中，请稍候";
      this.handleSpinCustom();
      this.num=0;
      this.timer=setInterval(()=>{
        this.num++;
        // console.log(this.num);
        if(this.num==10){
          clearInterval(this.timer);
          this.num=0;
          this.tip="加载失败,请刷新重试";
        }
      },1000);
      // this.isDeatil=false;
      // this.componentDetail=this.searchObj.component;
      // if(this.searchObj.component=="1"){
      //   this.haveDetail=true;
      // }else{
      //   this.haveDetail=false;
      // }
      let year,month,day;
      if(this.searchObj.date){
        year=this.searchObj.date.getFullYear();
        month=this.searchObj.date.getMonth()+1;
        day=this.searchObj.date.getDate();
      }else{
        year="";
        month="";
        day="";
      }
      let req=await ajaxResource.getResource({
        "component":this.searchObj.component,          
        "user": this.searchObj.tenantUser,
        "currentDate":month!=""?String(year)+"-"+String(this.$options.filters['dateFormat'](month))+"-"+String(this.$options.filters['dateFormat'](day)):"",                
        // "year": String(year),         
        // "month":month!=""?String(this.$options.filters['dateFormat'](month)):"",
        // "day":day!=""?String(this.$options.filters['dateFormat'](day)):"",                           
        // "pageNum": this.currentPage,
        // "pageSize": this.pageSize,
        "userName":sessionStorage.getItem("userName")?sessionStorage.getItem("userName"):""
      })
      // console.log(req);
      if(req.data.code==1){
        // this.loading=false;
        this.$Spin.hide();
        this.tableData=req.data.list;
        // this.totalNum=this.tableData.length;
      }
    },
    async getStat(){
    //   let req=await applyAxios.getApplyStat();
    //   console.log(req,"状态列表");
    //   this.stat=req.data;
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
    },
     // 全局加载中
    handleSpinCustom () {
      this.$Spin.show({
          render: (h) => {
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
    // currentPage:function(newval){
    //   this.pageChange(newval)
    //   // this.reflesh();
    // },
    // pageSize:function(newval){
    //   this.onPageSize(newval)
    //   // this.reflesh();
    // },
    tip:function(newVal){
      if(newVal=="加载失败,请刷新重试"){
        // console.log("haha");
        document.getElementsByClassName('ivu-spin-fullscreen')[0].addEventListener('click',()=>{
            this.$Spin.hide();
        })
      }
    }
  },
  mounted(){
    // console.log('12334354356345');
    // console.log(this.$options.filters['numberFormat']('23343543563153634.12'));
    this.reflesh();
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    // document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    // document.getElementById('pageInput').addEventListener('blur', (res) => {
    // if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
    //   console.log(Number(res.target.value));
    //     this.currentPage = Number(res.target.value);
    //   }else{
    //     this.currentPage = 1;
    //   }
    // })
  },
  created(){
  },
}
</script>

<style lang='less' scoped>
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
