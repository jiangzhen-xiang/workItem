<template>
  <div class="tableNew">
    <div class="context">
      <!-- class="tabWrapper" -->
      <Table stripe
             ref="tableName"
             :data="tableData"
             :columns="tableTitle"
             :height="height?height:tableHeight"
             :loading="tableLoading"
             @on-select="selectChange"
             @on-select-cancel="selectChangeCancel"
             @on-select-all="selectChange"
             @on-select-all-cancel="selectChangeCancel">
        <template slot-scope="{row,index}"
                  v-if="tableSlot == ''? false: true"
                  :slot="tableSlot">
          <!-- :class="tableSlot" style="margin-left: 20px" -->
          <Dropdown trigger="click">
            <Button type="primary">
              操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,indexBtn) in tableOperationBtn"
                            :key="indexBtn"
                            :divided="indexBtn == 0? false: true"
                            @click.native="item.clickBtn(row,index)">{{item.title}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </Table>
    </div>
    <!-- 修改 -->
    <TableInset v-if="ediShow"
                modalTItle="编辑"
                :titleData="ediTitle"
                :tableInsertShow="ediShow"
                :tableInsertData="ediData"
                @tableInsert="editorResults"></TableInset>

    <!-- 删除 -->
    <Modal title="Title"
           :closable="false"
           :mask-closable="false"
           v-model="delModal"
           class-name="vertical-center-modal">
      <p slot="header"
         style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除</span>
      </p>
      <div v-html="deleteText"> </div>
      <div slot="footer">
        <Button type="info"
                @click="deleteCancel">取消</Button>
        <Button type="error"
                @click="deleteOk">删除</Button>
      </div>
    </Modal>

    <!-- 调用下计算属性 -->
    <div style="display:none">{{selectArrList}}</div>
  </div>
</template>

<script>
import TableInset from "../TableInset"
export default {
  name: 'TableNew',
  props: {
    // 表格数据
    data: {
      type: Array,
    },

    // 表格title
    title: {
      type: Array,
    },

    // 表格高度
    height: {
      type: Number
    },

    // 表格操作列数据
    tableOperation: {
      type: Array,
      default: () => {
        return [{
          title: '编辑',
          clickBtn: 'editorTab',
          formList: [
            {
              title: '姓名',
              filedEn: 'tableNameEn',
              type: 'input',
              isVerify: true,
              ruleVerify: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
            },
            {
              title: '地址',
              filedEn: 'platType',
              type: 'select',
              isVerify: true,
              ruleVerify: [{ required: true, message: 'Please select the city', trigger: 'change' }],
              selectedData: [{
                title: 'B1',
                value: 'B1'
              }, {
                title: 'B2',
                value: 'B2'
              }, {
                title: 'B3',
                value: 'B3'
              }, {
                title: 'B4',
                value: 'B4'
              }]
            },
            {
              title: '日期时间',
              filedEn: 'timer',
              type: 'datetime',
            },
            {
              title: '日期',
              filedEn: 'date',
              type: 'date',
              isVerify: true,
              ruleVerify: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change' }],
            },
            {
              title: '时间',
              filedEn: 'time',
              type: 'time',
              isVerify: false,
            }
          ]
        },
        {
          title: '删除',
          clickBtn: 'deleteTab'
        }]
      }
    },

    // 表格删除展示语
    deleteText: {
      type: String,
      default: '确认删除！'
    },

    // 表格下是否有分页（通过这个区分表格高度）
    noPage: {
      type: Boolean,
      default: false
    },

    // 多选清空
    clearSelectArr: {
      type: Boolean,
      default: false
    }

  },
  components: {
    TableInset
  },
  data () {
    return {
      tableData: [],                     // tab数据
      tableHeight: 0,                    // tab高度
      selectArr: [],                     // tab多选数据
      selectObj: {},                     // tab多选数据验证是否重复
      delModal: false,                   // 删除modal-
      delIndex: null,                    // 删除下标
      ediShow: false,                    // 编辑modal-
      ediIndex: null,                    // 编辑下标
      ediData: {},                       // 编辑数据
    }
  },
  computed: {
    //表格title
    tableTitle () {
      return this.title
    },
    //表格加载
    tableLoading () {
      return this.data == null ? true : false
    },
    //表格操作列slot名称
    tableSlot () {
      let obj = this.title[this.title.length - 1]
      if (obj.title == '操作') {
        return obj.slot
      } else {
        return ''
      }
    },
    //表格操作列数据处理（事件）
    tableOperationBtn () {
      let newArr = [...this.tableOperation]
      newArr.forEach(item => {
        let _this = this;
        if (item.url) {
          item.clickBtn = function (row, index) {
            return _this.todetail(row, index, item.url)
          }
        } else if (item.clickBtn == 'editorTab') {
          item.clickBtn = function (row, index) {
            return _this.editorTab(row, index)
          }
        } else if (item.clickBtn == 'deleteTab') {
          item.clickBtn = function (row, index) {
            return _this.deleteTab(row, index)
          }
        } else if (!item.clickBtn) {
          item.clickBtn = function (row, index) {
            return _this.btnClick(row, index, item.title)
          }
        }
      })
      return newArr
    },
    // 编辑弹框title
    ediTitle () {
      let obj = this.tableOperation.filter((item) => item.title == '编辑')[0];
      return obj.formList
    },
    // 表格-多选数据监听传输到父组件
    selectArrList () {
      this.$emit('selectCheck', {
        selectArr: this.selectArr
      })
      return this.selectArr
    }
  },
  watch: {
    // 全选
    // allChecked (newVal) {
    //   console.log(newVal, 'xandahsjkf')
    //   if (!newVal) {
    //     this.selectArr = []
    //     this.selectObj = {}
    //   }
    // },
    // 表格-多选复选
    data: function (newVal) {
      // console.log(newVal, newVal != null, 'newVal')
      if (newVal != null) {
        newVal.forEach((item) => {
          if (this.selectObj[item.applicationName]) {
            item["_checked"] = true
          }
        })
        this.tableData = newVal;
        // console.log(this.tableData, 'table')
      }
    },
    // 表格-多选清空
    clearSelectArr: function (newVal) {
      console.log(newVal, 'clearSelectArr')
      if (newVal == true) {
        this.selectArr = []
        this.selectObj = {}
        console.log(this.data)
        this.tableData = this.data
      }
    }
  },
  methods: {
    // 表格-多选-选中
    selectChange (val) {
      console.log(val, '选中')
      val.forEach((item) => {
        // 通过唯一标识，数据去重(暂用id)
        if (!this.selectObj[item.applicationName]) {
          this.selectArr.push(item)
          this.selectObj[item.applicationName] = true;
        }
      })
    },

    // 表格-多选-取消选中
    selectChangeCancel (val, row) {
      console.log(val, '取消')
      if (row) {
        // 取消单个
        this.selectArr.forEach((item, index) => {
          if (item.applicationName == row.applicationName) {
            this.selectArr.splice(index, 1)
            delete this.selectObj[item.applicationName]
          }
        })
      } else {
        // 取消本页全部
        this.tableData.forEach((nape) => {
          this.selectArr.forEach((item, index) => {
            if (item.applicationName == nape.applicationName) {
              this.selectArr.splice(index, 1)
              delete this.selectObj[item.id]
            }
          })
        })
      }
    },

    // 编辑
    editorTab (row, index) {
      console.log('编辑', row, index)
      this.ediIndex = index
      this.ediData = row
      this.ediShow = true
    },
    // 编辑结果
    editorResults (val) {
      // console.log(val)
      this.ediShow = false
      if (val.status == 'ok') {
        this.$emit('editorClick', {
          'type': 'editor',
          'index': this.ediIndex,
          'newData': val.data,
          'oldData': this.ediData
        })
      }
    },

    // 删除
    deleteTab (row, index) {
      this.delModal = true;
      this.delIndex = index;
      this.$emit('deleteClick', {
        'type': 'delete',
        'index': this.delIndex,
        'boolean': false
      })
    },
    // 删除确定
    deleteOk () {
      // console.log('删除')
      this.$emit('deleteClick', {
        'type': 'delete',
        'index': this.delIndex,
        'boolean': true
      })
      this.deleteCancel()
    },
    // 删除取消
    deleteCancel () {
      // console.log('取消')
      this.delModal = false;
      this.delIndex = null;
    },

    // 跳转详情
    todetail (row, index, pathUrl) {
      console.log('跳转', row)
      this.$router.push({
        name: pathUrl,
        query: {
          "detailData": row,
          "id": row.id,
          "name": row.name
        }
      })
    },

    // 其他按钮点击事件
    btnClick (row, index, clickType) {
      this.$emit('otherClick', {
        'type': clickType,
        'index': index,
      })
    }

  },
  mounted () {
    this.$nextTick(() => {
      let parentOffsetTop = document.querySelector('.tableNew').parentElement.offsetTop;
      //noPage判断表格下是否有分页，再设置表格高度
      if (!this.noPage) {
        this.tableHeight = window.innerHeight - parentOffsetTop - 130;
      } else {
        console.log(parentOffsetTop, window.innerHeight, this.tableHeight,)
        this.tableHeight = window.innerHeight - parentOffsetTop - 80;
      }
    })
  },
  created () {

  }
}
</script>

<style >
.tableNew .context {
  width: 100%;
  height: 100%;
  margin-top:20px;
}
.context .ivu-table-cell {
  padding-left: 5px;
  padding-right: 5px;
}
.vertical-center-modal {
  /* display: flex;
  align-items: center;
  justify-content: center; */
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.vertical-center-modal .ivu-modal {
  top: 0;
}

/* .ivu-table-cell-slot */
.ivu-btn.ivu-btn-small {
  margin-right: 4px;
}
</style>
