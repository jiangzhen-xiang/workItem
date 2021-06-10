<template>
  <div>
    <div class="wrapper">
      <Table
        size="small"
        :loading="loading"
        :columns="tableTitleInspect"
        :data="getTableDataInspect"
        tooltip-theme="dark"
        border
      ></Table>
      <div class="page" style="text-align:right;padding-top:10px;">
        <Page
          :simple="pageSize"
          :total="nodeData.tableData.length"
          show-total
          show-elevator
          @on-change="pageChange"
        />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'formatTab',
  props: ['nodeData', 'pageSize'],
  data() {
    return {
      loading: false,
      current: 1,
      tableTitleInspect: [

        {
          title: '字段',
          key: 'columnName',
          eclipse: true,
          tooltip: true
        },
        {
          title: '类型',
          key: 'type',
          eclipse: true,
          tooltip: true

        },
        {
          title: '格式',
          key: 'format',
          eclipse: true,
          tooltip: true

        }

      ]
    }
  },
  computed: {
    getSimple() {
      console.log('======this.size', this.pageSize)
      return !this.pageSize
    },
    getTableDataInspect() {
      let arr = this.nodeData && this.nodeData.tableData || []
      return arr.slice((this.current - 1) * 10, this.current * 10)
    }
  },
  components: {

  },
  methods: {
    pageChange(val) {
      this.current = val
    }
  },
  created() {

  },
  mounted() {

  }
}
</script>
