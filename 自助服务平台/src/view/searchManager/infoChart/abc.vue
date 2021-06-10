<template>
  <div>
      <div id="main" style="width: 600px;height:500px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      msg: ''
    }
  },
  methods: {
  },
  mounted(){
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
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
                //     return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.       getFullYear() + ' : ' + params.value[1];
                // },
            },
            splitLine: {  //分割线
                lineStyle:{
                    color:"red"
                }
            }
        },
        series: [
            // {
            //     name:'哈哈',
            //     data: [820, 932, 901, 934, 1290, 1330, 1320], //图例数据
            //     type: 'line',  //图例类型
            //     // areaStyle: {} //折线与X轴面积区域样式
            //     color:'red',
            //     symbolSize:20, //设置折线上圆点的大小
            //     symbol:'circle', //设置拐点为实心圆 默认空心圆
            //     smooth: 0.5,// 设置折线弧度，取值：0-1之间
            //     itemStyle:{
            //         barBorderRadius:[5,5,5,5],
            //         normal:{
            //             label:{
            //                 show:true  //拐点上显示数值
            //             },
            //             borderColor:'yellow', //拐点的边框颜色
            //             lineStyle:{
            //                 width:5,   //折线宽度
            //                 type:'dotted', //折线样式类型：dotted--虚线，solid--实线
            //                 // color: 'rgba(0,0,0,0)' //设置透明度隐藏折线
            //             }
            //         }
            //     }
            // },
            {
                name: '预期',
                data: [820, 932, 301, 1434, 1290, 1330, 1320],
                type: 'line',
                symbol:'circle', //设置拐点为实心圆 默认空心圆
                // 设置小圆点消失
                // 注意：设置symbol: 'none'以后，拐点不存在了，设置拐点上显示数值无效
                // symbol: 'none',
                smooth: 0.5,// 设置折线弧度，取值：0-1之间
                color:'green',
                markPoint: {
                    data: [
                        {name: '最低预期', value: 301}
                    ]
                },
            },
            {
                name:'最高气温',
                type:'line',
                data:[811, 911, 815, 1013, 1112, 1413, 1210],
                itemStyle : { normal: {
                    label : {show: true,color:'white',backgroundColor:'black'}

                }},
                markPoint: { //设置最大值最小值
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: { //设置平均值
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
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
        // 距离边框的距离
        grid:{
            top:'30%',
            left:'20%',
            containLabel: true,//是否显示刻度标签
            show:true,//是否显示网格
            borderColor: "green",
        },
        // 工具箱
        toolbox:{
            feature:{
                saveAsImage:{}, //下载图片
            }
        },
        backgroundColor: '#FFF0F5', //整个图表的背景颜色
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) {
        console.log(params);
    });
    myChart.on('click', {element: '预期'}, function (params) {
        // 当 name 为 'aaa' 的图形元素被点击时，此回调被触发。
        console.log("预期");
    });
  },
}
// javaScript设计模式研究
// 设计原则
    // 1.单一职责原则：一个对象或方法只做一件事，如果一个方法承担了过多的职责，那么在需求变迁的过程中，需要改动这个方法的可能性就越大，应该把对象或方法划分成较小的粒度
    // 2.最少知识原则：一个软件实体应当尽可能少地与其他实体发生相互作用，应当尽量减少对象之间的交互。如果两个对象之间不必彼此之间直接通信，那么这两个对象就不要发生直接的相互联系，可以转交给第三方进行处理
    // 3.开放--封闭原则：软件实体应当是可以扩展的，但是不可修改，当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，尽量避免修改程序的源代码，防止影响系统的稳定
  // 一、工厂模式：定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类，该模式使一个类的实例化延伸到了子类，而子类可以重写接口方法以便创建的时候可以指定自己的对象类型
//   晚饭：三个菜 1.炖羊肉 2.西红柿炒鸡蛋 3.炒青菜
</script>

<style scoped>

</style>
