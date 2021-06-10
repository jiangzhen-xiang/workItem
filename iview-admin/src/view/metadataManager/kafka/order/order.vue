
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:34px;">
            <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline >
            <FormItem  prop="name">
              <Input v-model="formSearch.name" placeholder="操作字段名称" size="small"></Input>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />创建需求申请
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="tableData" border :height="tableHeight">
              <template slot-scope="{ row,index }" slot="name">
                    <Tooltip :content="row.name" placement="top-start">
                      <Button type="text" @click="handleGoEnv(row)">{{row.name}}</Button>
                    </Tooltip>
                </template>

                <template slot-scope="{ row }" slot="firstPublishDate">
                   <span> {{ getOperationTypeText(row.firstPublishDate)}}</span>
                </template>
                <template slot-scope="{ row,index }" slot="action">
                   <Dropdown @on-click="handleDropdownMenu(row,$event)" transfer>
                      <a href="javascript:void(0)">
                          操作
                          <Icon type="ios-arrow-down"></Icon>
                      </a>
                      <DropdownMenu slot="list" >
                          <DropdownItem name="Editor"><div style="color:#2db7f5"><Icon type="ios-create-outline" />  编辑</div></DropdownItem>
                          <DropdownItem name="Delete"><div style="color:#ed4014"><Icon type="ios-trash-outline" />  删除</div></DropdownItem>
                      </DropdownMenu>
                  </Dropdown>
                </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="total" show-total show-elevator :current ="current" :page-size="pageSize" size="small" @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal v-model="modalColony" title="需求申请单" footer-hide>
      <div class="formWrapper">
          <colonyForm  @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony" title="编辑需求申请单" footer-hide>
      <div class="formWrapper">
          <colonyEditorForm  ref="colonyEditorForm" @handleSuccess="handleColonyEditor" :row="curCluster" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment" title="增加环境" footer-hide>
      <div class="formWrapper">
          <rowenvironmentForm  @handleSuccess="handleRowEnvironmentAdd" @handleCancel="handleCancel" :index = "index" :curColony="curColony"/>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'
import rowenvironmentForm from './components/rowEnvironmentForm'

import { ajaxGetOrderMeta, ajaxDeleteOrderMeta } from '@/api/datametaCluster.js'

export default {
  name: 'order',
  data() {
    return {
      total: 0,
      value4: false,
      index: 0,
      titleValue4: '',
      curColony: '',
      modalColony: false,
      modalEditorColony: false,
      curCluster: {},

      modalRowEnvironment: false,
      tableHeight: 0,
      formSearch: {
        type: '',
        colony: ''

      },
      formValidate: {

      },
      curModal: '',
      curModalEditor: '',
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
      value3: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      loading: false,
      current: 1,
      pageSize: 10,
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
          title: '对接系统名称',
          key: 'connectedSystemName',
          minWidth: 120,
          eclipse: true,
          tooltip: true
        },
        {
          title: '对接系统简称',
          key: 'connectedSystemCode',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },
        {
          title: '需求名称(首个)',
          key: 'firstDemandName',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },

        {
          title: '上线时间',
          key: 'firstPublishDate',
          minWidth: 120,
          eclipse: true,
          tooltip: true,
          slot: 'firstPublishDate'

        },
        {
          title: '增量数据量',
          key: 'incrementData',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'kafka分区数',
          key: 'kafkaPartitionCount',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: '主题名称',
          key: 'kafkaTopicName',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },

        {
          title: '是否加载存量',
          key: 'loadingStockRemark',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'OGG版本',
          key: 'oracleOggVersion',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: '源端ORACLE字符集',
          key: 'originalOracleCharset',
          minWidth: 180,
          eclipse: true,
          tooltip: true

        },
        {
          title: '源端SCHEMA',
          key: 'originalSchema',
          minWidth: 180,
          eclipse: true,
          tooltip: true

        },
        {
          title: '备注',
          key: 'remark',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'replicate进程名',
          key: 'replicateName',
          minWidth: 180,
          eclipse: true,
          tooltip: true

        },
        {
          title: '存量数据量',
          key: 'stockData',
          minWidth: 140,
          eclipse: true,
          tooltip: true

        },
        {
          title: '涉及系统简称',
          key: 'systemInvolved',
          minWidth: 180,
          eclipse: true,
          tooltip: true

        },
        {
          title: '表英文名',
          key: 'tableCode',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: '表中文名',
          key: 'tableName',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'trail文件首字母',
          key: 'tailFileFirstName',
          minWidth: 180,
          eclipse: true,
          tooltip: true

        },

        {
          title: '操作',
          key: 'action',
          minWidth: 100,
          slot: 'action'
        }
      ],

      tableData: [
      ],
      modal1: false,
      modal2: false,
      false: false,
      formValidate: {
        colony: '',
        type: '',
        url: '',
        username: '',
        password: '',
        isValidate: '',
        validteType: '',
        annotions: ''
      },
      ruleValidate: {
        colony: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        // mail: [
        //   {
        //     required: true,
        //     message: "Mailbox cannot be empty",
        //     trigger: "blur"
        //   },
        //   { type: "email", message: "Incorrect email format", trigger: "blur" }
        // ],
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
    colonyForm,
    colonyEditorForm,
    rowenvironmentForm

  },
  computed: {
    zjName() {
      return this.curModal
    },
    zjNameEditor() {
      return this.curModalEditor
    }

  },
  methods: {
    getOperationTypeText(time) {
      return this.$timeFormat(time)
    },
    handleDropdownMenu(row, name) {
      if (this.hasOwnProperty('handleFireDropdown' + name)) {
        this['handleFireDropdown' + name](row)
      }
    },
    handleFireDropdownEditor(row) {
      this.modalShow('modalEditorColony')
      this.$nextTick(() => {
        for (let k in this.$refs.colonyEditorForm.formValidate) {
          this.$refs.colonyEditorForm.formValidate[k] = row[k]
          this.$refs.colonyEditorForm.formEditorValidate[k] = row[k]
        }
        // this.$refs.colonyEditorForm.formEditorValidate['operationType'] = this.$refs.colonyEditorForm.formEditorValidate['operationType'].toString()
        // this.$refs.colonyEditorForm.formValidate['operationType'] = this.$refs.colonyEditorForm.formValidate['operationType'].toString()
      })
    },
    handleFireDropdownDelete(row) {
      this.$Modal.confirm({
        title: '消息提示',
        closable: true,
        content: '删除该数据后将不可恢复，是否删除?',
        loading: true,
        onOk: () => {
          this.handleDeleteEnvironment(row)
          this.$Modal.remove()
          this.modal1 = false
        }
      })
    },
    handleGoEnv(row) {
      this.$router.push({
        path: 'environment',
        query: row
      })
    },
    handleColonyEditor(postData) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this.modalEditorColony = false
      })
    },
    handleCancel(key) {
      this.modalHide(key)
    },
    handleDeleteEnvironment(row) {
      this.loading = true
      ajaxDeleteOrderMeta(row).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.$Message.success('删除成功')
          this.getColonyArr()
        } else {
          this.$Message.error('删除失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleRowEnvironmentAdd(postData) {
      this.modalRowEnvironment = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let index = postData.index
        delete postData.index
        this.$set(this.tableData, index, postData)
      }, 1000)
    },
    handleColonyAdd(postData) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this.modalColony = false
      })
    },
    setTableHeight() {
      this.tableHeight = document.body.offsetHeight - 64 - 38 - 52 - 49 - 16 * 2 - 34
    },
    handleSubmitSearch() {
      this.current = 1
      this.getColonyArr()
    },
    handleFailModalEditor() { },
    handleSuccessModalEditor(postData) {
      console.log('======postData', postData)
      let index = postData.index
      this.modalHide('modal2')
      this.loading = true
      // delete postData.index;

      setTimeout(() => {
        this.loading = false
        this.$set(this.tableData, index, postData)
      }, 2000)
    },
    handleSuccessModal(postData) {
      this.tableData.push(postData)
      this.modalHide('modal1')
    },
    handleFailModal() { },
    handleDrawAdd() {
      this.value3 = false
      this.modalShow('modal1')
    },
    routeTo(item, index) {
      this.$router.push({
        name: item.name,
        params: item
      })
    },
    chooseType(item, index) {
      item.isChoose = !item.isChoose
      this.curModal = item.name + 'Form'
      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else {
        this.$set(this.fileDbArr, index, item)
      }

      this.handleDrawAdd()
    },
    handleAdd() {
      // this.value3 = true
      this.modalColony = true
    },
    handleTestConnServe() {
      let postData = this.$refs.modalForm.getFormData()
      console.log('=========postData', postData)
      this.$Message.success('连接成功')
    },
    pageChange(val) {
      this.current = +val
      this.getColonyArr()
    },
    change(name) {
      // this.handleReset(name);
    },

    modalShow(k) {
      this[k] = true
    },
    modalHide(k) {
      this[k] = false
    },
    getFormData() {
      let time = this.$timeFormat(new Date().getTime())
      let postData = {
        colony: '',
        environment: '',
        creator: '管理员',
        time: time
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },

    getColonyArr() {
      let postData = {}
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      this.formSearch.name && (postData.connectedSystemName = this.formSearch.name)
      this.loading = true
      ajaxGetOrderMeta(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$Message.error('查询数据失败')
        }
        console.log(res)
      }).catch(error => {
        this.loading = false
      })
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
      this.getColonyArr()
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    })
  }
}
</script>
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
</style>
