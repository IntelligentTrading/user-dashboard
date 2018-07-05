<template>
    <el-container>
      <el-header>
        <Header title="Settings" navigation=false />
      </el-header>
            <!--<div style="width:100%">
              <el-progress v-show="this.inProgress" :text-inside="true" :stroke-width="8" :percentage="this.percentage"></el-progress>
            </div>-->
        <el-main>
            <div class="settings-label">User Details</div>
            <settings-button class="nocursor" subtitle="Telegram Id" v-bind:currentOptionValue=this.telegram_chat_id icon="fab fa-telegram-plane icons"></settings-button>
            <settings-button actionTitle="Upgrade" subtitle="Subscription" v-bind:currentOptionValue="subscription" to="/Subscription" icon="fas fa-dollar-sign icons"></settings-button>
            <div class="settings-label">Notifications Settings</div>
            <settings-button actionTitle="Edit" subtitle="Active alerts and indicators" v-bind:currentOptionValue="activeIndicators" icon="far fa-bell icons" to="/Notifications"></settings-button>
            <div class="settings-label">Signals Settings</div>
            <settings-button actionTitle="Configure" subtitle="Quick Configuration" v-bind:currentOptionValue="'Wizard, presets and reset'" to="/Wizard" icon="fas fa-sliders-h icons"></settings-button>
            <settings-button actionTitle="Edit" subtitle="Coin watchlist" v-bind:currentOptionValue="this.selectedTransactionCurrencies.length+' coins followed'" icon="fas fa-eye icons" to="/Coins"></settings-button>
            <el-checkbox-group v-model=settings.counter_currencies size="default">
                <el-checkbox-button v-for="cc in allCounterCurrencies" v-show="cc.enabled" :label="cc.index" :key="cc.index" @change="save">{{'alt / '+cc.symbol}}</el-checkbox-button>
            </el-checkbox-group>
            <div class="settings-label">Trading Settings</div>
            <el-radio-group v-model="settings.horizon" size="default" @change="save">
                    <el-radio-button label="short">High Risk</el-radio-button>
                    <el-radio-button label="medium">Medium Risk</el-radio-button>
                    <el-radio-button label="long">Low Risk</el-radio-button>
            </el-radio-group>
        </el-main>
    </el-container>
</template>
<script>
import logo from "../assets/itf.jpg";
import Header from "./Header.vue";
import SettingsButton from "./SettingsButton";
import moment from "moment";
import db from "../db";
import util from "../util";

var loading = null;

export default {
  name: "Main",
  props: ["token", "telegram_chat_id"],
  data() {
    return {
      logo: logo,
      showLoading: false,
      showSuccess: false,
      showError: false,
      dataLoaded: false,
      all_transaction_currencies: [],
      settings: { transaction_currencies: [] },
      allCounterCurrencies: db.COUNTER_CURRENCIES,
      inProgress: false,
      percentage: 0
    };
  },
  async created() {
    if (!this.$store.state.telegram_chat_id)
      this.$store.commit("telegramId", parseInt(this.$props.telegram_chat_id));

    var userSettings = this.$store.state.settings;
    this.all_transaction_currencies = this.$store.state.all_transaction_currencies;

    if (!userSettings) {
      var fulfillments = await Promise.all([
        db.loadTransactionCurrencies(),
        db.loadUserSettings(this.$props.telegram_chat_id),
        db.loadIndicators(),
        db.loadIttPrice()
      ]);
      this.all_transaction_currencies = fulfillments[0];
      var user = fulfillments[1];
      userSettings = user.settings;

      this.$store.commit("indicators", fulfillments[2]);
      this.$store.commit("itt_usd_rate", fulfillments[3]);
    }

    if (util.subscription(userSettings).plan == "FREE") {

      console.log('FREE plan is not allowed')
      this.dataLoaded = true;
      this.$emit("loaded", true);
      this.$router.push('/error')

    } else {
      this.settings = {};

      db.READABLE_SETTINGS.forEach(readableSetting => {
        var propertyName = readableSetting.setting;
        this.settings[propertyName] = userSettings[propertyName];
      });

      this.$store.commit("settings", this.settings);
      this.$store.commit(
        "all_transaction_currencies",
        this.all_transaction_currencies
      );

      this.dataLoaded = true;
      this.$emit("loaded", true);
    }
  },
  methods: {
    save: function() {
      this.inProgress = true;
      this.$store.dispatch("save", {
        chat_id: this.$props.telegram_chat_id,
        settings: this.settings
      });
      this.$forceUpdate();
      this.inProgress = 100;
      this.inProgress = false;
    }
  },
  components: {
    SettingsButton,
    Header
  },
  computed: {
    subscription: function() {
      return util.subscription(this.$store.state.settings).plan;
    },
    activeIndicators: function() {
      if (this.$store.state.settings) {
        return this.$store.state.settings.indicators
          .filter(indicator => indicator.enabled)
          .map(indicator => {
            return indicator.label;
          })
          .slice(0, 3)
          .join(", ");
      }
      return "Loading...";
    },
    selectedTransactionCurrencies: function() {
      if (
        this.$store.state.settings &&
        this.$store.state.settings.transaction_currencies
      )
        return this.$store.state.settings.transaction_currencies;

      return "Loading...";
    }
  }
};

//-------------
</script>
<style>
.el-header {
  padding: 0px;
}

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
  font-size: small;
  color: cornflowerblue;
  font-weight: bold;
}

.settings-separator {
  opacity: 0.1;
}

.subtitle {
  text-align: left;
  color: cornflowerblue;
  font-size: small;
}
</style>
