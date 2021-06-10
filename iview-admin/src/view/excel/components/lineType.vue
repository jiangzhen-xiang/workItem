<template>
  <div class="nodeType" style>
    <div class="wrapper" style="overflow:auto;padding:5px 10px;max-height:400px;">
      <div v-for="(item,index) in typeArr">
        <div class="title">{{item.name}}</div>
        <ul>
          <li @click="handleAdd(type)" class="flex" v-for="(type,idx) in item.children">
            <div class="flex-item">
              <svg-icon :icon-class="type.icon" :class-name="type.icon" />
            </div>
            <div class="flex-item">{{type.name}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nodeType',
  data() {
    return {
      value3: '连线类型',
      typeArr: [{
        'name': '连线类型',
        'children': [
          {
            'name': 'success',
            icon: 'join',
            type: 'success'

          }, {
            'name': 'fail',
            icon: 'ConditionalSplit',
            type: 'error'
          }, {
            'name': 'info',
            icon: 'exists',
            type: 'info'
          }, {
            'name': 'warning',
            icon: 'lookup',
            type: 'warning'
          }]
      }]

    }
  },
  methods: {
    handleAdd(type) {
      this.$emit('handleOk', type)
    }
  },
  created() { },
  mounted() { }
}
</script>
<style lang="less" scoped>
.nodeType {
  background-color: #ffffff;
  .title {
    line-height: 35px;
    border-bottom: solid 1px #ddd;
  }
  .flex {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    line-height: 32px;
    .flex-item {
      padding: 0 5px;
    }
  }
  .flex:hover {
    background-color: #def0ff;
    color: #348fed;
  }
}
</style>
