
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div style="position:relative;z-index:0;">
    <Spin v-show="showAuthor"
          fix>
      <Icon type="ios-loading"
            size=18
            class="demo-spin-icon-load"></Icon>
      <div style="white-space: nowrap;">{{actionMsg}}</div>
    </Spin>
    <Row class="margin-top-10"
         :gutter="8">

      <i-col span="24">
        <Card>
          <div slot="title"
               style="height:34px;">
            <div class="search-form-container">
              <Form ref="formSearch"
                    :model="formSearch"
                    inline>
                <FormItem prop="applyFileName">
                  <Input v-model="formSearch.applyFileName"
                         placeholder="申请单名称"
                         size="small"></Input>
                </FormItem>
                <FormItem prop="tenantUser">
                  <Input v-model="formSearch.tenantUser"
                         placeholder="租户"
                         size="small"></Input>
                </FormItem>
                <FormItem>
                  <DatePicker type="daterange"
                              format="yyyy-MM-dd"
                              confirm
                              placement="bottom-end"
                              placeholder="日期"
                              style="width: 200px"
                              transfer
                              @on-change="handleDateChange"></DatePicker>
                </FormItem>
                <FormItem prop="stat"
                          style="width:150px;">
                  <Select v-model="formSearch.stat"
                          placeholder="状态"
                          size="small"
                          transfer>
                    <Option v-for="(item,index) in statArr "
                            :label="item.label"
                            :value="item.value"
                            :key="index">{{item.label}}</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary"
                          size="small"
                          @click="handleSubmitSearch('formSearch')">查询</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <div class="btnWrapper"
               slot="extra"
               style="left:16px;">
            <Button @click="handleAuthorBeforeCheck"
                    type="primary"
                    size="small"
                    style="margin-right:10px;">
              <Icon type="ios-ios-plus" />授权前校验
            </Button>
            <Button @click="handleAuthorAfterCheck"
                    type="primary"
                    size="small"
                    style="margin-right:10px;">
              <Icon type="ios-ios-plus" />授权后校验
            </Button>

            <Button @click="handleAuthor"
                    type="primary"
                    size="small"
                    style="margin-right:10px;">
              <Icon type="ios-ios-plus" />批量授权
            </Button>

            <!-- <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />上传申请单
              </Button> -->

          </div>
          <div class="wrapper">
            <Table :loading="loading"
                   :columns="tableTitle"
                   tooltip-theme="dark"
                   :data="tableData"
                   border
                   @on-select-all-cancel="handleCancelSelectAll"
                   @on-select-all="handleSelectAll"
                   @on-select="handleSelect"
                   @on-select-cancel="handleCancelSelect">
              <template slot-scope="{ row,index }"
                        slot="action">
                <Dropdown @on-click="handleDropdownMenu(row,$event)"
                          transfer>
                  <a href="javascript:void(0)">
                    操作
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="AuthorBefore">
                      <div style="color:#2db7f5">
                        <Icon type="ios-attach" /> 授权前校验
                      </div>
                    </DropdownItem>
                    <DropdownItem name="AuthorAfter">
                      <div style="color:#2db7f5">
                        <Icon type="md-attach" /> 授权后校验
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Author">
                      <div style="color:#2db7f5">
                        <Icon type="md-checkbox-outline" /> 授权
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Look">
                      <div style="color:#2db7f5">
                        <Icon type="ios-american-football-outline" /> 预览
                      </div>
                    </DropdownItem>
                    <!-- <DropdownItem name="Export"><div style="color:#2db7f5"><Icon type="ios-american-football-outline" />  导出</div></DropdownItem> -->
                    <DropdownItem name="Export1">
                      <div style="color:#2db7f5"><a :href=downloadRowHref(row)>
                          <Icon type="ios-cloud-download-outline" /> 导出
                        </a></div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </template>
            </Table>
            <div class="page"
                 style="text-align:right;padding-top:10px;">
              <Page :total="total"
                    show-total
                    show-elevator
                    :current="current"
                    :page-size="pageSize"
                    size="small"
                    @on-change="pageChange" />
            </div>
          </div>
        </Card>

      </i-col>
    </Row>
    <Modal v-model="modalColony"
           title="申请单上传"
           footer-hide>
      <div class="formWrapper">
        <SecondForm ref="addForm"
                    :form="addForm"
                    @handleOk="handleColonyAdd"
                    @handleCancel="handleCancelAdd" />
      </div>
    </Modal>
    <Modal v-model="modalEditorColony"
           title="编辑集群"
           footer-hide>
      <div class="formWrapper">
        <SecondForm ref="editorForm"
                    :form="editorForm"
                    @handleOk="handleColonyEditor"
                    @handleCancel="handleCancelEditor" />
      </div>
    </Modal>

    <Modal v-model="modalLook"
           :title="lookTitle"
           footer-hide
           width="80%">
      <div class="formWrapper">
        <commonTable @firePageChange="handlePageChange"
                     :tableTitle="lookTableColumn"
                     :tableData="lookTableData"
                     :postData="paramPostData"
                     :total="pageTotal" />
      </div>
    </Modal>

    <Drawer :title="drawerTitle"
            width="640"
            v-model="visibleLog"
            :mask-closable="false">
      <div>
        <Table :columns="logTitle"
               :data="logData"></Table>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { addForm, editorForm } from './components/memberStatic'
import commonTable from '@/common/commonTable'
import SecondForm from '@/common/SecondForm'
import { ajaxGetApp, ajaxDeleteApp } from '@/api/app.js'
import { ajaxCheckAuthor, ajaxCheckAuthorBefore, ajaxCheckAuthorAfter, ajaxExportApplyAuthor } from '@/api/author.js'
import { ajaxGetRecord } from '@/api/record.js'
import expandRow from './components/table-expand.vue'
// require('@/mock/config.js')
export default {
  name: 'implement',
  data () {
    return {
      actionMsg: '',
      showAuthor: false,
      isDisabledCheckBefore: false,
      isDisabledCheckAfter: false,
      isDisabled: false,
      statArr: [
        {
          label: '所有',
          value: ''
        }, {
          label: '未授权',
          value: '0'
        },
        {
          label: '授权前校验成功',
          value: '3'
        },
        {
          label: '授权前校验失败',
          value: '4'
        },
        {
          label: '授权成功',
          value: '1'
        },
        {
          label: '授权失败',
          value: '2'
        }
      ],
      drawerTitle: '',
      visibleLog: false,
      logTitle: [{
        type: 'expand',
        width: 50,
        render: (h, params) => {
          return h(expandRow, {
            props: {
              row: params.row
            }
          })
        }
      }, {
        title: '编号',
        key: 'id',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      },
      {
        title: '申请单名称',
        key: 'applyFileName',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      },
      {
        title: '租户',
        key: 'tenantUser',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      },
      {
        title: '校验信息',
        key: 'message',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }],
      logData: [
        // {
        //   'id': 'uuid',
        //   'applyFileName': '申请单名字',
        //   'applyDetailList': [
        //     {
        //       'id': 'uuid',
        //       'clusterCode': 'prod',
        //       'component': 'hive',
        //       'dbName': 'db',
        //       'tableName': 'tab',
        //       'colName': 'col',
        //       'operType': '授权',
        //       'grantType': '查询',
        //       'state': '授权成功',
        //       'code': '1',
        //       'msg': '授权成功'
        //     }
        //   ],
        //   'code': '1',
        //   'msg': '授权成功'
        // }
      ],
      files: [],
      selected: [],
      selectedArr: [],
      addForm: addForm,
      editorForm: editorForm,
      modalLook: false,
      paramPostData: {
        handleSearch: '', // 方法名
        conditionSearch: {}
      },
      pageTotal: 0,
      lookTitle: '',
      lookTableColumn: [],
      lookTableData: [],
      //= ============弹窗组件=================
      total: 62,
      index: 0,
      modalColony: false,
      modalEditorColony: false,
      tableHeight: 0,
      formSearch: {
        'applyFileName': '',
        'tenantUser': '',
        'prodBeginDate': '',
        'prodEndDate': '',
        'stat': ''
      },
      loading: false,
      current: 1,
      pageSize: 10,
      tableTitle: [
        // {
        //   type: 'expand',
        //   width: 50,
        //   render: (h, params) => {
        //     return h(expandRow, {
        //       props: {
        //         row: params.row
        //       }
        //     })
        //   }
        // },
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '序号',
          width: 80,
          fixed: 'left',
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.pageSize
            )
          }
        },
        {
          title: '编号',
          key: 'id',
          fixed: 'left',
          minWidth: 140,
          resizable: true,
          eclipse: true,
          tooltip: true
        },
        {
          title: '申请单名称',
          key: 'applyFileName',
          minWidth: 140,
          fixed: 'left',
          eclipse: true,
          tooltip: true
        },
        {
          title: '租户',
          key: 'tenantUser',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '投产日期',
          key: 'prodDate',
          minWidth: 100,
          eclipse: true,
          tooltip: true,
          render: (h, params) => {
            let that = this
            let text = that.$timeFormat(params.row.prodDate, 'yyyy-MM-dd')
            return h(
              'div', [
              h('Tooltip', {
                props: {
                  placement: 'top'
                }
              }, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '60%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, text),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, text)
              ])
            ]
            )
          }

        },
        {
          title: '联系人',
          key: 'contacts',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '联系方式',
          key: 'contactWay',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '状态',
          key: 'stat',
          minWidth: 125,
          eclipse: true,
          tooltip: true,
          render: (h, params) => {
            return h(
              'span',
              ['未授权', '授权成功', '授权失败', '授权前校验成功', '授权前校验失败', '授权后校验成功', '授权后校验失败'][params.row.stat]
            )
          }
        },
        {
          title: '申请人',
          key: 'reqUser',
          minWidth: 100,

          resizable: true,
          eclipse: true,
          tooltip: true
        },
        {
          title: '申请时间',
          key: 'reqTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true,
          render: (h, params) => {
            let that = this
            let text = that.$timeFormat(params.row.reqTime, 'yyyy-MM-dd HH:mm:ss')
            return h(
              'div', [
              h('Tooltip', {
                props: {
                  placement: 'top'
                }
              }, [
                h('span', {
                  props: {
                    class: 'fock'
                  },
                  style: {
                    display: 'inline-block',
                    width: '60%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, text),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, text)
              ])
            ]
            )
          }
        },
        {
          title: '授权人',
          key: 'grantUser',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '授权时间',
          key: 'grantTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true,
          render: (h, params) => {
            let that = this
            let text = that.$timeFormat(params.row.grantTime, 'yyyy-MM-dd')
            return h(
              'div', [
              h('Tooltip', {
                props: {
                  placement: 'top'
                }
              }, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '60%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, text),
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, text)
              ])
            ]
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          minWidth: 100,
          slot: 'action'
        }
      ],
      tableData: [
        // {
        //   id: '123',
        //   applyFileName: 'focktest',
        //   stat: 5
        // },
        // {
        //   id: 'ac',
        //   applyFileName: 'focktest'
        // },
        // {
        //   id: 'fd',
        //   applyFileName: 'focktest'
        // },
        // {
        //   id: '9d',
        //   applyFileName: 'focktest'
        // }
      ],
      modal1: false,
      modal2: false,
      false: false
    }
  },
  components: {
    commonTable,
    SecondForm

  },
  computed: {
    downloadRowHref (row) {
      let that = this
      return function (row) {
        console.log('==========row1111', row)
        let str = that.selected.toString()
        let strAutho = 'Authorization=' + sessionStorage.getItem('token')
        return ('/bdap-metadata-privilege/apply/exportApply?' + strAutho + '&applyIds=' + row.id)
      }
    }

  },
  methods: {
    handleFireDropdownLook (row) {
      this.modalLook = true

      // 讲row值赋给编辑的参数
      this.setLookTitle(row)
      this.setLookTableColumn(row)
      this.setLookTableDataAndPageTotal(row)
      this.setParamPostData(row)
    },
    // 设置查询弹窗的标题
    setLookTitle (row) {
      // coding .....................
      // ...
      // ...
      this.lookTitle = '预览(' + row.applyFileName + ')'
    },
    // 设置查询弹窗表格的标题
    setLookTableColumn (row) {
      // code yourself .................................
      // ...
      this.lookTableColumn = [{
        title: '序号',
        width: 80,
        align: 'center',
        render: (h, params) => {
          return h(
            'span',
            +params.index + 1 + (this.current - 1) * this.pageSize
          )
        }
      },
      {
        title: '',
        key: 'message',
        minWidth: 160,
        eclipse: true,
        tooltip: true,
        slot: 'result'

      },
      {
        title: '租户',
        key: 'tenantUser',
        minWidth: 160,
        eclipse: true,
        tooltip: true

      },

      {
        title: '集群标识',
        key: 'clusterCode',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      },
      {
        title: '组件',
        key: 'component',
        minWidth: 100,
        eclipse: true,
        tooltip: true
      },
      {
        title: '数据库名称',
        key: 'dbName',
        minWidth: 100,
        eclipse: true,
        tooltip: true
      },
      {
        title: '表名称',
        key: 'tableName',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      },
      {
        title: '字段名称',
        key: 'colName',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      },
      {
        title: '授权状态',
        key: 'stat',
        minWidth: 125,
        eclipse: true,
        tooltip: true,
        render: (h, params) => {
          return h(
            'span',
            ['未授权', '授权成功', '授权失败', '授权前校验成功', '授权前校验失败'][params.row.stat]
          )
        }

      },
      {
        title: '操作类型',
        key: 'operType',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      },
      {
        title: '权限类型',
        key: 'grantType',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      },
      {
        title: '投产日期',
        key: 'prodDate',
        minWidth: 100,
        eclipse: true,
        tooltip: true,
        render: (h, params) => {
          let that = this
          return h(
            'span',
            that.$timeFormat(params.row.prodDate, 'yyyy-MM-dd')
          )
        }

      },
      {
        title: '申请日期',
        key: 'reqTime',
        minWidth: 100,
        eclipse: true,
        tooltip: true,
        render: (h, params) => {
          let that = this
          return h(
            'span',
            that.$timeFormat(params.row.reqTime, 'yyyy-MM-dd HH:mm:ss')
          )
        }

      },
      {
        title: '授权时间',
        key: 'grantTime',
        minWidth: 100,
        eclipse: true,
        tooltip: true,
        render: (h, params) => {
          let that = this
          return h(
            'span',
            that.$timeFormat(params.row.grantTime, 'yyyy-MM-dd')
          )
        }

      },
      {
        title: '授权结果',
        key: 'grantMsg',
        minWidth: 100,
        eclipse: true,
        tooltip: true

      }]
    },
    // 谁查询弹窗的表格数和分页总数
    setLookTableDataAndPageTotal (row) {
      // code yourself .................................
      // ...
      let postData = {
        pageSize: 10,
        pageNum: 1,
        applyId: row.id
      }
      this.handleGetTableData(postData)
    },
    // 设置预览弹窗的查询条件和查询方法
    setParamPostData (row) {
      //
      // code yourself .................................
      //
      this.paramPostData.handleSearch = 'handleGetTableData'
      this.paramPostData.conditionSearch = {
        pageSize: 10,
        pageNum: 1,
        applyId: row.id
      }
    },
    handleGetTableData (postData) {
      ajaxGetRecord(postData).then(res => {
        if (res.data.code == '1') {
          this.lookTableData = res.data.data
          this.pageTotal = res.data.total
        } else {
          this.$Message.error(res.message || '查询列表数据失败')
        }
      })
    },
    handleAuthor () {
      this.actionMsg = '授权中...'
      this.showAuthor = true
      let that = this
      let arr = this.selectedArr.map(item => {
        let obj = {
          id: item.id,
          applyFileName: item.applyFileName,
          tenantUser: item.tenantUser,
          stat: item.stat
        }
        return obj
      })
      this.drawerTitle = '批量授权'
      ajaxCheckAuthor(arr).then(res => {
        this.showAuthor = false
        this.isDisabled = true

        this.visibleLog = true
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        // 这里采用硬编码
        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false

        this.isDisabled = false
      })
    },
    handleAuthorBeforeCheck () {
      let that = this
      this.showAuthor = true
      this.actionMsg = '授权前校验中...'
      this.isDisabledCheckBefore = true
      let arr = this.selectedArr.map(item => {
        let obj = {
          id: item.id,
          applyFileName: item.applyFileName,
          tenantUser: item.tenantUser,
          stat: item.stat
        }
        return obj
      })
      ajaxCheckAuthorBefore(arr).then(res => {
        // 这里采用硬编码
        this.showAuthor = false
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        this.visibleLog = true
        this.isDisabledCheckBefore = false
        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false
        this.isDisabledCheckBefore = false
      })
    },
    handleAuthorAfterCheck () {
      let that = this
      this.showAuthor = true
      this.isDisabledCheckAfter = true
      this.actionMsg = '授权后校验中...'
      let arr = this.selectedArr.map(item => {
        let obj = {
          id: item.id,
          applyFileName: item.applyFileName,
          tenantUser: item.tenantUser,
          stat: item.stat
        }
        return obj
      })

      ajaxCheckAuthorAfter(arr).then(res => {
        // 这里采用硬编码
        this.showAuthor = false
        this.visibleLog = true
        this.isDisabledCheckAfter = false
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false
        this.isDisabledCheckAfter = false
      })
    },
    handleDateChange (val) {
      if (val) {
        this.formSearch.prodBeginDate = val[0]
        this.formSearch.prodEndDate = val[1]
      } else {
        this.formSearch.prodBeginDate = ''
        this.formSearch.prodEndDate = ''
      }
    },
    handleFireDropdownExport (row) {
      let postData = []
      this.selectedArr.map(item => {
        let obj = {}
        obj.id = item.id
        obj.tenantUser = item.tenantUser
        obj.prodDate = item.prodDate
        obj.contacts = item.contacts
        obj.contactsWay = item.contactsWay
        postData.push(obj)
      })

      ajaxExportApplyAuthor(postData).then(res => {
        console.log('========res=====导出=====', res)
        var eleLink = document.createElement('a')
        // eleLink.download = filename

        // 字符内容转变成blob地址
        var blob = new Blob([res.data])
        eleLink.href = URL.createObjectURL(blob)
        let resName = (res.headers && res.headers['Content-disition'])

        eleLink.download = resName
        eleLink.style.display = 'none'
        // 触发点击
        document.body.appendChild(eleLink)
        eleLink.click()
        // 然后移除
        document.body.removeChild(eleLink)
      }).error(err => {
        this.$Message.error('与服务器通信失败')
      })
    },
    ok () {
      let postData = {
        files: this.files
      }
      ajaxUploadJar(postData).then(res => {
        if (res.data.status == 'ok') {
          this.$Message.success('上传成功')
          this.cancel()
          this.getColonyArr()
        }
      })
    },
    cancel () {
      this.handleClear()
      this.modalColony = false
    },
    handleUpload (files) {
      console.log('======files', files)
      this.files.push(files)
    },
    handleClear () {
      this.$refs.upload.clearFiles()
    },
    updateChecked () {
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i]._checked = false
        for (var j = 0; j < this.selected.length; j++) {
          if (this.selected[j] === this.tableData[i].id) {
            this.tableData[i]._checked = true
          }
        }
      }
    },
    handleCancelSelect (selection, row) {
      let index = this.selected.indexOf(row.id)
      if (index != '-1') {
        this.selected.splice(index, 1)
        this.selectedArr.splice(index, 1)
      }
    },
    handleSelect (selection, row) {
      // 判断是否重复选中
      if (this.selected.indexOf(row.id) != '-1') {

      } else {
        this.selected.push(row.id)
        let obj = {}
        obj = JSON.parse(JSON.stringify(row))
        this.selectedArr.push(obj)
      }
    },
    handleSelectAll (selection) {
      let that = this
      this.tableData.map(item => {
        if (that.selected.indexOf(item.id) == '-1') {
          that.selected.push(item.id)
          let obj = JSON.parse(JSON.stringify(item))
          that.selectedArr.push(obj)
        }
      })
    },
    handleCancelSelectAll (selection) {
      // 从已选项中移除当页数据
      let arr = []
      let arr1 = []
      let that = this
      that.tableData.map(item => {
        let idx = that.selected.indexOf(item.id)
        if (idx == '-1') {
          arr.push(item.id)
          arr1.push(JSON.parse(JSON.stringify(that.selectedArr[idx])))
        }
      })
      this.selected = [].concat(arr)
      this.selectedArr = [].concat(arr1)
    },
    handleDropdownMenu (row, name) {
      if (this.hasOwnProperty('handleFireDropdown' + name)) {
        this['handleFireDropdown' + name](row)
      }
    },
    handleFireDropdownEditor (row) {
      let postData = {
        pageSize: 1000,
        pageNum: 1
      }
      let that = this
      ajaxGetFamily(postData).then(res => {
        // 这里采用硬编码
        if (res.data.status == 'ok') {
          that.editorForm.items[2].options = res.data.data.list
          that.editorForm.items[2].options.map(item => {
            item.value = item.id.toString()
            item.label = item.name
            return item
          })

          this.modalEditorColony = true
          for (let k in this.editorForm.model) {
            this.editorForm.model[k] = row[k]
          }
          this.editorForm.model.ishouseholder = this.editorForm.model.ishouseholder.toString()
        }
      })
    },
    handleFireDropdownDelete (row) {
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
    handlePageChange (postData) {
      this[postData.handleSearch](postData.conditionSearch)
    },
    handleFireDropdownAuthorBefore (row) {
      let that = this
      this.actionMsg = '授权前校验中...'
      this.drawerTitle = '授权前校验(' + row.applyFileName + ')'
      let arr = [{
        id: row.id,
        applyFileName: row.applyFileName,
        tenantUser: row.tenantUser,
        stat: row.stat
      }]
      this.showAuthor = true
      ajaxCheckAuthorBefore(arr).then(res => {
        // 这里采用硬编码

        this.showAuthor = false
        this.visibleLog = true
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false
      })
    },
    handleFireDropdownAuthorAfter (row) {
      let that = this
      this.actionMsg = '授权后校验中...'
      this.drawerTitle = '授权后校验(' + row.applyFileName + ')'
      let arr = [{
        id: row.id,
        applyFileName: row.applyFileName,
        tenantUser: row.tenantUser,
        stat: row.stat
      }]
      this.showAuthor = true
      ajaxCheckAuthorAfter(arr).then(res => {
        // 这里采用硬编码
        this.showAuthor = false
        this.visibleLog = true
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false
      })
    },
    handleFireDropdownAuthor (row) {
      let that = this
      this.showAuthor = true
      this.actionMsg = '授权中...'
      this.drawerTitle = '授权(' + row.applyFileName + ')'
      let arr = [{
        id: row.id,
        applyFileName: row.applyFileName,
        tenantUser: row.tenantUser,
        stat: row.stat
      }]
      ajaxCheckAuthor(arr).then(res => {
        // 这里采用硬编码
        this.showAuthor = false
        this.visibleLog = true
        // 清空选中的效果
        this.selectedArr = []
        this.selected = []

        that.logData = res.data
        this.getColonyArr()
      }).catch(err => {
        this.showAuthor = false
      })
    },

    handleColonyEditor (postData) {
      ajaxEditorMember(postData).then(res => {
        if (res.data.status == 'ok') {
          this.$Message.success('编辑成功')
          this.$refs.editorForm.handleFormReset()
          this.modalEditorColony = false
          this.getColonyArr()
        } else {
          this.$Message.error(res.data.message || '编辑失败')
        }
      })
    },
    handleCancel (key) {
      this.modalHide(key)
    },
    handleCancelAdd () {
      this.$refs.addForm.handleFormReset()
      this.modalColony = false
    },
    handleCancelEditor () {
      this.$refs.editorForm.handleFormReset()
      this.modalEditorColony = false
    },
    handleDeleteEnvironment (row) {
      this.loading = true
      ajaxDeleteMember(row).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
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

    handleColonyAdd (postData) {
      this.loading = true
      ajaxAddMember(postData).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
          this.$Message.success('添加成功')
          this.$refs.addForm.handleFormReset()
          this.modalColony = false
          this.getColonyArr()
        } else {
          this.$Message.error(res.data.message || '添加失败')
        }
      })
    },
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 38 - 52 - 49 - 16 * 2 - 34
    },
    handleSubmitSearch () {
      this.current = 1
      this.getColonyArr()
    },
    handleAdd () {
      this.modalColony = true
      this.handleClear()
    },
    pageChange (val) {
      this.current = +val
      this.getColonyArr()
    },
    modalShow (k) {
      this[k] = true
    },
    modalHide (k) {
      this[k] = false
    },
    getColonyArr () {
      let postData = {}
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      Object.keys(this.formSearch).map(k => {
        this.formSearch[k] && (postData[k] = this.formSearch[k])
      })
      this.loading = true
      ajaxGetApp(postData).then(res => {
        this.loading = false
        if (res.data.code == '1') {
          this.tableData = res.data.data
          this.total = res.data.total
          this.updateChecked()
        } else {
          this.$Message.error('查询数据失败')
        }
      }).catch(error => {
        this.loading = false
      })
    }
  },
  created () { },
  mounted () {
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
<style>
</style>
