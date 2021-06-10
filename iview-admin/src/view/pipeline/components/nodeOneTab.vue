
<template>
  <div>
    <Tabs value="name1" @on-click="handleGetDataSource">
      <TabPane label="设置" name="name1">
        <div class="tabConten">
          <Form
            ref="formSource"
            :model="nodeData.formSource"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="输入流名称" prop="inputStream">
              <Input v-model="nodeData.formSource.inputStream" placeholder="请输入" disabled></Input>
            </FormItem>
            <FormItem label="输出流名称" prop="outputStream">
              <Input v-model="nodeData.formSource.outputStream" placeholder="默认值不变"></Input>
            </FormItem>
            <FormItem label="匹配选项" prop="OperationType">
              <Select v-model="nodeData.formSource.OperationType" placeholder="请输入">
                <Option
                  v-for="(item,index) in OperationTypeArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <div class>
              <div style="padding-bottom:10px;text-align:right;">
                <Button type="primary" size="small" @click="addFormSourceRows">增加</Button>
              </div>
              <div class="wrapper">
                <Table
                  :columns="tableTitleRow"
                  :data="nodeData.formSource.rows"
                  tooltip-theme="dark"
                  border
                >
                  <template slot-scope="{ index, row }" slot="columnName">
                    <Select
                      v-model="row.columnName"
                      placeholder="请输入"
                      transfer
                      prop="columnName"
                      @on-change="handleBlindChange(row,index)"
                    >
                      <Option
                        v-for="(item,index) in ['insert','delete','update','upsert']"
                        :value="item"
                        :label="item"
                        :key="index"
                      >{{item}}</Option>
                    </Select>
                  </template>
                  <template slot-scope="{ row,index }" slot="columnType">
                    <Select
                      v-model="row.columnType"
                      placeholder="请输入"
                      transfer
                      @on-change="changeColumnType(row,index)"
                    >
                      <Option
                        v-for="(item,index) in columnTypeArr"
                        :value="item.value"
                        :label="item.label"
                        :key="item.label"
                      >{{item.label}}</Option>
                    </Select>
                  </template>
                  <template slot-scope="{ row,index }" slot="columnSelectExpression">
                    <Input
                      v-model="row.columnSelectExpression"
                      placeholder="请输入"
                      :disabled="row.columnType == 'normal'"
                    />
                  </template>
                  <template slot-scope="{ row,index }" slot="type">
                    <Input
                      v-model="row.type"
                      placeholder="请输入判断条件"
                      prop="type"
                      @on-blur="handleBlindChange(row,index)"
                    ></Input>
                  </template>
                  <template slot-scope="{ row,index }" slot="format">
                    <div class="flex" style="flex-wrap:nowrap">
                      <div style="flex-grow: 1;min-width: 300px;margin-right: 10px;">
                        <Input
                          type="textarea"
                          v-model="row.format"
                          placeholder="请输入"
                          prop="format"
                          @on-blur="handleBlindChange(row,index)"
                        ></Input>
                      </div>
                      <div>
                        <Button type="primary" size="small" @click="handleGoTo(row)">设置表达式</Button>
                      </div>
                    </div>
                  </template>
                </Table>
                <div class="page" style="text-align:right;padding-top:10px;">
                  <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </TabPane>
      <!-- <TabPane label="分区优化" name="name4">
        <Form ref="formOpt" :model="nodeData.formOpt" :rules="ruleValidate" :label-width="80">
          <FormItem label="分割选项">
            <RadioGroup v-model="nodeData.formOpt.formOpt">
              <Radio label="0">当前分区</Radio>
              <Radio label="1">单一分区</Radio>
              <Radio label="2">自定义分区</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="分割类别">
            <div class="flex flexSplitType">
              <div class="flexItem" v-for="(item,idx) in splitTypeArr">
                <div class="imageWrapper">
                  <img :src="item.icon" alt />
                </div>
                <div class="name">{{item.name}}</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="分区数量" prop="splitNum">
            <Input v-model="nodeData.formOpt.splitNum" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="选中的排序范围" prop="range">
            <Input v-model="nodeData.formOpt.range" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </TabPane> -->
      <TabPane label="元数据" name="name5">
        <div class="wrapper">
          <dataMeta :nodeData="nodeData" />
        </div>
      </TabPane>
      <TabPane label="预览" name="name6">
        <div class="btnGroup" style="text-align:right;padding-bottom:10px;">
          <Button type="primary" size="small">刷新</Button>
        </div>
        <div class="wrapper">
          <Table
            :loading="loading"
            :columns="tableTitlePrev"
            :data="nodeData.tableDataPrev"
            tooltip-theme="dark"
            border
          >
            <template slot-scope="{ row }" slot="columnName">
              <Input v-model="row.columnName"></Input>
            </template>
            <template slot-scope="{ row }" slot="type">
              <Select v-model="row.type" placeholder="请输入">
                <Option
                  v-for="(item,index) in typeArr"
                  :value="item.value"
                  :label="item.label"
                  :key="item.label"
                >{{item.label}}</Option>
              </Select>
            </template>
            <template slot-scope="{ row }" slot="format">
              <Select v-model="row.type" placeholder="请输入">
                <Option
                  v-for="(item,index) in getFormat"
                  :value="item.value"
                  :label="item.label"
                  :key="item.label"
                  v-show="(item.filter == row.type)"
                >{{item.label}}</Option>
              </Select>
            </template>
          </Table>
          <div class="page" style="text-align:right;padding-top:10px;">
            <Page
              :total="nodeData.tableDataPrev.length"
              show-total
              show-elevator
              @on-change="pageChangePrev"
            />
          </div>
        </div>
      </TabPane>
      <TabPane label="与上游比较" name="name7">
        <div class="formWrapper" style="text-align:right;padding-bottom:10px;">
          <Form ref="formCompare" :model="formCompare" :rules="ruleValidate" inline>
            <FormItem prop="beforDrawData">
              <Select size="small" v-model="formCompare.beforDrawData" placeholder="请选择上游">
                <Option
                  v-for="(item,index) in beforDrawDataArr"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem prop="beforeOrder">
              <Select size="small" v-model="formCompare.beforeOrder" placeholder="请选择上游排序字段">
                <Option
                  v-for="(item,index) in beforeOrderArr"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem prop="curOrder">
              <Select size="small" v-model="formCompare.curOrder" placeholder="请选择当前排序字段">
                <Option
                  v-for="(item,index) in curOrderArr"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" size="small" @click="handleCompare('formSearch')">对比</Button>
            </FormItem>
          </Form>
        </div>
        <div class="wrapper">
          <div class="wrapper" style="padding:10px 0">
            <Table
              :loading="loading"
              :columns="tableTitlePrev"
              :data="nodeData.tableDataPrev"
              tooltip-theme="dark"
              border
            >
              <template slot-scope="{ row }" slot="columnName">
                <Input v-model="row.columnName"></Input>
              </template>
              <template slot-scope="{ row }" slot="type">
                <Select v-model="row.type" placeholder="请输入">
                  <Option
                    v-for="(item,index) in typeArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                  >{{item.label}}</Option>
                </Select>
              </template>
              <template slot-scope="{ row }" slot="format">
                <Select v-model="row.type" placeholder="请输入">
                  <Option
                    v-for="(item,index) in getFormat"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                    v-show="(item.filter == row.type)"
                  >{{item.label}}</Option>
                </Select>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="nodeData.tableDataPrev.length"
                show-total
                show-elevator
                @on-change="pageChangePrev"
              />
            </div>
          </div>

          <div class="wrapper" style="padding:10px 0">
            <Table
              :loading="loading"
              :columns="tableTitlePrev"
              :data="nodeData.tableDataPrev"
              tooltip-theme="dark"
              border
            >
              <template slot-scope="{ row }" slot="columnName">
                <Input v-model="row.columnName"></Input>
              </template>
              <template slot-scope="{ row }" slot="type">
                <Select v-model="row.type" placeholder="请输入">
                  <Option
                    v-for="(item,index) in typeArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                  >{{item.label}}</Option>
                </Select>
              </template>
              <template slot-scope="{ row }" slot="format">
                <Select v-model="row.type" placeholder="请输入">
                  <Option
                    v-for="(item,index) in getFormat"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                    v-show="(item.filter == row.type)"
                  >{{item.label}}</Option>
                </Select>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="nodeData.tableDataPrev.length"
                show-total
                show-elevator
                @on-change="pageChangePrev"
              />
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>

    <Drawer title="选择连接类型" v-model="value3" width="720" :mask-closable="false" :styles="styles">
      <div class="drawerWrapper">
        <Tabs value="name1">
          <TabPane label="消息队列" name="name1">
            <div class="tabConten" style>
              <div class="flex">
                <div
                  class="flex-item"
                  v-for="(item,index) in queryArr"
                  @click="chooseType(item, index)"
                >
                  <div class="borderWrapper">
                    <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                      <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                    </div>
                    <div class="name">{{item.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="数据库" name="name2">
            <div class="flex">
              <div
                class="flex-item"
                v-for="(item,index) in fileDbArr"
                @click="chooseType(item, index)"
              >
                <div class="borderWrapper">
                  <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                    <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                  </div>
                  <div class="name">{{item.name}}</div>
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
  </div>
</template>
<script>
import kafkaForm from './kafkaForm'
import hiveForm from './hiveForm'
import hbaseForm from './hbaseForm'
import dataMeta from './dataMeta'

let splitIcon1 = require('@/assets/images/splitIcon1.png')
let splitIcon2 = require('@/assets/images/splitIcon2.png')
let splitIcon3 = require('@/assets/images/splitIcon3.png')
let splitIcon4 = require('@/assets/images/splitIcon4.png')

export default {
  name: 'nodeOneTab',
  props: ['pipeline', 'nodeData'],
  data () {
    return {
      alertPage: 1,
      beforDrawDataArr: [],
      beforOrderArr: [],
      curOrderArr: [],
      formCompare: {
        beforDrawData: '',
        beforeOrder: '',
        curOrder: ''
      },
      ruleValidate: {},
      loading: false,
      columnTypeArr: [{

        value: 'normal',
        label: 'normal'
      },
      {
        value: 'patten',
        label: 'patten'
      }],
      splitTypeArr: [{
        icon: splitIcon1,
        name: 'Hash'
      },
      {
        icon: splitIcon2,
        name: 'Dynamic Range'
      },
      {
        icon: splitIcon3,
        name: 'fixed Range'
      },
      {
        icon: splitIcon4,
        name: 'Key'
      }
      ],
      userArr: [],
      colonyAndCommonArr: [],
      linkArr: [],
      formatDataArr: [{
        value: 'avro',
        label: 'avro'
      }],
      OperationTypeArr: [{
        value: '优先匹配',
        label: '优先匹配'
      },
      {
        value: '顺序匹配',
        label: '顺序匹配'
      }],
      typeArr: [{
        value: 'string',
        label: 'string'
      }],
      formatArr: [{
        value: 'specify format',
        label: 'specify format'
      }],
      tableTitleRow: [
        {
          title: '类型',
          key: 'columnType',
          eclipse: true,
          tooltip: true,
          width: 140,
          slot: 'columnType'
        },
        {
          title: '操作',
          key: 'columnName',
          eclipse: true,
          tooltip: true,
          width: 140,
          slot: 'columnName'
        },
        {
          title: '咧选择规则',
          key: 'columnSelectExpression',
          eclipse: true,
          tooltip: true,
          width: 200,
          slot: 'columnSelectExpression'
        },
        {
          title: '条件',
          key: 'type',
          width: 180,
          eclipse: true,
          tooltip: true,

          slot: 'type'
        },
        {
          title: '更新值',
          key: 'format',
          minWidth: 400,
          eclipse: true,
          tooltip: true,
          slot: 'format'
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 120,
          eclipse: true,
          tooltip: true,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableTitle: [

        {
          title: '字段',
          key: 'columnName',
          eclipse: true,
          tooltip: true,

          slot: 'columnName'
        },
        {
          title: '类型',
          key: 'type',
          eclipse: true,
          tooltip: true,

          slot: 'type'
        },
        {
          title: '格式',
          key: 'format',
          eclipse: true,
          tooltip: true,

          slot: 'format'
        }

      ],

      tableTitlePrev: [
        {
          title: 'op_type',
          key: 'column1',
          minWidth: 90,
          eclipse: true,
          tooltip: true

        },

        {
          title: 'op_ts',
          key: 'column2',
          minWidth: 80,
          eclipse: true,
          tooltip: true
        },
        {
          title: 'after.name',
          width: 130,
          key: 'column8',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'after.uid',
          key: 'column6',
          width: 130,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'after.grade',
          width: 130,
          key: 'column7',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'after.birth',
          width: 130,
          key: 'column9',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'before.name',
          width: 130,
          key: 'column5',
          eclipse: true,
          tooltip: true

        },

        {
          title: 'before.uid',
          key: 'column3',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'before.grade',
          width: 130,
          key: 'column4',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'before.birth',
          minWidth: 130,
          key: 'column10',
          eclipse: true,
          tooltip: true

        }

      ],
      tableData: [
        {
          columnName: 'column1',
          type: 'string',
          format: 'specify format'
        },
        {
          columnName: 'column2',
          type: 'string',
          format: 'specify format'
        },
        {
          columnName: 'column3',
          type: 'string',
          format: 'specify format'
        }

      ],

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
      ],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      value3: false,
      curModal: '',
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
      outputStreamArr: [],
      listArr: [{
        icon: require('@/assets/images/rr1.png'),
        title: 'Round Roin',
        desc: ''
      },
      {
        icon: require('@/assets/images/hash2.png'),
        title: 'Hash',
        desc: ''
      },
      {
        icon: require('@/assets/images/dr3.png'),
        title: 'Dynamic Range',
        desc: ''
      },
      {
        icon: require('@/assets/images/fixed4.png'),
        title: 'Fixed Range',
        desc: ''
      },
      {
        icon: require('@/assets/images/key5.png'),
        title: 'Key',
        desc: ''
      }],
      formSourceOption: {
        modify: '',
        rootPath: '',
        path: '',
        isListFile: false,
        columnFileName: '',
        completion: ''
      },
      formOpt: {
        splitNum: '',
        range: '',
        partType: '',
        formOpt: '',
        columns: [{
          columnName: 'name'
        }]
      },
      formSource: {
        outputStream: 'alterRow',
        inputStream: 'source_1',

        OperationType: '',
        rows: [

          {
            columnName: 'column2',
            type: 'op_type == "U" ',
            format: 'if (before.$$ != null) { after.$$ = before.$$ }'
          }
        ]
      },
      formLink: {
        link: '',
        colony: '',
        user: ''
      }

    }
  },
  computed: {
    zjName () {
      return this.curModal
    }

  },
  methods: {
    handleGetDataSource (name) {
      if (name == 'name5') {
        this.$bus.emit('getDataSource')
      }
    },
    pageChangeInspect (val) {
      this.alertPage = val
    },
    changeColumnType (row, index) {
      this.nodeData.formSource.rows[index].columnType = row.columnType
      this.$set(this.nodeData.formSource.rows, index, row)
    },
    handleBlindChange (row, index) {
      this.$set(this.nodeData.formSource.rows, index, row)
    },
    handleCompare () {
      this.$Message.success('对比成功')
    },
    handleGoTo (row) {
      this.$router.push({
        name: 'join_page',
        params: row
      })
    },
    remove (index) {
      this.nodeData.formSource.rows.splice(index, 1)
    },
    addFormSourceRows () {
      this.nodeData.formSource.rows.push({
        columnName: '',
        type: '',
        format: ''
      })
    },
    initFormLinkArr () {
      let linkArrStr = localStorage.getItem('linkArr')
      let colonyArrStr = localStorage.getItem('colonyArr')
      let commonArrStr = localStorage.getItem('commonArr')
      let userArrStr = localStorage.getItem('userArr')
      if (userArrStr) {
        this.userArr = JSON.parse(userArrStr)
      }
      if (linkArrStr) {
        this.linkArr = JSON.parse(linkArrStr)
      }
      let colonyArr = []
      let commonArr = []
      if (colonyArrStr) {
        colonyArr = JSON.parse(colonyArrStr)
      }
      if (commonArrStr) {
        commonArr = JSON.parse(commonArrStr)
      }
      if (colonyArrStr || commonArrStr) {
        this.colonyAndCommonArr = commonArr.concat(colonyArr)
      }
    },
    handleSuccessModal (postData) {
      this.outputStreamArr.push(postData)
      this.modalHide('modal1')
    },
    modalHide (k) {
      this[k] = false
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
    handleDrawAdd () {
      this.value3 = false
      this.modalShow('modal1')
    },
    modalShow (k) {
      this[k] = true
    },
    handleAddDataSetName () {
      this.value3 = true
    },
    handleAddColumns () {
      this.formOpt.columns.unshift({ name: '' })
    },
    handleRemove (index) {
      this.formOpt.columns.splice(index, 1)
    }
  },
  components: {
    kafkaForm,
    hiveForm,
    hbaseForm,
    dataMeta
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.initFormLinkArr()
      let str = localStorage.getItem('dataSetNameArr')
      if (str) {
        this.outputStreamArr = JSON.parse(str)
      }
    })
  }
}
</script>
<style lang="less" scoped>
.flexSplitType.flex {
  flex-wrap: nowrap;
  .flexItem {
    border-left: 0;
    cursor: pointer;
    .imageWrapper {
      padding: 20px;
      border: solid 1px #a1a1a1;
      border-right: 0;
    }
  }
}
.flexSplitType.flex .flex-item:hover {
  background: #def0fe;
  border: solid 1px #2372e8;
}
.flexSplitType.flex .flexItem:last-child .imageWrapper {
  position: relative;
  z-index: 0;
}
.flexSplitType.flex .flexItem:last-child .imageWrapper::after {
  display: block;
  content: "";
  height: 100%;
  width: 1px;
  background-color: #a1a1a1;
  top: 0;
  right: 0;
  position: absolute;
}
.flexSplitType.flex .flexItem:last-child:hover .imageWrapper::after {
  background-color: #2372e8;
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
.btnAddWrapper {
  /deep/ .ivu-icon {
    font-size: 26px;
    line-height: 15px;
  }
}
.partWrapper {
  .ivu-list-item-meta {
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .ivu-list-item {
      align-items: center;
    }
  }
  /deep/ .ivu-avatar {
    height: 160px;
    width: 100%;
    border: solid 2px #ddd;
    border-radius: 5px;
    cursor: pointer;
  }
  /deep/ .ivu-avatar:hover {
    border-color: #1060d7;
  }
}

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
<style >
.ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
}
</style>
