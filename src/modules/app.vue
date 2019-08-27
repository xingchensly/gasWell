<template>
  <div class="container">
    <section class="summary">
      <div class="pipe">
        <div class="wellSelect">
          <el-select v-model="curWellValue" placeholder="请选择" @change="wellSelect">
            <el-option
              v-for="item in wellSelectOptions"
              :key="item.device_id"
              :label="item.device_name"
              :value="item.device_id"
            ></el-option>
          </el-select>
        </div>
        <div class="valveOutline pointer" @click="showValve">
          <!-- <p class="valveValue">开度：12%</p> -->
          <el-tag type="success" effect="dark" class="valveValue" v-if="realTimeData['气动阀反馈']!=undefined">开度：{{realTimeData['气动阀反馈'].tag_value}}</el-tag>
        </div>
        <div class="voltage fl">
          <p v-for="(value,index) in options1" :key="index">
            {{value}}:
            <span
              v-if="realTimeData[value]"
            >{{realTimeData[value].tag_value | numberFormat}}</span>
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
        <div class="arrow">
          <i class="el-icon-caret-left fl pointer" @click="showImage(-1)"></i>
          <i class="el-icon-caret-right fr pointer" @click="showImage(1)"></i>
        </div>
        <div class="imgContainer">
          <img :src="imgUrl" alt />
        </div>
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
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%">
      <div class="valveInputcontainer">
        <p>调节开度</p>
        <el-slider v-model="valve" class="valveInput" @input="valveChange"></el-slider>
      </div>
      <div class="valveChartContainer">
        <div ref="valve" class="valveChart"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>    
  </div>
</template>
<script>
let echarts = require("echarts");
import { chartDataList ,chartValve} from "../js/config.js";
import { getWellInfo, getRealTimeData, getHistoryData } from "../js/api";
import { urlList } from "../config/urls.js";
export default {
  data() {
    return {
      valve:"",
      dialogVisible: false,
      imgUrl: "",
      imgIndex: 0,
      wellSelectOptions: [],
      curWellValue: "",
      curWellId: null,
      curLine: 0,
      pickDate: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogFormVisible: false,
      unit: {
        光伏板电压: "V",
        光伏板电流: "A",
        阀门开度: "%",
        套压: "MPa",
        油压: "MPa",
        瞬时流量: "m³/h",
        累计流量: "m³/h",
        流量计压力: "V",
        流量计温度: "℃",
        蓄电池电压: "V",
        蓄电池电流: "A"
      },
      options1: [
        "油压",
        "套压",
        "流量计压力",
        "流量计温度",
        "瞬时流量",
        "累计流量"
      ],
      options2: ["光伏板电压", "光伏板电流", "蓄电池电压", "蓄电池电流"],
      value: "",
      chartDataList: chartDataList,
      chartValve: chartValve,
      realTimeData: {},
      historyData: {},
      timer: null,
      interval: 60000,
      lineChart: null,
      gaugeChart: null
    };
  },
  async created() {
    // this.wellSelectOptions=await getWellInfo();
    this.showImage(0);
    const wellInfo = await getWellInfo();
    wellInfo.shift(); //剔除井场
    this.$set(this, "wellSelectOptions", wellInfo);
    this.$set(this, "curWellValue", this.wellSelectOptions[0].device_name);
    this.$set(this, "curWellId", this.wellSelectOptions[0].device_id);
    this.wellInit(this.wellSelectOptions[0].device_id);
  },
  filters: {
    numberFormat(value) {
      var param = "";
      var k = 10000,
        sizes = ["", "万", "亿", "万亿", "万万亿"],
        i;
      if (value < k) {
        param = value;
      } else {
        i = Math.floor(Math.log(value) / Math.log(k));
        param = (value / Math.pow(k, i)).toFixed(2) + sizes[i];
      }
      return param;
    }
  },
  methods: {
    showValve(){
      this.dialogVisible=true;
      this.$nextTick(()=>{
        console.log(this.$refs.valve)
        this.gaugeChart = echarts.init(this.$refs.valve);
        this.gaugeChart.setOption(this.chartValve);
      })
    },
    valveChange(value){
      this.chartValve.series[0].data[0].value=value;
      this.gaugeChart.setOption(this.chartValve);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    showImage(index) {
      if (index == -1) {
        this.imgIndex += 1;
      } else if (index == 1) {
        this.imgIndex -= 1;
      } else {
        this.imgIndex == 0;
      }
      if (this.imgIndex < 0) this.imgIndex = 0;
      this.imgUrl = urlList.img + "?imgIndex=" + this.imgIndex;
    },
    async wellInit(wellId) {
      const realTimeDataRequest = await getRealTimeData(wellId);
      this.$set(this, "realTimeData", realTimeDataRequest);
      this.showRealTimeChart();
    },
    wellSelect(value) {
      //清空历史数据
      chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
          chartDataList.lineArea2.series[index1].data = [];
      });
      this.$set(this, "curWellId", value);
      this.wellInit(value);
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
      this.$set(this, "realTimeData", await getRealTimeData(this.curWellId));
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
      const realHistoryDataRequest = await getHistoryData(tagArrTemple, st, et);
      this.$set(this, "historyData", realHistoryDataRequest);
      this.setHistoryDataToLineChart(this.historyData);
    },
    setHistoryDataToLineChart(historyData) {
      //添加历史数据到echart
      clearInterval(this.timer);
      historyData.forEach((value, index, arr) => {
        chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
          if (value1.name == value.tagName) {
            chartDataList.lineArea2.series[index1].data = value.datas&&value.datas.length>0?value.datas:[];
          }
        });
      });
      console.log('setHistoryDataToLineChart',this.chartDataList.lineArea2);
      this.lineChart.setOption(this.chartDataList.lineArea2);
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
          if (value1.name == value&&realTimeData[value]&&realTimeData[value].update_time!=null&&realTimeData[value].tag_value!=null) {
            let arrTemp = [];
            arrTemp.push(new Date(realTimeData[value].update_time).getTime());
            arrTemp.push(realTimeData[value].tag_value);
            chartDataList.lineArea2.series[index1].data.push(arrTemp);
          }
        });
      });
      console.log('updateRealTimeDataToLineChart',this.chartDataList.lineArea2);

      this.lineChart.setOption(this.chartDataList.lineArea2);
    }
  },
  components: {},
  mounted() {
    this.lineChart = echarts.init(this.$refs.chart);
    this.lineChart.setOption(this.chartDataList.lineArea2);
  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
$span: 5px;
$bgc: #c8c8c8;
// $bgc:#122D4A;
.el-dialog__body{
  padding:0;
  // padding-bottom: 10px;
}
.container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  @include flexCenter;
  section {
    width: 100%;
    @include flexCenter;
  }
  .valveInputcontainer{
    width:100%;
    // height:40px;
    box-sizing: border-box;
    text-align: center;
    .valveInput{
      width:60%;
      margin: 0 auto;
      // margin-left:50px;
    }
  }
  .valveChartContainer{
    width:100%;
    height:300px;
    position: relative;
  }
  .valveChart{
    position: absolute;
    left:50%;
    transform: translateX(-50%);
    width:440px;
    height:100%;
  }
  .summary {
    height: 46%;
    margin-bottom: $span;
    .pipe {
      width: 56%;
      height: 100%;
      background: url("../img/pipe.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-right: $span;
      background-color: $bgc;
      position: relative;
      .wellSelect {
        position: absolute;
        top: 10px;
        left: 50px;
      }
      .valveOutline{
        border:black dashed 1px;
        position: absolute;
        // width:50px;
        width:6%;
        height:24%;
        // height:70px;
        background-color: transparent;
        top:65%;
        left:33%;
        .valveValue{
          position: absolute;
          transform: translateX(110%);
        }
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
        margin-left:30px;
      }
    }
    .video {
      flex: 1;
      height: 100%;
      background-color: $bgc;
      text-align: center;
      position: relative;
      .arrow {
        width: 100%;
        height: 40px;
        position: absolute;
        top: 50%;
        i {
          color: #fff;
          font-size: 40px;
        }
      }
      .imgContainer {
        width: 100%;
        height: 100%;
      }
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


