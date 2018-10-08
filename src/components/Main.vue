<template>
    <el-container>
      <el-header>
        <Header title="Settings" navigation=false />
      </el-header>
            <!--<div style="width:100%">
              <el-progress v-show="this.inProgress" :text-inside="true" :stroke-width="8" :percentage="this.percentage"></el-progress>
            </div>-->
        <el-main>
            <div class="settings-label">Intelligent Trading Account</div>
            <settings-button class="nocursor" subtitle="Telegram ID" v-bind:currentOptionValue=this.telegram_chat_id icon="fab fa-telegram-plane icons"></settings-button>
            <settings-button :actionTitle=subscriptionTitle  :extraClass='this.showFreeSettings' :hideNavArrow='this.showFreeSettings' subtitle="Subscription" v-bind:currentOptionValue="subscription.plan" to="/Subscription" icon="fas fa-dollar-sign icons"></settings-button>
            <div class="settings-label">Signals</div>
            <settings-button actionTitle="Edit" subtitle="Alerts & Indicators" v-bind:currentOptionValue="activeIndicators" icon="fas fa-bell icons" to="/Notifications"></settings-button>
            <div class="switch-settings-button">
              <el-row>
                  <el-col :span="2"><i class="fas fa-users icons"></i></el-col>
                  <el-col :span="19">
                      <el-row class="subtitle">Crowd Sentiment</el-row>
                  </el-col>
                  <el-col :span="3"><div @click="saveCrowd">
                      <el-switch :value="this.isCrowdEnabled"></el-switch>
                      </div>
                  </el-col>
              </el-row>
              <el-row> 
                  <el-col :span="2" style="color:transparent">.</el-col>
                  <el-col :span="22"><hr class="settings-separator"/></el-col>
              </el-row>
            </div>
            <div class="settings-label">Tickers</div>
            <settings-button v-show="false" actionTitle="Configure" subtitle="Quick Configuration" v-bind:currentOptionValue="'Wizard, presets and reset'" to="/Wizard" icon="fas fa-sliders-h icons"></settings-button>
            <settings-button actionTitle="Edit" subtitle="Currencies Watchlist" v-bind:currentOptionValue="watchlistText" icon="fas fa-eye icons" to="/Coins"></settings-button>
            <div class="settings-label">Alert Validity</div>
            <el-radio-group v-model="userHorizon" size="default" :disabled=this.showFreeSettings>
                    <el-radio-button label="short">1 hour</el-radio-button >
                    <el-radio-button label="medium">4 hours</el-radio-button>
                    <el-radio-button label="long">24 hours</el-radio-button>
            </el-radio-group>
        </el-main>
    </el-container>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import logo from "../assets/itf.jpg";
import Header from "./Header.vue";
import SettingsButton from "./SettingsButton";
import moment from "moment";
import db from "../db";

var loading = null;

export default {
  name: "Main",
  props:['token'],
  data() {
    return {
      logo: logo,
      showLoading: false,
      showSuccess: false,
      showError: false,
      dataLoaded: false,
      allCounterCurrencies: db.COUNTER_CURRENCIES,
      inProgress: false,
      percentage: 0
    };
  },
  created() {
    console.log('Page created')
    this.dataLoaded = true;
    this.$emit("loaded", true);
  },
  beforeMount() {
    console.log("Checking user settings existance...");
    if (this.settings.subscriptions != undefined)
      console.log("Rendering user settings");
    else {
      console.log("No user settings found, reloading...");
      this.$router.push(`/Me/`+localStorage.token);
    }
  },
  methods: {
    ...mapMutations(["telegramChatId"]),
    saveCrowd: function() {
      this.settings.is_crowd_enabled = !this.isCrowdEnabled;
      this.$store.dispatch("save", {
        chat_id: this.telegram_chat_id,
        settings: this.settings
      });
    }
  },
  components: {
    SettingsButton,
    Header
  },
  computed: {
    ...mapGetters([
      "settings",
      "dbTransactionCurrencies",
      "subscription",
      "highestSubscriptionLevel",
      "signalLabel",
      "telegram_chat_id"
    ]),
    activeIndicators: function() {
      if (this.settings) {
        return this.settings.indicators
          .filter(indicator => indicator.enabled)
          .map(indicator => {
            return this.signalLabel(indicator);
          })
          .slice(0, 3)
          .join(", ");
      }
      return "Loading...";
    },
    crowdSentiment: function() {
      return "Crowd Sentiment";
    },
    selectedTransactionCurrencies: function() {
      if (this.settings && this.settings.transaction_currencies)
        return this.settings.transaction_currencies;

      return "Loading...";
    },
    watchlistText: function() {
      if (this.settings) {
        var followed = this.showFreeSettings
          ? { coins: 5, exchanges: 1 }
          : {
              coins: this.selectedTransactionCurrencies.length,
              exchanges: this.settings.exchanges.filter(ex => ex.enabled).length
            };

        return `Following ${followed.coins} tickers on ${followed.exchanges} ${
          followed.exchanges > 1 ? "exchanges" : "exchange"
        }`;
      }
      return "Loading...";
    },
    isCrowdEnabled: {
      get: function() {
        return this.settings.is_crowd_enabled;
      },
      set: function(crowdNewValue) {}
    },
    showFreeSettings: function() {
      return this.highestSubscriptionLevel == "free";
    },
    subscriptionTitle: function() {
      return this.showFreeSettings ? "Upgrade" : "View";
    },
    userHorizon: {
      get: function() {
        return this.showFreeSettings ? "short" : this.settings.horizon;
      },
      set: function(value) {
        this.settings.horizon = value;
        this.$store.dispatch("save", {
          chat_id: this.telegram_chat_id,
          settings: this.settings
        });
      }
    }
  }
};

//-------------
</script>
<style>
.el-progress {
  line-height: 0;
}

.el-progress-bar__innerText {
  color: transparent;
}

.settings-label {
  text-align: left;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 16px;
  color: #2a4d96;
  font-weight: bold;
}

.settings-separator {
  opacity: 0.1;
}

.subtitle {
  text-align: left;
  color: #2a4d96;
  font-size: 16px;
}

.upgradeBtn {
  padding: 5px;
  border-radius: 10px;
  background: #4ccfa6;
  width: 70px;
  text-align: center !important;
  color: whitesmoke;
  font-weight: 900;
  font-size: small;
  position: absolute;
  right: 0px;
}
</style>
