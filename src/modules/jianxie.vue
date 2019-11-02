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
                <span>苏6_0_01C4</span>
              </div>
              <div v-for="(value,index) in jx_realData" :key="index" class="text item">
                {{index + " : "+value }}
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>气井自动间歇控制</span>
              </div>
              <div v-for="(value,index) in jx_zhidu" :key="index" class="text item">
                {{index + " : "+value }}
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
export default {
  data() {
    return {
      chartDataList:chartDataList,
      jx_realData:{
        "油压":"1.47Mpa",
        "套压":"1.47Mpa",
        "瞬时流量":"1.47Mpa",
        "外输压力":"1Mpa",
        "温度":"10.24℃",
        "日配产":"1.47m/s"
      },
      jx_zhidu:{
        "开井时间间隔":"3小时",
        "关井时间间隔":"3小时",
        "距离开井时间":"3小时34分钟",
        "生产模式":"自动间歇关",
        "反馈状态":"关状态"
      },
      jx_show:false,
      jx_chart:null
    };
  },
  async created() {
  },
  filters: {
  },
  methods: {},
  components: {},
  mounted() {
    this.jx_chart = echarts.init(this.$refs.jx_chart);
    this.jx_chart.setOption(this.chartDataList.jx_chart);

  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
// $bgc:#122D4A;
.jianxie{
  width:100%;
  height:100%;
  display: flex;
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
    background-color: $bgc;
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
    background-color: $bgc;
    flex:1;
    width:100%;
  }
}
</style>


