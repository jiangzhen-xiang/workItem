<template>
  <div class="sysManage">
    <Card>
      <headerSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></headerSearch>
      <h3>源系统管理</h3>
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  @deleteClick="deleteClick"
                  @editorClick="editorClick"></TableNew>
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
  querySourceSystemConfig,
  saveSourceSystemConfig,
  updateSourceSystemConfig,
  deleteSourceSystemConfig
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInputT: [{
          models: 'name',
          placeholder: '源系统名称'
        }, {
          models: 'abbreviation',
          placeholder: '源系统简称'
        }],
        titleInputB: [{
          models: 'databaseSchema',
          placeholder: '源系统schema'
        }],
        titleBtn: ['增加源系统']
      },

      //表格数据
      tableTitle: [
        // {
        //   type: "selection",
        //   width: 55,
        //   align: "center"
        // },
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center",
        },
        {
          title: "源系统名称",
          key: "sourceSystemName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "源系统简称",
          key: "sourceSystemAbbreviation",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "源系统SCHEMA",
          key: "sourceDatabaseName",
          align: "center",
          minWidth: 100,
          tooltip: true,

        },
        {
          title: "Oracel字符集",
          key: "sourceOracleCharset",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "Ogg源端版本",
          key: "sourceOggVersion",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        // {
        //   title: "创建时间",
        //   key: "createDate",
        //   minWidth: 100,
        //   align: "center",
        //   tooltip: true,
        // },
        {
          title: "操作",
          slot: "operationBtn",
          align: "center",
          width: 150,
        }
      ],
      tableData: [],
      tableOperation: [{
        title: '编辑',
        clickBtn: 'editorTab',
        formList: [
          {
            title: '源系统名称',
            filedEn: 'sourceSystemName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '源系统简称',
            filedEn: 'sourceSystemAbbreviation',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '源系统SCHEMA',
            filedEn: 'sourceDatabaseName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'Oracel字符集',
            filedEn: 'sourceOracleCharset',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'Ogg源端版本',
            filedEn: 'sourceOggVersion',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          // {
          //   title: '创建时间',
          //   filedEn: 'createDate',
          //   type: 'date',
          //   isVerify: true,
          //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'change', pattern: /.+/ }]
          // }
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      }],

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //新增
      addShow: false,
      formList: [
        {
          title: '源系统名称',
          filedEn: 'sourceSystemName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '源系统简称',
          filedEn: 'sourceSystemAbbreviation',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '源系统SCHEMA',
          filedEn: 'sourceDatabaseName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'Oracel字符集',
          filedEn: 'sourceOracleCharset',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'OGG源端版本',
          filedEn: 'sourceOggVersion',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        // {
        //   title: '创建时间',
        //   filedEn: 'createDate',
        //   type: 'date',
        //   isVerify: true,
        //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'change', pattern: /.+/ }]
        // }
      ]
    }
  },
  components: {
    headerSearch,
    TableNew,
    TableInset
  },
  mounted () { },
  created () {
    this.initClick()
  },
  methods: {
    // 查看（初始化）
    initClick () {
      let params = {
        name: this.form.name || '',
        abbreviation: this.form.abbreviation || '',
        databaseSchema: this.form.databaseSchema || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableData = null
      querySourceSystemConfig(params).then(res => {
        console.log(res, '源系统管理查询')
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        }
      })
    },

    // 顶部搜索
    searchClick (val) {
      this.form = val
      this.initClick()
    },

    // 判断顶部事件
    btnClick (val) {
      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '增加源系统') {
        this.addShow = true
      }
    },

    // 新增
    addClick (val) {
      // console.log(val, 'xinzeng')
      this.addShow = false
      if (val.status == 'ok') {
        let params = val.data
        // console.log(params, '新增')
        saveSourceSystemConfig(params).then(res => {
          // console.log(res, '源系统新增')
          if (res.data.status == 1) {
            this.initClick()
            this.$Message.info({
              content: res.data.message,
              duration: 4
            });
          } else {
            this.$Message.error({
              content: res.data.message,
              duration: 4
            });
          }
        })
      }
    },

    // 编辑
    editorClick (row) {
      // console.log(row)
      let params = row.newData
      params.id = row.oldData.id
      updateSourceSystemConfig(params).then(res => {
        // console.log(res, '编辑源系统')
        if (res.data.status == 1) {
          this.initClick()
          this.$Message.info({
            content: res.data.message,
            duration: 4
          });
        } else {
          this.$Message.error({
            content: res.data.message,
            duration: 4
          });
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
        // console.log(params, '删除')
        deleteSourceSystemConfig(params).then(res => {
          console.log(res, '删除源系统')
          if (res.data.status == 1) {
            this.initClick()
            this.$Message.info(res.data.message)
          } else {
            this.$Message.error(res.data.message)
          }
        })
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
    }
  }
}
</script>

<style lang="less" scoped>
.sysManage {
  width: 100%;
  // min-width: 650px;
}
h3 {
  margin: 10px 0;
}
.process_content {
  width: 100%;
}
</style>