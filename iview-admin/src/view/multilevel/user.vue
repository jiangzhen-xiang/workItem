<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <div slot="title" style="height:34px;">
            <Form ref="formSearch" :model="formSearch" inline>
              <FormItem>
                <Input v-model="formSearch.clusterName" placeholder="集群名称" size="small" />
              </FormItem>
              <FormItem>
                <Input v-model="formSearch.username" placeholder="账号名称" size="small" />
              </FormItem>
              <FormItem>
                <Button type="primary" size="small" @click="handleSubmitSearch">查询</Button>
              </FormItem>
            </Form>
          </div>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="batchAdd" type="primary" size="small">
                <Icon type="ios-ios-plus" />批量添加
              </Button>
              <Button @click="handleAdd" type="primary" size="small" style="margin-left:10px;">
                <Icon type="ios-ios-plus" />增加账号
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table
              :columns="tableTitle"
              tool-theme="dark"
              :data="tableData"
              border
              :height="tableHeight"
            >
              <template slot-scope="row" slot="action">
                <Button
                  type="success"
                  size="small"
                  style="margin-right: 5px"
                  @click="editAccountFunc(row)"
                >账号编辑</Button>
                <Button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="getEnvTableListDataFunc(row)"
                >环境编辑</Button>
                <Button type="error" size="small" @click="remove(row)">删除</Button>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="total"
                :page-size="size"
                show-total
                show-elevator
                @on-change="pageChange"
                @on-page-size-change="sizeChange"
              />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <!-- 单条添加 -->
    <Modal v-model="modal1" :title="addOredit ? '编辑账号' : '添加账号'" footer-hide>
      <div style="padding:10px 0" v-show="addOredit===false">
        <Steps :current="step" :status="stepStatus" size="small">
          <Step :title="addOredit ? '编辑账号' : '添加账号'"></Step>
          <Step title="环境配置"></Step>
        </Steps>
      </div>
      <div class="stepsWrapper">
        <div v-show="step == 0">
          <Form
            ref="oneFormValidate"
            :model="oneFormValidate"
            :rules="oneRuleValidate"
            :label-width="80"
          >
            <FormItem label="应用团队" prop="teamName">
              <Select
                :disabled="addOredit===true"
                filterable
                v-model="oneFormValidate.teamName"
                placeholder="应用团队选择"
              >
                <Option
                  v-for="item in teamList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="集群" prop="colony">
              <Select
                :disabled="addOredit===true"
                filterable
                v-model="oneFormValidate.colony"
                placeholder="集群选择"
              >
                <Option
                  v-for="item in clusterList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="账号类型" prop="type">
              <Select
                :disabled="addOredit===true"
                filterable
                v-model="oneFormValidate.type"
                placeholder="请选择账号类型"
                @on-change="typeChange"
              >
                <Option
                  v-for="item in typeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.namne"
                  @click.native="getMoreParams(item)"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="账号名称" prop="username">
              <Input v-model="oneFormValidate.username" placeholder="请输入账号名称" />
            </FormItem>
            <FormItem label="备注">
              <Input
                v-model="oneFormValidate.remarks"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息"
              />
            </FormItem>
            <FormItem style="text-align:right;padding-top:10px;">
              <Button
                type="default"
                @click="oneCancelFunc('oneFormValidate')"
                style="margin-right:5px;"
              >取消</Button>
              <Button
                v-if="addOredit===true"
                type="primary"
                @click="editAccountOkFunc('oneFormValidate')"
                style="margin-right:5px;"
              >确定</Button>
              <Button
                v-if="addOredit===false"
                type="primary"
                @click="oneNextFunc('oneFormValidate')"
                style="margin-right:5px;"
              >下一步</Button>
            </FormItem>
          </Form>
        </div>
        <div class="formWrapper" v-show="step == 1">
          <component
            :accountId="accountId"
            :envList="envList"
            :editUserPwdControls="addOredit"
            ref="userFormTwo"
            @twoNext="twoNextFunc"
            @twoPrev="twoPrevFunc"
            @oneUserPwdFinishFunc="oneUserPwdEditFinish"
            @oneUserPwdEditCancelFunc="oneUserPwdEditCancel"
            v-bind:is="zjNameForm"
          ></component>
        </div>
      </div>
    </Modal>
    <!-- 批量添加 -->
    <Modal v-model="modal2" title="批量添加账号" footer-hide>
      <div style="padding:10px 0">
        <Steps :current="batchStep" :status="batchStepStatus" size="small">
          <Step title="批量增加账号"></Step>
          <Step title="验证及预览"></Step>
        </Steps>
      </div>
      <div class="stepsWrapper">
        <div v-show="batchStep == 0">
          <Form
            ref="batchFormValidate"
            :model="batchFormValidate"
            :rules="batchRuleValidate"
            :label-width="80"
          >
            <FormItem label="应用团队" prop="batchTeamName">
              <Select filterable v-model="batchFormValidate.batchTeamName" placeholder="应用团队选择">
                <Option
                  v-for="item in batchTeamList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="集群" prop="cluster">
              <Select
                filterable
                v-model="batchFormValidate.cluster"
                placeholder="集群选择"
                @on-change="handleGetBatchEnvList"
              >
                <Option
                  v-for="item in clusterList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="环境" prop="environment">
              <Select v-model="batchFormValidate.environment" placeholder="请选择环境">
                <Option
                  v-for="(item, index) in batchEnvList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="账号类型" prop="batchType">
              <Select
                v-model="batchFormValidate.batchType"
                placeholder="请选择账号类型"
                @on-change="handleChangeType"
              >
                <Option
                  v-for="(item, index) in batchClusterList"
                  :key="index"
                  :value="item.name"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="连接" prop="connect">
              <Select v-model="batchFormValidate.connect" placeholder="请输入连接地址">
                <Option
                  v-for="(item, index) in batchConnectList"
                  :key="index"
                  :value="item.connId"
                  :label="item.connName"
                >{{ item.connName }}</Option>
              </Select>
            </FormItem>

            <FormItem label="账号 " prop="user">
              <!-- <Input v-model="batchFormValidate.user" placeholder="请输入账号名称" /> -->
              <Select v-model="batchFormValidate.user" placeholder="请输入账号">
                <Option
                  v-for="(item, index) in batchUserList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem style="text-align:right;padding-top:10px;">
              <Button
                type="default"
                @click="btachCancel('batchFormValidate')"
                style="margin-right:5px;"
              >取消</Button>
              <Button
                type="primary"
                @click="batchNext('batchFormValidate')"
                style="margin-right:5px;"
              >下一步</Button>
            </FormItem>
          </Form>
        </div>
        <div class="formWrapper" v-show="batchStep == 1">
          <Form>
            <FormItem prop="environment">
              <Table border :columns="batchColumns" :data="batchData"></Table>
            </FormItem>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="tableObj.total"
                :page-size="tableObj.size"
                show-total
                show-elevator
                @on-change="tablePageChange"
                @on-page-size-change="tableSizeChange"
              />
            </div>
            <FormItem style="text-align:right;padding-top:10px;">
              <Button type="default" @click="btachPrev" style="margin-right:5px;">上一步</Button>
              <Button type="primary" @click="batchOk" style="margin-right:5px;">确定</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
    <!-- 查看详细信息 -->
    <Modal v-model="lookModal" title="环境编辑" footer-hide width="1100">
      <Table
        v-show="showTable==='0'"
        :columns="evnTableTitle1"
        tool-theme="dark"
        :data="evnTableData"
        border
        :height="tableHeight"
      >
        <template slot-scope="row" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="evnEdit(row)">编辑</Button>
          <Button type="error" size="small" @click="evnRemove(row)">回滚</Button>
        </template>
      </Table>
      <Table
        v-show="showTable==='1'"
        :columns="evnTableTitle2"
        tool-theme="dark"
        :data="evnTableData"
        border
        :height="tableHeight"
      >
        <template slot-scope="row" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="fileEvnEdit(row)">添加</Button>
          <Button type="error" size="small" @click="evnRemove(row)">回滚</Button>
        </template>
      </Table>
      <Table
        v-show="showTable==='2'"
        :columns="evnTableTitle3"
        tool-theme="dark"
        :data="evnTableData"
        border
        :height="tableHeight"
      >
        <template slot-scope="row" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="evnUserPwdFileEdit(row)"
          >编辑</Button>
          <Button type="error" size="small" @click="evnRemove(row)">回滚</Button>
        </template>
      </Table>
      <div class="page" style="text-align:right;padding-top:10px;">
        <Page
          :total="envTableListObj.total"
          :page-size="envTableListObj.size"
          show-total
          show-elevator
          @on-change="envTableListObjPageChange"
          @on-page-size-change="envTableListObjSizeChange"
        />
      </div>
    </Modal>
    <Modal v-model="fileEditEnvModal" title="编辑文件" footer-hide>
      <Form ref="fileformValidate" :model="fileformValidate" :label-width="80">
        <FormItem label="选择文件">
          <Upload
            ref="upload"
            v-model="fileformValidate.uploadList"
            multiple
            :before-upload="handleUpload"
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽上传</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem style="padding-top:10px;">
          <Button type="success" @click="fileCancel('fileformValidate')">取消</Button>
          <Button type="primary" @click="uploadfile('fileformValidate')" style="float:right">保存</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import pwdForm from './components/pwdForm'
import fileForm from './components/fileForm'
import userPwdFileForm from './components/userPwdFileForm'
import userEditorForm from './components/userEditorForm'
import userLookForm from './components/userLookForm'
import expandRow from './components/table-expand.vue'
import { userFunc } from '@/api/user1.js'
import { ajaxGetEnv } from '@/api/env.js'
import { ajaxGetConn, ajaxGetAccount } from '@/api/link.js'
export default {
  name: 'user',
  components: {
    pwdForm,
    fileForm,
    userPwdFileForm,
    userLookForm,
    userEditorForm,
    expandRow
  },
  data() {
    return {
      formType: '',
      // 公共
      current: 1,
      size: 10,
      total: 0,
      formSearch: {
        username: '',
        clusterName: ''
      },
      batchUserList: [],
      showTable: '',
      editEvnObj: {
        name: '',
        userName: '',
        password: ''
      },
      fileEditEnvModal: false,
      fileDataObj: {
        accountId: '',
        envId: ''
      },
      newForm: new FormData(),
      fileformValidate: {
        uploadList: []
      },
      evnId: '',
      editEvnObjRuleValidate: {
        userName: [
          {
            required: true,
            message: '用户名称不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      },
      addOredit: false, // 添加or编辑
      editFormData: {},
      tableHeight: 0,
      accountId: '',
      lookModal: false,
      superEnvAccountId: '',
      superEditAccountId: '',
      envTableListObj: {
        size: 10,
        current: 1,
        total: 0
      },
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
          title: '账号名称',
          key: 'name',
          tooltip: true,
          eclipse: true,
          minWidth: 180,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.superEnvAccountId = params.row.id
                    const getTableEvnObj = {
                      pageSize: this.envTableListObj.size,
                      pageNum: this.envTableListObj.current,
                      accountId: this.superEnvAccountId
                    }
                    userFunc.getTableEvnListApi(getTableEvnObj).then(response => {
                      if (response.data.status === 'ok') {
                        this.evnTableData = response.data.data.list
                        this.envTableListObj.total = response.data.data.total
                        if (params.row.categoryAccountType === '0') {
                          this.showTable = '0'
                        } else if (params.row.categoryAccountType === '1') {
                          this.showTable = '1'
                        } else if (params.row.categoryAccountType === '2') {
                          this.showTable = '2'
                        }
                        this.lookModal = true
                      }
                    })
                      .catch(error => {
                        console.log(error)
                      })
                  }
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '账号类型名称',
          key: 'categoryAccountName',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '应用团队',
          key: 'teamName',
          tooltip: true,
          eclipse: true,
          width: '160'
        },
        {
          title: '集群',
          key: 'clusterName',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '创建时间',
          key: 'crtDate',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '备注',
          key: 'description',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '操作',
          minWidth: 240,
          slot: 'action',
          align: 'center'
        }
      ],
      tableData: [],
      evnTableTitle1: [
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
          title: '环境名称',
          key: 'envName',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '用户名称',
          key: 'userName',
          tooltip: true,
          eclipse: true,
          width: '160'
        },
        {
          title: '用户密码',
          key: 'password',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '创建时间',
          key: 'crtDate',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '版本号',
          key: 'versionId',
          tooltip: true,
          eclipse: true,
          width: 80
        },
        {
          title: '操作',
          minWidth: 100,
          slot: 'action',
          align: 'center'
        }
      ],
      evnTableTitle2: [
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
        {
          title: '环境名称',
          key: 'envName',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '创建时间',
          key: 'crtDate',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '版本号',
          key: 'versionId',
          tooltip: true,
          eclipse: true,
          width: 80
        },
        {
          title: '操作',
          minWidth: 100,
          slot: 'action',
          align: 'center'
        }
      ],
      evnTableTitle3: [
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
        {
          title: '环境名称',
          key: 'envName',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '用户名称',
          key: 'userName',
          tooltip: true,
          eclipse: true,
          width: '160'
        },
        {
          title: '用户密码',
          key: 'password',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '创建时间',
          key: 'crtDate',
          tooltip: true,
          eclipse: true,
          width: 160
        },
        {
          title: '版本号',
          key: 'versionId',
          tooltip: true,
          eclipse: true,
          width: 80
        },
        {
          title: '操作',
          minWidth: 200,
          slot: 'action',
          align: 'center'
        }
      ],
      evnTableData: [],
      modal1: false,
      modal2: false,
      dataType: '',
      typeValue: '0',
      // 单条
      step: 0,
      stepStatus: 'wait',
      teamList: [],
      clusterList: [],
      typeList: [],
      envList: [],
      oneFormValidate: {
        teamName: '',
        colony: '',
        type: '',
        username: '',
        remarks: ''
      },
      oneRuleValidate: {
        teamName: [
          {
            required: true,
            type: 'integer',
            message: '应用团队不能为空',
            trigger: 'change'
          }
        ],
        colony: [
          {
            required: true,
            type: 'integer',
            message: '集群不能为空',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            type: 'integer',
            message: '类型不能为空',
            trigger: 'change'
          }
        ],
        username: [
          {
            required: true,
            message: '账户名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 批量
      batchTeamList: [],
      batchClusterList: [
        {
          id: 1,
          name: 'ldap'
        }
      ],
      batchFormValidate: {
        batchTeamName: '', // 应用团队
        cluster: '', // 集群
        batchType: '', // 批量类型
        connect: '', // 连接
        user: '', // 账号
        environment: '' // 环境
      },
      batchConnectList: [
        {
          id: 1,
          url: 'ldap://172.16.150.27:389/'
        }
      ],
      batchEnvList: [
        {
          id: 1,
          name: 'dev'
        },
        {
          id: 2,
          name: 'test'
        }
      ],
      tableObj: {
        current: 1,
        size: 10,
        total: 0
      },
      batchStep: 0,
      batchStepStatus: 'wait',
      batchColumns: [
        {
          title: '账号名称',
          key: 'accountName',
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'userName',
          align: 'center'
        },

        {
          title: '用户密码',
          key: 'password',
          align: 'center'
        }
      ],
      batchData: [],
      batchRuleValidate: {
        batchTeamName: [
          {
            type: 'integer',
            required: true,
            message: '应用团队不能为空',
            trigger: 'change'
          }
        ],
        cluster: [
          {
            required: true,
            type: 'integer',
            message: '集群不能为空',
            trigger: 'change'
          }
        ],
        // batchType: [
        //   {
        //     required: true,
        //     type: 'integer',
        //     message: '类型不能为空',
        //     trigger: 'change'
        //   }
        // ],
        connect: [
          {
            required: true,
            type: 'integer',
            message: '连接不能为空',
            trigger: 'change'
          }
        ],
        environment: [
          {
            required: true,
            type: 'integer',
            message: '请选择环境',
            trigger: 'change'
          }
        ]
        // user: [
        //   {
        //     required: true,
        //     message: '账号不能为空',
        //     trigger: 'change'
        //   }
        // ]
      }
    }
  },
  computed: {
    zjNameForm() {
      // this.formType = this.dataType + 'Form'
      return this.formType
    }
  },
  methods: {
    handleChangeType(val) {
      this.handleGetBatchConnectList(val)
      this.handleGetBatchUserList(val)
    },
    handleGetBatchUserList(val) {
      this.batchUserList = []
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      postData.clusterId = this.batchFormValidate.cluster
      postData.categoryAccountName = val

      ajaxGetAccount(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.batchUserList = res.data.data.list
          } else {
            this.$Message.error('查询连接失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通讯失败')
        })
    },
    handleGetBatchConnectList(val) {
      this.batchConnectList = []
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      postData.clusterId = this.batchFormValidate.cluster
      postData.connType = val

      ajaxGetConn(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.batchConnectList = res.data.data.list
          } else {
            this.$Message.error('查询连接失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通讯失败')
        })
    },
    handleGetBatchEnvList(val) {
      this.batchConnectList = []
      this.batchFormValidate.batchType = ''

      // TODO fock
      this.batchEnvList = []
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      postData.clusterId = val

      ajaxGetEnv(postData)
        .then(res => {
          if (res.data.status == 'ok') {
            this.batchEnvList = res.data.data.list
          } else {
            this.$Message.error('查询环境失败')
          }
        })
        .catch(err => {
          this.$Message.error('与服务器通讯失败')
        })
    },
    // 文件编辑
    fileCancel(name) {
      this.fileEditEnvModal = false
      this.$refs.upload.clearFiles()
    },
    fileEvnEdit(row) {
      this.fileDataObj.accountId = row.row.accountId
      this.fileDataObj.envId = row.row.envId
      this.fileEditEnvModal = true
    },
    handleUpload(file) {
      this.fileformValidate.uploadList = file
      this.newForm.append('file', file, file.name)
    },
    uploadfile(id) {
      userFunc.oneFileCommitApi(this.fileDataObj.envId, this.fileDataObj.accountId, this.newForm).then((response) => {
        if (response.data.status === 'ok') {
          this.$Message.success(response.data.message)
          this.newForm = new FormData()
          this.fileEditEnvModal = false
          this.$refs.upload.clearFiles()
          this.getEnvTableListDataFunc()
        } else {
          this.$Message.error(response.data.message)
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    // 查看信息取消
    lookCancel(name) {
      this.lookModal = false
      this.$refs[name].resetFields()
    },
    /**
     * 单条添加
     */
    handleAdd() {
      this.modal1 = true
      this.addOredit = false
    },
    /**
     * 第一步取消
     */
    oneCancelFunc(name) {
      this.oneFormValidate.userName = ''
      this.oneFormValidate.remarks = ''
      this.modal1 = false
      this.$refs[name].resetFields()
    },
    /**
     * 第一步下一步
     */
    oneNextFunc(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const getEnvList = {
            categoryAccountId: this.oneFormValidate.type,
            clusterId: this.oneFormValidate.colony,
            name: this.oneFormValidate.username,
            teamId: this.oneFormValidate.teamName,
            description: this.oneFormValidate.remarks
          }
          userFunc.addAccountDataApi(getEnvList).then((response) => {
            if (response.data.status === 'ok') {
              window.localStorage.setItem('getType', this.oneFormValidate.type)
              window.localStorage.setItem('getColony', this.oneFormValidate.colony)
              window.localStorage.setItem('getUser', this.oneFormValidate.username)
              window.localStorage.setItem('getTeam', this.oneFormValidate.teamName)
              window.localStorage.setItem('getDescription', this.oneFormValidate.remarks)
              this.envList = response.data.data.envList
              this.accountId = response.data.data.accountId
              this.dataType = this.typeValue
              this.formType = this.dataType + 'Form'
              this.$refs[name].resetFields()
              this.step = 1
              this.stepStatus = 'success'
              this.addOredit = false
            } else if (response.data.status === 'fail') {
              this.$Message.error({
                background: 'error',
                content: response.data.message + '该账号已存在'
              })
            }
          })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.$Message.error('参数校验失败!')
        }
      })
    },
    /**
     * 第二步上一步
     */
    twoPrevFunc(status) {
      this.step = 0
      this.stepStatus = status
      userFunc.removeAccouintIdApi(this.accountId).then(response => {
        if (response.data.status === 'ok') {
          this.oneFormValidate.type = parseInt(window.localStorage.getItem('getType'))
          this.oneFormValidate.colony = parseInt(window.localStorage.getItem('getColony'))
          this.oneFormValidate.username = window.localStorage.getItem('getUser')
          this.oneFormValidate.teamName = parseInt(window.localStorage.getItem('getTeam'))
          this.oneFormValidate.remarks = window.localStorage.getItem('getDescription')
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    // 编辑账号信息
    editAccountFunc(row) {
      this.superEditAccountId = row.row.id
      this.oneFormValidate.type = parseInt(row.row.categoryAccountId)
      this.oneFormValidate.colony = parseInt(row.row.clusterId)
      this.oneFormValidate.username = row.row.name
      this.oneFormValidate.teamName = parseInt(row.row.teamId)
      this.oneFormValidate.remarks = row.row.description
      this.addOredit = true
      this.modal1 = true
      this.step = 0
    },
    // 编辑确定
    editAccountOkFunc(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const getEnvList = {
            name: this.oneFormValidate.username,
            description: this.oneFormValidate.remarks
          }
          userFunc.editAccountInfoApi(this.superEditAccountId, getEnvList).then((response) => {
            if (response.data.status === 'ok') {
              this.$refs[name].resetFields()
              this.step = 0
              this.modal1 = false
              this.oneFormValidate.username = ''
              this.oneFormValidate.remarks = ''
              this.$Message.success('编辑成功')
              this.getTableListDataFunc()
            } else if (response.data.status === 'fail') {
              this.$Message.error({
                background: 'error',
                content: '编辑失败'
              })
            }
          })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.$Message.error('参数校验失败!')
        }
      })
    },
    /**
     * 第二步确认
     */
    twoNextFunc() {
      this.modal1 = false
      this.step = 0
      this.stepStatus = status
      this.envList = []
      window.localStorage.removeItem('getType')
      window.localStorage.removeItem('getColony')
      window.localStorage.removeItem('getUser')
      window.localStorage.removeItem('getTeam')
      window.localStorage.removeItem('getDescription')
      this.oneRuleValidate.remarks = ''
      this.oneRuleValidate.userName = ''
      this.getTableListDataFunc()
    },
    /**
     * 批量添加
     */
    batchAdd() {
      this.modal2 = true
    },
    /**
     * 批量第一步取消
     */
    btachCancel(name) {
      this.modal2 = false
      this.$refs[name].resetFields()
    },
    /**
     * 批量下一步
     */
    batchNext(name) {
      let that = this
      this.$refs[name].validate(valid => {
        if (valid) {
          const batchFormObj = {
            clusterId: this.batchFormValidate.cluster,
            envId: this.batchFormValidate.environment,
            accountId: this.batchFormValidate.user,
            accountType: this.batchFormValidate.batchType,
            connId: this.batchFormValidate.connect

          }

          userFunc.batchGetAccountDataApi(batchFormObj).then(response => {
            if (response.data.status === 'ok') {
              const obj = response.data.data
              // this.batchData = [].concat(response.data.data)
              this.batchData = response.data.data
              // for (const i in obj) {
              //   this.batchData.push({ username: i, password: obj[i] })
              // }
              // this.$refs[name].resetFields()
              this.batchStep = 1
              this.batchStepStatus = 'success'
            } else {
              this.$Message.error(response.data.message)
            }
          })
        } else {
          this.$Message.error('参数校验失败!')
        }
      })
    },
    /**
     * 批量上一步
     */
    btachPrev(status) {
      this.batchStep = 0
      this.batchStepStatus = status
    },
    /**
     * 批量确定
     */
    batchOk() {
      const batchOkTableObj = {
        clusterId: this.batchFormValidate.cluster,
        envId: this.batchFormValidate.environment,
        teamId: this.batchFormValidate.batchTeamName,
        accountType: this.batchFormValidate.batchType,
        connId: this.batchFormValidate.connect,
        accountInfoQOS: JSON.stringify(this.batchData)
      }
      console.log('=========batchOkTableObj', batchOkTableObj)
      userFunc.batchAddAccountDataApi(batchOkTableObj).then(response => {
        if (response.data.status === 'ok') {
          this.batchStep = 0
          this.batchStepStatus = 'success'
          this.batchData = []
          this.getTableListDataFunc()
          this.$Message.success(response.data.message)
        } else {
          this.$Message.error(response.data.message)
        }
      })
    },
    /**
     * 删除账号
     */
    remove(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '你确定要删除吗？',
        onOk: () => {
          userFunc
            .removeAccouintIdApi(row.row.id)
            .then(response => {
              if (response.data.status === 'ok') {
                this.$Message.success(response.data.message)
                this.getTableListDataFunc()
              } else {
                this.$Message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消！')
        }
      })
    },
    /**
     * 用户密码环境编辑
     */
    evnEdit(row) {
      this.envList = []
      this.accountId = row.row.accountId
      this.envList.push(
        {
          authType: row.row.authType,
          id: row.row.envId,
          name: row.row.envName,
          userName: row.row.userName,
          password: row.row.password,
          fileList: row.row.fileList
        }
      )
      this.addOredit = true
      this.dataType = 'pwd'
      this.step = 1
      this.modal1 = true
    },
    /**
     * 用户密码文件环境编辑
     */
    evnUserPwdFileEdit(row) {
      this.envList = []
      this.accountId = row.row.accountId
      this.envList.push(
        {
          authType: row.row.authType,
          id: row.row.envId,
          name: row.row.envName,
          userName: row.row.userName,
          password: row.row.password
        }
      )
      this.addOredit = true
      this.dataType = 'userPwdFile'
      this.step = 1
      this.modal1 = true
    },
    /**
     * 单条用户密码取消后回调函数
     */
    oneUserPwdEditCancel() {
      this.step = 0
      this.modal1 = false
      this.envList = []
      this.dataType = ''
      this.addOredit = false
    },
    /**
     * 单条用户密码编辑后回调函数
     */
    oneUserPwdEditFinish() {
      this.step = 0
      this.modal1 = false
      this.envList = []
      this.dataType = ''
      this.$Message.success('编辑成功')
      this.addOredit = false
      this.getEnvTableListDataFunc()
    },
    /**
     * 删除环境
     */
    evnRemove(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '你确定要删除吗？',
        onOk: () => {
          const removeObj = {
            authType: row.row.authType
          }
          userFunc
            .removeEnvIdApi(row.row.id, removeObj)
            .then(response => {
              if (response.data.status === 'ok') {
                this.$Message.success(response.data.message)
                this.getEnvTableListDataFunc()
              } else if (response.data.status === 'fail') {
                this.$Message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消！')
        }
      })
    },
    // 下拉菜单获取团队
    getTeamDataFunc() {
      const teamObj = {
        pageSize: 10000,
        pageNum: 1,
        description: '',
        name: ''
      }
      userFunc
        .getTeamDataAai(teamObj)
        .then(response => {
          if (response.data.status === 'ok') {
            this.teamList = response.data.data.list
            this.batchTeamList = response.data.data.list
          }
        })
        .catch(error => {
          conisole.log(error)
        })
    },
    // 获取集群
    getClusterDataFunc() {
      const clusterObj = {
        pageSize: 10000,
        pageNum: 1,
        name: ''
      }
      userFunc
        .getClusterDataApi(clusterObj)
        .then(response => {
          if (response.data.status === 'ok') {
            this.clusterList = response.data.data.list
          }
        })
        .catch(error => {
          conisole.log(error)
        })
    },
    // 获取类型
    getTypeDataFunc() {
      const clusterObj = {
        name: ''
      }
      userFunc
        .getTypeDataApi(clusterObj)
        .then(response => {
          if (response.data.status === 'ok') {
            this.typeList = response.data.data
          }
        })
        .catch(error => {
          conisole.log(error)
        })
    },
    // 通过类型显示不同类型表单
    getMoreParams(params) {
      let typeNum = params.type
      if (typeNum === 0) {
        this.typeValue = 'pwd'
      } else if (typeNum === 1) {
        this.typeValue = 'file'
      } else if (typeNum === 2) {
        this.typeValue = 'userPwdFile'
      }
    },
    typeChange(params) { },
    getTableListDataFunc() {
      const allDataObj = {
        name: this.formSearch.username,
        clusterName: this.formSearch.clusterName,
        pageSize: this.size,
        pageNum: this.current
      }
      allDataObj.clusterName = allDataObj.clusterName || (this.$route.query && this.$route.query.name) || ''
      userFunc
        .getTableDataAai(allDataObj)
        .then(response => {
          if (response.data.status === 'ok') {
            this.tableData = response.data.data.list
            this.total = response.data.data.total
          } else {
            this.$Message.error(response.data.message)
            this.tableData = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSubmitSearch() {
      this.size = 10
      this.current = 1
      this.getTableListDataFunc()
    },
    pageChange(val) {
      this.current = val
      this.getTableListDataFunc()
    },
    sizeChange(val) {
      this.size = val
      this.getTableListDataFunc()
    },
    tablePageChange(val) {
      this.tableObj.current = val
      this.batchNext()
    },
    tableSizeChange(val) {
      this.tableObj.size = val
      this.batchNext()
    },
    getEnvTableListDataFunc(row) {
      if (row) {
        this.superEnvAccountId = row.row.id
      } else {
        this.superEnvAccountId = this.superEnvAccountId
      }
      const getTableEvnObj = {
        pageSize: this.envTableListObj.size,
        pageNum: this.envTableListObj.current,
        accountId: this.superEnvAccountId
      }
      userFunc.getTableEvnListApi(getTableEvnObj).then(response => {
        if (response.data.status === 'ok') {
          this.evnTableData = response.data.data.list
          this.envTableListObj.total = response.data.data.total
          if (row.row.categoryAccountType === '0') {
            this.showTable = '0'
          } else if (row.row.categoryAccountType === '1') {
            this.showTable = '1'
          } else if (row.row.categoryAccountType === '1') {
            this.showTable = '2'
          }
          this.lookModal = true
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    envTableListObjPageChange(val) {
      this.envTableListObj.current = val
      this.getEnvTableListDataFunc()
    },
    envTableListObjSizeChange(val) {
      this.envTableListObj.size = val
      this.getEnvTableListDataFunc()
    }
  },
  created() { },
  mounted() {
    this.getTableListDataFunc()
    this.getTeamDataFunc()
    this.getClusterDataFunc()
    this.getTypeDataFunc()
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
</style>
