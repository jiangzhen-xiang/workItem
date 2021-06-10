<template>
  <div>
    <Card>
      <h3>表结构信息</h3>
      <!-- <h3>表名：{{tableName}}</h3> -->
      <div class="title">
        <h3>表名：{{tableEnglishName+"-"+tableName}}</h3>
        <!-- <Button type="primary"
              @click="goBack"
              style="margin-left:10px">返回</Button> -->
        <Button @click="goBack">&lt;&lt;</Button>
      </div>
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  @deleteClick="deleteClick"
                  @editorClick="editorClick"
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
    <!-- 新增 -->
    <TableInset :tableInsertShow="addShow"
                :titleData="formList"
                @tableInsert="addClick"></TableInset>
  </div>
</template>

<script>
import headerSearch from '@/components/tableNewC/headerSearch'
import TableNew from '@/components/tableNewC/TableNew'
import TableInset from '@/components/tableNewC/TableInset'
import {
  queryExtractTableDetail,
  saveExtractTableDetail,
  updateExtractTableDetail,
  deleteExtractTableDetail,
  getHistoryDetail
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      //判断from路由，true是从抽取表页面，false是从版本页面
      isExtract: true,

      //表格数据
      tableTitle: [
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center",
        },
        {
          title: "字段中文名",
          key: "name",
          align: "center",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "字段英文名",
          key: "abbreviation",
          align: "center",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "类型",
          key: "columnType",
          align: "center",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "长度",
          key: "columnLength",
          align: "center",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "默认值",
          key: "defaultValue",
          align: "center",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "是否主键",
          key: "isPrimaryKey",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let text = '是'
            if (params.row.isPrimaryKey == 0) {
              text = '否'
            }
            return h(
              "span",
              text
            );
          }
        },
        {
          title: "是否为空",
          key: "isNullable",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let text = '是'
            if (params.row.isNullable == 0) {
              text = '否'
            }
            return h(
              "span",
              text
            );
          }
        },
        {
          title: "注释",
          key: "columnComment",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        // {
        //   title: "操作",
        //   slot: "operationBtn",
        //   align: "center",
        //   width: 150,
        // }
      ],
      tableData: [],
      tableOperation: [{
        title: '编辑',
        clickBtn: 'editorTab',
        formList: [
          {
            title: '字段中文名',
            filedEn: 'name',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '字段英文名',
            filedEn: 'abbreviation',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '类型',
            filedEn: 'columnType',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '长度',
            filedEn: 'columnLength',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '是否主键',
            filedEn: 'isPrimaryKey',
            type: 'select',
            selectedData: [{
              title: '是',
              value: 1
            }, {
              title: '否',
              value: 0
            }],
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '是否为空',
            filedEn: 'isNullable',
            type: 'select',
            selectedData: [{
              title: '是',
              value: 1
            }, {
              title: '否',
              value: 0
            }],
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '注释',
            filedEn: 'columnComment',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          }
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      }],

      tableName: this.$route.query.name,
      tableEnglishName: this.$route.query.abbreviation,

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //新增
      addShow: false,
      formList: [
        {
          title: '字段中文名',
          filedEn: 'name',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '字段英文名',
          filedEn: 'abbreviation',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '类型',
          filedEn: 'columnType',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '长度',
          filedEn: 'columnLength',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '是否主键',
          filedEn: 'isPrimaryKey',
          type: 'select',
          selectedData: [{
            title: '是',
            value: 1
          }, {
            title: '否',
            value: 0
          }],
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '是否为空',
          filedEn: 'isNullable',
          type: 'select',
          selectedData: [{
            title: '是',
            value: 1
          }, {
            title: '否',
            value: 0
          }],
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '注释',
          filedEn: 'columnComment',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        }
      ]
    }
  },
  components: {
    headerSearch,
    TableNew,
    TableInset
  },
  mounted () {

  },
  created () {
    if (this.$route.query.from && this.$route.query.from == 'version') {
      this.isExtract = false
    }
    this.initClick()

  },
  methods: {
    // 查看（初始化）
    initClick () {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.isExtract) {
        params.sourceTableId = this.$route.query.id
        this.tableData = null
        queryExtractTableDetail(params).then(res => {
          console.log(res)
          if (res.data.status == 1) {
            this.tableData = res.data.data.list
            this.totalNum = res.data.data.total
          } else {
            this.tableData = null
          }
        })
      } else {
        params.id = this.$route.query.id
        this.tableData = null
        getHistoryDetail(params).then(res => {
          console.log(res)
          if (res.data.status == 1) {
            this.tableData = res.data.data.list
            this.totalNum = res.data.data.total
          } else {
            this.tableData = null
          }
        })
      }

    },

    // 顶部搜索
    searchClick (val) {
      console.log(val)
      this.form = val
      this.initClick()
    },

    goBack () {
      this.$router.go(-1)
    },

    // 新增
    addClick (val) {
      console.log(val, 'xinzeng')
      this.addShow = false
      if (val.status == 'ok') {
        let params = val.data
        saveExtractTableDetail(params).then(res => {
          console.log(res)
          if (res.data.status == 1) {
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
      console.log(row)
      let params = row.newData
      params.id = row.oldData.id
      updateExtractTableDetail(params).then(res => {
        // console.log(res)
        if (res.data.status == 1) {
          this.initClick()
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },

    // 删除
    deleteClick (row) {
      console.log(row)
      if (row.boolean) {
        let params = {
          id: this.tableData[row.index].id
        }
        deleteExtractTableDetail(params).then(res => {
          // console.log(res)
          if (res.data.status == 1) {
            this.initClick()
            this.$Message.info(res.data.message)
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },

    // 表格其他点击事件
    otherClick (row) {
      console.log(row)
    },

    // 切换页面
    pageChange (val) {
      // console.log(val)
      this.currentPage = val
      this.initClick()
    },

    // 切换页数
    onPageSize (val) {
      // console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.initClick()
    }
  }
}
</script>

<style lang="less" scoped>
h3 {
  margin: 10px 0;
}
.process_content {
  width: 100%;
}
.title {
  display: flex;
  align-items: center;
  > h3 {
    flex: 1;
  }
}
</style>
