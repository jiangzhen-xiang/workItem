
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
              <Input v-model="formSearch.name" placeholder="集群名称" size="small"></Input>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />增加成员
              </Button>
            </ButtonGroup>
          </div>
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
                          <DropdownItem name="Stop"><div style="color:#ed4014"><Icon type="ios-create-outline" />  停止</div></DropdownItem>
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
import { ajaxGetMember, ajaxDeleteMember, ajaxAddMember, ajaxEditorMember } from '@/api/member.js'
import { ajaxGetFlinkMeta, ajaxStopFlinkApp } from '@/api/flinkMeta.js'

export default {
  name: 'flinkMeta',
  data () {
    return {
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
        type: '',
        colony: ''

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
          title: '应用提交数',
          key: 'appsSubmitted',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },
        {
          title: '完成应用数',
          key: 'appsCompleted',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '挂起应用数',
          key: 'appsPending',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '应用状态',
          key: 'appsRunning',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '失败应用数',
          key: 'appsFailed',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '应用杀死数',
          key: 'appsKilled',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },
        {
          title: '预留内存(MB)',
          key: 'reservedMB',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '可用内存(MB)',
          key: 'availableMB',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '已分配内存(MB)',
          key: 'allocatedMB',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '已占用虚拟节点数',
          key: 'reservedVirtualCores',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        // ========
        {
          title: '总内存(MB)',
          key: 'totalMB',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '总虚拟核数',
          key: 'totalVirtualCores',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '总节点数目',
          key: 'totalNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '丢失节点',
          key: 'lostNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '坏节点',
          key: 'unhealthyNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '总虚拟核数',
          key: 'totalVirtualCores',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '停用节点',
          key: 'decommissioningNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '退出节点数',
          key: 'decommissionedNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '根节点数',
          key: 'rebootedNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '使用节点数',
          key: 'activeNodes',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },
        {
          title: '更新时间',
          key: 'updateTime',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        },

        // {
        //   title: '操作',
        //   key: 'action',
        //   minWidth: 100,
        //   slot: 'action'
        // }
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
    handleFireDropdownStop (row) {
      let that = this
      ajaxStopFlinkApp(row).then(res => {
        // 这里采用硬编码
        if (res.data.status == '1') {
          this.$Message.success('停止应用成功')
        } else {
          this.$Message.error('停止应用失败')
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
      this.formSearch.name && (postData.name = this.formSearch.name)
      this.loading = true
      ajaxGetFlinkMeta(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.tableData = [res.data.data]
          this.total = 1
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
