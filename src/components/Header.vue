<template>
            <el-row class="headerino">
                <el-col :span="4">
                  <i v-show="this.$props.navigation === 'false'"><div style="color:transparent">.</div></i>
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

</style>


