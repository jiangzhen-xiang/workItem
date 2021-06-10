<template>
  <div class="commonTableWrapper">
    <Table border
           :columns="tableTitle"
           :data="tableData">
      <template slot-scope="{ row, index }"
                slot="topicName">
        <Dropdown transfer>
          <a href="javascript:void(0)">
            {{ row.topicName.split(",")[0].replace("[", "") }}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in row.topicName.split(',')">
              {{ getTopicName(item,index)}}
            </DropdownItem>
            <!-- <DropdownItem name="Group"
              ><div style="color: #2db7f5">
                <Icon type="logo-buffer" /> 查看Group
              </div></DropdownItem
            >
            <DropdownItem name="Warrant"
              ><div style="">
                <Icon type="ios-git-branch" /> 查看授权
              </div></DropdownItem
            > -->
          </DropdownMenu>
        </Dropdown>
      </template>
      <template slot-scope="{ row,index }"
                slot="result">
        <div v-if="(row.stat == '1'||row.stat == '3'||row.stat == '5')"
             style="color:#19be6b;">
          <Icon type="ios-checkmark-circle"
                style="color:#19be6b;" />
        </div>
        <div v-else-if="row.stat == '0'">
          <Icon type="ios-close-circle" />
        </div>
        <div v-else>
          <Icon type="ios-close-circle"
                style="color:#ed4014;" />
        </div>

      </template>

    </Table>
    <div class="page"
         style="text-align: right; padding-top: 10px"
         v-show="isShow">
      <Page :total="total"
            show-total
            show-elevator
            :current="current"
            :page-size="pageSize"
            size="small"
            @on-change="pageChange" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'commonTable',
  props: ['tableTitle', 'tableData', 'total', 'current', 'postData', 'isShowPage'],
  data () {
    return {
      pageSize: 10
    }
  },
  computed: {
    isShow () {
      return (this.isShowPage == undefined && this.isShowPage != false) ? true : this.isShowPage
    }
  },
  methods: {
    getTopicName (text, index) {
      let s = text.replace('[', '')
      let ss = s.replace(']', '')
      return ss
    },
    handleTest () {
      this.pageChange(2)
    },
    pageChange (val) {
      this.postData.conditionSearch.pageNum = val
      this.$emit('firePageChange', this.postData)
    }
  }
}
</script>
