
<style lang="less">
@import "../excel/common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:34px;">
            <Form ref="formSearch" :model="formSearch" :rules="ruleValidate" inline >
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
                <Icon  type="ios-ios-plus" />增加集群
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table :loading="loading" :columns="tableTitle"  tooltip-theme="dark" :data="tableData" border :height="tableHeight">
              <template slot-scope="{ row,index }" slot="name">
                    <Tooltip :content="row.name" placement="top-start">
                      <Button type="text" @click="handleGoEnv(row)">{{row.name}}</Button>
                    </Tooltip>
                </template>
                <template slot-scope="{ row }" slot="environment">
                    <Select v-model="row.defaultEnv" prop="defaultEnv" transfer placeholder="环境"  transfer size="small" >
                         <Option v-for="(item,index) in row.envVOList" :value="item.id.toString()" :label="item.name" >{{item.name}} </Option>
                    </Select>
                </template>
                <template slot-scope="{ row }" slot="envNu">
                   <span> {{ row.envVOList.length?row.envVOList.length:'-' }}</span>
                </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="total" show-total show-elevator :current ="current" :page-size="pageSize" size="small" @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal v-model="modalColony" title="增加集群" footer-hide>
      <div class="formWrapper">
          <colonyForm  @handleSuccess="handleColonyAdd" :index="index" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalEditorColony" title="编辑集群" footer-hide>
      <div class="formWrapper">
          <colonyEditorForm  ref="colonyEditorForm" @handleSuccess="handleColonyEditor" :row="curCluster" @handleCancel="handleCancel"/>
      </div>
    </Modal>
    <Modal v-model="modalRowEnvironment" title="增加环境" footer-hide>
      <div class="formWrapper">
          <rowenvironmentForm  @handleSuccess="handleRowEnvironmentAdd" @handleCancel="handleCancel" :index = "index" :curColony="curColony"/>
      </div>
    </Modal>

    <!-- <Modal v-model="modal1" title="增加服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalForm"
          @handleSuccess="handleSuccessModal"
          @handleFail="handleFailModal"
          :is="zjName"
        ></component>
      </div>
    </Modal> -->
    <!-- <Modal v-model="modal2" title="编辑服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalFormEditor"
          @handleSuccessEditor="handleSuccessModalEditor"
          @handleFail="handleFailModalEditor"
          :is="zjNameEditor"
        ></component>
      </div>
    </Modal> -->
  </div>
</template>
<script>
import excel from '@/libs/excel'
import colonyForm from './components/colonyForm'
import colonyEditorForm from './components/colonyEditorForm'
import rowenvironmentForm from './components/rowEnvironmentForm'
import { ajaxGetCluster, ajaxDeleteCluster, ajaxSetDefaultClusterEnv } from '@/api/link.js'
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
          minWidth: 160,
          eclipse: true,
          tooltip: true,
          slot: 'name'
          // render: (h, params) => {
          //   return h('div', [
          //     h(
          //       'Button',
          //       {
          //         props: {
          //           type: 'text',
          //           size: 'small'
          //         },
          //         on: {
          //           click: () => {
          //             this.$router.push({
          //               path: 'environment',
          //               query: params.row
          //             })
          //           }
          //         }
          //       },
          //       params.row.name
          //     )
          //   ])
          // }
        },
        {
          title: '默认运行环境',
          key: 'environment',
          minWidth: 160,
          eclipse: true,
          tooltip: true,
          slot: 'environment'
        },
        {
          title: '类型',
          key: 'clusterType',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: '环境',
          key: 'envNu',
          minWidth: 80,
          eclipse: true,
          tooltip: true,
          slot: 'envNu'
        },

        {
          title: '连接',
          key: 'conNu',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: '账号',
          key: 'accNu',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },
        {
          title: '备注',
          key: 'description',
          minWidth: 80,
          eclipse: true,
          tooltip: true

        },

        {
          title: '操作',
          key: 'action',
          minWidth: 440,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      if (!params.row.defaultEnv) {
                        this.$Message.warning('请先选择默认运行环境')
                        return
                      }
                      this.loading = true
                      ajaxSetDefaultClusterEnv(params.row).then(res => {
                        this.loading = false
                        if (res.data.status == 'ok') {
                          this.$Message.success('设置默认运行环境成功')
                          // this.$set(this.tableData, index, params.row)
                          this.getColonyArr()
                        } else {
                          this.$Message.error('设置默认运行环境失败')
                        }
                      }).catch(err => {
                        this.loading = false
                        this.$Message.error('与服务器通信失败')
                      })

                      // params.row.curEnvironment = params.row.environment
                    }
                  }
                },
                '设置默认运行环境'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: 'link',
                        query: params.row
                      })
                    }
                  }
                },
                '查看连接'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        path: 'user',
                        query: params.row
                      })
                    }
                  }
                },
                '查看账号'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modalShow('modalEditorColony')
                      this.$nextTick(() => {
                        for (let k in this.$refs.colonyEditorForm.formValidate) {
                          this.$refs.colonyEditorForm.formValidate[k] = params.row[k]
                          this.$refs.colonyEditorForm.formEditorValidate[k] = params.row[k]
                        }
                        this.$refs.colonyEditorForm.formValidate['typeId'] = params.row['typeId'].toString()
                        this.$refs.colonyEditorForm.formEditorValidate['typeId'] = params.row['typeId'].toString()
                      })
                    }
                  }
                },
                '编辑'
              ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'success',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.curColony = JSON.stringify(params.row)
              //         this.index = +params.index + (this.current - 1) * this.pageSize
              //         this.modalRowEnvironment = true
              //       }
              //     }
              //   },
              //   '增加环境'
              // ),
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
                          // this.tableData.splice(
                          //   +params.index + this.size * (this.current - 1),
                          //   1
                          // )

                          let index = +params.index + (this.current - 1) * this.pageSize
                          this.handleDeleteEnvironment(index, params)
                          this.$Modal.remove()
                          this.modal1 = false
                        }
                      })
                    }
                  }
                },
                '删除集群'
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
    rowenvironmentForm

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
      this.loading = true
      ajaxGetCluster(postData).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
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
.ivu-drawer-close{
    left: -15px;
    background: #fff;
    top: 50%;
    width: 30px;
    border-radius: 50%;
    margin-top: -25px;
}
</style>
<style lang="less" scoped>

.borderWrapper{
  border-radius:10px;
  overflow:hidden;
  background:#fff8f5;
  border: 1px solid #ddd;
    box-shadow: 2px 4px 4px rgba(221,221,221,.8);
.iconWrapper {
  height:90px;
  svg{
  font-size:48px;
  margin-top:16px;
}

}
.f5bc08{
  background: #f5bc08;

}
.ce634e{
   background: #ce634e;
}
.ed4a2{
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
  font-size:16px;
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
