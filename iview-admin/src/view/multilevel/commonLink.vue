
<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:34px;">
            <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline >
            <FormItem  prop="colony">
              <Input v-model="formSearch.colony" placeholder="集群名称" size="small"></Input>
            </FormItem>

            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />增加集群
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="getTableData" border :height="tableHeight">
                <template slot-scope="{ row }" slot="environment">
                    <Select v-model="row.environment" prop="environment" placeholder="环境"  @change="changeEnvironment">
                         <Option v-for="(item,index) in row.rowEnvironmentArr" :value="item.value" :label="item.label" >{{item.label}} </Option>
                    </Select>
                </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator :current ="current" :page-size="pageSize" @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Drawer title="选择连接类型" v-model="value3" width="720" :mask-closable="false" :styles="styles">
      <div class="drawerWrapper">
        <Tabs value="name1">
          <TabPane label="消息队列" name="name1">
            <div class="tabConten" style="">

              <div class="flex">
              <div class="flex-item" v-for="(item,index) in queryArr" @click="chooseType(item, index)">
                <div class="borderWrapper">
<div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                    <svg-icon :icon-class="item.icon" :class-name="item.icon"  />
                </div>
              <div class="name">
                {{item.name}}
              </div>

                </div>

            </div>
            </div>
            </div>
          </TabPane>
          <TabPane label="数据库" name="name2">
            <div class="flex">
              <div class="flex-item" v-for="(item,index) in fileDbArr" @click="chooseType(item, index)">
                <div class="borderWrapper">
<div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                    <svg-icon :icon-class="item.icon" :class-name="item.icon"  />
                </div>
              <div class="name">
                {{item.name}}
              </div>

                </div>

            </div>
            </div>

          </TabPane>
        </Tabs>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="handleDrawAdd">确定</Button>
      </div>
    </Drawer>
    <Drawer :title="titleValue4" v-model="value4" width="720" :mask-closable="false" :styles="styles">
      <div class="drawerWrapper">
        连接信息
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="handleDrawAdd">确定</Button>
      </div>
    </Drawer>
    <Modal v-model="modalColony" title="增加集群" footer-hide>
      <div class="formWrapper">
          <commonForm  @handleSuccess="handleColonyAdd"/>
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment" title="增加环境" footer-hide>
      <div class="formWrapper">
          <rowEnvironmentFormCommon  @handleSuccess="handleRowEnvironmentAdd" :index = "index" :curColony="curColony"/>
      </div>
    </Modal>

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
  </div>
</template>
<script>
import excel from '@/libs/excel'

import commonForm from './components/commonForm'
import rowEnvironmentFormCommon from './components/rowEnvironmentFormCommon'

export default {
  name: 'level_2_3',
  data () {
    return {
      value4: false,
      index: 0,
      titleValue4: '',
      curColony: '',
      modalColony: false,

      modalRowEnvironment: false,
      tableHeight: 0,
      formSearch: {
        type: '',
        colony: ''

      },
      formValidate: {

      },
      curModal: '',
      curModalEditor: '',
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
      pageSize: 10,
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
          key: 'colony',
          width: '120',
          eclipse: true,
          tooltip: true,
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
                        path: 'link',
                        query: params.row
                      })
                    }
                  }
                },
                params.row.colony
              )
            ])
          }
        },
        {
          title: '默认运行环境',
          key: 'environment',
          width: 170,
          eclipse: true,
          tooltip: true,
          slot: 'environment'
        },
        {
          title: '修改人',
          key: 'creator',
          eclipse: true,
          tooltip: true,
          width: 80
        },
        {
          title: '修改时间',
          key: 'time',
          eclipse: true,
          tooltip: true,
          width: 100
        },
        {
          title: '连接信息',
          key: 'linkInfo',
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
                      this.value4 = true
                      this.titleValue4 = '连接信息(' + params.row.colony + ')'
                    }
                  }
                },
                '查看'
              )

            ])
          }
        },
        {
          title: '操作',
          key: 'action',

          minWidth: 290,
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
                      this.loading = true
                      setTimeout(() => {
                        this.loading = false
                      }, 1000)
                    }
                  }
                },
                '设置默认运行环境'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.curColony = JSON.stringify(params.row)
                      this.index = +params.index + (this.current - 1) * this.pageSize
                      this.modalRowEnvironment = true
                    }
                  }
                },
                '增加环境'
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
                          // this.tableData.splice(
                          //   +params.index + this.size * (this.current - 1),
                          //   1
                          // )

                          let index = +params.index + (this.current - 1) * this.pageSize
                          this.handleDeleteEnvironment(index, params)
                          this.$Modal.remove()
                          this.modal1 = false
                        }
                      })
                    }
                  }
                },
                '删除环境'
              )
            ])
          }
        }
      ],

      tableData: [
        // {
        //   colony: 'mongodb',
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
        colony: '',
        type: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        validteType: '',
        annotions: ''
      },
      ruleValidate: {
        colony: [
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
    commonForm,
    rowEnvironmentFormCommon

  },
  computed: {
    zjName () {
      return this.curModal
    },
    zjNameEditor () {
      return this.curModalEditor
    },
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
    handleDeleteEnvironment (index, params) {
      let envIndex = ''
      params.row.rowEnvironmentArr.map((evi, i) => {
        (evi.value == params.row.environment) && (envIndex = i)
      })
      if (envIndex !== '') {
        params.row.rowEnvironmentArr.splice(envIndex, 1)
        this.getCommonArr()
        this.$set(this.tableData, index, params.row)
        localStorage.setItem('commonArr', JSON.stringify(this.tableData))
      }
    },
    handleRowEnvironmentAdd (postData) {
      this.modalRowEnvironment = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let index = postData.index
        delete postData.index
        this.$set(this.tableData, index, postData)
      }, 1000)
    },
    handleColonyAdd (postData) {
      this.loading = true
      setTimeout(() => {
        this.tableData.unshift(postData)
        this.loading = false
        this.modalColony = false
      })
    },
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    handleSubmitSearch () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let tableData = localStorage.getItem('commonArr')
        if (!tableData) {
          localStorage.setItem('commonArr', JSON.stringify(this.tableData))
        }
        tableData && (this.tableData = JSON.parse(tableData))

        this.tableData = this.tableData.filter(item => {
          console.log('item', item, this.formSearch.type, item.type == this.formSearch.type)
          if (this.formSearch.type == '' && this.formSearch.colony == '') {
            return true
          } else if (this.formSearch.type == '' && this.formSearch.colony != '') {
            return (item.colony == this.formSearch.colony)
          } else if (this.formSearch.colony == '' && this.formSearch.type != '') {
            return (item.type == this.formSearch.type)
          } else {
            return (item.colony == this.formSearch.colony) && (item.type == this.formSearch.type)
          }
        })
      }, 2000)
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
      this.modalShow('modal1')
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
      console.log('=========curModal', this.curModal)
      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else {
        this.$set(this.fileDbArr, index, item)
      }

      this.handleDrawAdd()
    },
    handleAdd () {
      // this.value3 = true
      this.modalColony = true
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
      let time = this.$timeFormat(new Date().getTime())
      let postData = {
        colony: '',
        environment: '',
        creator: '管理员',
        time: time
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

    getCommonArr () {
      let colonyStr = localStorage.getItem('commonArr')
      if (colonyStr) {
        this.tableData = JSON.parse(colonyStr)
      }
    }
  },
  created () { },
  mounted () {
    // this.init();
    this.$nextTick(() => {
      this.setTableHeight()
      this.getCommonArr()
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    })
  }
}
</script>
<style >
.ivu-drawer-close{
    left: -15px;
    background: #fff;
    top: 50%;
    width: 30px;
    border-radius: 50%;
    margin-top: -25px;
}
</style>
<style lang="less" scoped>

.borderWrapper{
  border-radius:10px;
  overflow:hidden;
  background:#fff8f5;
  border: 1px solid #ddd;
    box-shadow: 2px 4px 4px rgba(221,221,221,.8);
.iconWrapper {
  height:90px;
  svg{
  font-size:48px;
  margin-top:16px;
}

}
.f5bc08{
  background: #f5bc08;

}
.ce634e{
   background: #ce634e;
}
.ed4a2{
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
  font-size:16px;
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

</style>
