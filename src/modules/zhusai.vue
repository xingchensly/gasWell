<template>
    <div class="zhusai">
      <div class="zs_pic">
        <div class="im_flex"></div>
        <img src="../img/zs.jpg" alt="">
      </div>
      <div class="zs_data">
        <div class="zs_real">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>实时数据</span>
          </div>
          <div v-for="(value,index) in wellRealTimeData" :key="index" class="text item">
            <template v-if="value.display&&curWellzhuShow.indexOf(index)!=-1">
              {{value.tagDes}}:
              <span v-if="value.value">{{value.value.tag_value | numberFormat}}</span>
              {{value.tagUnit}}
            </template>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>生产制度</span>
          </div>
          <div>
            井站名称:
            <span>{{curWellName}}</span>
          </div>
          <div v-for="(value,index) in zhusaiOrder" :key="index" class="text item">
              {{value.tagDes}}:
              <span v-if="value.value">{{value.value.tag_value}}</span>
              {{value.tagUnit}}
          </div>
        </el-card>
        </div>
        <div class="zs_chart" ref="zs_chart"></div>
      </div>
    </div>
</template>
<script>
let echarts = require("echarts");

import { chartDataList ,chartValve} from "../js/config.js";
import { userGetWellHistory,setWellData,loginIn ,userGetWellRealTimeData,userGetFieldRealTimeData} from "../js/api";

export default {
  props:[
    'wellRealTimeData','feildRealTimeData','wellSelectOptions','curWellId'
  ],
  computed:{
    curWellName:function(){
        let curWellNames;
        this.wellSelectOptions.forEach((value,index,arrs)=>{
            if(value.wellID==this.curWellId){
                  curWellNames=value.wellName
            }
        })
        return curWellNames;
    },
    zhusaiOrder:function(){
      let array=this.wellRealTimeData.filter((value,index,arr)=>{
          if(value.tagDes=='开井时间'||value.tagDes=='关井时间'){
            return true;
          }else{
            return false;
          }
      });
      let newarr=array.concat(this.zs_zhidu);
      console.log(newarr)

      return newarr;
    }
  },
  data() {
    return {
      historyData:[],
      curWellzhuShow:[0,1,4,12],
      chartDataList:chartDataList,
      zs_zhidu:[
        {tagDes:'井站归属',value:{tag_value:'长庆油田公司'},tagUnit:''},
        {tagDes:'底座深度',value:{tag_value:'3567m'},tagUnit:''},
        {tagDes:'生产方式',value:{tag_value:'柱塞排水'},tagUnit:''},
      ],
      zs_show:false,
      zs_chart:null
    };
  },
  created() {
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
    ShowChart(){
      let endTime = new Date().getTime();
      let startTime = endTime - 1 * 3600 * 1000;
      this.getHistoryDataFn(startTime, endTime);
    },
    async getHistoryDataFn(st, et) {
      let tagArrTemple = [];
      chartDataList.zs_chart.legend.data.forEach((value, index, arr) => {
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
      historyData.forEach((value, index, arr) => {
        chartDataList.zs_chart.series.forEach((value1, index1, arr1) => {
          if (value1.tagName == value.tagName) {
            chartDataList.zs_chart.series[index1].data = value.datas&&value.datas.length>0?value.datas:[];
          }
        });
      });
      this.zs_chart.setOption(this.chartDataList.zs_chart);
    },    
  },
  components: {},
  mounted() {
    this.zs_chart = echarts.init(this.$refs.zs_chart);
    // this.zs_chart.setOption(this.chartDataList.zs_chart);
    console.log('2')
    this.ShowChart();
  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
.zhusai{
  width:80%;
  height:80%;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  border:1px solid #000;
  display: flex;
  .zs_pic{
    // text-align: center;
    width:685px;
    display: flex;
    flex-direction: column;
    .im_flex{
      width: 100%;
      flex:1;
      background-color:#8DCD79;
    }
    img{
      width:100%;
      height:100%;
    }
  }
  .zs_data{
    flex:1;
    height:100%;
    display: flex;
    flex-direction: column;
    .zs_real{
      width:100%;
      height:250px;
      display:flex;
      justify-content: space-between;
      .el-card{
        width:50%;
        border-radius: 0px;
        .el-card__body{
          .item{
            margin-bottom: $span;
          }
        }
      }
    }
    .zs_chart{
      margin-top:$span;
      background-color: #fff;
    // background-color: $bgc;
      flex:1;
      width:100%;
    }
  }
}
</style>


