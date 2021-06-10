<template>
  <div style="padding:0 20px 20px;position:relative;">
    <!-- <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-construct-outline" size="36" class="ios-construct-outline"></Icon>
      <div>该功能暂未开放,敬请期待...</div>
    </Spin>-->
    <Tabs value="name1">
      <TabPane label="导入" icon="ios-download-outline" name="name1">
        <div class="ivu-card-head">
          <p>文件上传</p>
        </div>
        <div style="padding:10px 0;">
          <Upload
            multiple
            action="/jsonplaceholder.typicode.com/posts/"
            show-upload-list
            :before-upload="handleFileUpload"
          >
            <Button icon="ios-cloud-upload-outline" size="small">上传文件</Button>
          </Upload>
        </div>

        <div class="ivu-card-head">
          <p>上传文件内容</p>
        </div>
        <div style="position:relative;min-height:100px;">
          <Spin size="large" fix v-if="spinShow">
            <Icon type="ios-construct-outline" size="36" class="ios-construct-outline"></Icon>
            <div>解析文件目录目录功能暂无开发，敬请期待</div>
          </Spin>
          <!-- <Tree :data="data5" :render="renderContent" class="demo-tree-render"></Tree> -->
        </div>
      </TabPane>
      <TabPane label="导出" icon="ios-cloud-upload-outline" name="name2">
        <div class="ivu-card-head">
          <p>导出类别</p>
        </div>
        <div class="top flex" style="display:flex;">
          <div class="flex-right" style="flex: 1 1 0%;border-radius: 5px;padding:10px;">
            <CheckboxGroup v-model="social">
              <Checkbox :label="item.label" v-for="(item, index) in exportArr">
                <Icon :type="item.icon"></Icon>
                <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                <span>{{ item.label }}</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div style="text-align:center;padding:10px 0; ">
          <Button type="primary" @click="handleExport" size="small">导出</Button>
        </div>
        <Divider style="margin:10px 0;" />
        <div class="content" style>
          <div class="ivu-card-head">
            <p>导出内容展示</p>
          </div>
          <div class="prev-content">
            <Tabs :value="prevTab">
              <TabPane v-for="(item,index) in prevTabArr" :label="item.label" :name="item.label">
                <prevTable :prevData="item" />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { ajaxExport, ajaxImport } from '@/api/export.js'
import prevTable from '@/view/io/components/prevTable.vue'
export default {
  name: 'importAndExport',
  props: [],
  data() {
    return {
      spinShow: true,
      data5: [
        {
          title: 'dist',
          expand: true,
          children: [
            {
              title: 'index.html',
              expand: true
            },
            {
              title: 'css',
              expand: true,
              children: [
                {
                  title: 'app.css',
                  expand: true
                },
                {
                  title: 'chunck.css',
                  expand: true
                }
              ]
            },
            {
              title: 'js',
              expand: true,
              children: [
                {
                  title: 'app.js',
                  expand: true
                },
                {
                  title: 'chunck.js',
                  expand: true
                }
              ]
            }
          ]
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      value1: '1',
      social: [],
      name1: '导出',
      prevTab: '集群',
      prevTabArr: [

      ],
      exportArr: [
        {
          label: '集群',
          icon: 'colony',
          name: '集群'
        },
        // {
        //   label: '环境',
        //   icon: 'environment',
        //   name: '环境'
        // },
        {
          label: '连接',
          name: '连接',
          icon: 'connect'
        },
        {
          label: '账号',
          name: '账号',
          icon: 'accountNumber'
        },
        // {
        //   label: '团队',
        //   name: '团队',
        //   icon: 'team'
        // },
        // {
        //   label: '成员',
        //   name: '成员',
        //   icon: 'accountNumber'
        // },
        {
          label: 'pipeline',
          name: 'pipeline',
          icon: 'flink'
        }
      ]
    }
  },
  components: {
    prevTable
  },
  computed: {},
  watch: {
    social(newVal, oldVal) {
      console.log('=========new', newVal)
      console.log('=========old', oldVal)
      let tableMap = {
        '集群': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'clusterType'
        },
        {
          title: '备注',
          key: 'description'
        }],
        '环境': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '所属集群',
          key: 'clusterName'
        },
        {
          title: '描述',
          key: 'description'
        }],
        '连接': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'connName'
        },
        {
          title: '所属集群',
          key: 'clusterName'
        },
        {
          title: '连接类型',
          key: 'connType'
        },
        {
          title: '描述',
          key: 'description'
        }],
        '账号': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '账号类型',
          key: 'categoryAccountName'
        },
        {
          title: '应用团队',
          key: 'teamName'
        },
        {
          title: '集群',
          key: 'clusterName'
        }, {
          title: '描述',
          key: 'description'
        }
        ],
        '团队': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'description'
        }],
        '成员': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '关联账号',
          key: 'age'
        },
        {
          title: '创建人',
          key: 'address'
        }],
        'pipeline': [{
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'dataflow_type'
        },
        {
          title: '创建人',
          key: 'address'
        }]

      }
      this.preTabArr = []
      this.prevTabArr = newVal.map(item => {
        let obj = {}
        obj.label = item
        obj.columns = tableMap[item]
        obj.tableData = []
        return obj
      });
      (this.prevTabArr.length > 0) && (this.prevTab = newVal[0])
    }
  },
  methods: {
    handleExport() {
      let postData = this.social
      let that = this
      let name = 'pipeline_'
      let lastName = this.$timeFormat(new Date().getTime(), '_').substring(0, 10)
      lastName = lastName.replace(/_/g, '')

      postData = {
        cluster: (this.social.indexOf('集群') != '-1'),
        con: (this.social.indexOf('连接') != '-1'),
        dataflow: (this.social.indexOf('pipeline') != '-1'),
        account: (this.social.indexOf('账号') != '-1')
        // fileName: name + lastName + '.txt'
      }
      if (!(postData.cluster || postData.con || postData.dataflow || postData.account)) {
        this.$Message.warning('请先选择下载的内容')
        return
      }
      ajaxExport(postData).then(res => {
        console.log('==========res', res)
        if (res.status == '200') {
          var eleLink = document.createElement('a')
          // eleLink.download = filename

          // 字符内容转变成blob地址
          var blob = new Blob([res.data])
          eleLink.href = URL.createObjectURL(blob)
          let resName = res.data && (res.data.substring(res.data.indexOf('_') + 1, res.data.indexOf('.txt'))) || ''

          eleLink.download = resName ? (name + resName + '.tar') : (name + lastName + '.tar')
          eleLink.style.display = 'none'
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        }
      })
    },
    renderContent(h, { root, node, data }) {
      let type = (data.children && data.children.length > 0) ? 'ios-folder-outline' : 'ios-paper-outline'

      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: type
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ])

      ])
    },
    handleFileUpload(file) {
      // let postData = new FormData()
      // postData.append('file', file, file.name)
      ajaxImport(file).then(res => {
        if (res.data.status == 'ok') {
          this.$Message.success(res.data.message || '上传成功')
        } else {
          this.$Message.error(res.data.message || '上传失败')
        }
        console.log('==============upload', res)
      }).catch(err => {
        this.$Message.error('与服务器通信失败')
      })
    }
  },
  created() { },
  mounted() {
    this.social = [].concat(['集群', '连接', '账号', 'pipeline'])
  }
}
</script>
