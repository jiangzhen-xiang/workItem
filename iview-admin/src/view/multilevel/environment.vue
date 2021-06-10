<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <div slot="title" style="height:34px;">
            <div class="flex-left">
              <div class="flexItem" v-if="$route.query.name">
                <span style="line-height:32px;">
                  集群名称:{{
                  $route.query.name
                  }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </div>
              <div class="flexItem">
                <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline>
                  <FormItem prop="name" style="margin-bottom:0;">
                    <Input v-model="formSearch.name" placeholder="集群名称" size="small"></Input>
                  </FormItem>
                  <FormItem style="margin-bottom:0;">
                    <Button type="primary" size="small" @click="handleSubmitSearch('formSearch')">查询</Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <Button @click="handleAdd" type="primary" size="small">
              <Icon type="ios-ios-plus" />增加环境
            </Button>
            <Button @click="handleGoBack" type="primary" size="small">
              <Icon type="ios-ios-plus" />返回
            </Button>
          </div>
          <div class="wrapper">
            <Table
              :loading="loading"
              :columns="tableTitle"
              tooltip-theme="dark"
              :data="tableData"
              border
              :height="tableHeight"
            >
              <template slot-scope="{ row }" slot="environment">
                <Select v-model="row.defaultEnv" prop="defaultEnv" placeholder="环境">
                  <Option
                    v-for="(item, index) in row.envVOList"
                    :value="item.value"
                    :label="item.label"
                  >{{ item.label }}</Option>
                </Select>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="total"
                show-total
                show-elevator
                :current="current"
                :page-size="pageSize"
                @on-change="pageChange"
              />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Drawer title="选择连接类型" v-model="value3" width="720" :mask-closable="false" :styles="styles">
      <div class="drawerWrapper">
        <Tabs value="name1">
          <TabPane label="消息队列" name="name1">
            <div class="tabConten" style>
              <div class="flex">
                <div
                  class="flex-item"
                  v-for="(item, index) in queryArr"
                  @click="chooseType(item, index)"
                >
                  <div class="borderWrapper">
                    <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                      <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                    </div>
                    <div class="name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="数据库" name="name2">
            <div class="flex">
              <div
                class="flex-item"
                v-for="(item, index) in fileDbArr"
                @click="chooseType(item, index)"
              >
                <div class="borderWrapper">
                  <div class="iconWrapper" :class="item.background" style="tont-size:48px;">
                    <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                  </div>
                  <div class="name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="handleDrawAdd">确定</Button>
      </div>
    </Drawer>
    <Drawer
      :title="titleValue4"
      v-model="value4"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <div class="drawerWrapper">连接信息</div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
        <Button type="primary" @click="handleDrawAdd">确定</Button>
      </div>
    </Drawer>
    <Modal v-model="modalColony" title="增加集群" footer-hide>
      <div class="formWrapper">
        <colonyForm @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel" />
      </div>
    </Modal>
    <Modal v-model="modalEditorColony" title="编辑集群" footer-hide>
      <div class="formWrapper">
        <colonyEditorForm
          ref="colonyEditorForm"
          @handleSuccess="handleColonyEditor"
          :row="curCluster"
          @handleCancel="handleCancel"
        />
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment" title="增加环境" footer-hide>
      <div class="formWrapper">
        <rowenvironmentForm
          ref="rowEnvironmentForm"
          @handleSuccess="handleRowEnvironmentAdd"
          @handleCancel="handleCancel"
          :index="index"
          :curColony="curColony"
        />
      </div>
    </Modal>
    <Modal v-model="modalEditorRowEnvironment" title="编辑环境" footer-hide>
      <div class="formWrapper">
        <rowEnvironmentEditorForm
          ref="rowEnvironmentEditorForm"
          @handleSuccess="handleRowEnvironmentEditor"
          @handleCancel="handleCancel"
          :index="index"
          :curColony="curColony"
        />
      </div>
    </Modal>

    <Modal v-model="modal1" title="增加服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalForm"
          @handleSuccess="handleSuccessModal"
          @handleFail="handleFailModal"
          :is="zjName"
        ></component>
      </div>
    </Modal>
    <Modal v-model="modal2" title="编辑服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalFormEditor"
          @handleSuccessEditor="handleSuccessModalEditor"
          @handleFail="handleFailModalEditor"
          :is="zjNameEditor"
        ></component>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'

import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'

import rowenvironmentForm from './components/rowEnvironmentForm'
import rowEnvironmentEditorForm from './components/rowEnvironmentEditorForm'
import { ajaxGetCluster, ajaxDeleteCluster } from '@/api/link.js'
import { ajaxGetEnv, ajaxAddEnv, ajaxDeleteEnv } from '@/api/env.js'

export default {
  name: 'level_2_3',
  data () {
    return {
      total: 0,
      value4: false,
      index: 0,
      titleValue4: '',
      curColony: '',
      modalColony: false,
      modalEditorColony: false,
      curCluster: {},

      modalRowEnvironment: false,
      modalEditorRowEnvironment: false,
      tableHeight: 0,
      formSearch: {
        type: '',
        colony: ''
      },
      formValidate: {},
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
          width: 60,
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
          eclipse: true,
          tooltip: true
        },
        {
          title: '所属集群',
          key: 'clusterName',
          eclipse: true,
          tooltip: true
        },
        {
          title: '描述',
          key: 'description',
          eclipse: true,
          tooltip: true
        },

        {
          title: '创建时间',
          key: 'crtDate',
          eclipse: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',

          render: (h, params) => {
            return h('div', [
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "primary",
              //       size: "small"
              //     },
              //     on: {
              //       click: () => {
              //         this.curModalEditor = params.row.type + "EditorForm";

              //         this.$nextTick(() => {
              //           this.$refs.modalFormEditor.formValidateEditor = JSON.parse(
              //             JSON.stringify(params.row)
              //           );
              //           this.$refs.modalFormEditor.formValidate = JSON.parse(
              //             JSON.stringify(params.row)
              //           );
              //           this.$refs.modalFormEditor.curIndex =
              //             +params.index + (this.current - 1) * this.size;
              //           this.modalShow("modal2");
              //         });
              //       }
              //     }
              //   },
              //   "查看"
              // ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'primary',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.curModal = params.row.type + 'Form'

              //         this.linkType = params.row.linkType
              //         this.linkForm.linkType = params.row.linkType
              //         this.handleAddLinkModal()
              //       }
              //     }
              //   },
              //   '环境参数配置'
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modalEditorRowEnvironment = true
                      this.$nextTick(() => {
                        for (let k in this.$refs.rowEnvironmentEditorForm
                          .formValidate) {
                          this.$refs.rowEnvironmentEditorForm.formValidate[k] =
                            params.row[k]
                        }
                        this.$refs.rowEnvironmentEditorForm.formValidate.clusterId = params.row.clusterId.toString()
                      })
                    }
                  }
                },
                '编辑'
              ),

              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '消息提示',
                        closable: true,
                        content: '删除该数据后将不可恢复，是否删除?',
                        loading: true,
                        onOk: () => {
                          let index =
                            +params.index + this.size * (this.current - 1)
                          this.handleDeleteEnv(index, params.row)
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],

      tableData: [
        // {
        //   colony: 'mongodb',
        //   url: 'url',
        //   desc: 'desc',
        //   type: 'mongodb',
        //   username: 'username',
        //   password: 'password',
        //   annotions: []
        // }
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
    colonyForm,
    colonyEditorForm,
    rowEnvironmentEditorForm,
    rowenvironmentForm
  },
  computed: {
    
    zjName () {
      return this.curModal
    },
    zjNameEditor () {
      return this.curModalEditor
    },
    getTableData () {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        let rule1 = index >= (this.current - 1) * this.size
        let rule2 = index < this.current * this.size

        return rule1 && rule2
      })
      return arr
    }
  },
  activated () {
    this.getLinkArr()
  },
  watch: {
    $route: {
      handler () {
        this.getLinkArr()
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true
    }
  },
  methods: {
    handleDeleteEnv (index, row) {
      ajaxDeleteEnv(row)
        .then(res => {
          if (res.data.status == 'ok') {
            this.$Message.success(res.data.message || '删除成功')
            this.$Modal.remove()
            this.getLinkArr()
          } else {
            this.$Message.error(res.data.message || '删除失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通信失败')
        })
    },
    handleGoBack () {
      this.$router.go(-1)
    },
    handleColonyEditor (postData) {
      this.loading = true
      setTimeout(() => {
        this.getLinkArr()
        this.loading = false
        this.modalEditorColony = false
      })
    },
    handleCancel (key) {
      this.modalHide(key)
    },
    handleDeleteEnvironment (index, params) {
      this.loading = true
      ajaxDeleteCluster(params.row)
        .then(res => {
          this.loading = false
          if (res.data.status == 'ok') {
            this.$Message.success('删除成功')
            this.getLinkArr()
          } else {
            this.$Message.error('删除失败')
          }
        })
        .catch(err => {
          this.loading = false
          this.$Message.error('与服务器通信失败')
        })
    },
    handleRowEnvironmentAdd (postData) {
      this.modalRowEnvironment = false

      this.getLinkArr()
    },
    handleRowEnvironmentEditor (postData) {
      this.modalEditorRowEnvironment = false

      this.getLinkArr()
    },
    handleColonyAdd (postData) {
      this.loading = true
      setTimeout(() => {
        this.getLinkArr()
        this.loading = false
        this.modalColony = false
      })
    },
    setTableHeight () {
      this.tableHeight =
        document.body.offsetHeight - 64 - 48 - 48 - 16 * 2 - 44 - 18 * 2
    },
    handleSubmitSearch () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        let tableData = localStorage.getItem('linkTableData')
        if (!tableData) {
          localStorage.setItem('linkTableData', JSON.stringify(this.tableData))
        }
        tableData && (this.tableData = JSON.parse(tableData))

        this.tableData = this.tableData.filter(item => {
          console.log(
            'item',
            item,
            this.formSearch.type,
            item.type == this.formSearch.type
          )
          if (this.formSearch.colony == '') {
            return true
          } else {
            return item.colony == this.formSearch.colony
          }
        })
      }, 2000)
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
      console.log('=========curModal', this.curModal)
      if (item.name == 'kafka') {
        this.$set(this.queryArr, index, item)
      } else {
        this.$set(this.fileDbArr, index, item)
      }

      this.handleDrawAdd()
    },
    handleAdd () {
      // this.value3 = true
      // this.modalColony = true
      this.modalRowEnvironment = true
      if (this.$route.query.id) {
        this.$nextTick(() => {
          this.$refs.rowEnvironmentForm.formValidate.clusterId = this.$route.query.id.toString()
        })
      }
    },
    handleTestConnServe () {
      let postData = this.$refs.modalForm.getFormData()
      console.log('=========postData', postData)
      this.$Message.success('连接成功')
    },
    pageChange (val) {
      this.current = +val
      this.getLinkArr()
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
    getLinkArr () {
      let postData = {}
      postData.pageNum = this.current
      postData.pageSize = this.size
      postData.clusterId = this.$route.query.id

      ajaxGetEnv(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$Message.error('查询环境失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通讯失败')
        })
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.setTableHeight()
      this.getLinkArr()
    })
  }
}
</script>
<style>
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
.flex-left {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  .flexItem {
    margin-right: 10px;
    text-align: center;
  }
}
</style>
