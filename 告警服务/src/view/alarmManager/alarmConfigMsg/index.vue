<template>
  <div>
    <Table
        stripe
        :data="tableData"
        :columns="tableTitle"
        ref="tableName"
        :max-height="tableHeight"
      >
    </Table>
  </div>
</template>

<script>
import ajaxAlarmConfig from '@/api/alarmManager.js'
export default {
  data: function() {

    return {
      tableTitle: [
        {
          title: "序号",
          key: "id",
          align: "center",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "报警服务",
          key: "alarmname",
          align: "center",
          minWidth: 200,
          tooltip: true
        },
        {
          title: "报警应用名称",
          key: "componentid",
          align: "center",
          minWidth: 200
        },
        {
          title: "告警规则描述",
          key: "descreption",
          align: "center",
          minWidth: 200
        }
      ],
      tableData: [],
      tableHeight:0,
    }
  },
  methods: {
    async reflesh(){
      let res = await ajaxAlarmConfig.getConfigInfo();
      console.log(res);
      this.tableData=res.data; 
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
	  }
  },
  watch:{
    
  },
  mounted() {
    this.reflesh();
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
  },
  created() {
  },
  computed:{

  }
}
</script>

<style lang='less' scoped>

</style>
