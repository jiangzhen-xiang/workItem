
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
              <Input v-model="formSearch.name" placeholder="jar包名称" size="small"></Input>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small">
                <Icon  type="ios-ios-plus" />上传jar包
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
import { ajaxGetMember, ajaxDeleteMember, ajaxAddMember, ajaxEditorMember } from '@/api/member.js'
import { ajaxGetFamily } from '@/api/family.js'
import { ajaxUploadJar } from '@/api/link.js'
import expandRow from './components/table-expand.vue'
export default {
  name: 'member',
  data() {
    return {
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
        type: '',
        colony: ''

      },
      loading: false,
      current: 1,
      pageSize: 10,
      tableTitle: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
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
          title: 'jar包名称',
          key: 'jarName',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },

        {
          title: '用户名',
          key: 'userName',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '版本号',
          key: 'version',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '上传日期 ',
          key: 'crtDate',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '修改日期',
          key: 'modDate',
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
    ok() {
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
    cancel() {
      this.handleClear()
      this.modalColony = false
    },
    handleUpload(files) {
      console.log('======files', files)
      this.files.push(files)
    },
    handleClear() {
      this.$refs.upload.clearFiles()
    },
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
    handleFireDropdownEditor(row) {
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
      this.modalColony = true
      this.handleClear()
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
      this.formSearch.name && (postData.jarName = this.formSearch.name)
      this.loading = true
      ajaxGetMember(postData).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
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
