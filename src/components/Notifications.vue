<template>
<el-container style="margin:10px">
    <el-main>
      <div class="option-label">General</div>
        <el-row :gutter="24">
            <el-col class="setting-label" :xs="20" :md="8">Alerts</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.alerts_on" @change="onSettingsChanged('is_muted',!userSettings.alerts_on)"></el-switch></el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col class="setting-label"  :xs="20" :md="8">Crowd Sentiment</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.is_crowd_enabled" @change="onSettingsChanged('is_crowd_enabled',userSettings.is_crowd_enabled)"></el-switch></el-col>
        </el-row>
        <hr style="opacity:0.2;" />
        <div class="option-label">Technical Analysis</div>
        <el-row :gutter="24">
            <el-col class="setting-label"  :xs="20" :md="8">RSI</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.rsi"></el-switch></el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col class="setting-label"  :xs="20" :md="8">Ichimoku</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.ichimoku"></el-switch></el-col>
        </el-row>
    </el-main>
</el-container>
</template>
<script>
export default {
  name: "Notifications",
  props: ["settings"],
  data() {
    return {
      userSettings: {
        rsi: false,
        ichimoku: false,
        alerts_on: !this.$props.settings.is_muted,
        is_crowd_enabled: this.$props.settings.is_crowd_enabled
      }
    };
  },
  methods: {
    onSettingsChanged: function(property, state) {
      var propertyValue = state;
      console.log(`Sending ${property}:${propertyValue}`);
      this.$emit("settingChanged", property, propertyValue);
    }
  }
};
</script>
<style>
.el-main {
  padding: 5px;
}

.el-card {
  margin: 5px;
}

.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.el-card__header {
  padding: 5px;
}

.setting-label {
  display: flex;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.el-footer {
  height: 60px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  margin: 0px;
  padding: 0px;
  left: 0px;
}

.option-label {
  font-size: small;
  font-weight: 600;
  font-family: unset;
  width: 100%;
  text-align: left;
  margin-bottom: 15px;
  color: steelblue;
}
</style>
