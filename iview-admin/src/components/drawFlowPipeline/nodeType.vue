<template>
  <div class="nodeType" style>
    <div class="wrapper" style="overflow:auto;padding:5px 10px;height:400px;">
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
      value3: 'Multiple inputs/outputs',
      typeArr: [{
        'name': 'SQL',
        'children': [
          {
            'name': 'sql query',
            icon: 'sqlquery'

          }]
      }, {
        'name': '多输入/输出',
        'children': [
          {
            'name': 'Join',
            icon: 'join'

          }, {
            'name': 'Conditional Split',
            icon: 'ConditionalSplit'
          }, {
            'name': 'Exists',
            icon: 'exists'
          }, {
            'name': 'Union',
            icon: 'union'
          }, {
            'name': 'Lookup',
            icon: 'lookup'
          }]
      }, {
        'name': '列变更',
        'children': [{
          'name': 'Derived Column',
          icon: 'DerivedColumn'
        }, {
          'name': 'Select',
          icon: 'select'
        }, {
          'name': 'Aggregate',
          icon: 'Aggregate'
        }, {
          'name': 'Surrogate Key',
          icon: 'surrogatekey'
        }, {
          'name': 'Pivot',
          icon: 'Pivot'
        }, {
          'name': 'Unpivot',
          icon: 'Unpivot'
        }, {
          'name': 'Flatten',
          icon: 'Flatten'
        }]
      }, {
        'name': '行变更',
        'children': [{
          'name': 'Filter',
          icon: 'filter'
        }, {
          'name': 'Sort',
          icon: 'sort'
        }, {
          'name': 'Alter Row',
          icon: 'AlterRow'
        }]
      }, {
        'name': '窗口',
        'children': [
          {
            'name': 'Tumbling Windows',
            icon: 'TumblingWindows'

          }, {
            'name': 'Sliding Windows',
            icon: 'SlidingWindows'
          }, {
            'name': 'Session Windows',
            icon: 'SessionWindows'
          }, {
            'name': 'CustomWindows',
            icon: 'CustomWindows'
          }]
      }, {
        'name': '输出',
        'children': [{
          'name': 'Sink',
          icon: 'sink'
        }]
      }]
    }
  },
  methods: {
    handleAdd(type) {
      this.$emit('handleAddType', type)
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
