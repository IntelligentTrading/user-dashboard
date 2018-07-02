<template>
    
            <el-row style="margin-top:10px">
                <el-col :span="4">
                  <el-button style="
    background: transparent;
    border: transparent;
    color: whitesmoke;
    padding: 0px;
    font-size: 11px
" class="back-button" @click="goBack" icon="el-icon-arrow-left el-icon-left">BACK</el-button>
                  </el-col>
                <el-col :span="16">{{title}}</el-col>
                <el-col :span="4">
                </el-col>
            </el-row>
</template>
<script>
export default {
  props:['title'],
  methods: {
    goBack: function() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.back-button{
    background: transparent;
    border: transparent;
    color: whitesmoke;
    padding: 0px;
    font-size: 11px
}
</style>


