
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
              <Input v-model="formSearch.name" placeholder="脚本名称" size="small"></Input>
            </FormItem>
            <FormItem>
            <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
        </FormItem>
          </Form>
          </p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="handleAdd" type="primary" size="small" style="margin-right:5px;">
                <Icon  type="ios-ios-plus" />>创建Topic
              </Button>
              <Button @click="handleAdd1" type="primary" size="small" style="margin-right:5px;">>
                <Icon  type="ios-ios-plus" />授权
              </Button>
              <Button @click="handleAdd2" type="primary" size="small" style="margin-right:5px;">
                <Icon  type="ios-ios-plus" />>更改配置
              </Button>
               <Button @click="handleDownload" type="primary" size="small">
                <Icon  type="ios-ios-plus" /> >生成脚本
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table  ref="table" :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="tableData" border :height="tableHeight">
              <template slot-scope="{ row,index }" slot="name">
                    <Tooltip :content="row.name" placement="top-start">
                      <Button type="text" @click="handleGoEnv(row)">{{row.name}}</Button>
                    </Tooltip>
                </template>
                <template slot-scope="{ row }" slot="retentionMs">
                   <span> <span style="color:#19be6b">{{ row.retentionMs/1000}}</span>(秒)</span>
                </template>
                <template slot-scope="{ row }" slot="environment">
                    <Select v-model="row.defaultEnv" prop="defaultEnv" transfer placeholder="环境"  transfer size="small" >
                         <Option v-for="(item,index) in row.envVOList" :value="item.id.toString()" :label="item.name" >{{item.name}} </Option>
                    </Select>
                </template>
                <template slot-scope="{ row }" slot="operationType">
                   <span> {{ getOperationTypeText(row.operationType)}}</span>
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
    <Modal v-model="modalColony" title="脚本数据" footer-hide>
      <div class="formWrapper">
          <colonyForm  @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony" title="编辑操作字段" footer-hide>
      <div class="formWrapper">
          <colonyEditorForm  ref="colonyEditorForm" @handleSuccess="handleColonyEditor" :row="curCluster" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment" title="增加环境" footer-hide>
      <div class="formWrapper">
          <rowenvironmentForm  @handleSuccess="handleRowEnvironmentAdd" @handleCancel="handleCancel" :index = "index" :curColony="curColony"/>
      </div>
    </Modal>
     <!-- /新增/ -->
    <Modal v-model="modalColony1" title="授权" footer-hide>
      <div class="formWrapper">
          <colonyForm1  @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony1" title="授权" footer-hide>
      <div class="formWrapper">
          <colonyEditorForm1  ref="colonyEditorForm1" @handleSuccess="handleColonyEditor" :row="curCluster" @handleCancel="handleCancel"/>
      </div>
    </Modal>
     <Modal v-model="modalColony2" title="更改配置" footer-hide>
      <div class="formWrapper">
          <colonyForm2  @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony2" title="编辑更改配置" footer-hide>
      <div class="formWrapper">
          <colonyEditorForm2  ref="colonyEditorForm2" @handleSuccess="handleColonyEditor" :row="curCluster" @handleCancel="handleCancel"/>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'
import rowenvironmentForm from './components/rowEnvironmentForm'

//= =======start========
import colonyForm1 from './components/colonyForm1'
import colonyEditorForm1 from './components/colonyEditorForm1'
import colonyForm2 from './components/colonyForm2'
import colonyEditorForm2 from './components/colonyEditorForm2'

// =========end========

import { ajaxGetScriptMeta, ajaxDeleteScriptMeta, ajaxDownloadScriptMeta } from '@/api/datametaCluster.js'

export default {
  name: 'operation',
  data() {
    return {
      selectedIds: [],
      //= =========跨页多选==========
      modalEditorColony2: false,
      modalEditorColony1: false,
      modalColony1: false,
      modalColony2: false,
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
          type: 'selection',
          title: '序号',
          width: 60,
          align: 'center'

        },
        {
          // type: "index",
          title: '序号',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 120,
          eclipse: true,
          tooltip: true
        },
        {
          title: '集群',
          key: 'cluster',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'topic名称',
          key: 'topicName',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },

        {
          title: 'topic分区数',
          key: 'partitionCount',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'topic备份数',
          key: 'replicateCount',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: 'group名称',
          key: 'groupPrefixName',
          minWidth: 120,
          eclipse: true,
          tooltip: true

        },
        {
          title: '脚本类型',
          key: 'operationType',
          minWidth: 120,
          eclipse: true,
          tooltip: true,
          slot: 'operationType'
        },

        {
          title: '用户名',
          key: 'userName',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: '保存时长',
          key: 'retentionMs',
          minWidth: 120,
          eclipse: true,
          tooltip: true,
          slot: 'retentionMs'

        },

        {
          title: '操作',
          key: 'action',
          minWidth: 120,
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
    colonyForm2,
    colonyEditorForm2,
    colonyForm1,
    colonyEditorForm1,
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
    // handleSelectAll(slection) {
    //   // 全选
    //   if (slection.length === 0) {
    //     var data = this.$refs.table.data
    //     data.forEach((item, index) => {
    //       if (this.selectedIds.indexOf(item.id) != '-1') {
    //         this.selectedIds.splice(item.id, index)
    //       }
    //     })
    //   } else {
    //     slection.forEach((item) => {
    //       this.selectedIds.push(item.id)
    //     })
    //   }
    // },
    // handleSelect(slection, row) {
    //   this.selectedIds.push(row.id)
    // },
    // handleCancel(sleection, row) {
    //   this.selectedIds.splice(this.selectedIds.indexOf(row.id), 1)
    // },
    // changePage(pageIndex) {
    //   // 分页逻辑 --- start
    //   var len = pageIndex * 10 < this.total ? pageIndex * 10 : this.total
    //   this.tableData = []
    //   for (var i = (pageIndex * 10 - 10); i < len; i++) {
    //     this.tableData.push(this.allData[i])
    //   }
    //   // 分页逻辑 --- end

    //   var _that = this
    //   // 做跨页多选，由于渲染时间的原因，使用setTimeout规避
    //   setTimeout(function () {
    //     // 拿到当前table的所有行的引用，里面包含_isChecked属性
    //     var objData = _that.$refs.selection.$refs.tbody.objData
    //     for (let key in objData) {
    //       if (_that.selectedIds.has(objData[key].id)) {
    //         objData[key]._isChecked = true
    //       }
    //     }
    //   }, 0)
    // },

    // ============add 跨页多选 =======
    handleAdd1() {
      this.modalColony1 = true
    },
    handleAdd2() {
      this.modalColony2 = true
    },
    handleDownload() {
      let selectedArr = this.$refs.table.getSelection()
      let idsArr = selectedArr.map(item => {
        return item.id
      })

      ajaxDownloadScriptMeta({ ids: idsArr.toString() }).then(res => {
        if (res.status == '200') {
          var eleLink = document.createElement('a')
          // eleLink.download = filename

          // 字符内容转变成blob地址
          var blob = new Blob([res.data])
          eleLink.href = URL.createObjectURL(blob)
          let resName = 'script_' + new Date().getTime() + '.txt'

          eleLink.download = resName
          eleLink.style.display = 'none'
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        } else {
          this.$Message.error('与服务器通信失败')
        }
      }).error(err => {
        this.$Message.error('与服务器通信失败')
      })
      console.log(this.$refs.table.selection)
    },
    getOperationTypeText(index) {
      return ['', '创建Topic', '授权', '更改配置'][index]
    },
    handleDropdownMenu(row, name) {
      if (this.hasOwnProperty('handleFireDropdown' + name)) {
        this['handleFireDropdown' + name](row)
      }
    },
    // handleFireDropdownEditor(row) {
    //   this.modalShow('modalEditorColony')
    //   this.$nextTick(() => {
    //     for (let k in this.$refs.colonyEditorForm.formValidate) {
    //       this.$refs.colonyEditorForm.formValidate[k] = row[k]
    //       this.$refs.colonyEditorForm.formEditorValidate[k] = row[k]
    //     }
    //   })
    // },
    handleFireDropdownEditor(row) {
      if (row.status == '2') {
        this.$Message.warning('不能修改')
        return
      }
      let refKey = 'colonyEditorForm'
      let modalKey = 'modalEditorColony'

      if ((row.operationType - 1) != '0') {
        refKey += (row.operationType - 1)
        modalKey += (row.operationType - 1)
      }
      this.modalShow(modalKey)
      this.$nextTick(() => {
        for (let k in this.$refs[refKey].formValidate) {
          this.$refs[refKey].formValidate[k] = row[k]
          this.$refs[refKey].formEditorValidate[k] = row[k]
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
    handleGoEnv(row) {
      this.$router.push({
        path: 'environment',
        query: row
      })
    },
    handleColonyEditor(key) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this[key] = false
      })
    },
    handleCancel(key) {
      this.modalHide(key)
    },
    handleDeleteEnvironment(row) {
      this.loading = true
      ajaxDeleteScriptMeta(row).then(res => {
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
    handleColonyAdd(key) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this[key] = false
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
      this.formSearch.name && (postData.name = this.formSearch.name)
      this.loading = true
      ajaxGetScriptMeta(postData).then(res => {
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
