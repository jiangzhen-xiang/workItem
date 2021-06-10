<template>
  <div>
    <Tabs value="name1">
      <TabPane label="通用" name="name1">
        <Form ref="formBasic" :model="formBasic" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="dataSetName">
            <Input v-model="formBasic.dataSetName" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="描述" prop="desc">
            <Input
              v-model="formBasic.desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入"
            ></Input>
          </FormItem>

          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">标签增加</label>
              <Button type="default" @click="handleAddAnnotions">增加</Button>
            </div>
            <div class="itemWrapper">
              <FormItem
                v-for="(item, index) in formBasic.annotions"
                :key="index"
                label="标签"
                :prop="item.name"
              >
                <Row>
                  <Col span="18">
                    <Input type="text" v-model="item.name" placeholder="请输入"></Input>
                  </Col>
                  <Col span="4" offset="1" style="text-align:right;float:right;">
                    <Button @click="handleRemove(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </Form>
      </TabPane>
      <TabPane label="连接" name="name2">
        <Form ref="formLink" :model="formLink" :rules="ruleValidate" :label-width="80">
          <FormItem label="HTTP连接" prop="url">
            <Row>
              <Col span="18">
                <Select v-model="formLink.url">
                  <Option
                    v-for="item in urlArr"
                    :value="item.url"
                    :key="item.linkName"
                  >{{ item.linkName }}</Option>
                </Select>
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleAddLink(index)">新建</Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem label="连接名称" prop="linkName">
            <Input v-model="formLink.linkName" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="参数" name="name3">
        <Form ref="formParam" :model="formParam" :rules="ruleValidate" :label-width="80">
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">参数增加</label>
              <Button type="default" @click="handleAddParams">增加</Button>
            </div>
            <div class="itemWrapper">
              <Table :loading="loading" :columns="tableTitle" :data="formParam.params" border>
                <template slot-scope="{ row }" slot="type">
                  <Select v-model="row.url" transfer>
                    <Option
                      v-for="item in typeArr"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.name }}</Option>
                  </Select>
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="formParam.params.length"
                  show-total
                  show-elevator
                  @on-change="pageChange"
                />
              </div>
            </div>
          </div>
        </Form>
      </TabPane>
    </Tabs>

    <!-- 弹窗 -->
    <Modal v-model="modal1" title="增加服务连接" footer-hide>
      <div class="formWrapper">
        <component
          ref="modalForm"
          @handleSuccess="handleSuccessModal"
          @handleFail="handleFailModal"
          :is="zjName"
        ></component>
      </div>
    </Modal>
  </div>
</template>
<script>
import mongodbForm from './mongodbForm'
export default {
  name: 'mongodbTab',
  data() {
    return {
      modal1: false,
      curModal: 'mongodbForm',
      loading: false,
      current: 1,
      size: 10,
      minWidth: 120,
      tableTitle: [
        {
          title: '名称',
          key: 'nameame',

          render: (h, params) => {
            return h('div', [
              h(
                'Input',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    placeholder: '请输入',
                    value: params.row.name

                  }

                }
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 120,
          slot: 'type'

        },
        {
          title: '数值',
          key: 'value',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Input',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    placeholder: '请输入',
                    value: params.row.value

                  }

                }
              )
            ])
          }
        },
        {
          title: 'Action',
          key: 'action',

          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '消息提示',
                        closable: true,
                        content: '删除该数据后将不可恢复，是否删除?',
                        loading: true,
                        onOk: () => {
                          this.tableData.splice(
                            +params.index + this.size * (this.current - 1),
                            1
                          )
                          this.$Modal.remove()
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],

      formBasic: {
        dataSetName: '',
        desc: '',
        annotions: [
          {
            name: ''
          }
        ]
      },
      urlArr: [{
        id: 1,
        value: 1,
        linkName: 'mongodb'
      }],
      typeArr: [{

        value: 'string',
        name: 'string'
      },
      {

        value: 'double',
        name: 'double'
      },
      {

        value: 'timestamp',
        name: 'timestamp'
      },
      {

        value: 'integer',
        name: 'integer'
      }],
      formLink: {
        linkName: '',
        url: ''
      },
      formParam: {
        params: [
          {
            name: '',
            type: '',
            value: ''
          }
        ]
      },
      ruleValidate: {
        dataSetName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    zjName() {
      return this.curModal
    }
  },
  components: {
    mongodbForm
  },
  methods: {
    handleFailModal() {

    },
    handleSuccessModal(postData) {
      this.modal1 = false
      console.log('linkPostData', postData)
      this.urlArr.push(postData)
      this.formLink.url = postData.url
    },
    handleAddLink() {
      this.curModal = 'mongodbForm'
      this.modal1 = true
    },
    pageChange(val) {
      this.current = val
    },
    handleAddParams() {
      this.formParam.params.unshift({ name: '', value: '', type: '' })
    },
    handleAddAnnotions() {
      this.formBasic.annotions.unshift({ name: '' })
    },
    handleRemove(index) {
      this.formBasic.annotions.splice(index, 1)
    },
    getFormData() {
      let postData = {
        dataSetName: '',
        url: '',
        username: '',
        password: '',
        desc: '',
        annotions: []
      }
      for (let k in postData) {
        postData[k] = this.formBasic[k]
      }
      postData.type = 'mongodb'
      return postData
    }
  },
  created() { },
  mounted() { }
}
</script>
