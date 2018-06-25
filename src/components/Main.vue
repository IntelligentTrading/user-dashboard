<template>
    <el-container>
        <el-header>
            <el-row style="margin-top:10px">
                SETTINGS
            </el-row>
            </el-header>
        <el-main>
            <div class="settings-label">User Details</div>
            <settings-button subtitle="Telegram Id" v-bind:currentOptionValue=this.id icon="fab fa-telegram-plane icons"></settings-button>
            <settings-button actionTitle="Upgrade" subtitle="Subscription Plan" v-bind:currentOptionValue=this.settings.subscription to="/Subscription" icon="fas fa-dollar-sign icons"></settings-button>
            <settings-button actionTitle="Configure" subtitle="Quick Configuration" v-bind:currentOptionValue="'Wizard, presets and reset'" to="/Wizard" icon="fas fa-sliders-h icons"></settings-button>
            <div class="settings-label">Signals Settings</div>
            <settings-button actionTitle="Edit" subtitle="Coin watchlist" v-bind:currentOptionValue="this.settings.transaction_currencies.length+' coins followed'" icon="fas fa-eye icons" to="/Coins"></settings-button>
            <el-checkbox-group v-model=settings.counter_currencies size="default">
                <el-checkbox-button v-for="cc in allCounterCurrencies" :disabled="!cc.enabled" :label="cc.index" :key="cc.index" @change="setModified">{{'alt / '+cc.symbol}}</el-checkbox-button>
            </el-checkbox-group>
            <div class="settings-label">Trading Settings</div>
            <el-radio-group v-model="settings.horizon" size="default">
                    <el-radio-button label="short">High Risk</el-radio-button>
                    <el-radio-button label="medium">Medium Risk</el-radio-button>
                    <el-radio-button label="high">Low Risk</el-radio-button>
                </el-radio-group>
            <div class="settings-label">Notifications Settings</div>
            <settings-button actionTitle="Edit" subtitle="Active alerts and indicators" v-bind:currentOptionValue="'RSI, Ichimoku'" icon="far fa-bell icons" to="/Alerts"></settings-button>
        </el-main>
    </el-container>
</template>
<script>
import logo from "../assets/itf.jpg";
import SettingsButton from "./SettingsButton";
import moment from "moment";

const serviceEndpoint = process.env.ITT_NODE_SERVICES;
const apiKey = process.env.NODE_SVC_API_KEY;
var loading = null;

const counter_currencies = [
  {
    symbol: "BTC",
    index: 0,
    enabled: true
  },
  {
    symbol: "ETH",
    index: 1,
    enabled: false
  },
  {
    symbol: "USDT",
    index: 2,
    enabled: true
  }
];

const allowedSettings = [
  "is_muted",
  "is_crowd_enabled",
  "transaction_currencies",
  "counter_currencies",
  "horizon",
  "ittWalletReceiverAddress"
];

export default {
  name: "Main",
  props: ["id"],
  data() {
    return {
      logo: logo,
      showLoading: false,
      showSuccess: false,
      showError: false,
      dataLoaded: false,
      userID: this.id,
      all_transaction_currencies: [],
      settings: { subscription: "loading...", transaction_currencies: [] },
      allCounterCurrencies: counter_currencies
    };
  },
  async created() {
    var userSettings = this.$store.state.settings;
    this.all_transaction_currencies = this.$store.state.all_transaction_currencies;

    if (!userSettings) {
      var fulfillments = await Promise.all([loadTransactionCurrencies(),loadUserSettings(this.$props.id)])
      this.all_transaction_currencies = fulfillments[0]
      var user = fulfillments[1]
      userSettings = user.settings;
    }
    this.settings = Object.keys(userSettings).reduce(function(obj, k) {
      if (allowedSettings.indexOf(k) > -1) obj[k] = userSettings[k];
      return obj;
    }, {});

    if (this.$store.state.settings)
      this.settings.subscription = this.$store.state.settings.subscription;
    else this.settings.subscription = getPlan(userSettings.subscriptions);

    this.dataLoaded = true;
    this.$store.commit("telegramId", this.id);
    this.$store.commit("settings", this.settings);
    this.$store.commit("all_transaction_currencies", this.all_transaction_currencies);
    this.$emit("loaded", true);
  },
  methods: {
    setModified: function() {
      this.$store.commit("setModified", true);
    },
    riskToIndex: function() {
      var horizons = ["short", "medium", "long"];
      return indexOf(this.settings.risk);
      var risks = ["High risk", "Medium risk", "Low risk"];
    }
  },
  components: {
    SettingsButton
  }
};

//-------------
function getPlan(subscriptions) {
  var paidDaysLeft = -1 * moment().diff(subscriptions.paid, "days");
  var betaDaysLeft = -1 * moment().diff(subscriptions.beta, "days");
  return paidDaysLeft > 0 ? "Starter" : betaDaysLeft > 0 ? "FREE+" : "FREE";
}

function loadTransactionCurrencies() {
  console.log(`Fetching ${serviceEndpoint}/tickers/transaction_currencies`);
  return fetch(`${serviceEndpoint}/tickers/transaction_currencies`, {
    headers: new Headers({
      "NSVC-API-KEY": apiKey,
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "Access-Control-Request-Method": "*"
    }),
    mode: "cors"
  })
    .then(result => {
      return result.json().then(data => {
        return data;
      });
    })
    .catch(err => console.log(err));
}

function loadUserSettings(chat_id) {
  return fetch(`${serviceEndpoint}/users/${chat_id}`, {
    headers: new Headers({
      "NSVC-API-KEY": apiKey,
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "Access-Control-Request-Method": "*"
    }),
    mode: "cors"
  }).then(result => {
    return result.json();
  });
}
</script>
<style>
.el-header {
  height: 40px !important;
  background: #36d1dc; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  font-weight: 600;
  color: whitesmoke;
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
