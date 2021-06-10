<template>
  <div class="headerSearch"
       :style="searchFormMore==true? 'height:71px' :'height:70px'">
    <div class="headerSearch_top"
         :style="searchFormMore==true? 'padding: 2px 0 5px' :'padding:20px 0 20px'">
      <Row>
        <i-col span="13">
          <Input v-for="(item,index) in searchList.titleInputT"
                 :key="index"
                 v-model="searchForm[item.models]"
                 :placeholder="item.placeholder+'...'"
                 style="width: 25%;margin-right:20px" />
          <Button shape="circle"
                  style="margin-right:10px"
                  @click="searchFormMore = !searchFormMore">&gt;&gt;</Button>
          <Button type="primary"
                  @click="search">查询</Button>
        </i-col>
        <i-col span="11"
               style="text-align:right">
          <Upload v-if="uploadToken"
                  :show-upload-list="false"
                  :before-upload="handleBeforeUpload"
                  action
                  style="display:inline-block">
            <Button type="primary">{{this.headerTitle.uploadBtn}}</button>
          </Upload>
          <Button v-for="(item,index) in searchList.titleBtn"
                  :key="index"
                  type="primary"
                  @click="btnClick(item)"
                  style="margin-left:10px">{{item}}</Button>
        </i-col>
      </Row>
    </div>
    <div class="headerSearch_msk">
      <Input v-for="(item,index) in searchList.titleInputB"
             :key="index"
             v-model="searchForm[item.models]"
             :placeholder="item.placeholder+'...'"
             :style="index == searchList.titleInputB.length-1? 'width: 20%;':'width: 20%;margin-right:20px'" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'headerSearch',
  props: {
    headerTitle: {
      type: Object,
      default: () => {
        return []
      }
    },
  },
  computed: {
    searchList () {
      let arr = [...this.headerTitle.titleInputT, ...this.headerTitle.titleInputB]
      arr.forEach((item, index) => {
        this.searchForm[item.models] = ''
      })
      return this.headerTitle
    },
    uploadToken () {
      return this.headerTitle.uploadBtn ? true : false
    }
  },
  data () {
    return {
      searchForm: {},
      searchFormMore: false
    }
  },
  methods: {
    search () {
      this.$emit('searchClick', this.searchForm)
    },
    btnClick (val) {
      this.$emit('btnClick', {
        type: val
      })
    },
    handleBeforeUpload (file) {
      // 验证是否是空文件
      if (file.size == 0) {
        this.$Message.info('文件大小为0kb,空文件不可上传！')
        return false
      }
      // // 验证文件类型
      // let fileSuffix = file.name.split('.')[1]
      // if (fileSuffix != 'xlsx') {
      //   this.$Message.info('仅可上传文件后缀名为xlsx的文件')
      //   return false
      // }

      this.$emit('btnClick', {
        type: '导入',
        file: file
      })

      return false
    },
  }
}
</script>

<style lang="less" scoped>
.headerSearch {
  width: 100%;
  height: 100%;
  // background: #f00;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s linear 0.3s;
  .headerSearch_top {
    padding: 10px 0;
    transition: all 0.2s linear 0.1s;
  }
}
</style>