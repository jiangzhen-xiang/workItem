<template>
  <div>
    <div class="top">
      <div class="wrapper">
        <div
          id="flowPipelineGraph"
          style="height:300px;position:relative;overflow:auto;"
          @click="handleSetPipeline"
        >
          <div v-for="(item, index) in pipeline.drawData">
            <!-- <div v-if="item.emptyStart">
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
            </div>-->
            <div v-if="item.start">
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
    </div>
    <!-- <div class="bottom" style="padding:20px;">
      <component :is="zjName" :pipeline="pipeline" :nodeData="pipeline.drawData[this.activedIndex]"></component>
    </div>-->
    <Modal v-model="modal1" title="脚本预览" footer-hide>
      <!-- <div class="sqlWarraper cm-s-sqlTheme .cm-s-ambiance">
        <codemirror
          ref="myCm"
          :value="code"
          :options="cmOptions"
          @ready="onCmReady"
          @focus="onCmFocus"
          @input="onCmCodeChange"
        ></codemirror>
      </div>-->
      <textarea style="width:100%;height:200px;" :disabled="cannotEditor" v-model="code"></textarea>
      <div>
        <Button
          type="primary"
          @click="handleCanEditor"
          style="margin-right:5px;"
          v-if="cannotEditor"
        >编辑</Button>
        <Button type="primary" @click="handleEditor" style="margin-right:5px;" v-else>确定</Button>
        <Button type="primary" @click="handleEditorCancel" style="margin-right:5px;">取消</Button>
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
        <Collapse v-model="collapseValuePublish">
          <Panel name="1">
            运行参数配置
            <div class="wrapper" slot="content">
              <Form
                ref="formValidate"
                :model="formRunConfig"
                :rules="ruleValidate"
                :label-width="80"
              >
                <FormItem label="运行模式" prop="mode">
                  <Select
                    v-model="publishData.runTime.mode"
                    size="small"
                    placeholder="请选择运行模式"
                    transfer
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in modeArr"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="运行集群" prop="cluster">
                  <Select
                    v-model="publishData.runTime.cluster"
                    size="small"
                    placeholder="请选择运行集群"
                    @on-change="changeCluster"
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in colonyArr"
                      :label="item.name"
                      :value="item.name"
                      :key="index"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="运行环境" prop="env">
                  <Select
                    v-model="publishData.runTime.env"
                    size="small"
                    placeholder="请选择运行环境"
                    transfer
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in envArr"
                      :label="item.name"
                      :value="item.name"
                      :key="index"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="flink连接" prop="flinkConn">
                  <Select
                    v-model="publishData.runTime.flinkConn"
                    size="small"
                    placeholder="请选择flink连接"
                    transfer
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in runConnArr"
                      v-if="
                        item.clusterName == publishData.runTime.cluster &&
                          item.connType == 'flink'
                      "
                      :label="item.connName"
                      :value="item.connName"
                      :key="index"
                    >{{ item.connName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="yarn 连接" prop="yarnConn">
                  <Select
                    v-model="publishData.runTime.yarnConn"
                    size="small"
                    placeholder="请选择yarn连接"
                    transfer
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in runConnArr"
                      v-if="
                        item.clusterName == publishData.runTime.cluster &&
                          item.connType == 'yarn'
                      "
                      :label="item.connName"
                      :value="item.connName"
                      :key="index"
                    >{{ item.connName }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="queue" prop="queue">
                  <Input v-model="publishData.runTime.queue" size="small" placeholder="请输入队列"></Input>
                </FormItem>
                <FormItem label="账号" prop="yarnAccount">
                  <Select
                    v-model="publishData.runTime.yarnAccount"
                    size="small"
                    placeholder="请选择yarn账号"
                    transfer
                  >
                    <Option
                      value="name"
                      v-for="(item, index) in userNameArr"
                      :label="item.connName"
                      :value="item.connName"
                      :key="index"
                    >{{ item.connName }}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
            <!-- <div class="wrapper" slot="content">
              <ul>

              </ul>
            </div>-->
          </Panel>
          <Panel name="2">
            节点环境配置
            <div class="wrapper" slot="content">
              <ul>
                <li
                  class="flex"
                  style="flex-direction: row;margin-bottom:24px;"
                  v-for="(source, index) in publishData.properties
                    .typeProperties.sources"
                  :key="index"
                >
                  <div class="left" style="margin-right:10px;line-height:22px;">
                    <span>源&nbsp;名称:{{ source.name }}</span>
                    <Divider type="vertical" />
                    <span>应用集群:{{ source.cluster }}</span>
                    <Divider type="vertical" />运行环境:
                  </div>
                  <div style="flex-grow:1;">
                    <Select v-model="source.env" placeholder="请选择" size="small">
                      <Option
                        v-for="(env, index) in runEnvArr"
                        v-show="env.clusterName == source.cluster"
                        :key="index"
                        :value="env.name"
                        :label="env.name"
                      >{{ env.name }}</Option>
                    </Select>
                  </div>
                </li>
                <li
                  class="flex"
                  style="flex-direction: row;margin-bottom:24px;"
                  v-for="(sink, index) in publishData.properties.typeProperties
                    .sinks"
                  :key="index"
                >
                  <div class="left" style="margin-right:10px;line-height:22px;">
                    <span>目标名称:{{ sink.name }}</span>
                    <Divider type="vertical" />
                    <span>应用集群:{{ sink.cluster }}</span>
                    <Divider type="vertical" />运行环境:
                  </div>
                  <div style="flex-grow:1;">
                    <Select v-model="sink.env" placeholder="请选择" size="small">
                      <Option
                        v-for="(env, index) in runEnvArr"
                        v-show="env.clusterName == sink.cluster"
                        :key="index"
                        :value="env.name"
                        :label="env.name"
                      >{{ env.name }}</Option>
                    </Select>
                  </div>
                </li>
              </ul>
            </div>
          </Panel>
        </Collapse>
      </Modal>
    </div>
  </div>
</template>
<script>
import end from './end'

import start from './start'
import emptyStart from './emptyStart'

import nodeOne from './nodeOne'
// import { codemirror } from 'vue-codemirror'

// import 'codemirror/addon/hint/show-hint.js'
// import 'codemirror/addon/hint/sql-hint.js'

// import 'codemirror/theme/base16-dark.css'
// import 'codemirror/lib/codemirror.css'

// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/addon/hint/show-hint.css'

// import sqlFormatter from 'sql-formatter'

// import 'codemirror/addon/lint/json-lint'

import { getLink, ajaxGetConn } from '@/api/link.js'
import { ajaxGetEnv } from '@/api/env.js'
import {
  ajaxAddPipeline,
  ajaxGetPipeline,
  ajaxGetPipelineInfo,
  ajaxPublishPipeline,
  ajaxDeletePipeline,
  ajaxEditPipeline,
  ajaxGetDataSource
} from '@/api/pipeline.js'

export default {
  name: 'flowDetail',
  props: ['pipeline'],
  data() {
    return {
      userNameArr: [],
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
          yarnAccount: ''
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
                parallelism: '',
                cluster: '',
                env: '',
                connection: '',
                account: '',
                settings: [
                  {
                    key: 'innerTableName',
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
                    key: 'topicIsPattern',
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
                type: 'kafka',
                cluster: '',
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
                    key: 'kafka.connector.version', // 同上
                    value: 'universal'
                  }
                ]
              }
            ],
            transformations: [
              {
                inStream: 'k',
                name: 'alterRow',
                conditions: [
                  {
                    type: 'column2',
                    condition: 'op_type == "U" ',
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
      ruleValidate: {},
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
      activedIndex: 1,
      modal1: false,
      modal2: false,
      curTabName: 'pipelineTab',
      mode: '',
      runEnv: '',
      cluster: '',

      drawIndex: 0,
      witch: false,

      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-mysql',
        theme: 'base16-dark',
        lineNumbers: true,
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
    }
  },
  components: {
    // codemirror,
    emptyStart,
    start,
    end,
    nodeOne
  },
  activated() { },
  methods: {
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
      postData.dataflowName = this.publishData.name
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
      postData.dataflow_documentId = this.$route.query.dataflow_documentId
      postData.dataflow_content = {}
      let obj = this.handleFormat(this.pipeline)
      postData.dataflow_content.dataflow_config = JSON.stringify(obj)
      postData.dataflow_content.draw_code = JSON.stringify(this.pipeline)
      postData.dataflow_content.dataflow_type = this.$route.query.dataflow_type
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
      this.handleSave()
      let postData = {}
      postData.dataflowName = this.publishData.name
      postData.dataflowConfig = JSON.stringify(this.publishData)
      postData.dataflowType = 'flinkdataflow'
      postData.drawCode = JOSN.stringify(this.pipeline)
      // TODO test
      console.log(
        'postData publish========',
        postData,
        postData.dataflowConfig
      )

      ajaxPublishPipeline(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.$Message.success(res.data.message || '发布成功')
          } else {
            this.$Message.error(res.data.message || '发布失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通信失败，请稍后再试')
        })
    },
    cancelPublish() { },
    changeCluster(val) {
      // let postData = {}
      // postData.pageNum = 1
      // postData.pageSize = 1000
      // postData.name = val
      let arr = this.colonyArr.filter(item => {
        return item.name == val
      })
      this.envArr = [].concat(arr[0].envVOList)
      // 查询当前集群下的所有连接
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
    handleEditor() {
      let str = this.code
      this.pipeline = JSON.parse(str)
      this.cannotEditor = true
      this.modal1 = false
    },
    handleEditorCancel() {
      this.code = JSON.stringify(this.pipeline, null, 4)
      this.modal1 = false
    },
    getServe(item) {
      let linkArr = localStorage.getItem('linkArr')
        ? JSON.parse(localStorage.getItem('linkArr'))
        : []
      let curLink = linkArr.filter(link => {
        return (
          link.iscolony == item.formLink.colony &&
          item.formLink.link == link.link
        )
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
        let obj = {
          name: item.formSource.outputStream,
          type: item.type,
          parallelism:
            item.formSource.isParallelism == '0'
              ? 1
              : item.formSource.parallelismValue, //
          cluster: item.formLink.colony,
          env: '',
          connection: item.formLink.link,
          account: item.formLink.username,
          settings: [
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
              value:
                item.formSource.nbbTableName || item.formSource.outputStream
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
    getHbaseSinkObj(pipelineCode, item) {
      let obj = {
        inStream: this.getBeforeInStream(pipelineCode, item),
        name: item.formSource.outputStream,
        type: item.type,
        parallelism:
          item.formSource.isParallelism == '0'
            ? 1
            : item.formSource.parallelismValue, //
        cluster: item.formLink.colony,
        env: '',
        connection: item.formLink.link,
        account: item.formLink.username,
        settings: [
          {
            key: 'innerTableName',
            value: item.formSource.nbbTableName || item.formSource.outputStream
          },
          {
            key: 'schemaInfo',
            value: item.formSource.schemaInfo || ''
          },
          {
            key: 'sinkDataType',
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
      let obj = {
        inStream: this.getBeforeInStream(pipelineCode, item),
        name: item.formSource.outputStream,
        type: item.type,
        parallelism:
          item.formSource.isParallelism == '0'
            ? 1
            : item.formSource.parallelismValue, //
        cluster: item.formLink.colony,
        env: '',
        connection: item.formLink.link,
        account: item.formLink.username,
        settings: [
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
            value: item.formSource.nbbTableName || item.formSource.outputStream
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
        // let obj = {
        //   'inStream': this.getBeforeInStream(pipelineCode, item),
        //   'name': item.formSource.outputStream,
        //   'type': item.type,
        //   'parallelism': item.formSource.isParallelism == '0' ? 1 : item.formSource.parallelismValue, //
        //   'cluster': item.formLink.colony,
        //   'env': '',
        //   'connection': item.formLink.link,
        //   'account': item.formLink.username,
        //   'settings': [
        //     {
        //       'key': 'bootstrapServers', // 去掉
        //       'value': ''
        //     },
        //     {
        //       'key': 'schemaInfo',
        //       'value': item.formSource.schemaInfo || ''
        //     },
        //     {
        //       'key': 'topic',
        //       'value': item.formLink.datatopic
        //     },
        //     {
        //       'key': 'innerTableName',
        //       'value': item.formSource.nbbTableName || item.formSource.outputStream
        //     },
        //     {
        //       'key': 'sinkDataType',
        //       'value': item.formSource.format || 'avro'
        //     },
        //     {
        //       'key': 'fieldDelimiter',
        //       'value': item.formSource.fieldDelimiter || '|'
        //     },

        //     {
        //       'key': 'enableKeyPartitions',
        //       'value': 'true'// 默认值，不让用户操作
        //     },
        //     {
        //       'key': 'partitionKeys',
        //       'value': ''// 默认空值不让用户操作
        //     },
        //     {
        //       'key': 'kafka.connector.version', // 同上
        //       'value': item.formSource.version || 'universal'
        //     }
        //   ],
        //   'columnUpdate': {
        //     'dynamicColumn': 'false',
        //     'columnMaps': item.formSourceOption.rule.map(item => {
        //       let obj = {}
        //       obj.type = item.modeType
        //       obj.origin = item.input
        //       obj.target = item.output
        //       return obj
        //     })
        //   }

        // }
        let obj = this[item.type + 'GetSinkObj'](pipelineCode, item)
        return obj
      })
      return sinks
    },
    // formSourceOption
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
            obj.columnSelectExpression =
              obj.type == 'normal' ? '' : item.columnSelectExpression
            obj.expression = item.format
            return obj
          })
        }
        return oo
      })
      return trans
    },
    handlePublishData(pipelineCode) {
      let o = this.handleFormat(this.pipeline)
      let obj = {
        name: o.name,
        runproperties: {
          mode: 'yarn',
          cluster: 'cluster',
          env: '',
          runUser: '',
          flinkConn: '',
          yarnConn: '',
          account: '',
          queue: '',
          jobMem: '',
          taskMem: '',
          taskSlots: '',
          parallelism: ''
        },
        properties: '立志老大发的数据格式properties 转json',
        dataUrl: ''
      }
      return obj
    },
    handleFormat(pipelineCode) {
      let ppleCode = {}
      ppleCode.name = pipelineCode.formGenaral.pipeline
      ppleCode.properties = {}
      ppleCode.properties.type = 'flinkdataflow'
      ppleCode.properties.typeProperties = {}
      // 增加的运行的参数
      ppleCode.runTime = {}
      ppleCode.runTime.cluster = this.publishData.runTime.cluster // 运行集群
      ppleCode.runTime.env = this.publishData.runTime.env // 运行环境
      ppleCode.runTime.mode = this.publishData.runTime.mode
      ppleCode.runTime.flinkConn = this.publishData.runTime.flinkConn
      ppleCode.runTime.yarnConn = this.publishData.runTime.yarnConn
      ppleCode.runTime.queue = this.publishData.runTime.queue
      ppleCode.runTime.yarnAccount = this.publishData.runTime.yarnAccount

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
      ppleCode.properties.typeProperties.sources = this.getSources(
        pipelineCode
      )
      ppleCode.properties.typeProperties.sinks = []
      ppleCode.properties.typeProperties.sinks = this.getSinks(pipelineCode)
      ppleCode.properties.typeProperties.transformations = []
      ppleCode.properties.typeProperties.transformations = this.getTransformations(
        pipelineCode
      )
      return ppleCode
      // return pipelineCode
    },
    handleCode() {
      let obj = this.handleFormat(this.pipeline)
      // this.code = JSON.stringify(this.pipeline, null, 4)
      this.code = JSON.stringify(obj, null, 4)
      this.modelShow('modal1')
    },
    handleSetActivedIndex(index) {
      this.activedIndex = index
    },
    handleDelete(index) {
      // TODO 暂时还没想好删除的逻辑
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
      this.$bus.emit('fireShowNodeData', { index: index })
    },
    handleSetEnd(postData) {
      let index = postData.index
      delete postData.index
      this.curTabName = postData.tabType
      this.$bus.emit('fireShowNodeData', { index: index })
      // this.$set(this.pipeline.drawData, index, postData)
    },
    handlePublish() {
      this.modalPublish = true
      let obj = this.handleFormat(this.pipeline)
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
      postData.dataflowName = this.$route.query.dataflow_name
      postData.documentId = this.$route.query.dataflow_documentId
      postData.pageSize = 1000
      postData.pageNum = 1
      postData.dataflowType = 'flinkdataflow'
      ajaxGetPipelineInfo(postData).then(res => {
        if (res.data.status == 'ok') {
          if (res.data.data.result_content) {
            this.pipeline = JSON.parse(
              JSON.parse(res.data.data.result_content).draw_code
            )
          }
        }
      })
    },
    getColonyArr() {
      let colonyArrStr = localStorage.getItem('colonyArr')

      if (colonyArrStr) {
        this.colonyArr = JSON.parse(colonyArrStr)
      }
    },
    handlerFireSetActivedIndex(postData) {
      this.handleSetActivedIndex(postData.index)
    }
  },
  beforeCreate() { },
  destroyed() {
    this.setPipeline()
  },
  watch: {
    $route(to, from) {
      this.setPipeline()
    }
  },
  created() {
    this.setPipeline()

    this.curTabName = 'pipelineTab'
    this.$bus.on('getDataSource', this.handleGetDataSource)
    this.$bus.on('fireSetActivedIndex', this.handlerFireSetActivedIndex)
  },
  mounted() {
    this.getColonyArr()
    this.getClusterArr()
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
  background: url("../../assets/images/defaultStart.png") no-repeat center
    center;
  background-size: 100%;
}
.isCurIndex .nodeWrapper .sourceNode {
  background: url("../../assets/images/activedStart.png") no-repeat center
    center;
  background-size: 100%;
}
.nodeWrapper .endNode {
  background: url("../../assets/images/defaultEnd.png") no-repeat center center;
  background-size: 100%;
}
.isCurIndex .nodeWrapper .endNode {
  background: url("../../assets/images/activedEnd.png") no-repeat center center;
  background-size: 100%;
}

.isCurIndex .nodeWrapper .node {
  background: url("../../assets/images/activedNode.png") no-repeat center center;
  background-size: 100%;
}
.nodeWrapper .node {
  background: url("../../assets/images/defaultNode.png") no-repeat center center;
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
  background: url("../../assets/images/defaultEnd.png") no-repeat center center;
  background-size: 100%;
}
/* TDDO 要去掉*/
</style>
