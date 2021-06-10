<template>
  <div>
    <Table
      highlight-row
      ref="currentRowTable"
      :columns="prevData.columns"
      :data="getTableDataInspect"
    ></Table>
    <div class="page" style="text-align:right;padding-top:10px;">
      <Page
        :total="prevData.tableData.length"
        show-total
        show-elevator
        @on-change="pageChange"
        size="small"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'prevTable',
  props: ['prevData'],
  data() {
    return {

    }
  },
  computed: {
    getTableDataInspect() {
      let arr = this.prevData && this.prevData.tableData || []
      return arr.slice((this.current - 1) * 10, this.current * 10)
    }
  },
  methods: {
    handleClearCurrentRow() {
      this.$refs.currentRowTable.clearCurrentRow()
    },
    pageChange(val) {
      this.current = val
    }
  }
}
</script>
