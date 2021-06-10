<template>
  <div :class="getClassName">
    <div class="nodeWrapper" :style="style">
      <div class="nodeWrapper sourceNode" @click.stop="handleClick">
        <div class="relative" style="position:relative;">
          <div class="handleIcon nodeItem">
            <svg-icon icon-class="source" class-name="source" style="font-size:26px;" />
          </div>
          <div class="handleText nodeItem">
            <div class="top">{{nodeData.formSource.outputStream}}</div>
            <div class="bottom">{{column}}({{nodeData.tableDataInspect.length}})</div>
          </div>
          <div class="handleArrow nodeItem"></div>
        </div>
        <div class="btnAdd" style="cursor:pointer;">
          <Button size="small" type="text" @click="handleRightClick" style="font-size:24px;">
            <Icon type="ios-add-circle-outline" />
          </Button>
        </div>
      </div>
    </div>
    <div class="typeWrapper" v-show="show" :style="curStylePanel">
      <Card style="width:300px;">
        <div slot="title">
          <div style="width:220px">
            <Input placeholder="请输入" size="small">
              <Icon type="ios-search" slot="suffix" />
            </Input>
          </div>
        </div>
        <div slot="extra" class="btnClosePanel">
          <Button type="primary" size="small" @click.stop="handleClose">关闭</Button>
        </div>
        <div>
          <nodeType @handleAddType="handleAddType" />
        </div>
      </Card>
    </div>
    <Modal v-model="modal1" title="添加目标" footer-hide>
      <addNodeForm @handleOk="handleAddSink" @handleCancel="handleCancel" />
    </Modal>
  </div>
</template>
<script>
import nodeType from './nodeType'
import addNodeForm from './addNodeForm'
let time = null
let clickNum = 0
let splitIcon1 = require('@/assets/images/splitIcon1.png')
let splitIcon2 = require('@/assets/images/splitIcon2.png')
let splitIcon3 = require('@/assets/images/splitIcon3.png')
let splitIcon4 = require('@/assets/images/splitIcon4.png')

export default {
  name: 'start',
  props: ['styleParent', 'index', 'nodeData', 'activedIndex'],
  data () {
    return {
      modal1: false,
      text: 'source1',
      column: 'columns',
      show: false,
      curStylePanel: 'position:absolute;top:10px;right:20px;z-index: 9;',
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
      historyPipelineArr: []
    }
  },
  components: {
    nodeType,
    addNodeForm
  },
  methods: {
    handleCancel () {
      this.modal1 = false
    },
    handleAddSink (formData) {
      let nodeData = {
        topIndex: this.nodeData.topIndex,
        leftIndex: this.nodeData.leftIndex + 1,
        tabType: 'endTab',
        // 数据源的数据格式
        formLink: {
          link: '',
          colony: '',
          topic: '',
          user: ''
        },
        // 设置
        formSource: {
          outputStream: formData.pipeline,
          iszcnbb: '',
          nbbTableName: '',
          format: '',
          OperationType: '',
          isContain: '',
          before: '',
          after: '',
          isAutoChange: '',
          isAutoChangeType: '',
          rowkeyFields: '',
          writeRowkey: '',
          readRowkey: ''

        },
        // 映射
        formSourceOption: {
          modify: '',
          rootPath: '',
          path: '',
          isListFile: false,
          columnFileName: '',
          completion: '',
          rule: [{
            input: 'after.$$',
            output: '$$'
          }]

        },
        //
        tableData: [
          {
            columnName: 'op_ts',
            type: 'timestamp',
            format: 'specify format'
          }
        ],
        // 分区优化的数据格式
        formOpt: {
          splitNum: '',
          range: '',
          partType: '',
          formOpt: '',
          columns: [{
            columnName: 'name'
          }]
        },
        // 元数据 源数据格式
        tableDataInspectSource: [
          {
            columnName: 'op_type',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'op_ts',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'before.uid',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'before.grade',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'before.name',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'after.uid',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'after.grade',
            type: 'string',
            defaultValue: ''
          },
          {
            columnName: 'after.name',
            type: 'string',
            defaultValue: ''
          }

        ],
        // 元数据的目标节点数据格式
        tableDataInspect: [
          {

            columnName: 'rowkey',
            type: 'string',
            default: ''
          }, {

            columnName: 'uid',
            type: 'string',
            default: ''
          },
          {

            columnName: 'grade',
            type: 'string',
            default: ''
          },
          {
            columnName: 'name',
            type: 'string',
            default: ''
          }

        ],
        tableDataPrev: [{
          name: '张三',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        }, {
          name: '李四',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        },
        {
          name: '王五',
          uid: '10001 ',
          grade: '3',
          birth: '2010-01-01'
        }
        ]
      }
      // TDDO 这是需要考虑用的历史信息
      if (formData.linktype != '已有数据集') {
        for (let k in formData) {
          nodeData[k] = formData[k]
        }
      } else {
        // 历史资源
      }
      if (nodeData.type == 'restmq') {
        nodeData.formLink.schematopic = ''
        nodeData.formLink.datatopic = ''
      }
      this.$emit('addNodeTemp', nodeData)
      this.show = false

      this.handleCancel()
    },
    handleClick () {
      clickNum = clickNum + 1
      time = setTimeout(() => {
        if (clickNum == 1) {
          clickNum = 0
          this.handleSetStart()
        } else {
          this.handleDelete()
          clickNum = 0
          clearTimeout(time)
        }
      }, 200)
    },
    handleDelete () {
      clearTimeout(time)
      this.$emit('handleDelete', this.index)
    },
    handleAddType (type) {
      if (type.icon.toLowerCase() == 'sink') {
        this.show = false
        this.modal1 = true
        // this.handleAddEnd()
      }
      if (type.icon.toLowerCase() == 'alterrow') {
        this.show = false
        // 设置alertrow 的数据
        let inputStreamName = ''
        // 需要遍历pipeline下的drawData，然后拿到源

        let that = this
        this.$parent.$parent.pipeline.drawData.map(item => {
          if ((item.topIndex == that.nodeData.topIndex) && (item.start)) {
            inputStreamName = item.formSource.outputStream
          }
        })
        let nodeData = {
          index: this.index,
          haveSet: false,
          leftIndex: this.nodeData.leftIndex + 1,
          topIndex: this.nodeData.topIndex,
          tabType: 'nodeOneTab',
          nodeOne: true,
          // 设置添加的设置
          formSource: {
            outputStream: 'alterRow',
            inputStream: inputStreamName,
            OperationType: '',
            rows: [
              {
                columnName: 'column2',
                type: 'op_type == "U" ',
                columnType: 'normal',
                columnSelectExpression: '',
                format: 'if (before.$$ != null) { after.$$ = before.$$ }'
              }
            ]
          },
          // 分区优化的数据格式
          formOpt: {
            splitNum: '',
            range: '',
            partType: '',
            formOpt: '',
            columns: [{
              columnName: 'name'
            }]
          },
          // 设置元数据的数据格式
          tableDataInspect: [
            {
              columnName: 'op_type',
              type: 'string',
              defaultValue: ''
            },
            {
              columnName: 'op_ts',
              type: 'timestamp',
              defaultValue: ''
            },
            {
              columnName: 'before.uid',
              type: 'string',
              defaultValue: ''
            },
            {
              columnName: 'before.grade',
              type: 'int',
              defaultValue: ''
            },
            {
              columnName: 'before.name',
              type: 'string',
              defaultValue: ''
            },
            {
              columnName: 'after.uid',
              type: 'string',
              defaultValue: ''
            },
            {
              columnName: 'after.grade',
              type: 'int',
              defaultValue: ''
            },
            {
              columnName: 'after.name',
              type: 'string',
              defaultValue: ''
            }

          ],
          // 设置预览的数据格式
          tableDataPrev: [
            {
              column1: ' I ',
              column2: '1590143158',
              column3: '',
              column4: '',
              column5: '',
              column6: '10001',
              column7: '3',
              column8: '张三',
              column9: '2010-01-01',
              column10: ''
            },
            {
              column1: ' I ',
              column2: '1590143158',
              column3: '',
              column4: '',
              column5: '',
              column6: '10001',
              column7: '3',
              column8: '李四',
              column9: '2011-02-11',
              column10: ''
            },
            {
              column1: ' I ',
              column2: '1590143158',
              column3: '',
              column4: '',
              column5: '',
              column6: '10001',
              column7: '3',
              column8: '王五',
              column9: '2010-05-16',
              column10: ''
            }
          ]
        }
        this.handleAddNode(nodeData)
      }
    },
    handleClose () {
      this.show = false
    },
    handleAddNode (nodeData) {
      this.$emit('addNodeTemp', nodeData)
      this.show = false
    },
    handleRightClick (e) {
      console.log('===========e', e)
      let left = (+this.leftIndex || 1) * 260 + 20 + 5
      let top = (+this.leftIndex || 0) * 123 + 10
      this.curStylePanel = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
      this.show = true
    },
    handleSetStart () {
      clearTimeout(time) // 首先清除计时器
      time = setTimeout(() => {
        this.nodeData.haveSet = true
        let postData = JSON.parse(JSON.stringify(this.nodeData))

        postData.tabType = 'startTab'
        postData.node = true
        postData.index = this.index
        this.$emit('handleSetSource', postData)
        this.$emit('handleSetActivedIndex', this.index)
        this.$bus.emit('handleInitData', postData)
      }, 300)
    }

  },
  computed: {
    getClassName () {
      return this.activedIndex == this.index ? 'isCurIndex' : 'fock'
    },
    style () {
      console.log('=======nodeData', this.nodeData)
      let left = (this.nodeData.leftIndex - 1) * (260 + 10) + 10
      let top = (this.nodeData.topIndex - 1) * (125 + 10) + 10
      let styleStr = ('position:absolute;left:' + left + 'px;top:' + top + 'px;')
      return styleStr
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.typeWrapper {
  /deep/ .ivu-card-extra {
    top: 6px;
  }
}
.isCurIndex .svg-icon {
  fill: rgb(19, 122, 209) !important;
}
.typeWrapper {
  z-index: 9;
}
.nodeWrapper {
  width: 260px;
  height: 123px;
}
.btnAdd {
  position: absolute;
  bottom: -10px;
  right: -20px;
}

.nodeItem {
  float: left;
  height: 123px;
}
.handleIcon {
  width: 50px;
  text-align: center;
  line-height: 80px;
}
.handleText {
  width: 150px;
  margin-left: 2px;
  .top {
    height: 75px;
  }
}
</style>
