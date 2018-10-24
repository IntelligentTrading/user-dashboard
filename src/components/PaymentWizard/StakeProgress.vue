<template>
<div>
<el-row>
    <el-col :span=12 style='text-align:left'>{{currentNumber}} ITT</el-col>
    <el-col :span=12 style='text-align:right'>{{targetNumber}} ITT</el-col>
</el-row>
<el-row>
    <div class='progressBackground'>
        <div :class="[{'progressCompleted':this.progress >= 100}, 'progressForeground']" v-bind:style="{width:Math.min(this.progress,100)+'%'}"></div>
    </div>
</el-row>
<el-row class='needed-subtitle'>
  <el-col :span=4 style='text-align:left'>current</el-col>
  <el-col :span=16>{{neededLabel}}</el-col>
  <el-col :span=4 style='text-align:right'>target</el-col>
</el-row>
</div>
</template>
<script>
export default {
  name: "StakeProgress",
  props: ["progress", "currentNumber", "targetNumber", "neededNumber"],
  data() {
    return {};
  },
  computed: {
    neededLabel: function() {
      return `${Math.abs(this.neededNumber.toFixed(2))} ${
        this.neededNumber >= 0 ? "ITT tokens needed" : "ITT tokens spendable"
      }`;
    }
  }
};
</script>
<style>
.progressBackground {
  background: #b0c4de94;
  width: 100%;
  height: 10px;
  border-radius: 25px;
}

.progressForeground {
  background: cornflowerblue;
  height: 100%;
  border-radius: 25px;
}

.progressCompleted {
  background: #44ce44 !important;
}

.needed-subtitle {
  font-size: 10px;
  font-weight: 200;
  padding: 5px;
}
</style>

