<template>
<el-container>
    <el-main>
        <el-card>
            <div slot="header" class="card-header">Notifications</div>
        <el-row :gutter="20">
            <el-col class="setting-label" :xs="18" :md="8">Alerts</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.alerts_on"></el-switch></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="setting-label"  :xs="18" :md="8">Crowd Sentiment</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.is_crowd_enabled"></el-switch></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="setting-label"  :xs="18" :md="8">RSI</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.rsi"></el-switch></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col class="setting-label"  :xs="18" :md="8">Ichimoku</el-col>
            <el-col :xs="2" :md="2"><el-switch v-model="userSettings.ichimoku"></el-switch></el-col>
        </el-row>
        </el-card>
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
        is_crowd_enabled: this.$props.settings.is_crowd_enabled,
      }
    };
  },
  methods: {
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
</style>
