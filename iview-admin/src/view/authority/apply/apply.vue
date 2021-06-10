
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10"
         :gutter="8">

      <i-col span="24">
        <Card>
          <p slot="title"
             style="height:34px;">
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
          </p>
          <div class="btnWrapper"
               slot="extra"
               style="left:16px;">
            <a style="margin-right:10px;"
               class="btn ivu-btn ivu-btn-primary ivu-btn-small"
               :href=downloadHref>下载申请单模版</a>
            <Button @click="handleAdd"
                    type="primary"
                    size="small">
              <Icon type="ios-ios-plus" />上传申请单
            </Button>

          </div>
          <div class="wrapperMore panel"
               v-show="visibleMore"
               style="position: absolute;top: 50px;left: 0px;z-index: 9;width: 100%;background: #fff;padding: 20px;border: solid 1px #ddd;">
            <Form ref="formMore"
                  :model="formSearch"
                  inline>
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
            </Form>

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
                   @on-select-cancel="handleCancel">

              <template slot-scope="{ row,index }"
                        slot="action">
                <Dropdown @on-click="handleDropdownMenu(row,$event)"
                          transfer>
                  <a href="javascript:void(0)">
                    操作
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="Editor">
                      <div>
                        <Icon type="ios-create-outline" /> 更新
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Look">
                      <div style="color:#2db7f5">
                        <Icon type="ios-american-football-outline" /> 预览
                      </div>
                    </DropdownItem>
                    <DropdownItem name="Delete">
                      <div style="color:#ed4014">
                        <Icon type="ios-trash-outline" /> 删除
                      </div>
                    </DropdownItem>
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
  </div>
</template>
<script>
import { addForm, editorForm } from './components/memberStatic'
import commonTable from '@/common/commonTable'
import SecondForm from '@/common/SecondForm'
import { ajaxGetApp, ajaxDeleteApp, ajaxAddApp, ajaxEditorApp, ajaxDownApp } from '@/api/app.js'
import { ajaxExportApplyAuthor } from '@/api/author.js'
import { ajaxGetRecord } from '@/api/record.js'
import expandRow from './components/table-expand.vue'
// require('@/mock/config.js')
export default {
  name: 'apply',
  data () {
    return {
      statArr: [
        {
          label: '全部',
          value: ''
        },
        {
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
        }, {
          label: '授权失败',
          value: '2'
        }],
      visibleMore: false,
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
      total: 0,
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
        {
          title: '序号',
          width: 80,
          align: 'center',
          fixed: 'left',
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
          minWidth: 100,
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
          title: '申请人',
          key: 'reqUser',
          minWidth: 100,
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
            let text = that.$timeFormat(params.row.grantTime, 'yyyy-MM-dd HH:mm:ss')
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
        //   applyFileName: 'applyFileNameapplyFileNameapplyFileNameapplyFileNameapplyFileName',
        //   prodDate: 1606381179005,
        //   reqTime: 1606381179005
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
    downloadHref () {
      let token = sessionStorage.getItem('token')
      return ('/bdap-metadata-privilege/apply/downloadApply?Authorization=' + token)
    },
    downloadRowHref (row) {
      let that = this
      return function (row) {
        console.log('==========row1111', row)
        let strAutho = 'Authorization=' + sessionStorage.getItem('token')
        return ('/bdap-metadata-privilege/apply/exportApply?' + strAutho + '&applyIds=' + row.id)
      }
    }
  },
  methods: {
    handleShowMessage (res) {
      this.$Message.error({
        duration: 6 * 10,
        closable: true,
        render: h => {
          let errInfoArr = (res && res.data && res.data.message && res.data.message.split('！')) || []
          let domArr = []

          errInfoArr.map(item => {
            domArr.push(h('div', item))
          })
          return h('div', domArr)
        }
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
    handleMore () {
      this.visibleMore = !this.visibleMore
      if (!this.visibleMore) {
        this.$refs.formMore.resetFields()
      }
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
      // this.$refs.upload.clearFiles()
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
      this.modalEditorColony = true
      // 讲row值赋给编辑的参数
      this.setRowToEditorForm(row)
    },
    handleFireDropdownLook (row) {
      this.modalLook = true

      // 讲row值赋给编辑的参数
      this.setLookTitle(row)
      this.setLookTableColumn(row)
      this.setLookTableDataAndPageTotal(row)
      this.setParamPostData(row)
    },
    // =============模版方法===========end========
    // ========= 自定义方法=============start========
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
        minWidth: 100,
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
    // 设置查看弹窗的查询条件和查询方法
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
    setRowToEditorForm (row) {
      // TODO 这里设置自己的逻辑代码
      // coding ........
      Object.keys(this.editorForm.model).map(key => {
        if (key == 'file') {
          this.editorForm.model.file = []
        } else {
          this.editorForm.model[key] = row[key]
        }
      })
      // coding .............end
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
    handleColonyEditor (postData) {
      this.loading = true
      let formData = new FormData()
      postData.files.map(file => {
        formData.append('applyFileName', encodeURIComponent(file.name))
        formData.append('applyFile', file, file.name)
        formData.append('remark', postData.remark)
        formData.append('applyId', postData.id)
      })
      console.log('postData')

      ajaxEditorApp(formData).then(res => {
        this.loading = false
        if (res.data.code == '1') {
          this.$Message.success({
            content: '编辑成功'
          })
          this.$refs.editorForm.handleFormReset()
          this.modalEditorColony = false
          this.getColonyArr()
        } else {
          // this.$Message.error({
          //   content: res.data.message || '编辑失败',
          //   duration: 6 * 10,
          //   closable: true
          // })
          this.handleShowMessage(res)
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
      ajaxDeleteApp(row).then(res => {
        this.loading = false
        if (res.data.code == '1') {
          this.$Message.success('删除成功')
          this.getColonyArr()
        } else {
          this.$Message.error({
            content: res.data.message || '删除失败',
            duration: 6 * 10,
            closable: true
          })
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },

    handleColonyAdd (postData) {
      this.loading = true
      let formData = new FormData()
      postData.files.map(file => {
        formData.append('applyFileName', encodeURIComponent(file.name))
        formData.append('applyFile', file, file.name)
        formData.append('remark', postData.remark)
      })
      console.log('postData')

      ajaxAddApp(formData).then(res => {
        this.loading = false
        if (res.data.code == '1') {
          this.$Message.success({
            content: '添加成功'

          })
          this.$refs.addForm.handleFormReset()
          this.modalColony = false
          this.getColonyArr()
        } else {
          this.handleShowMessage(res)
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
      this.$refs.addForm.handleFormReset()
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
      let that = this
      let postData = {}
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      Object.keys(that.formSearch).map(k => {
        that.formSearch[k] && (postData[k] = that.formSearch[k])
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
.ivu-message-custom-content.ivu-message-error {
  padding-left: 15px;
}
.ivu-message-custom-content.ivu-message-error
  .ivu-icon.ivu-icon-ios-close-circle {
  position: absolute;
  top: 50%;
  margin-top: -8px;
  left: 10px;
}
</style>
