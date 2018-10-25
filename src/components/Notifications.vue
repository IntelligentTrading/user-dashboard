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
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Notifications",
  data() {
    return {
      subscription: "Upgrade to unlock custom selection.",
      showUpgrade:
        ["free", "beta"].indexOf(this.$store.getters.highestSubscriptionLevel) > -1
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
      return this.$store.getters.signalLabel(indicator)
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
    ...mapGetters([
      "settings",
      "subscriptionTemplates",
      "indicators",
      "exchanges",
      "highestSubscriptionLevel"
    ]),
    subscriptionPlan: function() {
      return this.highestSubscriptionLevel;
    },
    subscriptionTemplate: function() {
      var planFilter =
        this.subscriptionPlan == "ITT" ? "Pro" : this.subscriptionPlan;
      return this.subscriptionTemplates.filter(
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
