<template>
  <div>
    <div id="chartWarraper" style="width:100%;height:600px;"></div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="8">
        <Card>
          <p slot="title">
            Hive Table A 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Hive Table B 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Join 规则
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
            字段 Map
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle4" :data="tableData4" border></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            HBase Table 元数据(部分)
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
let pie1 = require("@/assets/images/hiv1.png");
let pie2 = require("@/assets/images/pie2.png");
let pie4 = require("@/assets/images/pie4.png");
let pie3 = require("@/assets/images/pie3.png");
let pie5 = require("@/assets/images/inc3.png");
let pie7 = require("@/assets/images/hiv7.png");
export default {
  name: "KafkaToKuduWithIUD",
  data() {
    return {
      exportLoading: false,
      tableTitle: [
        {
          title: " ",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableTitle1: [
        {
          title: "名称",
          key: "category1"
        },
        {
          title: "表达式",
          key: "category2"
        },
        {
          title: "说明",
          key: "category3"
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
      tableTitle4: [
        {
          title: "目标字段",
          key: "category1"
        },
        {
          title: "值表达式",
          key: "category2"
        }
      ],
      tableData: [],
      tableData1: [
        {
          category1: "duishou_type_001",
          category2: "kemu==3364 || kemu==3364 || kemu==3360",
          category3: "交易对手识别缺失"
        },
        {
          category1: "引用规则",
          category2: "链接...",
          category3: " "
        }
      ],
      tableData2: [
        {
          category1: "Rowkey Compare Func",
          category2:
            "concat(reverse(id), unix_timestamp(create_date,'...'))说明:用于 StratRow / EndRow 查询场景"
        }
      ],
      tableData4: [
        {
          category1: "out_type",
          category2: "if expression.duishou_type_001 { return xxx;}"
        }
      ]
    };
  },
  methods: {
    init() {
      let option = {
        backgroundColor: "#fff",
        tooltip: { show: false },
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
                case 5:
                  img += pie5;
                  break;
                case 7:
                  img += pie7;
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
                name: "Hive Table A",
                img: 1,
                x: 10,
                y: 200
              },
              {
                name: "2",
                img: 2,
                x: 150,
                y: 200,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "3",
                img: 4,
                x: 150,
                y: 450,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "Hive Table B",
                img: 3,
                x: 10,
                y: 450
              },
              {
                name: "5",
                img: 5,
                x: 290,
                y: 450,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "HBase Table-B",
                img: 5,
                x: 290,
                y: 300
              },
              {
                name: "7",
                img: 7,
                x: 430,
                y: 300,
                label: {
                  show: false
                }
              }
            ],
            // links: [],
            links: [
              {
                source: "Hive Table A",
                target: "2"
              },
              {
                source: "2",
                target: "3"
              },
              {
                source: "3",
                target: "Hive Table B"
              },
              {
                source: "3",
                target: "4"
              },
              {
                source: "3",
                target: "5"
              },
              {
                source: "5",
                target: "HBase Table-B"
              },
              {
                source: "HBase Table-B",
                target: "7"
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
