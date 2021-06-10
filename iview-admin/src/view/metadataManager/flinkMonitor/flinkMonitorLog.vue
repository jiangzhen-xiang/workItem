<template>
  <div style="min-width: 720px;">
    <Card>
      <HeaderSearch @searchClick='searchClick'
                    :headerTitle='headerTitle'></HeaderSearch>
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"></TableNew>
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
    <Spin size="large"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>

<script>
import HeaderSearch from '../common/HeaderSearch'
import TableNew from '../common/TableNew'
import { flinkConstants } from './constants/flinkConstants'
import { getLog } from '@/api/flinkMonitor'

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
        },
        {
          models: 'startDate',
          placeholder: '开始时间',
          type: 'datetime'
        },
        {
          models: 'endDate',
          placeholder: '结束时间',
          type: 'datetime'
        }
        ]
      },

      // 表格数据
      tableTitle: [
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
          key: 'serviceName',
          align: 'center',
          minWidth: 55
        }, {
          title: '应用程序',
          key: 'applicationName',
          align: 'center',
          minWidth: 180
        },
        {
          title: '所属用户',
          key: 'userName',
          align: 'center',
          minWidth: 55
        },
        {
          title: '用户组',
          key: 'userQueue',
          align: 'center',
          minWidth: 55
        },
        {
          title: '应用状态',
          key: 'appState',
          align: 'center',
          minWidth: 55
        },
        {
          title: '告警类型',
          key: 'alarmType',
          align: 'center',
          minWidth: 55
        },
        {
          title: '事件名称',
          key: 'eventName',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '事件等级',
          key: 'eventLevel',
          align: 'center',
          minWidth: 55
        },
        {
          title: '事件描述',
          key: 'eventDescription',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '发生时间',
          key: 'createTime',
          align: 'center',
          minWidth: 100,
          tooltip: true
        }
      ],
      tableData: [],

      // 分页数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,

      // 全屏刷新
      spinShow: false
    }
  },
  components: {
    HeaderSearch,
    TableNew
  },
  mounted () {

  },
  created () {
    this.initClick()
  },
  computed: {
  },
  methods: {
    // 查看（初始化）
    initClick () {
      // 接口参数，参数若无值，传则报错
      this.form.pageNum = this.currentPage
      this.form.pageSize = this.pageSize
      this.tableData = null
      getLog(this.form).then(res => {
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
    }
  }
}
</script>

<style lang="less" scoped>
.process_content {
  width: 100%;
}
</style>
