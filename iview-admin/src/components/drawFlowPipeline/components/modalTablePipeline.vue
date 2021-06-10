
<template>
  <div>
    <Card>
      <div slot="title" style="height:32px;line-height:32px;">{{dataSetName}}</div>
      <div slot="extra">
        <Button type="primary" size="small" @click="handleDown">下载</Button>
      </div>
      <div class="wrapper">
        <Table
          :loading="loading"
          :columns="tableTitle"
          :data="getTableData"
          border
          :height="tableHeight"
        ></Table>
        <div class="page" style="text-align:right;padding-top:10px;">
          <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
        </div>
      </div>
    </Card>
  </div>
</template>
<script>

import excel from '@/libs/excel'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'modalTablePipeline',
  data() {
    return {
      dataSetName: '',
      tableHeight: 0,
      formSearch: {
        createTm: '',
        ppName: '',
        annotions: '',
        creator: ''

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
          title: '名称',
          key: 'dataSetName',
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
          width: 120
        },
        {
          title: '备注',
          key: 'desc',
          minWidth: 120
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
    handleDown() {
      var eleLink = document.createElement('a')
      // eleLink.download = filename

      // 字符内容转变成blob地址
      var blob = new Blob([JSON.stringify(this.tableData)])
      eleLink.href = URL.createObjectURL(blob)
      eleLink.download = this.dataSetName+'.txt';
      eleLink.style.display = 'none'
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    },
    handleSetDate(val) {
      this.formSearch.updateTm = val
    },
    handleSubmitSearch() {
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
    pageChange(val) {
      this.current = +val
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
    },
    setTableHeight() {
      this.tableHeight = document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
    })
  }
}
</script>
