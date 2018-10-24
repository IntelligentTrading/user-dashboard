<template>
            <el-row class="headerino">
                <el-col :span="4">
                  <i v-show="this.$props.navigation === 'false'"><div style="color:transparent">.</div></i>
                  <el-button v-show="this.$props.navigation == undefined || this.$props.navigation == 'true'" style="background: transparent; border: transparent;color: whitesmoke;padding: 0px;font-size: 11px" class="back-button" @click="goBack" icon="el-icon-arrow-left el-icon-left">BACK</el-button>
                  <el-button v-show="this.$props.cancel == true" style="background: transparent; border: transparent;color: whitesmoke;padding: 0px;font-size: 11px" class="back-button" @click="resetNav()" icon="el-icon-close">CANCEL</el-button>
                  </el-col>
                <el-col :span="16">{{title}}</el-col>
                <el-col :span="4">
                </el-col>
            </el-row>
</template>
<script>
export default {
  props: ["title", "navigation", "cancel"],
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    resetNav: function() {
      this.$confirm(
        "Abort and go to the home page?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.$router.push("/Main/" + localStorage.token);
        })
        .catch(() => {});
    }
  }
};
</script>
<style>
.el-message-box{
  width: 300px !important
}
</style>


