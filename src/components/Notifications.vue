<template>
  <el-container>
        <el-header>
            <Header title="Alerts & Indicators" />
        </el-header>
        <el-main style="padding:10px">
          <upgrade-settings-button extraClass=true actionTitle="Upgrade" v-bind:subtitle=subscription to="/Subscription" icon="fas fa-tag icons"></upgrade-settings-button>
          
        
        <div class="option-label">Exchanges</div>
      <el-row style="margin:2px" v-for="exchange in this.exchanges" v-bind:key="exchange.label">
            <el-col class="setting-label" :span="20">{{exchange.label}}</el-col>
            <el-col :span="4" style="text-align:right"><el-switch v-show="exchange.canSee" :disabled='!exchange.canEdit' v-model="exchange.value" @change="save"></el-switch></el-col>
      </el-row>
        <hr style="opacity:0.2;" />
        <div class="option-label">Indicators</div>
        <el-row :class="[{disabledIndicator: !isIndicatorSuitable(indicator)},'indicator']" v-for="indicator in this.indicators" v-bind:key="indicator.name">
            <el-col class="setting-label" :span="22">{{getSignalLabel(indicator)}}
            <i class="fas fa-info-circle url-icon" style="font-size: 12px; color:#409dfb" @click='getSignalUserGuideUrl(indicator.name)'></i></el-col>
            <el-col :span="2"><el-switch v-show="isIndicatorSuitable(indicator)"  v-model="indicator.enabled" @change="save"></el-switch></el-col>
            <!--<el-col :span="2"><el-switch v-show="!isIndicatorSuitable(indicator)" :disabled="true" v-model="disabledSwitch"></el-switch></el-col>-->
            
        </el-row>
    </el-main>
</el-container>
</template>
<script>
import Header from "./Header.vue";
import UpgradeSettingsButton from "./UpgradeSettingsButton";
import util from "../util";

function buildExchangeAvailability(settings, exchange, subscriptionTemplates) {
  var highestSubscriptionLevel = util.getHighestSubscriptionLevel(settings);
  highestSubscriptionLevel =
    highestSubscriptionLevel == "ITT" ? "centomila" : highestSubscriptionLevel;
  var tooLowToEdit =
    highestSubscriptionLevel == "free" || highestSubscriptionLevel == "beta";

  var subscriptionTemplate = subscriptionTemplates.filter(
    st => st.label == highestSubscriptionLevel
  )[0];
  var availableForPlan =
    !subscriptionTemplate.exchanges ||
    subscriptionTemplate.exchanges.includes(exchange.label.toLowerCase());

  exchange.canSee = true;
  exchange.canEdit = !tooLowToEdit;
  exchange.value = tooLowToEdit
    ? availableForPlan
    : settings.exchanges.filter(ex => exchange.label == ex.label)[0].enabled;

  return exchange;
}

export default {
  name: "Notifications",
  data() {
    return {
      generalAlerts: [],
      indicators: this.$store.state.settings.indicators,
      exchanges: this.$store.state.settings.exchanges,
      disabledSwitch: false,
      enabledSwitch: true,
      subscriptionTemplates: this.$store.state.subscriptionTemplates,
      subscription: "Upgrade to unlock custom selection."
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
    getSignalLabel(indicator) {
      return util.getSignalLabel(this.$store.state.signals, indicator);
    },
    getSignalUserGuideUrl(signalName) {
      var signals = this.$store.state.signals;
      var match = signals.find(s => s.label && s.label == signalName);
      window.open(match.guide_url, "_blank");
      //return match ? match.guide_url : '';
    },
    isIndicatorSuitable(indicator) {
      var signal = this.$store.state.signals.filter(
        s => s.label == indicator.name
      )[0];
      var delivers =
        this.subscriptionPlan == "ITT" ||
        signal.deliverTo.indexOf(this.subscriptionPlan.toLowerCase()) >= 0;

      return delivers;
    },
    isExchangeSuitable(exchange) {
      return (
        this.subscriptionPlan == "ITT" ||
        this.subscriptionTemplate.exchanges.length == 0 ||
        this.subscriptionTemplate.exchanges.indexOf(exchange) >= 0
      );
    }
  },
  components: {
    Header,
    UpgradeSettingsButton
  },
  created: function() {
    this.exchanges.map(ex =>
      buildExchangeAvailability(this.$store.state.settings, ex, this.subscriptionTemplates)
    );
  },
  computed: {
    subscriptionPlan: function() {
      return util.getHighestSubscriptionLevel(this.$store.state.settings);
    },
    subscriptionTemplate: function() {
      var planFilter =
        this.subscriptionPlan == "ITT" ? "Advanced" : this.subscriptionPlan;
      return this.$store.state.subscriptionTemplates.filter(
        st => st.label == planFilter.toLowerCase()
      )[0];
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
  margin-right: 10px;
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

.url-icon:hover {
  cursor: pointer;
}
</style>
