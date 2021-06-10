<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <div slot="title" style="height:24px;">
            <Form ref="formSearch" :model="formSearch" inline>
              <!-- <FormItem prop="name">
                <Input
                  v-model="formSearch.name"
                  placeholder="集群名称"
                  size="small"
                ></Input>
              </FormItem>-->
              <FormItem prop="connType">
                <Select
                  v-model="formSearch.connType"
                  placeholder="连接类型"
                  transfer
                  size="small"
                  style="width:170px;"
                >
                  <!-- <Option value="hive">hive</Option> -->
                  <Option value="Kafka">kafka</Option>
                  <Option value="hbase">hbase</Option>
                  <Option value="cm">ClouderaManager</Option>
                  <Option value="yarn">yarn</Option>
                  <Option value="flink">flink</Option>
                  <Option value="hdfs">hdfs</Option>
                  <Option value="hive-metastore">HIVE-METASTORE</Option>
                  <!-- <Option value="mongodb">mongodb</Option> -->
                </Select>
              </FormItem>
              <FormItem>
                <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
                <Button type="error" size="small" @click="handleSubmitClear('formSearch')">清空</Button>
              </FormItem>
            </Form>
          </div>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Tooltip
                translate
                transfer
                max-width="200"
                content="通过 rest api 批量添加集群组件的连接信息，目前只支持 CDH clouder manager 的 rest api 批量获取集群连接信息。"
                placement="bottom"
              >
                <Button @click="handleImportUrl" type="primary" size="small">批量添加CDH</Button>
              </Tooltip>
              <Tooltip
                translate
                transfer
                max-width="200"
                content="通过 rest api 批量添加集群组件的连接信息，目前只支持 CDH clouder manager 的 rest api 批量获取集群连接信息。"
                placement="bottom"
              >
                <Button @click="handleImportUrl" type="primary" size="small">批量添加ES</Button>
              </Tooltip>
              <Tooltip
                translate
                transfer
                max-width="200"
                content="通过 rest api 批量添加集群组件的连接信息，目前只支持 CDH clouder manager 的 rest api 批量获取集群连接信息。"
                placement="bottom"
              >
                <Button @click="handleAdd" type="primary" size="small">
                  <Icon type="ios-ios-plus" />增加连接
                </Button>
              </Tooltip>
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
            ></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="total"
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
    <Drawer title="选择连接类型" v-model="value3" width="720" :mask-closable="false" :styles="styles">
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
                    <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                      <svg-icon :icon-class="item.icon" :class-name="item.icon" />
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
                  <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                    <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                  </div>
                  <div class="name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="集群连接" name="name3">
            <div class="flex">
              <div
                class="flex-item"
                v-for="(item, index) in clusterDbArr"
                @click="chooseType(item, index)"
              >
                <div class="borderWrapper">
                  <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
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
    <Modal v-model="modalEditorLink" :title="modalEditorLinkTitle" footer-hide>
      <div class="stepsWrapper">
        <commonEditorForm
          ref="commonEditorForm"
          @handleOk="handleOk"
          @handleCancel="handleCancel"
          :connType="connType"
          :formType="modalEditorLinkFormType"
        />
      </div>
    </Modal>

    <Modal
      v-model="modal1"
      :title="'添加服务连接(' + connType.toUpperCase() + ')'"
      footer-hide
      @on-visible-change="test"
    >
      <div style="padding:10px 0;text-align:center;">
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
            :connType="connType"
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
    <!-- 编辑服务连接 -->

    <Modal
      v-model="modalEditorConnToDev"
      :title="'编辑服务连接(' + connType.toUpperCase() + ')'"
      footer-hide
      @on-visible-change="test"
    >
      <div style="padding:10px 0;text-align:center;">
        <Steps :current="stepEditor" :status="stepEditorStatus" size="small">
          <Step title="添加连接"></Step>
          <Step title="配置连接环境"></Step>
          <Step title="验证及预览"></Step>
        </Steps>
      </div>

      <div class="stepsWrapper">
        <div v-show="stepEditor == 0">
          <commonEditorConnForm
            ref="commonEditorConnForm"
            @handleOk="handleStepOneEditor"
            @handleCancel="handleStepOneFail"
            :connType="connType"
          />
        </div>
        <div class="formWrapper" v-show="stepEditor == 1">
          <!-- <component
            ref="modalForm"
            :stepOneData="linkForm"
            @handleOk="handleStepTwo"
            @handleCancel="handleStepTwoFail"
            :is="zjName"
          ></component>-->
          <tempEditor
            ref="tempEditor"
            :stepOneData="linkForm"
            @handleOk="handleStepEditorTwo"
            @handleCancel="handleStepEditorTwoFail"
          />
        </div>
        <div class="prevWrapper" v-show="stepEditor == 2">
          <prevEditorTemp
            ref="prevEditorTemp"
            :authType="linkForm.authType"
            :linkForm="linkForm"
            :stepOneData="linkForm"
            @handleOk="handleStepEditorThree"
            @handleCancel="handleStepEditorThreeFail"
          />
        </div>
      </div>
    </Modal>

    <Modal v-model="modal2" title="连接详情" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalFormEditor"
          :listData="listData"
          :row="curRowData"
          @handleSuccessEditor="handleSuccessModalEditor"
          @handleFail="handleFailModalEditor"
          @handleCancel="handleCancel"
          :is="lookZjName"
        ></component>
      </div>
    </Modal>
    <Modal v-model="modalBatch" :title="'批量添加连接(' + this.curBatchType + ')'" footer-hide>
      <div class="formWrapper">
        <batchForm
          :connType="curBatchType.toLowerCase()"
          @handleOk="handleBatchAdd"
          @handleCancel="handleBatchAddFail"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getLink,
  ajaxAddLink,
  ajaxGetConn,
  ajaxDeleteConn,
  ajaxGetEnvInfo
} from '@/api/link.js'
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
import tempEditor from './components/tempEditor'
import prevTemp from './components/prevTemp'
import prevEditorTemp from './components/prevEditorTemp'
import commonEditorForm from './components/commonEditorForm'
import commonEditorConnForm from './components/commonEditorConnForm'
import batchForm from './components/batchForm'
import kafkaLookForm from './components/kafkaLookForm'
import flinkLookForm from './components/flinkLookForm'
import cmLookForm from './components/cmLookForm'
import hbaseLookForm from './components/hbaseLookForm'
import yarnLookForm from './components/yarnLookForm'

import colonyLink from './colonyLink'
let fileStr = require('@/assets/images/file.png')
export default {
  name: 'link',
  data () {
    return {
      modalEditorLinkTitle: '',
      modalEditorLinkFormType: '',
      total: 0,
      curRowData: {},
      listData: [
        {
          clusterId: '1',
          connId: '2',
          envId: '3',
          envName: '开发',
          list: [
            {
              bootstrapServers: 'bootstrapServers',
              saslMechanism: 'bootstrapServer',
              securityProtocol: 'bootstrapServer',
              fileName: 'hbase.xml',
              fileId: '24 '
            }
          ]
        }
      ], // 存储连接信息
      modalBatch: false,
      modalLink: false,
      modalEditorLink: false,
      modalEditorConnToDev: false,
      linkForm: {
        connType: ''
      },
      curModalLook: 'kafkaLookForm',
      curBatchType: '',
      connType: '',
      step: 0,
      stepStatus: 'wait',
      stepEditor: 0,
      stepEditorStatus: 'wait',
      url: 'http://172.16.150.27:7180/api/v19/clusters/',
      value4: false,
      rowEnvironmentArr: [],
      curEnvironment: this.$route.query.environment,
      tableHeight: 0,
      formSearch: {
        connType: ''

      },
      formValidate: {},
      curModal: '',
      curModalEditor: '',
      queryArr: [
        {
          name: 'kafka',
          icon: 'kafka',
          type: 'kafka',
          background: 'f5bc08'
        }
        // {
        //   name: 'restmq',
        //   icon: 'restmq',
        //   type: 'resetmq',
        //   background: 'ce634e'
        // }
      ],
      fileDbArr: [
        {
          name: 'hive metastore ',
          icon: 'hive',
          type: 'hive-metastore',
          background: 'ce634e'
        },
        {
          name: 'hbase',
          icon: 'hbase',
          type: 'hbase',
          background: 'ce634e'
        }
      ],
      clusterDbArr: [
        {
          name: 'ClouderaManager',
          type: 'cm',
          icon: 'hive',
          background: 'ce634e'
        },
        {
          name: 'flink',
          type: 'flink',
          icon: 'apacheflink',
          background: 'ce634e'
        },
        {
          name: 'yarn',
          type: 'yarn',
          icon: 'yarn',
          background: 'ce634e'
        }
        // {
        //   name: 'hdfs',
        //   type: 'hdfs',
        //   icon: 'hive',
        //   background: 'ce634e'
        // }
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
          key: 'connName',
          eclipse: true,
          tooltip: true
          // render: (h, params) => {
          //   return h('div', [
          //     h(
          //       'Button',
          //       {
          //         props: {
          //           type: 'text',
          //           size: 'small'
          //         },
          //         on: {
          //           click: () => {
          //
          //             this.curModalEditor = params.row.type + 'EditorForm'
          //             this.$nextTick(() => {
          //               this.$refs.modalFormEditor.formValidateEditor = JSON.parse(
          //                 JSON.stringify(params.row)
          //               )
          //               this.$refs.modalFormEditor.formValidate = JSON.parse(
          //                 JSON.stringify(params.row)
          //               )
          //               this.$refs.modalFormEditor.curIndex =
          //                 +params.index + (this.current - 1) * this.size
          //               this.modalShow('modal2')
          //             })
          //           }
          //         }
          //       },
          //       params.row.connName
          //     )
          //   ])
          // }
        },
        {
          title: '所属集群',
          key: 'clusterName',
          eclipse: true,
          tooltip: true
        },
        // {
        //   title: "关联环境",
        //   key: "creator",
        //   eclipse: true,
        //   tooltip: true
        // },
        {
          title: '连接类型',
          key: 'connType',
          eclipse: true,
          tooltip: true
        },
        {
          title: '描述',
          key: 'description',
          eclipse: true,
          tooltip: true
        },
        {
          title: '修改时间',
          key: 'crtDate',
          eclipse: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 260,
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
                      // this.curModalEditor = params.row.type + "EditorForm";
                      this.curModalLook = params.row.connType + 'LookForm'
                      this.curRowData = params.row
                      this.modalShow('modal2')
                      ajaxGetEnvInfo(params.row).then(res => {
                        if (res.data.status == 'ok') {
                          this.listData = [].concat(res.data.data)
                          this.listData.map(item => {
                            if ('config' in item) {
                              item.config = eval(
                                '(' + JSON.parse(item.config) + ')'
                              )
                            }

                            return item
                          })
                        }
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
              //         // this.curModalEditor = params.row.type + "EditorForm";
              //         this.curModalLook = params.row.connType + 'LookForm'
              //         this.curRowData = params.row
              //         this.modalShow('modal2')
              //         ajaxGetEnvInfo(params.row).then(res => {
              //           if (res.data.status == 'ok') {
              //             this.listData = [].concat(res.data.data)
              //           }
              //         })
              //       }
              //     }
              //   },
              //   '查看版本信息'
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.curModal = params.row.type + 'Form'

                      this.connType = params.row.connType
                      this.linkForm.connType = params.row.connType
                      this.handleEditorLinkModal(params.row, 'editor')
                      if (this.connType == 'hbase' || (this.connType == 'flink')) {
                        this.$bus.emit('clearFile')
                      }
                      if (this.connType == 'kafka') {
                        this.$bus.emit('clear-form')
                      }
                    }
                  }
                },
                '环境参数配置'
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
                      this.modalEditorLinkFormType = 'editor'
                      this.modalShow('modalEditorLink')
                      this.handleSetTitle('编辑', params.row.connType)
                      this.handleSetFormData(params.row)
                      this.connType = params.row.connType
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
                          let index =
                            +params.index + this.size * (this.current - 1)
                          this.handleDeleteConn(index, params)
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
        //   link: "kafaka",
        //   url: "url",
        //   desc: "desc",
        //   type: "kafaka",
        //   connType: "kafka",
        //   username: "username",
        //   password: "password",
        //   annotions: []
        // }
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
    commonEditorForm,
    kafkaTemp,
    tempEditor,
    commonEditorConnForm,
    prevEditorTemp,
    batchForm,
    kafkaLookForm,
    flinkLookForm,
    hbaseLookForm,
    cmLookForm,
    yarnLookForm,
    prevTemp
  },
  computed: {
    zjName () {
      return this.curModal
    },
    zjNameEditor () {
      return this.curModalEditor
    },
    lookZjName () {
      return this.curModalLook
    },
    getTableData () {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        return 1
      })
      return arr
    }
  },
  activated () {
    this.getLinkArr()
  },
  watch: {
    $route: {
      handler () {
        this.getLinkArr()
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true
    }
  },
  methods: {
    handleSubmitClear (name) {
      this.$refs[name].resetFields()
      this.handleSubmitSearch()
    },
    handleSetTitle (actionType, type) {
      this.modalEditorLinkTitle =
        actionType + '连接(' + type.toUpperCase() + ')'
    },
    handleSetFormData (row) {
      this.$nextTick(() => {
        for (let k in row) {
          this.$refs.commonEditorForm.formValidate[k] = row[k]
        }
        if ('clusterId' in row) {
          this.$refs.commonEditorForm.formValidate.clusterId = row.clusterId.toString()
        }
      })
    },
    handleBatchAdd (postData) {
      this.modalHide('modalBatch')
      this.getLinkArr()
    },
    handleBatchAddFail (postData) {
      this.modalHide('modalBatch')
    },
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
    handleStepEditorTwo (postData) {
      // 赋值

      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }

      // 设置下当前的步骤
      this.stepEditor = 2
      this.stepEditorStatus = 'success'
    },
    handleStepEditorTwoFail (status) {
      // 设置下当前的步骤
      this.stepEditor = 0
      this.stepEditorStatus = status
    },
    handleStepThreeFail (status) {
      this.step = 1
      this.stepStatus = status
    },
    handleStepEditorThreeFail (status) {
      this.stepEditor = 1
      this.stepEditorStatus = status
    },
    handleStepThree () {
      this.handleResetModal1()
      setTimeout(() => {
        this.modalHide('modal1')
      }, 0)
    },
    handleStepEditorThree () {
      this.handleResetEditorModal()
      this.modalHide('modalEditorConnToDev')
    },
    handleResetEditorModal () {
      this.$nextTick(() => {
        this.connType = ''
        this.$refs.commonEditorConnForm.handleReset('formValidate')
      })
    },
    handleStepOne (postData) {
      // 赋值
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }
      // 设置下当前的步骤
      this.step = 1
      this.stepStatus = 'success'
      // 设置下一步环境的数据
      this.$nextTick(() => {
        this.$refs.kafkaTemp.getDevArr()
      })
    },
    handleStepOneEditor (postData) {
      for (let k in postData) {
        this.linkForm[k] = postData[k]
      }
      // 设置下当前的步骤
      this.stepEditor = 1
      this.stepEditorStatus = 'success'
      this.$nextTick(() => {
        // 需要在这里设置当前的环境的
        this.$refs.tempEditor.getDevArr()
      })
    },

    handleStepOneFail (postData) {
      this.stepStatus = 'error'
    },
    handleDeleteConn (index, params) {
      this.loading = true
      ajaxDeleteConn(params.row)
        .then(res => {
          this.loading = false
          if (res.data.status == 'ok') {
            this.$Message.success('删除成功')
            this.$Modal.remove()
            this.modal1 = false
            this.getLinkArr()
          } else {
            this.$Message.error('删除数据失败')
          }
        })
        .catch(err => {
          this.loading = false
          this.$Message.error('与服务器通信失败')
        })
    },
    handleImportUrl () {
      // this.loading = true
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)
      // this.$bus.emit('clear-form', { text: 'aaa' })
      this.curBatchType = 'CDH'
      this.modalShow('modalBatch')
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
      this.loading = true
      let postData = {}
      let that = this
      postData.pageSize = this.size
      postData.pageNum = this.current
      if (this.$route.query.id) {
        postData.clusterId = this.$route.query.id
      }
      if (this.formSearch.connType) {
        postData.connType = this.formSearch.connType
      }
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          that.tableData = [].concat(res.data.data.list)
          that.total = res.data.data.total || this.tableData.length
        }
        this.loading = false
      })
    },
    setTableHeight () {
      this.tableHeight =
        document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    handleSubmitSearch () {
      this.current = 1
      this.size = 10
      this.getLinkArr()
      return
      let postData = {
        pageSize: 10,
        pageNum: 1
      }
      if (this.formSearch.connType) {
        postData.connType = this.formSearch.connType
      }
      this.loading = true

      if (this.$route.query.id) {
        postData.clusterId = this.$route.query.id
      }
      let that = this
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          that.tableData = [].concat(res.data.data.list)
          that.total = res.data.data.total || this.tableData.length
        }
        this.loading = false
      })
    },
    handleFailModalEditor () { },
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
    handleFailModal () { },
    handleEditorLinkModal (row, flag) {
      this.modalShow('modalEditorConnToDev')
      this.stepEditor = 0
      this.stepEditorStatus = 'wait'
      this.$nextTick(() => {
        for (let k in this.$refs.commonEditorConnForm.formValidate) {
          this.$refs.commonEditorConnForm.formValidate[k] = row[k]
        }
        this.$refs.commonEditorConnForm.formValidate.clusterId = row.clusterId.toString()
      })
    },
    handleAddLinkModal (row, flag) {
      this.value3 = false
      this.modalShow('modal1')
      this.step = 0
      this.stepStatus = 'wait'
    },
    handleAddLink () {
      this.value3 = false
      this.modalShow('modalEditorLink')
      this.handleSetTitle('添加', this.connType)
      this.modalEditorLinkFormType = 'add'
      let row = {
        // clusterId: this.$route.query.id || '',
        // connName: '',
        connType: this.connType
        //  description: ''
      }
      this.$route.query.id && (row.clusterId = this.$route.query.id)
      this.handleSetFormData(row)
    },
    handleDrawAdd () {
      this.value3 = false

      this.modalShow('modal1')
      this.step = 0
      this.stepStatus = 'wait'
      // 把初始commonForm reset一下
      this.$nextTick(() => {

        // this.$refs.commonForm.handleReset('formValidate')
      })
    },
    handleResetModal1 () {
      this.$nextTick(() => {
        this.connType = ''
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
      item.isChoose = !item.isChoose
      // this.curModal = item.name + 'Form'
      // this.connType = item.name
      this.curModal = item.type + 'Form'
      this.connType = item.type
      console.log('=========curModal', this.curModal)
      // 不需要设置选择类型了
      // if (item.name == 'kafka') {
      //   this.$set(this.queryArr, index, item)
      // } else if (item.name == 'restmq') {
      //   this.$set(this.queryArr, index, item)
      // } else {
      //   this.$set(this.fileDbArr, index, item)
      // }
      this.handleAddLink()
      // this.handleDrawAdd()
    },
    handleAdd () {
      this.value3 = true
    },
    handleTestConnServe () {
      let postData = this.$refs.modalForm.getFormData()
      this.$Message.success('连接成功')
    },
    pageChange (val) {
      this.current = +val
      this.getLinkArr()
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
  created () { },
  mounted () {
    // this.init();
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
