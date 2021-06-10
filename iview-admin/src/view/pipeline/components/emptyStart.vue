<template>
  <div>
    <div class="nodeWrapper" @click.stop="handleAddStart" :style="style">
      <div
        class="relative default emptyNode startNode addNode"
        style="position: relative; line-height: 123px; text-align: center;"
      >
        <Icon type="ios-add-circle-outline" style="font-size: 18px; color: #898989 !important;" />
        <span>添加数据源</span>
      </div>
    </div>

    <Modal v-model="modal1" title="添加源" footer-hide>
      <addNodeForm @handleOk="handleAddSource" @handleCancel="handleCancel" />
    </Modal>
  </div>
</template>
<script>
import addNodeForm from './addNodeForm'
export default {
  name: 'emptyStart',
  props: ['styleParent', 'index', 'nodeData'],
  data() {
    return {
      ruleValidate: {},
      text: 'source1',
      column: 'columns',
      show: false,
      modal1: false,
      curStylePanel: 'position:absolute;top:10px;right:20px;',
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
      historyPipelineArr: [],
      formValidate: {
        pipeline: '',
        type: '消息队列',
        query: '',
        db: '',
        historyPipeline: ''
      }
    }
  },
  components: {
    addNodeForm
  },
  methods: {
    handleCancel() {
      this.modal1 = false
    },
    handleAddSource(formData) {
      let postData = JSON.parse(JSON.stringify(this.nodeData))
      let nodeData = {
        start: true,
        leftIndex: postData.leftIndex,
        topIndex: postData.topIndex,
        haveSet: false,
        tabType: 'startTab',
        // 数据源的格式
        formLink: {
          link: '',
          topic: '',
          colony: '',
          username: ''
        },
        // 设置的数据格式
        formSource: {
          outputStream: formData.pipeline,
          iszcnbb: '',
          nbbTableName: '',
          parallelismValue:'',
          format: '',
          OperationType: '',
          isContain: '',
          before: '',
          after: '',
          isAutoChange: '',
          isAutoChangeType: ''
        },
        // 数据格式的数据格式
        tableData: [
          {
            columnName: 'op_ts',
            type: 'timestamp',
            format: 'specify format'
          }

        ],
        // 分区优化数据格式
        formOpt: {
          splitNum: '',
          range: '',
          partType: '',
          formOpt: '',
          columns: [{
            columnName: 'name'
          }]
        },

        // 元数据数据格式
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

        // 预览数据格式
        tableDataPrev: [{
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
      postData.topIndex += 1;
      (postData.index = this.index)
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
      this.$emit('handleSetEmptyStart', postData)
      this.$emit('handleAddStart', nodeData)

      this.modal1 = false
    },
    handleAddStart(e) {
      this.modal1 = true
    },
    getFormData() {
      let postData = { pipeline: '' }
      postData.pipeline = this.formValidate.pipeline
      if (this.formValidate.type == '已有数据集') {
        postData.linkType = '已有数据集'
        postData.type = this.formValidate.historyPipeline
      } else if (this.formValidate.type == '消息队列') {
        postData.linkType = '消息队列'
        postData.type = this.formValidate.query
      } else {
        postData.linkType = '数据库'
        postData.type = this.formValidate.db
      }
      return postData
    }
  },
  computed: {
    style() {
      console.log('=======nodeData', this.nodeData)
      let left = (this.nodeData.leftIndex - 1) * (260 + 10) + 10
      let top = (this.nodeData.topIndex - 1) * (125 + 10) + 10
      let styleStr = 'position:absolute;left:' + left + 'px;top:' + top + 'px;'
      return styleStr
    }
  },
  created() { },
  mounted() { }
}
</script>
<style lang="less">
.nodeWrapper {
  width: 260px;
  height: 123px;
  .addNode {
    background-image: none !important;
    border: dashed 1px #53abf0;
    background-color: #fafafa;
  }
}
.btnAdd {
  position: absolute;
  bottom: -10px;
  right: -20px;
}
.btnAdd:hover {
  background-color: transparent !important;
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
  padding: 20px 10px;
  width: 150px;
  margin-left: 2px;
  .top {
    height: 75px;
  }
}
</style>
