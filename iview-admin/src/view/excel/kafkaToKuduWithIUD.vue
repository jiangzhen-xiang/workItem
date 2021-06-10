<style lang="less">
@import "./common.less";
</style>
<template>
  <div>
    <div id="chartWarraper" style="width:100%;height:200px;"></div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="8">
        <Card>
          <p slot="title">
            Topic 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData"></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            字段 Map
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1"></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            Kudu Table 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle2" :data="tableData2"></Table>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import excel from "@/libs/excel";
let pie1 = require("../../assets/images/pie1.png");
let pie2 = require("../../assets/images/pie2.png");
let pie3 = require("../../assets/images/pie3.png");
export default {
  name: "KafkaToKuduWithIUD",
  data() {
    return {
      exportLoading: false,
      tableTitle: [
        {
          title: "Format",
          key: "category1"
        },
        {
          title: "Avro",
          key: "category2"
        }
      ],
      tableTitle1: [
        {
          title: "目标字段",
          key: "category1"
        },
        {
          title: "值表达式",
          key: "category2"
        }
      ],
      tableTitle2: [
        {
          title: "Rowkey Func",
          key: "category1"
        },
        {
          title:
            "concat(reverse(id), unix_timestamp(create_date,'...'), others)",
          key: "category2"
        }
      ],
      tableData: [
        {
          category1: "OpType",
          category2: 2,
          category3: 3
        },
        {
          category1: "Insert",
          category2: 5,
          category3: 6
        },
        {
          category1: "Update",
          category2: 8,
          category3: 9
        },
        {
          category1: "Delete",
          category2: 8,
          category3: 9
        }
      ],
      tableData1: [
        {
          category1: "out_1",
          category2: "src_1"
        },
        {
          category1: "prefix_$$",
          category2: "统一加前缀"
        },
        {
          category1: "$$_suffix",
          category2: "统一加后缀"
        }
      ],
      tableData2: [
        {
          category1: "Rowkey Compare Func",
          category2: ""
        }
      ]
    };
  },
  methods: {
    init() {
      let option = {
        backgroundColor: "#fff",
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 100,
            roam: true,
            label: {
              show: true,
              position: "top"
            },
            symbol: (a, b) => {
              console.log("aaaaa====", a, b, pie1);
              let img = "image://";

              console.log("img====", b.data.img);
              switch (b.data.img) {
                case 2:
                  img += pie2;
                  break;
                case 3:
                  img += pie3;
                  break;
                default:
                  img += pie1;
                  break;
              }
              return img;
            },
            edgeSymbol: ["circle"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: "Kafka Topic-A",
                img: 1,
                x: 10,
                y: 250
              },
              {
                name: "1",
                img: 2,
                x: 150,
                y: 250,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "HBase Table-B ",
                img: 3,
                x: 290,
                y: 250
              }
            ],
            // links: [],
            links: [
              {
                source: "Kafka Topic-A",
                target: "1"
              },
              {
                source: "1",
                target: "HBase Table-B "
              }
            ],
            lineStyle: {
              color: "#23cdfd",
              opacity: 3.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      };
      let myChart = this.$echarts.init(
        document.getElementById("chartWarraper")
      );
      myChart.setOption(option);
    },
    exportExcel() {
      if (this.tableData.length) {
        this.exportLoading = true;
        const params = {
          title: ["一级分类", "二级分类", "三级分类"],
          key: ["category1", "category2", "category3"],
          data: this.tableData,
          autoWidth: true,
          filename: "分类列表"
        };
        excel.export_array_to_excel(params);
        this.exportLoading = false;
      } else {
        this.$Message.info("表格数据不能为空！");
      }
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>
