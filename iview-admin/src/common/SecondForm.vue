<template>
  <div>
    <Form
      ref="secondform"
      :model="form.model"
      :rules="form.rules"
      :label-width="100"
    >
      <FormItem
        :label="item.label"
        :prop="item.prop"
        v-for="(item, idx) in form.items"
      >
        <div v-if="!item.button">
           <Select
          v-if="item.type == 'select'"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          transfer
          filterable
          :disabled="item.disabled"
        >
          <Option
            v-for="(opt, index) in item.options"
            :key="index"
            :value="opt.value"
            :label="opt.label"
            >{{ opt.label }}</Option
          >
        </Select>
        <Input
          v-if="item.type == 'input'"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Input
          v-if="item.type == 'password'"
          type="password"
          password
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Input
          v-if="item.type == 'textarea'"
          type="textarea"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Cascader
          v-if="item.type == 'cascader'"
          v-model="form.model[item.prop]"
          :data="item.data"
          :load-data="item.loadData"
          :disabled="item.disabled"
        ></Cascader>
        <Upload

          :before-upload="handleUpload"
          v-if="item.type == 'file'"
          ref="upload"
          action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">{{item.label}}上传</Button>
        </Upload>
        <ul class="ivu-upload-list" v-if="((item.type == 'file')&&(form.model[item.prop].length))">
            <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for="(file,i) in form.model[item.prop]">
              <span>
                  <i class="ivu-icon ivu-icon-ios-document-outline"></i> {{file.name}}
              </span>
               <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" style="" @click="handleRemoveFile(item.prop)"></i> </li>
              </ul>
        </div>
        <div class="flex" style="display:flex;" v-else>
            <div class="item-content" style="flext-grow:auto;width:100%;margin-right:10px;">
              <Select
          v-if="item.type == 'select'"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          transfer
          filterable
          :disabled="item.disabled"
        >
          <Option
            v-for="(opt, index) in item.options"
            :key="index"
            :value="opt.value"
            :label="opt.label"
            >{{ opt.label }}</Option
          >
        </Select>
        <Input
          v-if="item.type == 'input'"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Input
          v-if="item.type == 'password'"
          type="password"
          password
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Input
          v-if="item.type == 'textarea'"
          type="textarea"
          v-model="form.model[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></Input>
        <Cascader
          v-if="item.type == 'cascader'"
          v-model="form.model[item.prop]"
          :data="item.data"
          :load-data="item.loadData"
          :disabled="item.disabled"
        ></Cascader>
        <Upload

          :before-upload="handleUpload"
          v-if="item.type == 'file'"
          ref="upload"
        action="//baidu.com.typicode.com/posts1ssss/">
        <Button icon="ios-cloud-upload-outline">{{item.label}}上传</Button>
        </Upload>
          <ul class="ivu-upload-list" v-if="((item.type == 'file')&&(form.model[item.prop].length))">
            <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for="(file,i) in form.model[item.prop]">
              <span>
                  <i class="ivu-icon ivu-icon-ios-document-outline"></i> {{file.name}}
              </span>
               <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" style="" @click="handleRemoveFile(item.prop)"></i> </li>
              </ul>
            </div>
            <div class="item-button" style="flext-grow:1;">
              <Button type="primary" @click="item.buttonFun" >{{item.buttonText}}</Button>
            </div>

        </div>

      </FormItem>

      <FormItem style="text-align: right; padding-top: 10px">
        <Button type="default" @click="cancel" style="margin-right: 5px"
          >取消</Button
        >

        <Button type="primary" @click="ok" style="margin-right: 5px"
          >确定</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ajaxGetEnv, ajaxAddEnv, ajaxDeleteEnv } from '@/api/env.js'
import { getLink } from '@/api/link.js'
export default {
  name: 'SecondForm',
  props: ['form'],
  data () {
    return {
      // form: {
      //   ref: 'formValidate',
      //   rules: {
      //     belongFamily: [
      //       { required: true, message: '所属家庭不能为空', trigger: 'change' }
      //     ],
      //     ishouseholder: [
      //       { required: true, message: '所属家庭不能为空', trigger: 'change' }
      //     ],
      //     name: [
      //       {
      //         required: true, message: '成员名称不能为空', trigger: 'blur'
      //       },
      //       {
      //         required: true, message: '成员名称不能为空', trigger: ['change', 'blur']
      //       }]

      //   },
      //   model: {
      //     ishouseholder: '',
      //     name: '',
      //     belongFamily: '',
      //     card: '',
      //     belonghouseholderrole: ''
      //   },
      //   items: [{
      //     type: 'input',
      //     label: '成员名称',
      //     prop: 'name',
      //     placeholder: '请输入'
      //   },
      // {
      //     type: 'cascader',
      //     label: '成员名称',
      //     prop: 'name',
      //     placeholder: '请输入',
      //     data:[],
      //     loadData:()=>{

      // },
      //   },
      // {
      //     type: 'select',
      //     label: '是否为户主',
      //     prop: 'ishouseholder',
      //     placeholder: '请输入',
      //     options: [{
      //       key: 'key1',
      //       value: 'true',
      //       label: '是'
      //     },
      //     {
      //       key: 'key2',
      //       value: 'false',
      //       label: '否'

      //     }]

      //   },
      //   {
      //     type: 'select',
      //     label: '所属家庭',
      //     prop: 'belongFamily',
      //     placeholder: '请输入',
      //     options: []

      //   },

      //   {
      //     type: 'input',
      //     label: '证件号',
      //     prop: 'card',
      //     placeholder: '请输入'
      //   }, {
      //     type: 'input',
      //     label: '家庭角色',
      //     prop: 'belonghouseholderrole',
      //     placeholder: '请输入'
      //   }]
      // }
    }
  },
  methods: {
    handleRemoveFile (key) {
      this.form.model[key] = []
    },
    handleUpload (file) {
      this.form.model.file = [file]
      return false
    },
    ok () {
      this.$refs.secondform.validate(validate => {
        if (validate) {
          let obj = this.getFormData()
          this.$emit('handleOk', obj)
        } else {

        }
      })
    },
    cancel () {
      this.handleFormReset()
      this.$emit('handleCancel')
    },
    handleFormReset () {
      this.$refs['secondform'].resetFields()
      if ('file' in this.form.model) {
        this.$refs.upload[0].clearFiles()
        this.form.model.file = []
      }
    },
    getFormData () {
      let obj = {}
      let that = this
      Object.keys(this.form.model).map(k => {
        if (k != 'file') {
          obj[k] = this.form.model[k]
        } else {
          obj.files = this.form.model.file
        }
      })

      return obj
    }

  },
  created () { },
  mounted () {

  }
}
</script>
