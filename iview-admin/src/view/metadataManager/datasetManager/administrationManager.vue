<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <Row>
            <Col span="16">
              <i-form
                ref="searchForm"
                :model="searchForm"
                inline
                label-position="right"
                :label-width="searchWidth"
              >
                <Form-item label="名称" prop="name">
                  <Input
                    v-model="searchForm.name"
                    size="small"
                    placeholder="请输入pipeline名称"
                    style="width: 120px"
                  />
                </Form-item>
                <Form-item label="类型" prop="type">
                  <i-select
                    v-model="searchForm.type"
                    size="small"
                    placeholder="请选择类型"
                    style="width: 120px"
                  >
                    <i-option
                      v-for="item in typeList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.label }}</i-option>
                  </i-select>
                </Form-item>
                <Form-item label-width="10">
                  <Button type="primary" size="small" @click="search()">搜索</Button>
                </Form-item>
              </i-form>
            </Col>
            <Col span="8" style="text-align: right;">
              <Button type="success" size="small" @click="add">添加</Button>
            </Col>
          </Row>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="getTableData" border>
              <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button
                  type="success"
                  size="small"
                  style="margin-right: 5px"
                  @click="changeHistory(row)"
                >变更</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
                <Button type="error" size="small" @click="remove(index)">删除</Button>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="modal1"
      :title="modai1Title?'编辑':'添加'"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change('formValidate')"
    >
      <div class="formWrapper">
        <!-- :rules="ruleValidate" -->
        <Form ref="formValidate" :model="formValidate" :label-width="labelWidth">
          <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="类型" prop="type">
            <Select v-model="formValidate.type" placeholder="请选择">
              <Option value="1">kafka</Option>
              <Option value="2">hbase</Option>
            </Select>
          </FormItem>
          <FormItem label="集群" prop="cluster">
            <Select v-model="formValidate.cluster" placeholder="请选择">
              <Option value="1">主集群1</Option>
              <Option value="2">主集群2</Option>
            </Select>
          </FormItem>
          <FormItem label="创建者" prop="user">
            <Input v-model="formValidate.user" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="创建时间" prop="createTime">
            <Input v-model="formValidate.createTime" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="标签" prop="label">
            <Select v-model="formValidate.label" placeholder="请选择">
              <Option value="1">标签1</Option>
              <Option value="2">标签2</Option>
            </Select>
          </FormItem>
          <FormItem label="应用详情" prop="application">
            <Input v-model="formValidate.application" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="变更历史" prop="changeHistory">
            <Input v-model="formValidate.changeHistory" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'administrationManager',
  data() {
    return {
      searchWidth: 42,
      labelWidth: 80,
      searchForm: {
        type: '',
        name: ''
      },
      typeList: [
        {
          id: '1',
          label: '全部'
        },
        {
          id: '2',
          label: '流式'
        },
        {
          id: '3',
          label: '批量'
        }
      ],
      exportLoading: false,
      current: 1,
      size: 10,
      tableTitle: [
        {
          // type: "index",
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            console.log('params======', params)
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: '名称',
          key: 'name',
          width: '120'
        },
        {
          title: '类型',
          key: 'type',
          width: '100'
        },
        {
          title: '所属集群',
          key: 'cluster',
          width: '120'
        },
        {
          title: '创建者',
          key: 'user',
          width: 120
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: '120'
        },
        {
          title: '标签',
          key: 'label',
          width: '120'
        },
        {
          title: '应用详情',
          key: 'application',
          width: '120'
        },
        {
          title: '变更历史',
          key: 'changeHistory',
          width: '120'
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          align: 'center'
        }
      ],
      tableData: [
        {
          name: 'pipeline1',
          type: '1',
          cluster: '1',
          user: 'admin',
          createTime: '2020-06-04 14:00:12',
          label: '2',
          application: 'kafka应用',
          changeHistory: 'v3'
        },
        {
          name: 'pipeline2',
          type: '2',
          cluster: '2',
          user: 'admin',
          createTime: '2020-06-04 14:00:12',
          label: '1',
          application: 'hbase应用',
          changeHistory: 'v2'
        },
        {
          name: 'pipeline3',
          type: '2',
          cluster: '3',
          user: 'admin',
          createTime: '2020-06-04 14:00:12',
          label: '1',
          application: 'kafka应用',
          changeHistory: 'v1'
        }
      ],
      modal1: false,
      modai1Title: false,
      formValidate: {
        name: '',
        type: '',
        cluster: '',
        user: '',
        createTime: '',
        label: '',
        application: '',
        changeHistory: ''
      }
    }
  },
  computed: {
    getTableData() {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        let rule1 = index >= (this.current - 1) * this.size
        let rule2 = index < this.current * this.size
        return rule1 && rule2
      })
      return arr
    }
  },
  methods: {
    add() {
      this.modal1 = true
      this.modai1Title = false
    },
    changeHistory(row) {
      this.$router.push({
        path: 'changeManager',
        query: {
          name: row.name,
          version: row.changeHistory
        }
      })
    },
    edit(row) {
      this.modal1 = true
      this.modai1Title = true
      // this.formValidate = Object.assign({}, row)
      this.formValidate = { ...row }
    },
    remove(index) {
      this.tableData.splice(index, 1)
    },
    search() {

    },
    pageChange(val) {
      this.current = +val
    },
    change(name) {
      // this.handleReset(name);
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    getFormData() {
      let postData = {
        ppName: '',
        ppStatus: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()

      this.tableData.push(postData)
      this.handleReset('formValidate')
    },
    cancel() {
      this.handleReset('formValidate')
    }
  },
  created() { },
  mounted() {
  }
}
</script>
