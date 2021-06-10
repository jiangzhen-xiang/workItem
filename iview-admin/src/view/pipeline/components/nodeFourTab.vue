
<template>
  <div>
    <Tabs value="name1">
      <TabPane label="源配置" name="name1">
        <div class="tabConten">
          <Form ref="formSource" :model="formSource" :rules="ruleValidate" :label-width="80">
            <FormItem label="输出名称" prop="outputStream">
              <Input v-model="formSource.outputStream" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="数据集" prop="dataSetName">
              <Row>
                <Col span="22">
                  <Select v-model="formSource.dataSetName" placeholder="请输入">
                    <Option
                      v-for="(item,index) in outputStreamArr"
                      :value="item.linkName"
                      :label="item.linkName"
                      :key="item.linkName"
                    >{{item.linkName}}</Option>
                  </Select>
                </Col>
                <Col span="2" style="text-align:right;" class="btnAddWrapper">
                  <Button
                    type="primary"
                    @click="handleAddDataSetName"
                    icon="ios-add"
                    style="font-size:24px;line-height:16px;"
                  >
                    <!-- <Icon type="ios-add" /> -->
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="选项" prop="option">
              <RadioGroup v-model="formSource.option">
                <Radio label="0">Allow schema drift</Radio>
                <Radio label="1">Infer drifted column types</Radio>
                <Radio label="2">Validate schema</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="Sampling" prop="Sampling">
              <RadioGroup v-model="formSource.Sampling">
                <Radio label="0">Enable</Radio>
                <Radio label="1">Disable</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="源选项" name="name2">
        <Form
          ref="formSourceOption"
          :model="formSourceOption"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="路径向导" prop="outputStream">
            <Row>
              <Col span="22">
                <Input v-model="formSourceOption.path" placeholder="请输入"></Input>
              </Col>
              <Col span="2" style="text-align:right;" class="btnAddWrapper">
                <Button
                  type="primary"
                  @click
                  icon="ios-add"
                  style="font-size:24px;line-height:16px;"
                ></Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Partition root path" prop="rootPath">
            <Input v-model="formSourceOption.rootPath" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="List of files" prop="isListFile">
            <Checkbox v-model="formSourceOption.isListFile">List of files</Checkbox>
          </FormItem>
          <FormItem label="Column to store file name" prop="columnFileName">
            <Input v-model="formSourceOption.columnFileName" placeholder="请输入"></Input>
          </FormItem>
          <!-- <FormItem label="数据集" prop="dataSetName">
            <Row>
              <Col span="22">
                <Select v-model="formSourceOption.dataSetName" placeholder="请输入">
                  <Option
                    v-for="(item,index) in outputStreamArr"
                    :value="item.linkName"
                    :label="item.linkName"
                    :key="item.linkName"
                  >{{item.linkName}}</Option>
                </Select>
              </Col>
              <Col span="2" style="text-align:right;" class="btnAddWrapper">
                <Button
                  type="primary"
                  @click="handleAddDataSetName"
                  icon="ios-add"
                  style="font-size:24px;line-height:16px;"
                ></Button>
              </Col>
            </Row>
          </FormItem>-->
          <FormItem label="After completion" prop="completion">
            <RadioGroup v-model="formSourceOption.completion">
              <Radio label="0">No action</Radio>
              <Radio label="1">删除源文件</Radio>
              <Radio label="2">Move</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="filter by last modify " prop="modify">
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择"></DatePicker>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="项目" name="name3">
        <div class="btnGroups" style="padding-bottom:10px;">
          <Button
            type="primary"
            @click
            style="font-size:16px;line-height:16px;margin-right:5px;"
          >Define Default format</Button>
          <Button
            type="primary"
            @click
            style="font-size:16px;line-height:16px;margin-right:5px;"
            disabled
          >Delete Data type</Button>
          <Button
            type="primary"
            @click
            style="font-size:16px;line-height:16px;margin-right:5px;"
          >Import projection</Button>
          <Button
            type="primary"
            @click
            style="font-size:16px;line-height:16px;margin-right:5px;"
          >Reset schema</Button>
        </div>

        <div class="wrapper">
          <Table
            :loading="loading"
            :columns="tableTitle"
            :data="tableData"
            tooltip-theme="dark"
            border
            :height="tableHeight"
            @on-selection-change="selectRow"
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
            <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
          </div>
        </div>
      </TabPane>
      <!-- <TabPane label="优化程序" name="name4">
        <Form ref="formOpt" :model="formOpt" :rules="ruleValidate" :label-width="80">
          <FormItem label="分割选项">
            <RadioGroup v-model="formOpt.formOpt">
              <Radio label="0">Use current partitioning</Radio>
              <Radio label="1">Single partition</Radio>
              <Radio label="2">Set partitioning</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="分割类型" prop="partType">
            <List class="partWrapper">
              <ListItem>
                <ListItemMeta
                  v-for="(item,index) in listArr"
                  :avatar="item.icon"
                  :title="item.title"
                  :description="item.desc"
                />
              </ListItem>
            </List>
          </FormItem>

          <FormItem label="分割数" prop="partNum">
            <Input v-model="formOpt.partNum" placeholder="请输入"></Input>
          </FormItem>
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">columns</label>
              <Button type="default" @click="handleAddColumns">增加</Button>
            </div>
            <div class="itemWrapper">
              <FormItem
                v-for="(item, index) in formOpt.columns"
                :key="index"
                label="选择column"
                :prop="item.name"
              >
                <Row>
                  <Col span="18">
                    <Select v-model="item.columnName">
                      <Option value="name">name</Option>
                      <Option value="age">age</Option>
                      <Option value="sex">sex</Option>
                    </Select>
                  </Col>
                  <Col span="4" offset="1" style="text-align:right;float:right;">
                    <Button @click="handleRemove(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </Form>
      </TabPane>
      <TabPane label="检查" name="name5">
        <div class="wrapper">
          <Table
            :loading="loading"
            :columns="tableTitleInspect"
            :data="tableDataInspect"
            tooltip-theme="dark"
            border
            :height="tableHeight"
            @on-selection-change="selectRow"
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
              :total="tableDataInspect.length"
              show-total
              show-elevator
              @on-change="pageChangeInspect"
            />
          </div>
        </div>
      </TabPane>
      <TabPane label="预览" name="name6">
        <div class="wrapper">
          <Table
            :loading="loading"
            :columns="tableTitlePrev"
            :data="tableDataPrev"
            tooltip-theme="dark"
            border
            :height="tableHeight"
            @on-selection-change="selectRow"
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
              :total="tableDataPrev.length"
              show-total
              show-elevator
              @on-change="pageChangePrev"
            />
          </div>
        </div>
      </TabPane>-->
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
export default {
  name: 'nodeOneTab',
  data () {
    return {
      typeArr: [{
        value: 'string',
        label: 'string'
      }],
      formatArr: [{
        value: 'specify format',
        label: 'specify format'
      }],
      tableTitle: [

        {
          title: '名称',
          key: 'dataSetName',
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
          title: '备注',
          key: 'desc',
          eclipse: true,
          tooltip: true,

          slot: 'format'
        }

      ],
      tableTitleInspect: [

        {
          title: '名称',
          key: 'columnName',
          eclipse: true,
          tooltip: true

        },
        {
          title: '类型',
          key: 'type',
          eclipse: true,
          tooltip: true
        },
        {
          title: '备注',
          key: 'format',
          eclipse: true,
          tooltip: true

        }

      ],
      tableTitlePrev: [
        {
          title: 'column1',
          key: 'column1',
          eclipse: true,
          tooltip: true

        },
        {
          title: 'column2',
          key: 'column2',
          eclipse: true,
          tooltip: true
        },
        {
          title: 'column3',
          key: 'column3',
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
      tableDataInspect: [
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
        column1: 'column1',
        column2: 'string',
        column3: 'specify format'
      },
      {
        column1: 'column2',
        column2: 'string',
        column3: 'specify format'
      },
      {
        column1: 'column3',
        column2: 'string',
        column3: 'specify format'
      },
      {
        column1: 'column4',
        column2: 'string',
        column3: 'specify format'
      },
      {
        column1: 'column5',
        column2: 'string',
        column3: 'specify format'
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
        partNum: '',
        partType: '',
        formOpt: '',
        columns: [{
          columnName: 'name'
        }]
      },
      formSource: {
        outputStream: '',
        dataSetName: '',
        option: '',
        Sampling: ''
      }

    }
  },
  computed: {
    zjName () {
      return this.curModal
    }
  },
  methods: {
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
    hbaseForm
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
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
