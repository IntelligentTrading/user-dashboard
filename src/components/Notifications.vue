<template>
  <el-container>
        <el-header>
            <Header title="Alerts & Indicators" />
        </el-header>
        <el-main style="padding:10px">
          <upgrade-settings-button v-show=this.showUpgrade extraClass=true actionTitle="Upgrade" v-bind:subtitle=subscription to="/Subscription" icon="fas fa-tag icons"></upgrade-settings-button>
          
        
        <div class="option-label">Exchanges</div>
      <el-row style="margin:2px" v-for="exchange in exchanges" v-bind:key="exchange.label">
            <el-col class="setting-label" :span="20">{{exchange.label}}</el-col>
            <el-col :span="4" style="text-align:right"><el-switch v-show="exchange.canSee" :disabled='!exchange.canEdit' v-model="exchange.value" @change="save(exchange,'e')"></el-switch></el-col>
      </el-row>
        <hr style="opacity:0.2;" />
        <div class="option-label">Indicators</div>
        <el-row style="margin:2px" v-for="indicator in indicators" v-bind:key="indicator.name">
            <el-col class="setting-label" :span="20">{{getSignalLabel(indicator)}}
            <i class="fas fa-info-circle url-icon" style="font-size: 12px; color:#409dfb" @click='getSignalUserGuideUrl(indicator.name)'></i></el-col>
            <el-col :span="4" style="text-align:right"><el-switch v-show="indicator.canSee" :disabled='!indicator.canEdit'  v-model="indicator.value" @change="save(indicator,'i')"></el-switch></el-col>
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

function buildIndicatorAvailability(settings, indicator, signalsTemplates) {
  var highestSubscriptionLevel = util.getHighestSubscriptionLevel(settings);
  highestSubscriptionLevel =
    highestSubscriptionLevel == "ITT" ? "centomila" : highestSubscriptionLevel;
  var tooLowToEdit =
    highestSubscriptionLevel == "free" || highestSubscriptionLevel == "beta";

  var signal = signalsTemplates.filter(s => s.label == indicator.name)[0];
  var availableForPlan =
    signal.deliverTo.indexOf(highestSubscriptionLevel.toLowerCase()) >= 0;

  indicator.canSee = true;
  indicator.canEdit = !tooLowToEdit;
  indicator.value = tooLowToEdit ? availableForPlan : indicator.enabled;

  return indicator;
}

export default {
  name: "Notifications",
  data() {
    return {
      settings: this.$store.state.settings,
      disabledSwitch: false,
      enabledSwitch: true,
      subscriptionTemplates: this.$store.state.subscriptionTemplates,
      subscription: "Upgrade to unlock custom selection.",
      showUpgrade:
        ["free", "beta"].indexOf(
          util.getHighestSubscriptionLevel(this.$store.state.settings)
        ) > -1
    };
  },
  methods: {
    save: function(setting, type) {
      if (type == "i")
        this.settings.indicators.find(
          ind => ind.name == setting.name
        ).enabled = !setting.enabled;
      if (type == "e")
        this.settings.exchanges.find(
          exc => exc.label == setting.label
        ).enabled = !setting.enabled;

      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: this.settings
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
    }
  },
  components: {
    Header,
    UpgradeSettingsButton
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
    },
    exchanges: function() {
      return this.$store.state.settings.exchanges.map(ex =>
        buildExchangeAvailability(
          this.$store.state.settings,
          ex,
          this.subscriptionTemplates
        )
      );
    },
    indicators: function() {
      return this.$store.state.settings.indicators.map(ind =>
        buildIndicatorAvailability(
          this.$store.state.settings,
          ind,
          this.$store.state.signals
        )
      );
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
