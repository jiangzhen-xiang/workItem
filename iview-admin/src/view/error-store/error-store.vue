<template>
  <div>
    <Row :gutter="16">
      <Col span="4">
        <Select v-model="model1">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        <Divider style="margin:10px 0" />
        <List class="title_list" border>
          <ListItem
            v-for="(item, index) in listArr"
            :key="index"
            :style="item.acitve ? 'color:red' : ''"
            >{{ item.text }}</ListItem
          >
        </List>
      </Col>
      <Col span="20">
        <div>
          <Card>
            <p slot="title">
              选择 Transform
            </p>
            <div slot="extra">
              <div
                class="float1"
                style="display:inline-block;margin-left:10px;"
              >
                <Select v-model="model2">
                  <Option
                    v-for="item in cityList2"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </div>
              <div
                class="float2"
                style="display:inline-block;margin-left:10px;"
              >
                <Select v-model="model3">
                  <Option
                    v-for="item in cityList3"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </div>
              <div
                class="float3"
                style="display:inline-block;margin-left:10px;"
              >
                <Select v-model="model4">
                  <Option
                    v-for="item in cityList4"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </div>
            </div>
            <div class="wrapper">
              <img
                src="../../assets/images/img6.png"
                style="width:100%"
                alt=""
              />
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { errorReq } from "@/api/data";
export default {
  name: "error_store_page",
  data() {
    return {
      model1: "App1",
      model2: "1",
      model3: "1",
      model4: "1",
      cityList2: [
        {
          value: "1",
          label: "多输入/输出"
        },
        {
          value: "2",
          label: "List Item1"
        },
        {
          value: "3",
          label: "连接(Join)"
        },
        {
          value: "4",
          label: "分割(Split)"
        },
        {
          value: "5",
          label: "联合(Union)"
        },
        {
          value: "6",
          label: "查询(Lookup)"
        },
        {
          value: "7",
          label: "存在(Exist)"
        }
      ],
      cityList3: [
        {
          value: "1",
          label: "更改表结构"
        },
        {
          value: "2",
          label: "源列转新列"
        },
        {
          value: "3",
          label: "选择列(Select)"
        },
        {
          value: "4",
          label: "聚合(Aggregate)"
        },
        {
          value: "5",
          label: "自增列"
        },
        {
          value: "6",
          label: "行转列(Pivot)"
        },
        {
          value: "7",
          label: "列转行(Unpivot)"
        },
        {
          value: "8",
          label: "窗口(Window)"
        },
        {
          value: "9",
          label: "拉平(Flatten)"
        }
      ],
      cityList: [
        {
          value: "App1",
          label: "App1"
        }
      ],
      cityList4: [
        {
          value: "1",
          label: "更改行"
        },
        {
          value: "2",
          label: "过滤(Filter)"
        },
        {
          value: "3",
          label: "排序(Sort)"
        },
        {
          value: "4",
          label: "修改(Alter)"
        }
      ],
      listArr: [
        {
          text: "批量 Pipeline",
          active: false
        },
        {
          text: "流式 Pipeline",
          active: false
        },
        {
          text: "Connections",
          active: false
        },
        {
          text: "数据集",
          active: false
        },
        {
          text: "数据处理",
          active: true
        },
        {
          text: "规则&表达式",
          active: false
        },
        {
          text: "环境变量",
          active: false
        },
        {
          text: "数据服务",
          active: false
        }
      ]
    };
  },
  methods: {
    click() {
      console.log(admin);
    },
    ajaxClick() {
      errorReq();
    }
  }
};
</script>

<style lang="less" scoped>
.title_list {
  .active {
    color: red;
  }
}
</style>
