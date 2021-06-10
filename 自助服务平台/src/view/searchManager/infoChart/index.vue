<template>
  <div class="chartPage" >
      <Row class="row">
          <i-col>
            <Form :label-width="10" inline class="form">
                <FormItem>
                  <Select placeholder="组件"  style="width: 100px" v-model="searchObj.component" >
                    <Option value="1" >HDFS</Option>
                    <Option value="3" >HIVE</Option>
                    <Option value="4" >HBASE</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Input type="text" style="width: 100px" placeholder="租户" v-model="searchObj.tenantUser" />
                </FormItem>
                <FormItem>
                  <DatePicker v-model="searchObj.date" type="date" placeholder="选择日期" ></DatePicker>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="searchApp">查询</Button>
                </FormItem>
            </Form>
          </i-col>
        </Row>
    <div id="main" style="width:600px;height:400px;transition:height 10s;" ></div>
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
          <template slot="action" slot-scope="{ index }" >
            <Button type="primary" size="small" @click="watchDeatil(index)">详情</Button>
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
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      msg: '',
      searchObj:{},
      data1:[820, 932, 301, 1434, 1290, 1330, 1320],
      tableData:[],
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
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 200,
          resizable:true
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
          title: "查看详情",
          slot:'action',
          align: "center",
          width: 100,
          resizable:true,
          fixed:'right'
        },
      ],
      loading:false,
      tableHeight:0,
      currentPage:1,
      pageSize:10,
      totalNum:0,
      option:{
        xAxis: {
            type: 'category',
            name:'星期',//单位
            boundaryGap: false, //与y轴是否留空隙
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine:{
                lineStyle:{
                    color:'black'  //设置x轴的颜色
                },
                // show:true,//去除轴线
            },
            axisLabel:{ //设置x轴数据旋转倾斜
                rotate:30, //旋转角度
                interval: 0,//x轴数据间隔几个显示一个
                // formatter:'{ category }(星期)'
                color:'gold',  //x轴字体颜色
                fontSize:"16"  //x轴字体大小
            },
            axisTick:{
                show:false,  //去除刻度线
                // alignWithLabel: true
            },
        },
        yAxis: {
            type: 'value',
            name:'天',
            max:'1500', //y轴最大值
            axisLabel:{ //设置y轴数据旋转倾斜
                formatter:'{value}(天)'
                // formatter: function (params) {
                //     params = params[0];
                //     var date = new Date(params.name);
                //     return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                // },
            },
            splitLine: {  //分割线
                lineStyle:{
                    color:"red"
                }
            }
        },
        series: [
            {
                name: '预期',
                // data:this.data1,
                data: [820, 932, 301, 1434, 1290, 1330, 1320],
                type: 'line',
                symbol:'circle', //设置拐点为实心圆 默认空心圆
                smooth: 0.5,// 设置折线弧度，取值：0-1之间
                color:'green',
            },
        ],
            title: {
                text: '折线图',      // 标题
                subtext: '模拟数据', // 次级标题
                x:'center',          //位置
                y:'top'
            },
            // 提示框
            tooltip: {
              trigger: 'axis' //出现竖线 触发方式
            },
            //图例组件 每条折线的表示
            legend: {
                orient:'horizontal', //每条折线的表示，水平或垂直vertical
                data:['预期','哈哈'], //标题与每条折线的name对应
                textStyle:{
                    color:'pink'  //文字颜色
                },
                x:'left', //位置
                // right:"60%",
            },
            // 工具箱
            toolbox:{
                feature:{
                    saveAsImage:{}, //下载图片
                },
                // dataZoom:{
                //     orient:"vertical", //水平显示
                //     show:true, //显示滚动条
                //     start:0, //起始值为20%
                //     end:100,  //结束值为60%
                // },
            },
            backgroundColor: '#FFF0F5', //整个图表的背景颜色
        },
    }
  },
  methods: {
    searchApp(){

    },
    watchDeatil(index){
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
    showChart(){
        var myChart = echarts.init(document.getElementById('main'));
        // 使用刚指定的配置项和数据显示图表。
        this.option.series[0].data=this.data1;
        myChart.setOption(this.option);
        myChart.on('click', function (params) {
            console.log(params);
        });
        myChart.on('click', {element: '预期'}, function (params) {
            // 当 name 为 'aaa' 的图形元素被点击时，此回调被触发。
            console.log("预期");
        });
    },
    drag() {
        var oDiv=document.getElementById("main");
        var disX=0,disY=0;
        oDiv.onmousedown=function(ev) {
           var oEvent=ev||event;
           disX=oEvent.clientX-oDiv.offsetLeft;
           disY=oEvent.clientY-oDiv.offsetTop;//保存物体以鼠标单击瞬间时的位置
           console.log(disX,disY);
               document.onmousemove=function(ev) {
                   var oEvent=ev||event;
                   var l=oEvent.clientX-disX;            
                   var t=oEvent.clientY-disY;
                   if(l<0)
                       l=0;
                   else if(l>document.documentElement.clientWidth-oDiv.offsetWidth)l=document.documentElement.clientWidth-oDiv.offsetWidth;
                   if(t<0)t=0;
                   else if(t>document.documentElement.clientHeight-oDiv.offsetHeight)
                    t=document.documentElement.clientHeight-oDiv.offsetHeight;
                    oDiv.style.left=l+'px';
                    oDiv.style.top=t+'px';    
                 };
                 document.onmouseup=function()　{
                     document.onmousemove=document.onmouseup=null;
                 };
                 return false;//解决ff早期的bug发生
        };
     }
  },
  watch:{
      'searchObj.component'(newVal){
          console.log(newVal);
          if(newVal==1){
              this.data1=[111,222,444,555,888,1111,333];
          }else if(newVal==3){
              this.data1=[500,200,400,500,800,1100,300];
          }else{
              this.data1=[820, 932, 301, 1434, 1290, 1330, 1320];
          }
          this.showChart();
      },
      currentPage:function(newval){
        this.pageChange(newval)
      },
      pageSize:function(newval){
        this.onPageSize(newval)
      },
  },
  computed:{
  },
  mounted(){
    this.showChart();
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    document.getElementById('pageInput').addEventListener('blur', (res) => {
    if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
      console.log(Number(res.target.value));
        this.currentPage = Number(res.target.value);
      }else{
        this.currentPage = 1;
      }
    })
  }
}
</script>

<style scoped>
.chartPage{
    padding:10px 20px 0;
}
#main{
    margin-bottom:20px;
}
</style>
