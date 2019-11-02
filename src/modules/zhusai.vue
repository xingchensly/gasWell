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
          <div v-for="(value,index) in zs_realData" :key="index" class="text item">
            {{index + " : "+value }}
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>生产制度</span>
          </div>
          <div v-for="(value,index) in zs_zhidu" :key="index" class="text item">
            {{index + " : "+value }}
          </div>
        </el-card>
        </div>
        <div class="zs_chart" ref="zs_chart"></div>
      </div>
    </div>
</template>
<script>
let echarts = require("echarts");
import { chartDataList} from "../js/config.js";
export default {
  data() {
    return {
      chartDataList:chartDataList,
      zs_realData:{
        "油管压力":"1.47Mpa",
        "套管压力":"1.47Mpa",
        "瞬时气量":"1.47Mpa",
        "瞬时液量":"1.47Mpa",
        "工作状态":"上升",
        "柱塞速度":"1.47m/s"
      },
      zs_zhidu:{
        "井站名称":"四厂 苏6_0_01C4",
        "井站归属":"长庆油田公司",
        "底座深度":"3567m",
        "生产方式":"柱塞排水",
        "开井时间":"05:58:45",
        "关井时间":"05:58:45"
      },
      zs_show:false,
      zs_chart:null
    };
  },
  async created() {

  },
  filters: {
  },
  methods: {},
  components: {},
  mounted() {
    this.zs_chart = echarts.init(this.$refs.zs_chart);
    this.zs_chart.setOption(this.chartDataList.zs_chart);
  }
};
</script>
<style lang="scss">
@import "../style/common.scss";
// $bgc:#122D4A;
.zhusai{
  width:100%;
  height:100%;
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
    background-color: $bgc;
      flex:1;
      width:100%;
    }
  }
}
</style>


