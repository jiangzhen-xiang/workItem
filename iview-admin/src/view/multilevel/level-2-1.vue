// <style lang="less">
// @import "@/excel/common.less";
// </style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8" style="display:flex;">
      <i-col span="14">
        <Card>
          <p slot="title" style="height:30px;">
            <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline >
            <FormItem  prop="linkName">
              <Input v-model="formSearch.linkName" placeholder="数据集名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="type" style="width:140px;">
            <Select v-model="formSearch.type" placeholder="类型" transfer size="small" >
                <Option value="hive">hive</Option>
                <Option value="Kafka">Kafka</Option>
                <Option value="mongodb">mongodb</Option>
            </Select>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="wrapper">
            <Table
              :loading="loading"
              :columns="tableTitle"
              :data="getTableData"
              tooltip-theme="dark"
              border
              :height="tableHeight"
              @on-selection-change="selectRow"
            ></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
      <i-col span="10">
        <Card style="height:100%;">
          <p slot="title" style="height:30px;"></p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleSave" type="primary" size="small">
                <Icon type="ios-ios-plus" />保存
              </Button>
            </ButtonGroup>
          </div>

          <div class="wrapper" style="position:relative;">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <component ref="curLinkTab" :is="zjNameTab"></component>
          </div>
        </Card>
      </i-col>
    </Row>
    <Drawer title="选择连接类型" v-model="value3" width="720" :mask-closable="false" :styles="styles">
      <div class="drawerWrapper">
        <Tabs value="name1">
          <TabPane label="关系型数据库" name="name1">
            <div class="tabContent" style="height:100px;"></div>
          </TabPane>
          <TabPane label="文件类型" name="name2">
            <Row :gutter="8">
              <Col span="6" v-for="(item, index) in fileDbArr" :key="item.name + index">
                <img :src="item.src" alt srcset />
                <div class="name" @click="chooseType(item, index)">
                  <Icon type="ios-checkbox-outline" v-if="item.isChoose" />
                  {{
                  item.name
                  }}
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="handleDrawAdd">确定</Button>
      </div>
    </Drawer>

    <Modal v-model="modal1" title="增加服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalForm"
          @handleSuccess="handleSuccessModal"
          @handleFail="handleFailModal"
          :is="zjName"
        ></component>
      </div>
    </Modal>
    <Modal v-model="modal2" title="编辑服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalFormEditor"
          @handleSuccessEditor="handleSuccessModalEditor"
          @handleFail="handleFailModalEditor"
          :is="zjNameEditor"
        ></component>
      </div>
    </Modal>
    <Modal v-model="modal3" title="关联pipeline列表" footer-hide>
      <div class="tableWrapper">
          <modalTablePipeline ref="modalTablePipeline" />
      </div>
    </Modal>

  </div>
</template>
<script>
import excel from '@/libs/excel'
import modalTablePipeline from './components/modalTablePipeline'
import mongodbForm from './components/mongodbForm'
import mongodbEditorForm from './components/mongodbEditorForm'
import kafkaForm from './components/kafkaForm'
import hiveForm from './components/hiveForm'

import mongodbTab from './components/mongodbTab'

let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'level_2_1',
  data () {
    return {
      modal3: false,
      tableHeight: 0,
      formSearch: {
        createTm: '',
        ppName: '',
        annotions: '',
        creator: ''

      },
      curIndex: 0,
      spinShow: false,
      curType: '',
      curTabLink: 'mongodbTab',
      curModal: 'mongodbForm',
      curModalEditor: 'mongodbEditorForm',
      fileDbArr: [
        {
          src: '@/assets/images/pie2.png',
          name: 'hive'
        },
        {
          src: '',
          name: 'kafka'
        },
        {
          src: '',
          name: 'mongodb'
        }
      ],
      value3: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      loading: false,
      current: 1,
      size: 10,
      tableTitle: [
        {
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: '数据集',
          key: 'dataSetName',
          eclipse: true,
          tooltip: true,
          width: '80',
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
                      this.curTabLink = params.row.type + 'Tab'
                      this.spinShow = true
                      this.$nextTick(() => {
                        if (params.row.type == 'mongodb') {
                          this.$refs.curLinkTab.formBasic.dataSetName = params.row.dataSetName
                          this.$refs.curLinkTab.formBasic.type = params.row.typ
                          this.$refs.curLinkTab.formBasic.annotions = JSON.parse(JSON.stringify(params.row.annotions))

                          this.$refs.curLinkTab.formLink.url = params.row.url
                          this.$refs.curLinkTab.formLink.linkName = params.row.linkName

                          this.$refs.curLinkTab.formParam.params = JSON.parse(JSON.stringify(params.row.params))
                        }
                        setTimeout(() => {
                          this.spinShow = false
                        }, 1000)
                      })

                      this.curIndex =
                        +params.index + (this.current - 1) * this.size
                    }
                  }
                },
                params.row.dataSetName
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          eclipse: true,
          tooltip: true,
          width: 80
        },
        {
          title: '备注',
          key: 'desc',
          eclipse: true,
          tooltip: true,
          width: 80
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small',
                    style: 'margin-left:5px;'
                  },
                  on: {
                    click: () => {
                      this.modalShow('modal3')
                      this.$nextTick(() => {
                        this.$refs.modalTablePipeline.dataSetName = params.row.dataSetName
                      })
                    }
                  }
                },
                'Pipeline'
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
                          this.tableData.splice(
                            +params.index + this.size * (this.current - 1),
                            1
                          )
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
        {
          dataSetName: 'mongodb',
          url: 'url',
          desc: 'desc',
          type: 'mongodb',
          linkName: '',
          annotions: [],
          params: []
        }
      ],
      modal1: false,
      modal2: false,
      false: false,
      formValidate: {
        dataSetName: '',
        type: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        validteType: '',
        annotions: ''
      },
      ruleValidate: {
        dataSetName: [
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
        type: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }
        ],

        url: [
          {
            required: true,
            message: 'url不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    modalTablePipeline,
    mongodbTab,
    mongodbEditorForm,
    // hiveEditorForm,
    // kafkaEditorForm,
    mongodbForm,
    hiveForm,
    kafkaForm
  },
  computed: {
    zjName () {
      return this.curModal
    },
    zjNameEditor () {
      return this.curModalEditor
    },
    zjNameTab () {
      return this.curTabLink
    },
    getTableData () {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        let rule1 = index >= (this.current - 1) * this.size
        let rule2 = index < this.current * this.size

        return rule1 && rule2
      })
      arr.map(item => {
        // item._checked = true
      })
      return arr
    }
  },
  methods: {
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    selectRow (selection, row) {
      console.log('=======selection', selection, row)
      selection.map(item => {
        item._checked = true
      })
    },
    handleSave () {
      let newData = this.getTabData()
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$set(this.tableData, this.curIndex, newData)
      }, 2000)
    },
    getTabData () {
      let postData = {}
      if (this.curTabLink == 'mongodbTab') {
        postData.type = 'mongodb'
        postData.dataSetName = this.$refs.curLinkTab.formBasic.dataSetName
        postData.desc = this.$refs.curLinkTab.formBasic.desc
        postData.annotions = JSON.parse(JSON.stringify(this.$refs.curLinkTab.formBasic.annotions))

        postData.url = this.$refs.curLinkTab.formLink.url
        postData.linkName = JSON.parse(JSON.stringify(this.$refs.curLinkTab.formLink.linkName))
        postData.params = JSON.parse(JSON.stringify(this.$refs.curLinkTab.formParam.params))
      }
      console.log('getTabData', postData)
      return postData
    },
    handleFailModalEditor () { },
    handleSuccessModalEditor (postData) {
      console.log('======postData', postData)
      let index = postData.index
      this.modalHide('modal2')
      this.loading = true
      // delete postData.index;

      setTimeout(() => {
        this.loading = false
        this.$set(this.tableData, index, postData)
      }, 2000)
    },
    handleSuccessModal (postData) {
      this.tableData.push(postData)
      this.modalHide('modal1')
    },
    handleFailModal () { },
    handleDrawAdd () {
      this.value3 = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.tableData.unshift({
          dataSetName: this.curType + '_' + this.tableData.length,
          type: this.curType,
          url: '',
          linkName: '',
          annotions: [],
          params: []

        })
      }, 2000)

      // this.modalShow('modal1')
    },
    routeTo (item, index) {
      this.$router.push({
        name: item.name,
        params: item
      })
    },
    chooseType (item, index) {
      item.isChoose = !item.isChoose
      this.curModal = item.name + 'Form'
      this.curType = item.name
      console.log('=========curModal', this.curModal)
      this.$set(this.fileDbArr, index, item)
    },
    handleAdd () {
      this.value3 = true
    },
    handleTestConnServe () {
      let postData = this.$refs.modalForm.getFormData()
      console.log('=========postData', postData)
      this.$Message.success('连接成功')
    },
    pageChange (val) {
      this.current = +val
    },
    change (name) {
      // this.handleReset(name);
    },

    modalShow (k) {
      this[k] = true
    },
    modalHide (k) {
      this[k] = false
    },
    getFormData () {
      let postData = {
        linkName: '',
        type: '',
        validteType: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        annotions: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
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
    }
  },
  created () { },
  mounted () {
    // this.init();
    this.$nextTick(() => {
      this.setTableHeight()
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    })
  }
}
</script>
<style lang="less" scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.name {
  height: 140px;
  background: lightseagreen;
  color: #fff;
  text-align: center;
  line-height: 140px;
  position: relative;
  z-index: 0;
  /deep/ .ivu-icon {
    position: absolute;
    color: #fff;
    font-size: 18px;
    top: 0;
    right: 0;
  }
}

.flex {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.flex-item {
  padding: 20px;
  width: 25%;
  text-align: center;
}

.flex-item img {
  max-width: 100%;
  border-radius: 10px;
}

.flex::after {
  content: "";

  flex: auto;
}
</style>
