<template>
  <div class="sysManage">
    <Card>
      <headerSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></headerSearch>
      <h3>ogg目标端管理</h3>
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
  queryClusterConfig,
  saveClusterConfig,
  updateClusterConfig,
  deleteClusterConfig
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInputT: [{
          models: 'code',
          placeholder: '集群标识'
        }, {
          models: 'name',
          placeholder: '集群名称'
        }],
        titleInputB: [{
          models: 'serverName',
          placeholder: 'ogg目标端主机名称'
        }],
        titleBtn: ['增加ogg目标端']
      },

      //表格数据
      tableTitle: [
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center",
        },
        {
          title: "集群名称",
          key: "name",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "集群标识",
          key: "code",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "ogg目标端主机名称",
          key: "serverName",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        // {
        //   title: "ip",
        //   key: "ip",
        //   align: "center",
        //   minWidth: 100,
        //   tooltip: true,
        // },
        {
          title: "ssh端口号",
          key: "port",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: "ogg用户",
          key: "user",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: "ogg密码",
          key: "password",
          minWidth: 100,
          align: "center",
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
        title: '编辑',
        clickBtn: 'editorTab',
        formList: [
          {
            title: '集群标识',
            filedEn: 'code',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '集群名称',
            filedEn: 'name',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'ogg目标端主机名称',
            filedEn: 'serverName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          // {
          //   title: 'ip地址',
          //   filedEn: 'ip',
          //   type: 'input',
          //   isVerify: true,
          //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          // },
          {
            title: 'ssh端口号',
            filedEn: 'port',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'ogg用户',
            filedEn: 'user',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'ogg密码',
            filedEn: 'password',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }]
          }
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
          title: '集群标识',
          filedEn: 'code',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '集群名称',
          filedEn: 'name',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'ogg目标端主机名称',
          filedEn: 'serverName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        // {
        //   title: 'ip地址',
        //   filedEn: 'ip',
        //   type: 'input',
        //   isVerify: true,
        //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        // },
        {
          title: 'ssh端口号',
          filedEn: 'port',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'ogg用户',
          filedEn: 'user',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'ogg密码',
          filedEn: 'password',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }]
        }
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
        code: this.form.code || '',
        serverName: this.form.serverName || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }

      // console.log(params, '查询')
      this.tableData = null
      queryClusterConfig(params).then(res => {
        console.log(res, '源系统管理查询')
        if (res.status == 200) {
          res.data.data.list.map(item => {
            item.port = item.port.toString()
          })
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        } else {
          this.tableData = null
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
      if (val.type == '增加ogg目标端') {
        this.addShow = true
      }
    },

    // 新增
    addClick (val) {
      // console.log(val, 'xinzeng')
      this.addShow = false
      if (val.status == 'ok') {
        let params = val.data
        console.log(params, '新增')
        saveClusterConfig(params).then(res => {
          console.log(res, '源系统新增')
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
      // console.log(row)
      let params = row.newData
      params.id = row.oldData.id
      updateClusterConfig(params).then(res => {
        // console.log(res, '编辑源系统')
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
        // console.log(params, '删除')
        deleteClusterConfig(params).then(res => {
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