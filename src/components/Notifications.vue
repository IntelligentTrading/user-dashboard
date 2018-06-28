<template>
  <el-container>
        <el-header>
            <Header />
        </el-header>
        <el-main style="padding:10px">
          <div class="option-label">General</div>
          <el-row :gutter="24" class="indicator" v-for="generalAlert in this.generalAlerts" v-bind:key="generalAlert.label">
            <el-col class="setting-label" :span="20">{{generalAlert.label}}</el-col>
            <el-col :span="4"><el-switch v-model="generalAlert.enabled" @change="save" ></el-switch></el-col>
        </el-row>
        <hr style="opacity:0.2;" />
      <div class="option-label">Indicators</div>
      <el-row :gutter="24" :class="[{disabledIndicator: !indicator.available},'indicator']" v-for="indicator in this.indicators" v-bind:key="indicator.name">
            <el-col class="setting-label" :span="20">{{indicator.label}} <el-button type="text" class="proTag" size=mini v-show="!indicator.available" v-on:click="goToUpgrade">Upgrade</el-button></el-col>
            <el-col :span="4"><el-switch :disabled="!indicator.available" v-model="indicator.enabled" @change="save"></el-switch></el-col>
        </el-row>
        <hr style="opacity:0.2;" />
    </el-main>
</el-container>
</template>
<script>
import Header from "./Header.vue";
export default {
  name: "Notifications",
  data() {
    return {
      generalAlerts: [
        {
          label: "Mute",
          name: "is_muted",
          enabled: this.$store.state.settings.is_muted
        },
        {
          label: "Crowd Sentiment",
          name: "is_crowd_enabled",
          enabled: this.$store.state.settings.is_crowd_enabled
        }
      ],
      indicators: this.$store.state.settings.indicators
    };
  },
  methods: {
    save: function() {
      var settings = {};
      this.generalAlerts.forEach(alert => {
        settings[alert.name] = alert.enabled;
      });

      settings.indicators = this.indicators;
      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: settings
      });
    },
    goToUpgrade() {
      this.$router.push("/Subscription");
    }
  },
  components: {
    Header
  }
};
</script>
<style>
.proTag {
  margin-left: 10px;
  border-radius: 20px;
}

.indicator {
  margin-top: 10px;
}

.setting-label {
  text-align: left;
  display: block;
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

.disabledIndicator {
  color: lightgrey;
}
</style>
