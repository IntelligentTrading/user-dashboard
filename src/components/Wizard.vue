<template>
  <el-container>
        <el-header>
            <Header title="Wizard" />
            </el-header>
            
        <el-main>
        </el-main>
  </el-container>
</template>
<script>
import Header from "./Header";

export default {
  name: "Wizard",
  methods: {
    goBack: function() {
      this.$router.go(-1);
    }
  },
  components: { Header }
};
</script>

