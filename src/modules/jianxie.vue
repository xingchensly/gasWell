<template>
    <div class="jianxie">
      <div class="jx_sum">
        <div class="jx_pic">
          <img src="../img/jianxie.png" alt="">
        </div>
        <div class="jx_data">
          <div class="jx_real">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{curWellName}}</span>
              </div>
              <div v-for="(value,index) in wellRealTimeData" :key="index" class="text item">
                <template v-if="value.display&&curWellJianShow.indexOf(index)!=-1">
                  {{value.tagDes}}:
                  <span v-if="value.value">{{value.value.tag_value | numberFormat}}</span>
                  {{value.tagUnit}}
                </template>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>气井自动间歇控制</span>
              </div>
              <div v-for="(value,index) in jx_zhidu" :key="index" class="text item">
                  {{value.tagDes}}:
                  <span v-if="value.value">{{value.value.tag_value}}</span>
                  {{value.tagUnit}}
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="jx_chart" ref="jx_chart"></div>
    </div>
</template>
<script>
let echarts = require("echarts");
import { chartDataList} from "../js/config.js";
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
    // jianxieOrder:function(){
    //   let array=this.wellRealTimeData.filter((value,index,arr)=>{
    //       if(value.tagDes=='开井时间间隔'||value.tagDes=='关井时间间隔'){
    //         return true;
    //       }else{
    //         return false;
    //       }
    //   });
    //   return array.concat(this.jx_zhidu);
    // }
  },
  data() {
    return {
      curWellJianShow:[0,1,2,3,4],
      chartDataList:chartDataList,
      jx_zhidu:[
        {tagDes:'开井时间间隔',value:{tag_value:'3小时'},tagUnit:''},
        {tagDes:'关井时间间隔',value:{tag_value:'3小时'},tagUnit:''},
        {tagDes:'距离开井时间',value:{tag_value:'3小时34分钟'},tagUnit:''},
        {tagDes:'生产模式',value:{tag_value:'自动间歇关'},tagUnit:''},
        {tagDes:'反馈状态',value:{tag_value:'关状态'},tagUnit:''},
      ],
      historyData:[],
      jx_show:false,
      jx_chart:null
    };
  },
  async created() {
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
      chartDataList.jx_chart.legend.data.forEach((value, index, arr) => {
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
        chartDataList.jx_chart.series.forEach((value1, index1, arr1) => {
          if (value1.tagName == value.tagName) {
            chartDataList.jx_chart.series[index1].data = value.datas&&value.datas.length>0?value.datas:[];
          }
        });
      });
      this.jx_chart.setOption(this.chartDataList.jx_chart);
    },
  },
  components: {},
  mounted() {
    this.jx_chart = echarts.init(this.$refs.jx_chart);
    this.ShowChart()

  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
// $bgc:#122D4A;
.jianxie{
  width:80%;
  height:80%;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  display: flex;
  border:1px solid #000;
  flex-direction: column;
  .jx_sum{
    width:100%;
    height:46%;
    display: flex;
  }
  .jx_pic{
      width:56%;
      height:100%;
      margin-right:$span;
      text-align: center;
    img{
      // height:100%;
      width:100%;
      height:100%;
    }
  }
  .jx_data{
    flex:1;
    height:100%;
    display: flex;
    background-color: #fff;
    // background-color: $bgc;
    flex-direction: column;
    .jx_real{
      width:100%;
      height:100%;
      display:flex;
      justify-content: space-between;
      .el-card{
        width:50%;
        // margin:$span;
        border-radius: 0px;
        .el-card__body{
          .item{
            margin-bottom: $span;
          }
        }
      }
    }
  }
  .jx_chart{
    margin-top:$span;
    background-color: #fff;
    flex:1;
    width:100%;
  }
}
</style>


