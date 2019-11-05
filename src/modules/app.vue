<template>
  <div class="total">
    <gas :curWellId='curWellId' :wellSelectOptions='wellSelectOptions'></gas>
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
  components: {gas},
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


