<template>
  <div class="gas_container" >
    <section class="summary">
      <div class="pipe">
        <div class="valveOutline pointer" @click="showValve">
          <template  v-for="(values,index) in wellRealTimeData">
            <el-tag class="valveValue" v-if="values.value&&values.display&&values.tagDes=='气动阀反馈'" :key="index">开度：{{values.value.tag_value}}</el-tag>
          </template>
        </div>
        <div class="voltage fl" v-if="wellRealTimeData.length">
          <p v-for="(values,index) in wellRealTimeData" :key="index">
            <template v-if="values.display&&curWellShow.indexOf(index)!=-1">
              {{values.tagDes}}:
              <span v-if="values.value">{{values.value.tag_value | numberFormat}}</span>
              {{values.tagUnit}}
            </template>
          </p>
        </div>
        <div class="flow fl" v-if="feildRealTimeData.length">
          <p v-for="(values,index) in feildRealTimeData" :key="index">
            <template v-if="values.display">
              {{values.tagDes}}:
              <span v-if="values.value">{{values.value.tag_value | numberFormat}}</span>
              {{values.tagUnit}}
            </template>
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
    <el-button @click.stop="changeButton(1)" class="button1" type="primary">间歇画面</el-button>
    <el-button @click.stop="changeButton(2)" class="button2" type="primary">柱塞画面</el-button>
    <div class="mask" @click="changeButton(0)" v-if="buttonNumber==1||buttonNumber==2"></div>
    <jianxie v-if="buttonNumber==1" :wellSelectOptions='wellSelectOptions' :curWellId='curWellId' :wellRealTimeData='wellRealTimeData' :feildRealTimeData='feildRealTimeData'></jianxie>
    <zhusai v-else-if="buttonNumber==2" :wellSelectOptions='wellSelectOptions' :curWellId='curWellId' :wellRealTimeData='wellRealTimeData' :feildRealTimeData='feildRealTimeData'></zhusai>
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
        <el-slider v-model="slideValve" class="valveInput" @input="valveChange"></el-slider>
      </div>
      <div class="valveChartContainer">
        <div ref="valve" class="valveChart"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setValveData">确 定</el-button>
      </span>
    </el-dialog> 
    <el-dialog title="用户信息" :visible.sync="dialogUserInfoShow">
      <el-form :model="userForm" class="userForm">
        <el-form-item label="账户" :label-width="formLabelWidth">
          <el-input v-model="userForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="userForm.code" autocomplete="off" :show-password='true'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserInfoShow = false">取 消</el-button>
        <el-button type="primary" @click="userConfirm">确 定</el-button>
      </div>
    </el-dialog>       
  </div>
</template>
<script>
let echarts = require("echarts");
import { chartDataList ,chartValve} from "../js/config.js";
import { userGetWellHistory,setWellData,loginIn ,userGetWellRealTimeData,userGetFieldRealTimeData} from "../js/api";
import { urlList } from "../config/urls.js";
import zhusai from "./zhusai.vue";
import jianxie from "./jianxie.vue";
export default {
  data() {
    return {
      buttonNumber:0,
      curWellShow:[0,1,2,3,4,5],
      loginIn:false,
      userForm:{
        name:"admin",
        code:null
      },
      dialogUserInfoShow:false,
      slideValve:0,
      dialogVisible: false,
      imgUrl: "",
      imgIndex: 0,
      curWellValue: "",
      curLine: 0,
      pickDate: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogFormVisible: false,
      chartDataList: chartDataList,
      chartValve: chartValve,
      wellRealTimeData: [],
      feildRealTimeData: [],
      historyData: [],
      timer: null,
      interval: 60000,
      imageInterval: 600000,
      lineChart: null,
      zs_chart:null,
      gaugeChart: null
    };
  },
  props:["curWellId","wellSelectOptions"],
  watch:{
    curWellId:function(curvalue,oldvalue){
      if(curvalue===null){
      }else{
          //清空历史数据
          chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
          chartDataList.lineArea2.series[index1].data = [];
        });
        // this.$set(this, "curWell.curWellId", value);
        // this.wellInit(value);
        this.wellInit(this.curWellId);
      }
    }
  },
  async created() {
    this.showImage(0);
    setInterval(() => {
      this.showImage(0);
    }, this.imageInterval);

    // this.wellInit(1);
  },
  filters: {
    numberFormat(value) {
      if(typeof value === 'number' && !isNaN(value)){
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
      }else{
        return 0
      }
    }
  },
  methods: {
    changeButton(index){
      this.buttonNumber=index;
    },
    async userConfirm(){
      this.dialogUserInfoShow = false;
      let userBack=await loginIn(this.userForm);
      if(userBack=="true"){
        this.loginIn=true;
        this.showValve();
      }else{
        this.$message({
          message: '账号或者密码错误',
          type: 'warning'
        });
      }
    },
    async setValveData(){
        this.dialogVisible = false;
        let requestData=await setWellData(this.curWellId,'气动阀开度',this.valve);
        if(requestData=="true"){
            this.$message({
              message: '气动阀开度设置成功',
              type: 'success'
            });
        }else{
            this.$message({
              message: '气动阀开度设置失败',
              type: 'warning'
            });
        }
    },
    showUserDialog(){
      this.dialogUserInfoShow=true;
    },
    showValve(){
      if(!this.loginIn){
        return this.showUserDialog();
      }
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.gaugeChart = echarts.init(this.$refs.valve);
        this.gaugeChart.setOption(this.chartValve);
      })
    },
    valveChange(value){
      if(!this.gaugeChart) return
      this.chartValve.series[0].data[0].value=value;
      this.gaugeChart.setOption(this.chartValve);
    },
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    showImage(index) {
      if (index == -1) {
        this.imgIndex += 1;
      } else if (index == 1) {
        this.imgIndex -= 1;
      } else {
        this.imgIndex == 0;
      }
      if (this.imgIndex < 0) this.imgIndex = 0;
      this.imgUrl = urlList.img + "?imageindex=" + this.imgIndex;
    },
    async wellInit(wellId) {
      this.$set(this, "wellRealTimeData", await userGetWellRealTimeData(wellId));
      //添加tagDes
      this.wellRealTimeData.forEach((value,index,arr)=>{
          chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.lineArea2.series[index1].tagName = value.tagName;
            }
          });
      })
      this.wellRealTimeData.forEach((value,index,arr)=>{
          chartDataList.zs_chart.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.zs_chart.series[index1].tagName = value.tagName;
            }
          });
      })
      this.wellRealTimeData.forEach((value,index,arr)=>{
          chartDataList.jx_chart.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.jx_chart.series[index1].tagName = value.tagName;
            }
          });
      })      
      this.$set(this, "feildRealTimeData", await userGetFieldRealTimeData());
      this.feildRealTimeData.forEach((value,index,arr)=>{
          chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.lineArea2.series[index1].tagName = value.tagName;
            }
          });
      })
      this.feildRealTimeData.forEach((value,index,arr)=>{
          chartDataList.zs_chart.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.zs_chart.series[index1].tagName = value.tagName;
            }
          });
      })
      this.feildRealTimeData.forEach((value,index,arr)=>{
          chartDataList.jx_chart.series.forEach((value1, index1, arr1) => {
            if (value1.name == value.tagDes) {
              chartDataList.jx_chart.series[index1].tagName = value.tagName;
            }
          });
      })            
      this.showRealTimeChart();
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
      this.$set(this, "wellRealTimeData", await userGetWellRealTimeData(this.curWellId));
      this.$set(this, "feildRealTimeData", await userGetFieldRealTimeData());

      this.updateRealTimeDataToLineChart(this.wellRealTimeData);
    },
    toTagName(name) {
      let tagName='';
      this.wellRealTimeData.forEach((value,index,arr)=>{
        if(value.tagDes==name){
          tagName=value.tagName;
        }
      })
      if(!tagName){
        this.feildRealTimeData.forEach((value,index,arr)=>{
          if(value.tagDes==name){
            tagName=value.tagName;
          }
        })
      }
      return tagName;
    },
    async getHistoryDataFn(st, et) {
      let tagArrTemple = [];
      chartDataList.lineArea2.legend.data.forEach((value, index, arr) => {
        tagArrTemple.push(this.toTagName(value));
      });
      // tagArrTemple = "[" + tagArrTemple + "]";
      const realHistoryDataRequest = await userGetWellHistory(tagArrTemple, st, et);
      this.$set(this, "historyData", realHistoryDataRequest);
      this.setHistoryDataToLineChart(this.historyData);
    },
    setHistoryDataToLineChart(historyData) {
      //添加历史数据到echart
      clearInterval(this.timer);
      if(historyData&&historyData.length>0){
        historyData.forEach((value, index, arr) => {
          chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
            if (value1.tagName == value.tagName) {
              chartDataList.lineArea2.series[index1].data = value.datas&&value.datas.length>0?value.datas:[];
            }
          });
        });
      }else{console.log('sly---setHistoryDataToLineChart-historyData',historyData)}
      console.log(this.chartDataList.lineArea2)
      this.lineChart.setOption(this.chartDataList.lineArea2);
      if (this.curLine == 0) {
        //如果显示实时数据曲线，添加定时器获取实时数据
        this.timer = setInterval(() => {
          this.getRealTimeDataFn();
        }, this.interval);
      }
    },
    updateRealTimeDataToLineChart(wellRealTimeData) {
      //添加实时数据到echart
      chartDataList.lineArea2.series.forEach((value1, index1, arr1) => {
        Object.keys(wellRealTimeData).forEach((value, index, arr) => {
          if (value1.name == value&&wellRealTimeData[value]&&wellRealTimeData[value].update_time!=null&&wellRealTimeData[value].tag_value!=null) {
            let arrTemp = [];
            arrTemp.push(new Date(wellRealTimeData[value].update_time).getTime());
            arrTemp.push(wellRealTimeData[value].tag_value);
            chartDataList.lineArea2.series[index1].data.push(arrTemp);
          }
        });
      });
      this.lineChart.setOption(this.chartDataList.lineArea2);
    }
  },
  components: {zhusai,jianxie},
  mounted() {
    this.lineChart = echarts.init(this.$refs.chart);
    this.lineChart.setOption(this.chartDataList.lineArea2);
  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
// $bgc:#122D4A;
.el-dialog__body{
  padding:0;
  // padding-bottom: 10px;
}
.userForm{
  width:80%;
}
.mask{
  position: absolute;
  width:100%;
  height:100%;
  background-color: rgba(0,0,0,0.8);
}
.gas_container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  @include flexCenter;
  .button1,.button2{
    position: absolute;
    top:10px;
    left:350px;
  }
  .button2{
    left:450px;
  }
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
        .el-tag{
          background-color: rgb(64,158,255);
          color:#fff;
        }
        .valveValue{
          position: absolute;
          transform: translate(110%,50%);
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


