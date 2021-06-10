
<template>
  <div>
    <Row class :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:33px;">
            <Form ref="formSearch" :model="formSearch" inline  >
            <FormItem  prop="pipeline">
              <Input v-model="formSearch.pipeline" placeholder="Pipeline 名称" size="small"></Input>
            </FormItem>
            <!-- <FormItem  prop="annotions">
              <Input v-model="formSearch.annotions" placeholder="标签名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="creator">
              <Input v-model="formSearch.creator" placeholder="创建人" size="small"></Input>
            </FormItem>
            <FormItem  prop="createTm">
               <DatePicker type="daterange" placement="bottom-end" :value="formSearch.createTm" placeholder="创建日期" transfer @on-change="handleSetDate"  size="small"></DatePicker>
            </FormItem> -->

            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
          </FormItem>
          </form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button type="primary" size="small" @click="handleAddPipeline">
                <Icon type="ios-ios-plus" />创建Pipeline
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper pipeline">
            <Table
              :loading="loading"
              :columns="tableTitle"
              :data="tableData"
              tooltip-theme="dark"
              :height="tableHeight"

              border
            >
            <template scope-slot="{index ,row}" slot="crt_date1">
              admin
            </template>
        </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="total" show-total show-elevator @on-change="pageChange" size="small" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>

    <Modal
      v-model="modal2"
      title="关联数据集"

    >
      <div class="formWrapper">
       <modalTablePipeline ref="modalTablePipeline" />
      </div>
    </Modal>
    <Modal
      v-model="modal1"
      title="创建Pipeline"

      @on-visible-change="change('formValidate')"
    >
      <div class="formWrapper">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="pipeline">
            <Input v-model="formValidate.pipeline" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button type="default" size="small"  @click="cancel">取消</Button>
            <Button type="primary" size="small"  @click="ok">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import modalTablePipeline from './components/modalTablePipeline'
import excel from '@/libs/excel'
import { ajaxAddPipeline, ajaxGetPipeline, ajaxDeletePipeline } from '@/api/pipeline.js'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'IncrementCopy',
  data () {
    let checkFlag = true
    const checkPipelineName = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('pipeline名称不能为空'))
      } else {
        let postData = {}
        postData.dataflowName = rule
        postData.pageSize = 10
        postData.pageNum = 1
        if (checkFlag) {
          checkFlag = false
          setTimeout(() => {
            ajaxGetPipeline(postData).then(res => {
              checkFlag = true
              if (res.data.data.result_content.length) {
                callback(new Error('pipeline名称不能重复'))
              } else {
                callback()
              }
            }).catch(err => {
              checkFlag = true
            })
          }, 1000)
        }
      }
    }
    return {
      total: 0,
      modal2: false,
      tableHeight: 0,
      formSearch: {
        createTm: '',
        pipeline: '',
        annotions: '',
        creator: ''

      },
      loading: false,
      current: 1,
      size: 10,
      tableTitle: [
        {
          // type: "index",
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            console.log('params======', params)
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: 'pipeline名称',
          key: 'dataflow_name',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: 'flowDetail',
                        query: {
                          dataflow_documentId: params.row.dataflow_documentId,
                          dataflow_name: params.row.dataflow_name
                          // dataflow_type: params.row.dataflow_type || 'flinkdataflow'
                        }
                      })
                    }
                  }
                },
                params.row.dataflow_name
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'dataflow_type',
          ellipsis: true,
          tooltip: true,
          minWidth: 120
        },
        {
          title: '创建人',
          key: 'crt_date1',
          ellipsis: true,
          tooltip: true,
          minWidth: 120,
          slot: 'crt_date1'
        },
        {
          title: '创建时间',
          ellipsis: true,
          tooltip: true,
          key: 'crt_date',
          minWidth: 120

        },
        {
          title: '操作',
          key: 'action',

          minWidth: 160,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    style: 'margin-right:5px;'

                  },
                  on: {
                    click: () => {
                      params.row.status = '暂定'
                      this.handleStop(params)
                    }
                  }
                },
                '暂停'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small',
                    style: 'margin-right:5px;'

                  },
                  on: {
                    click: () => {
                      this.modal2 = true
                    }
                  }
                },
                '重新开始'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    style: 'margin-left:5px;'

                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '消息提示',
                        closable: true,
                        content: '删除该数据后将不可恢复，是否删除?',
                        loading: true,
                        onOk: () => {
                          this.handleDeletePipeline(params.row)
                          this.$Modal.remove()
                          this.modal1 = false
                        }
                      })
                    }
                  }
                },
                '删除'
              )

            ])
          }
        }
      ],

      tableData: [
        // {
        //   dataflow_name: 'OpType',
        //   dataflow_type: 'flinkdataflow',
        //   draw_code: '',
        //   drawData: [{
        //     aaa: 123
        //   }]
        // }
      ],
      modal1: false,
      formValidate: {
        pipeline: '',
        mail: '',
        status: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        pipeline: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            validator: checkPipelineName,
            trigger: ['change', 'blur']
          }
        ],
        // mail: [
        //   {
        //     required: true,
        //     message: "Mailbox cannot be empty",
        //     trigger: "blur"
        //   },
        //   { type: "email", message: "Incorrect email format", trigger: "blur" }
        // ],
        status: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }
        ]
        // gender: [
        //   { required: true, message: "Please select gender", trigger: "change" }
        // ],
        // interest: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "Choose at least one hobby",
        //     trigger: "change"
        //   },
        //   {
        //     type: "array",
        //     max: 2,
        //     message: "Choose two hobbies at best",
        //     trigger: "change"
        //   }
        // ],
        // date: [
        //   {
        //     required: true,
        //     type: "date",
        //     message: "Please select the date",
        //     trigger: "change"
        //   }
        // ],
        // time: [
        //   {
        //     required: true,
        //     type: "string",
        //     message: "Please select time",
        //     trigger: "change"
        //   }
        // ],
        // desc: [
        //   {
        //     required: true,
        //     message: "Please enter a personal introduction",
        //     trigger: "blur"
        //   },
        //   {
        //     type: "string",
        //     min: 20,
        //     message: "Introduce no less than 20 words",
        //     trigger: "blur"
        //   }
        // ]
      }
    }
  },
  computed: {
    getTableData () {
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
    modalTablePipeline
  },
  methods: {
    handleDeletePipeline (row) {
      ajaxDeletePipeline(row).then(res => {
        if (res.data.status == 'ok') {
          this.$Message.success(res.data.message || '删除成功')
          this.getPipelineArr()
        }
      }).catch(err => {
        this.$Message.err('与服务器通信失败')
      })
    },
    handleAddPipeline () {
      this.modal1 = true
    },
    handleStop (params) {
      let index = this.params.index + (this.current - 1) * this.size
      params.row.status = '暂停'
      params.row.time = this.$timeFormat(new Date())
      this.$set(this.tableData, index, params.row)
      localStorage.setItem('pipelineArr', this.tableData)
    },
    handleSetDate (val) {
      this.formSearch.updateTm = val
    },
    handleSubmitSearch () {
      let postData = {}
      postData.pageSize = this.size
      postData.pageNum = 1
      postData.dataflowName = this.formSearch.pipeline
      ajaxGetPipeline(postData).then(res => {
        if (res.data.status == 'ok') {
          var arr = res.data.data.result_content.map(item => { var oo = JSON.parse(item.dataflow_content); oo.dataflow_documentId = item.dataflow_documentId; return oo })
          this.tableData = [].concat(arr)
          this.total = res.data.data.result_total
        } else {
          this.$Message.error('查询数据失败')
        }
      }).catch(err => {
        this.$Message.error('与服务器通信失败')
      })
    },
    pageChange (val) {
      this.current = +val
    },
    change (name) {
      // this.handleReset(name);
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    modelShow (k) {
      this[k] = true
    },
    getFormData () {
      let postData = {
        pipeline: '',
        status: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },
    ok () {
      // console.log('this.formValidate', this.formValidate)
      // let postData = this.getFormData()

      // this.tableData.push(postData)
      // this.handleReset('formValidate')
      let index = this.tableData.length
      let obj = {
        pipeline: this.formValidate.pipeline,
        'type': 'flinkdataflow',
        formGenaral: {
          pipeline: this.formValidate.pipeline,
          maxParallelism: '智能设置',
          maxParallelismValue: '16',
          jobmanager: '1024',
          taskmanager: '1024',
          isCheckPoint: '1',
          checkPointSplit: '60',
          recovery: '100',
          exactlyOnlyOnce: '1',
          desc: 'pipeline 演示测试',
          taskSlots: '',
          sinkArr: []
        },
        formParams: {
          params: [{
            name: '',
            type: '',
            defaultValue: ''
          }]
        },
        runTime: {
          queue: '',
          yarnConn: '',
          flinkConn: '',
          env: '',
          cluster: '',
          mode: '',
          yarnAccount: '',
          runUser: '',
          clusterUseArr: []
        },
        config: {
          'checkpointInterval': 0,
          'checkpointMode': 'EXACTLY_ONCE',
          'checkpointCleanup': 'DELETE_ON_CANCELLATION'

        },
        status: '运行中',
        creator: '管理员',
        creatorTm: '2020-05-20 11:20:20',
        updateTm: '2020-05-20 11:20:20',
        drawData: [{
          emptyStart: true,
          haveSet: false,
          tabType: 'starTab',
          leftIndex: 1,
          topIndex: 1

        }]
      }
      let postData = {}
      postData.dataflowName = obj.pipeline
      postData.dataflowType = 'flinkdataflow'
      postData.dataflowConfig = ''
      postData.drawCode = JSON.stringify(obj)
      ajaxAddPipeline(postData).then(res => {
        if (res.data.status == 'ok') {
          this.getPipelineArr()
          this.modal1 = false
          this.handleReset('formValidate')

          this.$Modal.confirm({
            title: '消息提示',
            closable: true,
            content: '是否立即进入编辑页面编辑' + postData.dataflowName + '?',
            loading: true,
            onOk: () => {
              this.$Modal.remove()
              obj.pipelineId = res.data.data.dataflowName
              obj.dataflow_name = postData.dataflowName
              this.$router.push({
                path: 'flowDetail',
                query: obj
              })
            },
            onCancel: () => {
              this.$Modal.remove()
            }
          })

          // ======end===
        }
      }).catch(err => {
        this.$Message.error('与服务器通信失败')
      })
    },
    cancel () {
      this.handleReset('formValidate')
    },
    init () {
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
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 38 - 48 - 16 * 2 - 45
    },
    getPipelineArr () {
      let postData = {}
      postData.pageNum = this.current
      postData.pageSize = this.size

      ajaxGetPipeline(postData).then(res => {
        if (res.data.status == 'ok') {
          if (res.data.data.result_content) {
            var arr = res.data.data.result_content.map(item => {
              var oo = JSON.parse(item.dataflow_content)
              oo.dataflow_documentId = item.dataflow_documentId
              return oo
            })
            this.tableData = [].concat(arr)

            // this.tableData = res.data.data.result_content
            this.total = res.data.data.result_total
          } else {
            var arr = res.data.data.map(item => {
              var oo = JSON.parse(item)
              oo.dataflow_documentId = item.dataflow_documentId || ''
              // oo.dataflow_type = item.dataflow_type
              return oo
            })
            this.tableData = [].concat(arr)

            // this.tableData = res.data.data.result_content
            this.total = res.data.data.result_total
          }
        } else {
          this.$Message.error('查询数据失败')
        }
      }).catch(err => {
        this.$Message.error('与服务器通信失败')
      })
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
      this.getPipelineArr()
    })
  }
}
</script>
<style lang="less" scoped>
.pipeline {
  /deep/ .ivu-table-cell{
    .ivu-btn{margin-right:5px;}
  }
}
</style>
