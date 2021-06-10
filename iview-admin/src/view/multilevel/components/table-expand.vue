<template>
  <div>
    <Row class="expand-row" v-for="(item, index) in row.fileList" :key="index">
      <i-col span="6">
        <span class="expand-key">文件名称:{{ item.name }}</span>
      </i-col>
      <i-col span="6">
        <Button
          type="error"
          @click="removeFileFunc(item.id, index)"
          size="small"
          style="float:right;"
        >文件删除</Button>
        <Button
          type="primary"
          @click="download(item.id)"
          size="small"
          style="float:right; margin-right:10px;"
        >下载</Button>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { userFunc } from '@/api/user1.js'
export default {
  props: {
    row: Object
  },
  data() {
    return {

    }
  },
  methods: {
    download(id) {
      const downObj = {
        id: id
      }
      userFunc
        .downloadApi(downObj)
        .then(response => {
          this.$Message.success('正在加载...')
        })
        .catch(error => {
          console.log(error)
        })
    },
    removeFileFunc(id, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '你确定要删除吗？',
        onOk: () => {
          userFunc
            .removeFileIdApi(id)
            .then(response => {
              if (response.data.status === 'ok') {
                this.row.fileList.splice(index, 1)
                this.$Message.success(response.data.message)
              } else if (response.data.status === 'fail') {
                this.$Message.error(response.data.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消！')
        }
      })
    }
  }
}
</script>
<style scoped>
.expand-row {
  margin-bottom: 16px;
}
.expand-key {
  font-weight: bold;
  font-size: 14px;
}
.expand-value {
  margin-left: 20px;
}
</style>
