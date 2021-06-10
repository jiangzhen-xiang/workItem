
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div>
    <!-- <Row class="margin-top-10"
         :gutter="8">
      <i-col span="24">
        <Card> -->
          <!-- <p slot="title"
             style="padding:20px 0;">
            <Form ref="formSearch"
                  :model="formSearch"
                  :rules="ruleValidate"
                  inline>
              <FormItem prop="name">
                <Input v-model="formSearch.name"
                      placeholder="主题名称"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary"
                        @click="handleSubmitSearch('formSearch')">查询</Button>
              </FormItem>
            </Form>
          </p> -->
          <!-- <div style="padding:20px 0;">
            <Input v-model="formSearch.name"
                   placeholder="主题名称"
                   style="width:20%;margin-right:20px;" />
            <Button type="primary"
                    @click="handleSubmitSearch('formSearch')">查询</Button>
          </div>
          <div class="wrapper">
            <Table :loading="loading"
                   :columns="tableTitle"
                   tooltip-theme="dark"
                   :data="tableData"
                   border
                   :height="tableHeight"> -->
              <!-- <template slot-scope="{ row,index }"
                        slot="name">
                <Tooltip :content="row.name"
                         placement="top-start">
                  <Button type="text"
                          @click="handleGoEnv(row)">{{row.name}}</Button>
                </Tooltip>
              </template>
              <template slot-scope="{ row }"
                        slot="environment">
                <Select v-model="row.defaultEnv"
                        prop="defaultEnv"
                        transfer
                        placeholder="环境"
                        transfer
                        size="small">
                  <Option v-for="(item,index) in row.envVOList"
                          :value="item.id.toString()"
                          :label="item.name">{{item.name}} </Option>
                </Select>
              </template> -->
              <!-- <template slot-scope="{ row }"
                        slot="retentionMs">
                <span><span class=""
                        style="color:#19be6b">{{ getTime(row)}}</span>(秒)</span>
              </template>
              <template slot-scope="{ row,index }"
                        slot="action">
                <Dropdown @on-click="handleDropdownMenu(row,$event)"
                          transfer>
                  <a href="javascript:void(0)">
                    操作
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="Analysis">
                      <div style="color:#2db7f5">
                        <Icon type="ios-analytics-outline" /> 统计分析
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Group">
                      <div style="color:#19be6b">
                        <Icon type="logo-buffer" /> 查看Group
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Warrant">
                      <div style="">
                        <Icon type="ios-git-branch" /> 查看授权
                      </div>
                    </DropdownItem>

                  </DropdownMenu>
                </Dropdown>
              </template>
            </Table>
            <div class="page"
                 style="text-align:right;padding-top:10px;">
              <Page :total="total"
                    show-total
                    show-elevator
                    :current="current"
                    :page-size="pageSize"
                    size="small"
                    @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal v-model="modalColony"
           title="增加主题"
           footer-hide>
      <div class="formWrapper">
        <colonyForm @handleSuccess="handleColonyAdd"
                    :index="index"
                    @handleCancel="handleCancel" />
      </div>
    </Modal>
    <Modal v-model="modalEditorColony"
           title="编辑主题"
           footer-hide>
      <div class="formWrapper">
        <colonyEditorForm ref="colonyEditorForm"
                          @handleSuccess="handleColonyEditor"
                          :row="curCluster"
                          @handleCancel="handleCancel" />
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment"
           title="增加环境"
           footer-hide>
      <div class="formWrapper">
        <rowenvironmentForm @handleSuccess="handleRowEnvironmentAdd"
                            @handleCancel="handleCancel"
                            :index="index"
                            :curColony="curColony" />
      </div>
    </Modal>
      <Modal v-model="modalLook" 
           :title="lookTitle"
           footer-hide
           width="80%">
      <div class="formWrapper">
        <commonTable @firePageChange="handlePageChange"
                     :tableTitle="lookTableColumn"
                     :tableData="lookTableData"
                     :postData="paramPostData"
                     :total="pageTotal" />
      </div>
    </Modal>
    <Modal v-model="modalChart"
           :title="lookTitle"
           footer-hide
           width="80%">
      <div class="formWrapper">
        <Card v-for="(item,index) in chartList">
          <p slot="title">
            <Icon type="ios-analytics" />
            {{item.group}}
          </p>
          <p>
            <commonChart :ref="'commonChart_'+item.group"
                         :option="item.optionData" />
          </p>

        </Card>

      </div>
    </Modal> -->
    <router-view></router-view>
  </div>
</template>
<script>
// import excel from '@/libs/excel'
// import colonyForm from './components/colonyForm'
// import colonyEditorForm from './components/colonyEditorForm'
// import rowenvironmentForm from './components/rowEnvironmentForm'
// import { ajaxGetTopic, ajaxGetTopicByGroup, ajaxGetWarrantByTopic, ajaxGetGroupByTopic, ajaxGetAnalysisByTopic } from '@/api/datametaCluster.js'
// import commonTable from '@/common/commonTable'
// import commonChart from '@/common/commonChart'

// export default {
//   name: 'topic',
//   data () {
//     return {
//       value1: 'index_0',
//       chartList: [],
//       modalChart: false,
      // modalLook: false,
//       optionData: {},
//       paramPostData: {
//         handleSearch: '', // 方法名
//         conditionSearch: {}

//       },
//       pageTotal: 0,
//       lookTitle: '',
//       lookTableColumn: [],
//       lookTableData: [],
//       lookTableTitleObj: {
//         group: [
//           {
//             title: '序号',
//             width: 60,
//             align: 'center',
//             render: (h, params) => {
//               return h(
//                 'span',
//                 +params.index + 1 + (this.current - 1) * this.size
//               )
//             }
//           },
//           {
//             title: 'GroupId',
//             key: 'name',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '对应topic',
//             key: 'topicName',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true,
//             slot: 'topicName'
//           },
//           {
//             title: '集群',
//             key: 'cluster',
//             minWidth: 80,
//             eclipse: true,
//             tooltip: true

//           },
//           {
//             title: '状态',
//             key: 'state',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true

//           }
//         ],
//         topic: [
//           {
//             title: '序号',
//             width: 60,
//             align: 'center',
//             render: (h, params) => {
//               return h(
//                 'span',
//                 +params.index + 1 + (this.current - 1) * this.size
//               )
//             }
//           },
//           {
//             title: '名称',
//             key: 'name',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '所属集群',
//             key: 'cluster',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '分区数',
//             key: 'partitionCount',
//             minWidth: 80,
//             eclipse: true,
//             tooltip: true

//           },
//           {
//             title: '备份数',
//             key: 'replicateCount',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true

//           }
//         ],
//         warrant: [
//           {
//             title: '序号',
//             width: 60,
//             align: 'center',
//             render: (h, params) => {
//               return h(
//                 'span',
//                 +params.index + 1 + (this.current - 1) * this.size
//               )
//             }
//           },
//           {
//             title: '用户名',
//             key: 'name',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '所属集群',
//             key: 'cluster',
//             minWidth: 160,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '所属组件',
//             key: 'type',
//             minWidth: 80,
//             eclipse: true,
//             tooltip: true

//           },
//           {
//             title: '所属主题',
//             key: 'topic',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '所属组件',
//             key: 'group',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '授权',
//             key: 'aclOperation',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true
//           },
//           {
//             title: '授权类别',
//             key: 'aclPermissionType',
//             minWidth: 100,
//             eclipse: true,
//             tooltip: true
//           }

//         ]
//       },
//       //= ============弹窗组件=================

//       total: 0,
//       value4: false,
//       index: 0,
//       titleValue4: '',
//       curColony: '',
//       modalColony: false,
//       modalEditorColony: false,
//       curCluster: {},

//       modalRowEnvironment: false,
//       tableHeight: 0,
//       formSearch: {
//         type: '',
//         colony: ''

//       },
//       formValidate: {

//       },
//       curModal: '',
//       curModalEditor: '',
//       queryArr: [
//         {
//           name: 'kafka',
//           icon: 'kafka',
//           background: 'f5bc08'
//         }
//       ],
//       fileDbArr: [
//         {
//           name: 'hive',
//           icon: 'hive',
//           background: 'ce634e'
//         },
//         {
//           name: 'hbase',
//           icon: 'hbase',
//           background: 'ce634e'
//         }
//       ],
//       value3: false,
//       styles: {
//         height: 'calc(100% - 55px)',
//         overflow: 'auto',
//         paddingBottom: '53px',
//         position: 'static'
//       },
//       loading: false,
//       current: 1,
//       pageSize: 10,
//       size: 10,
//       tableTitle: [
//         {
//           // type: "index",
//           title: '序号',
//           width: 60,
//           align: 'center',
//           render: (h, params) => {
//             return h(
//               'span',
//               +params.index + 1 + (this.current - 1) * this.size
//             )
//           }
//         },
//         {
//           title: '名称',
//           key: 'name',
//           minWidth: 160,
//           eclipse: true,
//           tooltip: true

//         },
//         {
//           title: '所属集群',
//           key: 'cluster',
//           minWidth: 160,
//           eclipse: true,
//           tooltip: true

//         },
//         {
//           title: '分区数',
//           key: 'partitionCount',
//           minWidth: 80,
//           eclipse: true,
//           tooltip: true

//         },
//         {
//           title: '备份数',
//           key: 'replicateCount',
//           minWidth: 100,
//           eclipse: true,
//           tooltip: true

//         },
//         {
//           title: '保存时间',
//           key: 'retentionMs',
//           width: 160,
//           eclipse: true,
//           tooltip: true,
//           slot: 'retentionMs'
//         },
//         {
//           title: '操作',
//           key: 'action',
//           minWidth: 100,
//           slot: 'action'
//         }
//       ],

//       tableData: [
//       ],
//       modal1: false,
//       modal2: false,
//       false: false,
//       formValidate: {
//         colony: '',
//         type: '',
//         url: '',
//         username: '',
//         password: '',
//         isValidate: '',
//         validteType: '',
//         annotions: ''
//       },
//       ruleValidate: {
//         colony: [
//           {
//             required: true,
//             message: '名称不能为空',
//             trigger: 'blur'
//           }
//         ],
//         type: [
//           {
//             required: true,
//             message: '状态不能为空',
//             trigger: 'change'
//           }
//         ],

//         url: [
//           {
//             required: true,
//             message: 'url不能为空',
//             trigger: 'blur'
//           }
//         ]
//       }
//     }
//   },
//   components: {
//     commonChart,
//     commonTable,
//     colonyForm,
//     colonyEditorForm,
//     rowenvironmentForm

//   },
//   computed: {

//     zjName () {
//       return this.curModal
//     },
//     zjNameEditor () {
//       return this.curModalEditor
//     }

//   },
//   methods: {
//     handlePageChange (postData) {
//       this[postData.handleSearch](postData.conditionSearch)
//     },
//     handleSetChartList (res, type) {
//       let that = this
//       this.chartList = []

//       Object.keys(res.data.data).map(key => {
//         let obj = {}
//         obj.group = key
//         let option = {
//           title: {
//             text: '记录数',
//             x: 'left',
//             y: 'top',
//             textStyle: {
//               color: '#333'
//             }
//           },
//           legend: {
//             data: ['写入数据总量', '已消费数据总量', '积压数据总量', '消费开始量']
//           },
//           xAxis: {
//             data: [],
//             boundaryGap: false,
//             axisTick: {
//               // show: false

//             },
//             axisLabel: {
//               // show: false
//               showMaxLabel: true

//             }

//           },
//           grid: {
//             left: 80,
//             right: 30,
//             bottom: 20,
//             top: 50
//           },
//           tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//               type: 'cross'
//             },
//             padding: [5, 10]
//           },
//           yAxis: [{
//             name: '数据总量（条）',
//             nameLocation: 'end',
//             type: 'value',
//             axisTick: {
//               show: false
//             }
//           }
//           ],
//           series: [
//             {
//               name: '写入数据总量',
//               itemStyle: {
//                 normal: {
//                   color: '#b0c4d3',
//                   lineStyle: {
//                     color: '#93c6ae',
//                     width: 2
//                   }
//                 }
//               },
//               areaStyle: {
//               },
//               smooth: true,
//               type: 'line',
//               data: [],
//               animationDuration: 2800,
//               animationEasing: 'cubicInOut'
//             },
//             {
//               name: '已消费数据总量',

//               itemStyle: {
//                 normal: {
//                   color: '#64a0a7',
//                   lineStyle: {
//                     color: '#8eb8be',
//                     width: 2
//                   }
//                 }
//               },
//               areaStyle: {

//               },
//               smooth: true,
//               type: 'line',
//               data: [],
//               animationDuration: 2800,
//               animationEasing: 'cubicInOut'
//             },
//             {
//               name: '积压数据总量',

//               itemStyle: {
//                 normal: {
//                   color: '#d28268',
//                   lineStyle: {
//                     color: '#dca392',
//                     width: 2
//                   }
//                 }
//               },
//               areaStyle: {

//               },
//               smooth: true,
//               type: 'line',
//               data: [],
//               animationDuration: 2800,
//               animationEasing: 'cubicInOut'
//             },
//             {
//               name: '消费开始量',
//               itemStyle: {
//                 normal: {
//                   color: '#c03736',
//                   lineStyle: {
//                     color: '#cd6d6d',
//                     width: 2
//                   }
//                 }
//               },
//               areaStyle: {
//               },
//               smooth: true,
//               type: 'line',
//               data: [],
//               animationDuration: 2800,
//               animationEasing: 'cubicInOut'
//             }
//           ]
//         }
//         let xArr = []
//         let s1Arr = []
//         let s2Arr = []
//         let s3Arr = []
//         let s4Arr = []
//         res.data.data[key].map(item => {
//           xArr.unshift(item.timestamp)
//           s1Arr.unshift(item.totalOffset)
//           s2Arr.unshift(item.commitOffset)
//           s3Arr.unshift(item.lagOffset)
//           s4Arr.unshift(item.startOffset)
//         })
//         option.xAxis.data = xArr
//         option.series[0].data = s1Arr
//         option.series[1].data = s2Arr
//         option.series[2].data = s3Arr
//         option.series[3].data = s4Arr
//         obj.optionData = option
//         this.chartList.push(obj)
//       })

//       // this.lookTableData = res.data.data.map(item => {
//       //   xArr.unshift(that.$timeFormat(new Date(item.timestamp)))
//       //   s1Arr.unshift(item.totalOffset)
//       //   s2Arr.unshift(item.commitOffset)
//       //   s3Arr.unshift(item.lagOffset)
//       //   s4Arr.unshift(item.startOffset)
//       // })
//       // option.xAxis.data = xArr
//       // option.series[0].data = s1Arr
//       // option.series[1].data = s2Arr
//       // option.series[2].data = s3Arr
//       // option.series[3].data = s4Arr

//       // this.optionData = JSON.parse(JSON.stringify(option))
//     },
//     getChartData (postData, timer, row) {
//       let that = this
//       ajaxGetAnalysisByTopic(postData).then(res => {
//         if (res.status == 200) {
//           this.handleSetChartList(res, true)
//           that.$nextTick(() => {
//             this.chartList.map(item => {
//               that.$refs['commonChart_' + item.group][0].handleFireChart()
//             })
//             this.handleLoop(timer, row, res)
//           })
//         } else {
//           this.$Message.error('获取数据失败')
//         }
//       })
//     },
//     handleLoop (timer, row, res) {
//       let that = this
//       let postData = {
//         pageSize: 10,
//         pageNum: 1,
//         cluster: row.cluster,
//         name: row.name
//         // requestType: 1,
//         // end: res.data.data[0] && res.data.data[0].timestamp
//       }
//       setTimeout(() => {
//         if (that.modalChart) {
//           this.getChartData(postData, timer, row)
//         }
//       }, 100)
//     },
//     getTime (row) {
//       let text = (row.retentionMs || 0) / 1000
//       return text
//     },
//     handleDropdownMenu (row, name) {
//       if (this.hasOwnProperty('handleFireDropdown' + name)) {
//         this['handleFireDropdown' + name](row)
//       }
//     },
//     handleFireDropdownGroup (row) {
//       this.lookTitle = '查看Group信息'
//       this.loading = true
//       let postData = {
//         pageSize: 10,
//         pageNum: 1,
//         topic: row.name,
//         cluster: row.cluster
//       }
//       ajaxGetGroupByTopic(postData).then(res => {
//         this.loading = false
//         if (res.data.status == '1') {
//           this.lookTableData = res.data.data.list
//           this.pageTotal = res.data.data.total
//           this.lookTableColumn = this.lookTableTitleObj.group
//           this.paramPostData.handleSearch = 'handleGetGroup'
//           this.paramPostData.conditionSearch = postData
          // this.modalLook = true
//         } else {
//           this.$Message.error('查看Group信息失败')
//         }
//       }).catch(err => {
//         this.loading = false
//         this.$Message.error('与服务器通信失败')
//       })
//     },
//     handleFireDropdownWarrant (row) {
//       this.lookTitle = '查看授权信息'
//       this.loading = true
//       let postData = {
//         pageSize: 10,
//         pageNum: 1,
//         cluster: row.cluster,
//         topic: row.name
//       }
//       ajaxGetWarrantByTopic(postData).then(res => {
//         this.loading = false
//         if (res.data.status == '1') {
//           this.lookTableData = res.data.data.list
//           this.pageTotal = res.data.data.total
//           this.lookTableColumn = this.lookTableTitleObj.warrant
//           this.paramPostData.handleSearch = 'handleGetWarrant'
//           this.paramPostData.conditionSearch = postData
          // this.modalLook = true
//         } else {
//           this.$Message.error('查看授权信息失败')
//         }
//       }).catch(err => {
//         this.loading = false
//         this.$Message.error('与服务器通信失败')
//       })
//     },

//     handleFireDropdownAnalysis (row) {
//       let that = this
//       this.lookTitle = '统计分析(' + row.name + ')'
//       let postData = {
//         pageSize: 10,
//         pageNum: 1,
//         cluster: row.cluster,
//         name: row.name
//       }
//       this.modalChart = true
//       ajaxGetAnalysisByTopic(postData).then(res => {
//         if (res.data.status == '1') {
//           this.handleSetChartList(res)
//           that.$nextTick(() => {
//             this.chartList.map(item => {
//               that.$refs['commonChart_' + item.group][0].handleFireChart()
//             })
//             this.handleLoop(1000, row, res)
//           })
//         } else {
//           this.$Message.error('查看授权信息失败')
//         }
//       }).catch(err => {
//         this.loading = false
//         this.$Message.error('与服务器通信失败')
//       })
//     },
//     handleGoEnv (row) {
//       this.$router.push({
//         path: 'environment',
//         query: row
//       })
//     },
//     handleColonyEditor (postData) {
//       this.loading = true
//       setTimeout(() => {
//         this.getColonyArr()
//         this.loading = false
//         this.modalEditorColony = false
//       })
//     },
//     handleCancel (key) {
//       this.modalHide(key)
//     },
//     handleDeleteEnvironment (index, params) {
//       this.loading = true
//       ajaxDeleteCluster(params.row).then(res => {
//         this.loading = false
//         if (res.data.status == 'ok') {
//           this.$Message.success('删除成功')
//           this.getColonyArr()
//         } else {
//           this.$Message.error('删除失败')
//         }
//       }).catch(err => {
//         this.loading = false
//         this.$Message.error('与服务器通信失败')
//       })
//       // let envIndex = ''
//       // params.row.rowEnvironmentArr.map((evi, i) => {
//       //   (evi.value == params.row.environment) && (envIndex = i)
//       // })
//       // if (envIndex !== '') {
//       //   params.row.rowEnvironmentArr.splice(envIndex, 1)
//       //   this.getColonyArr()
//       //   this.$set(this.tableData, index, params.row)
//       //   localStorage.setItem('colonyArr', JSON.stringify(this.tableData))
//       // }
//     },
//     handleRowEnvironmentAdd (postData) {
//       this.modalRowEnvironment = false
//       this.loading = true
//       setTimeout(() => {
//         this.loading = false
//         let index = postData.index
//         delete postData.index
//         this.$set(this.tableData, index, postData)
//       }, 1000)
//     },
//     handleColonyAdd (postData) {
//       this.loading = true
//       setTimeout(() => {
//         this.getColonyArr()
//         this.loading = false
//         this.modalColony = false
//       })
//     },
//     setTableHeight () {
//       // this.tableHeight = document.body.offsetHeight - 64 - 38 - 52 - 49 - 16 * 2 - 34
//       this.tableHeight = document.body.offsetHeight - 64 - 16 * 2 - 72 - 46
//     },
//     handleSubmitSearch () {
//       this.current = 1
//       this.getColonyArr()
//     },
//     handleFailModalEditor () { },
//     handleSuccessModalEditor (postData) {
//       console.log('======postData', postData)
//       let index = postData.index
//       this.modalHide('modal2')
//       this.loading = true
//       // delete postData.index;

//       setTimeout(() => {
//         this.loading = false
//         this.$set(this.tableData, index, postData)
//       }, 2000)
//     },
//     handleSuccessModal (postData) {
//       this.tableData.push(postData)
//       this.modalHide('modal1')
//     },
//     handleFailModal () { },
//     handleDrawAdd () {
//       this.value3 = false
//       this.modalShow('modal1')
//     },
//     routeTo (item, index) {
//       this.$router.push({
//         name: item.name,
//         params: item
//       })
//     },
//     chooseType (item, index) {
//       item.isChoose = !item.isChoose
//       this.curModal = item.name + 'Form'
//       if (item.name == 'kafka') {
//         this.$set(this.queryArr, index, item)
//       } else {
//         this.$set(this.fileDbArr, index, item)
//       }

//       this.handleDrawAdd()
//     },
//     handleAdd () {
//       // this.value3 = true
//       this.modalColony = true
//     },
//     handleTestConnServe () {
//       let postData = this.$refs.modalForm.getFormData()
//       console.log('=========postData', postData)
//       this.$Message.success('连接成功')
//     },
//     pageChange (val) {
//       this.current = +val
//       this.getColonyArr()
//     },
//     change (name) {
//       // this.handleReset(name);
//     },

//     modalShow (k) {
//       this[k] = true
//     },
//     modalHide (k) {
//       this[k] = false
//     },
//     getFormData () {
//       let time = this.$timeFormat(new Date().getTime())
//       let postData = {
//         colony: '',
//         environment: '',
//         creator: '管理员',
//         time: time
//       }
//       for (let k in postData) {
//         postData[k] = this.formValidate[k]
//       }
//       return postData
//     },

//     getColonyArr () {
//       let postData = {}
//       postData.pageSize = this.pageSize
//       postData.pageNum = this.current
//       this.formSearch.name && (postData.name = this.formSearch.name)
//       this.loading = true
//       ajaxGetTopic(postData).then(res => {
//         this.loading = false
//         if (res.data.status == '1') {
//           this.tableData = res.data.data.list
//           this.total = res.data.data.total
//         } else {
//           this.$Message.error('查询数据失败')
//         }
//         console.log(res)
//       }).catch(error => {
//         this.loading = false
//       })
//     }
//   },
//   created () { },
//   mounted () {
//     this.$nextTick(() => {
//       this.setTableHeight()
//       this.getColonyArr()
//       this.loading = true
//       setTimeout(() => {
//         this.loading = false
//       }, 2000)
//     })
//   }
// }
</script>
<style >
/* .ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
} */
</style>
<style lang="less" scoped>
// .borderWrapper {
//   border-radius: 10px;
//   overflow: hidden;
//   background: #fff8f5;
//   border: 1px solid #ddd;
//   box-shadow: 2px 4px 4px rgba(221, 221, 221, 0.8);
//   .iconWrapper {
//     height: 90px;
//     svg {
//       font-size: 48px;
//       margin-top: 16px;
//     }
//   }
//   .f5bc08 {
//     background: #f5bc08;
//   }
//   .ce634e {
//     background: #ce634e;
//   }
//   .ed4a2 {
//     background: #0ed4a2;
//   }
// }

// .demo-drawer-footer {
//   width: 100%;
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   border-top: 1px solid #e8e8e8;
//   padding: 10px 16px;
//   text-align: right;
//   background: #fff;
// }
// .name {
//   height: 40px;
//   font-size: 16px;
//   text-align: center;
//   line-height: 40px;
//   position: relative;
//   z-index: 0;
//   /deep/ .ivu-icon {
//     position: absolute;
//     color: #fff;
//     font-size: 18px;
//     top: 0;
//     right: 0;
//   }
// }

// .flex {
//   display: -webkit-flex;
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-around;
//   align-items: center;
// }
// .flex-item {
//   padding: 20px;
//   width: 25%;
//   text-align: center;
// }

// .flex-item img {
//   max-width: 100%;
//   border-radius: 10px;
// }

// .flex::after {
//   content: "";

//   flex: auto;
// }
</style>
