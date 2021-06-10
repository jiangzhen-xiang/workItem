<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <Row>
            <i-col span="16">
              <i-form
                ref="searchForm"
                :model="searchForm"
                inline
                label-position="right"
                :label-width="searchWidth"
              >
                <Form-item label="团队名称" prop="memberName">
                  <Input
                    v-model="searchForm.memberName"
                    size="small"
                    placeholder="请输入团队名称"
                    style="width: 40px"
                  />
                </Form-item>
                <Form-item label-width="10">
                  <Button type="primary" size="small" @click="search()">搜索</Button>
                </Form-item>
              </i-form>
            </i-col>
            <i-col span="8" style="text-align: right;">
              <Button type="success" size="small" @click="add">添加</Button>
            </i-col>
          </Row>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="getTableData" border>
              <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
                <Button type="error" size="small" @click="remove(row)">删除</Button>
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
          <FormItem label="团队成员名称" prop="memberName">
            <Input v-model="formValidate.memberName" placeholder="请输入团队名称"></Input>
          </FormItem>
          <FormItem label="登陆账号" prop="memberNumber">
            <Input v-model="formValidate.memberNumber" placeholder="请输入团队名称"></Input>
          </FormItem>
          <FormItem label="账号密码" prop="memberPwd">
            <Input v-model="formValidate.memberPwd" placeholder="请输入团队名称"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { teamFunc } from '@/api/team.js'
export default {
  name: 'member',
  data() {
    return {
      searchWidth: 80,
      labelWidth: 110,
      searchForm: {
        memberName: ''
      },
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
          title: '团队名称',
          key: 'memberName'
        },
        {
          title: '关联账号',
          key: 'memberNumber',
          width: '100'
        },
        {
          title: '创建者',
          key: 'memberPwd'

        },
        {
          title: '创建时间',
          key: 'crtDateStr'

        },
        {
          title: '操作',
          slot: 'action',
          width: 30,
          align: 'center'
        }
      ],
      tableData: [
        {
          memberName: 'team1',
          account: 'admin',
          user: 'zhangsan',
          createTime: '2020-06-04 14:00:12'
        },
        {
          memberName: 'team2',
          account: 'admin',
          user: 'lisi',
          createTime: '2020-06-04 14:00:12'
        },
        {
          memberName: 'team3',
          account: 'admin',
          user: 'wangwu',
          createTime: '2020-06-04 14:00:12'
        }
      ],
      modal1: false,
      modai1Title: false,
      formValidate: {
        memberName: '',
        memberPwd: '',
        memberNumber: ''
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
    getMemberData() {
      const getTeamObj = {

        pageSize: this.size,
        pageNum: this.current,
        teamId: this.$route.query.id
      }
      this.loading = true
      teamFunc.getMemberListApi(getTeamObj).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$Message.error('查询团队数据失败')
        }
      })
        .catch((error) => {
          this.loading = false

          this.$Message.error('查询团队数据失败')
        })
    },
    add() {
      this.modal1 = true
      this.modai1Title = false
    },
    edit(row) {
      this.modal1 = true
      this.modai1Title = true
      // this.formValidate = Object.assign({}, row)
      this.formValidate = { ...row }
    },
    handleMemberTeam(row) {
      this.loading = true
      teamFunc.deleteMemberApi(row).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
          this.$Message.success('删除团队成员成功')
          this.getMemberData()
        } else {
          this.$Message.error('删除团队成员失败')
        }
      })
        .catch((error) => {
          this.loading = false

          this.$Message.error('删除团队失败')
        })
    },
    remove(params) {
      this.$Modal.confirm({
        title: '消息提示',
        closable: true,
        content: '删除该数据后将不可恢复，是否删除?',
        loading: true,
        onOk: () => {
          this.handleMemberTeam(params)
          this.$Modal.remove()
          this.modal1 = false
        }
      })
    },
    search() {
      let postData = {}
      postData.memberNumber = this.searchForm.memberNumber
      postData.pageSize = 10
      postData.pageNum = 1
      this.loading = true
      teamFunc.getMemberListApi(postData).then(res => {
        this.loading = false
        if (res.data.status == 'ok') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$Message.error('查询团队数据失败')
        }
      })
        .catch((error) => {
          this.loading = false

          this.$Message.error('查询团队数据失败')
        })
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
        memberName: '',
        memberPwd: '',
        memberNumber: ''

      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      postData.teamId = this.$route.query.id;
      ('id' in this.formValidate) && (postData.id = this.formValidate.id)
      return postData
    },
    ok() {
      let postData = this.getFormData()
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          if ('id' in postData) {
            teamFunc.editMemberApi(postData).then(res => {
              if (res.data.status == 'ok') {
                this.$Message.success('编辑成功')
                this.handleReset('formValidate')
                this.getMemberData()
              } else {
                this.$Message.error('添加团队失败')
              }
            }).catch(err => {
              this.$Message.error('与服务器通信失败')
            })
          } else {
            teamFunc.addMemberApi(postData).then(res => {
              if (res.data.status == 'ok') {
                this.$Message.success('添加成功')
                this.handleReset('formValidate')
                this.getMemberData()
              } else {
                this.$Message.error('添加团队失败')
              }
            }).catch(err => {
              this.$Message.error('与服务器通信失败')
            })
          }
        }
      })
    },
    cancel() {
      this.handleReset('formValidate')
    }
  },
  created() { },
  mounted() {
    this.getMemberData()
  }
}
</script>
