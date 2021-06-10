
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">

      <i-col span="24">
        <Card>
          <p slot="title" style="height:34px;">
            <Form ref="formSearch" :model="formSearch"  inline >
              <FormItem  prop="applyId">
              <Input v-model="formSearch.applyId" placeholder="申请单ID" size="small"></Input>
            </FormItem>
            <FormItem  prop="clusterCode" style="width:150px;">
              <Select v-model="formSearch.clusterCode" placeholder="集群标识" size="small" transfer>
                  <Option  label="所有" value="" >所有</Option>
                  <Option v-for="(item,index) in clusterCodeArr " :label="item.clusterName" :value="item.clusterCode" :key="index">{{item.clusterName}}</Option>
              </Select>
            </FormItem>
            <FormItem  prop="tenantUser">
              <Input v-model="formSearch.tenantUser" placeholder="租户" size="small"></Input>
            </FormItem>
            <FormItem  prop="date">
              <DatePicker   type="daterange" format="yyyy-MM-dd" confirm placement="bottom-end" placeholder="日期" style="width: 200px" transfer @on-change="handleDateChange"></DatePicker>
            </FormItem>
            <FormItem>
            <Button type="text" size="small" @click="handleMore" style="margin-right:10px;">>></Button>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="wrapperMore panel" v-show="visibleMore" style="position: absolute;top: 50px;left: 0px;z-index: 9;width: 100%;background: #fff;padding: 20px;border: solid 1px #ddd;">
            <Form ref="formMore" :model="formSearch"  inline >
            <FormItem  prop="component">
              <Input v-model="formSearch.component" placeholder="组件" size="small"></Input>
            </FormItem>
            <FormItem  prop="dbName">
              <Input v-model="formSearch.dbName" placeholder="数据库名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="tableName">
              <Input v-model="formSearch.tableName" placeholder="表名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="colName">
              <Input v-model="formSearch.colName" placeholder="字段名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="stat" style="width:150px;">
              <Select v-model="formSearch.stat" placeholder="状态" size="small" transfer>
                  <Option v-for="(item,index) in statArr " :label="item.label" :value="item.value" :key="index">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Form>

          </div>
          <div class="wrapper">
            <Table :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="tableData" border
            @on-select-all-cancel="handleCancelSelectAll"
          @on-select-all="handleSelectAll"
          @on-select="handleSelect"
          @on-select-cancel="handleCancel"
            >

                <template slot-scope="{ row,index }" slot="action">
                   <Dropdown @on-click="handleDropdownMenu(row,$event)" transfer>
                      <a href="javascript:void(0)">
                          操作
                          <Icon type="ios-arrow-down"></Icon>
                      </a>
                      <DropdownMenu slot="list" >
                          <!-- <DropdownItem name="Editor"><div style="color:#2db7f5"><Icon type="ios-create-outline" />  编辑</div></DropdownItem> -->
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
    <Modal v-model="modalColony" title="jar包上传" @on-ok="ok"
        @on-cancel="cancel">
      <div class="formWrapper">
          <Upload
          :before-upload="handleUpload"
          ref="upload"
        multiple
        action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">jar包上传</Button>
    </Upload>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony" title="编辑集群" footer-hide>
      <div class="formWrapper">
        <SecondForm ref="editorForm" :form="editorForm" @handleOk="handleColonyEditor" @handleCancel="handleCancelEditor" />
      </div>
    </Modal>

    <Modal v-model="modalLook" :title="lookTitle" footer-hide width="80%">
      <div class="formWrapper">
          <commonTable  @firePageChange="handlePageChange" :tableTitle="lookTableColumn" :tableData="lookTableData" :postData="paramPostData" :total="pageTotal"/>
      </div>
    </Modal>
  </div>
</template>
<script>
import { addForm, editorForm } from './components/memberStatic'
import commonTable from '@/common/commonTable'
import SecondForm from '@/common/SecondForm'

import { ajaxGetFamily } from '@/api/family.js'
//
import { ajaxGetConfig } from '@/api/authorConfig.js'
import { ajaxGetRecord } from '@/api/record.js'
// require('@/mock/config.js')
export default {
  name: 'member',
  data () {
    return {
      clusterCodeArr: [],
      statArr: [
        {
          label: '所有',
          value: ''
        }, {
          label: '未授权',
          value: '0'
        },
        {
          label: '授权成功',
          value: '1'
        }, {
          label: '授权失败',
          value: '2'
        }, {
          label: '授权前校验成功',
          value: '3'
        },
        {
          label: '授权前校验失败',
          value: '4'
        } ],
      visibleMore: false,
      files: [],
      selected: [],
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
        'stat': '',
        applyId: '',
        'clusterCode': '',
        'component': '',
        'dbName': '',
        'tableName': '',
        'colName': ''

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
          title: '租户',
          fixed: 'left',
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
              ['未授权', '授权成功', '授权失败', '授权前校验成功', '授权前校验失败' ][params.row.stat]
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
          title: '申请日期',
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

        }

      ],
      tableData: [
      //   {
      //   'id': 'uuid',
      //   'applyFileName': '资源申请单20200101.xsl',
      //   'tenantUser': '租户1',
      //   'clusterName': '主集群',
      //   'component': 'hive',
      //   'dbName': 'bdap_db',
      //   'tableName': 'tab1',
      //   'colName': 'col1',
      //   'operType': '授权',
      //   'grantType': '查询',
      //   'stat': '未授权',
      //   'prodDate': '2020-01-20',
      //   'reqDate': '2020-11-10 10:00:00',
      //   'grantTime': '2020-11-10 10:00:00'
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

  },
  methods: {
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
    handleCancel (selection, row) {
      let index = this.selected.indexOf(row.id)
      if (index != '-1') {
        this.selected.splice(index, 1)
      }
    },
    handleSelect (selection, row) {
      // 添加到已选项
      this.selected.push(row.id)
    },
    handleSelectAll (selection) {
      this.tableData.map(item => {
        if (this.selected.indexOf(item.id) != '-1') {
          this.selected.push(item.id)
        }
      })
    },
    handleCancelSelectAll (selection) {
      // 从已选项中移除当页数据
      let arr = []
      let that = this
      this.selected.map(item => {
        if (that.tableData.indexOf(item.id) == '-1') {
          arr.push(item.id)
        }
      })
      this.selected = [].concat(arr)
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
        if (res.data.code == '1') {
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
      let that = this
      let postData = {}
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      // this.formSearch.applyId && (postData.applyId = this.formSearch.applyId)
      // this.formSearch.clusterCode && (postData.clusterCode = this.formSearch.clusterCode)
      // this.formSearch.tenantUser && (postData.tenantUser = this.formSearch.tenantUser)
      // if (this.formSearch.date) {
      //   postData.prodBeginDate = this.formSearch.date[0]
      //   postData.prodEndDate = this.formSearch.date[1]
      // }
      // if (this.visibleMore) {
      //   ['dbName', 'tableName', 'colName', 'stat', 'component'].map(key => {
      //     this.formSearch[key] && (postData[key] = this.formSearch[key])
      //   })
      // }
      Object.keys(that.formSearch).map(k => {
        that.formSearch[k] && (postData[k] = that.formSearch[k])
      })
      this.loading = true
      ajaxGetRecord(postData).then(res => {
        this.loading = false
        if (res.data.code == '1') {
          this.tableData = res.data.data
          this.total = res.data.total
          this.updateChecked()
        } else {
          this.$Message.error(res.message || '查询列表数据失败')
        }
      }).catch(error => {
        this.loading = false
      })
    },
    handleGetColonyCodeArr () {
      ajaxGetConfig({ pageSize: 1000, pageNum: 1 }).then(res => {
        if (res.data.code == '1') {
          this.clusterCodeArr = res.data.data
        }
      })
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
      this.getColonyArr()
      this.handleGetColonyCodeArr()
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    })
  }
}
</script>
