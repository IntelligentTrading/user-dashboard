<template>
            <el-row class="headerino">
                <el-col :span="4">
                  <i v-show="this.$props.navigation === 'false'" class="fas fa-home"></i>
                  <el-button v-show="this.$props.navigation == undefined || this.$props.navigation == 'true'" style="background: transparent; border: transparent;color: whitesmoke;padding: 0px;font-size: 11px" class="back-button" @click="goBack" icon="el-icon-arrow-left el-icon-left">BACK</el-button>
                  </el-col>
                <el-col :span="16">{{title}}</el-col>
                <el-col :span="4">
                </el-col>
            </el-row>
</template>
<script>
export default {
  props: ["title","navigation"],
  methods: {
    goBack: function() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>

.headerino {
  /*height: 40px !important;*/
  background: #36d1dc; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  
  font-weight: 600;
  color: whitesmoke;
  padding: 10px;
  width:100%
}
</style>


