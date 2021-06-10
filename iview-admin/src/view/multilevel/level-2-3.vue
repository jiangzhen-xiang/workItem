
<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Tabs value="name1">
      <TabPane label="集群连接" name="name1">
        <colonyLink />
      </TabPane>
      <TabPane label="通用连接" name="name2" disabled>
        <commonLink />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import mongodbForm from './components/mongodbForm'
import mongodbEditorForm from './components/mongodbEditorForm'
import implaEditorForm from './components/implaEditorForm'
import hiveEditorForm from './components/hiveEditorForm'
import hbaseEditorForm from './components/hbaseEditorForm'
import kafkaForm from './components/kafkaForm'
import hiveForm from './components/hiveForm'
import hbaseForm from './components/hbaseForm'
import implaForm from './components/implaForm'

import colonyLink from './colonyLink'
import commonLink from './commonLink'
export default {
  name: 'level_2_3',
  data() {
    return {
      tableHeight: 0,
      formSearch: {
        type: '',
        linkName: ''

      },
      formValidate: {

      },
      curModal: 'mongodbForm',
      curModalEditor: 'mongodbEditorForm',
      queryArr: [
        {
          name: 'kafka',
          icon: 'kafka',
          background: 'f5bc08'
        }
      ],
      fileDbArr: [
        {
          name: 'hive',
          icon: 'hive',
          background: 'ce634e'
        },
        {
          name: 'hbase',
          icon: 'hbase',
          background: 'ce634e'
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
          // type: "index",
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
          title: '名称',
          key: 'linkName',
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
                      this.curModalEditor = params.row.type + 'EditorForm'
                      this.$nextTick(() => {
                        this.$refs.modalFormEditor.formValidateEditor = JSON.parse(
                          JSON.stringify(params.row)
                        )
                        this.$refs.modalFormEditor.formValidate = JSON.parse(
                          JSON.stringify(params.row)
                        )
                        this.$refs.modalFormEditor.curIndex =
                          +params.index + (this.current - 1) * this.size
                        this.modalShow('modal2')
                      })
                    }
                  }
                },
                params.row.linkName
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          width: 120
        },
        {
          title: '备注',
          key: 'desc',
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
                  },
                  on: {
                    click: () => {
                      this.curModalEditor = params.row.type + 'EditorForm'

                      this.$nextTick(() => {
                        this.$refs.modalFormEditor.formValidateEditor = JSON.parse(
                          JSON.stringify(params.row)
                        )
                        this.$refs.modalFormEditor.formValidate = JSON.parse(
                          JSON.stringify(params.row)
                        )
                        this.$refs.modalFormEditor.curIndex =
                          +params.index + (this.current - 1) * this.size
                        this.modalShow('modal2')
                      })
                    }
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
        //   linkName: 'mongodb',
        //   url: 'url',
        //   desc: 'desc',
        //   type: 'mongodb',
        //   username: 'username',
        //   password: 'password',
        //   annotions: []
        // }
      ],
      modal1: false,
      modal2: false,
      false: false,
      formValidate: {
        linkName: '',
        type: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        validteType: '',
        annotions: ''
      },
      ruleValidate: {
        linkName: [
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
    colonyLink,
    commonLink
  },
  computed: {
    zjName() {
      return this.curModal
    },
    zjNameEditor() {
      return this.curModalEditor
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
  methods: {
    setTableHeight() {
      this.tableHeight = document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    handleSubmitSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let tableData = localStorage.getItem('linkTableData')
        if (!tableData) {
          localStorage.setItem('linkTableData', JSON.stringify(this.tableData))
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
    handleFailModalEditor() { },
    handleSuccessModalEditor(postData) {
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
    handleSuccessModal(postData) {
      this.tableData.push(postData)
      this.modalHide('modal1')
    },
    handleFailModal() { },
    handleDrawAdd() {
      this.value3 = false
      this.modalShow('modal1')
    },
    routeTo(item, index) {
      this.$router.push({
        name: item.name,
        params: item
      })
    },
    chooseType(item, index) {
      item.isChoose = !item.isChoose
      this.curModal = item.name + 'Form'
      console.log('=========curModal', this.curModal)
      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else {
        this.$set(this.fileDbArr, index, item)
      }

      this.handleDrawAdd()
    },
    handleAdd() {
      this.value3 = true
    },
    handleTestConnServe() {
      let postData = this.$refs.modalForm.getFormData()
      console.log('=========postData', postData)
      this.$Message.success('连接成功')
    },
    pageChange(val) {
      this.current = +val
    },
    change(name) {
      // this.handleReset(name);
    },

    modalShow(k) {
      this[k] = true
    },
    modalHide(k) {
      this[k] = false
    },
    getFormData() {
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
  created() { },
  mounted() {
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
<style >
.ivu-table .ivu-btn {
  margin-right: 5px;
}
.ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
}
</style>
<style lang="less" scoped>
.borderWrapper {
  border-radius: 10px;
  overflow: hidden;
  background: #fff8f5;
  border: 1px solid #ddd;
  box-shadow: 2px 4px 4px rgba(221, 221, 221, 0.8);
  .iconWrapper {
    height: 90px;
    svg {
      font-size: 48px;
      margin-top: 16px;
    }
  }
  .f5bc08 {
    background: #f5bc08;
  }
  .ce634e {
    background: #ce634e;
  }
  .ed4a2 {
    background: #0ed4a2;
  }
}

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
  height: 40px;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
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
.ivu-table .ivu-button {
  margin-right: 5px;
}
</style>
