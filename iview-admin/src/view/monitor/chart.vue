<template>
  <div>
    <Tabs type="card" @on-click="tabIndexFunc">
        <TabPane label="pipeline" name="name1">
          <Row v-show="tabChangeControl === false" :gutter="8" id="box1" style="margin-left: 0px; position:fixed; left:0px; top:0px; z-index: 999; width:100%;height:auto;">
            <i-col span="24" style="padding-left: 0px; padding-right: 0px;">
              <Card>
                <i-form :model="searchForm" inline label-position="right" :label-width="80">
                  <Form-item label="pipeline类型" prop="type">
                    <i-select :model.sync="searchForm.type" placeholder="请选择类型" style="width: 120px">
                        <i-option v-for="item in statusList" :key="item.id"  :value="item.id">{{ item.name }}</i-option>
                    </i-select>
                  </Form-item>
                  <Form-item label="日期" prop="date">
                    <Date-picker type="datetimerange" format="yyyy-MM" placeholder="请选择日期" style="width: 180px"></Date-picker>
                  </Form-item>
                  <Form-item>
                    <i-button type="primary" icon="ios-search">筛选</i-button>
                  </Form-item>
                </i-form>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8" style="margin-top: 100px;">
            <i-col span="24">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="chartWarraper" style="width: 100%; height:400px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8">
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="cpu" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="memory" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8">
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="dataNumber" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="dataVolume" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
        </TabPane>
        <TabPane label="集群" name="name2">
          <Row v-show="tabChangeControl === true" :gutter="8" id="box2" style="margin-left: 0px; position:fixed; top:0px; z-index: 999; width:100%;height:auto;">
            <i-col span="24" style="padding-left: 0px; padding-right: 0px;">
              <Card>
                <i-form :model="searchForm" inline label-position="right" :label-width="80">
                  <Form-item label="集群名称" prop="name">
                    <Input v-model="searchForm.name" placeholder="请输入集群名称" style="width: 120px" />
                  </Form-item>
                  <Form-item label="日期" prop="date">
                    <Date-picker type="datetimerange" format="yyyy-MM" placeholder="请选择日期" style="width: 180px"></Date-picker>
                  </Form-item>
                  <Form-item>
                    <i-button type="primary" icon="ios-search">筛选</i-button>
                  </Form-item>
                </i-form>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8" style="margin-top: 100px;">
            <i-col span="24">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="chartWarraper1" style="width: 100%; height:400px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8">
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="cpu1" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="memory1" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
          <Row class="margin-top-10" :gutter="8">
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="dataNumber1" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
            <i-col span="12">
              <Card>
                <p slot="title" style="height:30px;"></p>
                <div class="btnWrapper" slot="extra" style="left:16px;">
                  <ButtonGroup>
                    <Button type="primary" size="small">
                      <Icon type="ios-ios-plus" />刷新
                    </Button>
                  </ButtonGroup>
                </div>
                <div class="wrapper">
                  <div id="dataVolume1" style="width: 100%; height:200px;"></div>
                </div>
              </Card>
            </i-col>
          </Row>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import { dataFormatter } from '@/utils/dataFormmatter'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'chart',
  data () {
    return {
      tabChangeControl: false,
      dataMap: {},
      statusList: [
        {
          id: '1',
          name: '全部'
        },
        {
          id: '2',
          name: '批量'
        },
        {
          id: '3',
          name: '流式'
        }
      ],
      searchForm: {
        type: '',
        name: '',
        date: ''
      },
      throttleLoad: ''
    }
  },
  computed: {

  },
  methods: {
    tabIndexFunc (index) {
      if (index === 'name1') {
        this.tabChangeControl = false
      } else if (index === 'name2') {
        this.tabChangeControl = true
      }
    },
    // tab 1
    init () {
      this.dataMap.dataGDP = dataFormatter({
        // max : 60000,
        202006: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73, 7360.92, 9248.53, 5800.25, 25776.91, 15012.46, 9333.4, 9439.6, 31777.01, 5823.41, 1254.17, 4676.13, 10562.39, 2884.11, 4772.52, 341.43, 5757.29, 2703.98, 797.35, 919.11, 3523.16],
        202005: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47, 6112.5, 7583.85, 4820.53, 21900.19, 12362.79, 7617.47, 7688.67, 26587.76, 4746.16, 1065.67, 3907.23, 8690.24, 2338.98, 3988.14, 290.76, 4743.61, 2277.35, 648.5, 725.9, 3045.26],
        202004: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68, 5350.17, 6554.69, 4056.76, 18366.87, 10587.42, 6590.19, 6596.1, 22557.37, 3984.1, 918.75, 3467.72, 7385.1, 2005.42, 3462.73, 248.8, 3933.72, 1933.98, 543.32, 612.61, 2604.19],
        202003: [6033.21, 3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3, 5763.35, 3456.7, 15021.84, 8553.79, 5633.24, 5641.94, 18864.62, 3433.5, 819.66, 3034.58, 6379.63, 1677.8, 3081.91, 220.34, 3175.58, 1688.49, 466.1, 537.11, 2209.09],
        202002: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11, 4983.67, 2807.41, 12078.15, 6867.7, 4757.45, 4659.99, 15844.64, 2821.11, 713.96, 2555.72, 5333.09, 1426.34, 2556.02, 185.09, 2587.72, 1399.83, 390.2, 445.36, 1886.35],
        202001: [4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48, 10275.5, 6035.48, 4212.82, 4151.54, 13502.42, 2523.73, 642.73, 2232.86, 4725.01, 1243.43, 2312.82, 162.04, 2253.39, 1232.03, 340.65, 377.16, 1612.6]
      })

      this.dataMap.dataPI = dataFormatter({
        // max : 4000,
        202006: [101.26, 110.19, 1804.72, 311.97, 762.1, 1133.42, 783.8, 915.38, 101.84, 1816.31, 986.02, 1200.18, 1002.11, 905.77, 2509.14, 2217.66, 1378, 1626.48, 1695.57, 1241.35, 361.07, 482.39, 2032, 446.38, 837.35, 54.89, 592.63, 387.55, 83.41, 97.89, 628.72],
        202005: [88.8, 103.35, 1461.81, 276.77, 634.94, 939.43, 672.76, 750.14, 93.81, 1545.05, 925.1, 1011.03, 865.98, 786.14, 2138.9, 1916.74, 1140.41, 1272.2, 1532.17, 1032.47, 323.48, 386.38, 1595.48, 382.06, 724.4, 50.9, 484.81, 334, 67.55, 79.54, 527.8],
        202004: [88.68, 112.38, 1400, 262.42, 589.56, 882.41, 625.61, 684.6, 90.26, 1461.51, 892.83, 966.5, 827.36, 727.37, 1963.51, 1892.01, 1082.13, 1100.65, 1428.27, 912.5, 300.75, 463.4, 1481.14, 368.94, 661.69, 48.04, 435.77, 308.06, 65.34, 72.07, 509.99],
        202003: [87.36, 105.28, 1370.43, 276.3, 522.8, 798.43, 568.69, 605.79, 83.45, 1367.58, 814.1, 950.5, 786.84, 664.5, 1778.45, 1649.29, 1020.09, 1022.45, 1248.59, 817.88, 278.76, 428.05, 1379.93, 334.5, 607.75, 44.3, 387.88, 286.78, 60.7, 65.33, 461.26],
        202002: [84.11, 89.91, 1064.05, 215.19, 420.1, 615.8, 488.23, 504.8, 81.02, 1162.45, 717.85, 749.4, 692.94, 560, 1480.67, 1198.7, 798.35, 886.47, 1072.91, 658.78, 244.29, 339.06, 1128.61, 298.69, 494.6, 40.7, 302.66, 237.91, 48.47, 55.63, 412.9],
        202001: [82.44, 84.21, 956.84, 197.8, 374.69, 590.2, 446.17, 474.2, 79.68, 1110.44, 685.2, 783.66, 664.78, 535.98, 1390, 1288.36, 707, 847.25, 1015.08, 601.99, 222.89, 317.87, 1047.95, 281.1, 463.44, 39.75, 282.21, 215.51, 47.31, 52.95, 305]
      })

      this.dataMap.dataSI = dataFormatter({
        // max : 26600,
        202006: [2509.4, 2892.53, 7201.88, 3454.49, 3193.67, 5544.14, 2475.45, 3695.58, 5571.06, 14471.26, 10154.25, 3370.96, 4476.42, 2975.53, 14647.53, 8282.83, 4143.06, 3977.72, 16004.61, 2425.29, 364.26, 2368.53, 4648.79, 1124.79, 2038.39, 98.48, 2986.46, 1279.32, 419.03, 455.04, 1647.55],
        202005: [2191.43, 2457.08, 6110.43, 2755.66, 2374.96, 4566.83, 1915.29, 3365.31, 4969.95, 12282.89, 8511.51, 2711.18, 3695.04, 2419.74, 12574.03, 6724.61, 3365.08, 3187.05, 13469.77, 1878.56, 308.62, 1871.65, 3775.14, 967.54, 1705.83, 80.1, 2452.44, 1043.19, 331.91, 351.58, 1459.3],
        202004: [2026.51, 2135.07, 5271.57, 2357.04, 1773.21, 3869.4, 1580.83, 2971.68, 4381.2, 10524.96, 7164.75, 2245.9, 3175.92, 1917.47, 10478.62, 5514.14, 2852.12, 2612.57, 11356.6, 1510.68, 240.83, 1564, 3067.23, 821.16, 1426.42, 63.52, 1951.36, 838.56, 264.61, 281.05, 1164.79],
        202003: [1853.58, 1685.93, 4301.73, 1919.4, 1248.27, 3061.62, 1329.68, 2487.04, 3892.12, 8437.99, 6250.38, 1844.9, 2770.49, 1566.4, 8478.69, 4182.1, 2320.6, 2190.54, 9280.73, 1253.7, 205.6, 1376.91, 2489.4, 681.5, 1281.63, 52.74, 1553.1, 713.3, 211.7, 244.05, 914.47],
        202002: [1487.15, 1337.31, 3417.56, 1463.38, 967.49, 2898.89, 1098.37, 2084.7, 3209.02, 6787.11, 5096.38, 1535.29, 2340.82, 1204.33, 6485.05, 3310.14, 1956.02, 1777.74, 7592.78, 984.08, 175.82, 1135.31, 2014.8, 569.37, 1047.66, 47.64, 1221.17, 572.02, 171.92, 194.27, 719.54],
        202001: [1249.99, 1069.08, 2911.69, 1134.31, 754.78, 2609.85, 943.49, 1843.6, 2622.45, 5604.49, 4090.48, 1337.04, 2036.97, 941.77, 5184.98, 2768.75, 1709.89, 1523.5, 6143.4, 846.89, 148.88, 958.87, 1733.38, 481.96, 934.88, 32.72, 1007.56, 501.69, 144.51, 153.06, 603.15]
      })

      this.dataMap.dataTI = dataFormatter({
        // max : 25000,
        202006: [7236.15, 2250.04, 4600.72, 2257.99, 2467.41, 4486.74, 2025.44, 2493.04, 6821.11, 9730.91, 7613.46, 2789.78, 3770, 1918.95, 8620.24, 4511.97, 3812.34, 3835.4, 14076.83, 2156.76, 528.84, 1825.21, 3881.6, 1312.94, 1896.78, 188.06, 2178.2, 1037.11, 294.91, 366.18, 1246.89],
        202005: [5837.55, 1902.31, 3895.36, 1846.18, 1934.35, 3798.26, 1687.07, 2096.35, 5508.48, 7914.11, 6281.86, 2390.29, 3022.83, 1614.65, 7187.26, 3721.44, 3111.98, 3229.42, 11585.82, 1835.12, 433.57, 1649.2, 3319.62, 989.38, 1557.91, 159.76, 1806.36, 900.16, 249.04, 294.78, 1058.16],
        202004: [4854.33, 1658.19, 3340.54, 1611.07, 1542.26, 3295.45, 1413.83, 1857.42, 4776.2, 6612.22, 5360.1, 2137.77, 2551.41, 1411.92, 5924.74, 3181.27, 2655.94, 2882.88, 9772.5, 1560.92, 377.17, 1440.32, 2836.73, 815.32, 1374.62, 137.24, 1546.59, 787.36, 213.37, 259.49, 929.41],
        202003: [4092.27, 1319.76, 2805.47, 1375.67, 1270, 2811.95, 1223.64, 1657.77, 4097.26, 5198.03, 4584.22, 1963.9, 2206.02, 1225.8, 4764.7, 2722.4, 2292.55, 2428.95, 8335.3, 1361.92, 335.3, 1229.62, 2510.3, 661.8, 1192.53, 123.3, 1234.6, 688.41, 193.7, 227.73, 833.36],
        202002: [3435.95, 1150.81, 2439.68, 1176.65, 1000.79, 2487.85, 1075.48, 1467.9, 3404.19, 4493.31, 3890.79, 1638.42, 1949.91, 1043.08, 4112.43, 2358.86, 2003.08, 1995.78, 7178.94, 1178.25, 293.85, 1081.35, 2189.68, 558.28, 1013.76, 96.76, 1063.89, 589.91, 169.81, 195.46, 753.91],
        202001: [2982.57, 997.47, 2149.75, 992.69, 811.47, 2258.17, 958.88, 1319.4, 3038.9, 3891.92, 3227.99, 1399.02, 1765.8, 972.73, 3700.52, 1978.37, 1795.93, 1780.79, 6343.94, 1074.85, 270.96, 956.12, 1943.68, 480.37, 914.5, 89.56, 963.62, 514.83, 148.83, 171.14, 704.5]
      })

      this.dataMap.dataEstate = dataFormatter({
        // max : 3600,
        202006: [658.3, 156.64, 397.14, 117.01, 136.5, 318.54, 131.01, 194.7, 773.61, 1017.91, 794.41, 281.98, 435.22, 184.67, 786.51, 348.7, 294.73, 254.81, 1722.07, 192.2, 44.45, 158.2, 336.2, 80.24, 165.92, 11.92, 125.2, 73.21, 15.17, 25.53, 68.9],
        202005: [493.73, 122.67, 330.87, 106, 98.75, 256.77, 112.29, 163.34, 715.97, 799.73, 688.86, 231.66, 331.8, 171.88, 664.9, 298.19, 217.17, 215.63, 1430.37, 165.05, 38.2, 143.88, 286.23, 76.38, 148.69, 10.02, 108.62, 63.78, 14.1, 22.97, 55.79],
        202004: [821.5, 183.44, 467.97, 134.12, 191.01, 410.43, 153.03, 225.81, 958.06, 1365.71, 981.42, 366.57, 511.5, 225.96, 953.69, 447.44, 409.65, 301.8, 2029.77, 239.45, 67.19, 196.06, 376.84, 93.19, 193.59, 13.24, 153.98, 83.52, 16.98, 29.49, 91.28],
        202003: [436.11, 106.14, 231.08, 95.1, 73.81, 203.1, 97.93, 137.74, 666.3, 534.17, 587.83, 188.28, 248.44, 167.2, 473.27, 236.44, 204.8, 191.5, 1103.75, 122.52, 30.64, 129.12, 264.3, 68.3, 116.54, 5.8, 95.9, 56.84, 13, 20.78, 53.55],
        202002: [341.88, 92.31, 185.19, 78.73, 61.05, 188.49, 91.99, 127.2, 487.82, 447.47, 473.16, 162.63, 215.84, 138.02, 418.21, 217.58, 176.8, 186.49, 955.66, 100.93, 25.14, 113.69, 231.72, 59.86, 103.79, 4.35, 83.9, 48.09, 11.41, 16.85, 47.84],
        202001: [298.02, 73.04, 140.89, 65.83, 51.48, 130.94, 76.11, 118.7, 384.86, 371.09, 360.63, 139.18, 188.09, 125.27, 371.13, 199.31, 145.17, 165.29, 808.16, 82.83, 21.45, 90.48, 210.82, 53.49, 95.68, 3.42, 77.68, 41.52, 9.74, 13.46, 43.04]
      })

      this.dataMap.dataFinancial = dataFormatter({
        // max : 3200,
        202006: [1302.77, 288.17, 347.65, 218.73, 148.3, 386.34, 126.03, 155.48, 1209.08, 1054.25, 1251.43, 223.85, 385.84, 101.34, 734.9, 302.31, 337.27, 260.14, 1705.08, 190.73, 34.43, 247.46, 359.11, 122.25, 168.55, 11.51, 231.03, 61.6, 27.67, 51.05, 149.22],
        202005: [982.37, 186.87, 284.04, 169.63, 108.21, 303.41, 100.75, 74.17, 825.2, 653.25, 906.37, 166.01, 243.9, 79.75, 524.94, 219.72, 174.99, 204.72, 899.91, 129.14, 16.37, 213.7, 299.5, 89.43, 143.62, 6.44, 152.25, 50.51, 23.69, 36.99, 99.25],
        202004: [840.2, 147.4, 213.47, 135.07, 72.52, 232.85, 83.63, 35.03, 675.12, 492.4, 686.32, 127.05, 186.12, 69.55, 448.36, 181.74, 127.32, 162.37, 661.81, 91.93, 13.16, 185.18, 262.26, 73.67, 130.5, 7.57, 127.58, 44.73, 20.36, 32.25, 80.34],
        202003: [713.79, 136.97, 209.1, 110.29, 55.89, 188.04, 77.17, 32.2, 612.45, 440.5, 523.49, 94.1, 171, 65.1, 343.37, 170.82, 118.85, 118.64, 602.68, 74, 11.56, 162.38, 236.5, 60.3, 118.4, 5.4, 90.1, 42.99, 19, 27.92, 70.3],
        202002: [635.56, 112.79, 199.87, 118.48, 55.89, 145.38, 73.15, 32.2, 517.97, 392.11, 451.54, 87.45, 150.09, 64.31, 329.71, 165.11, 107.31, 99.35, 534.28, 61.59, 10.68, 147.04, 206.24, 48.01, 105.48, 4.74, 77.87, 42.31, 17.98, 24.8, 64.92],
        202001: [561.91, 76.86, 179.6, 124.1, 48.39, 137.18, 75.45, 31.6, 485.25, 368.86, 347.53, 81.85, 138.28, 76.51, 310.07, 158.77, 96.95, 92.43, 454.65, 35.86, 10.08, 134.52, 183.13, 41.45, 102.39, 2.81, 67.3, 42.08, 16.75, 21.45, 52.18]
      })
      let option = {
        baseOption: {
          timeline: {
            axisType: 'category',
            // realtime: false,
            // loop: false,
            autoPlay: true,
            // currentIndex: 2,
            playInterval: 1000,
            // controlStyle: {
            //     position: 'left'
            // },
            data: [
              '2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06'
            ],
            label: {
              formatter: function (s) {
                let m = (new Date(s)).getMonth()+1
                if (m < 10) {
                  m = '0' + m
                }
                return (new Date(s)).getFullYear() + '-' + m
              }
            }
          },
          title: {
            subtext: '数据来自光大'
          },
          tooltip: {
          },
          legend: {
            left: 'center',
            data: ['运行中', '成功', '失败', '已取消', '已暂停', '等待'],
            selected: {
              '已取消': false, '已暂停': false, '等待': false
            }
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '')
                  }
                }
              }
            }
          },
          xAxis: [
            {
              'type': 'category',
              'axisLabel': { 'interval': 0 },
              'data': [
                '01', '\n02', '03', '\n04', '05', '\n06', '07', '\n08',
                '09', '\n10', '11', '\n12', '13', '\n14', '15', '\n16',
                '17', '\n18', '19', '\n20', '21', '\n22', '23', '\n24',
                '25', '\n26', '27', '\n28', '29', '\n30', '31'
              ],
              splitLine: { show: false }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '监控（个数）'
            }
          ],
          series: [
            { name: '运行中', type: 'bar' },
            { name: '成功', type: 'bar' },
            { name: '失败', type: 'bar' },
            { name: '已取消', type: 'bar' },
            { name: '已暂停', type: 'bar' },
            { name: '等待', type: 'bar' },
            {
              name: '任务占比',
              type: 'pie',
              center: ['75%', '35%'],
              radius: '28%',
              z: 100
            }
          ]
        },
        options: [
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202001'] },
              { data: this.dataMap.dataFinancial['202001'] },
              { data: this.dataMap.dataEstate['202001'] },
              { data: this.dataMap.dataPI['202001'] },
              { data: this.dataMap.dataSI['202001'] },
              { data: this.dataMap.dataTI['202001'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202001sum'] },
                { name: '成功', value: this.dataMap.dataSI['202001sum'] },
                { name: '失败', value: this.dataMap.dataTI['202001sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202002'] },
              { data: this.dataMap.dataFinancial['202002'] },
              { data: this.dataMap.dataEstate['202002'] },
              { data: this.dataMap.dataPI['202002'] },
              { data: this.dataMap.dataSI['202002'] },
              { data: this.dataMap.dataTI['202002'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202002sum'] },
                { name: '成功', value: this.dataMap.dataSI['202002sum'] },
                { name: '失败', value: this.dataMap.dataTI['202002sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202003'] },
              { data: this.dataMap.dataFinancial['202003'] },
              { data: this.dataMap.dataEstate['202003'] },
              { data: this.dataMap.dataPI['202003'] },
              { data: this.dataMap.dataSI['202003'] },
              { data: this.dataMap.dataTI['202003'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202003sum'] },
                { name: '成功', value: this.dataMap.dataSI['202003sum'] },
                { name: '失败', value: this.dataMap.dataTI['202003sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202004'] },
              { data: this.dataMap.dataFinancial['202004'] },
              { data: this.dataMap.dataEstate['202004'] },
              { data: this.dataMap.dataPI['202004'] },
              { data: this.dataMap.dataSI['202004'] },
              { data: this.dataMap.dataTI['202004'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202004sum'] },
                { name: '成功', value: this.dataMap.dataSI['202004sum'] },
                { name: '失败', value: this.dataMap.dataTI['202004sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202005'] },
              { data: this.dataMap.dataFinancial['202005'] },
              { data: this.dataMap.dataEstate['202005'] },
              { data: this.dataMap.dataPI['202005'] },
              { data: this.dataMap.dataSI['202005'] },
              { data: this.dataMap.dataTI['202005'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202005sum'] },
                { name: '成功', value: this.dataMap.dataSI['202005sum'] },
                { name: '失败', value: this.dataMap.dataTI['202005sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202006'] },
              { data: this.dataMap.dataFinancial['202006'] },
              { data: this.dataMap.dataEstate['202006'] },
              { data: this.dataMap.dataPI['202006'] },
              { data: this.dataMap.dataSI['202006'] },
              { data: this.dataMap.dataTI['202006'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202006sum'] },
                { name: '成功', value: this.dataMap.dataSI['202006sum'] },
                { name: '失败', value: this.dataMap.dataTI['202006sum'] }
              ] }
            ]
          }
        ]
      }

      let mydataNumberChart = this.$echarts.init(
        document.getElementById('chartWarraper')
      )
      mydataNumberChart.setOption(option)
    },
    cpuFunc () {
      let dataVolumeOption = {
        title: {
          text: 'CPU',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('cpu')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    memoryFunc () {
      let dataVolumeOption = {
        title: {
          text: '内存资源监控',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('memory')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    dataNumberFunc () {
      let dataVolumeOption = {
        title: {
          text: '记录总数',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('dataNumber')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    dataVolumeFunc () {
      let dataVolumeOption = {
        title: {
          text: '数据记录',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('dataVolume')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    // tab 2
    init1 () {
      this.dataMap.dataGDP = dataFormatter({
        // max : 60000,
        202006: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73, 7360.92, 9248.53, 5800.25, 25776.91, 15012.46, 9333.4, 9439.6, 31777.01, 5823.41, 1254.17, 4676.13, 10562.39, 2884.11, 4772.52, 341.43, 5757.29, 2703.98, 797.35, 919.11, 3523.16],
        202005: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47, 6112.5, 7583.85, 4820.53, 21900.19, 12362.79, 7617.47, 7688.67, 26587.76, 4746.16, 1065.67, 3907.23, 8690.24, 2338.98, 3988.14, 290.76, 4743.61, 2277.35, 648.5, 725.9, 3045.26],
        202004: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68, 5350.17, 6554.69, 4056.76, 18366.87, 10587.42, 6590.19, 6596.1, 22557.37, 3984.1, 918.75, 3467.72, 7385.1, 2005.42, 3462.73, 248.8, 3933.72, 1933.98, 543.32, 612.61, 2604.19],
        202003: [6033.21, 3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3, 5763.35, 3456.7, 15021.84, 8553.79, 5633.24, 5641.94, 18864.62, 3433.5, 819.66, 3034.58, 6379.63, 1677.8, 3081.91, 220.34, 3175.58, 1688.49, 466.1, 537.11, 2209.09],
        202002: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11, 4983.67, 2807.41, 12078.15, 6867.7, 4757.45, 4659.99, 15844.64, 2821.11, 713.96, 2555.72, 5333.09, 1426.34, 2556.02, 185.09, 2587.72, 1399.83, 390.2, 445.36, 1886.35],
        202001: [4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48, 10275.5, 6035.48, 4212.82, 4151.54, 13502.42, 2523.73, 642.73, 2232.86, 4725.01, 1243.43, 2312.82, 162.04, 2253.39, 1232.03, 340.65, 377.16, 1612.6]
      })

      this.dataMap.dataPI = dataFormatter({
        // max : 4000,
        202006: [101.26, 110.19, 1804.72, 311.97, 762.1, 1133.42, 783.8, 915.38, 101.84, 1816.31, 986.02, 1200.18, 1002.11, 905.77, 2509.14, 2217.66, 1378, 1626.48, 1695.57, 1241.35, 361.07, 482.39, 2032, 446.38, 837.35, 54.89, 592.63, 387.55, 83.41, 97.89, 628.72],
        202005: [88.8, 103.35, 1461.81, 276.77, 634.94, 939.43, 672.76, 750.14, 93.81, 1545.05, 925.1, 1011.03, 865.98, 786.14, 2138.9, 1916.74, 1140.41, 1272.2, 1532.17, 1032.47, 323.48, 386.38, 1595.48, 382.06, 724.4, 50.9, 484.81, 334, 67.55, 79.54, 527.8],
        202004: [88.68, 112.38, 1400, 262.42, 589.56, 882.41, 625.61, 684.6, 90.26, 1461.51, 892.83, 966.5, 827.36, 727.37, 1963.51, 1892.01, 1082.13, 1100.65, 1428.27, 912.5, 300.75, 463.4, 1481.14, 368.94, 661.69, 48.04, 435.77, 308.06, 65.34, 72.07, 509.99],
        202003: [87.36, 105.28, 1370.43, 276.3, 522.8, 798.43, 568.69, 605.79, 83.45, 1367.58, 814.1, 950.5, 786.84, 664.5, 1778.45, 1649.29, 1020.09, 1022.45, 1248.59, 817.88, 278.76, 428.05, 1379.93, 334.5, 607.75, 44.3, 387.88, 286.78, 60.7, 65.33, 461.26],
        202002: [84.11, 89.91, 1064.05, 215.19, 420.1, 615.8, 488.23, 504.8, 81.02, 1162.45, 717.85, 749.4, 692.94, 560, 1480.67, 1198.7, 798.35, 886.47, 1072.91, 658.78, 244.29, 339.06, 1128.61, 298.69, 494.6, 40.7, 302.66, 237.91, 48.47, 55.63, 412.9],
        202001: [82.44, 84.21, 956.84, 197.8, 374.69, 590.2, 446.17, 474.2, 79.68, 1110.44, 685.2, 783.66, 664.78, 535.98, 1390, 1288.36, 707, 847.25, 1015.08, 601.99, 222.89, 317.87, 1047.95, 281.1, 463.44, 39.75, 282.21, 215.51, 47.31, 52.95, 305]
      })

      this.dataMap.dataSI = dataFormatter({
        // max : 26600,
        202006: [2509.4, 2892.53, 7201.88, 3454.49, 3193.67, 5544.14, 2475.45, 3695.58, 5571.06, 14471.26, 10154.25, 3370.96, 4476.42, 2975.53, 14647.53, 8282.83, 4143.06, 3977.72, 16004.61, 2425.29, 364.26, 2368.53, 4648.79, 1124.79, 2038.39, 98.48, 2986.46, 1279.32, 419.03, 455.04, 1647.55],
        202005: [2191.43, 2457.08, 6110.43, 2755.66, 2374.96, 4566.83, 1915.29, 3365.31, 4969.95, 12282.89, 8511.51, 2711.18, 3695.04, 2419.74, 12574.03, 6724.61, 3365.08, 3187.05, 13469.77, 1878.56, 308.62, 1871.65, 3775.14, 967.54, 1705.83, 80.1, 2452.44, 1043.19, 331.91, 351.58, 1459.3],
        202004: [2026.51, 2135.07, 5271.57, 2357.04, 1773.21, 3869.4, 1580.83, 2971.68, 4381.2, 10524.96, 7164.75, 2245.9, 3175.92, 1917.47, 10478.62, 5514.14, 2852.12, 2612.57, 11356.6, 1510.68, 240.83, 1564, 3067.23, 821.16, 1426.42, 63.52, 1951.36, 838.56, 264.61, 281.05, 1164.79],
        202003: [1853.58, 1685.93, 4301.73, 1919.4, 1248.27, 3061.62, 1329.68, 2487.04, 3892.12, 8437.99, 6250.38, 1844.9, 2770.49, 1566.4, 8478.69, 4182.1, 2320.6, 2190.54, 9280.73, 1253.7, 205.6, 1376.91, 2489.4, 681.5, 1281.63, 52.74, 1553.1, 713.3, 211.7, 244.05, 914.47],
        202002: [1487.15, 1337.31, 3417.56, 1463.38, 967.49, 2898.89, 1098.37, 2084.7, 3209.02, 6787.11, 5096.38, 1535.29, 2340.82, 1204.33, 6485.05, 3310.14, 1956.02, 1777.74, 7592.78, 984.08, 175.82, 1135.31, 2014.8, 569.37, 1047.66, 47.64, 1221.17, 572.02, 171.92, 194.27, 719.54],
        202001: [1249.99, 1069.08, 2911.69, 1134.31, 754.78, 2609.85, 943.49, 1843.6, 2622.45, 5604.49, 4090.48, 1337.04, 2036.97, 941.77, 5184.98, 2768.75, 1709.89, 1523.5, 6143.4, 846.89, 148.88, 958.87, 1733.38, 481.96, 934.88, 32.72, 1007.56, 501.69, 144.51, 153.06, 603.15]
      })

      this.dataMap.dataTI = dataFormatter({
        // max : 25000,
        202006: [7236.15, 2250.04, 4600.72, 2257.99, 2467.41, 4486.74, 2025.44, 2493.04, 6821.11, 9730.91, 7613.46, 2789.78, 3770, 1918.95, 8620.24, 4511.97, 3812.34, 3835.4, 14076.83, 2156.76, 528.84, 1825.21, 3881.6, 1312.94, 1896.78, 188.06, 2178.2, 1037.11, 294.91, 366.18, 1246.89],
        202005: [5837.55, 1902.31, 3895.36, 1846.18, 1934.35, 3798.26, 1687.07, 2096.35, 5508.48, 7914.11, 6281.86, 2390.29, 3022.83, 1614.65, 7187.26, 3721.44, 3111.98, 3229.42, 11585.82, 1835.12, 433.57, 1649.2, 3319.62, 989.38, 1557.91, 159.76, 1806.36, 900.16, 249.04, 294.78, 1058.16],
        202004: [4854.33, 1658.19, 3340.54, 1611.07, 1542.26, 3295.45, 1413.83, 1857.42, 4776.2, 6612.22, 5360.1, 2137.77, 2551.41, 1411.92, 5924.74, 3181.27, 2655.94, 2882.88, 9772.5, 1560.92, 377.17, 1440.32, 2836.73, 815.32, 1374.62, 137.24, 1546.59, 787.36, 213.37, 259.49, 929.41],
        202003: [4092.27, 1319.76, 2805.47, 1375.67, 1270, 2811.95, 1223.64, 1657.77, 4097.26, 5198.03, 4584.22, 1963.9, 2206.02, 1225.8, 4764.7, 2722.4, 2292.55, 2428.95, 8335.3, 1361.92, 335.3, 1229.62, 2510.3, 661.8, 1192.53, 123.3, 1234.6, 688.41, 193.7, 227.73, 833.36],
        202002: [3435.95, 1150.81, 2439.68, 1176.65, 1000.79, 2487.85, 1075.48, 1467.9, 3404.19, 4493.31, 3890.79, 1638.42, 1949.91, 1043.08, 4112.43, 2358.86, 2003.08, 1995.78, 7178.94, 1178.25, 293.85, 1081.35, 2189.68, 558.28, 1013.76, 96.76, 1063.89, 589.91, 169.81, 195.46, 753.91],
        202001: [2982.57, 997.47, 2149.75, 992.69, 811.47, 2258.17, 958.88, 1319.4, 3038.9, 3891.92, 3227.99, 1399.02, 1765.8, 972.73, 3700.52, 1978.37, 1795.93, 1780.79, 6343.94, 1074.85, 270.96, 956.12, 1943.68, 480.37, 914.5, 89.56, 963.62, 514.83, 148.83, 171.14, 704.5]
      })

      this.dataMap.dataEstate = dataFormatter({
        // max : 3600,
        202006: [658.3, 156.64, 397.14, 117.01, 136.5, 318.54, 131.01, 194.7, 773.61, 1017.91, 794.41, 281.98, 435.22, 184.67, 786.51, 348.7, 294.73, 254.81, 1722.07, 192.2, 44.45, 158.2, 336.2, 80.24, 165.92, 11.92, 125.2, 73.21, 15.17, 25.53, 68.9],
        202005: [493.73, 122.67, 330.87, 106, 98.75, 256.77, 112.29, 163.34, 715.97, 799.73, 688.86, 231.66, 331.8, 171.88, 664.9, 298.19, 217.17, 215.63, 1430.37, 165.05, 38.2, 143.88, 286.23, 76.38, 148.69, 10.02, 108.62, 63.78, 14.1, 22.97, 55.79],
        202004: [821.5, 183.44, 467.97, 134.12, 191.01, 410.43, 153.03, 225.81, 958.06, 1365.71, 981.42, 366.57, 511.5, 225.96, 953.69, 447.44, 409.65, 301.8, 2029.77, 239.45, 67.19, 196.06, 376.84, 93.19, 193.59, 13.24, 153.98, 83.52, 16.98, 29.49, 91.28],
        202003: [436.11, 106.14, 231.08, 95.1, 73.81, 203.1, 97.93, 137.74, 666.3, 534.17, 587.83, 188.28, 248.44, 167.2, 473.27, 236.44, 204.8, 191.5, 1103.75, 122.52, 30.64, 129.12, 264.3, 68.3, 116.54, 5.8, 95.9, 56.84, 13, 20.78, 53.55],
        202002: [341.88, 92.31, 185.19, 78.73, 61.05, 188.49, 91.99, 127.2, 487.82, 447.47, 473.16, 162.63, 215.84, 138.02, 418.21, 217.58, 176.8, 186.49, 955.66, 100.93, 25.14, 113.69, 231.72, 59.86, 103.79, 4.35, 83.9, 48.09, 11.41, 16.85, 47.84],
        202001: [298.02, 73.04, 140.89, 65.83, 51.48, 130.94, 76.11, 118.7, 384.86, 371.09, 360.63, 139.18, 188.09, 125.27, 371.13, 199.31, 145.17, 165.29, 808.16, 82.83, 21.45, 90.48, 210.82, 53.49, 95.68, 3.42, 77.68, 41.52, 9.74, 13.46, 43.04]
      })

      this.dataMap.dataFinancial = dataFormatter({
        // max : 3200,
        202006: [1302.77, 288.17, 347.65, 218.73, 148.3, 386.34, 126.03, 155.48, 1209.08, 1054.25, 1251.43, 223.85, 385.84, 101.34, 734.9, 302.31, 337.27, 260.14, 1705.08, 190.73, 34.43, 247.46, 359.11, 122.25, 168.55, 11.51, 231.03, 61.6, 27.67, 51.05, 149.22],
        202005: [982.37, 186.87, 284.04, 169.63, 108.21, 303.41, 100.75, 74.17, 825.2, 653.25, 906.37, 166.01, 243.9, 79.75, 524.94, 219.72, 174.99, 204.72, 899.91, 129.14, 16.37, 213.7, 299.5, 89.43, 143.62, 6.44, 152.25, 50.51, 23.69, 36.99, 99.25],
        202004: [840.2, 147.4, 213.47, 135.07, 72.52, 232.85, 83.63, 35.03, 675.12, 492.4, 686.32, 127.05, 186.12, 69.55, 448.36, 181.74, 127.32, 162.37, 661.81, 91.93, 13.16, 185.18, 262.26, 73.67, 130.5, 7.57, 127.58, 44.73, 20.36, 32.25, 80.34],
        202003: [713.79, 136.97, 209.1, 110.29, 55.89, 188.04, 77.17, 32.2, 612.45, 440.5, 523.49, 94.1, 171, 65.1, 343.37, 170.82, 118.85, 118.64, 602.68, 74, 11.56, 162.38, 236.5, 60.3, 118.4, 5.4, 90.1, 42.99, 19, 27.92, 70.3],
        202002: [635.56, 112.79, 199.87, 118.48, 55.89, 145.38, 73.15, 32.2, 517.97, 392.11, 451.54, 87.45, 150.09, 64.31, 329.71, 165.11, 107.31, 99.35, 534.28, 61.59, 10.68, 147.04, 206.24, 48.01, 105.48, 4.74, 77.87, 42.31, 17.98, 24.8, 64.92],
        202001: [561.91, 76.86, 179.6, 124.1, 48.39, 137.18, 75.45, 31.6, 485.25, 368.86, 347.53, 81.85, 138.28, 76.51, 310.07, 158.77, 96.95, 92.43, 454.65, 35.86, 10.08, 134.52, 183.13, 41.45, 102.39, 2.81, 67.3, 42.08, 16.75, 21.45, 52.18]
      })
      let option1 = {
        baseOption: {
          timeline: {
            axisType: 'category',
            // realtime: false,
            // loop: false,
            autoPlay: true,
            // currentIndex: 2,
            playInterval: 1000,
            // controlStyle: {
            //     position: 'left'
            // },
            data: [
              '2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06'
            ],
            label: {
              formatter: function (s) {
                let m = (new Date(s)).getMonth()+1
                if (m < 10) {
                  m = '0' + m
                }
                return (new Date(s)).getFullYear() + '-' + m
              }
            }
          },
          title: {
            subtext: '数据来自光大'
          },
          tooltip: {
          },
          legend: {
            left: 'center',
            data: ['运行中', '成功', '失败', '已取消', '已暂停', '等待'],
            selected: {
              '已取消': false, '已暂停': false, '等待': false
            }
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '')
                  }
                }
              }
            }
          },
          xAxis: [
            {
              'type': 'category',
              'axisLabel': { 'interval': 0 },
              'data': [
                '01', '\n02', '03', '\n04', '05', '\n06', '07', '\n08',
                '09', '\n10', '11', '\n12', '13', '\n14', '15', '\n16',
                '17', '\n18', '19', '\n20', '21', '\n22', '23', '\n24',
                '25', '\n26', '27', '\n28', '29', '\n30', '31'
              ],
              splitLine: { show: false }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '监控（个数）'
            }
          ],
          series: [
            { name: '运行中', type: 'bar' },
            { name: '成功', type: 'bar' },
            { name: '失败', type: 'bar' },
            { name: '已取消', type: 'bar' },
            { name: '已暂停', type: 'bar' },
            { name: '等待', type: 'bar' },
            {
              name: '任务占比',
              type: 'pie',
              center: ['75%', '35%'],
              radius: '28%',
              z: 100
            }
          ]
        },
        options: [
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202001'] },
              { data: this.dataMap.dataFinancial['202001'] },
              { data: this.dataMap.dataEstate['202001'] },
              { data: this.dataMap.dataPI['202001'] },
              { data: this.dataMap.dataSI['202001'] },
              { data: this.dataMap.dataTI['202001'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202001sum'] },
                { name: '成功', value: this.dataMap.dataSI['202001sum'] },
                { name: '失败', value: this.dataMap.dataTI['202001sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202002'] },
              { data: this.dataMap.dataFinancial['202002'] },
              { data: this.dataMap.dataEstate['202002'] },
              { data: this.dataMap.dataPI['202002'] },
              { data: this.dataMap.dataSI['202002'] },
              { data: this.dataMap.dataTI['202002'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202002sum'] },
                { name: '成功', value: this.dataMap.dataSI['202002sum'] },
                { name: '失败', value: this.dataMap.dataTI['202002sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202003'] },
              { data: this.dataMap.dataFinancial['202003'] },
              { data: this.dataMap.dataEstate['202003'] },
              { data: this.dataMap.dataPI['202003'] },
              { data: this.dataMap.dataSI['202003'] },
              { data: this.dataMap.dataTI['202003'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202003sum'] },
                { name: '成功', value: this.dataMap.dataSI['202003sum'] },
                { name: '失败', value: this.dataMap.dataTI['202003sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202004'] },
              { data: this.dataMap.dataFinancial['202004'] },
              { data: this.dataMap.dataEstate['202004'] },
              { data: this.dataMap.dataPI['202004'] },
              { data: this.dataMap.dataSI['202004'] },
              { data: this.dataMap.dataTI['202004'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202004sum'] },
                { name: '成功', value: this.dataMap.dataSI['202004sum'] },
                { name: '失败', value: this.dataMap.dataTI['202004sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202005'] },
              { data: this.dataMap.dataFinancial['202005'] },
              { data: this.dataMap.dataEstate['202005'] },
              { data: this.dataMap.dataPI['202005'] },
              { data: this.dataMap.dataSI['202005'] },
              { data: this.dataMap.dataTI['202005'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202005sum'] },
                { name: '成功', value: this.dataMap.dataSI['202005sum'] },
                { name: '失败', value: this.dataMap.dataTI['202005sum'] }
              ] }
            ]
          },
          {
            title: { text: '任务监控' },
            series: [
              { data: this.dataMap.dataGDP['202006'] },
              { data: this.dataMap.dataFinancial['202006'] },
              { data: this.dataMap.dataEstate['202006'] },
              { data: this.dataMap.dataPI['202006'] },
              { data: this.dataMap.dataSI['202006'] },
              { data: this.dataMap.dataTI['202006'] },
              { data: [
                { name: '运行中', value: this.dataMap.dataPI['202006sum'] },
                { name: '成功', value: this.dataMap.dataSI['202006sum'] },
                { name: '失败', value: this.dataMap.dataTI['202006sum'] }
              ] }
            ]
          }
        ]
      }

      let mydataNumberChart1 = this.$echarts.init(
        document.getElementById('chartWarraper1')
      )
      mydataNumberChart1.setOption(option1)
    },
    cpuFunc1 () {
      let dataVolumeOption = {
        title: {
          text: 'CPU',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('cpu1')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    memoryFunc1 () {
      let dataVolumeOption = {
        title: {
          text: '内存资源监控',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('memory1')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    dataNumberFunc1 () {
      let dataVolumeOption = {
        title: {
          text: '记录总数',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('dataNumber1')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    },
    dataVolumeFunc1 () {
      let dataVolumeOption = {
        title: {
          text: '数据记录',
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#333'
          }
        },
        xAxis: {
          data: [2020.01, 2020.02, 2020.03, 2020.04, 2020.05, 2020.06, 2020.07],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: 'center',
          data: ['平均值', '最大值', '最小值']
        },
        series: [{
          name: '平均值',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [12, 23, 54, 23, 64, 23, 23],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最大值',
          itemStyle: {
            normal: {
              color: '#67C23A',
              lineStyle: {
                color: '#67C23A',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [14, 26, 58, 28, 68, 25, 22],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '最小值',
          itemStyle: {
            normal: {
              color: '#E6A23C',
              lineStyle: {
                color: '#E6A23C',
                width: 2
              }
            }
          },
          // smooth: true,
          type: 'line',
          // data: this.successLine,
          data: [10, 20, 50, 20, 60, 6, 1],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      }
      let mydataVolumeChart = this.$echarts.init(
        document.getElementById('dataVolume1')
      )
      mydataVolumeChart.setOption(dataVolumeOption)
    }
  },
  created () { },
  mounted () {
    this.init()
    this.cpuFunc()
    this.memoryFunc()
    this.dataNumberFunc()
    this.dataVolumeFunc()
    this.init1()
    this.cpuFunc1()
    this.memoryFunc1()
    this.dataNumberFunc1()
    this.dataVolumeFunc1()
    // 监听页面高度
    this.$nextTick(() => {
      window.addEventListener('scroll', () => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || document.querySelector('.main .content-wrapper').scrollTop
        if (scrollTop > 60) {
          document.getElementById('box1').style.top = scrollTop - 60 + 'px'
          document.getElementById('box2').style.top = scrollTop - 60 + 'px'
        } else {
          document.getElementById('box1').style.top = '0px'
          document.getElementById('box2').style.top = '0px'
        }
      }, true)
    })
    
  }
}
</script>
<style>
.margin-top-10{
  margin-top: 10px;
}
</style>
