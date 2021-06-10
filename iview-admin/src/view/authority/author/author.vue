
<style lang="less">
//@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">

      <i-col span="24">
        <Card>
          <div slot="title" style="height:34px;">
            <div class="search-form-container">
            <Form ref="formSearch" :model="formSearch"  inline >
            <FormItem  prop="clusterCode" style="width:150px;">
              <Select v-model="formSearch.clusterCode" placeholder="集群标识" size="small" transfer>
                <Option  label="所有" value="" >所有</Option>
                  <Option v-for="(item,index) in clusterCodeArr " :label="item.clusterName" :value="item.clusterCode" :key="index">{{item.clusterName}}</Option>
              </Select>
            </FormItem>
            <FormItem  prop="component">
              <Input v-model="formSearch.component" placeholder="组件" size="small"></Input>
            </FormItem>
            <FormItem  prop="tenantUser">
              <Input v-model="formSearch.tenantUser" placeholder="租户" size="small"></Input>
            </FormItem>

            <FormItem  prop="roleType" style="width:150px;">
              <Select v-model="formSearch.roleType" placeholder="角色类型" size="small" transfer>
                  <Option v-for="(item,index) in roleTypeArr " :label="item.label" :value="item.value" :key="index">{{item.label}}</Option>
              </Select>
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

            <FormItem style="white-space: nowrap;">
            <!-- <Button type="text" size="small" @click="handleMore">>></Button> -->
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')" style="margin-right:15px;">查询</Button>
            <a :href=downloadRowHref(row) class="ivu-btn ivu-btn-small ivu-btn-primary"> 导出</a>
        </FormItem>
          </Form>
          </div>
          </div>
          <div class="wrapperMore panel" v-show="visibleMore" style="position: absolute;top: 50px;left: 0px;z-index: 9;width: 100%;background: #fff;padding: 20px;border: solid 1px #ddd;">
            <Form ref="formMore" :model="formSearch"  inline >

            <FormItem  prop="dbName">
              <Input v-model="formSearch.dbName" placeholder="数据库名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="tableName">
              <Input v-model="formSearch.tableName" placeholder="表名称" size="small"></Input>
            </FormItem>
            <FormItem  prop="colName">
              <Input v-model="formSearch.colName" placeholder="字段名称" size="small"></Input>
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

  </div>
</template>
<script>
import { addForm, editorForm } from './components/memberStatic'
import commonTable from '@/common/commonTable'
import SecondForm from '@/common/SecondForm'

import { ajaxGetFamily } from '@/api/family.js'
//
import { ajaxGetConfig } from '@/api/authorConfig.js'
import { ajaxGetAuthor } from '@/api/author.js'
// require('@/mock/config.js')
export default {
  name: 'author',
  data () {
    return {
      roleTypeArr: [{
        label: '只读',
        value: '只读'
      }],
      clusterCodeArr: [],
      grantTypeArr: [{
        label: '未授权',
        value: '0'
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
        colName: '',
        tenantUser: 'bdap',
        prodBeginDate: '',
        prodEndDate: '',
        clusterCode: '',
        component: 'hive',
        dbName: '',
        tableName: '',
        date: '',
        grantType: ''
      },
      loading: false,
      current: 1,
      pageSize: 10,
      tableTitle: [
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
          title: '租户',
          fixed: 'left',
          key: 'tenantUser',

          eclipse: true,
          tooltip: true

        },

        // {
        //   title: '集群名称',
        //   key: 'clusterName',
        //   minWidth: 100,
        //   eclipse: true,
        //   tooltip: true

        // },
        // {
        //   title: 'component',
        //   key: 'component',
        //   minWidth: 100,
        //   eclipse: true,
        //   tooltip: true
        // },
        {
          title: '数据库名称',
          key: 'dbName',

          eclipse: true,
          tooltip: true
        },
        {
          title: '表名称',
          key: 'tableName',

          eclipse: true,
          tooltip: true

        },
        {
          title: '字段名称',
          key: 'colName',

          eclipse: true,
          tooltip: true

        },

        {
          title: '权限类型',
          key: 'grantType',

          eclipse: true,
          tooltip: true

        }

      ],
      tableData: [
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
        return ('/bdap-metadata-privilege/grant/exportGrant?' + strAutho + '&tenantUser=' + that.formSearch.tenantUser + '&clusterCode=' + that.formSearch.clusterCode + '&component=' + that.formSearch.component + '&dbName=' + that.formSearch.dbName + '&tableName=' + that.formSearch.tableName + '&colName=' + that.formSearch.colName)
      }
    }

  },
  methods: {
    handleMore () {
      this.visibleMore = !this.visibleMore
      if (!this.visibleMore) {
        this.$refs.formMore.resetFields()
      }
    },
    handleDateChange (val) {
      this.formSearch.date = val
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
      this.formSearch.clusterCode && (postData.clusterCode = this.formSearch.clusterCode)
      this.formSearch.tenantUser && (postData.tenantUser = this.formSearch.tenantUser)
      this.formSearch.component && (postData.component = this.formSearch.component)
      if (1) {
        ['dbName', 'tableName', 'grantType', 'colName'].map(key => {
          this.formSearch[key] && (postData[key] = this.formSearch[key])
        })
      }
      this.loading = true
      ajaxGetAuthor(postData).then(res => {
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
      ajaxGetConfig({}).then(res => {
        if (res.data.code == '1') {
          this.clusterCodeArr = res.data.data
          if (res.data.data.length) {
            this.formSearch.clusterCode = res.data.data[0].clusterCode
            this.getColonyArr()
          }
        }
      })
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
      this.handleGetColonyCodeArr()
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    })
  }
}
</script>
