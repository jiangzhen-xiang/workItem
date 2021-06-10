<template>
  <div>
    <Card>
      <Row>
        <i-col span="18">
          <Input v-model="form.name"
                 placeholder="采集端名称"
                 style="width: 25%;margin-right:10px" />
          <Select v-model="form.clusterId"
                  style="width: 25%;margin-right:10px"
                  placeholder="集群"
                  clearable>
            <Option v-for="(item,index) in clusterList"
                    :key="index"
                    :value="item.value">{{item.title}}</Option>
          </Select>
          <Button type="primary"
                  @click="searchClick">查询</Button>
        </i-col>
        <i-col span="6"
               style="text-align:right">
          <Button type="primary"
                  @click="addShow = true"
                  style="margin-left:10px">增加采集端</Button>
        </i-col>
      </Row>
      <!-- <headerSearch @searchClick='searchClick'
                  @btnClick='btnClick'
                  :headerTitle='headerTitle'></headerSearch> -->
      <h3>ogg采集端配置</h3>
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
import { queryAgentConfig, saveAgentConfig, updateAgentConfig, deleteAgentConfig, queryClusterConfigAll } from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInputT: [{
          models: 'clusterId',
          placeholder: '集群id'
        }, {
          models: 'clusterName',
          placeholder: '集群名称'
        }],
        titleInputB: [{
          models: 'name',
          placeholder: '采集端名称'
        }],
        titleBtn: ['增加采集端']
      },

      //集群下拉框数据
      clusterList: [],

      //表格数据
      tableTitle: [
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center",
        },
        {
          title: "采集端名称",
          key: "name",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "集群名称",
          key: "clusterName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "ogg版本",
          key: "oggVersion",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "源端Oracle编码",
          key: "oggCharset",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "安装目录（c/work）",
          key: "oggHome",
          minWidth: 130,
          align: "center",
          tooltip: true,
        },
        {
          title: "收集服务接口",
          key: "oggCollectUri",
          minWidth: 120,
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
            title: '采集端名称',
            filedEn: 'name',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '集群名称',
            filedEn: 'clusterId',
            type: 'select',
            selectedData: [],
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '源端Oracle编码',
            filedEn: 'oggCharset',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '安装目录',
            filedEn: 'oggHome',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '收集服务接口',
            filedEn: 'oggCollectUri',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'ogg版本',
            filedEn: 'oggVersion',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          }
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      },
      {
        title: '生成配置文件',
      }],

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //新增
      addShow: false,
      formList: [
        {
          title: '采集端名称',
          filedEn: 'name',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '集群名称',
          filedEn: 'clusterId',
          type: 'select',
          selectedData: [],
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '源端Oracle编码',
          filedEn: 'oggCharset',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '安装目录',
          filedEn: 'oggHome',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '收集服务接口',
          filedEn: 'oggCollectUri',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'ogg版本',
          filedEn: 'oggVersion',
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
  mounted () { },
  created () {
    this.initCluster()
    this.initClick()
  },
  methods: {
    // 查看（初始化）
    initClick () {
      let params = {
        name: this.form.name || '',
        clusterId: this.form.clusterId || '',
        clusterName: this.form.clusterName || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      // console.log(this.form, params, '查询')
      this.tableData = null
      queryAgentConfig(params).then(res => {
        // console.log(res, 'ogg采集端查询')
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        }
      })
    },

    // 集群下拉框数据
    initCluster () {
      queryClusterConfigAll().then((res) => {
        console.log(res, '集群')
        if (res.data.status == 1) {
          // let clusterList = res.data.data
          let clusterList = res.data.data.map(item => {
            return {
              title: item.name,
              value: item.id
            }
          })
          this.clusterList = clusterList

          let tableOperation = this.tableOperation.map((item) => {
            if (item.formList) {
              item.formList[1].selectedData = clusterList
            }
            return item
          })
          this.tableOperation = tableOperation

          let formList = this.formList.map((item, index) => {
            if (item.selectedData) {
              item.selectedData = clusterList
            }
            return item
          })
          this.formList = formList
        }
      })
    },

    // 顶部搜索
    searchClick (val) {
      // console.log(val)
      // this.form = val
      this.currentPage = 1
      this.initClick()
    },

    // 判断顶部事件
    btnClick (val) {
      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '增加采集端') {
        this.addShow = true
      }
    },

    // 新增
    addClick (val) {
      // console.log(val, 'xinzeng')
      this.addShow = false
      let params = val.data
      // console.log(params, '新增')
      if (val.status == 'ok') {
        saveAgentConfig(params).then(res => {
          // console.log(res, '新增采集端配置')
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
      let params = row.newData
      params.id = row.oldData.id
      // console.log(params, '编辑')
      updateAgentConfig(params).then(res => {
        // console.log(res, '编辑采集端配置')
        console.log(res,"wwwwwwwwwwwwwwwwwww");
        
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
      if (row.boolean) {
        let params = {
          id: this.tableData[row.index].id
        }
        // console.log(params, '删除')
        deleteAgentConfig(params).then(res => {
          // console.log(res, '删除采集端配置')
          if (res.data.status == 1) {
            this.initClick()
            this.$Message.info(res.data.message)
          } else {
            this.$Message.error(res.data.message)
          }
        })
      }
    },

    // 表格其他点击事件(生成配置文件，暂无接口)
    otherClick (row) {
      console.log(row)
      // let params = {
      //   id: this.tableData[row.index].id
      // }
      // saveTargetProcessGenerateScript(params).then(res => {
      //   console.log(res)
      //   const link = document.createElement('a');
      //   let blob = new Blob([res.data], { type: res.data.type });
      //   link.style.display = 'none';
      //   link.href = URL.createObjectURL(blob);
      //   link.download = 'response.txt';
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      // })
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
</style>