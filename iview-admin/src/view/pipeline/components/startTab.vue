
<template>
  <div>
    <div style="display:none;">{{getClusterValue}}</div>
    <Tabs value="name1" @on-click="handleGetDataSource">
      <TabPane label="数据集" name="name1">
        <div class="tabConten">
          <clusterTabCommon :nodeData="nodeData" />
        </div>
      </TabPane>
      <TabPane label="设置" name="name2">
        <div class="tabConten">
          <Form
            ref="formSource"
            :model="nodeData.formSource"
            :rules="ruleValidate"
            :label-width="140"
            label-position="left"
          >
            <FormItem label="输出流名称" prop="outputStream">
              <Input v-model="nodeData.formSource.outputStream" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="注册内部表" prop="iszcnbb">
              <RadioGroup v-model="nodeData.formSource.iszcnbb">
                <Radio label="0">否</Radio>
                <Radio label="1">是</Radio>
              </RadioGroup>
            </FormItem>-->
            <!-- <FormItem label="注册内部表" prop="iszcnbb">
              <i-switch v-model="nodeData.formSource.iszcnbb" size="small">
                <span slot="open"></span>
                <span slot="close"></span>
              </i-switch>
            </FormItem>-->
            <!-- <FormItem label="内部表名称" prop="nbbTableName">
              <Input v-model="nodeData.formSource.nbbTableName" placeholder="请输入"></Input>
            </FormItem>-->
            <FormItem label="schemaInfo" prop="schemaInfo">
              <Input
                type="textarea"
                v-model="nodeData.formSource.schemaInfo"
                placeholder="请输入"
                rows="10"
              ></Input>
            </FormItem>

            <FormItem label="groupId" prop="groupId">
              <Input v-model="nodeData.formSource.groupId" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="fieldDelimiter" prop="fieldDelimiter">
              <Input v-model="nodeData.formSource.fieldDelimiter" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="kafka.connector.version" prop="version">
              <Select v-model="nodeData.formSource.version" placeholder="请输入" filterable>
                <Option
                  v-for="(item,index) in versionArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>-->
            <FormItem label="offsetReset" prop="offsetReset">
              <Select v-model="nodeData.formSource.offsetReset" placeholder="请输入" filterable>
                <Option
                  v-for="(item,index) in offsetResetArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem
              label="offsetReset"
              prop="offsetReset"
              v-if="nodeData.formSource.offsetReset == '0'"
            >
              <Input v-model="nodeData.formSource.offsetResetValue" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="数据格式" prop="format">
              <Select v-model="nodeData.formSource.format" placeholder="请输入">
                <Option
                  v-for="(item,index) in formatDataArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <!-- <FormItem label="操作类型" prop="OperationType">
              <Select v-model="nodeData.formSource.OperationType" placeholder="请输入">
                <Option
                  v-for="(item,index) in OperationTypeArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>-->
            <FormItem
              label="变更操作包含变更前后字段"
              prop="option"
              v-if="formSource.OperationType == '支持更新删除'"
            >
              <RadioGroup v-model="nodeData.formSource.isContain">
                <Radio label="0">否</Radio>
                <Radio label="1">是</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="并行度" prop="isParallelism">
              <RadioGroup v-model="nodeData.formSource.isParallelism">
                <Radio label="0">自动</Radio>
                <Radio label="1">自定义</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="并行度自定义值" prop="option" v-if="nodeData.formSource.isParallelism == '1'">
              <Input v-model="nodeData.formSource.parallelismValue" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="变更前结构名称" prop="before">
              <Input v-model="nodeData.formSource.before" placeholder="请输入"></Input>
            </FormItem>-->
            <!-- <FormItem label="变更后结构名称" prop="after">
              <Input v-model="nodeData.formSource.after" placeholder="请输入"></Input>
            </FormItem>

            <FormItem label="元数据自动变更" prop="isAutoChange">
              <RadioGroup v-model="nodeData.formSource.isAutoChange">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="自动推断变更列类型" prop="isAutoChangeType">
              <RadioGroup v-model="nodeData.formSource.isAutoChangeType">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
              </RadioGroup>
            </FormItem>-->
          </Form>
        </div>
      </TabPane>
      <TabPane label="数据格式" name="name4">
        <div class="btnGroups" style="padding-bottom:10px;text-align:right;">
          <Button
            type="primary"
            size="small"
            @click="handleReset"
            style="font-size:16px;line-height:16px;margin-right:5px;"
          >Reset schema</Button>
        </div>
        <div class="wrapper">
          <Table
            :loading="loading"
            :columns="tableTitle"
            :data="nodeData.tableData"
            tooltip-theme="dark"
          >
            <template slot-scope="{ row }" slot="columnName">
              <Input v-model="row.columnName"></Input>
            </template>
            <template slot-scope="{ row }" slot="type">
              <Select v-model="row.type" placeholder="请输入" transfer>
                <Option
                  v-for="(item,index) in typeArr"
                  :value="item.value"
                  :label="item.label"
                  :key="item.label"
                >{{item.label}}</Option>
              </Select>
            </template>
            <template slot-scope="{ row }" slot="format">
              <Select v-model="row.type" placeholder="请输入" transfer>
                <Option
                  v-for="(item,index) in timeFormatArr"
                  :value="item.value"
                  :label="item.label"
                  :key="item.label"
                >{{item.label}}</Option>
              </Select>
            </template>
          </Table>
          <div class="page" style="text-align:right;padding-top:10px;">
            <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
          </div>
        </div>
      </TabPane>
      <!-- <TabPane label="分区优化" name="name5">
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
      </TabPane>-->
      <TabPane label="元数据" name="name6">
        <div class="wrapper">
          <dataMeta :nodeData="nodeData" />
        </div>
      </TabPane>
      <TabPane label="预览" name="name7">
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
import {
  getLink,
  ajaxGetConn

} from '@/api/link.js'
import {

  ajaxGetDataSource
} from '@/api/pipeline.js'
import { userFunc } from '@/api/user1.js'
import kafkaForm from './kafkaForm'
import hiveForm from './hiveForm'
import hbaseForm from './hbaseForm'
import dataMeta from './dataMeta'
import clusterTabCommon from './clusterTabCommon'

let splitIcon1 = require('@/assets/images/splitIcon1.png')
let splitIcon2 = require('@/assets/images/splitIcon2.png')
let splitIcon3 = require('@/assets/images/splitIcon3.png')
let splitIcon4 = require('@/assets/images/splitIcon4.png')
export default {
  name: 'startTab',
  props: ['pipeline', 'nodeData'],
  data() {
    return {
      versionArr: [{
        label: 'universal',
        value: 'universal'
      }],
      offsetResetArr: [{
        label: '自定义',
        value: '0'
      },
      {
        label: 'earliest',
        value: 'earliest'
      },
      {
        label: 'latest',
        value: 'latest'
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
      },
      {
        value: 'json',
        label: 'json'
      },
      {
        value: 'text',
        label: 'text'
      }],
      OperationTypeArr: [{
        value: '仅增加',
        label: '仅增加'

      },
      {
        value: '支持更新删除',
        label: '支持更新删除'
      }],
      typeTimeArr: [

      ],
      typeArr: [{
        value: 'timestamp',
        label: 'timestamp',
        filter: 'string'
      }
      ],
      typeFormatArr: [{
        value: 'string',
        label: 'string',
        filter: 'string'
      }],
      dateFormatArr: [{
        value: 'yyyyMMdd',
        label: 'yyyyMMdd',
        filter: 'date'

      }, {
        value: 'yyyy-MM-dd',
        filter: 'date',
        label: 'yyyy-MM-dd'

      }, {
        value: 'yyMMdd',
        filter: 'date',
        label: 'yyMMdd'

      }, {
        value: 'yy-MM-dd',
        filter: 'date',
        label: 'yy-MM-dd'

      }],
      timeFormatArr: [{
        filter: 'datetime',
        value: 'HH',
        label: 'HH'

      },
      {
        filter: 'datetime',
        value: 'HH:mm',
        label: 'HH:mm'

      },
      {
        filter: 'datetime',
        value: 'HH:mm:ss',
        label: 'HHH:mm:ssH'

      },
      {
        filter: 'datetime',
        value: 'yyyy-MM-dd HH:mm:ss',
        label: 'yyyy-MM-dd HH:mm:ss'

      },
      {
        filter: 'datetime',
        value: 'yyyy-MM-dd HH:mm',
        label: 'yyyy-MM-dd HH:mm'

      }
      ],

      formatArr: [{
        value: 'specify format',
        label: 'specify format'
      }],
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
          width: 130,
          key: 'column10',
          eclipse: true,
          tooltip: true

        }

      ],
      tableData: [
        {
          columnName: 'op_ts',
          type: 'timestamp',
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
        outputStream: '',
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
      formLink: {
        link: '',
        topic: '',
        colony: '',
        username: ''
      }

    }
  },
  computed: {
    zjName() {
      return this.curModal
    },
    getFormat(row) {
      let arr = [].concat(this.typeFormatArr).concat(this.dateFormatArr).concat(this.timeFormatArr)
      return arr
    },
    getClusterValue() {
      let val = this.nodeData.formLink.colony
      this.linkArr = []
      this.userArr = []

      return this.nodeData.formLink.colony
    }
  },
  watch: {
    'nodeData.formLink.colony': function (val) {
      this.linkArr = []
      this.userArr = []
    }
  },
  methods: {
    pageChange(val) {

    },
    handleGetDataSource(name) {
      if (name == 'name6') {
        this.$bus.emit('getDataSource')
      }
    },
    // changeColony (val) {
    //   this.getCurLinkArr(val)
    //   this.getCurUserArr(val)
    // },
    handleFailModal() { },
    handleSuccessModal() { },

    // =============== 上述不一定要
    handleSetUsernameToColony() {
      this.$Message.success('设置当前账号成功')
    },
    handleReset() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    handleSuccessModal(postData) {
      this.outputStreamArr.push(postData)
      this.modalHide('modal1')
    },
    modalHide(k) {
      this[k] = false
    },
    chooseType(item, index) {
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
    handleDrawAdd() {
      this.value3 = false
      this.modalShow('modal1')
    },
    modalShow(k) {
      this[k] = true
    },
    // handleAddDataSetName() {
    //   this.value3 = true
    // },
    handleAddColumns() {
      this.formOpt.columns.unshift({ name: '' })
    },
    handleRemove(index) {
      this.formOpt.columns.splice(index, 1)
    },
    handleInitData() {
      // 把动态的值给赋值上
      // this.getCurLinkArr()
      // this.getCurUserArr()
    }
  },
  components: {
    kafkaForm,
    hiveForm,
    hbaseForm,
    clusterTabCommon,
    dataMeta
  },
  created() {
    this.$bus.on('handleInitData', this.handleInitData)
  },
  mounted() {
    console.log('=======this', this)
    this.$nextTick(() => {
      // this.initFormLinkArr()
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
