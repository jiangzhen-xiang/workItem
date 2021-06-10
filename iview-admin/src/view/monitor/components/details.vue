<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <Row class="task">
            <Col span="12">
              <b>任务连接</b>
              <br />
              <b>开始时间：</b>
              <span>{{ taskForm.startTime }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <b>运行时间：</b>
              <span>{{ taskForm.runTime }}</span>
            </Col>
            <Col span="12">
              <Button type="info" @click="backRunFunc" style="float:right;">返回</Button>
            </Col>
          </Row>
          <div class="flex" style="display:flex;">
            <div
              class="diagram"
              style="flex:1; border:solid 1px #ddd;border-radius:5px;margin-right:10px;"
            >
              <flowDetail :pipeline="drawData" />
            </div>
            <div
              class="flex-item"
              style="width:350px;border:solid 1px #ddd;border-radius:5px;margin-right:10px;padding:10px;"
            >
              <nodeDetail :pipeline="drawData" />
            </div>
          </div>

          <div class="wrapper" v-if="type === '1'">
            <Table :columns="tableTitle" :data="getTableData" border></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
            </div>
          </div>
          <div class="detailsTab" style="margin-top:20px;">
            <Tabs type="card" @on-click="tabChange">
              <TabPane label="血缘关系">
                <div id="echarts_1" style="width:100%; height:300px;"></div>
              </TabPane>
              <TabPane label="数据抽样">
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>
                <Table :columns="columnsOne" :data="dataTableData" border></Table>
              </TabPane>
              <TabPane label="failover">
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>
                <div id="echarts_3" style="width:100%; height:300px;"></div>
              </TabPane>
              <TabPane label="source输入">
                <i-select
                  placeholder="请选择source"
                  size="small"
                  style="width: 120px; float: left; margin-right: 10px;"
                >
                  <i-option
                    v-for="item in sourceList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.label }}</i-option>
                </i-select>
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>

                <div id="echarts_4" class style="width:100%; height:300px;"></div>
              </TabPane>
              <TabPane label="sink输出">
                <i-select
                  placeholder="请选择sink"
                  size="small"
                  style="width: 120px; float: left; margin-right: 10px;"
                >
                  <i-option
                    v-for="item in sinkList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.label }}</i-option>
                </i-select>
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>
                <Row>
                  <Col span="24">
                    <div id="echarts_5_1" style="width:100%; height:300px;"></div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane label="cpu使用率">
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>
                <div id="echarts_6" style="width:100%; height:300px;"></div>
              </TabPane>
              <TabPane label="延时">
                <Button type="primary" size="small" style="margin-bottom:10px;">
                  <Icon type="ios-ios-plus" />刷新
                </Button>
                <div id="echarts_7" style="width:100%; height:300px;"></div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="modal1"
      title="增加Pipeline"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change('formValidate')"
    >
      <div class="formWrapper">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="ppName">
            <Input v-model="formValidate.ppName" placeholder="请输入" />
          </FormItem>
          <FormItem label="状态" prop="ppStatus">
            <Select v-model="formValidate.ppStatus" placeholder="请选择">
              <Option value="beijing">启动中</Option>
              <Option value="shanghai">成功</Option>
              <Option value="shenzhen">失败</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import Peity from 'vue-peity'
import {
  ajaxGetSourceChartData,
  ajaxGetSinkChartData,

  ajaxGetMonitor
} from '@/api/monitor.js'
import flowDetail from '@/components/drawFlowPipeline/flowDetail'
import nodeDetail from '@/components/drawFlowPipeline/nodeDetail'
// import flowDetail from '@/view/pipeline/components/flowDetail'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'chart',
  data() {
    return {
      interVal: {
        source: 0,
        target: 0
      },
      tabFormart: ['', '', '', 'Four', 'Five', '', ''],
      data: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2, 5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
      sourceList: [
        {
          id: 1,
          label: 'source1'
        },
        {
          id: 2,
          label: 'source2'
        }
      ],
      sinkList: [
        {
          id: 1,
          label: 'sink1'
        },
        {
          id: 2,
          label: 'sink2'
        }
      ],
      runid: '',
      type: '',
      drawData: {},
      taskForm: {
        startTime: '2020-05-20',
        runTime: '2020-05-26'
      },
      exportLoading: false,
      current: 1,
      size: 10,
      tabCurrent: 1,
      tabSize: 10,
      columnsOne: [
        {
          title: 'name',
          key: 'name',
          eclipse: true,
          tooltip: true
        },
        {
          title: 'uid',
          key: 'uid',
          eclipse: true,
          tooltip: true
        },
        {
          title: 'grade',
          key: 'grade',
          eclipse: true,
          tooltip: true
        },
        {
          title: 'birth',
          key: 'birth',
          eclipse: true,
          tooltip: true
        }
      ],
      dataTableData: [
        {
          name: '张三',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        },
        {
          name: '李四',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        },
        {
          name: '王五',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        }
      ],
      tableTitle: [
        {
          title: '运行ID',
          key: 'RUNID'
        },
        {
          title: '名称',
          key: 'PIPELINENAME'
        },
        {
          title: '类型',
          key: 'PIPELINETYPE',
          width: '100'
        },
        {
          title: '开始时间',
          key: 'STARTTIME',
          width: '160'
        },
        {
          title: '持续时间',
          key: 'DURATION',
          width: '100'
        },
        {
          title: '状态',
          key: 'STATUS',
          width: '100'
        },
        {
          title: '运行集群',
          key: 'CLUSTER',
          width: '100'
        },
        {
          title: '异常',
          key: 'ERROR',
          width: '100'
        }
      ],
      tableData: [],
      modal1: false,
      formValidate: {
        ppName: '',
        mail: '',
        ppStatus: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        ppName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],

        ppStatus: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    pieData() {
      return this.data.toString()
    },
    getTableData() {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        let rule1 = index >= (this.current - 1) * this.size
        let rule2 = index < this.current * this.size

        return rule1 && rule2
      })
      return arr
    }
  },
  components: {
    nodeDetail,
    flowDetail,
    Peity
  },
  methods: {
    tabChange(item) {
      let that = this
      this.handleClearInterval()

      this['echartsFunc' + that.tabFormart[item]] && (
        this['echartsFunc' + that.tabFormart[item]]())
    },
    handleClearInterval() {
      let that = this
      for (let k in this.interVal) {
        clearInterval(that.interVal[k])
      }
    },
    getDrawData() {
      let postData = {}
      postData.documentId = this.runid
      ajaxGetMonitor(postData).then(res => {
        if (res.data.status == 'ok') {
          let arr = JSON.parse(res.data.data.result_content)
          let pipeline = JSON.parse(arr.draw_code)
          this.drawData = pipeline
        }
      })
    },
    backRunFunc() {
      this.$router.push({
        path: 'run'
      })
    },
    pageChange(val) {
      this.current = +val
    },
    tabPageChange(val) {
      this.tabCurrent = +val
    },
    change(name) {
      // this.handleReset(name);
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    modelShow(k) {
      this[k] = true
    },
    getFormData() {
      let postData = {
        ppName: '',
        ppStatus: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()

      this.tableData.push(postData)
      this.handleReset('formValidate')
    },
    cancel() {
      this.handleReset('formValidate')
    },
    echartsFuncOne() {
      let myEchartsOne = this.$echarts.init(
        document.getElementById('echarts_1')
      )
      let colors = ['#9C27B0', '#FF4081']

      let datas = [
        {
          name: 'kafka_topic_1'
        },
        {
          name: 'Hbase_table_1'
        },
        {
          name: 'kafka_topic_2'
        }
      ]

      for (let i = 0; i < datas.length; i++) {
        if (i === 0) {
          datas[i].itemStyle = {
            normal: {
              color: colors[0]
            }
          }
        } else {
          datas[i].itemStyle = {
            normal: {
              color: colors[1]
            }
          }
        }
      }
      let optionOne = {
        animationEasingUpdate: 'quinticInOut',
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12
            }
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            symbolSize: 80,
            focusNodeAdjacency: true,
            roam: true,
            draggable: false,
            force: {
              repulsion: 2000,
              layoutAnimation: false
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12
                }
              }
            },
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1
              },
              emphasis: {
                color: '#ec407a'
              }
            },
            data: datas,
            links: [
              {
                source: 0,
                target: 1
              },
              {
                source: 0,
                target: 2
              },
              {
                source: 0,
                target: 3
              }
            ]
          }
        ]
      }
      myEchartsOne.setOption(optionOne)
    },
    // echartsFuncTwo () {
    //   let myEchartsTwo = this.$echarts.init(
    //     document.getElementById('echarts_2')
    //   )
    //   let optionTwo = {
    //     tooltip: {},
    //     animationDurationUpdate: 1500,
    //     animationEasingUpdate: 'quinticInOut',
    //     series: [
    //       {
    //         type: 'graph',
    //         layout: 'none',
    //         symbolSize: 50,
    //         roam: true,
    //         label: {
    //           show: true
    //         },
    //         edgeSymbol: ['circle', 'arrow'],
    //         edgeSymbolSize: [4, 10],
    //         edgeLabel: {
    //           fontSize: 20
    //         },
    //         data: [{
    //           name: '节点1',
    //           x: 300,
    //           y: 300
    //         }, {
    //           name: '节点2',
    //           x: 800,
    //           y: 300
    //         }, {
    //           name: '节点3',
    //           x: 550,
    //           y: 100
    //         }, {
    //           name: '节点4',
    //           x: 550,
    //           y: 500
    //         }],
    //         // links: [],
    //         links: [{
    //           source: 0,
    //           target: 1,
    //           symbolSize: [5, 20],
    //           label: {
    //             show: true
    //           },
    //           lineStyle: {
    //             width: 5,
    //             curveness: 0.2
    //           }
    //         }, {
    //           source: '节点2',
    //           target: '节点1',
    //           label: {
    //             show: true
    //           },
    //           lineStyle: {
    //             curveness: 0.2
    //           }
    //         }, {
    //           source: '节点1',
    //           target: '节点3'
    //         }, {
    //           source: '节点2',
    //           target: '节点3'
    //         }, {
    //           source: '节点2',
    //           target: '节点4'
    //         }, {
    //           source: '节点1',
    //           target: '节点4'
    //         }],
    //         lineStyle: {
    //           opacity: 0.9,
    //           width: 2,
    //           curveness: 0
    //         }
    //       }
    //     ]
    //   }
    //   myEchartsTwo.setOption(optionTwo)
    // },
    echartsFuncThree() {
      let threeOption = {
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          nameRotate: 45
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: 'cpu',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [12, 23, 54, 23, 64, 23, 23],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      }
      let myThreeChart = this.$echarts.init(
        document.getElementById('echarts_3')
      )
      myThreeChart.setOption(threeOption)
    },

    echartsFuncFour() {
      let that = this
      let postData = {}
      postData.documentId = this.runid
      let myFiveAChart
      let five_1_Option = {
        title: {
          text: '记录数',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          axisTick: {
            // show: false

          },
          axisLabel: {
            // show: false
            showMaxLabel: true

          }

        },
        grid: {
          left: 80,
          right: 30,
          bottom: 20,
          top: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [{
          name: '数据总量（条）',
          nameLocation: 'end',
          type: 'value',
          axisTick: {
            show: false
          }
        },
        {
          name: '速率（条）',
          nameLocation: 'end',
          type: 'value'
        }],
        series: [
          {
            name: '数据处理总条数',

            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#0e8bcb',
                  width: 2
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#c7dafc' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0e8bcb' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '数据处理速度',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#0e8bcb',
                  width: 2
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#c7dafc' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0e8bcb' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            type: 'line',
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      }
      ajaxGetSourceChartData(postData).then(res => {
        if (res.data.status == 'ok') {
          let xArr = []
          let yArr = []
          let yArr1 = []
          if (res.data && res.data.data && res.data.data.source_value) {
            res.data.data.source_value.map(item => {
              let dd = that.$timeFormat(Object.keys(item)[0]).substring(11, 16)
              xArr.unshift(dd)
              yArr.unshift(item[Object.keys(item)[0]])
            })
            res.data.data.source_rate.map(item => {
              yArr1.unshift(item[Object.keys(item)[0]])
            })
            five_1_Option.xAxis.data = xArr.map((item, idx) => {
              return (
                ((idx % 6 == 0) ||
                  idx == 0 ||
                  (idx == xArr.length - 1)
                  ? item : ''))
            })
            five_1_Option.series[0].data = [].concat(yArr)
            five_1_Option.series[1].data = [].concat(yArr1)
            if (
              document
                .getElementById('echarts_4')
                .getElementsByTagName('canvas').length
            ) {
              myFiveAChart.setOption(five_1_Option)
            } else {
              myFiveAChart = this.$echarts.init(
                document.getElementById('echarts_4')
              )
              myFiveAChart.setOption(five_1_Option)
            }
          }
          that.interVal.source = setInterval(() => {
            that.loopSetFuncFour(postData, five_1_Option, myFiveAChart)
          }, 1 * 1000)
        }
      })
    },
    loopSetFuncFour(postData, five_1_Option, myFiveAChart) {
      let that = this
      ajaxGetSourceChartData(postData).then(res => {
        if (res.data.status == 'ok') {
          let xArr = []
          let yArr = []
          let yArr1 = []
          if (res.data && res.data.data && res.data.data.source_value) {
            res.data.data.source_value.map(item => {
              let dd = that.$timeFormat(Object.keys(item)[0]).substring(11, 16)
              xArr.unshift(dd)
              yArr.unshift(item[Object.keys(item)[0]])
            })
            res.data.data.source_rate.map(item => {
              let dd = that.$timeFormat(Object.keys(item)[0]).substring(11, 16)
              yArr1.unshift(item[Object.keys(item)[0]])
            })
            five_1_Option.xAxis.data = xArr.map((item, idx) => {
              return (
                ((idx % 6 == 0) ||
                  idx == 0 ||
                  (idx == xArr.length - 1)
                  ? item : ''))
            })
            five_1_Option.series[0].data = yArr
            five_1_Option.series[1].data = yArr1
            if (
              document
                .getElementById('echarts_4')
                .getElementsByTagName('canvas').length
            ) {
              myFiveAChart.setOption(five_1_Option)
            } else {
              myFiveAChart = this.$echarts.init(
                document.getElementById('echarts_4')
              )
              myFiveAChart.setOption(five_1_Option)
            }
          }
        }
      })
    },
    echartsFuncFive() {
      let that = this
      let postData = {}
      postData.documentId = this.runid
      let myFiveAChart
      let five_1_Option = {
        title: {
          text: '记录数',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          axisTick: {
            // show: false

          },
          axisLabel: {
            // show: false
            showMaxLabel: true

          }

        },
        grid: {
          left: 80,
          right: 30,
          bottom: 20,
          top: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [{
          name: '数据总量（条）',
          nameLocation: 'end',
          type: 'value',
          axisTick: {
            show: false
          }
        },
        {
          name: '速率（条）',
          nameLocation: 'end',
          type: 'value'
        }],
        series: [
          {
            name: '数据处理总条数',

            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#0e8bcb',
                  width: 2
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#c7dafc' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0e8bcb' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '数据处理速率',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#0e8bcb',
                  width: 2
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#c7dafc' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0e8bcb' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      }
      ajaxGetSinkChartData(postData).then(res => {
        if (res.data.status == 'ok') {
          let xArr = []
          let yArr = []
          let yArr1 = []
          if (res.data && res.data.data && res.data.data.sink_value) {
            res.data.data.sink_value.map(item => {
              let dd = that.$timeFormat(Object.keys(item)[0]).substring(11, 16)
              xArr.unshift(dd)
              yArr.unshift(item[Object.keys(item)[0]])
            })
            res.data.data.sink_rate.map(item => {
              yArr1.unshift(item[Object.keys(item)[0]])
            })
            five_1_Option.xAxis.data = xArr.map((item, idx) => {
              return (
                ((idx % 6 == 0) ||
                  idx == 0 ||
                  (idx == xArr.length - 1)
                  ? item : ''))
            })
            five_1_Option.series[0].data = [].concat(yArr)
            five_1_Option.series[1].data = [].concat(yArr1)
            if (
              document
                .getElementById('echarts_5_1')
                .getElementsByTagName('canvas').length
            ) {
              myFiveAChart.setOption(five_1_Option)
            } else {
              myFiveAChart = this.$echarts.init(
                document.getElementById('echarts_5_1')
              )
              myFiveAChart.setOption(five_1_Option)
            }
          }
          that.interVal.source = setInterval(() => {
            that.loopSetFuncFive(postData, five_1_Option, myFiveAChart)
          }, 1 * 1000)
        }
      })
    },
    loopSetFuncFive(postData, five_1_Option, myFiveAChart) {
      let that = this
      ajaxGetSinkChartData(postData).then(res => {
        if (res.data.status == 'ok') {
          let xArr = []
          let yArr = []
          let yArr1 = []
          if (res.data && res.data.data && res.data.data.sink_value) {
            res.data.data.sink_value.map(item => {
              let dd = that.$timeFormat(Object.keys(item)[0]).substring(11, 16)
              xArr.unshift(dd)
              yArr.unshift(item[Object.keys(item)[0]])
            })
            res.data.data.sink_rate.map(item => {
              yArr1.unshift(item[Object.keys(item)[0]])
            })
            five_1_Option.xAxis.data = xArr.map((item, idx) => {
              return (
                ((idx % 6 == 0) ||
                  idx == 0 ||
                  (idx == xArr.length - 1)
                  ? item : ''))
            })
            five_1_Option.series[0].data = yArr
            five_1_Option.series[1].data = yArr1
            if (
              document
                .getElementById('echarts_5_1')
                .getElementsByTagName('canvas').length
            ) {
              myFiveAChart.setOption(five_1_Option)
            } else {
              myFiveAChart = this.$echarts.init(
                document.getElementById('echarts_5_1')
              )
              myFiveAChart.setOption(five_1_Option)
            }
          }
        }
      })
    },
    echartsFuncSix() {
      let sixOption = {
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '开始时间',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [12, 23, 54, 23, 64, 23, 23],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      }
      let mySixChart = this.$echarts.init(document.getElementById('echarts_6'))
      mySixChart.setOption(sixOption)
    },
    echartsFuncSeven() {
      let sevenOption = {
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          name: '单位（s）'
        },
        legend: {
          left: 'center',
          data: ['业务延时', '滞留延时']
        },
        series: [
          {
            name: '业务延时',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [12, 23, 54, 23, 64, 23, 23],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '滞留延时',
            itemStyle: {
              normal: {
                color: '#67C23A',
                lineStyle: {
                  color: '#67C23A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            // data: this.successLine,
            data: [15, 18, 24, 17, 14, 33, 3],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      }
      let mySevenChart = this.$echarts.init(
        document.getElementById('echarts_7')
      )
      mySevenChart.setOption(sevenOption)
    },
    init() {
      let option = {
        backgroundColor: '#fff',
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 100,
            roam: true,
            label: {
              show: true,
              position: 'top'
            },
            symbol: (a, b) => {
              console.log('aaaaa====', a, b, pie1)
              let img = 'image://'

              console.log('img====', b.data.img)
              switch (b.data.img) {
                case 2:
                  img += pie2
                  break
                case 3:
                  img += pie3
                  break
                default:
                  img += pie1
                  break
              }
              return img
            },
            edgeSymbol: ['circle'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: 'Kafka Topic-A',
                img: 1,
                x: 10,
                y: 250
              },
              {
                name: '1',
                img: 2,
                x: 150,
                y: 250,
                label: {
                  show: false,
                  position: 'top'
                }
              },
              {
                name: 'HBase Table-B ',
                img: 3,
                x: 290,
                y: 250
              }
            ],
            // links: [],
            links: [
              {
                source: 'Kafka Topic-A',
                target: '1'
              },
              {
                source: '1',
                target: 'HBase Table-B '
              }
            ],
            lineStyle: {
              color: '#23cdfd',
              opacity: 3.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      }
      let myChart = this.$echarts.init(
        document.getElementById('chartWarraper')
      )
      myChart.setOption(option)
    },
    exportExcel() {
      if (this.tableData.length) {
        this.exportLoading = true
        const params = {
          title: ['一级分类', '二级分类', '三级分类'],
          key: ['category1', 'category2', 'category3'],
          data: this.tableData,
          autoWidth: true,
          filename: '分类列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    }
  },
  activated() {
    this.runid = this.$route.query.id
    this.type = this.$route.query.type
  },
  destroyed() {
    this.runid = ''
    this.type = ''

    this.handleClearInterval()
  },
  mounted() {
    this.runid = this.$route.query.ruleId
    this.type = this.$route.query.type

    this.getDrawData()
    this.echartsFuncOne()
    this.echartsFuncThree()
    // this.echartsFuncFour()

    this.echartsFuncSix()
    this.echartsFuncSeven()
    // this.init();
  }
}
</script>
