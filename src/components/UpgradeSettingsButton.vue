<template>
<div @click="GoTo" class="settings-button">
    <el-row style="margin-bottom:10px">
                <el-col :span="16">
                    <el-row class="upgrade-title">{{this.$props.subtitle}}</el-row>
                </el-col>
                <el-col :span="8">
                    <div v-show="this.isNavigable" :class="[{upgradeBtn: this.$props.extraClass},'']">{{this.$props.actionTitle}}</div>
                </el-col>
            </el-row>
</div>
</template>

<script>
export default {
  name: "SettingsButton",
  props: [
    "subtitle",
    "icon",
    "to",
    "actionTitle",
    "hideNavArrow",
    "extraClass"
  ],
  data() {
    return {
      isNavigable: this.to != undefined
    };
  },
  methods: {
    GoTo: function() {
      if (this.$props.to) this.$router.push(this.$props.to);
    }
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

.upgrade-title {
  font-size: small;
  margin-top: 5px;
  text-align: start;
}
</style>

