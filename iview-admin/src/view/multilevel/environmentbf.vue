<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <div slot="title" style="height:24px;">
            <div class="flex-left">
              <div class="flexItem">
                <span style="line-height:24px;"
                  >集群名称:{{
                    $route.query.name
                  }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                >
              </div>
              <!-- <div class="flexItem">
                <Select
                  v-model="curEnvironment"
                  placeholder="环境"
                  transfer
                  size="small"
                  style="width:170px;height:24px;line-height:24px;text-align:left;"
                >
                  <Option
                    v-for="(item,index) in rowEnvironmentArr"
                    :value="item.value"
                    :label="item.label"
                  >{{item.label}}</Option>
                </Select>
              </div>-->
              <!-- <div class="flexItem">
                <Input
                  v-model="url"
                  placeholder="通过API批量添加集群下的连接"
                  size="small"
                  style="width:240px;"
                />
              </div>-->
              <!-- <div class="flexItem" style="margin-left:-5px;">
                <Tooltip
                  translate
                  transfer
                  max-width="200"
                  content="通过 rest api 批量添加集群组件的连接信息，目前只支持 CDH clouder manager 的 rest api 批量获取集群连接信息。"
                  placement="bottom"
                >
                  <Button @click="handleImportUrl" type="primary" size="small">批量添加</Button>
                </Tooltip>
              </div>-->
            </div>
          </div>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon type="ios-ios-plus" />增加环境
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table
              :loading="loading"
              :columns="tableTitle"
              tooltip-theme="dark"
              :data="getTableData"
              border
              :height="tableHeight"
            >
              <template slot-scope="{ row, index }" slot="clusterId">
                <span>{{ $route.query.name }}</span>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="tableData.length"
                show-total
                show-elevator
                :current="current"
                :page-size="size"
                @on-change="pageChange"
              />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Drawer
      title="选择连接类型"
      v-model="value3"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div class="drawerWrapper">
        <Tabs value="name1">
          <TabPane label="消息队列" name="name1">
            <div class="tabConten" style>
              <div class="flex">
                <div
                  class="flex-item"
                  v-for="(item, index) in queryArr"
                  @click="chooseType(item, index)"
                >
                  <div class="borderWrapper">
                    <div
                      class="iconWrapper"
                      :class="item.background"
                      style="tont-size:48px;"
                    >
                      <svg-icon
                        :icon-class="item.icon"
                        :class-name="item.icon"
                      />
                    </div>
                    <div class="name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="数据库" name="name2">
            <div class="flex">
              <div
                class="flex-item"
                v-for="(item, index) in fileDbArr"
                @click="chooseType(item, index)"
              >
                <div class="borderWrapper">
                  <div
                    class="iconWrapper"
                    :class="item.background"
                    style="tont-size:48px;"
                  >
                    <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                  </div>
                  <div class="name">{{ item.name }}</div>
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
    <!-- <Modal v-model="modalLink" :title="'添加服务连接('+linkType.toUpperCase()+')'" footer-hide>
      <div class="stepsWrapper">
        <commonForm @handleOk="handleOk" @handleCancel="handleCancel" :linkType="linkType" />
      </div>
    </Modal>-->

    <Modal
      v-model="modal1"
      :title="'添加服务连接(' + linkType.toUpperCase() + ')'"
      footer-hide
      @on-visible-change="test"
    >
      <div style="padding:10px 0">
        <Steps :current="step" :status="stepStatus" size="small">
          <Step title="添加连接"></Step>
          <Step title="配置连接环境"></Step>
          <Step title="验证及预览"></Step>
        </Steps>
      </div>

      <div class="stepsWrapper">
        <div v-show="step == 0">
          <commonForm
            ref="commonForm"
            @handleOk="handleStepOne"
            @handleCancel="handleStepOneFail"
            :linkType="linkType"
          />
        </div>
        <div class="formWrapper" v-show="step == 1">
          <!-- <component
            ref="modalForm"
            :stepOneData="linkForm"
            @handleOk="handleStepTwo"
            @handleCancel="handleStepTwoFail"
            :is="zjName"
          ></component>-->
          <kafkaTemp
            ref="kafkaTemp"
            :stepOneData="linkForm"
            @handleOk="handleStepTwo"
            @handleCancel="handleStepTwoFail"
          />
        </div>
        <div class="prevWrapper" v-show="step == 2">
          <prevTemp
            ref="prevTemp"
            :authType="linkForm.authType"
            :linkForm="linkForm"
            :stepOneData="linkForm"
            @handleOk="handleStepThree"
            @handleCancel="handleStepThreeFail"
          />
        </div>
      </div>
    </Modal>
    <Modal v-model="modal2" title="编辑服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalFormEditor"
          @handleSuccessEditor="handleSuccessModalEditor"
          @handleFail="handleFailModalEditor"
          @handleCancel="handleCancel"
          :is="zjNameEditor"
        ></component>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ajaxGetEnv, ajaxAddEnv, ajaxDeleteEnv } from '@/api/env.js'
import excel from '@/libs/excel'
import mongodbForm from './components/mongodbForm'
import mongodbEditorForm from './components/mongodbEditorForm'
import implaEditorForm from './components/implaEditorForm'
import hiveEditorForm from './components/hiveEditorForm'
import kafkaEditorForm from './components/kafkaEditorForm'
import hbaseEditorForm from './components/hbaseEditorForm'
import kafkaForm from './components/kafkaForm'
import restmqForm from './components/restmqForm'
import restmqEditorForm from './components/restmqEditorForm'
import hiveForm from './components/hiveForm'
import hbaseForm from './components/hbaseForm'
import implaForm from './components/implaForm'
import commonForm from './components/commonForm'
import kafkaTemp from './components/kafkaTemp'
import prevTemp from './components/prevTemp'

import colonyLink from './colonyLink'
export default {
  name: 'link',
  data () {
    return {
      modalLink: false,
      linkForm: {
        linkType: ''
      },
      linkType: '',
      step: 0,
      stepStatus: 'wait',
      url: 'http://172.16.150.27:7180/api/v19/clusters/',
      value4: false,
      rowEnvironmentArr: [],
      curEnvironment: this.$route.query.environment,
      tableHeight: 0,
      formSearch: {
        type: '',
        link: ''
      },
      formValidate: {},
      curModal: '',
      curModalEditor: '',
      queryArr: [
        {
          name: 'kafka',
          icon: 'kafka',
          background: 'f5bc08'
        },
        {
          name: 'restmq',
          icon: 'restmq',
          background: 'ce634e'
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
          key: 'name',
          eclipse: true,
          tooltip: true
        },
        {
          title: '所属集群',
          key: 'clusterId',
          eclipse: true,
          tooltip: true,
          slot: 'clusterId'
        },
        {
          title: '描述',
          key: 'description',
          eclipse: true,
          tooltip: true
        },

        {
          title: '创建时间',
          key: 'crtDate',
          eclipse: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',

          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
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
                '查看'
              ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'primary',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.curModal = params.row.type + 'Form'

              //         this.linkType = params.row.linkType
              //         this.linkForm.linkType = params.row.linkType
              //         this.handleAddLinkModal()
              //       }
              //     }
              //   },
              //   '环境参数配置'
              // ),
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
                    type: 'warning',
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
                '同步'
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
                          let index =
                            +params.index + this.size * (this.current - 1)
                          this.handleDeleteLink(index, params)
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
          link: 'kafaka',
          url: 'url',
          desc: 'desc',
          type: 'kafaka',
          linkType: 'kafka',
          username: 'username',
          password: 'password',
          annotions: []
        }
      ],
      modal1: false,
      modal2: false,
      false: false,
      formValidate: {
        link: '',
        type: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        validteType: '',
        annotions: ''
      },
      ruleValidate: {
        link: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],

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
    hbaseForm,
    hbaseEditorForm,
    kafkaForm,
    kafkaEditorForm,
    hiveForm,
    hiveEditorForm,
    colonyLink,
    restmqForm,
    restmqEditorForm,
    commonForm,
    kafkaTemp,
    prevTemp
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
    test (val) {
      if (!val) {
        this.handleResetModal1()
      }
    },
    handleOk (key) {
      this.getLinkArr()
      this.modalHide(key)
    },
    handleCancel (key) {
      this.getLinkArr()
      this.modalHide(key)
    },
    handleStepTwo (postData) {
      // 赋值
      ;
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }

      // 设置下当前的步骤
      this.step = 2
      this.stepStatus = 'success'
    },
    handleStepTwoFail (status) {
      // 设置下当前的步骤
      this.step = 0
      this.stepStatus = status
    },
    handleStepThreeFail (status) {
      this.step = 1
      this.stepStatus = status
    },
    handleStepThree () {
      ;
      this.handleResetModal1()
    },
    handleStepOne (postData) {
      ;
      // 赋值
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }
      // 设置下当前的步骤
      this.step = 1
      this.stepStatus = 'success'
    },

    handleStepOneFail (postData) {
      this.stepStatus = 'error'
    },
    handleDeleteLink (index, params) {
      this.$Modal.remove()
      this.modal1 = false
      this.loading = true
      setTimeout(() => {
        this.tableData.splice(
          +params.index + this.size * (this.current - 1),
          1
        )
        this.loading = false
        localStorage.setItem('linkArr', JSON.stringify(this.tableData))
      }, 1000)
    },
    handleImportUrl () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    handleResetUrl () {
      let importData = [
        {
          link: 'kafka',
          authType: 'SASL_PLAINTEXT',
          desc: 'kafka',
          sasl: 'PLAIN',
          server: '',
          annotions: [
            {
              name: 'kafka'
            }
          ],
          type: 'kafka',
          time: '2020-05-21 20:19:59'
        },
        {
          link: 'hbase',
          authType: 'kerberos',
          host: 'hbase',
          desc: 'hbase',
          port: 'hbase',
          annotions: [
            {
              name: 'hbase'
            }
          ],
          type: 'hbase',
          time: '2020-05-21 20:07:50'
        },
        {
          link: 'hive',
          metaStore: 'hive',
          HS2: 'hive',
          authType: 'none',
          desc: '',
          annotions: [
            {
              name: 'hive'
            }
          ],
          type: 'hive',
          time: '2020-05-21 20:01:30'
        }
      ]
      localStorage.setItem('linkArr', JSON.stringify(importData))
      this.getLinkArr()
    },
    handleCancel (visible) {
      this.modalHide(visible)
    },
    getLinkArr () {
      let postData = {}
      postData.pageNum = this.current
      postData.pageSize = this.size
      postData.clusterId = this.$route.query.id

      ajaxGetEnv(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$Message.error('查询环境失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通讯失败')
        })
    },
    setTableHeight () {
      this.tableHeight =
        document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    handleSubmitSearch () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let tableData = localStorage.getItem('linkTableData')
        if (!tableData) {
          localStorage.setItem('linkTableData', JSON.stringify(this.tableData))
        }
        tableData && (this.tableData = JSON.parse(tableData))

        this.tableData = this.tableData.filter(item => {
          console.log(
            'item',
            item,
            this.formSearch.type,
            item.type == this.formSearch.type
          )
          if (this.formSearch.type == '' && this.formSearch.link == '') {
            return true
          } else if (this.formSearch.type == '' && this.formSearch.link != '') {
            return item.link == this.formSearch.link
          } else if (this.formSearch.link == '' && this.formSearch.type != '') {
            return item.type == this.formSearch.type
          } else {
            return (
              item.link == this.formSearch.link &&
              item.type == this.formSearch.type
            )
          }
        })
      }, 2000)
    },
    handleFailModalEditor () {},
    handleSuccessModalEditor (postData) {
      console.log('======postData', postData)
      let index = postData.index

      this.modalHide('modal2')
      this.loading = true
      delete postData.index

      setTimeout(() => {
        postData.environment = this.$route.query.environment
        postData.iscolony = this.$route.query.colony
        this.loading = false
        this.$set(this.tableData, index, postData)
        localStorage.setItem('linkArr', JSON.stringify(this.tableData))
      }, 1000)
    },
    handleSuccessModal (postData) {
      this.modalHide('modal1')

      this.loading = true
      setTimeout(() => {
        postData.environment = this.$route.query.environment
        postData.iscolony = this.$route.query.colony
        this.tableData.unshift(postData)
        this.loading = false
        localStorage.setItem('linkArr', JSON.stringify(this.tableData))
      }, 1000)
    },
    handleFailModal () {},
    handleAddLinkModal () {
      this.value3 = false
      this.modalShow('modal1')
      // this.modalShow('modalLink')
      // this.linkForm = {}
      this.step = 0
      this.stepStatus = 'wait'
    },
    handleDrawAdd () {
      this.value3 = false
      this.modalShow('modal1')
      this.step = 0
      this.stepStatus = 'wait'
      // 把初始commonForm reset一下
    },
    handleResetModal1 () {
      this.$nextTick(() => {
        this.linkType = ''
        this.$refs.commonForm.handleReset('formValidate')
      })
    },
    routeTo (item, index) {
      this.$router.push({
        name: item.name,
        params: item
      })
    },
    chooseType (item, index) {
      ;
      item.isChoose = !item.isChoose
      this.curModal = item.name + 'Form'
      this.linkType = item.name
      console.log('=========curModal', this.curModal)

      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else if (item.name == 'restmq') {
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
      let postData = {
        link: '',
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
    initRowEnviroment () {
      ;
      let colonyArrStr = localStorage.getItem('colonyArr')
      let colonyArr = []
      if (colonyArrStr) {
        colonyArr = JSON.parse(colonyArrStr)
      }
      let index = ''
      colonyArr.map((col, i) => {
        this.$route.query.colony == col.colony && (index = i)
      })
      if (index !== '') {
        this.rowEnvironmentArr = [].concat(colonyArr[index].rowEnvironmentArr)
      }
    }
  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
      this.initRowEnviroment()
      this.getLinkArr()
    })
  }
}
</script>
<style>
.ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
}
.ivu-table .ivu-btn {
  margin-right: 5px;
}
.ivu-card .ivu-card-extra {
  top: 6px;
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
.flex-left {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  .flexItem {
    margin-right: 10px;
    text-align: center;
  }
}
</style>
