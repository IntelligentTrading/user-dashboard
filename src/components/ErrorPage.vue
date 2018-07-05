<template>
<div>
  <el-row style="margin-top:20px">
  <label>Upgrade to get all the signals and settings!</label>
  </el-row>
  <el-row class="pro">
  <label >PRO</label>
  </el-row>
  <h1 class="price">$20/mo</h1>
  <h4>in ITT tokens</h4>
</div>
</template>

<script>
export default {
  name: "ErrorPage",
  data() {
    return {
      msg: "This is an error Page"
    };
  }
};
</script>


<style>
.pro{
  margin-top: 100px
}

.price{
  font-family: 'Helvetica Neue';
  font-size: 52px;
  font-weight: 100
}
</style>
