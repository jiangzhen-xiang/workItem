<template>
  <div style="min-width: 720px;">
    <Card>
      <headerSearch @searchClick='searchClick'
                    @btnClick='btnClick'
                    :headerTitle='headerTitle'></headerSearch>
      <h3>源表管理</h3>
      <div class="process_content">
        <TableNew ref="tableNew"
                  :title="tableTitle"
                  :data="tableData"
                  :tableOperation="tableOperation"
                  :clearSelectArr="clearSelectArr"
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

    <!-- 新增 -->
    <TableInset :tableInsertShow="addShow"
                :titleData="formList"
                @tableInsert="addClick"></TableInset>

    <!-- 更新结果 -->
    <Modal title="更新结果"
           v-model="updateShow"
           :mask-closable="false">
      <div v-html="updateText"></div>
      <div slot="footer">
        <Button type="info"
                @click="updateShow = false">确定</Button>
      </div>
    </Modal>

    <!-- 更新选择数据库 -->
    <!-- <Modal title="更新"
           v-model="databaseShow"
           :mask-closable="false">
      <div>
        <Select v-model="formUpdate.database"
                placeholder="数据库"
                clearable>
          <Option value="1">1</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="info"
                @click="updateCancel">取消</Button>
        <Button type="info"
                @click="updateShow = false">点击确定，调用接口</Button>
      </div>
    </Modal> -->

  </div>
</template>

<script>
import headerSearch from '@/components/tableNewC/headerSearch'
import TableNew from '@/components/tableNewC/TableNew'
import TableInset from '@/components/tableNewC/TableInset'
import {
  queryExtractTable,
  saveExtractTable,
  updateExtractTable,
  deleteExtractTable,
  querySourceSystemConfigAll,
  updateExtractTableDetailById,
  batchExportExtractTable,
  saveExtractTableTest,
  updateExtractTableTest,
  importExtractTables
} from '@/api/oggManage.js'
export default {
  data () {
    return {
      //顶部搜索栏数据
      form: {},
      headerTitle: {
        titleInputT: [{
          models: 'name',
          placeholder: '表中文名'
        }, {
          models: 'abbreviation',
          placeholder: '表英文名'
        }],
        titleInputB: [{
          models: 'sourceSystemName',
          placeholder: '源系统名称'
        },
          // {
          //   models: 'sourceSystemAbbreviation',
          //   placeholder: '源系统简称'
          // }
        ],
        uploadBtn: '导入',
        titleBtn: ['导出', '批量更新', '增加抽取表'],
        // '计划上线时间'
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
          title: "表英文名",
          key: "abbreviation",
          align: "center",
          minWidth: 90,
          tooltip: true,
        },
        {
          title: "表中文名",
          key: "name",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "源系统名称",
          key: "sourceSystemName",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        // {
        //   title: '创建时间',
        //   key: 'createDate',
        //   minWidth: 100,
        //   align: "center",
        //   tooltip: true,
        // },
        {
          title: '增量数据量',
          key: 'incrementData',
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        {
          title: '存量数据量',
          key: 'stockData',
          minWidth: 100,
          align: "center",
          tooltip: true,
        },
        // {
        //   title: '首次上线时间',
        //   key: 'scsxsj',
        //   minWidth: 100,
        //   align: "center",
        //   tooltip: true,
        // },
        // {
        //   title: '上线次数',
        //   key: 'sxcs',
        //   minWidth: 100,
        //   align: "center",
        //   tooltip: true,
        // },
        {
          title: '最后上线时间',
          key: 'lastModifyDate',
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
            title: '表英文名',
            filedEn: 'abbreviation',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '表中文名',
            filedEn: 'name',
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
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '数据库类型',
            filedEn: 'databaseType',
            type: 'select',
            selectedData: [
              {
                title: 'oracle',
                value: 'oracle'
              },
              {
                title: 'mysql',
                value: 'mysql'
              }
            ],
          },
          // {
          //   title: '创建时间',
          //   filedEn: 'createDate',
          //   type: 'date',
          //   isVerify: true,
          //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'change', pattern: /.+/ }],
          // },
          {
            title: '增量数据量',
            filedEn: 'incrementData',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: '存量数据量',
            filedEn: 'stockData',
            type: 'input',
            isVerify: true,
            ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
          },
          {
            title: 'avro文件上传',
            filedEn: 'file',
            type: 'upload',
          }
        ]
      },
      {
        title: '删除',
        clickBtn: 'deleteTab'
      },
      {
        title: '更新'
      },
      {
        title: '查看表结构',
        url: 'tableStructure'
      },
      {
        title: '查看历史版本',
        url: 'versionHistory'
      }],
      selectArr: [],
      clearSelectArr: false,

      //分页数据
      totalNum: 0,                       // 分页数据总数
      pageSize: 10,                      // 分页每页数据量
      currentPage: 1,                    // 分页第几页

      //新增
      addShow: false,
      formList: [
        {
          title: '表英文名',
          filedEn: 'abbreviation',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '表中文名',
          filedEn: 'name',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '源系统名称',
          filedEn: 'sourceSystemId',
          selectedData: [],
          type: 'select',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        // {
        //   title: '创建时间',
        //   filedEn: 'createDate',
        //   type: 'date',
        //   isVerify: true,
        //   ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur', trigger: 'change', pattern: /.+/ }],
        // },
        {
          title: '数据库类型',
          filedEn: 'databaseType',
          type: 'select',
          selectedData: [
            {
              title: 'oracle',
              value: 'oracle'
            },
            {
              title: 'mysql',
              value: 'mysql'
            }
          ],
        },
        {
          title: '增量数据量',
          filedEn: 'incrementData',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: '存量数据量',
          filedEn: 'stockData',
          type: 'input',
          isVerify: true,
          ruleVerify: [{ required: true, message: '请输入...', trigger: 'blur' }],
        },
        {
          title: 'avro文件上传',
          filedEn: 'file',
          type: 'upload',
        }
      ],

      //更新选择数据库
      databaseShow: false,
      formUpdate: {
        database: '',
        tableId: '',
      },

      //更新结果
      updateShow: false,
      updateText: ''
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
  },
  methods: {
    // 查看（初始化）
    initClick () {
      console.log(this.form)
      let params = {
        name: this.form.name || '',
        abbreviation: this.form.abbreviation || '',
        sourceSystemName: this.form.sourceSystemName || '',
        sourceSystemAbbreviation: this.form.sourceSystemAbbreviation || '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableData = null
      queryExtractTable(params).then(res => {
        console.log(res, '抽取表查看')
        if (res.data.status == 1) {
          this.tableData = res.data.data.list
          this.totalNum = res.data.data.total
        } else {
          this.tableData = null
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
          if (item.selectedData && item.filedEn == 'sourceSystemId') {
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
      console.log(val)
      this.form = val
      this.initClick()
    },

    // 判断顶部事件
    btnClick (val) {
      console.log(val)
      // 再通过val事件的类型判断调用哪个接口
      if (val.type == '增加抽取表') {
        this.addShow = true
      } else if (val.type == '批量更新') {
        this.updateBatch()
      } else if (val.type == '导入') {
        // 调用导入接口
        this.importFile(val.file)
      } else if (val.type == '导出') {
        this.exportBatch()
      }
    },

    // 新增
    addClick (val) {
      console.log(val, 'xinzeng')
      this.addShow = false
      // if (val.status == 'ok') {
      //   let params = val.data
      //   // 本地时间传后台经浏览器转换为标准时间，两个时间存在8小时差异
      //   let timer = params.createDate.getTime() + 8 * 60 * 60 * 1000
      //   params.createDate = new Date(timer)
      //   saveExtractTable(params).then(res => {
      //     console.log(res)
      //     if (res.data.status == 1) {
      //       this.initClick()
      //       this.$Message.info(res.data.message)
      //     } else {
      //       this.$Message.error(res.data.message)
      //     }
      //   })
      // }

      if (val.status == 'ok') {
        let params = val.data
        let obj = new FormData();
        for (let i in params) {
          // console.log(params[i] + '---' + i)
          if (i == 'file' && params[i] != '') {
            obj.append('file', params[i])
          } else if (i != 'file') {
            obj.append(i, params[i])
          }
        }
        saveExtractTableTest(obj).then(res => {
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
      console.log(row)
      let params = row.newData
      params.id = row.oldData.id
      let obj = new FormData();
      for (let i in params) {
        console.log(params[i] + '---' + i)
        if (i == 'file' && params[i] != '') {
          console.log(1)
          obj.append('file', params[i])
        } else if (i != 'file') {
          console.log(2)
          obj.append(i, params[i])
        }
      }
      // // 本地时间传后台经浏览器转换为标准时间，两个时间存在8小时差异
      // let timer = params.createDate.getTime() + 8 * 60 * 60 * 1000
      // params.createDate = new Date(timer)
      // updateExtractTable(obj).then(res => {
      //   // console.log(res)
      //   if (res.data.status == 1) {
      //     this.initClick()
      //     this.$Message.info(res.data.message)
      //   } else {
      //     this.$Message.error(res.data.message)
      //   }
      // })

      updateExtractTableTest(obj).then(res => {
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
        deleteExtractTable(params).then(res => {
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

    // 表格其他点击事件(更新)
    otherClick (row) {
      if (row.type == '更新') {
        // this.formUpdate.tableId = this.tableData[row.index].id
        // this.databaseShow = true;
        this.updateBatch(this.tableData[row.index].id)
      }

    },
    // 表格其他点击事件
    // otherClick (row) {
    //   console.log(row)
    //   if (row.type == '查看表结构') {
    //     this.$router.push({
    //       name: 'tableStructure',
    //       query: {
    //         "id": this.tableData[row.index].id,
    //         "name": this.tableData[row.index].name,
    //         "abbreviation": this.tableData[row.index].abbreviation,
    //         "from": 'version'
    //       }
    //     })
    //   }
    // },

    // 更新-clear（取消）
    updateCancel () {
      this.formUpdate = {
        database: '',
        tableId: '',
      }
    },
    // 更新(id:单一更新,'':批量更新)
    updateBatch (id) {
      let params = {}
      if (id != undefined) {
        params.ids = id
      } else {
        if (this.selectArr == '') {
          this.$Message.info({
            content: '请选中数据!',
            duration: 4
          });
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
        params.ids = str
        this.clearSelectArr = true
      }
      updateExtractTableDetailById(params).then(res => {
        console.log(res, '单一更新')
        if (res.data.status == 1) {
          this.initClick()
        }
        let updateText = res.data.message
        this.updateText = updateText.replace(/\n/, '<br/>')
        this.updateShow = true
      })
    },

    //导入
    importFile (file) {
      // 接口参数（具体参数跟接口走）
      let params = new FormData();
      params.append('multipartFile', file)
      // console.log(file, 'file')
      importExtractTables(params).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.clearSelectArr = true
          this.initClick()
          this.$Message.info(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },

    //导出
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
      batchExportExtractTable(params).then(res => {
        console.log(res, 'ressss')
        let that_ = this
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
        r.readAsText(res.data) // FileReader的API
        // if (res.data.message) {
        //   this.$Message.error(res.data.message)
        // } else {
        //   let link = document.createElement('a')
        //   let blob = new Blob([res.data], { type: res.data.type });
        //   link.style.display = 'none';
        //   link.href = URL.createObjectURL(blob);
        //   let fileName = res.headers["content-disposition"].split('filename=')
        //   link.download = fileName[1];
        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
        // }
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
h3 {
  margin: 10px 0;
}
.process_content {
  width: 100%;
}
</style>
