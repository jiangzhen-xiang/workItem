<template>
  <div>
    <Table :columns="columns" :data="row.applyDetailList">
      <template slot-scope="{ row,index }" slot="title">
                  <div v-if="row.code == '1'" style="color:#19be6b;">
                      <Icon type="ios-checkmark-circle"  style="color:#19be6b;"/>
                  </div>
                  <div v-else>
                <Icon type="ios-close-circle" style="color:#ed4014;" />
                  </div>

      </template>
    </Table>
  </div>
</template>

<script>

export default {
  props: {
    row: Object
  },
  data () {
    return {
      columns: [
        {
          title: '',
          key: 'message',
          minWidth: 160,
          eclipse: true,
          tooltip: true,
          slot: 'title'

        },
        {
          title: '集群标识',
          key: 'clusterCode',
          minWidth: 160,
          eclipse: true,
          tooltip: true

        },

        {
          title: '组件',
          key: 'component',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '库名',
          key: 'dbName',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '表名',
          key: 'tableName',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '列名',
          key: 'colName',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '操作类型',
          key: 'operType',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },
        {
          title: '权限',
          key: 'grantType',
          minWidth: 100,
          eclipse: true,
          tooltip: true

        },

        {
          title: '操作日志',
          key: 'message',
          minWidth: 100,
          eclipse: true,
          tooltip: true
        }

      ]

    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>
