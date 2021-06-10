
<template>
  <div>
    <div>
      <Table
        :loading="loading"
        :columns="tableTitleInspect"
        :data="getTableDataInspect"
        tooltip-theme="dark"
        border
      ></Table>
      <div class="page" style="text-align:right;padding-top:10px;">
        <Page
          :simple="pageSize"
          :total="nodeData.tableDataInspect.length"
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
  name: 'dataMeta',
  props: ['nodeData', 'pageSize'],
  data() {
    return {
      loading: false,
      current: 1,
      tableTitleInspect: [

        {
          title: '字段名称',
          key: 'columnName',
          eclipse: true,
          tooltip: true

        },
        {
          title: '类型',
          key: 'columnType',
          eclipse: true,
          tooltip: true
        },
        {
          title: '默认值',
          key: 'columnDefautlValue',
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
      let arr = this.nodeData && this.nodeData.tableDataInspect || []
      return arr.slice((this.current - 1) * 10, this.current * 10)
    }

  },
  methods: {
    pageChange(val) {
      this.current = val
    }
  },
  components: {

  },
  created() { },
  mounted() {

  }
}
</script>
