<template>
  <div class="total">
    <jianxie v-if="curWellId==10010"></jianxie>
    <zhusai v-else-if="curWellId==10086"></zhusai>
    <gas v-else :curWellId='curWellId'></gas>
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
  </div>
</template>
<script>
import { getWellInfo } from "../js/api";
import { urlList } from "../config/urls.js";
import gas from "./gas.vue";
import zhusai from "./zhusai.vue";
import jianxie from "./jianxie.vue";

export default {
  data() {
    return {
      wellSelectOptions: [],
      curWellValue: "",
      curWellId: null
    };
  },
  async created() {
    const wellInfo = await getWellInfo();
    wellInfo.shift(); //剔除井场
    let objTemple={
      description: "",
      device_id: 10086,
      device_name: "柱塞"
    }
    let objTemple2={
      description: "",
      device_id: 10010,
      device_name: "间歇"
    }
    wellInfo.push(objTemple);// 添加柱塞
    wellInfo.push(objTemple2);// 添加间歇

    this.$set(this, "wellSelectOptions", wellInfo);
    this.$set(this, "curWellValue", this.wellSelectOptions[0].device_name);
    this.$set(this, "curWellId", this.wellSelectOptions[0].device_id);
  },
  filters: {
  },
  methods: {
    wellSelect(value) {
      this.$set(this, "curWellId", value);
    }
  },
  components: {gas,zhusai,jianxie},
  mounted() {
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
.userForm{
  width:80%;
}
.total{
  width:100%;
  height:100%;
}
.wellSelect {
  position: absolute;
  top: 10px;
  left: 50px;
}
</style>


