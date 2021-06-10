<style lang="less">
@import "./common.less";
</style>
<template>
  <div>
    <div id="chartWarraper" style="width:100%;height:400px;"></div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="8">
        <Card>
          <p slot="title">
            Topic 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle4" :data="tableData4" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            HBase Table 元数据(部分)
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData" border></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            业务规则
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Join 规则
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle5" :data="tableData5" border></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            Kudu Table 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle2" :data="tableData2" border></Table>
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
let pie4 = require("../../assets/images/pie4.png");
export default {
  name: "KafkaHBaseToHBase",
  data() {
    return {
      exportLoading: false,
      tableTitle: [
        {
          title: "Rowkey Func",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableTitle1: [
        {
          title: "字段 Map",
          key: "category1"
        }
      ],
      tableTitle2: [
        {
          title: "Rowkey Func",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableTitle4: [
        {
          title: " ",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableTitle5: [
        {
          title: "Join类型 ",
          key: "category1"
        },
        {
          title: "LeftJoin / InnerJoin ",
          key: "category2"
        }
      ],
      tableData: [
        {
          category1: "Rowkey Compare Func",
          category2: "",
          category3: 3
        },
        {
          category1: " ",
          category2: " ",
          category3: 6
        }
      ],
      tableData1: [],
      tableData2: [
        {
          category1: "Rowkey Compare Func",
          category2: ""
        }
      ],
      tableData4: [
        {
          category1: "",
          category2: ""
        }
      ],
      tableData5: [
        {
          category1: "Left",
          category2: "Topic-A-Tmp01"
        },
        {
          category1: "Right",
          category2: "Table-A"
        },
        {
          category1: "Condition",
          category2: "[Only Rowkey]"
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
                case 4:
                  img += pie4;
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
                name: "Stream Topic-A-Tmp01",
                img: 2,
                x: 150,
                y: 250,
                label: {
                  // show: false,
                  position: "top"
                }
              },
              {
                name: "HBase Table-A",
                img: 3,
                x: 10,
                y: 300
              },
              {
                name: "Stream Join-Tmp01",
                img: 4,
                x: 150,
                y: 300
              },
              {
                name: "HBase Table-B",
                img: 3,
                x: 290,
                y: 300
              }
            ],
            // links: [],
            links: [
              {
                source: "Kafka Topic-A",
                target: "Stream Topic-A-Tmp01"
              },
              {
                source: "Stream Topic-A-Tmp01",
                target: "Stream Join-Tmp01"
              },
              {
                source: "HBase Table-A",
                target: "Stream Join-Tmp01"
              },
              {
                source: "Stream Join-Tmp01",
                target: "HBase Table-B"
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
