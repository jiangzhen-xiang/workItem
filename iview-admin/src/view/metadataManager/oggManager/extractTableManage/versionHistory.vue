<template>
  <div>
    <Card>
      <div class="titleBox">
        <h3 class="titleFlex">当前表名称：{{tableName}}</h3>
        <div>
          <Button type="primary"
                  @click="contrastClick"
                  :disabled="selectArr.length == 2? false:true">对比</Button>
          &nbsp;
          <Button @click="goBack">&lt;&lt;</Button>
        </div>
      </div>
      <!-- <h3>当前表名称：{{tableName}}</h3>
      <div class="titleBox">
        <div class="titleFlex">
          <Input v-model="form.start"
                 placeholder="开始上线时间"
                 style="width: 25%;margin-right:20px" />
          <Input v-model="form.end"
                 placeholder="结束上线时间"
                 style="width: 25%;margin-right:20px" />
      <Button type="primary"
              @click="search">查询</Button>
      &nbsp;
      <Button type="primary"
              @click="contrastClick"
              :disabled="selectArr.length == 2? false:true">对比</Button>

  </div>
  <Button @click="goBack">&lt;&lt;</Button>
  </div> -->
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  @selectCheck="selectCheck"
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
    <!-- 对比弹框 -->
    <Modal title="对比"
           v-model="contrastShow"
           :mask-closable="false"
           width="800">
      <div class="contrastBox">
        <div style="margin-right:10px">
          <Select v-model="formValidate.start"
                  placeholder="请选择..."
                  style="margin-bottom:10px">
            <Option v-for="(item1,index1) in selectedData"
                    :key="index1"
                    :value="item1.value">{{item1.title}}</Option>
          </Select>
          <Table stripe
                 :data="fileDataS"
                 :columns="fileTitle"
                 :height="fileHeight"
                 :loading="tableLoading">
          </Table>
          <!-- <Page style="text-align:right;margin-top:10px;"
                :total="totalNum"
                :current="currentPage"
                simple
                @on-change="pageChange" /> -->
        </div>
        <div>
          <Select v-model="formValidate.end"
                  placeholder="请选择..."
                  style="margin-bottom:10px">
            <Option v-for="(item1,index1) in selectedData"
                    :key="index1"
                    :value="item1.value">{{item1.title}}</Option>
          </Select>
          <Table stripe
                 :data="fileDataE"
                 :columns="fileTitle"
                 :height="fileHeight"
                 :loading="tableLoading">
          </Table>
          <!-- <Page style="text-align:right;margin-top:10px;"
                :total="totalNum"
                :current="currentPage"
                simple
                @on-change="pageChange" /> -->
        </div>

      </div>
      <div slot="footer">
        <Button type="info"
                @click="initContrast">对比</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import headerSearch from '@/components/tableNewC/headerSearch'
import TableNew from '@/components/tableNewC/TableNew'
import TableInset from '@/components/tableNewC/TableInset'
import { getExtractTableDetailById, compare } from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {
        start: '',
        end: ''
      },
      headerTitle: {
        titleInputT: [{
          models: 'tableEn',
          placeholder: '表英文名'
        }, {
          models: 'sysName',
          placeholder: '源系统'
        }],
        titleInputB: [{
          models: 'tj1',
          placeholder: '条件1'
        }, {
          models: 'cxtj2',
          placeholder: '查询条件2'
        }],
        titleBtn: ['对比']
      },
      tableName: this.$route.query.name,

      //表格数据
      tableTitle: [
        {
          type: "selection",
          width: 55,
          align: "center"
        },
        // {
        //   title: "序号",
        //   type: 'index',
        //   width: 80,
        //   align: "center",
        // },
        {
          title: "表英文名",
          key: "abbreviation",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "源系统名称",
          key: "sourceSystemName",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "版本号",
          key: "version",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        // {
        //   title: "上线时间",
        //   key: "sxsj",
        //   minWidth: 100,
        //   align: "center",
        //   tooltip: true,
        // },
        {
          title: "更新时间",
          key: "lastModifyDate",
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
        title: '查看表结构',
        // url: 'tableStructure'
      }],

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //对比
      contrastShow: false,
      fileDataS: [],
      fileDataE: [],
      fileTitle: [
        {
          title: "序号",
          key: "serialNumber",
          align: "center",
          minWidth: 90,
          tooltip: true
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
      ],
      fileHeight: 370,
      tableLoading: false,
      selectedData: [],
      formValidate: {
        start: '',
        end: ''
      },
      selectArr: []
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
    this.initClick()
  },
  methods: {
    // 好像没有编辑删除，只有查询和对比
    // 对比限制选两个才可以点对比按钮，下拉框数据复选，
    // 查看（初始化）
    initClick () {
      console.log(this.$route.query)
      let params = {
        id: this.$route.query.id,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableData = null
      getExtractTableDetailById(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
          let selectedData = []
          this.tableData.forEach(item => {
            selectedData.push({
              value: item.id,
              title: item.version
            })
          })
          this.selectedData = selectedData
        } else {
          this.tableData = null
        }
      })
    },

    // 顶部搜索
    searchClick (val) {
      // console.log(val)
      this.form = val
      this.initClick()
    },

    // 对比数据（初始化）
    initContrast () {
      let params = {
        firstId: this.formValidate.start,
        secondId: this.formValidate.end,
      }
      this.tableLoading = true
      compare(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileDataS = res.data.data[this.formValidate.start]
          this.fileDataE = res.data.data[this.formValidate.end]
          console.log(this.fileDataS, this.fileDataE)
          this.tableLoading = false
        }
      })
    },

    // 对比
    contrastClick () {
      this.contrastShow = true
      let obj = {
        start: this.selectArr[0].id,
        end: this.selectArr[1].id
      }
      this.formValidate = obj
      this.initContrast()
    },

    //表格多选
    selectCheck (val) {
      console.log(val)
      this.selectArr = val.selectArr
      if (this.selectArr == '') {
        this.clearSelectArr = false
      }
    },

    // 编辑
    editorClick (row) {
      console.log(row)
      let params = row.newData
      params.id = row.oldData.id
      // updateSourceSystemConfig(params).then(res => {
      //   // console.log(res, '编辑源系统')
      //   if (res.data.status == 1) {
      //     this.initClick()
      //     this.$Message.info(res.data.message)
      //   } else {
      //     this.$Message.error(res.data.message)
      //   }
      // })
    },

    // 删除
    deleteClick (row) {
      console.log(row)
      if (row.boolean) {
        let params = {
          id: this.tableData[row.index].id
        }
        // console.log(params, '删除')
        // deleteSourceSystemConfig(params).then(res => {
        //   console.log(res, '删除源系统')
        //   if (res.data.status == 1) {
        //     this.initClick()
        //     this.$Message.info(res.data.message)
        //   } else {
        //     this.$Message.error(res.data.message)
        //   }
        // })
      }
    },

    // 表格其他点击事件
    otherClick (row) {
      console.log(row)
      if (row.type == '查看表结构') {
        this.$router.push({
          name: 'tableStructure',
          query: {
            "id": this.tableData[row.index].id,
            "name": this.tableData[row.index].name,
            "abbreviation": this.tableData[row.index].abbreviation,
            "from": 'version'
          }
        })
      }
    },

    //返回
    goBack () {
      this.$router.go(-1)
    },

    // 切换页面
    pageChange (val) {
      console.log(val)
    },

    // 切换页数
    onPageSize (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="less">
.titleBox {
  display: flex;
  align-items: center;
  .titleFlex {
    flex: 1;
    margin: 10px 0;
  }
}
.process_content {
  width: 100%;
}
.contrastBox {
  width: 100%;
  height: 400px;
  box-sizing: border-box;
  display: flex;
  > div {
    // flex: 1;
    width: 50%;
    .ivu-table-cell {
      padding-left: 3px;
      padding-right: 3px;
    }
  }
}
</style>
