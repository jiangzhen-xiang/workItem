
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
          >
            <FormItem label="输出流名称" prop="outputStream">
              <Input type="text" v-model="nodeData.formSource.outputStream" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="注册内部表" prop="iszcnbb">
              <i-switch v-model="nodeData.formSource.iszcnbb" size="small">
                <span slot="open"></span>
                <span slot="close"></span>
              </i-switch>
            </FormItem>-->
            <!-- <FormItem label="内部表名称" prop="nbbTableName" >
              <Input v-model="nodeData.formSource.nbbTableName" placeholder="请输入"></Input>
            </FormItem>-->
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
            <FormItem label="并行度" prop="isParallelism">
              <RadioGroup v-model="nodeData.formSource.isParallelism">
                <Radio label="0">自动</Radio>
                <Radio label="1">自定义</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="并行度自定义值" prop="option" v-if="nodeData.formSource.isParallelism == '1'">
              <Input v-model="nodeData.formSource.parallelismValue" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="fieldDelimiter" prop="fieldDelimiter" v-if="nodeData.type == 'kafka'">
              <Input type="text" v-model="nodeData.formSource.fieldDelimiter" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="schemaInfo" prop="schemaInfo">
              <Input
                type="textArea"
                v-model="nodeData.formSource.schemaInfo"
                placeholder="请输入"
                rows="10"
              ></Input>
            </FormItem>
            <FormItem label="partitionKeys" prop="partitionKeys" v-if="nodeData.type == 'kafka'">
              <Select v-model="nodeData.formSource.partitionKeys" placeholder="请输入" disabled>
                <Option
                  v-for="(item,index) in partitionKeysArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="rowkeyFields" prop="rowkeyFields" v-if="nodeData.type == 'hbase'">
              <Input v-model="nodeData.formSource.rowkeyFields" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="writeRowkey" prop="writeRowkey" v-if="nodeData.type == 'hbase'">
              <Input v-model="nodeData.formSource.writeRowkey" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="readRowkey" prop="readRowkey" v-if="nodeData.type == 'hbase'">
              <Input v-model="nodeData.formSource.readRowkey" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="kafka.connector.version" prop="version">
              <Select v-model="nodeData.formSource.version" placeholder="请输入">
                <Option
                  v-for="(item,index) in versionArr"
                  :value="item.value"
                  :label="item.label"
                  :key="index"
                >{{item.label}}</Option>
              </Select>
            </FormItem>-->

            <!-- <FormItem label="元数据自动变更" prop="isAutoChange">
              <RadioGroup v-model="nodeData.formSource.isAutoChange">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="校验元数据" prop="isAutoChangeType">
              <RadioGroup v-model="nodeData.formSource.isAutoChangeType">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>-->
            <!-- <div>
              <div style>rowkey:</div>
              <div class="flex" style="flex-wrap:nowrap">
                <div>
                  <FormItem label="表达式" prop="rowkeyexp">
                    <Input
                      type="“textarea”"
                      v-model="nodeData.formSource.rowkeyexp"
                      placeholder="请输入"
                    ></Input>
                  </FormItem>
                </div>
                <div>
                  <FormItem label="分区字段" prop="column">
                    <Input type="“textarea”" v-model="nodeData.formSource.column" placeholder="请输入"></Input>
                  </FormItem>
                </div>
                <div>
                  <FormItem label="排序字段" prop="order">
                    <Input t v-model="nodeData.formSource.order" placeholder="请输入"></Input>
                  </FormItem>
                </div>
              </div>
            </div>-->
          </Form>
        </div>
      </TabPane>
      <TabPane label="映射" name="name3">
        <Form
          ref="formSourceOption"
          :model="nodeData.formSourceOption"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="自动映射" prop="isAuto">
            <RadioGroup v-model="nodeData.formSourceOption.isAuto">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">映射增加</label>
              <Button type="default" @click="handleAddRule">增加</Button>
            </div>
            <div class="itemWrapper">
              <Table
                :loading="loading"
                :columns="tableTitleMap"
                :data="nodeData.formSourceOption.rule"
                tooltip-theme="dark"
                border
                :height="tableHeight"
                @on-selection-change="selectRow"
              >
                <template slot-scope="{ row,index }" slot="input">
                  <Input text="text" v-model="row.input" @on-change="changeInput(row,index)"></Input>
                </template>
                <template slot-scope="{ row,index }" slot="modeType">
                  <Select
                    v-model="row.modeType"
                    placeholder="请输入"
                    transfer
                    @on-change="changeModeType(row,index)"
                  >
                    <Option
                      v-for="(item,index) in modeTypeArr"
                      :value="item.value"
                      :label="item.label"
                      :key="index"
                    >{{item.label}}</Option>
                  </Select>
                </template>
                <template slot-scope="{ row,index }" slot="output">
                  <Input v-model="row.output" @on-change="changeOutput(row,index)"></Input>
                </template>
                <template slot-scope="{ row,index }" slot="action">
                  <Button type="error" @click="handleDeleteRule(row)">删除</Button>
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="nodeData.formSourceOption.rule.length"
                  show-total
                  show-elevator
                  @on-change="pageChange"
                />
              </div>
            </div>
          </div>
        </Form>
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
            <Page
              :total="nodeData.tableData.length"
              show-total
              show-elevator
              @on-change="pageChange"
            />
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
          <div class="btnGroups" style="text-align:center;padding-bottom:10px;">
            <RadioGroup v-model="switch1" type="button">
              <Radio label="输入" border></Radio>
              <Radio label="输出" border></Radio>
            </RadioGroup>
          </div>
          <div v-if="(switch1 == '输入')">
            <dataMetaInput :nodeData="nodeData" />
          </div>
          <div v-else>
            <dataMeta :nodeData="nodeData" />
          </div>
        </div>
      </TabPane>
      <TabPane label="预览" name="name7">
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
                  v-for="(item,index) in typeArr"
                  :value="item.value"
                  :label="item.label"
                  :key="item.label"
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
      <TabPane label="与上游比较" name="name8">
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
              :columns="tableTitlePrevCompare"
              :data="tableDataPrevCompare"
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
                :total="tableDataPrevCompare.length"
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
                    v-for="(item,index) in typeArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
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
import {
  getLink,
  ajaxGetConn
} from '@/api/link.js'
import { userFunc } from '@/api/user1.js'
import kafkaForm from './kafkaForm'
import hiveForm from './hiveForm'
import hbaseForm from './hbaseForm'
import dataMeta from './dataMeta'
import dataMetaInput from './dataMetaInput'
import clusterTabCommon from './clusterTabCommon'

let splitIcon1 = require('@/assets/images/splitIcon1.png')
let splitIcon2 = require('@/assets/images/splitIcon2.png')
let splitIcon3 = require('@/assets/images/splitIcon3.png')
let splitIcon4 = require('@/assets/images/splitIcon4.png')
export default {
  name: 'endTab',
  props: ['pipeline', 'nodeData'],
  data() {
    return {
      modeTypeArr: [{
        value: 'normal',
        label: 'normal'
      },
      {
        value: 'patten',
        label: 'patten'
      }],
      versionArr: [{
        label: 'universal',
        value: 'universal'
      }],
      partitionKeysArr: [{
        label: 'CUST_CODE',
        value: 'CUST_CODE'
      }],
      formCompare: {
        beforDrawData: '',
        beforeOrder: '',
        curOrder: ''

      },
      beforDrawDataArr: [],
      beforeOrderArr: [],
      tableTitlePrevCompare: [
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
          width: 130,
          key: 'column10',
          eclipse: true,
          tooltip: true

        }

      ],
      tableDataPrevCompare: [{
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
      curOrderArr: [],
      switch1: '输入',
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
        value: 'plain',
        label: 'plain'
      }, {
        value: 'json',
        label: 'json'
      }, {
        value: 'avro',
        label: 'avro'
      },
      {
        value: 'text',
        label: 'text'
      }],
      OperationTypeArr: [{
        value: '增加',
        label: '增加'
      },
      {
        value: '支持更新删除',
        label: '支持更新删除'
      }],
      typeArr: [{
        value: 'string',
        label: 'string'
      }],
      formatArr: [{
        value: 'specify format',
        label: 'specify format'
      }],
      tableTitleMap: [
        {
          title: 'input column',
          key: 'input',
          eclipse: true,
          tooltip: true,

          slot: 'input'
        },
        {
          title: 'mode type',
          key: 'modeType',
          eclipse: true,
          tooltip: true,

          slot: 'modeType'
        },
        {
          title: 'output column',
          key: 'output',
          eclipse: true,
          tooltip: true,

          slot: 'output'
        },
        {
          title: '操作',
          key: 'action',
          eclipse: true,
          tooltip: true,

          slot: 'action'
        }
      ],
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
      tableData: [
        {
          columnName: 'op_ts',
          type: 'timestamp',
          format: 'specify format'
        }

      ],
      tableTitlePrev: [
        {
          title: 'name',
          key: 'name',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'uid',
          key: 'uid',
          eclipse: true,
          tooltip: true
        },
        {
          title: 'grade',
          key: 'grade',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'birth',
          key: 'birth',
          eclipse: true,
          tooltip: true

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
        completion: '',
        rule: [{
          input: 'after.$$',
          output: '$$'
        }]
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
      formLink: {
        link: '',
        colony: '',
        topic: '',
        user: ''
      }

    }
  },
  computed: {
    zjName() {
      return this.curModal
    },
    getClusterValue() {
      let val = this.nodeData.formLink.colony
      this.linkArr = []
      this.userArr = []
      // this.getCurLinkArr(val)
      // this.getCurUserArr(val)
      return this.nodeData.formLink.colony
    }
  },
  methods: {
    handleGetDataSource(name) {
      if (name == 'name6') {
        this.$bus.emit('getDataSource', { nodeData: this.nodeData })
      }
    },
    changeOutput(row, index) {
      this.nodeData.formSourceOption.rule[index].output = row.output
      this.$set(this.nodeData.formSourceOption.rule, index, row)
    },
    changeInput(row, index) {
      this.nodeData.formSourceOption.rule[index].input = row.input
      this.$set(this.nodeData.formSourceOption.rule, index, row)
    },
    changeModeType(row, index) {
      this.nodeData.formSourceOption.rule[index].modeType = row.input
      this.$set(this.nodeData.formSourceOption.rule, index, row)
    },
    handleDeleteRule(row) {
      this.nodeData.formSourceOption.rule.splice(row['_index'], 1)
    },
    handleAddRule() {
      this.nodeData.formSourceOption.rule.push({
        input: '',
        output: ''
      })
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
    handleAddDataSetName() {
      this.value3 = true
    },
    handleAddColumns() {
      this.formOpt.columns.unshift({ name: '' })
    },
    handleRemove(index) {
      this.formOpt.columns.splice(index, 1)
    }
  },
  components: {
    kafkaForm,
    hiveForm,
    hbaseForm,
    dataMeta,
    clusterTabCommon,
    dataMetaInput
  },
  created() { },
  mounted() {
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
