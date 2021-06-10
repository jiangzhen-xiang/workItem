<template>
  <div  class="headerSearch"
       :style="searchFormMore==true? 'height:120px' :'height:70px'">
    <div class="headerSearch_top"
         :style="searchFormMore==true? 'padding: 5px 0 5px' :'padding:20px 0 20px'">
      <Row>
        <i-col span="16">
          <div style="display:inline-block;width: 25%;margin-right:20px"
               v-for="(item,index) in firstLine"
               :key="index">
            <Select v-if="item.type&&item.type == 'select'"
                    v-model="searchForm[item.models]"
                    :placeholder="item.placeholder+'...'">
              <Option v-for="(item1,index1) in item.options"
                      :key="index1"
                      :value="item1.value">{{item1.name}}</Option>
            </Select>
            <DatePicker v-else-if="(item.type&&item.type == 'datetime')||(item.type&&item.type == 'date')"
                        v-model="searchForm[item.models]"
                        :type="item.type"
                        :placeholder="item.placeholder+'...'">
            </DatePicker>
            <!-- <DatePicker v-else-if="item.type&&item.type == 'date'"
                        v-model="searchForm[item.models]"
                        type="date"
                        :placeholder="item.placeholder+'...'">
            </DatePicker> -->
            <Input v-else
                   v-model="searchForm[item.models]"
                   :placeholder="item.placeholder+'...'" />
          </div>

          <Button shape="circle"
                  style="margin-right:10px"
                  v-if="headerTitle.titleInput.length>=4"
                  @click="searchFormMore=!searchFormMore;" >&gt;&gt;</Button>
          <Button type="primary" @click="search">查询</Button>
        </i-col>
        <i-col span="8"
               style="text-align:right">
          <div style="display:inline-block"
               v-if="isUpload">
            <Upload v-for="(item,index) in headerTitle.titleUpload"
                    :key="index"
                    :show-upload-list="false"
                    :before-upload="handleBeforeUpload"
                    action
                    style="display:inline-block">
              <Button type="primary"
                      @click="uploadBtn = item">{{item}}</button>
            </Upload>
          </div>

          <div style="display:inline-block"
               v-if="isBtn">
            <Button v-for="(item,index) in headerTitle.titleBtn"
                    :key="index"
                    type="primary"
                    @click="btnClick(item)"
                    style="margin-left:10px">{{item}}</Button>
          </div>

        </i-col>
      </Row>
    </div>
    <div class="headerSearch_msk"
         v-if="isTwoLine"
         v-show="searchFormMore">
      <div style="display:inline-block;width: 25%;margin-right:20px;padding: 2px 0 5px"
           v-for="(item,index) in secondLine"
           :key="index">
        <Select v-if="item.type&&item.type == 'select'"
                v-model="searchForm[item.models]"
                :placeholder="item.placeholder+'...'">
          <Option v-for="(item1,index1) in item.options"
                  :key="index1"
                  :value="item1.value">{{item1.name}}</Option>
        </Select>
        <!-- <DatePicker v-else-if="item.type&&item.type == 'date'"
                    v-model="searchForm[item.models]"
                    type="date"
                    :placeholder="item.placeholder+'...'">
        </DatePicker> -->
        <DatePicker v-else-if="(item.type&&item.type == 'datetime')||(item.type&&item.type == 'date')"
                        v-model="searchForm[item.models]"
                        :type="item.type"
                        :placeholder="item.placeholder+'...'">
            </DatePicker>
        <Input v-else
               v-model="searchForm[item.models]"
               :placeholder="item.placeholder+'...'" />
      </div>
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
    isUpload () {
      return this.headerTitle.titleUpload && this.headerTitle.titleUpload.length > 0 ? true : false
    },
    isBtn () {
      return this.headerTitle.titleBtn && this.headerTitle.titleBtn.length > 0 ? true : false
    },
    isTwoLine () {
      return this.headerTitle.titleInput && this.headerTitle.titleInput.length > 2 ? true : false
    },
  },
  data () {
    return {
      searchForm: {},
      searchFormMore: false,
      uploadBtn: '',
      firstLine: '',
      secondLine: '',
    }
  },
  created () {
    this.getDomList()
  },
  methods: {
    // 查询
    search () {
      this.$emit('searchClick', this.searchForm)
    },
    // other点击
    btnClick (val) {
      this.$emit('btnClick', { type: val })
    },
    // 上传点击
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
        type: this.uploadBtn,
        file: file
      })

      return false
    },
    // 数据处理
    getDomList () {
      let titleInput = [...this.headerTitle.titleInput]
      let obj = {}

      titleInput.forEach(item => {
        obj[item.models] = ''
      })

      let domList = titleInput.splice(0, 3)

      this.firstLine = domList;
      this.secondLine = titleInput;
      this.searchForm = obj
    }
  },
  showSearch(){
    console.log(11111);
    
    //  this.searchFormMore = !this.searchFormMore;
    //  this.$nextTick(function(){
    //    this.$ref.headerSearch.style.marginBottom="40px"
    //  })
  },
}
</script>

<style lang="less" scoped>
.headerSearch {
  width: 100%;
  height: 100%;
  // background: #f00;
  height: 50px;
  box-sizing: border-box;
  // margin-bottom:20px;
  // overflow: hidden;
  transition: all 0.3s linear 0.3s;
  .headerSearch_top {
    // padding: 10px 0;
    transition: all 0.2s linear 0.1s;
  }
}
</style>