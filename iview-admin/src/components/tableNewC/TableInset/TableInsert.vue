<template>
  <div class="tableInset">
    <Modal :title="modalTItle"
           v-model="modalShow"
           :mask-closable="false"
           :closable="false">
      <div>
        <Form ref="formInsertValidate"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="130">
          <FormItem v-for="item in formTitle"
                    :key="item.title"
                    :label="item.title"
                    :prop="item.type == 'upload'?'':item.filedEn">
            <Input v-if="item.type == 'input'? true: false"
                   v-model="formValidate[item.filedEn]"
                   :placeholder="item.title+'...'" />
            <Select v-else-if="item.type == 'select'? true: false"
                    v-model="formValidate[item.filedEn]"
                    placeholder="请选择...">
              <Option v-for="(item1,index1) in item.selectedData"
                      :key="index1"
                      :value="item1.value">{{item1.title}}</Option>
            </Select>
            <DatePicker v-else-if="item.type == 'datetime'? true: false"
                        v-model="formValidate[item.filedEn]"
                        type="datetime"
                        placeholder="请选择日期和时间..."
                        style="width: 100%">
            </DatePicker>
            <DatePicker v-else-if="item.type == 'date'? true: false"
                        v-model="formValidate[item.filedEn]"
                        type="date"
                        style="width: 100%"
                        placeholder="请选择日期...">
            </DatePicker>
            <TimePicker v-else-if="item.type == 'time'? true: false"
                        v-model="formValidate[item.filedEn]"
                        type="time"
                        style="width: 100%"
                        placeholder="请选择时间...">
            </TimePicker>
            <RadioGroup v-model="formValidate[item.filedEn]"
                        v-else-if="item.type == 'radio'? true: false">
              <Radio label="male">Male</Radio>
              <Radio label="female">Female</Radio>
            </RadioGroup>
            <CheckboxGroup v-model="formValidate[item.filedEn]"
                           v-else-if="item.type == 'checkbox'? true: false">
              <Checkbox label="Eat"></Checkbox>
              <Checkbox label="Sleep"></Checkbox>
              <Checkbox label="Run"></Checkbox>
              <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
            <Input v-model="formValidate[item.filedEn]"
                   v-else-if="item.type == 'textarea'? true: false"
                   type="textarea"
                   :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入..." />
            <Upload v-model="formValidate[item.filedEn]"
                    v-else-if="item.type == 'upload'? true: false"
                    :show-upload-list="false"
                    :before-upload="handleBeforeUpload"
                    action>
              <Button type="info">上传</button>
              {{uploadFile}}
            </Upload>
          </FormItem>
          <!-- <div style="width:auto;display:inline-block;">
            accept=".xlsx"
          </div> -->
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleCancel">取消</Button>
        <Button @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'tableInsert',
  props: {
    // 显示隐藏
    tableInsertShow: {
      type: Boolean
    },

    // 控件list
    titleData: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 控件反显（默认空，编辑时使用）
    tableInsertData: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // modalTItle(弹框title)
    modalTItle: {
      type: String,
      default: '新增'
    }
  },
  data () {
    return {
      formValidate: {},
      ruleValidate: {},
    }
  },
  computed: {
    // modal展示隐藏
    modalShow () {
      return this.tableInsertShow
    },
    // 控制渲染对应控件
    formTitle () {
      return this.titleData
    },
    //上传文件名称
    uploadFile () {
      console.log(this.formValidate, 'this.formValidate')
      return this.formValidate.file && this.formValidate.file.name ? this.formValidate.file.name : ''
    },
    //form展示头部：新增、编辑
    // modalTItleC () {
    //   return this.modalTItle
    // }
  },
  watch: {
    // form校验规则
    formTitle: {
      handler (newVal) {
        let obj = {}
        for (let i = 0; i < newVal.length; i++) {
          // 添加校验
          if (newVal[i].isVerify == true) {
            this.ruleValidate[newVal[i].filedEn] = newVal[i].ruleVerify
          }
          // 添加表单属性对应存储
          obj[newVal[i].filedEn] = ''
        }
        this.formValidate = obj
      },
      immediate: true,
      deep: true
    },

    tableInsertData: {// 编辑反显
      handler (newVal) {
        for (let i in this.formValidate) {
          if (newVal[i]) {
            if (i.includes('time') && newVal[i].includes('-')) {
              this.formValidate[i] = new Date(newVal[i])
              continue;
            }
            this.formValidate[i] = newVal[i]
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 上传
    handleBeforeUpload (file) {
      console.log(file)
      // 验证是否是空文件
      if (file.size == 0) {
        this.$Message.info('文件大小为0kb,空文件不可上传！')
        return false
      }
      // // 验证文件类型在外面写
      // let fileSuffix = file.name.split('.')[1]
      // if (fileSuffix != 'xlsx') {
      //   this.$Message.info('仅可上传文件后缀名为xlsx的文件')
      //   return false
      // }
      this.formValidate.file = file
      // 接口参数（具体参数跟接口走）
      // let params = new FormData();
      // params.append('file', file, file.name)
      // 调用接口 在调用接口前，加载框打开，成功后关闭
      return false
    },
    // 确定
    handleSubmit () {
      this.$refs['formInsertValidate'].validate((valid) => {
        let formValidate = { ...this.formValidate }
        if (valid) {
          this.$emit('tableInsert', {
            status: 'ok',
            data: formValidate,
          })
          this.$refs['formInsertValidate'].resetFields();
          if (this.formValidate.file) {
            this.formValidate.file = ''
          }
        } else {
          this.$Message.error('请填写信息！');
        }
        this.clear()
      })
    },
    // 取消
    handleCancel () {
      // console.log(this.formValidate)
      this.$emit('tableInsert', {
        status: 'fail',
      })
      this.$refs['formInsertValidate'].resetFields();
      if (this.formValidate.file) {
        this.formValidate.file = ''
      }
    },
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style>
</style>