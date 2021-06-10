<template>
  <div :class="getClassName">
    <div class="nodeWrapper linkWrapper" :style="style">
      <div class="nodeWrapper node" @click.stop="handleClick">
        <div class="relative" style="position:relative;">
          <div class="handleIcon nodeItem" style="text-indent:20px;">
            <svg-icon icon-class="filter" class-name="filter" style="font-size:26px;" />
          </div>
          <div class="handleText nodeItem">
            <div class="top">{{text}}</div>
            <div class="bottom">{{column}}</div>
          </div>
        </div>
        <div class="btnAdd" style="cursor:pointer;">
          <Button size="small" type="text" @click="handleRightClick" style="font-size:24px;">
            <Icon type="ios-add-circle-outline" />
          </Button>
        </div>
      </div>
    </div>
    <div class="typeWrapper" v-show="show" :style="curStylePanel">
      <Card class="addPanelwrapper" style="width:300px;">
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
          <div>
            <nodeType @handleAddType="handleAddType" />
          </div>
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
export default {
  name: 'nodeOne',
  props: ['styleParent', 'index', 'nodeData', 'activedIndex'],
  data () {
    return {
      text: 'alterRow',
      column: 'columns',
      show: false,
      curStylePanel: 'position:absolute;top:10px;right:20px;z-index: 9;'
    }
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
    handleAddType (type) {
      if (type.icon.toLowerCase() == 'sink') {
        this.show = false
        this.modal1 = true
        // this.handleAddEnd()
      }
      if (type.icon.toLowerCase() == 'alterrow') {
        this.show = false
        this.handleAddNode()
      }
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
    handleClose () {
      this.show = false
    },
    handleAddEnd () {
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
          outputStream: 'sink1',
          iszcnbb: '',
          nbbTableName: '',
          format: '',
          OperationType: '',
          isContain: '',
          before: '',
          after: '',
          isAutoChange: '',
          isAutoChangeType: ''
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
      this.$emit('addNodeTemp', nodeData)
      this.show = false
    },
    handleAddNodeOne (num) {
      let left = (+this.index + 1) * 260
      let nodeData = {
        index: this.index,
        haveSet: false,
        topIndex: this.nodeData.topIndex,
        leftIndex: this.nodeData.leftIndex + 1,
        tabType: 'nodeOneTab'
      }
      if (num == 'end') {
        postData.tabType = 'endTab'
      }

      this.$emit('addNodeTemp', nodeData)
      this.show = false
    },
    handleRightClick (e) {
      console.log('===========e', e)
      let left = (+this.nodeData.leftIndex) * (260 + 10) + 10
      let top = (this.nodeData.topIndex - 1) * (125 + 10) + 10
      this.curStylePanel = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
      this.show = true
    },
    handleSetStart () {
      this.nodeData.haveSet = true
      let postData = JSON.parse(JSON.stringify(this.nodeData))

      postData.index = this.index
      this.$emit('handleSetSource', postData)
      this.$emit('handleSetActivedIndex', this.index)
    },
    handleDelete (index) {
      this.$emit('deleteTemp', this.index)
    },
    handleAddNode () {
      let nodeData = {
        topIndex: this.nodeData.topIndex,
        leftIndex: this.nodeData.leftIndex + 1,
        tabType: 'nodeOneTab'
      }
      nodeData['nodeOne'] = true
      this.$emit('addNodeTemp', nodeData)
    }
  },
  components: {
    nodeType,
    addNodeForm
  },
  computed: {
    style () {
      let left = (this.nodeData.leftIndex - 1) * (260 + 10) + 10
      let top = (this.nodeData.topIndex - 1) * (125 + 10) + 10
      let styleStr = ('position:absolute;left:' + left + 'px;top:' + top + 'px;')
      return styleStr
    },
    getClassName () {
      return this.activedIndex == this.index ? 'isCurIndex' : 'fock'
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.typeWrapper {
  /deep/ .ivu-card-extra {
    top: 6px;
  }
}
.linkWrapper::before {
  display: block;
  content: "";
  height: 15px;
  width: 26px;
  background: #d2e7f8;
  top: 54px;
  position: absolute;
  left: -10px;
  z-index: 1;
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
    height: 50px;
  }
}
.addPanelwrapper .ivu-card-extra {
  top: 5px;
}
</style>
