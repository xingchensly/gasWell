<template>
  <div class="container">
    <section class="summary">
      <div class="pipe">
        <div class="wellSelect">
          <el-select v-model="wellValue" placeholder="请选择" @change="wellSelect">
            <el-option
              v-for="item in wellSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="voltage fl">
          <p v-for="(value,index) in options1" :key="index">
            {{value}}:
            <span v-if="realTimeData[value]">{{realTimeData[value].tag_value}}</span>
            {{unit[value]}}
          </p>
        </div>
        <div class="flow fl">
          <p v-for="(value,index) in options2" :key="index">
            {{value}}:
            <span v-if="realTimeData[value]">{{realTimeData[value].tag_value}}</span>
            {{unit[value]}}
          </p>
        </div>
      </div>
      <div class="video">
        <!-- <img src="../img/pipe.jpg" alt=""> -->
        <img src="http://117.34.118.57:33061/images/qijing.jpg" alt />
      </div>
    </section>
    <section class="charts">
      <div class="chart" ref="chart"></div>
      <div class="select">
        <el-button :type="curLine==0?'primary':''" @click="RealTimeTrigger">实时曲线</el-button>
        <el-button :type="curLine==1?'primary':''" @click="dialogFormVisible=true">历史曲线</el-button>
      </div>
    </section>
    <el-dialog title="历史曲线配置" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="查询时间范围" :label-width="formLabelWidth">
          <el-date-picker
            v-model="pickDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dateConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let echarts = require("echarts");
import { chartDataList } from "../js/config.js";
import { getWellInfo,getRealTimeData, getHistoryData } from "../js/api";
export default {
  data() {
    return {
      wellSelectOptions: [{
          value: 14,
          label: '气井1'
        }, {
          value: 15,
          label: '气井2'
        }, {
          value: 16,
          label: '气井3'
        }],
      wellValue:'',
      curLine: 0,
      pickDate: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogFormVisible: false,
      unit: {
        太阳能板电压: "V",
        太阳能板电流: "A",
        阀门开度: "%",
        套压: "MPa",
        油压: "MPa",
        流量: "m³/h",
        流量计压力: "V",
        流量计温度: "℃",
        蓄电池电压: "V"
      },
      options1: ["太阳能板电压", "太阳能板电流", "阀门开度", "套压", "油压"],
      options2: ["流量", "流量计压力", "流量计温度", "蓄电池电压"],
      value: "",
      chartDataList: chartDataList,
      realTimeData: {},
      historyData: {},
      timer: null,
      interval: 60000,
      myChart: null
    };
  },
  async created() {
    // this.wellSelectOptions=await getWellInfo();
    const realTimeDataRequest=await getRealTimeData();
    this.$set(this, "realTimeData", realTimeDataRequest);
    this.showRealTimeChart();
  },
  methods: {
    wellSelect(value){
      console.log(value)
    },
    RealTimeTrigger() {
      this.curLine = 0;
      this.showRealTimeChart();
    },
    dateConfirm() {
      this.dialogFormVisible = false;
      this.curLine = 1;
      this.getHistoryDataFn(
        new Date(this.pickDate[0]).getTime(),
        new Date(this.pickDate[1]).getTime()
      );
    },
    showRealTimeChart() {
      let endTime = new Date().getTime();
      let startTime = endTime - 1 * 3600 * 1000;
      this.getHistoryDataFn(startTime, endTime);
    },
    async getRealTimeDataFn() {
      this.$set(this, "realTimeData", await getRealTimeData());
      this.updateRealTimeDataToLineChart(this.realTimeData);
    },
    tagNameToId(name) {
      return this.realTimeData[name].tag_id;
    },
    async getHistoryDataFn(st, et) {
      let tagArrTemple = [];
      chartDataList.lineArea2.legend.data.forEach((value, index, arr) => {
        tagArrTemple.push(this.tagNameToId(value));
      });
      tagArrTemple = "[" + tagArrTemple + "]";
      const realHistoryDataRequest=await getHistoryData(tagArrTemple, st, et);
      this.$set(this, "historyData", realHistoryDataRequest);
      this.setHistoryDataToLineChart(this.historyData);
    },
    setHistoryDataToLineChart(historyData) {
      //添加历史数据到echart
      clearInterval(this.timer);
      console.log("setHistoryDataToLineChart---", historyData);
      historyData.forEach((value, index, arr) => {
        chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
          if (value1.name == value.tagName) {
            chartDataList.lineArea2.series[index1].data = value.datas;
          }
        });
      });
      this.myChart.setOption(this.chartDataList.lineArea2);
      if (this.curLine == 0) {
        //如果显示实时数据曲线，添加定时器获取实时数据
        this.timer = setInterval(() => {
          this.getRealTimeDataFn();
        }, this.interval);
      }
    },
    updateRealTimeDataToLineChart(realTimeData) {
      //添加实时数据到echart
      chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
        Object.keys(realTimeData).forEach((value, index, arr) => {
          if (value1.name == value) {
            let arrTemp = [];
            arrTemp.push(new Date(realTimeData[value].update_time).getTime());
            arrTemp.push(realTimeData[value].tag_value);
            chartDataList.lineArea2.series[index1].data.push(arrTemp);
          }
        });
      });
      this.myChart.setOption(this.chartDataList.lineArea2);
    }
  },
  components: {},
  mounted() {
    this.myChart = echarts.init(this.$refs.chart);
    this.myChart.setOption(this.chartDataList.lineArea2);
  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
$span: 5px;
$bgc: #c8c8c8;
// $bgc:#122D4A;

.container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  @include flexCenter;
  section {
    width: 100%;
    @include flexCenter;
  }
  .summary {
    height: 460px;
    margin-bottom: $span;
    .pipe {
      width: 1108px;
      height: 100%;
      background: url("../img/pipe.png");
      background-size: contain;
      margin-right: $span;
      background-color: $bgc;
      position: relative;
      .wellSelect{
        position: absolute;
        top:10px;
        left:50px;
      }
      .voltage,
      .flow {
        margin-left: 100px;
        margin-top: 70px;
        p {
          line-height: 24px;
        }
        span {
          color: blue;
        }
      }
      .voltage {
        // position:absolute;
      }
      .flow {
      }
    }
    .video {
      flex: 1;
      height: 100%;
      background-color: $bgc;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .charts {
    padding-top: 20px;
    box-sizing: border-box;
    flex: 1;
    @include flexCenter;
    flex-direction: column;
    background-color: $bgc;
    position: relative;
    .select {
      width: 300px;
      height: 40px;
      position: absolute;
      left: 50px;
      top: 20px;
    }
    .chart {
      width: 100%;
      flex: 1;
      height: 100%;
      // background-color: #122D4A;
      background-color: $bgc;
    }
  }
}
</style>


