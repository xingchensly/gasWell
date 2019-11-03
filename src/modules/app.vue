<template>
  <div class="total">
    <jianxie v-if="curWellId==10010"></jianxie>
    <zhusai v-else-if="curWellId==10086"></zhusai>
    <gas v-else-if="curWellId" :curWellId='curWellId'></gas>
    <div class="wellSelect">
      <el-select v-model="curWellValue" placeholder="请选择" @change="wellSelect">
        <el-option
          v-for="item in wellSelectOptions"
          :key="item.wellID"
          :label="item.wellName"
          :value="item.wellID"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import {userLoginIn,userGetWellList} from "../js/api";
import { urlList } from "../config/urls.js";
import gas from "./gas.vue";
import zhusai from "./zhusai.vue";
import jianxie from "./jianxie.vue";

export default {
  data() {
    return {
      wellSelectOptions: [],
      curWellValue: "",
      curWellId: null,
      timer:null,
      tokenInfo:{}
    };
  },
  async created() {
    this.tokenInfo=await this.GetToken();  
    localStorage.setItem("token",this.tokenInfo.info);

    const wellInfo = await userGetWellList();
    let objTemple={
      wellID: 10086,
      wellName: "柱塞"
    }
    let objTemple2={
      wellID: 10010,
      wellName: "间歇"
    }
    wellInfo.push(objTemple);// 添加柱塞
    wellInfo.push(objTemple2);// 添加间歇

    this.$set(this, "wellSelectOptions", wellInfo);
    this.$set(this, "curWellValue", this.wellSelectOptions[0].wellName);
    this.$set(this, "curWellId", this.wellSelectOptions[0].wellID);
  },
  filters: {
  },
  methods: {
    async GetToken(){
      let tokenInfo = await userLoginIn();
      if(!tokenInfo.result){
        clearTimeout(this.timer);
        this.timer=setTimeout(() => {
          this.GetToken()
        }, 500);
      }
      return tokenInfo;
    },
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


