<template>
  <div>
    <Card>
      <headerSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></headerSearch>
      <h3>ogg运行管理</h3>
      <div class="process_content">
        <TableNew :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  @selectCheck="selectCheck"
                  @deleteClick="deleteClick"
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

    <!-- 抽取表配置 -->
    <Modal :title="configTitle"
           :closable="false"
           :mask-closable="false"
           width="500"
           v-model="configuration">
      <div class="config_box">
        <Form :label-width="150"
              :rules="ruleValidate"
              :model="stock"
              ref="configForm">
          <FormItem label="进程:"
                    prop="replicateName">
            <Select v-model="stock.replicateName"
                    style="width:200px;margin-right:15px;"
                    placeholder="请选择进程"
                    @on-change="changeProcess"
                    clearable>
              <Option v-for="(item,index) in processList"
                      :value="item.id?item.id:''"
                      :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="源系统:"
                    prop="connectedSystemName">
            <Select v-model="stock.connectedSystemName"
                    style="width:200px;margin-right:15px"
                    placeholder="请选择源系统"
                    clearable>
              <Option v-for="(item,index) in sysList"
                      :value="item.sourceSystemName"
                      :key="index">{{ item.sourceSystemName + '-' + item.sourceSystemAbbreviation}}</Option>
            </Select>
            <!-- +'-'+item.sourceSystemAbbreviation  connectedSystemName tableCode-->
          </FormItem>
          <FormItem label="抽取表:"
                    prop="sourceTableId">
            <Select v-model="stock.sourceTableId"
                    style="width:200px;margin-right:15px"
                    placeholder="请选择抽取表"
                    clearable>
              <Option v-for="(item,index) in sourceTableList"
                      :value="item.id?item.id:''"
                      :key="index">{{ item.abbreviation }}</Option>
            </Select>
            <Button type="primary"
                    @click="goExtracTable">新增抽取表</Button>
          </FormItem>
          <FormItem label="topic集群:"
                    prop="clusterName">
            <Select v-model="stock.clusterName"
                    style="width:200px;margin-right:15px;"
                    placeholder="请选择集群"
                    clearable>
              <Option v-for="(item,index) in clusterList"
                      :value="item.abbreviation"
                      :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="topic:"
                    prop="kafkaTopicName">
            <AutoComplete v-model="stock.kafkaTopicName"
                          placeholder="请选择topic信息"
                          @on-search="handleSearch"
                          style="width:200px;margin-right:15px;position: relative;">
              <Option v-for="(item,index) in topicListS"
                      :value="item.name"
                      :key="index">{{ item.name }}</Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="是否加载存量:"
                    prop="loadingStockRemark">
            <!-- <Checkbox v-model="stock.loadingStockRemark"></Checkbox> -->
            <i-switch size="large"
                      v-model="stock.loadingStockRemark"
                      @on-change="getIsLoadingStock">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <!-- <FormItem label="进程:"
                    prop="replicateName">
            <Select v-model="stock.replicateName"
                    style="width:200px;margin-right:15px;"
                    placeholder="请选择进程"
                    clearable>
              <Option v-for="(item,index) in processList"
                      :value="item.id"
                      :key="index">{{ item.name }}</Option>
            </Select> -->
          <!-- </FormItem> -->
          <!-- <Checkbox v-model="isAllExtracting" ></Checkbox>  replicateName -->
          <!--<FormItem label="是否选取日志字段:">
            <i-switch size="large"
                      v-model="isAllExtracting"
                      @on-change="getIsAllExtracting">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>-->
          <FormItem label="添加日志字段:"
                    prop="extractFields">
            <Input v-model="stock.extractFields"
                   placeholder="请输入添加日志字段"
                   style="width:200px;margin-right:15px;position: relative;" />
          </FormItem>
        </Form>
        <!-- <Select v-model="stock.kafkaTopicName"
                  style="width: 20%;margin-left:10px"
                  placeholder="请选择topic信息"
                  clearable>
            <Option v-for="(item,index) in topicList"
                    :value="item.id"
                    :key="index">{{ item.name }}</Option>
          </Select> -->
        <!-- <Input v-model="stock.replicateName"
                 placeholder="进程"
                 style="width: 20%;margin-left:10px" />
          <Input v-model="stock.data"
                 placeholder="集群"
                 style="width: 20%;margin-left:10px" />
          <Input v-model="stock.topic"
                 placeholder="topic信息"
                 style="width: 20%;margin-left:10px" /> -->

        <!--          <div v-show="isAllExtracting">-->
        <!--            <h3 class="titleTop">tab1抽取字段列表</h3>-->
        <!--            <Table stripe-->
        <!--                   :data="fileData"-->
        <!--                   :columns="fileTitle"-->
        <!--                   :height="fileHeight"-->
        <!--                   :loading="tableLoading"-->
        <!--                   @on-select="selectChange"-->
        <!--                   @on-select-cancel="selectChangeCancel"-->
        <!--                   @on-select-all="selectChange"-->
        <!--                   @on-select-all-cancel="selectChangeCancel">-->
        <!--            </Table>-->
        <!--            <Page show-total-->
        <!--                  style="text-align:right;margin-top:10px;"-->
        <!--                  :total="stockTotal"-->
        <!--                  :page-size="stockPageSize"-->
        <!--                  :current="stockCurrentPage"-->
        <!--                  show-elevator-->
        <!--                  show-sizer-->
        <!--                  @on-change="stockPageChange"-->
        <!--                  @on-page-size-change="stockOnPageSize" />-->
        <!--          </div>-->

      </div>
      <div slot="footer">
        <Button @click="configCancel">取消</Button>
        <Button @click="configOk">确定</Button>
      </div>
    </Modal>
    <!-- 表字段、topic字段展示 -->
    <Modal :title="fileTableText"
           :closable="false"
           :mask-closable="false"
           v-model="inforModal"
           @on-ok="clearFileData"
           @on-cancel="clearFileData"
           :styles="{width: '60%',minWidth:'600px'}">
      <div style="height:350px">
        <TableNew :title="fileTableTitle"
                  :data="fileTableData"
                  :height="fileTableHeight"></TableNew>
        <Page show-total
              style="text-align:right;margin-top:10px;"
              :total="fileTotalNum"
              :page-size="filePageSize"
              :current="fileCurrentPage"
              show-elevator
              show-sizer
              @on-change="filePageChange"
              @on-page-size-change="fileOnPageSize" />
      </div>
    </Modal>
    <!-- avro数据展示 -->
    <Modal title="avro数据展示"
           v-model="avroShow"
           :mask-closable="false">
      <div v-html="avroText"></div>
      <div slot="footer">
        <Button type="info"
                @click="avroShow = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios';
import headerSearch from '@/components/tableNewC/headerSearch'
import TableNew from '@/components/tableNewC/TableNew'
import {
  queryTargetProcessTableTopicRelation,
  saveTargetProcessTableTopicRelation,
  updateTargetProcessTableTopicRelation,
  deleteTargetProcessTableTopicRelation,
  queryExtractTable,
  queryTargetProcess,
  queryAllClusterList,
  queryAllTopicList,
  queryExtractTableDetail,
  querySourceSystemConfigAll,
  queryRelationAvro,
  batchExportRelation
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInputT: [{
          models: 'processName',
          placeholder: '进程名称'
        }, {
          models: 'tableName',
          placeholder: '抽取表'
        }],
        titleInputB: [{
          models: 'topicName',
          placeholder: 'topic'
        }
        ],
        titleBtn: ['增加映射', '导出']
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
          title: "对接系统名称",
          key: "connectedSystemName",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "对接系统简称",
          key: "connectedSystemCode",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "需求名称（首个）",
          key: "firstDemandName",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "上线时间",
          key: "firstPublishDate",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "增加数据量",
          key: "incrementData",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "是否加载存量",
          key: "loadingStockRemark",
          align: "center",
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            let text = ''
            if (params.row.loadingStockRemark == "0") {
              text = '否'
            } else if (params.row.loadingStockRemark == "1") {
              text = '是'
            }
            return h(
              "span",
              text
            );
          }
        },
        {
          title: "ogg版本",
          key: "oracleOggVersion",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "源端ORACLE字符集",
          key: "originalOracleCharset",
          align: "center",
          minWidth: 140,
          tooltip: true,
        },
        {
          title: "源端SCHEMA",
          key: "originalSchema",
          align: "center",
          minWidth: 110,
          tooltip: true,
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "replicate进程名",
          key: "replicateName",
          align: "center",
          minWidth: 110,
          tooltip: true,
        },
        {
          title: "存量数据量",
          key: "stockData",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "涉及系统简称",
          key: "systemInvolved",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "表英文名",
          key: "tableCode",
          align: "center",
          minWidth: 90,
          tooltip: true,
          fixed: 'left',
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
              params.row.tableCode
            );
          }
        },
        {
          title: "表中文名",
          key: "tableName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "trail文件首字母",
          key: "tailFileFirstName",
          align: "center",
          minWidth: 130,
          tooltip: true,
        },
        {
          title: "topic集群简称",
          key: "clusterName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "topic",
          key: "kafkaTopicName",
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
              params.row.kafkaTopicName
            );
          }
        }, {
          title: "kafka分区数",
          key: "kafkaPartitionCount",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "添加日志字段",
          key: "extractFields",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "操作",
          slot: "operationBtn",
          align: "center",
          fixed: 'right',
          width: 100,
        }
      ],
      tableData: [],
      tableOperation: [
        {
          title: '编辑',
        },
        {
          title: '删除',
          clickBtn: 'deleteTab'
        },
        {
          title: '查看avro数据',
        },
      ],
      tableLoading: false,

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //抽取表配置
      configuration: false,
      configTitle: '增加映射',
      sysList: [],
      sourceTableList: [],
      processList: [],
      clusterList: [],
      topicList: [],
      topicListS: [],
      stock: {
        extractFields: '',
        replicateName: '',
        kafkaTopicName: '',
        loadingStockRemark: false,
        clusterName: '',
        connectedSystemName: '',
        sourceTableId: ''
      },
      connectedSystemName: '',
      sourceTableId: '',
      clusterCode: '',
      // isAllExtracting: false,
      fileHeight: 245,
      fileTitle: [{
        type: "selection",
        width: 55,
        align: "center"
      },
      {
        title: "字段中文名",
        key: "name",
        align: "center",
        minWidth: 100,
        tooltip: true
      },
      {
        title: "字段英文名",
        key: "abbreviation",
        align: "center",
        minWidth: 100,
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
        minWidth: 80,
        tooltip: true
      },
      {
        title: "是否主键",
        key: "isPrimaryKey",
        minWidth: 90,
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
        minWidth: 90,
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
      }],
      fileData: [],
      stockTotal: 12,
      stockPageSize: 10,
      stockCurrentPage: 1,
      ruleValidate: {
        connectedSystemName: [
          { required: true, message: '源系统不能为空', trigger: 'change' }
        ],
        sourceTableId: [
          { required: true, message: '抽取表不能为空', trigger: 'change' }
        ],
        clusterName: [
          { required: true, message: 'topic集群不能为空', trigger: 'change' }
        ],
        kafkaTopicName: [
          { required: true, message: 'topic不能为空', trigger: 'blur' }
        ],
        replicateName: [
          { required: true, message: '进程不能为空', trigger: 'change' }
        ]
      },
      selectArr: [],                     // tab多选数据
      selectObj: {},                     // tab多选数据验证是否重复

      //抽取字段、topic表格
      inforModal: false,
      fileTableText: '',
      fileTableHeight: 320,
      fileTableTitle: [],
      fileTableData: [],
      inforTitle: {
        fileTitle: [
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
      fileTotalNum: 0,                       // 分页数据总数
      filePageSize: 10,                      // 分页每页数据量
      fileCurrentPage: 1,                    // 分页第几页

      //avro数据展示
      avroShow: false,
      avroText: ''
    }
  },
  components: {
    headerSearch,
    TableNew,
  },
  watch: {
    stock: {
      deep: true,
      handler (newVal) {
        if (newVal.connectedSystemName != this.connectedSystemName) {
          this.connectedSystemName = newVal.connectedSystemName
          let arr = this.sysList.filter(item => {
            return item.sourceSystemName == newVal.connectedSystemName
          })

          let params = {
            sourceSystemId: arr[0]?arr[0].id:"",
            pageSize: 1000
          }
          queryExtractTable(params).then(res => {
            console.log(res, '抽取表')
            if (res.data.status == 1) {
              this.sourceTableList = res.data.data.list
            }
          })
          return
        }
        if (newVal.sourceTableId != this.sourceTableId) {
          this.sourceTableId = newVal.sourceTableId
          this.selectObj = []
          this.selectObj = {}
          this.initStockData()
          return
        }
      }

    },
    clusterCode (newVal) {
      queryAllTopicList({ cluster: newVal }).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.topicList = res.data.data.list
          this.topicListS = res.data.data.list
        }
      })
    }
  },
  mounted () {
    // this.tableData = [
    //   {
    //     id: 12,
    //     processName: 'sss',
    //     sourceTableName: '进程名称'
    //   }
    // ]
    // console.log(this.tableData, 'mounted')
  },
  created () {
    this.initClick()
    this.initSelectData()
    this.fileTableTitle = this.inforTitle.fileTitle
  },
  methods: {
    // 查看（初始化）
    initClick () {
      console.log(this.form)
      let params = {
        clusterName: this.form.clusterName || '',
        processName: this.form.processName || '',
        sourceSystemName: this.form.sourceSystemName || '',
        tableDatabaseName: this.form.tableDatabaseName || '',
        tableName: this.form.tableName || '',
        topicName: this.form.topicName || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableData = null
      queryTargetProcessTableTopicRelation(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        } else {
          this.tableData = null
        }
      })
    },
    getIsLoadingStock (val) {
      console.log(val);
      if (val) {
        this.stock.loadingStockRemark = true;
      } else {
        this.stock.loadingStockRemark = false;
      }
    },
    exportBatch () {
      if (this.selectArr == '') {
        this.$Message.error('请选中数据')
        return
      }
      let str = ''
      this.selectArr.forEach((item, index) => {
        if (index == 0) {
          str += item.id
        } else {
          str += ',' + item.id
        }
      })
      let params = {
        ids: str
      }
      batchExportRelation(params).then(res => {
        let that_ = this
        const r = new FileReader()
        r.onload = function () {
          try {
            const resData = JSON.parse(this.result)
            that_.$Message.error(resData.message)
          } catch (err) {
            // 兼容ie11
            if (window.navigator.msSaveOrOpenBlob) {
              try {
                const blobObject = new Blob([res.data])
                let fileName = res.headers["content-disposition"].split('filename=')[1];
                window.navigator.msSaveOrOpenBlob(blobObject, fileName);
              } catch (e) {
                console.log(e)
              }
              return
            };
            let link = document.createElement('a');
            let blob = new Blob([res.data], { type: res.data.type });
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            let fileName = res.headers["content-disposition"].split('filename=')
            link.download = fileName[1];
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

          }
        }
        r.readAsText(res.data)
      })
    },

    // 下拉框list
    initSelectData () {
      querySourceSystemConfigAll().then(res => {
        console.log(res, '源系统')
        if (res.data.status == 1) {
          this.sysList = res.data.data
          console.log(this.sysList, 'shuju')
        }
      })
      let params = {
        sourceSystemId: this.stock.connectedSystemName,
        pageSize: 1000
      }
      queryExtractTable(params).then(res => {
        console.log(res, '抽取表1', params)
        if (res.data.status == 1) {
          this.sourceTableList = res.data.data.list
        }
        // console.log(this.sourceTableList);
      })
      queryTargetProcess({ pageSize: 1000 }).then(res => {
        console.log(res, '进程')
        if (res.data.status == 1) {
          this.processList = res.data.data.list
        }
      })
      queryAllClusterList({ pageSize: 1000 }).then(res => {
        console.log(res, '集群')
        if (res.data.status == 1) {
          this.clusterList = res.data.data.list
        }
      })
      queryAllTopicList({ pageSize: 1000 }).then(res => {
        // console.log(res, 'topic')
        if (res.data.status == 1) {
          this.topicList = res.data.data.list
          this.topicListS = res.data.data.list
        }
      })
    },

    // 改变进程
    changeProcess(val){
      if(val){
        let index=this.processList.findIndex(item=>{
          return val==item.id
        })
        let value="";
        if(index!=-1&&this.processList[index].sourceSystemId){
          value=this.processList[index].sourceSystemId;
        }
        let ind=this.sysList.findIndex(item=>{
            return item.id==value;
        })
        if(ind!=-1&&this.sysList[ind].sourceSystemName){
          this.stock.connectedSystemName=this.sysList[ind].sourceSystemName;
        }
      }
    },
    // 顶部搜索
    searchClick (val) {
      console.log(val)
      this.form = val
      this.initClick()
    },

    // 判断顶部事件
    btnClick (val) {
      console.log(val)
      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '增加映射') {
        this.configuration = true;
        this.configTitle = '增加映射'
      } else if (val.type == '导出') {
        this.exportBatch()
      }
    },

    // 删除
    deleteClick (row) {
      console.log(row)
      if (row.boolean) {
        let params = {
          id: this.tableData[row.index].id
        }
        deleteTargetProcessTableTopicRelation(params).then(res => {
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

    // 切换页面
    pageChange (val) {
      console.log(val)
      this.currentPage = val
      this.initClick()
    },

    // 切换页数
    onPageSize (val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.initClick()
    },

    // 表格其他事件（编辑数据反显）
    otherClick (row) {
      console.log(row)
      if (row.type == '编辑') {
        let val = this.tableData[row.index]
        this.configuration = true;
        this.configTitle = '编辑映射';
        // console.log(val.id);
        let processArr = this.processList.filter(item => {
          return item.name == val.replicateName
        })

        this.stock = {
          extractFields: val.extractFields,
          replicateName: processArr[0].id,
          kafkaTopicName: val.kafkaTopicName,
          loadingStockRemark: val.loadingStockRemark == 0 ? false : true,
          clusterName: val.clusterName,
          id: val.id,
          connectedSystemName: val.connectedSystemName,
          sourceTableId: val.sourceTableId
        }
        this.clusterCode = val.clusterName
      } else if (row.type == '查看avro数据') {
        let params = {
          id: this.tableData[row.index].id,
        }
        queryRelationAvro(params).then(res => {
          if (res.data.status == 1 && res.data.data != null) {
            this.avroText = res.data.data
          } else if (res.data.status == 1 && res.data.data == null) {
            this.avroText = res.data.message
          }
          this.avroShow = true
        })
      }
    },

    // 新增/编辑中表字段初始化
    initStockData () {
      if (this.sourceTableId == undefined) {
        this.fileData = [];
        return
      }
      let params = {
        sourceTableId: this.sourceTableId,
        pageNum: this.stockCurrentPage,
        pageSize: this.stockPageSize
      }
      this.tableLoading = true
      queryExtractTableDetail(params).then(res => {
        console.log(res, '字段')
        if (res.data.status == 1) {
          let fileData = res.data.data.list
          let selectArr = []
          this.stockTotal = res.data.data.total

          console.log(this.selectObj, 'selectObj')
          fileData.forEach((item) => {
            if (this.selectObj[item.name]) {
              item["_checked"] = true
              selectArr.push(item)
            }
          })
          this.fileData = fileData;
          this.selectArr = this.selectArr;
          this.tableLoading = false
        }
      })
    },

    //表格多选
    selectCheck (val) {
      console.log(val)
      this.selectArr = val.selectArr
      if (this.selectArr == '') {
        this.clearSelectArr = false
      }
    },
    // 新增/编辑-表格多选选中
    // selectChange (val) {
    //   // console.log(val, '选中')
    //   val.forEach((item) => {
    //     // 通过唯一标识，数据去重(暂用id)
    //     if (!this.selectObj[item.id]) {
    //       this.selectArr.push(item)
    //       this.selectObj[item.id] = true;
    //     }
    //   })
    // },

    // 新增/编辑-多选取消选中
    selectChangeCancel (val, row) {
      // console.log(val, '取消')
      if (row) {
        // 取消单个
        this.selectArr.forEach((item, index) => {
          if (item.id == row.id) {
            this.selectArr.splice(index, 1)
            delete this.selectObj[item.id]
          }
        })
      } else {
        // 取消本页全部
        this.tableData.forEach((nape) => {
          this.selectArr.forEach((item, index) => {
            if (item.id == nape.id) {
              this.selectArr.splice(index, 1)
              delete this.selectObj[item.id]
            }
          })
        })
      }
    },

    // 新增/编辑-确定
    configOk () {
      console.log('确定', this.stock)
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          let params = {
            sourceTableId: this.stock.sourceTableId,
            topicClusterName: this.stock.clusterName,
            targetTopicName: this.stock.kafkaTopicName,
            isLoadingStock: this.stock.loadingStockRemark ? 1 : 0,
            processId: this.stock.replicateName,
            extractColumns: this.stock.extractFields
          }
          if (this.configTitle == '增加映射') {
            saveTargetProcessTableTopicRelation(params).then(res => {
              console.log(res, '新增采集端配置')
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
              this.configCancel()
            })

          } else if (this.configTitle == '编辑映射') {
            params.id = this.stock.id

            updateTargetProcessTableTopicRelation(params).then(res => {
              console.log(res, '修改采集端配置', this.stock.id)
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
              this.configCancel()
            })
          }
        } else {
          this.$Message.error({
            content: '请输入必填项！',
            duration: 4
          });
        }
      })



    },

    // 新增/编辑-取消
    configCancel () {
      console.log('取消')
      this.configuration = false
      this.$refs['configForm'].resetFields();
      this.sourceTableId = ''
      this.connectedSystemName = ''
      this.clusterCode = ''
      // this.isAllExtracting = false
      this.selectArr = []
      this.selectObj = {}
      //调用接口方法时参数注意
      //如果选中全选，数据传输什么？没选中全选时，数据应该要传输selectArr中的ids?
    },

    // 跳转-抽取表管理
    goExtracTable () {
      this.$router.push('extractTableManage')
    },

    // topic信息下拉框过滤（模糊查询）
    handleSearch (value) {
      this.topicListS = this.topicList.filter((item, index) => {
        // console.log(item.name.indexOf(value) >= 0)
        return item.name.indexOf(value) >= 0
      })
    },

    //切换分页-抽取表设置
    stockPageChange (val) {
      console.log(val)
      this.stockCurrentPage = val
      this.initStockData()
    },

    // 切换页数-抽取表设置
    stockOnPageSize (val) {
      console.log(val)
      this.stockPageSize = val
      this.stockCurrentPage = 1
      this.initStockData()
    },

    // 字段详情（初始化）
    initFile (row) {
      console.log(row)
      this.fileTableText = '表字段'
      this.fileTableTitle = this.inforTitle.fileTitle
      let params = {
        sourceTableId: row.sourceTableId,
        pageNum: this.fileCurrentPage,
        pageSize: this.filePageSize
      }
      this.fileTableData = null
      queryExtractTableDetail(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileTableData = res.data.data.list
          this.fileTotalNum = res.data.data.total
        }
      })
    },

    // topic字段（初始化）
    initTopic (row) {
      this.fileTableText = 'topic'
      this.fileTableTitle = this.inforTitle.topicTitle
      let params = {
        cluster: row.clusterName,
        name: row.kafkaTopicName
      }
      this.fileTableData = null
      queryAllTopicList(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileTableData = res.data.data.list
          this.fileTotalNum = res.data.data.total
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
      this.fileCurrentPage = 1;
      this.filePageSize = 10;
      this.fileTableText = '';
      this.fileRow = {}
    },

    // 切换页面
    filePageChange (val) {
      // console.log(val)
      this.fileCurrentPage = val
      // this.initClick()
      this.detailInfor({
        data: this.fileRow,
        detail: this.fileTableText == 'topic' ? 'topic' : 'tableCn'
      })
    },

    // 切换页数
    fileOnPageSize (val) {
      // console.log(val)
      this.filePageSize = val
      this.fileCurrentPage = 1
      // this.initClick()
      this.detailInfor({
        data: this.fileRow,
        detail: this.fileTableText == 'topic' ? 'topic' : 'tableCn'
      })
    }
  }
}
</script>

<style lang="less">
h3 {
  margin: 10px 0;
}
.titleTop {
  border-bottom: solid 1px #ccc;
}
.config_box {
  width: 100%;
  // height: 400px;
  > div:first-child {
    margin-bottom: 10px;
  }
  .ivu-auto-complete.ivu-select-dropdown {
    height: 240px;
    bottom: 10px !important;
  }
}
</style>
