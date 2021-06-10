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
              @on-page-size-change="onPageSize" />
      </div>
    </Card>

  </div>
</template>

<script>
import HeaderSearch from '../common/HeaderSearch'
import TableNew from '../common/TableNew'
import TableInset from '../common/TableInset'
import { kafkaConstants } from './constants/kafkaConstants'
import {
  queryApplicationFormHistory
} from '@/api/kafkaApply.js'
export default {
  data () {
    return {
      // 顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInput: [{
          models: 'cluster',
          placeholder: '集群简称'
        }, {
          models: 'topicName',
          placeholder: 'topic名称'
        }, {
          models: 'groupId',
          placeholder: 'groupId'
        }, {
          models: 'userName',
          placeholder: '用户名'
        }, {
          models: 'operationType',
          placeholder: '操作类型',
          options: kafkaConstants.operationTypeOptions,
          type: 'select'
        }, {
          models: 'status',
          placeholder: '执行状态',
          options: kafkaConstants.formStateOptions,
          type: 'select'
        }, {
          models: 'startDate',
          placeholder: '开始时间',
          type: 'datetime'
        }, {
          models: 'endDate',
          placeholder: '结束时间',
          type: 'datetime'
        }]
      },

      // 表格数据
      tableTitle: [
        {
          title: '序号',
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '集群简称',
          key: 'cluster',
          minWidth: 100,
          align: 'center'
        },
        {
          title: 'topic名称',
          key: 'topicName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: 'topic分区数',
          key: 'topicCount',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '用户',
          key: 'userName',
          minWidth: 80,
          align: 'center'
        },
        {
          title: 'groupId',
          key: 'groupId',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '操作类型',
          key: 'operationType',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '权限类型',
          key: 'permissionType',
          minWidth: 80,
          align: 'center'
        }, {
          title: '保存时长（天）',
          key: 'retentionDay',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '状态',
          key: 'statusDict',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '操作结果',
          key: 'operationResult',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '最后操作时间',
          key: 'operationTime',
          minWidth: 150,
          align: 'center'
        }
      ],
      tableData: [],

      // 分页数据
      totalNum: 0, // 分页数据总数
      pageSize: 10, // 分页每页数据量
      currentPage: 1 // 分页第几页

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
    // console.log(111)
  },
  methods: {
    // 查看（初始化）
    initClick () {
      // console.log(this.form)
      let params = {
        cluster: this.form.cluster || '',
        topic: this.form.topicName || '',
        groupId: this.form.groupId || '',
        userName: this.form.userName || '',
        operationType: this.form.operationType,
        status: this.form.status,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.form.startDate != '' && this.form.startDate != undefined) {
        params.startDate = this.form.startDate
      }
      if (this.form.endDate != '' && this.form.endDate != undefined) {
        params.endDate = this.form.endDate
      }
      this.tableData = null
      queryApplicationFormHistory(params).then(res => {
        console.log(res, '操作历史查询')
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        } else {
          this.tableData = null
        }
      })
    },

    // 顶部搜索
    searchClick (val) {
      console.log(val, 11111)
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

    // 切换每页条数
    onPageSize (val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.initClick()
    }

  },
  watch: {
    currentPage: function () {
      this.initClick()
    },
    pageSize: function () {
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
