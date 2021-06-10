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
                  @otherClick="otherClick"></TableNew>
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

    <!-- 预览 -->
    <Modal title="预览"
           v-model="previewShow"
           :mask-closable="false"
           @on-cancel="previewCancel"
           width="1000">
      <div>
        <Table :loading="previewTableLoading"
               :height="previewTableHeight"
               stripe
               :columns="previewTableTitle"
               :data="previewTableData">
          <template slot-scope="{row}"
                    slot="permissionType">
            <span v-if="row.permissionType == 'R'">读权限</span>
            <span v-else-if="row.permissionType == 'W'">写权限</span>
          </template>
          <template slot-scope="{row}"
                    slot="operationType">
            <span v-if="row.operationType == '1'">创建topic</span>
            <span v-else-if="row.operationType == '2'">给topic授权</span>
            <span v-else-if="row.operationType == '3'">给groupId授权</span>
          </template>
        </Table>
        <Page show-total
              style="text-align:right;margin-top:10px;"
              :total="previewTotalPage"
              :page-size="previewPageSize"
              :current="previewCurrentPage"
              show-elevator
              show-sizer
              @on-change="previewPageChange"
              @on-page-size-change="previewOnPageSize" />
      </div>
      <div slot="footer">
        <Button type="info"
                @click="previewCancel">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
// import headerSearch from '@/components/tableNewC/headerSearch'
// import TableNew from '@/components/tableNewC/TableNew'
// import TableInset from '@/components/tableNewC/TableInset'
import HeaderSearch from '../common/HeaderSearch'
import TableNew from '../common/TableNew'
import TableInset from '../common/TableInset'
import {
  grant,
  postGrant,
  preGrant,
  queryApplicationForm,
  previewApplicationForm
} from '@/api/kafkaApply.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {
      },
      headerTitle: {
        titleInput: [{
          models: 'fileName',
          placeholder: '文件名称',
        },
        {
          models: 'startDate',
          placeholder: '开始时间',
          type: 'datetime'
        }, {
          models: 'endDate',
          placeholder: '结束时间',
          type: 'datetime'
        }],
        titleBtn: ['操作前校验', '操作后校验', '批量授权']
      },

      //表格数据
      tableTitle: [
        {
          type: "selection",
          width: 55,
          align: "center"
        },
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center",
        },
        {
          title: "文件名称",
          key: "fileName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "上传时间",
          key: "uploadDate",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },{
          title: "状态",
          key: "statusDict",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "操作",
          slot: "operationBtn",
          align: "center",
          width: 150,
        }
      ],
      tableData: [],
      tableOperation: [{
        title: '授权',
      },
      {
        title: '操作前校验',
      },
      {
        title: '操作后校验',
      },
      {
        title: '预览',
      }],
      selectArr: [],
      clearSelectArr: false,

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页


      //预览
      previewShow: false,
      previewTableTitle: [                      // tab表头
        {
          title: "序号",
          type: 'index',
          width: 50,
          align: "center",
        },
        {
          title: "集群简称",
          key: "cluster",
          minWidth: 100,
          align: "center"
        },
        {
          title: "topic名称",
          key: "topicName",
          minWidth: 150,
          align: "center"
        },
        {
          title: "topic分区数",
          key: "topicCount",
          minWidth: 80,
          align: "center"
        },
        {
          title: "用户",
          key: "userName",
          minWidth: 80,
          align: "center"
        },
        {
          title: "groupId",
          key: "groupId",
          minWidth: 180,
          align: "center"
        },
        {
          title: "操作类型",
          slot: "operationType",
          minWidth: 120,
          align: "center"
        },
        {
          title: "权限类型",
          slot: "permissionType",
          minWidth: 80,
          align: "center"
        },{
          title: "保存时长（天）",
          key: "retentionDay",
          minWidth: 80,
          align: "center"
        },
        {
          title: "状态",
          key: "statusDict",
          minWidth: 140,
          align: "center"
        },
        {
          title: "操作结果",
          key: "operationResult",
          minWidth: 180,
          align: "center"
        },
        {
          title: "最后操作时间",
          key: "operationTime",
          minWidth: 150,
          align: "center"
        }
      ],
      previewTableData: [],                     // tab数据
      previewTableLoading: false,               // tab加载
      previewTableHeight: 350,                  // tab高度
      previewTotalPage: 0,                      // 分页数据总数
      previewPageSize: 10,                      // 分页每页数据量
      previewCurrentPage: 1,                    // 分页第几页
      previewId: '',                             // 预览数据id

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
  methods: {
    // 查看（初始化）
    initClick () {
      //时间选择器问题，要加clearabled
      console.log(this.form)
      // 接口参数，参数若无值，传则报错
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }
      if (this.form.fileName) {
        params.fileName = this.form.fileName
      }
      if (this.form.startDate != '' && this.form.startDate != undefined) {
        params.startDate = this.form.startDate
      }
      if (this.form.endDate != '' && this.form.endDate != undefined) {
        params.endDate = this.form.endDate
      }
      this.tableData = null
      queryApplicationForm(params).then(res => {
        // console.log(res, '抽取表查看')
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
      console.log(val)
      val.endDate=this.$timeFormat(new Date(val.endDate).getTime(),"yyyy-MM-dd HH:mm:ss");
      val.startDate=this.$timeFormat(new Date(val.startDate).getTime(),"yyyy-MM-dd HH:mm:ss");
      this.form = val;
      this.initClick()
    },

    // 判断顶部事件（分类）
    btnClick (val) {
      if (this.selectArr.length <= 0) {
        this.$Message.info('请选中数据')
        return false
      }

      let selectArr = this.selectArr.map(item => {
        return item.id
      })
      let params = {
        id: selectArr.join(',')
      }

      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '操作前校验') {
        this.beforeCheck(params)
      }

      if (val.type == '操作后校验') {
        this.afterCheck(params)
      }

      if (val.type == '批量授权') {
        this.authorization(params)
      }
    },

    // 判断表格事件（分类）
    otherClick (row) {
      let params = {
        id: this.tableData[row.index].id
      }

      if (row.type == '授权') {
        this.authorization(params)
      }

      if (row.type == '操作前校验') {
        this.beforeCheck(params)
      }

      if (row.type == '操作后校验') {
        this.afterCheck(params)
      }

      if (row.type == '预览') {
        this.previewShow = true
        this.previewId = this.tableData[row.index].id
        this.getPreviewData()
      }

      if (row.type == '导出') {
        this.handlerImport(params)
      }
    },

    //表格多选
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

    // 预览数据初始化
    getPreviewData () {
      // 切换分页的时候参数和首次调用的参数怎么处理
      let params = {
        pageNum: this.previewCurrentPage,
        pageSize: this.previewPageSize,
        id: this.previewId
      }
      this.previewTableLoading = true;
      previewApplicationForm(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.previewTableLoading = false
          this.previewTableData = res.data.data.list
          this.previewTotalPage = res.data.data.total
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 预览-关闭
    previewCancel () {
      this.previewShow = false;
      this.previewPageSize = 10;
      this.previewCurrentPage = 1;
      this.previewTableData = [];
    },
    // 预览-当前点击页
    previewPageChange (val) {
      this.previewCurrentPage = val;
      this.getPreviewData();
    },
    // 预览-切换当前显示条数
    previewOnPageSize (val) {
      this.previewCurrentPage = 1;
      this.previewPageSize = val;
      this.getPreviewData();
    },

    // 操作前校验
    beforeCheck (params) {
      preGrant(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.data)
        }

        this.initClick()
        // queryApplicationForm(this.form).then(res => {
        //   // console.log(res, '抽取表查看')
        //   if (res.data.status == 1) {
        //     this.tableData = res.data.data.list
        //     this.totalNum = res.data.data.total
        //   } else {
        //     this.tableData = null
        //   }
        // })
      })
    },
    //授权
    authorization (params) {
      grant(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.data)
        }
        this.initClick()

        // queryApplicationForm(this.form).then(res => {
        //   // console.log(res, '抽取表查看')
        //   if (res.data.status == 1) {
        //     this.tableData = res.data.data.list
        //     this.totalNum = res.data.data.total
        //   } else {
        //     this.tableData = null
        //   }
        // })
      })
    },
    //操作后校验
    afterCheck (params) {
      postGrant(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.data)
        }
        this.initClick()

        // queryApplicationForm(this.form).then(res => {
        //   // console.log(res, '抽取表查看')
        //   if (res.data.status == 1) {
        //     this.tableData = res.data.data.list
        //     this.totalNum = res.data.data.total
        //   } else {
        //     this.tableData = null
        //   }
        // })
      })
    },
    //导出
    handlerImport (params) { }
  }
}
</script>

<style lang="less" scoped>
.process_content {
  width: 100%;
}
</style>
