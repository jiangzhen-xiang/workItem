<template>
  <div>
    <div class="top">
      <Card>
        <div slot="title" style="height:33px;padding-top: 10px;">
          <Button type="primary" size="small" @click="handleSave" style="margin-right:5px;">保存</Button>

          <Button type="primary" size="small" @click="handleValidate" style="margin-right:5px;">校验</Button>
          <!-- <Button type="primary" size="small" @click="handleRefresh" style="margin-right:5px;">刷新</Button> -->

          <Button type="primary" size="small" @click="handleRefresh" style="margin-right:5px;">放弃修改</Button>
          <div style="display:inline-block;margin-right:5px;">
            <i-switch v-model="witch" size="small">
              <span slot="open"></span>
              <span slot="close"></span>
            </i-switch>调试模式
          </div>

          <Button
            type="primary"
            size="small"
            @click="handlePublish"
            :disabled="isDisabled"
            style="margin-right:5px;"
          >发布</Button>
        </div>
        <div class="btnWrapper" slot="extra" style="left:16px;">
          <Dropdown @on-click="handleFire">
            <a href="javascript:void(0)" size="small">
              开发者工具
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="script" disabled>脚本</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown style="margin-left: 20px" @on-click="handleFire">
            <!-- <a href="javascript:void(0)">
              &nbsp;&nbsp;模版&nbsp;&nbsp;
              <Icon type="ios-arrow-down"></Icon>
            </a>-->
            <Button type="primary" size="small">
              &nbsp;&nbsp;模版&nbsp;&nbsp;
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="save">保存为模版</DropdownItem>
              <DropdownItem name="load">从模版加载</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!-- <Button type="primary" size="small" @click="handleCode" style="margin-right:5px;">
            <Icon type="ios-ios-plus" />脚本
          </Button>
          <Button type="primary" size="small" @click="handleTemp" style="margin-right:5px;">
            <Icon type="ios-ios-plus" />模版
          </Button>-->
        </div>
        <div class="wrapper">
          <div
            id="flowPipelineGraph"
            style="background:#fafafa;height:300px;position:relative;overflow:auto;"
            @click="handleSetPipeline"
          >
            <div v-for="(item, index) in pipeline.drawData">
              <div v-if="item.emptyStart">
                <emptyStart
                  v-bind:styleParent="item.style"
                  :index="index"
                  :activedIndex="activedIndex"
                  @handleSetSource="handleSetSource"
                  @handleAddStart="handleAddStart"
                  @handleSetEmptyStart="handleSetEmptyStart"
                  :nodeData="item"
                  @handleDelete="handleDelete"
                  @addNodeTemp="handleAddNode"
                />
              </div>
              <div v-else-if="item.start">
                <start
                  v-bind:styleParent="item.style"
                  :index="index"
                  :activedIndex="activedIndex"
                  @handleSetSource="handleSetSource"
                  :nodeData="item"
                  @handleSetActivedIndex="handleSetActivedIndex"
                  @handleDelete="handleDelete"
                  @addNodeTemp="handleAddNode"
                />
              </div>

              <div v-else-if="item.nodeOne">
                <nodeOne
                  v-bind:styleParent="item.style"
                  :index="index"
                  :activedIndex="activedIndex"
                  :nodeData="item"
                  @handleSetSource="handleSetSource"
                  @handleSetActivedIndex="handleSetActivedIndex"
                  @handleDelete="handleDelete"
                  @addNodeTemp="handleAddNode"
                />
              </div>
              <div v-else>
                <end
                  v-bind:styleParent="item.style"
                  :index="index"
                  :activedIndex="activedIndex"
                  :nodeData="item"
                  @handleSetSource="handleSetSource"
                  @handleSetActivedIndex="handleSetActivedIndex"
                  @handleSetEnd="handleSetEnd"
                  @handleDelete="handleDelete"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="bottom" style="padding:20px;">
      <component :is="zjName" :pipeline="pipeline" :nodeData="pipeline.drawData[this.activedIndex]"></component>
    </div>
    <Modal v-model="modal1" title="脚本预览" footer-hide width="80%">
      <div
        class="ivu-transfer"
        style="display: flex;
    flex-wrap: nowrap;
    justify-content: space-between"
      >
        <div class="ivu-transfer-list" style="width: 50%;">
          <div class="ivu-transfer-list-header">
            <span class="ivu-transfer-list-header-title">输入</span>
          </div>
          <div class="ivu-transfer-list-body">
            <div class="ivu-transfer-list-content">
              <textarea style="width:100%;outline:0;border:0;" v-model="code" :rows="rows"></textarea>
            </div>
          </div>
        </div>

        <div class="ivu-transfer-list" style="width: 50%;margin-left:16px;">
          <div class="ivu-transfer-list-header">
            <span class="ivu-transfer-list-header-title">输出</span>
          </div>
          <div class="ivu-transfer-list-body">
            <div class="ivu-transfer-list-content">
              <textarea style="width:100%;outline:0;border:0;" v-model="code" :rows="rows"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button
          type="default"
          @click="handleEditorCancel('modal1')"
          style="margin-right:5px;"
          size="small"
        >取消</Button>
        <Button
          type="primary"
          @click="handleEditor('modal1')"
          style="margin-right:5px;"
          size="small"
        >确定</Button>
      </div>
    </Modal>
    <Modal v-model="modalDebugger" title="导入模版" footer-hide width="60%">
      <Form ref="formTemp" :model="formTemp" :rules="formTempRules" :label-width="80">
        <!-- <FormItem label="名称" prop="name">
          <Select v-model="formTemp.name" placeholder="请选择">
            <Option
              v-for="(item, index) in queryArr"
              :key="index"
              :value="item.value"
              :label="item.label"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>-->
        <FormItem label="名称" prop="name">
          <Select v-model="formTemp.name" placeholder="请选择" @on-change="handleChangeTemp">
            <Option
              v-for="(item, index) in queryTempNameArr"
              :key="index"
              :value="item.value"
              :label="item.label"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="模版预览" prop="code">
          <Input type="textarea" v-model="formTemp.code" placeholder="请输入" rows="10"></Input>
          <!-- <textarea style="width:100%;height:200px;" v-model="code"></textarea> -->
        </FormItem>
      </Form>
      <!-- <textarea style="width:100%;height:200px;" :disabled="cannotEditor" v-model="code"></textarea> -->
      <div style="text-align: right;">
        <Button
          type="primary"
          @click="handleCanEditor"
          style="margin-right:5px;"
          v-if="cannotEditor"
        >编辑</Button>
        <Button
          type="primary"
          @click="handleEditor('modalDebugger')"
          style="margin-right:5px;"
          v-else
        >确定</Button>
        <Button
          type="primary"
          @click="handleEditorCancel('modalDebugger')"
          style="margin-right:5px;"
        >取消</Button>
      </div>
    </Modal>
    <Modal v-model="modalTempImport" title="生成模版" footer-hide width="60%">
      <Form ref="formTemp" :model="formTemp" :rules="formTempRules" :label-width="80">
        <FormItem label="名称" prop="name">
          <Row>
            <Col span="18">
              <Input v-model="formTemp.name" placeholder="请输入"></Input>
            </Col>
            <Col span="4" offset="1">
              <Button @click="handlePrewTemp">预览</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="模版预览" prop="code">
          <Input type="textarea" v-model="formTemp.code" placeholder="请输入" rows="10"></Input>
          <!-- <textarea style="width:100%;height:200px;" v-model="code"></textarea> -->
        </FormItem>
      </Form>

      <div style="text-align: right;">
        <Button
          type="primary"
          @click="handleAddTemp('modalTempImport')"
          style="margin-right:5px;"
        >确定</Button>
        <Button
          type="primary"
          @click="handleEditorCancel('modalTempImport')"
          style="margin-right:5px;"
        >取消</Button>
      </div>
    </Modal>
    <div>
      <Modal v-model="modalTarget" title="添加目标" footer-hide>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="pipeline">
            <Input v-model="formValidate.pipeline" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="类别" prop="type">
            <RadioGroup v-model="formValidate.type">
              <Radio label="消息队列">消息队列</Radio>
              <Radio label="数据库">数据库</Radio>
              <Radio label="已有数据集">已有数据集</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="连接类型" prop="query" v-show="formValidate.type == '消息队列'">
            <Select v-model="formValidate.query" placeholder="请选择">
              <Option
                v-for="(item, index) in queryArr"
                :key="index"
                :value="item.value"
                :label="item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="连接类型" prop="db" v-show="formValidate.type == '数据库'">
            <Select v-model="formValidate.db" placeholder="请选择">
              <Option
                v-for="(item, index) in dbArr"
                :key="index"
                :value="item.value"
                :label="item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="连接类型" prop="historyPipeline" v-show="formValidate.type == '已有数据集'">
            <Select v-model="formValidate.historyPipeline" placeholder="请选择">
              <Option
                v-for="(item, index) in historyPipelineArr"
                :key="index"
                :value="item.value"
                :label="item.label"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem style="text-align: right; padding-top: 10px;">
            <Button type="default" @click="cancel" style="margin-right: 5px;">取消</Button>
            <Button type="primary" @click="ok" style="margin-right: 5px;">确定</Button>
          </FormItem>
        </Form>
      </Modal>

      <!-- 发布弹窗 -->
      <Modal v-model="modalPublish" title="发布配置" @on-ok="okPublish" @on-cancel="cancelPublish">
        <div class>
          <div class="ivu-card-head">
            <p>集群配置</p>
          </div>
          <div style="margin:10px;">
            <tableClusterEnv :nodeData="pipeline" />
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import end from './end'
import endTab from './endTab'
import start from './start'
import emptyStart from './emptyStart'
import startTab from './startTab'
import nodeOne from './nodeOne'
import nodeOneTab from './nodeOneTab'
import nodeTwo from './nodeTwo'
import nodeTwoTab from './nodeTwoTab'
import nodeThree from './nodeThree'
import nodeThreeTab from './nodeThreeTab'
import nodeFour from './nodeFour'
import nodeFourTab from './nodeFourTab'
import pipelineTab from './pipelineTab'
import tableClusterEnv from './tableClusterEnv'
import { getLink, ajaxGetConn } from '@/api/link.js'
import { ajaxGetEnv } from '@/api/env.js'
import { userFunc } from '@/api/user1.js'
import {
  ajaxAddPipeline,
  ajaxGetPipeine,
  ajaxGetPipelineInfo,
  ajaxPublishPipeline,
  ajaxDeletePipeline,
  ajaxEditPipeline,
  ajaxGetDataSource
} from '@/api/pipeline.js'
import { ajaxGetTempList, ajaxAddTemp } from '@/api/export.js'
export default {
  name: 'flowDetail',
  data() {
    let isCanCheckLink = true
    const checkLink = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('模版名称不能为空'))
      } else {
        // 请求后端，获取这个账号名称，如果有数据，就提示有数据
        if (isCanCheckLink) {
          isCanCheckLink = false
          setTimeout(() => {
            let postData = {}
            postData.pageSize = 1000
            postData.pageNum = 1
            postData.dataflowName = value

            ajaxGetTempList(postData)
              .then(res => {
                isCanCheckLink = true
                // res.data 不为空，就是有数据

                if (res.data.status == 'ok') {
                  if (res.data && res.data.data && res.data.data.result_content && res.data && res.data.data && res.data.data.result_content.length) {
                    ;
                    callback(new Error('模版名称重复'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              })
              .catch(err => {
                isCanCheckLink = true
              })
          }, 1000)
        }
      }
    }
    return {
      rows: 10,
      formTempRules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            validator: checkLink,
            trigger: ['change', 'blur']
          }
        ]
      },
      queryTempNameArr: [],
      formTemp: {
        name: '',
        code: ''
      },

      ruleValidate: {},
      modalDebugger: false,
      modalTempImport: false,
      yarnAccountArr: [],
      pipeline: {
        formGenaral: {
          pipeline: '',
          maxParallelism: '智能设置',
          maxParallelismValue: '16',
          jobmanager: '1024',
          taskmanager: '1024',
          isCheckPoint: '1',
          checkPointSplit: '60',
          recovery: '100',
          exactlyOnlyOnce: '1',
          desc: 'pipeline 演示测试',
          sinkArr: []
        },
        formParams: {
          params: [{
            name: '',
            type: '',
            defaultValue: ''
          }]
        },
        drawData: [{
          emptyStart: true,
          haveSet: false,
          tabType: 'starTab',
          leftIndex: 1,
          topIndex: 1

        }],
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
          'checkpointCleanup': 'RETAIN_ON_CANCELLATION'
        }
      },
      formRunConfig: {
        queue: '',
        yarnConn: '',
        flinkConn: '',
        runEnv: '',
        cluster: '',
        mode: ''
      },
      runConnArr: [],
      runEnvArr: [],
      flinkConn: '',
      yarnConn: '',
      publishData: {
        name: '',
        runTime: {
          queue: '',
          yarnConn: '',
          flinkConn: '',
          env: '',
          cluster: '',
          mode: '',
          runUser: '',
          clusterUseArr: []

        },
        config: {
          'checkpointInterval': 0,
          'checkpointMode': 'EXACTLY_ONCE',
          'checkpointCleanup': 'RETAIN_ON_CANCELLATION'

        },
        properties: {
          type: 'flinkdataflow',
          typeProperties: {
            parameters: [
              {
                name: '',
                type: '',
                value: ''
              }
            ],
            sources: [
              {
                name: 'k',
                type: 'kafka',
                arallelism: '',
                cluster: '',
                env: '',
                connection: '',
                account: '',
                settings: [
                  {
                    key: 'inerTableName',
                    value: ''
                  },
                  {
                    key: 'isFlatten',
                    value: 'true'
                  },
                  {
                    key: 'topic',
                    value: ''
                  },
                  {
                    key: 'groupId',
                    value: ''
                  },
                  {
                    key: 'offsetReset',
                    value: '|'
                  },
                  {
                    ke: 'topicIsPattern',
                    value: 'false'
                  },
                  {
                    key: 'sourceDataType',
                    value: ''
                  },
                  {
                    key: 'fieldDelimiter',
                    value: '|'
                  },
                  {
                    key: 'kafka.connector.version'
                  }
                ]
              }
            ],
            sinks: [
              {
                inStream: 'alterRow',
                name: '2',
                type: ' kafka',
                clustr: '',
                env: '',
                connection: '',
                settings: [
                  {
                    key: 'datatopic',
                    value: ''
                  },
                  {
                    key: 'innerTableName',
                    value: ''
                  },
                  {
                    key: 'sinkDataType',
                    value: 'avro'
                  },
                  {
                    key: 'fieldDelimiter',
                    value: '|'
                  },
                  {
                    key: 'schemaInfo',
                    value: ''
                  },

                  {
                    key: 'enableKeyPartitions',
                    value: 'true' // 默认值，不让用户操作
                  },
                  {
                    key: 'partitionKeys',
                    value: '' // 默认空值不让用户操作
                  },
                  {
                    key: "kafka.co'nect'rversion", // 同上
                    value: 'universal'
                  }
                ]
              }
            ],
            transformations: [
              {
                instream: 'k',
                name: 'filterRow',
                conditins: [
                  {
                    type: 'column2',
                    condition: 'op_type == "" ',
                    expression:
                      'if (before.$$ != null) { after.$$ = before.$$ }'
                  }
                ]
              }
            ]
          }
        }
      },
      modalPublish: false,
      collapseValuePublish: '1',
      modeArr: [
        {
          label: 'yarn',
          value: 'yarnApp'
        },
        {
          label: 'standalone',
          value: 'standalone'
        }
      ],
      colonyArr: [],
      envArr: [],
      code: '',
      cannotEditor: true,
      copySinkData: {}, // 记录下目标的值
      modalTarget: false,
      historyPipelineArr: [],
      rueValidate: {},
      formValidate: {
        pipeline: '',
        type: '消息队列',
        query: '',
        db: '',
        historyPipeline: ''
      },
      queryArr: [
        {
          label: 'kafka',
          value: 'kafka'
        }
      ],
      dbArr: [
        {
          label: 'hbase',
          value: 'hbase'
        },
        {
          label: 'hive',
          value: 'hive'
        }
      ],
      activedIndex: 0,
      modal1: false,
      modal2: false,
      curTabName: 'pipelineTab',
      mode: '',
      runEnv: '',
      cluster: '',
      pipeline: {
        formGenaral: {
          pipeline: '',
          maxParallelism: '智能设置',
          maxParalleli: '',
          smValue: '16',
          jobmanager: '1024',
          taskmanager: '124',
          isCheckPoint: '1',
          checkPointSplit: '60',
          recovery: '100',
          exactlyOnlyOnce: '1',
          desc: 'pipeline 演示测试',
          sinkArr: []
        },
        formParams: {
          params: [
            {
              name: '',
              type: '',
              defaultValue: ''
            }
          ]
        },
        runTime: {
          queue: '',
          yarnConn: '',
          flinkConn: '',
          env: '',
          cluster: '',
          mode: '',
          runUser: '',
          yarnAccount: '',
          clusterUseArr: []
        },
        config: {
          'checkpointInterval': 0,
          'checkpointMode': 'EXACTLY_ONCE',
          'checkpointCleanup': 'RETAIN_ON_CANCELLATION'

        },
        drawData: [
          {
            emptyStart: true,
            haveSet: false,
            tabType: 'starTab',
            leftIndex: 1,
            topIndex: 1
          }
        ]
      },
      drawIndex: 0,
      witch: false,
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-mysql',
        line: true,
        extraKeys: {
          Ctrl: 'autocomplete'
        }
      }

    }
  },
  computed: {
    zjName() {
      return this.curTabName
    },
    isDisabled() {
      return (this.pipeline && this.pipeline.runTime && this.pipeline.runTime.clusterUseArr && this.pipeline.runTime.clusterUseArr.length == 0)
    }
  },
  components: {
    // codemirror,
    tableClusterEnv,
    emptyStart,
    start,
    end,
    endTab,
    startTab,
    nodeOne,
    nodeOneTab,
    nodeTwo,
    nodeTwoTab,
    nodeThree,
    nodeThreeTab,
    nodeFour,
    nodeFourTab,
    pipelineTab
  },
  activated() { },
  methods: {
    handleChangeTemp(val) {
      let postData = {}
      // postData.name = ''
      // ajaxGetTempByName(postData).then(res => {

      // })
      let arr = this.queryTempNameArr.filter(item => {
        return item.value == val
      })
      // arr.length && (this.formTemp.code = JSON.stringify(arr[0].code, null, 4))
      if (arr.length) {
        arr[0].code.pipeline = this.$route.query.dataflow_name
        arr[0].code.formGenaral && (arr[0].code.formGenaral.pipeline = this.$route.query.dataflow_name)
        this.formTemp.code = JSON.stringify(arr[0].code, null, 4)
      }
    },
    getQueryTempNameArr() {
      let postData = {}
      postData.pageSize = 1000
      postData.pageNum = 1
      ajaxGetTempList(postData).then(res => {
        if (res.data && (res.data.status == 'ok')) {
          let arr = res.data && res.data.data && res.data.data.result_content || []
          arr = arr.map(item => {
            let obj = {}
            // TODO 后期会改
            obj.value = item.dataflow_documentId
            obj.code = {}
            let contentObj = {}
            item.dataflow_content && (contentObj = JSON.parse(item.dataflow_content))
            obj.label = contentObj.dataflow_name || ''
            contentObj.draw_code && (obj.code = JSON.parse(contentObj.draw_code))
            return obj
          })
          this.queryTempNameArr = [].concat(arr)
        }
      })
    },
    handlePrewTemp() {
      let name = this.formTemp.name
      if (!name) {
        this.$Message.error('请先输入模版名称')
        return
      }
      this.handleTempSave()
    },
    handleFire(name) {
      if (name == 'script') {
        this.handleCode()
      } else if (name == 'save') {
        this.formTemp.name = ''
        this.handleTempSave()
      } else {
        this.formTemp.code = ''
        this.handleTemp()
      }
    },
    handleTempSave(name) {
      let pipelineName = name || ''
      let obj = JSON.parse(JSON.stringify(this.pipeline))
      obj.pipeline = pipelineName
      obj.formGenaral.pipeline = pipelineName
      this.formTemp.code = JSON.stringify(obj, null, 4)
      this.modelShow('modalTempImport')
    },
    handleTemp() {
      this.getQueryTempNameArr()
      this.code = JSON.stringify(this.pipeline, null, 4)
      this.modelShow('modalDebugger')
    },
    getYarnAccountArr() {
      let postData = {}
      postData.pageSize = 1000
      postData.pageNum = 1
      userFunc.getTableDataAai(postData).then(res => {
        if (res.data.status == 'ok') {
          this.yarnAccountArr = res.data.data.list
        }
      })
    },
    setDataSource(sourceArr) {
      this.pipeline.drawData.map(d => {
        sourceArr.map(source => {
          if (d.formSource && d.formSource.outputStream == source.name) {
            d.tableDataInspect = [].concat(source.data)
          }
        })

        console.log(d)
      })
    },
    setSinkData(targetData, sourceArr) {
      let sourceNode = this.pipeline.drawData.filter(node => {
        return (
          node.leftIndex == 1 && node.topIndex == targetData.nodeData.topIndex
        )
      })
      let sourceDataArr = sourceArr.filter(source => {
        return source.name == sourceNode[0].formSource.outputStream
      })
      this.pipeline.drawData.map(d => {
        if (
          d.leftIndex == targetData.nodeData.leftIndex &&
          d.topIndex == targetData.nodeData.topIndex
        ) {
          d.tableDataInspectSource = [].concat(sourceDataArr[0].data)
        }
      })
    },
    handleGetDataSource(targetData) {
      let that = this
      let postData = {}
      let obj = this.handleFormat(this.pipeline)
      postData.dataflowName = this.publishData.name || this.pipeline.formGenaral.pipeline
      postData.dataflowConfig = JSON.stringify(obj)
      postData.dataflowType = 'flinkdataflow'

      ajaxGetDataSource(postData).then(res => {
        if (res.data.status == 'ok') {
          let obj = JSON.parse(res.data.data)
          let sourceArr = obj.info
          that.setDataSource(sourceArr)

          if (targetData.nodeData) {
            this.setSinkData(targetData, sourceArr)
          }
        }
      })
    },
    handleSave() {
      let postData = {}
      postData.dataflow_documentId = this.$route.query.pipelineId || this.$route.query.dataflow_documentId
      postData.dataflow_content = {}
      let obj = this.handleFormat(this.pipeline)
      postData.dataflow_content.dataflow_config = JSON.stringify(obj)
      postData.dataflow_content.draw_code = JSON.stringify(this.pipeline)
      postData.dataflow_content.dataflow_type = this.$route.query.dataflow_type || 'flinkdataflow'
      postData.dataflow_content.dataflow_name = this.pipeline.formGenaral.pipeline
      postData.dataflow_content = JSON.stringify(postData.dataflow_content)
      console.log(postData)
      ajaxEditPipeline(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.$Message.success('编辑成功')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通信失败')
        })
    },
    okPublish() {
      console.log('=======this.publishData', this.publishData)
      let obj = this.handleFormat(this.pipeline)
      this.handleSave()
      let postData = {}
      postData.dataflowName = this.publishData.name
      postData.dataflowConfig = JSON.stringify(this.publishData)
      postData.dataflowType = 'flindataflow'
      postData.drawCode = JSON.stringify(this.pipeline)
      // TODO test

      ajaxPublishPipeline(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.$Message.success(res.data.message || '发布成功')
          } else {
            this.$Message.error(res.data.meessage || '发布失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通信失败，请稍后再试')
        })
    },
    cancelPublish() { },
    changeCluster(val) {
      let arr = this.colonyArr.filter(item => {
        return item.name == val; ''
      })
      this.envArr = [].concat(arr[0].envVOList)
      // 查询当前集群下的'有连接'
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          this.runConnArr = [].concat(res.data.data.list)
        }
      })
    },
    getClusterArr() {
      let postData = {}
      let that = this
      postData.pageSize = 1000
      postData.pageNum = 1

      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          that.colonyArr = [].concat(res.data.data.list)
        }
      })
    },
    ok() { },
    cancel() { },
    handleCanEditor() {
      this.cannotEditor = false
    },
    handleAddTemp(key) {
      this.handlePrewTemp()
      let postData = {}
      postData.dataflowType = 'flinkdataflow'
      postData.dataflowName = this.formTemp.name
      postData.dataflowConfig = ''
      postData.drawCode = JSON.parse(JSON.stringify(this.formTemp.code))
      if (this.formTemp.name) {
        ajaxAddTemp(postData).then(res => {
          if (res.data.status == 'ok') {
            this.$Message.success('模版生成成功')
            this[key] = false
          } else {
            this.$Message.error('模版生成失败')
          }
        })
      }
    },
    handleEditor(key) {
      let str = this.formTemp.code
      this.pipeline = JSON.parse(str)
      this.cannotEditor = 'true;'
      this[key] = false
    },
    handleEditorCancel(key) {
      this.code = JSON.stringify(this.pipeline, null, 4)
      this[key] = false
    },
    getServe(item) {
      let linkArr = localStorage.getItem('linkArr')
        ? JSON.parse(localStorage.getItem('linkArr'))
        : []
      let curLink = linkArr.filter(link => {
        return (
          link.iscolony = item.formLink.colony &&
          item.formLink.link == link.link
        ); ''
      })

      return curLink.length ? curLink[0].server : ''
    },
    getSources(pipelineCode) {
      let sourceNodes = []
      sourceNodes = pipelineCode.drawData.filter(item => {
        return item.start
      })
      let sources = []
      sources = sourceNodes.map(item => {
        let publishCluserArr = pipelineCode.runTime.clusterUseArr.filter(cluster => { return cluster.cluster == item.formLink.colony })
        let envValue = (publishCluserArr[0] && publishCluserArr[0].env) || ''
        envValue = envValue == '-1' ? '' : envValue
        let obj = {
          name: item.formSource.outputStream,
          type: item.type || 'kafka',

          cluster: item.formLink.colony,
          env: envValue,
          connection: item.formLink.link,
          account: item.formLink.username,
          settings: [
            // parallelism:

            {
              key: 'parallelism', // 去掉
              value: item.formSource.isParallelism == '0' ? 1 : item.formSource.parallelismValue //
            },
            {
              key: 'bootstrapServers', // 去掉
              value: ''
            },
            {
              key: 'schemaInfo', // 去掉
              value: item.formSource.schemaInfo || ''
            },
            {
              key: 'innerTableName',
              value: item.formSource.outputStream
            },
            {
              key: 'isFlatten', // 不让用户输
              value: 'true'
            },
            {
              key: 'topic',
              value: item.formLink.datatopic
            },
            {
              key: 'groupId',
              value: item.formSource.groupId
            },
            {
              key: 'offsetReset',
              value:
                item.formSource.offsetReset == '0'
                  ? item.formSource.offsetResetValue || 'latest'
                  : item.formSource.offsetReset || 'latest'
            },
            {
              key: 'topicIsPattern', // 不让用户选择
              value: 'false'
            },
            {
              key: 'sourceDataType', // 数据源的类型["json","avro","text"]
              value: item.formSource.format || 'avro'
            },
            {
              key: 'fieldDelimiter', // 字段分隔符，默认|+|
              value: item.formSource.fieldDelimiter || '|'
            },
            {
              key: 'kafka.connector.version', // 默认，universal
              value: item.formSource.version || 'universal'
            }
          ]
        }
        return obj
      })
      return sources
    },
    getBeforeInStream(pipelineCode, curNode) {
      let beforeNode = pipelineCode.drawData.filter(item => {
        return (
          curNode.topIndex == item.topIndex &&
          curNode.leftIndex - 1 == item.leftIndex
        )
      })
      return beforeNode.length ? beforeNode[0].formSource.outputStream : ''
    },
    hbaseGetSinkObj(pipelineCode, item) {
      let publishCluserArr = pipelineCode.runTime.clusterUseArr.filter(cluster => { return cluster.cluster == item.formLink.colony })
      let envValue = (publishCluserArr[0] && publishCluserArr[0].env) || ''
      envValue = envValue == '-1' ? '' : envValue
      let obj = {
        inStream: this.getBeforeInStream(pipelineCode, item),
        name: item.formSource.outputStream,
        type: item.type,
        cluster: item.formLink.colony,
        env: envValue,
        connection: item.formLink.link,
        account: item.formLink.username,
        settings: [
          {
            key: 'parallelism', // 去掉
            value: item.formSource.isParallelism == '0' ? 1 : item.formSource.parallelismValue //
          },
          {
            key: 'innerTableName',
            value: item.formSource.outputStream
          },
          {
            key: 'schemaInfo',
            value: item.formSource.schemaInfo || ''
          },
          {
            key: 'sourceDataType',
            value: item.formSource.format || 'avro'
          },
          {
            key: 'tableName',
            value: item.formLink.datatopic
          },
          {
            key: 'rowkeyFields',
            value: item.formSource.rowkeyFields || 'CUST_CODE,ORDER_DATE'
          },
          {
            key: 'writeRowkey',
            value: item.formSource.writeRowkey || ''
          },
          {
            key: 'readRowkey',
            value: item.formSource.readRowkey || ''
          }
        ],
        columnUpdate: {
          dynamicColumn: 'false',
          columnMaps: item.formSourceOption.rule.map(item => {
            let obj = {}
            obj.type = item.modeType
            obj.origin = item.input
            obj.target = item.output
            return obj
          })
        }
      }
      return obj
    },
    kafkaGetSinkObj(pipelineCode, item) {
      let publishCluserArr = pipelineCode.runTime.clusterUseArr.filter(cluster => { return cluster.cluster == item.formLink.colony })
      let envValue = (publishCluserArr[0] && publishCluserArr[0].env) || ''
      envValue = envValue == '-1' ? '' : envValue
      let obj = {
        inStream: this.getBeforeInStream(pipelineCode, item),
        name: item.formSource.outputStream,
        type: item.type,
        cluster: item.formLink.colony,
        env: envValue,
        connection: item.formLink.link,
        account: item.formLink.username,
        settings: [
          {
            key: 'parallelism', // 去掉
            value: item.formSource.isParallelism == '0' ? 1 : item.formSource.parallelismValue //
          },
          {
            key: 'bootstrapServers', // 去掉
            value: ''
          },
          {
            key: 'schemaInfo',
            value: item.formSource.schemaInfo || ''
          },
          {
            key: 'topic',
            value: item.formLink.datatopic
          },
          {
            key: 'innerTableName',
            value: item.formSource.outputStream
          },
          {
            key: 'sinkDataType',
            value: item.formSource.format || 'avro'
          },
          {
            key: 'fieldDelimiter',
            value: item.formSource.fieldDelimiter || '|'
          },

          {
            key: 'enableKeyPartitions',
            value: 'true' // 默认值，不让用户操作
          },
          {
            key: 'partitionKeys',
            value: '' // 默认空值不让用户操作
          },
          {
            key: 'kafka.connector.version', // 同上
            value: item.formSource.version || 'universal'
          }
        ],
        columnUpdate: {
          dynamicColumn: 'false',
          columnMaps: item.formSourceOption.rule.map(item => {
            let obj = {}
            obj.type = item.modeType
            obj.origin = item.input
            obj.target = item.output
            return obj
          })
        }
      }
      return obj
    },
    getSinks(pipelineCode) {
      let sinkNodes = []
      sinkNodes = pipelineCode.drawData.filter(item => {
        return item.tabType == 'endTab'
      })
      let sinks = []
      sinks = sinkNodes.map(item => {
        let obj = this[item.type + 'GetSinkObj'] ? (this[item.type + 'GetSinkObj'](pipelineCode, item)) : (this.kafkaGetSinkObj(pipelineCode, item))
        return obj
      })
      return sinks
    },
    // formSourc eOption
    getTransformations(pipelineCode) {
      let tranNodes = []
      tranNodes = pipelineCode.drawData.filter(item => {
        return item.nodeOne
      })
      let trans = []
      trans = tranNodes.map(item => {
        let oo = {
          inStream: this.getBeforeInStream(pipelineCode, item),
          name: item.formSource.outputStream,
          // 'type': item.type,
          type: 'alterrow',
          conditions: item.formSource.rows.map(item => {
            let obj = {}
            obj.op = item.columnName
            obj.type = item.columnType
            obj.condition = item.type
            obj.columnelectExpression =
              obj.type == 'normal' ? '' : item.columnSelectExpression
            obj.expression = item.format
            return obj
          })
        }
        return oo
      })
      return trans
    },
    handleGetClusterEnv(pipelineCode, isPublish) {
      let arr = []
      arr = pipelineCode.runTime.clusterUseArr.map(item => {
        let obj = {}
        for (let k in item) {
          obj[k] = item[k]
        }
        obj.ver = -1
        obj.env = obj.env == '-1' ? '' : obj.env
        if (!isPublish) {
          obj.env = ''
        }
        return obj
      })
      return arr
    },
    handleGetConnVer(pipelineCode) {
      let arr = []
      let arrObj = {}
      pipelineCode.drawData.map(item => {
        if ((item.tabType == 'endTab' || item.tabType == 'startTab') &&
          item.formLink.link &&
          (!((item.formLink.colony + '_' + item.formLink.link) in arrObj))
        ) {
          arrObj[item.formLink.colony + '_' + item.formLink.link] = 1
          arr.push({
            'cluster': item.formLink.colony,
            'connect': item.formLink.link,
            'ver': -1
          })
        }
      })
      //  从发布的配置中获取
      if ((!(pipelineCode.runTime.cluster + '_' + pipelineCode.runTime.yarnConn in arrObj)) && pipelineCode.runTime.yarnConn) {
        arr.push({
          'cluster': pipelineCode.runTime.cluster,
          'connect': pipelineCode.runTime.yarnConn,
          'ver': -1
        })
      }
      if ((!(pipelineCode.runTime.cluster + '_' + pipelineCode.runTime.flinkConn in arrObj)) && pipelineCode.runTime.flinkConn) {
        arr.push({
          'cluster': pipelineCode.runTime.cluster,
          'connect': pipelineCode.runTime.flinkConn,
          'ver': -1
        })
      }
      return arr
    },
    handleAccountVer(pipelineCode) {
      let arr = []
      let arrObj = {}
      // 从drawData 中获取
      pipelineCode.drawData.map(item => {
        if ((item.tabType == 'endTab' || item.tabType == 'startTab') &&
          item.formLink.link &&
          (!((item.formLink.colony + '_' + item.formLink.username) in arrObj))
        ) {
          arrObj[item.formLink.colony + '_' + item.formLink.username] = 1
          arr.push({
            'cluster': item.formLink.colony,
            'account': item.formLink.username,
            'ver': -1
          })
        }
      })
      //  从发布的配置中获取
      if (!(pipelineCode.runTime.cluster + '_' + pipelineCode.runTime.yarnAccount in arrObj)) {
        arr.push({
          'cluster': pipelineCode.runTime.cluster,
          'account': pipelineCode.runTime.yarnAccount,
          'ver': -1
        })
      }
      return arr
    },
    handleFormat(pipelineCode, isPublish) {
      let ppleCode = {}
      ppleCode.name = pipelineCode.formGenaral.pipeline
      ppleCode.properties = {}
      ppleCode.properties.type = 'flinkdataflow'
      ppleCode.properties.typeProperties = {}

      ppleCode.properties.typeProperties.config = {}
      ppleCode.properties.typeProperties.config.checkpointInterval = (this.pipeline.config.checkpointInterval || 0) * 60 * 1000
      ppleCode.properties.typeProperties.config.checkpointMode = this.pipeline.config.checkpointMode
      ppleCode.properties.typeProperties.config.checkpointCleanup = this.pipeline.config.checkpointCleanup

      // 增加的运行的参数
      ppleCode.runTime = {}
      // ppleCode.runTime.cluster = this.publishData.runTime.cluster // 运行集群
      // ppleCode.runTime.env = this.publishData.runTime.env // 运行环境
      // ppleCode.runTime.mode = this.publishData.runTime.mode
      // ppleCode.runTime.flinkConn = this.publishData.runTime.flinkConn
      // ppleCode.runTime.yarnConn = this.publishData.runTime.yarnConn
      // ppleCode.runTime.queue = this.publishData.runTime.queue
      // ppleCode.runTime.taskSlots = this.publishData.runTime.taskSlots
      ppleCode.runTime.maxParallelism = this.pipeline.formGenaral.maxParallelismValue
      let publishCluserArr = pipelineCode.runTime.clusterUseArr.filter(item => { return item.cluster == pipelineCode.runTime.cluster })

      ppleCode.runTime.cluster = pipelineCode.runTime.cluster
      ppleCode.runTime.env = (publishCluserArr[0] && publishCluserArr[0].env) || ''
      // 如果是默认环境设置成空
      ppleCode.runTime.env = ppleCode.runTime.env == '-1' ? '' : ppleCode.runTime.env
      ppleCode.runTime.mode = pipelineCode.runTime.mode
      ppleCode.runTime.flinkConn = pipelineCode.runTime.flinkConn
      ppleCode.runTime.yarnConn = pipelineCode.runTime.yarnConn
      ppleCode.runTime.queue = pipelineCode.runTime.queue
      ppleCode.runTime.taskSlots = pipelineCode.formGenaral.taskSlots || 2
      ppleCode.runTime.jobMem = pipelineCode.formGenaral.jobmanager
      ppleCode.runTime.taskMem = pipelineCode.formGenaral.taskmanager
      ppleCode.runTime.runUser = pipelineCode.runTime.runUser
      ppleCode.runTime.clusterUseArr = [].concat(pipelineCode.runTime.clusterUseArr)
      // 把是默认环境的env改成空，给后端对接。前端要反响转
      // ppleCode.runTime.clusterUseArr = pipelineCode.runTime.clusterUseArr.map(item => {
      //   let oo = {}
      //   for (let k in item) {
      //     oo[k] = item[k]
      //   }
      //   oo.env = oo.env == '-1' ? '' : oo.env
      //   return oo
      // })
      // ============获取pipeline 发布时 集群环境，集群账号，集群连接的关系
      ppleCode.runTime.clusterEnv = this.handleGetClusterEnv(pipelineCode, isPublish)
      ppleCode.runTime.connVer = this.handleGetConnVer(pipelineCode)
      ppleCode.runTime.accountVer = this.handleAccountVer(pipelineCode)

      ppleCode.properties.typeProperties.parameters = pipelineCode.formParams.params.map(
        item => {
          let obj = JSON.parse(JSON.stringify(item))
          obj.value = obj.defaultValue
          delete obj.defaultValue
          delete obj['_index']
          delete obj['_rowKey']
          return obj
        }
      )
      ppleCode.properties.typeProperties.sources = []
      ppleCode.properties.typeProperties.sources = this.getSources(pipelineCode)
      ppleCode.properties.typeProperties.sinks = []
      ppleCode.properties.typeProperties.sinks = this.getSinks(pipelineCode)
      ppleCode.properties.typeProperties.transformations = []
      ppleCode.properties.typeProperties.transformations = this.getTransformations(pipelineCode)
      return ppleCode
      // return pipelineCode
    },
    handleCode() {
      let obj = this.handleFormat(this.pipeline, true)
      // this.code = JSON.stringify(this.pipeline, null, 4)
      this.code = JSON.stringify(obj, null, 4)
      this.modelShow('modal1')
    },
    handleSetActivedIndex(index) {
      this.activedIndex = index
    },
    handleDelete(index) {
      // TODO 暂时 还没想好删除的逻辑
      // 1:相同的leftIndex下 topIndex >deleteData 的topIndex  topIndex -1
      // 2:相同的topIndex下的 leftIndex >deleteData 的leftIndex  leftIndex -1
      let deleteData = this.pipeline.drawData[index]
      // TODO 需要明确下leftIndex 和topIndex 的初始值，
      this.pipeline.drawData.map((item, idx) => {
        if (
          (item.leftIndex || 1) == (deleteData.leftIndex || 1) &&
          index != idx
        ) {
          if (item.topIndex > deleteData.topIndex) {
            item.topIndex -= 1
          }
        }
        if (
          (item.topIndex || 0) == (deleteData.topIndex || 0) &&
          index != idx
        ) {
          if (item.leftIndex > deleteData.leftIndex) {
            item.leftIndex -= 1
          }
        }
      })
      this.pipeline.drawData.splice(index, 1)
    },
    modelShow(key) {
      this[key] = true
    },
    handleSetPipeline(e) {
      this.curTabName = 'pipelineTab'
    },
    handleDeleteStart(index) {
      this.pipelinedrawData.splice(index, 1)
    },
    handleSetSource(postData) {
      let index = postData.index
      delete postData.index
      this.curTabName = postData.tabType
      this.$set(this.pipeline.drawData, index, postData)
    },
    handleSetEnd(postData) {
      let index = postData.index
      delete postData.index
      this.curTabName = postData.tabType
      // this.$set(this.pipeline.drawData, index, postData)
    },
    handlePublish() {
      this.modalPublish = true
      let obj = this.handleFormat(this.pipeline, true)
      this.publishData = JSON.parse(JSON.stringify(obj))
      let postData = {}
      postData.pageSize = 1000
      postData.pageNum = 1
      ajaxGetEnv(postData).then(res => {
        if (res.data.status == 'ok') {
          this.runEnvArr = [].concat(res.data.data.list)
        }
      })
    },

    handleValidate() { },
    handleRefresh() { },
    handleAddStart(nodeData) {
      this.curTabName = nodeData.tabType
      this.pipeline.drawData.push(nodeData)
      this.activedIndex = this.pipeline.drawData.length - 1
    },
    handleSetEmptyStart(nodeData) {
      // 修改了添加源节点的位置
      let index = nodeData.index
      delete nodeData.index
      this.$set(this.pipeline.drawData, index, nodeData)
    },
    handleAddNode(nodeData) {
      if (0) {
        this.modalTarget = true
      } else {
        let index = nodeData.index
        delete nodeData.index
        // this.pipeline.drawData.splice(index + 1, 0, nodeData)

        // 和删除的逻辑topIndex xiangtong ，把-1变成+1
        let length = this.pipeline.drawData.length
        this.pipeline.drawData.map((item, idx) => {
          if ((item.topIndex || 0) == (nodeData.topIndex || 0)) {
            if (item.leftIndex >= nodeData.leftIndex) {
              item.leftIndex += 1
            }
          }
        })

        this.pipeline.drawData.push(nodeData)
        this.activedIndex = this.pipeline.drawData.length - 1
      }
    },
    setPipeline() {
      let postData = {}
      postData.dataflowName = this.$route.query.dataflow_name || this.$route.query.pipeline
      postData.documentId = this.$route.query.dataflow_documentId || this.$route.query.pipelineId
      postData.pageSize = 1000
      postData.pageNum = 1
      postData.dataflowType = 'flinkdataflow'
      ajaxGetPipelineInfo(postData).then(res => {
        if (res.data.status == 'ok') {
          if (res.data.data.result_content) {
            let oo = JSON.parse(res.data.data.result_content)
            if (oo.draw_code) {
              // 后端默认环境取之为空，前端是-1，需要转一下
              let obj = JSON.parse(oo.draw_code)
              obj.runTime && obj.runTime.clusterUseArr && obj.runTime.clusterUseArr.map(item => {
                // item.env = item.env == '' ? '-1' : item.env
                return item
              })
              this.pipeline = obj
            } else {
              this.pipeline = {
                formGenaral: {
                  pipeline: postData.dataflowName,
                  maxParallelism: '智能设置',
                  maxParallelismValue: '16',
                  jobmanager: '1024',
                  taskmanager: '1024',
                  isCheckPoint: '1',
                  checkPointSplit: '60',
                  recovery: '100',
                  exactlyOnlyOnce: '1',
                  desc: 'pipeline 演示测试',
                  sinkArr: []
                },
                runTime: {
                  queue: '',
                  yarnConn: '',
                  flinkConn: '',
                  env: '',
                  cluster: '',
                  mode: '',
                  runUser: '',
                  yarnAccount: '',
                  clusterUseArr: []
                },
                config: {
                  'checkpointInterval': 0,
                  'checkpointMode': 'EXACTLY_ONCE',
                  'checkpointCleanup': 'RETAIN_ON_CANCELLATION'

                },
                formParams: {
                  params: [{
                    name: '',
                    type: '',
                    defaultValue: ''
                  }]
                },
                drawData: [{
                  emptyStart: true,
                  haveSet: false,
                  tabType: 'starTab',
                  leftIndex: 1,
                  topIndex: 1

                }]
              }
            }
            // this.pipeline = JSON.parse(
            //   JSON.parse(res.data.data.result_content).draw_code
            // )
          }
        }
      })
    },
    getColonyArr() {
      let colonyArrStr = localStorage.getItem('colonyArr')

      if (colonyArrStr) {
        this.colonyArr = JSON.parse(colonyArrStr)
      }
    }
  },
  beforeCreate() { },
  destroyed() {
    this.setPipeline()
  },
  watch: {
    $route(to, from) {
      if (to.name == 'flowDetail') {
        this.setPipeline()
      }
    }
  },
  created() {
    this.setPipeline()
    this.curTabName = 'pipelineTab'
    this.$bus.on('getDataSource', this.handleGetDataSource)
  },
  mounted() {
    this.getColonyArr()
    this.getClusterArr()
    this.getYarnAccountArr()
  }
}
</script>
<style lang="less" scoped>
.flex {
  display: -webkit-flex;
  display: flex;
  flex-flow: column;
  .flex-top {
  }
}
</style>
<style>
.nodeWrapper .sourceNode {
  background: url("../../../assets/images/defaultStart.png") no-repeat center
    center;
  background-size: 100%;
}
.isCurIndex .nodeWrapper .sourceNode {
  background: url("../../../assets/images/activedStart.png") no-repeat center
    center;
  background-size: 100%;
}
.nodeWrapper .endNode {
  background: url("../../../assets/images/defaultEnd.png") no-repeat center
    center;
  background-size: 100%;
}
.isCurIndex .nodeWrapper .endNode {
  background: url("../../../assets/images/activedEnd.png") no-repeat center
    center;
  background-size: 100%;
}

.isCurIndex .nodeWrapper .node {
  background: url("../../../assets/images/activedNode.png") no-repeat center
    center;
  background-size: 100%;
}
.nodeWrapper .node {
  background: url("../../../assets/images/defaultNode.png") no-repeat center
    center;
  background-size: 100%;
}

.nodeWrapper > .relative {
  height: 123px;
}
.emptyNode .ivu-icon {
  color: #ddd !important;
}
.isCurIndex .ivu-icon {
  color: rgb(19, 122, 209) !important;
}
.nodeWrapper .handleIcon {
  width: 55px !important;

  line-height: 123px !important;
}
.activedNode {
  color: #348fed;
}
.nodeWrapper {
  cursor: pointer !important;
  z-index: 2;
}
.nodeWrapper .btnAdd:hover button {
  background-color: transparent !important;
}
.nodeWrapper.endNode .emptyNode {
  background: url("../../../assets/images/defaultEnd.png") no-repeat center
    center;
  background-size: 100%;
}
/* TDDO 要去掉*/
</style>
