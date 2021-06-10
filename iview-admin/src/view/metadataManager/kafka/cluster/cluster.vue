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
                  :rules="ruleValidate"
                  inline>
              <FormItem prop="name">
                <Input v-model="formSearch.name"
                       placeholder="名称"
                       size="small"></Input>
              </FormItem>
              <FormItem prop="abbreviation">
                <Input v-model="formSearch.abbreviation"
                       placeholder="简称"
                       size="small"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary"
                        size="small"
                        @click="handleSubmitSearch('formSearch')">查询</Button>
              </FormItem>
            </Form>
          </p>

          <div class="wrapper">
            <Table :loading="loading"
                   :columns="tableTitle"
                   tooltip-theme="dark"
                   :data="tableData"
                   border
                   :height="tableHeight">
              <template slot-scope="{ row,index }"
                        slot="action">
                <Dropdown @on-click="handleDropdownMenu(row,$event)"
                          transfer>
                  <a href="javascript:void(0)">
                    操作
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="Group">
                      <Icon type="logo-buffer" /> 查看Group
                    </DropdownItem>
                    <DropdownItem name="Topic">
                      <Icon type="ios-browsers-outline" /> 查看Topic
                    </DropdownItem>
                    <DropdownItem name="Warrant">
                      <Icon type="ios-git-branch" /> 查看授权
                    </DropdownItem>
                    <DropdownItem name="Offset">
                      <Icon type="ios-git-branch" /> 查看offset
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
    <Modal v-model="modalLook"
           :title="lookTitle"
           footer-hide
           width="80%">
      <div class="formWrapper">
        <commonTable @firePageChange="handlePageChange"
                     :tableTitle="lookTableColumn"
                     :tableData="lookTableData"
                     :postData="paramPostData"
                     :total="lookPageTotal"
                     :current="lookCurrent"
                     :page-size="lookPageSize"
                     :isShowPage="isShowPage"/>
      </div>
    </Modal>
  </div>
</template>
<script>
import commonTable from '@/common/commonTable'
import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'
import { ajaxGetClusterMeta, ajaxDeleteClusterMeta, ajaxGetGroupInfo, ajaxGetTopicInfo, ajaxGetOffsetInfo, ajaxGetWarrantInfo, ajaxGetTopicLastInfo } from '@/api/datametaCluster.js'

export default {
  // name: 'clusterMeta',
  data () {
    return {
      modalLook: false,
      paramPostData: {
        handleSearch: '', // 方法名
        conditionSearch: {}
      },
      lookPageTotal: 0,
      lookTitle: '',
      lookPageSize: 10,
      lookCurrent: 1,
      lookTableColumn: [],
      lookTableData: [],
      isShowPage: true,
      lookTableTitleObj: {
        group: [
          {
            // type: "index",
            title: '序号',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                +params.index + 1 + (this.lookCurrent - 1) * this.lookPageSize
              )
            }
          },
          {
            title: '名称',
            key: 'name',
            minWidth: 160,
            eclipse: true,
            tooltip: true
          },
          {
            title: '集群简称',
            key: 'cluster',
            minWidth: 80,
            eclipse: true
          }
        ],
        topic: [
          {
            title: '序号',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                +params.index + 1 + (this.lookCurrent - 1) * this.lookPageSize
              )
            }
          },
          {
            title: '名称',
            key: 'name',
            minWidth: 160,
            eclipse: true
          },
          {
            title: '集群简称',
            key: 'cluster',
            minWidth: 80,
            eclipse: true
          },
          {
            title: '分区数',
            key: 'partitionCount',
            minWidth: 80,
            eclipse: true
          },
          {
            title: '备份数',
            key: 'replicateCount',
            minWidth: 80,
            eclipse: true
          }
        ],
        warrant: [
          {
            title: '序号',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                +params.index + 1 + (this.lookCurrent - 1) * this.lookPageSize
              )
            }
          },
          {
            title: '用户名',
            key: 'name',
            minWidth: 80,
            eclipse: true,
            tooltip: true
          },
          {
            title: '集群简称',
            key: 'cluster',
            minWidth: 80,
            eclipse: true
          },
          {
            title: '所属组件',
            key: 'type',
            minWidth: 80,
            eclipse: true,
            tooltip: true

          },
          {
            title: '所属主题',
            key: 'topic',
            minWidth: 160,
            eclipse: true,
            tooltip: true
          },
          {
            title: '所属groupId',
            key: 'group',
            minWidth: 160,
            eclipse: true,
            tooltip: true
          },
          {
            title: '授权类型',
            key: 'aclOperation',
            minWidth: 100,
            eclipse: true,
            tooltip: true
          },
          {
            title: '授权类别',
            key: 'aclPermissionType',
            minWidth: 100,
            eclipse: true,
            tooltip: true
          }

        ],
        Offset: [
          {
            title: '序号',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                +params.index + 1 + (this.lookCurrent - 1) * this.lookPageSize
              )
            }
          },
          {
            title: 'topic名称',
            key: 'value',
            minWidth: 160,
            eclipse: true,
            tooltip: true
          },
          {
            title: '数据量',
            key: 'score',
            minWidth: 160,
            eclipse: true,
            tooltip: true
          }
        ]
      },
      //= ============弹窗组件=================
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
          minWidth: 80,
          eclipse: true,
          tooltip: true
        },
        {
          title: '简称',
          key: 'abbreviation',
          minWidth: 80,
          eclipse: true,
          tooltip: true
        },
        // {
        //   title: '用户',
        //   key: 'userName',
        //   minWidth: 80,
        //   eclipse: true,
        //   tooltip: true
        //
        // },
        //
        // {
        //   title: '密码',
        //   key: 'password',
        //   minWidth: 80,
        //   eclipse: true,
        //   tooltip: true
        //
        // },
        {
          title: '集群信息',
          key: 'bootstrapServer',
          minWidth: 180,
          eclipse: true,
          tooltip: true
        },
        // {
        //   title: 'groupId',
        //   key: 'groupId',
        //   minWidth: 160,
        //   eclipse: true,
        //   tooltip: true
        //
        // },

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
    commonTable,
    colonyForm,
    colonyEditorForm,
  },
  computed: {
    zjName () {
      return this.curModal
    },
    zjNameEditor () {
      return this.curModalEditor
    }

  },
  methods: {
    handleDropdownMenu (row, name) {
      if (this.hasOwnProperty('handleFireDropdown' + name)) {
        this['handleFireDropdown' + name](row)
      }
    },
    handleFireDropdownGroup (row) {
      this.lookTitle = '查看Group信息'
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        code: row.abbreviation
      }
      ajaxGetGroupInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
          this.lookPageTotal = res.data.data.total
          this.lookTableColumn = this.lookTableTitleObj.group
          this.paramPostData.handleSearch = 'handleGetGroup'
          this.paramPostData.conditionSearch = postData
          this.modalLook = true
        } else {
          this.$Message.error('查看Group信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleFireDropdownTopic (row) {
      this.lookTitle = '查看Topic信息'
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        code: row.abbreviation
      }
      ajaxGetTopicInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
          this.lookPageTotal = res.data.data.total
          this.lookTableColumn = this.lookTableTitleObj.topic
          this.paramPostData.handleSearch = 'handleGetTopic'
          this.paramPostData.conditionSearch = postData
          this.modalLook = true
        } else {
          this.$Message.error('查看Topic信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleFireDropdownOffset (row) {
      this.lookTitle = '查看offset信息'
      this.loading = true
      this.isShowPage = false;
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        code: row.abbreviation
      }
      ajaxGetOffsetInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data
          this.lookPageTotal = res.data.data.length
          this.lookTableColumn = this.lookTableTitleObj.Offset
          this.paramPostData.handleSearch = 'handleGetOffset'
          this.paramPostData.conditionSearch = postData
          this.modalLook = true
        } else {
          this.$Message.error('查看offset信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleFireDropdownWarrant (row) {
      this.lookTitle = '查看授权信息'
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        code: row.abbreviation
      }
      ajaxGetWarrantInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
          this.lookPageTotal = res.data.data.total
          this.lookTableColumn = this.lookTableTitleObj.warrant
          this.paramPostData.handleSearch = 'handleGetWarrant'
          this.paramPostData.conditionSearch = postData
          this.modalLook = true
        } else {
          this.$Message.error('查看授权信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleFireDropdownLast (row) {
      this.loading = true
      let postData = {
        pageSize: 10,
        pageNum: 1,
        id: params.row.id
      }
      ajaxGetTopicLastInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.$Message.success('获取最新运行状态成功')
        } else {
          this.$Message.error('获取最新运行状态信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleFireDropdownEditor (row) {
      this.modalShow('modalEditorColony')
      this.$nextTick(() => {
        for (let k in this.$refs.colonyEditorForm.formValidate) {
          this.$refs.colonyEditorForm.formValidate[k] = row[k]
          this.$refs.colonyEditorForm.formEditorValidate[k] = row[k]
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
    handleGetTopicLast (postData) {
      handleGetTopicLast(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
        } else {
          this.$Message.error('查处Topic信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleGetWarrant (postData) {
      ajaxGetWarrantInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
        } else {
          this.$Message.error('查看授权信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },

    handleGetOffset (postData) {
      ajaxGetOffsetInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data
        } else {
          this.$Message.error('查看授权信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleGetTopic (postData) {
      ajaxGetTopicInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
        } else {
          this.$Message.error('查看Topic信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleGetGroup (postData) {
      ajaxGetGroupInfo(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
        } else {
          this.$Message.error('查看Group信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handlePageChange (postData) {
      this.lookCurrent = postData.conditionSearch.pageNum
      this[postData.handleSearch](postData.conditionSearch)
    },
    handleGoEnv (row) {
      this.$router.push({
        path: 'environment',
        query: row
      })
    },
    handleColonyEditor (postData) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this.modalEditorColony = false
      })
    },
    handleCancel (key) {
      this.modalHide(key)
    },
    handleDeleteEnvironment (row) {
      this.loading = true
      ajaxDeleteClusterMeta(row).then(res => {
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
    handleRowEnvironmentAdd (postData) {
      this.modalRowEnvironment = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let index = postData.index
        delete postData.index
        this.$set(this.tableData, index, postData)
      }, 1000)
    },
    handleColonyAdd (postData) {
      this.loading = true
      setTimeout(() => {
        this.getColonyArr()
        this.loading = false
        this.modalColony = false
      })
    },
    setTableHeight () {
      this.tableHeight = document.body.offsetHeight - 64 - 38 - 52 - 49 - 16 * 2 - 34
    },
    handleSubmitSearch () {
      this.current = 1
      this.getColonyArr()
    },
    handleFailModalEditor () { },
    handleSuccessModalEditor (postData) {
      console.log('======postData', postData)
      let index = postData.index
      this.modalHide('modal2')
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$set(this.tableData, index, postData)
      }, 2000)
    },
    handleSuccessModal (postData) {
      this.tableData.push(postData)
      this.modalHide('modal1')
    },
    handleFailModal () { },
    handleDrawAdd () {
      this.value3 = false
      this.modalShow('modal1')
    },
    routeTo (item, index) {
      this.$router.push({
        name: item.name,
        params: item
      })
    },
    chooseType (item, index) {
      item.isChoose = !item.isChoose
      this.curModal = item.name + 'Form'
      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else {
        this.$set(this.fileDbArr, index, item)
      }

      this.handleDrawAdd()
    },
    handleAdd () {
      // this.value3 = true
      this.modalColony = true;
    },
    handleTestConnServe () {
      let postData = this.$refs.modalForm.getFormData()
      console.log('=========postData', postData)
      this.$Message.success('连接成功')
    },
    pageChange (val) {
      this.current = +val
      this.getColonyArr()
    },
    change (name) {
      // this.handleReset(name);
    },

    modalShow (k) {
      this[k] = true
    },
    modalHide (k) {
      this[k] = false
    },
    getFormData () {
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

    getColonyArr () {
      let postData = {}
      // postData.pageSize = this.pageSize
      // postData.pageNum = this.current
      this.formSearch.name && (postData.name = this.formSearch.name)
      this.loading = true
      ajaxGetClusterMeta(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
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
<style lang="less" scoped>
.ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
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
