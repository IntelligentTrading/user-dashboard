<template>
<div @click="GoTo" class="settings-button">
    <el-row>
                <el-col :span="2"><i v-bind:class="this.$props.icon"></i></el-col>
                <el-col :span="16">
                    <el-row class="subtitle">{{this.$props.subtitle}}</el-row>
                    <el-row><div class="option-value">{{this.$props.currentOptionValue}}</div></el-row>
                </el-col>
                <el-col :span="5">
                    <div v-show="this.isNavigable" :class="[{upgradeBtn: this.$props.extraClass},'action-title']">{{this.$props.actionTitle}}</div>
                </el-col>
                <el-col :span="1"><div v-show="this.isNavigable && !this.$props.hideNavArrow" style="text-align:right;">
                    <i class="fas fa-chevron-right arrow-icon"></i>
                    </div>
                </el-col>
            </el-row>
            <el-row> 
                <el-col :span="2" style="color:transparent">.</el-col>
                <el-col :span="22"><hr class="settings-separator"/></el-col>
            </el-row>
</div>
</template>

<script>
export default {
  name: "SettingsButton",
  props: [
    "subtitle",
    "currentOptionValue",
    "icon",
    "to",
    "actionTitle",
    "hideNavArrow",
    "extraClass"
  ],
  data() {
    return {
      isNavigable: this.to != undefined,
    };
  },
  methods: {
    GoTo: function() {
      if (this.$props.to) this.$router.push(this.$props.to);
    },
  }
};
</script>
<style>
.option-value {
  text-align: left;
  font-size: small;
  font-weight: 400;
  color: black;
}

.icons {
  color: #2a4d96;
  vertical-align: baseline;
  margin-right: 10px;
}

.arrow-icon {
  vertical-align: text-bottom;
  color: black;
}

.action-title {
  margin-top: 2px;
  text-align: right;
}
</style>

