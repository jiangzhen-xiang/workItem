<template>
  <div style="min-width: 720px;">
    <Card>
      <HeaderSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></HeaderSearch>
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  :clearSelectArr="clearSelectArr"
                  @selectCheck="selectCheck"
                  @editorClick="editorClick"
                  @otherClick="otherClick"
                  @deleteClick="handleDelete"></TableNew>
        <Page show-total
              style="text-align:right;margin-top:10px;"
              :total="totalNum"
              :page-size="pageSize"
              :current="currentPage"
              show-elevator
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="onPageSize"/>
      </div>
    </Card>

    <!-- 新增页面 -->
    <TableInset :tableInsertShow="addShow"
                :titleData="formList"
                @tableInsert="addClick"></TableInset>

    <Spin size="large"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>

<script>
import HeaderSearch from '../common/HeaderSearch'
import TableNew from '../common/TableNew'
import TableInset from '../common/TableInset'
import { flinkConstants } from './constants/flinkConstants'

import {
  saveMonitorConfig,
  closeMonitorConfig,
  openMonitorConfig,
  getMonitorConfig,
  updateMonitorConfig,
  deleteMonitorConfig
} from '@/api/flinkMonitor'
import { saveSourceSystemConfig, updateSourceSystemConfig } from '@/api/oggManage'

export default {
  data () {
    return {
      form: {},
      headerTitle: {
        titleInput: [{
          models: 'applicationName',
          placeholder: '应用名称'
        }, {
          models: 'appState',
          placeholder: '运行状态',
          type: 'select',
          options: flinkConstants.stateOptions
        }, {
          models: 'projectTeam',
          placeholder: '所属项目组'
        }, {
          models: 'clusterName',
          placeholder: '运行集群',
          type: 'select',
          options: flinkConstants.clusterOptions
        }, {
          models: 'serviceType',
          placeholder: '服务类型',
          type: 'select',
          options: flinkConstants.serviceTypeOptions
        }, {
          models: 'monitorSwitch',
          placeholder: '是否监控',
          type: 'select',
          options: flinkConstants.switchOptions
        }, {
          models: 'startDate',
          placeholder: '开始时间',
          type: 'datetime'
        }, {
          models: 'endDate',
          placeholder: '结束时间',
          type: 'datetime'
        }],
        titleBtn: ['新增', '开启监控', '关闭监控']
      },

      // 表格数据
      // eslint-disable-next-line no-sparse-arrays
      tableTitle: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 55,
          align: 'center'
        },
        {
          title: '运行集群',
          key: 'clusterName',
          align: 'center',
          minWidth: 55
        },
        {
          title: '服务类型',
          key: 'serviceType',
          align: 'center',
          minWidth: 55
        },
        {
          title: '应用程序',
          key: 'applicationName',
          align: 'center',
          minWidth: 200
        },
        {
          title: '所属项目组',
          key: 'projectTeam',
          align: 'center',
          minWidth: 80
        },
        {
          title: '运行状态',
          key: 'appStateName',
          align: 'center',
          minWidth: 55
        },
        {
          title: '是否监控',
          key: 'monitorSwitchName',
          align: 'center',
          minWidth: 55
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth: 100
        },
        {
          title: '修改时间',
          key: 'modifyTime',
          align: 'center',
          minWidth: 110
        },
        {
          title: '操作',
          slot: 'operationBtn',
          align: 'center',
          width: 110
        }
      ],
      tableData: [],
      tableOperation: [{
        title: '编辑',
        clickBtn: 'editorTab',
        formList: [
          {
            title: '运行集群',
            filedEn: 'clusterName',
            type: 'select',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请选择运行集群', trigger: 'blur' }],
            selectedData: flinkConstants.clusterOptions
          },
          {
            title: '服务类型',
            filedEn: 'serviceType',
            type: 'select',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
            selectedData: flinkConstants.serviceTypeOptions
          },
          {
            title: '所属项目组',
            filedEn: 'projectTeam',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入所属项目组名称', trigger: 'blur' }]
          },
          {
            title: '应用程序',
            filedEn: 'applicationName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入应用程序名称', trigger: 'blur' }]
          },
          {
            title: '是否监控',
            filedEn: 'monitorSwitch',
            type: 'radio',
            radioData: flinkConstants.switchOptions,
            isVerify: true,
            ruleVerify: [{ required: true, trigger: 'blur' }]
          }
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      }],
      selectArr: [],
      clearSelectArr: false,

      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      // 全屏刷新
      spinShow: false,

      // 更新结果
      updateShow: false,
      updateText: '',
      updateForm: {},

      // 新增页面
      addShow: false,
      formList: [
        {
          title: '运行集群',
          filedEn: 'clusterName',
          type: 'select',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请选择运行集群', trigger: 'blur' }],
          selectedData: flinkConstants.clusterOptions
        },
        {
          title: '服务类型',
          filedEn: 'serviceType',
          type: 'select',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
          selectedData: flinkConstants.serviceTypeOptions
        },
        {
          title: '所属项目组',
          filedEn: 'projectTeam',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入所属项目组名称', trigger: 'blur' }]
        },
        {
          title: '应用程序',
          filedEn: 'applicationName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入应用程序名称', trigger: 'blur' }]
        },
        {
          title: '是否监控',
          filedEn: 'monitorSwitch',
          type: 'radio',
          radioData: flinkConstants.switchOptions,
          isVerify: true,
          ruleVerify: [{ required: true, trigger: 'blur' }]
        }
      ]
    }
  },
  components: {
    HeaderSearch,
    TableNew,
    TableInset
  },
  mounted () {

  },
  created () {
    this.initClick()
  },
  computed: {},
  methods: {
    // 查看（初始化）
    initClick () {
      this.form.pageNum = this.currentPage
      this.form.pageSize = this.pageSize

      getMonitorConfig(this.form).then(res => {
        if (res.data.status === 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        } else {
          this.tableData = null
        }
      })
    },

    // 顶部搜索
    searchClick (val) {
      val.endDate = this.$timeFormat(new Date(val.endDate).getTime(), 'yyyy-MM-dd HH:mm:ss')
      val.startDate = this.$timeFormat(new Date(val.startDate).getTime(), 'yyyy-MM-dd HH:mm:ss')
      this.form = val
      this.initClick()
    },

    // 判断顶部事件（分类）
    btnClick (val) {
      if (val.type === '新增') {
        this.addShow = true
      } else if (val.type === '开启监控') {
        this.openMonitor()
      } else if (val.type === '关闭监控') {
        this.closeMonitor()
      }
    },

    // 判断表格事件（分类）
    otherClick (row) {
      if (row.type === '更新') {
        this.uploadShow = true
        this.uploadText = '更新'
        this.$set(this.uploadFrom, 'id', this.tableData[row.index].id)
      }
    },

    // 表格多选
    selectCheck (val) {
      console.log(val)
      this.selectArr = val.selectArr
      if (this.selectArr == '') {
        this.clearSelectArr = false
      }
    },

    // 切换页面
    pageChange (val) {
      this.currentPage = val
      this.initClick()
    },

    // 切换页数
    onPageSize (val) {
      this.pageSize = val
      this.currentPage = 1
      this.initClick()
    },

    // 新增
    addClick (val) {
      this.addShow = false
      if (val.status === 'ok') {
        let params = val.data
        saveMonitorConfig(params).then(res => {
          if (res.data.status === 1) {
            this.initClick()
            this.$Message.info(res.data.message)
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },

    // 编辑
    editorClick (row) {
      // console.log(row)
      let params = row.newData
      updateMonitorConfig(params).then(res => {
        if (res.data.status === 1) {
          this.initClick()
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },

    // 删除
    handleDelete (val) {
      if (val.boolean) {
        deleteMonitorConfig({ applicationName: this.tableData[val.index].applicationName }).then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$Message.info(res.data.message)
            this.initClick()
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },

    // 开启监控
    openMonitor () {
      if (this.selectArr == '') {
        this.$Message.error('请选中数据')
        return
      }
      let str = ''
      this.selectArr.forEach((item, index) => {
        if (index == 0) {
          str += item.applicationName
        } else {
          str += ',' + item.applicationName
        }
      })
      let params = {
        applicationNames: str
      }
      this.clearSelectArr = true
      openMonitorConfig(params).then(res => {
        if (res.data.status === 1) {
          this.$Message.info(res.data.message)
          this.initClick()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    // 关闭监控
    closeMonitor () {
      if (this.selectArr == '') {
        this.$Message.error('请选中数据')
        return
      }
      let str = ''
      this.selectArr.forEach((item, index) => {
        if (index == 0) {
          str += item.applicationName
        } else {
          str += ',' + item.applicationName
        }
      })
      let params = {
        applicationNames: str
      }
      this.clearSelectArr = true
      closeMonitorConfig(params).then(res => {
        if (res.data.status === 1) {
          this.$Message.info(res.data.message)
          this.initClick()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.process_content {
  width: 100%;
}
</style>
