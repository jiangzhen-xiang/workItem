
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
                :rules="ruleValidate"
                inline>
            <FormItem prop="name">
              <Input v-model="formSearch.name"
                     placeholder="名称"
                     size="small"></Input>
            </FormItem>
            <FormItem prop="cluster">
              <Input v-model="formSearch.cluster"
                     placeholder="集群简称"
                     size="small"></Input>
            </FormItem>
            <FormItem prop="user">
              <Input v-model="formSearch.user"
                     placeholder="用户名"
                     size="small"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary"
                      size="small"
                      @click="handleSubmitSearch('formSearch')">查询</Button>
            </FormItem>
          </Form>
          </p>
<!--          <div class="btnWrapper"-->
<!--               slot="extra"-->
<!--               style="left:16px;">-->
<!--            <ButtonGroup>-->
<!--              <Button @click="handleAdd"-->
<!--                      type="primary"-->
<!--                      size="small">-->
<!--                <Icon type="ios-ios-plus" />增加群组-->
<!--              </Button>-->
<!--            </ButtonGroup>-->
<!--          </div>-->
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
                    <DropdownItem name="Offset">
                      <Icon type="logo-buffer" /> 查看offset
                    </DropdownItem>
                    <DropdownItem name="Topic">
                      <Icon type="logo-buffer" /> 查看topic
                    </DropdownItem>
                    <DropdownItem name="Warrant">
                      <Icon type="ios-git-branch" /> 查看授权
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
           title="增加群组"
           footer-hide>
      <div class="formWrapper">
        <colonyForm @handleSuccess="handleColonyAdd"
                    :index="index"
                    @handleCancel="handleCancel" />
      </div>
    </Modal>
    <Modal v-model="modalEditorColony"
           title="编辑群组"
           footer-hide>
      <div class="formWrapper">
        <colonyEditorForm ref="colonyEditorForm"
                          @handleSuccess="handleColonyEditor"
                          :row="curCluster"
                          @handleCancel="handleCancel" />
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
                     :total="lookPageTotal"
                     :current="lookCurrent"
                     :page-size="lookPageSize"
                     :isShowPage="isShowPage" />
        <!--  -->
      </div>
    </Modal>
  </div>
</template>
<script>
import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'
import {
  ajaxGetGroupMeta,
  ajaxGetTopicByGroup,
  ajaxGetOffsetByGroup,
  ajaxGetWarrantByGroup,
  ajaxGetGroupByTopic, ajaxGetWarrantByTopic
} from '@/api/datametaCluster.js'
import commonTable from '@/common/commonTable'
export default {
  name: 'group',
  data () {
    return {
      paramPostData: {
        handleSearch: '', // 方法名
        conditionSearch: {}

      },
      lookPageSize: 10,
      lookCurrent: 1,
      lookPageTotal: 0,
      lookTitle: '',
      lookTableColumn: [],
      lookTableData: [],
      lookTableTitleObj: {
        topic: [
          {
            title: '序号',
            width: 80,
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
            minWidth: 160,
            eclipse: true,
            tooltip: true
          },
          {
            title: '分区数',
            key: 'partitionCount',
            minWidth: 80,
            eclipse: true,
            tooltip: true

          },
          {
            title: '备份数',
            key: 'replicateCount',
            minWidth: 100,
            eclipse: true,
            tooltip: true

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
            width: 80,
            eclipse: true
          },
          {
            title: '集群简称',
            key: 'cluster',
            width: 100,
            eclipse: true
          },
          {
            title: '所属组件',
            key: 'type',
            width: 100,
            eclipse: true

          },
          {
            title: '名称',
            key: 'group',
            minWidth: 180,
            eclipse: true,
            tooltip: true
          },
          {
            title: '授权类型',
            key: 'aclOperation',
            minWidth: 55,
            eclipse: true
          },
          {
            title: '授权类别',
            key: 'aclPermissionType',
            minWidth: 55,
            eclipse: true
          }
        ],
        Offset: [
          {
            title: '序号',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h(
                'span',
                +params.index + 1
              )
            }
          },
          {
            title: '集群简称',
            key: 'cluster',
            minWidth: 55,
            eclipse: true,
            tooltip: true
          },
          {
            title: '消费的topic',
            key: 'topicName',
            minWidth: 240,
            eclipse: true,
            tooltip: true
          },
          {
            title: 'topic分区',
            key: 'partitionId',
            minWidth: 55,
            eclipse: true,
            tooltip: true

          },
          {
            title: '数据总量',
            key: 'totalOffset',
            minWidth: 55,
            eclipse: true,
            tooltip: true
          },
          {
            title: '已消费数据量',
            key: 'commitOffset',
            minWidth: 55,
            eclipse: true,
            tooltip: true
          },
          {
            title: '积压数据量',
            key: 'lagOffset',
            minWidth: 55,
            eclipse: true,
            tooltip: true
          }
        ]
      },
      modalLook: false,
      isShowPage: true,
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
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },
        {
          title: '消费的topic',
          key: 'topicName',
          minWidth: 280,
          eclipse: true,
          tooltip: true
        },
        {
          title: '用户名',
          key: 'principal',
          Width: 100,
          eclipse: true,
          tooltip: true

        },

        {
          title: '集群简称',
          key: 'cluster',
          Width: 100,
          eclipse: true,
          tooltip: true

        },
        // {
        //   title: '状态',
        //   key: 'state',
        //   minWidth: 100,
        //   eclipse: true,
        //   tooltip: true
        //
        // },
        {
          title: '操作',
          key: 'action',
          minWidth: 120,
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
    handlePageChange (val) {
      this.lookCurrent = val.conditionSearch.pageNum
      this[val.handleSearch](val.conditionSearch)
    },
    handleFireDropdownTopic (row) {
      this.lookTitle = '查看Topic信息'
      this.isShowPage = true
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        group: row.name,
        cluster: row.cluster
      }
      ajaxGetTopicByGroup(postData).then(res => {
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
      this.lookTitle = '查看消费情况'
      this.isShowPage = false
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        id: row.id,
        pageSize: 10,
        pageNum: 1
      }
      ajaxGetOffsetByGroup(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data
          this.lookPageTotal = res.data.data.length
          this.lookTableColumn = this.lookTableTitleObj.Offset
          this.paramPostData.handleSearch = 'handleGetTopic'
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
      this.isShowPage = true
      this.loading = true
      this.lookCurrent = 1
      let postData = {
        pageSize: 10,
        pageNum: 1,
        cluster: row.cluster,
        group: row.name
      }
      ajaxGetWarrantByGroup(postData).then(res => {
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
    handleGetTopic (postData) {
      ajaxGetTopicByGroup(postData).then(res => {
        this.loading = false
        if (res.data.status == '1') {
          this.lookTableData = res.data.data.list
        } else {
          this.$Message.error('查看topic信息失败')
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('与服务器通信失败')
      })
    },
    handleGetWarrant (postData) {
      ajaxGetWarrantByGroup(postData).then(res => {
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
    handleDeleteEnvironment (index, params) {
      this.loading = true
      ajaxDeleteCluster(params.row).then(res => {
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
      // let envIndex = ''
      // params.row.rowEnvironmentArr.map((evi, i) => {
      //   (evi.value == params.row.environment) && (envIndex = i)
      // })
      // if (envIndex !== '') {
      //   params.row.rowEnvironmentArr.splice(envIndex, 1)
      //   this.getColonyArr()
      //   this.$set(this.tableData, index, params.row)
      //   localStorage.setItem('colonyArr', JSON.stringify(this.tableData))
      // }
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
      // delete postData.index;

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
      this.modalColony = true
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
      postData.pageSize = this.pageSize
      postData.pageNum = this.current
      this.formSearch.name && (postData.name = this.formSearch.name)
      this.formSearch.cluster && (postData.cluster = this.formSearch.cluster)
      this.formSearch.topic && (postData.topic = this.formSearch.topic)
      this.formSearch.user && (postData.user = this.formSearch.user)
      this.loading = true
      ajaxGetGroupMeta(postData).then(res => {
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
