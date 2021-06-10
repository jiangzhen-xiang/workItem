
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
            <FormItem  prop="name">
              <Input v-model="formSearch.name" placeholder="应用名称" size="small"></Input>
            </FormItem>
             <FormItem  prop="user">
              <Input v-model="formSearch.user" placeholder="用户" size="small"></Input>
            </FormItem>
            <FormItem  prop="state" style="width:120px;">
              <Select v-model="formSearch.state" placeholder="状态" size="small" transfer >
                <Option label="强制关闭" value="KILLED">强制关闭</Option>
                <Option label="运行中" value="RUNNING">运行中</Option>
                <Option label="失败" value="FAILED">失败</Option>
                <Option label="结束" value="FINISHED">结束</Option>
              </Select>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <!-- <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />增加成员
              </Button>
            </ButtonGroup>
          </div> -->
          <div class="wrapper">
            <Table :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="tableData" border :height="tableHeight"
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
                          <DropdownItem name="Look" ><div style="color:#2db7f5"><Icon type="ios-create-outline" />查看详情</div></DropdownItem>
                          <DropdownItem name="Stop" v-if="row.state == 'RUNNING'"><div style="color:#ed4014"><Icon type="ios-create-outline" />  停止</div></DropdownItem>
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
    <Modal v-model="modalColony" title="增加成员" footer-hide>
      <div class="formWrapper">
          <SecondForm ref="addForm" :form="addForm" @handleOk="handleColonyAdd" @handleCancel="handleCancelAdd" />
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

import { ajaxGetFlinkApp, ajaxStopFlinkApp, ajaxGetFlinkAppDetail } from '@/api/flinkMeta.js'

export default {
  name: 'flinkMeta',
  data() {
    return {
      selected: [],
      addForm: addForm,
      editorForm: editorForm,
      modalLook: false,
      paramPostData: {
        handleSearch: '', // 方法名
        conditionSearch: {
          pageSize: 10,
          pageNum: 1
        }
      },
      pageTotal: 0,
      lookTitle: '',
      lookTableColumn: [{
        title: '序号',
        width: 80,
        align: 'center',
        render: (h, params) => {
          let that = this
          return h(
            'span',
            +params.index + 1 + (that.paramPostData.conditionSearch.pageNum - 1) * that.paramPostData.conditionSearch.pageSize
          )
        }
      },
      {
        title: 'name',
        key: 'name',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'allocatedMB',
        key: 'allocatedMB',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      },
      {
        title: 'allocatedVCores',
        key: 'allocatedVCores',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      },
      {
        title: 'amContainerLogs',
        key: 'amContainerLogs',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'amHostHttpAddress',
        key: 'amHostHttpAddress',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'applicationTags',
        key: 'applicationTags',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'applicationType',
        key: 'applicationType',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'diagnostics',
        key: 'diagnostics',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'finalStatus',
        key: 'finalStatus',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'elapsedTime',
        key: 'elapsedTime',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'logAggregationStatus',
        key: 'logAggregationStatus',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'memorySeconds',
        key: 'memorySeconds',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'numAMContainerPreempted',
        key: 'numAMContainerPreempted',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'numNonAMContainerPreempted',
        key: 'numNonAMContainerPreempted',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'preemptedResourceMB',
        key: 'preemptedResourceMB',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'preemptedResourceVCores',
        key: 'preemptedResourceVCores',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'progress',
        key: 'progress',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: '队列',
        key: 'queue',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'reservedMB',
        key: 'reservedMB',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'reservedVCores',
        key: 'reservedVCores',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'runningContainers',
        key: 'runningContainers',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: '状态',
        key: 'state',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'trackingUI',
        key: 'trackingUI',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'trackingUrl',
        key: 'trackingUrl',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: '用户',
        key: 'user',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: 'vcoreSeconds',
        key: 'vcoreSeconds',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: '创建时间',
        key: 'createTime',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }, {
        title: '更新时间',
        key: 'updateTime',
        minWidth: 160,
        eclipse: true,
        tooltip: true
      }],

      lookTableData: [],

      //= ============弹窗组件=================
      total: 0,
      index: 0,
      modalColony: false,
      modalEditorColony: false,
      tableHeight: 0,
      formSearch: {
        name: '',
        state: '',
        user: ''

      },
      loading: false,
      current: 1,
      pageSize: 10,
      tableTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
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
          title: '进程名称',
          key: 'name',
          minWidth: 160,
          eclipse: true,
          tooltip: true
        },
        {
          title: '用户',
          key: 'user',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '应用类型',
          key: 'applicationType',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '当前状态',
          key: 'state',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '最终状态',
          key: 'finalStatus',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '队列',
          key: 'queue',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },
        {
          title: '运行IP',
          key: 'amHostHttpAddress',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '运行容器',
          key: 'runningContainers',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '最小可申请内存(MB)',
          key: 'allocatedMB',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '运行时长',
          key: 'elapsedTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        // ========

        {
          title: '开始时间',
          key: 'startedTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '结束时间',
          key: 'finishedTime',
          minWidth: 100,
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
      tableData: [],
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
    updateChecked() {
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i]._checked = false
        for (var j = 0; j < this.selected.length; j++) {
          if (this.selected[j] === this.tableData[i].id) {
            this.tableData[i]._checked = true
          }
        }
      }
    },
    handleCancel(selection, row) {
      let index = this.selected.indexOf(row.id)
      if (index != '-1') {
        this.selected.splice(index, 1)
      }
    },
    handleSelect(selection, row) {
      // 添加到已选项
      this.selected.push(row.id)
    },
    handleSelectAll(selection) {
      this.tableData.map(item => {
        if (this.selected.indexOf(item.id) != '-1') {
          this.selected.push(item.id)
        }
      })
    },
    handleCancelSelectAll(selection) {
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
    handleDropdownMenu(row, name) {
      if (this.hasOwnProperty('handleFireDropdown' + name)) {
        this['handleFireDropdown' + name](row)
      }
    },
    handleFireDropdownStop(row) {
      let that = this
      row.applicationId = row.id
      ajaxStopFlinkApp(row).then(res => {
        // 这里采用硬编码
        if (res.data.status == '1') {
          this.$Message.success('停止应用成功')
        } else {
          this.$Message.error('停止应用失败')
        }
      })
    },
    handleFireDropdownLook(row) {
      let that = this

      ajaxGetFlinkAppDetail(row).then(res => {
        // 这里采用硬编码
        if (res.data.status == '1') {
          // 设置下查询参数
          this.lookTitle = '查看应用详情(' + row.name + ')'
          this.modalLook = true
          this.lookTableData = [res.data.data]
          this.pageTotal = 1

          let obj = JSON.parse(JSON.stringify(row))
          obj.pageNum = 1
          obj.pageSize = 10
          this.paramPostData = {
            handleSearch: 'handleGetDetail',
            conditionSearch: obj
          }
        } else {
          this.$Message.error('停止应用失败')
        }
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
    handlePageChange(postData) {
      this[postData.handleSearch](postData.conditionSearch)
    },

    handleColonyEditor(postData) {
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
    handleGetDetail(postData) {
      let that = this
      ajaxGetFlinkAppDetail(row).then(res => {
        // 这里采用硬编码
        if (res.data.status == '1') {
          // 设置下查询参数
          this.lookTitle = '查看应用详情(' + row.name + ')'
          this.modalLook = true
          this.lookTableData = [res.data.data]
          this.pageTotal = 1

          let obj = JSON.parse(JSON.stringify(postData))
          this.paramPostData = {
            handleSearch: 'handleGetDetail',
            conditionSearch: obj
          }
        } else {
          this.$Message.error('停止应用失败')
        }
      })
    },
    handleCancel(key) {
      this.modalHide(key)
    },
    handleCancelAdd() {
      this.$refs.addForm.handleFormReset()
      this.modalColony = false
    },
    handleCancelEditor() {
      this.$refs.editorForm.handleFormReset()
      this.modalEditorColony = false
    },
    handleDeleteEnvironment(row) {
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

    handleColonyAdd(postData) {
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
    setTableHeight() {
      this.tableHeight = document.body.offsetHeight - 64 - 38 - 52 - 49 - 16 * 2 - 34
    },
    handleSubmitSearch() {
      this.current = 1
      this.getColonyArr()
    },
    handleAdd() {
      let postData = {
        pageSize: 1000,
        pageNum: 1
      }
      ajaxGetFamily(postData).then(res => {
        // 这里采用硬编码
        if (res.data.status == 'ok') {
          this.addForm.items[2].options = res.data.data.list
          this.addForm.items[2].options.map(item => {
            item.value = item.id.toString()
            item.label = item.name
            return item
          })
          console.log('this.addDorm', this.addForm.items[2].options)
          this.modalColony = true
        }
      })
    },
    pageChange(val) {
      this.current = +val
      this.getColonyArr()
    },
    modalShow(k) {
      this[k] = true
    },
    modalHide(k) {
      this[k] = false
    },
    getColonyArr() {
      let postData = {}
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      this.formSearch.name && (postData.name = this.formSearch.name)
      this.formSearch.state && (postData.state = this.formSearch.state)
      this.formSearch.user && (postData.user = this.formSearch.user)
      this.loading = true
      ajaxGetFlinkApp(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.updateChecked()
        } else {
          this.$Message.error('查询数据失败')
        }
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
