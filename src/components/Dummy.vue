<template>
  <el-container>
        <el-header>
            <el-row style="margin-top:10px">
                <el-col :span="2">
                  <div @click="goBack"><i class="el-icon-arrow-left el-icon-left" style="color:whitesmoke"></i>
                  </div>
                  </el-col>
                <el-col :span="20" >SETTINGS</el-col>
                <el-col :span="2">
                </el-col>
            </el-row>
            </el-header>
            
        <el-main>
        </el-main>
  </el-container>
</template>
<script>
export default {
  methods:{
    goBack: function(){
      this.$router.go(-1)
    }
  }
}
</script>

