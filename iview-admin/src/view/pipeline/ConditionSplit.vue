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
            Hive Table C 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData" border></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            Hive Table A 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1" border></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            Join A 规则
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle2" :data="tableData2" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Join B 规则
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle2" :data="tableData2" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Join C 规则
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
let pie6 = require("@/assets/images/spl2.png");
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
          title: "Cond01",
          key: "category1"
        },
        {
          title: "expression",
          key: "category2"
        }
      ],
      tableTitle2: [
        {
          title: " ",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableData: [],
      tableData1: [
        {
          category1: "Cond02",
          category2: "expression"
        }
      ],
      tableData2: []
    };
  },
  methods: {
    init() {
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          show: false
        },
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
                case 6:
                  img += pie6;
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
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: "Hive Table A",
                img: 1,
                x: 10,
                y: 100
              },
              {
                name: "Cond01",
                img: 6,
                x: 100,
                y: 100,
                label: {
                  position: "top"
                }
              },
              {
                name: "3",
                img: 4,
                x: 190,
                y: 100,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "Hive Table B",
                img: 1,
                x: 280,
                y: 100
              },
              {
                name: "Hive Table C",
                img: 1,
                x: 10,
                y: 200,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "Cond02",
                img: 4,
                x: 100,
                y: 200,
                label: {
                  show: false
                }
              },
              {
                name: "7",
                img: 4,
                x: 190,
                y: 200,
                label: {
                  show: false
                }
              },
              {
                name: "Sink Hive Table C",
                img: 1,
                x: 280,
                y: 200,
                label: {
                  show: false
                }
              }
            ],
            // links: [],
            links: [
              {
                source: "Hive Table A",
                target: "Cond01"
              },
              {
                source: "Cond01",
                target: "3"
              },
              {
                source: "3",
                target: "7"
              },
              {
                source: "Hive Table B",
                target: "3"
              },
              {
                source: "Cond01",
                target: "Cond02"
              },
              {
                source: "Cond02",
                target: "7"
              },
              {
                source: "7",
                target: "Sink Hive Table C"
              },
              {
                source: "Hive Table C",
                target: "Cond02"
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
