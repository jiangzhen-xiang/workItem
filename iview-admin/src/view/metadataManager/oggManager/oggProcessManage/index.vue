<template>
  <div>
    <Card>
      <headerSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></headerSearch>
      <h3>ogg进程管理</h3>
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

    <!-- 生成配置文件 -->
    <Modal title="生成配置文件"
           v-model="configFileShow"
           :mask-closable="false">
      <Form ref="formValidate"
            :model="configFileForm"
            :label-width="120">
        <FormItem label="topic后缀:">
          <Input v-model="configFileForm.topicSuffix"
                 placeholder="请输入..." />
        </FormItem>
        <FormItem label="是否新增系统:">
          <RadioGroup v-model="configFileForm.newConnect">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="info"
                @click="configFile">确定</Button>
      </div>
    </Modal>

    <!-- 查看进程指标 -->
    <Modal title="查看进程指标"
           v-model="dataInforShow"
           :mask-closable="false"
           :styles="{width: '800px'}">
      <div class="dataInforBox">
        <Table stripe
               :data="fileData"
               :columns="fileTitle"
               :height="fileHeight"
               :loading="fileLoading">
        </Table>
        <Page show-total
              style="text-align:right;margin-top:10px;"
              :total="totalNumInfor"
              :page-size="pageSizeInfor"
              :current="currentPageInfor"
              show-elevator
              show-sizer
              @on-change="pageChangeInfor"
              @on-page-size-change="onPageSizeInfor" />
      </div>
      <div slot="footer">
        <Button type="info"
                @click="dataInforShow = false">确定</Button>
      </div>
    </Modal>

    <!-- 查看图表信息 -->
    <Modal title="查看图表信息"
           v-model="identifyShow"
           :mask-closable="false">
      <div>
        <Form ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="100">
          <FormItem label="指标"
                    prop="target">
            <AutoComplete v-model="formValidate.target"
                          placeholder="指标"
                          style="position: relative;">
              <Option value="inserts">inserts</Option>
              <Option value="updates">updates</Option>
              <Option value="deletes">deletes</Option>
              <Option value="upserts">upserts</Option>
              <Option value="discards">discards</Option>
              <Option value="operations">operations</Option>
            </AutoComplete>
            <!-- <Select v-model="formValidate.target"
                    placeholder="指标">
              <Option value="inserts">inserts</Option>
              <Option value="updates">updates</Option>
              <Option value="deletes">deletes</Option>
              <Option value="upserts">upserts</Option>
              <Option value="discards">discards</Option>
              <Option value="operations">operations</Option>
            </Select> -->
          </FormItem>
          <FormItem label="函数"
                    prop="expr">
            <!-- class="inputWidth" -->
            <Select v-model="formValidate.expr"
                    placeholder="函数表达式"
                    clearable>
              <Option value="rate">rate</Option>
              <Option value="increase">increase</Option>
              <Option value="irate">irate</Option>
              <Option value="sum">sum</Option>
            </Select>
          </FormItem>
          <FormItem label="函数间隔时间"
                    prop="range">
            <!-- class="inputWidth" -->
            <AutoComplete v-model="formValidate.range"
                          placeholder="5s"
                          @on-search="handleSearchM">
              <Option v-for="(item,index) in rangeListM"
                      :value="item"
                      :key="index">{{ item }}</Option>
            </AutoComplete>

          </FormItem>
          <FormItem label="时间间隔"
                    prop="range_input">
            <AutoComplete v-model="formValidate.range_input"
                          placeholder="1h"
                          @on-search="handleSearch"
                          style="position: relative;">
              <Option v-for="(item,index) in rangeList"
                      :value="item"
                      :key="index">{{ item }}</Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="截止时间"
                    prop="end_input">
            <DatePicker v-model="formValidate.end_input"
                        type="datetime"
                        placeholder="请选择日期和时间..."
                        style="width: 100%">
            </DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info"
                @click="indentifyOk('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import headerSearch from '@/components/tableNewC/headerSearch'
import TableNew from '@/components/tableNewC/TableNew'
import TableInset from '@/components/tableNewC/TableInset'
import { timeTrans } from '@/libs/timeTransform'
import {
  queryTargetProcess,
  saveTargetProcess,
  updateTargetProcess,
  deleteTargetProcess,
  exportTargetProcessConfig,
  querySourceSystemConfigAll,
  oggQueryPorcess
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
          models: 'sourceSystemName',
          placeholder: '源系统名称'
        }],
        titleInputB: [{
          models: 'sourceSystemAbbreviation',
          placeholder: '源系统简称'
        }],
        titleBtn: ['增加进程']
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
          title: "进程名称",
          key: "name",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "需求名称",
          key: "firstDemandName",
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
          title: "源系统简称",
          key: "sourceSystemAbbreviation",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "源端schema",
          key: "sourceDatabaseName",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "源端ogg版本",
          key: "sourceOggVersion",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "源端oracle字符集",
          key: "sourceOracleCharset",
          align: "center",
          minWidth: 110,
          tooltip: true,
        },
        {
          title: "trail文件首字母",
          key: "trailFileFirstName",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: "上线时间",
          key: "firstPublicDate",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: "备注",
          key: "memo",
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: "操作",
          slot: "operationBtn",
          align: "center",
          width: 130,
        }
      ],
      tableData: [],
      tableOperation: [{
        title: '编辑',
        clickBtn: 'editorTab',
        formList: [
          {
            title: '进程名称',
            filedEn: 'name',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '需求名称',
            filedEn: 'firstDemandName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '源系统名称',
            filedEn: 'sourceSystemId',
            type: 'select',
            selectedData: [],
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'change' }],
          },
          {
            title: 'trail文件首字母',
            filedEn: 'trailFileFirstName',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '上线时间（日）',
            filedEn: 'firstPublicDate',
            type: 'date',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'change', pattern: /.+/ }],
          },
          {
            title: '备注',
            filedEn: 'memo',
            type: 'input',
            // isVerify: true,
            // ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      },
      {
        title: '查询进程信息',
        url: 'oggProcessDetail'
      }, {
        title: '生成配置文件'
      }],

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //新增
      addShow: false,
      formList: [
        {
          title: '进程名称',
          filedEn: 'name',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '源系统',
          filedEn: 'sourceSystemId',
          type: 'select',
          selectedData: [],
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'change' }],
        },
        {
          title: '上线时间（日）',
          filedEn: 'firstPublicDate',
          type: 'date',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'change', pattern: /.+/ }],
        },
        {
          title: 'trail文件首字母',
          filedEn: 'trailFileFirstName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '需求名称',
          filedEn: 'firstDemandName',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '备注',
          filedEn: 'memo',
          type: 'input',
          // isVerify: true,
          // ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        }
      ],
      sysList: [],

      //生成配置文件
      configFileShow: false,
      configFileForm: {
        id: '',
        newConnect: '0',
        topicSuffix: ''
      },

      //查看进程指标
      dataInforShow: false,
      fileData: [],
      fileTitle: [
        {
          title: "进程名称",
          key: "processName",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "KFK_REP_inserts ",
          key: "inserts",
          align: "center",
          minWidth: 120,
          tooltip: true,
        },
        {
          title: "KFK_REP_updates",
          key: "updates",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
        {
          title: "KFK_REP_deletes",
          key: "deletes",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
        {
          title: "KFK_REP_upserts",
          key: "upserts",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
        {
          title: "KFK_REP_discards",
          key: "discards",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
        {
          title: "开始统计数据条数时间",
          key: "statistics_since",
          minWidth: 130,
          align: "center",
          tooltip: true,
        },
        {
          title: "获取指标的数据条数",
          key: "statistics_at",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
      ],
      fileHeight: 300,
      fileLoading: false,
      //查看进程指标分页数据
      totalNumInfor: 0,                       // 分页数据总数
      pageSizeInfor: 10,                      // 分页每页数据量
      currentPageInfor: 1,                    // 分页第几页

      //查看图表信息
      identifyShow: false,
      formValidate: {
        expr: '',
        range_input: '',
        end_input: '',
        means: '',
        target: '',
        range: '',
        //调用接口后默认值修改
      },
      ruleValidate: {
        target: [
          // { required: true, message: '不能为空', trigger: 'blur' },
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        // range_input: [
        //   { required: true, message: '不能为空', trigger: 'blur' }
        // ],
        end_input: [
          { required: true, type: 'date', message: '不能为空', trigger: 'change' }
        ],
      },
      rangeList: [],
      rangeListM: [],
      // exprListAll: ['inserts', 'updates', 'deletes', 'upserts', 'discards', 'operations', 'rate函数', 'increase函数', 'irate函数', 'sum函数'],
      // exprList: ['inserts', 'updates', 'deletes', 'upserts', 'discards', 'operations', 'rate函数', 'increase函数', 'irate函数', 'sum函数'],
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
    this.querySourceSys()
    // this.tableData = [{
    //   id: 1,
    //   name: 'ceshisi',
    //   firstDemandName: 'ceshi'
    // }]
  },
  computed: {
    // meansToken () {
    //   let arr = ['rate函数', 'increase函数', 'irate函数', 'sum函数']
    //   return arr.includes(this.formValidate.expr)
    // }
  },
  methods: {
    // 查看（初始化）
    initClick () {
      console.log(this.form)
      let params = {
        processName: this.form.processName || '',
        sourceSystemAbbreviation: this.form.sourceSystemAbbreviation || '',
        sourceSystemName: this.form.sourceSystemName || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableData = null
      queryTargetProcess(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          let tableData = res.data.data.list
          tableData.forEach(item => {
            item.sourceDatabaseName = item.sourceSystemConfig.sourceDatabaseName
            item.sourceOggVersion = item.sourceSystemConfig.sourceOggVersion
            item.sourceOracleCharset = item.sourceSystemConfig.sourceOracleCharset
            item.sourceSystemAbbreviation = item.sourceSystemConfig.sourceSystemAbbreviation
            item.sourceSystemName = item.sourceSystemConfig.sourceSystemName
          })

          this.tableData = tableData
          this.totalNum = res.data.data.total
        }
      })
    },

    // 获取源系统（初始化）
    querySourceSys () {
      querySourceSystemConfigAll().then(res => {
        console.log(res, '源系统')
        // 判断接口成功或者失败
        let sysList = res.data.data.map(item => {
          return {
            title: item.sourceSystemName + '-' + item.sourceSystemAbbreviation,
            value: item.id
          }
        })
        console.log(sysList)
        let tableOperation = this.tableOperation.map((item) => {
          if (item.formList) {
            item.formList[2].selectedData = sysList
          }
          return item
        })
        this.tableOperation = tableOperation
        // this.tableOperation[0].formList[3].selectedData = sysList
        let formList = this.formList.map((item, index) => {
          if (item.selectedData) {
            item.selectedData = sysList
          }
          return item
        })
        this.formList = formList
        // this.formList[3].selectedData = sysList
      })
    },

    // 顶部搜索
    searchClick (val) {
      // console.log(val)
      this.form = val
      this.initClick()
    },

    // 判断顶部事件
    btnClick (val) {
      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '增加进程') {
        this.addShow = true
      }
    },

    // 新增
    addClick (val) {
      console.log(val, 'xinzeng')
      // toLocaleString()
      this.addShow = false
      if (val.status == 'ok') {
        let params = val.data
        // 本地时间传后台经浏览器转换为标准时间，两个时间存在8小时差异
        let timer = params.firstPublicDate.getTime() + 8 * 60 * 60 * 1000
        params.firstPublicDate = new Date(timer)
        saveTargetProcess(params).then(res => {
          console.log(res)
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
      console.log(row, '编辑')
      let params = row.newData
      // 本地时间传后台经浏览器转换为标准时间，两个时间存在8小时差异
      let timer = params.firstPublicDate.getTime() + 8 * 60 * 60 * 1000
      params.firstPublicDate = new Date(timer)
      params.id = row.oldData.id
      updateTargetProcess(params).then(res => {
        // console.log(res)
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
        deleteTargetProcess(params).then(res => {
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

    // 表格其他点击事件(生成配置文件/查看图表信息/查看进程指标)
    otherClick (row) {
      // console.log(row)
      if (row.type == "生成配置文件") {
        this.configFileShow = true
        this.configFileForm.id = this.tableData[row.index].id
      } else if (row.type == "查看进程指标") {
        this.dataInforShow = true
        this.initDataInfor(row.index)
        // 调用接口，展示表格信息
      } else if (row.type == "查看图表信息") {
        this.identifyShow = true

        // 输入信息，进行拼接
      }
    },

    //生成配置文件
    configFile () {
      console.log(this.configFileForm)
      let params = {
        id: this.configFileForm.id,
        newConnect: this.configFileForm.newConnect == '1' ? true : false,
        topicSuffix: this.configFileForm.topicSuffix
      }
      exportTargetProcessConfig(params).then(res => {
        console.log(res)
        let that_ = this
        const data = res.data
        // 清空数据
        this.configFileShow = false
        this.configFileForm = {
          id: '',
          newConnect: '0',
          topicSuffix: ''
        }
        // 有可能下载失败，比如返回{code: 0},但设置了responseType: 'blob'，axios会把data强制转为blob，导致下载undefined.excel（后缀取决于文件类型，这里只是举例）
        // 解决：将已转为blob类型的data转回json格式，判断是否下载成功
        const r = new FileReader()
        r.onload = function () {
          try {
            const resData = JSON.parse(this.result)
            that_.$Message.error(resData.message)
          } catch (err) {
            // 下载正常处理
            // 兼容ie11
            if (window.navigator.msSaveOrOpenBlob) {
              try {
                const blobObject = new Blob([res.data])
                let fileName = res.headers["content-disposition"].split('filename=')[1];
                window.navigator.msSaveOrOpenBlob(blobObject, fileName);
                //  const blobObject = new Blob([data])
                //  window.navigator.msSaveOrOpenBlob(blobObject, fileName)
              } catch (e) {
                console.log(e)
              }
              return
            }
            let link = document.createElement('a')
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
        r.readAsText(data) // FileReader的API
      })
    },

    // 查看进程指标
    initDataInfor (index) {
      let params = {
        processName: 'KFK_REP',
        pageNum: this.currentPageInfor,
        pageSize: this.pageSizeInfor
      }
      this.fileData = null
      oggQueryPorcess(params).then((res) => {
        console.log(res)
        if (res.data.status == 1) {
          this.fileData = res.data.data.list
          this.totalNumInfor = res.data.data.total
        } else {
          this.fileData = null
          this.totalNumInfor = 0
        }
      })
    },
    //查看进程指标-切换页面
    pageChangeInfor (val) {
      this.currentPageInfor = val
      this.initDataInfor()
    },
    //查看进程指标-切换页数
    onPageSizeInfor (val) {
      console.log(val)
      this.pageSizeInfor = val
      this.currentPageInfor = 1
      this.initDataInfor()
    },

    // 查看图表信息-确定
    indentifyOk (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.$Message.success('Success!');
          //校验非空，函数表达式
          console.log(this.formValidate, 'ceshi')
          let expr = ''
          if (this.formValidate.expr != '') {
            // rate(inserts[5m])
            expr = `${this.formValidate.expr}(KFK_REP_${this.formValidate.target}[${this.formValidate.range ? this.formValidate.range : '5s'}])`
          } else {
            expr = 'KFK_REP_' + this.formValidate.target
          }
          expr = expr.replace("函数", '')
          // 时间处理
          //跳转的页面默认事件为标准时间，并转换为本地时间，现在此处减八小时
          let oldTimer = this.formValidate.end_input.getTime()
          oldTimer = oldTimer - 8 * 60 * 60 * 1000
          //准换时间格式
          let timer = timeTrans(new Date(oldTimer))
          let url = `http://172.16.150.25:9090/graph?g0.range_input=${this.formValidate.range_input ? this.formValidate.range_input : '1h'}&g0.end_input=${timer}&g0.expr=${expr}&g0.tab=0&g0.stacked=0&g0.moment_input=${timer}`
          console.log(expr, url)
          window.open(url, '_blank')
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    // 查看图表信息-取消
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    //查看标识-间隔时间
    handleSearch (value) {
      console.log(value, 'value')
      if (!isNaN(value)) {
        this.rangeList = !value || value.indexOf('@') >= 0 ? [] : [
          value + 's',
          value + 'm',
          value + 'h',
          value + 'd',
          value + 'w',
          value + 'y',
        ];
      } else {
        this.rangeList = []
      }
    },
    //查看标识-方法间隔时间
    handleSearchM (value) {
      console.log(value)
      if (!isNaN(value)) {
        this.rangeListM = !value || value.indexOf('@') >= 0 ? [] : [
          value + 's',
          value + 'm',
          value + 'h',
          value + 'd',
          value + 'w',
          value + 'y',
        ];
      } else {
        this.rangeListM = []
      }
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

<style lang="less">
h3 {
  margin: 10px 0;
}
.process_content {
  width: 100%;
}
.dataInforBox {
  .ivu-table-cell {
    padding-left: 3px;
    padding-right: 3px;
  }
}
.hiddenBox {
  margin-top: 10px;
}
.inputWidth {
  width: 30%;
  position: relative;
}
</style>
