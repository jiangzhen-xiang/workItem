<style lang="less">
@import "./common.less";
.ivu-card-body {
  /deep/ .ivu-table-cell{
    .ivu-btn{margin-right:5px;}
  }}
</style>
<template>
  <div>
    <Row class :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:33px;">
            <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline  >
            <FormItem  prop="name">
              <Input v-model="formSearch.name" placeholder="Pipeline 名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="annotions">
              <Input v-model="formSearch.annotions" placeholder="标签名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="creator">
              <Input v-model="formSearch.creator" placeholder="创建人" size="small"></Input>
            </FormItem>
            <FormItem  prop="createTm">
               <DatePicker type="daterange" placement="bottom-end" :value="formSearch.createTm" placeholder="创建日期" transfer @on-change="handleSetDate"  size="small"></DatePicker>
            </FormItem>

            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
          </FormItem>
          </form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button type="primary" size="small" @click="ok">
                <Icon type="ios-ios-plus" />增加
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table
              :loading="loading"
              :columns="tableTitle"
              :data="getTableData"
              tooltip-theme="dark"
              :height="tableHeight"
              border
            ></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
            </div>
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
          <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="状态" prop="ppStatus">
            <Select v-model="formValidate.ppStatus" placeholder="请选择">
              <Option value="启动中">启动中</Option>
              <Option value="成功">成功</Option>
              <Option value="成功">成功</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
let pie1 = require('../../assets/images/pie1.png')
let pie2 = require('../../assets/images/pie2.png')
let pie3 = require('../../assets/images/pie3.png')
export default {
  name: 'export-excel',
  data () {
    return {
      tableHeight: 0,
      formSearch: {
        createTm: '',
        name: '',
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
          key: 'name',
          width: '120',
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
                        name: 'detail',
                        params: params.row
                      })
                    }
                  }
                },
                params.row.name
              )
            ])
          }
        },
        {
          title: '状态',
          key: 'ppStatus',
          ellipsis: true,
          tooltip: true,
          width: 120
        },
        {
          title: '创建人',
          key: 'creator',
          width: 120
        },
        {
          title: '创建时间',
          ellipsis: true,
          tooltip: true,
          key: 'creatorTm',
          width: 120
        },
        {
          title: '更新时间',
          key: 'updateTm',
          ellipsis: true,
          tooltip: true,
          width: 120
        },

        {
          title: 'Action',
          key: 'action',

          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'

                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '消息提示',
                        closable: true,
                        content: '删除该数据后将不可恢复，是否删除?',
                        loading: true,
                        onOk: () => {
                          this.tableData.splice(
                            +params.index + this.size * (this.current - 1),
                            1
                          )
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
        {
          name: 'OpType',
          ppStatus: 2,
          status: '运行中',
          creator: '管理员',
          creatorTm: '2020-05-20 11:20:20',
          updateTm: '2020-05-20 11:20:20'
        }

      ],
      modal1: false,
      formValidate: {
        name: '',
        mail: '',
        ppStatus: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
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
        ppStatus: [
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
  methods: {
    handleSetDate (val) {
      this.formSearch.updateTm = val
    },
    handleSubmitSearch () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let tableData = localStorage.getItem('linkPipelineData')
        if (!tableData) {
          localStorage.setItem('linkPipelineData', JSON.stringify(this.tableData))
        }
        tableData && (this.tableData = JSON.parse(tableData))

        this.tableData = this.tableData.filter(item => {
          console.log('item', item, this.formSearch.type, item.type == this.formSearch.type)
          if (this.formSearch.type == '' && this.formSearch.linkName == '') {
            return true
          } else if (this.formSearch.type == '' && this.formSearch.linkName != '') {
            return (item.linkName == this.formSearch.linkName)
          } else if (this.formSearch.linkName == '' && this.formSearch.type != '') {
            return (item.type == this.formSearch.type)
          } else {
            return (item.linkName == this.formSearch.linkName) && (item.type == this.formSearch.type)
          }
        })
      }, 2000)
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
        // name: '',
        // ppStatus: ''
      }
      // for (let k in postData) {
      //   postData[k] = this.formValidate[k]
      // }
      postData.name = 'patchPipeline_' + this.tableData.length
      postData.isPatch = true
      postData.creatorTm = this.$timeFormat(new Date())
      postData.updateTm = this.$timeFormat(new Date())
      postData.creator = 'admin'
      return postData
    },
    ok () {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()

      this.tableData.push(postData)
      this.handleReset('formValidate')
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
    exportExcel () {
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
    },
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
    })
  }
}
</script>
