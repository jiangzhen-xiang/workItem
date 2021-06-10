<template>
  <div>
    <Card>
      <div class="detail_header">
        <Row>
          <i-col span="20">
            <!-- 进程名称： -->
            进程名称：{{titleName}}
          </i-col>
          <i-col span="4"
                 style="text-align:right">
            <Button @click="goBack">&lt;&lt;</Button>
          </i-col>
        </Row>
      </div>
      <div class="detail_echarts">
        <div class="echartsBox">
          <Row class="echartsBox_top">
            <i-col span="20">
              ogg运行状态
            </i-col>
            <i-col span="4"
                   style="text-align:right">
              <Button>查询</Button>
            </i-col>
          </Row>
          <div class="echarts"></div>
        </div>
        <!-- <div class="echartsBox">
        <Row class="echartsBox_top">
          <i-col span="20">
            ogg数据量统计
          </i-col>
          <i-col span="4"
                 style="text-align:right">
            <Button>查询</Button>
          </i-col>
        </Row>
        <div class="echarts"></div>
      </div> -->
      </div>
      <div class="detail_header">
        关联表
      </div>
      <div>
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :noPage="true"
                  @detailInfor="detailInfor"></TableNew>
      </div>
    </Card>
    <!-- 抽取字段、topic -->
    <Modal :title="fileTitle"
           :closable="false"
           :mask-closable="false"
           v-model="inforModal"
           @on-ok="clearFileData"
           @on-cancel="clearFileData"
           :styles="{width: '60%',minWidth:'600px'}">
      <div style="height:350px">
        <TableNew :title="fileTableTitle"
                  :data="fileTableData"
                  :height="fileHeight"></TableNew>
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

      <!-- <p slot="header"
         style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除</span>
      </p> -->
      <!-- <div slot="footer">
        <Button type="info"
                @click="deleteCancel">取消</Button>
        <Button type="error"
                @click="deleteOk">删除</Button>
      </div> -->
    </Modal>
  </div>
</template>

<script>
import TableNew from '@/components/tableNewC/TableNew';
import {
  // queryTargetProcessTableTopicRelation,
  queryExtractTableDetail,
  queryAllTopicList,
  queryTargetProcessDetail
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      // 进程名称
      titleName: this.$route.query.name,
      // 关联表格
      tableData: [],
      tableTitle: [
        {
          title: "表名",
          key: "sourceTableName",
          align: "center",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#008cd6",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.detailInfor({
                      data: params.row,
                      detail: 'tableCn'
                    })
                  }
                }
              },
              params.row.sourceTableName
            );
          }
        },
        {
          title: "是否加载存量",
          key: "isLoadingStock",
          align: "center",
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            let text = '是'
            if (params.row.isLoadingStock == 0) {
              text = '否'
            }
            return h(
              "span",
              text
            );
          }
        },
        {
          title: "抽取字段",
          key: "extractColumns",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "集群名称",
          key: "topicClusterName",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "topic",
          key: "targetTopicName",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#008cd6",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.detailInfor({
                      data: params.row,
                      detail: 'topic'
                    })
                  }
                }
              },
              params.row.targetTopicName
            );
          }
        },
      ],
      //抽取字段、topic表格
      inforModal: false,
      fileTitle: '',
      fileHeight: 320,
      fileTableTitle: [],
      fileTableData: [],
      inforTitle: {
        fileTitle: [
          {
            title: "序号",
            key: 'serialNumber',
            align: "center",
            minWidth: 60,
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
            key: "memo",
            minWidth: 100,
            align: "center",
            tooltip: true
          },
        ],
        topicTitle: [
          {
            title: "序号",
            type: 'index',
            align: "center",
            width: 70,
          },
          {
            title: "名称",
            key: "name",
            align: "center",
            minWidth: 90,
            tooltip: true
          },
          {
            title: "所属集群",
            key: "cluster",
            align: "center",
            minWidth: 90,
            tooltip: true
          },
          {
            title: "分区数",
            key: "partitionCount",
            align: "center",
            minWidth: 100,
            tooltip: true
          },
          {
            title: "备份数",
            key: "replicateCount",
            align: "center",
            minWidth: 100,
            tooltip: true
          },
          {
            title: "保存时长",
            key: "retentionMs",
            minWidth: 100,
            align: "center",
            tooltip: true,
          }
        ]
      },
      fileRow: {},
      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页
    }
  },
  components: {
    TableNew,
    // expandRow
  },
  methods: {
    // 关联表（初始化）
    initClick () {
      let params = {
        id: this.$route.query.id
      }
      this.tableData = null
      queryTargetProcessDetail(params).then(res => {
        // console.log(res, '关联表初始化')
        if (res.data.status == 1) {
          this.tableData = res.data.data.relationList
          this.totalNum = res.data.data.total
        }
      })
    },

    // 字段详情（初始化）
    initFile (row) {
      console.log(row)
      this.fileTitle = '表字段'
      this.fileTableTitle = this.inforTitle.fileTitle
      let params = {
        sourceTableId: row.sourceTableId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.fileTableData = null
      queryExtractTableDetail(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileTableData = res.data.data.list
          this.totalNum = res.data.data.total
        }
      })
    },

    // topic字段（初始化） 
    initTopic (row) {
      this.fileTitle = 'topic'
      this.fileTableTitle = this.inforTitle.topicTitle
      let params = {
        cluster: row.topicClusterName,
        name: row.targetTopicName
      }
      this.fileTableData = null
      queryAllTopicList(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileTableData = res.data.data.list
          this.totalNum = res.data.data.total
        }
      })
    },

    // 返回
    goBack () {
      this.$router.go(-1)
    },

    // 表格点击详情（表字段，topic）
    detailInfor (row) {
      console.log(row, 'rrrr')
      this.fileRow = row.data
      if (row.detail == 'tableCn') {
        this.initFile(row.data)
      } else if (row.detail == 'topic') {
        this.initTopic(row.data)
      }
      this.inforModal = true
    },

    // 表格详情关闭时：清除数据
    clearFileData () {
      this.currentPage = 1;
      this.pageSize = 10;
      this.fileTitle = '';
      this.fileRow = {}
    },

    // 切换页面
    pageChange (val) {
      console.log(val)
      this.currentPage = val
      this.detailInfor({
        data: this.fileRow,
        detail: this.fileTitle == 'topic' ? 'topic' : 'tableCn'
      })
      // this.initClick()
    },

    // 切换页数
    onPageSize (val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      // this.initClick()
      this.detailInfor({
        data: this.fileRow,
        detail: this.fileTitle == 'topic' ? 'topic' : 'tableCn'
      })
    }
  },
  created () {
    this.initClick()
    this.fileTableTitle = this.inforTitle.fileTitle
  }
}
</script>

<style lang="less" scoped>
.detail_header {
  line-height: 40px;
  font-size: 16px;
  border-bottom: solid 1px #ccc;
}
.detail_echarts {
  width: 100%;
  height: 270px;
  margin: 10px 0;
  background: #ff0;
  display: flex;
  .echartsBox {
    flex: 1;
    // width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    .echartsBox_top {
      padding: 0 20px;
      line-height: 33px;
    }
    .echarts {
      flex: 1;
      width: 100%;
      // height: 100%;
      background: cadetblue;
    }
  }
}
</style>