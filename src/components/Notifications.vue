<template>
  <el-container>
        <el-header>
            <Header title="Alerts & Indicators" />
        </el-header>
        <el-main style="padding:10px">
          
        
        <div class="option-label">Exchanges</div>
      <el-row :gutter="24" :class="[{disabledIndicator: !isExchangeSuitable()},'indicator']" v-for="exchange in this.exchanges" v-bind:key="exchange.label">
            <el-col class="setting-label" :span="!isExchangeSuitable() ? 16 : 20">{{exchange.label}}</el-col>
            <el-col :span="4"><el-button type="text" class="proTag" size=mini v-show="!isExchangeSuitable()" v-on:click="goToUpgrade">Upgrade</el-button></el-col>
            <el-col :span="4"><el-switch v-show="isExchangeSuitable()" v-model="exchange.enabled" @change="save"></el-switch></el-col>
            <el-col :span="4"><el-switch v-show="!isExchangeSuitable() && exchange.label != 'Poloniex'" :disabled="true" v-model="disabledSwitch"></el-switch></el-col>
            <el-col :span="4"><el-switch v-show="!isExchangeSuitable() && exchange.label == 'Poloniex'" :disabled="true" v-model="enabledSwitch"></el-switch></el-col>
        </el-row>
        <hr style="opacity:0.2;" />
        <div class="option-label">Indicators</div>
      <el-row :gutter="24" :class="[{disabledIndicator: !isIndicatorSuitable(indicator)},'indicator']" v-for="indicator in this.indicators" v-bind:key="indicator.name">
            <el-col class="setting-label" :span="!isIndicatorSuitable(indicator) ? 16 : 20">{{indicator.label}}
            <i class="fas fa-info-circle url-icon" style="font-size: 12px; color:#409dfb" @click='getSignalUserGuideUrl(indicator.name)'></i></el-col>
            <el-col :span="4"><el-button type="text" class="proTag" size=mini v-show="!isIndicatorSuitable(indicator)" v-on:click="goToUpgrade">Upgrade</el-button></el-col>
            <el-col :span="4"><el-switch v-show="isIndicatorSuitable(indicator)"  v-model="indicator.enabled" @change="save"></el-switch></el-col>
            <el-col :span="4"><el-switch v-show="!isIndicatorSuitable(indicator)" :disabled="true" v-model="disabledSwitch"></el-switch></el-col>
            
        </el-row>
        <hr style="opacity:0.2;" />
        <div class="option-label">Other</div>
          <el-row :gutter="24" class="indicator" v-for="generalAlert in this.generalAlerts" v-bind:key="generalAlert.label">
            <el-col class="setting-label" :span="20">{{generalAlert.label}}</el-col>
            <el-col :span="4"><el-switch v-model="generalAlert.enabled" @change="save" ></el-switch></el-col>
        </el-row>
    </el-main>
</el-container>
</template>
<script>
import Header from "./Header.vue";
import util from "../util";

export default {
  name: "Notifications",
  data() {
    return {
      generalAlerts: [
        /*{
          label: "Mute",
          name: "is_muted",
          enabled: this.$store.state.settings.is_muted
        },*/
        {
          label: "Crowd Sentiment",
          name: "is_crowd_enabled",
          enabled: this.$store.state.settings.is_crowd_enabled
        }
      ],
      indicators: this.$store.state.settings.indicators,
      exchanges: this.$store.state.settings.exchanges,
      disabledSwitch: false,
      enabledSwitch: true
    };
  },
  methods: {
    save: function() {
      var settings = {};
      this.generalAlerts.forEach(alert => {
        settings[alert.name] = alert.enabled;
      });

      settings.indicators = this.indicators;

      settings.exchanges = this.exchanges;
      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: settings
      });
    },
    goToUpgrade() {
      this.$router.push("/Subscription");
    },
    getSignalLabel(signal) {
      var signals = this.$store.state.signals;
      var match = signals.find(s => s.name && s.name == signal.name);
      return match ? match.label : signal.name;
    },
    getSignalUserGuideUrl(signalName) {
      var signals = this.$store.state.signals;
      var match = signals.find(s => s.label && s.label == signalName);
      window.open(match.guide_url,'_blank')
      //return match ? match.guide_url : '';
    },
    isIndicatorSuitable(indicator){
      return this.subscriptionPlan.plan.includes('Starter') || indicator.available
    },
    isExchangeSuitable(exchange){
      return this.subscriptionPlan.plan.includes('Starter')
    }
  },
  components: {
    Header
  },
  computed: {
    subscriptionPlan: function() {
      var x = util.subscription(this.$store.state.settings);
      return x;
    }
  }
};
</script>
<style>
.proTag {
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
  font-size: 16px;
  font-weight: 600;
  font-family: unset;
  width: 100%;
  text-align: left;
  margin-bottom: 15px;
  color: #2a4d96;
}

.disabledIndicator {
  color: lightgrey;
}

.url-icon:hover{
  cursor: pointer;
}
</style>
