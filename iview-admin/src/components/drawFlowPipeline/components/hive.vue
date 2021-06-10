<template>
  <div>
    <Tabs value="name1">
      <TabPane label="标签一" name="name1">
        <div class="tabConten" style="height:100px;"></div>
      </TabPane>
      <TabPane label="数据源(source)" name="name2">标签二的内容</TabPane>
      <TabPane label="目标(sink)" name="name3">标签三的内容</TabPane>
      <TabPane label="映射(Mapping)" name="name4">标签三的内容</TabPane>
      <TabPane label="配置(Settings)" name="name5">标签三的内容</TabPane>
      <TabPane label="个人设置(User properties)" name="name6"
        >标签三的内容</TabPane
      >
    </Tabs>
  </div>
</template>
<script>
export default {
  name: "pipeline",
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
