<template>
<el-container>
    <el-header class="main-header">
      <img width="32px" height="32px" :src="logo"/><div style="margin:5px">{{this.$props.id}}</div>
      </el-header>
    <el-main>
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
              <span slot="label"><i class="fas fa-signature"></i> Signals</span>
              <Signals v-if="dataLoaded" :settings="settings" v-on:settingChanged="store" :transactionCurrencies="transaction_currencies" />
            </el-tab-pane>
            <el-tab-pane name="second">
              <span slot="label"><i class="el-icon-bell"></i> Notifications</span>
              <Notifications v-if="dataLoaded" :settings="settings" v-on:settingChanged="store" />
            </el-tab-pane>
            <el-tab-pane name="third">
              <span slot="label"><i class="fas fa-wallet"></i> Subscription</span>
              <Subscription v-if="dataLoaded" :settings="settings" />
            </el-tab-pane>
        </el-tabs>
    </el-main>
    <el-footer>
      <el-button round class="save-button" v-bind:type="!showError && !showSuccess ? 'primary' : (showError ?'danger' : 'success')"  @click="save" :disabled="showLoading">
            Save
            <i v-show="showLoading" class="el-icon-loading" />
            <i v-show="showError" class="el-icon-error" />
        <i v-show="showSuccess" class="el-icon-circle-check-outline" /></el-button>
    </el-footer>
</el-container>
</template>
<script>
import Signals from "./Signals";
import Notifications from "./Notifications";
import Subscription from "./Subscription";
import logo from "../assets/itf.jpg";

const serviceEndpoint = process.env.ITT_NODE_SERVICES;
const apiKey = process.env.NODE_SVC_API_KEY;
var loading = null;

const allowedSettings = [
  "is_muted",
  "is_crowd_enabled",
  "transaction_currencies",
  "counter_currencies",
  "horizon",
  "ittWalletReceiverAddress"
];

export default {
  name: "Settings",
  props: ["id"],
  data() {
    return {
      logo: logo,
      showLoading: false,
      showSuccess: false,
      showError: false,
      dataLoaded: false,
      userID: this.id,
      activeName: "first",
      transaction_currencies: [],
      settings: {}
    };
  },
  methods: {
    store: function(setting, value) {
      this.settings[setting] = value;
      console.log(this.settings[setting]);
    },
    save: function() {
      this.showLoading = true;
      saveToDatabase(this.id, this.settings)
        .then(response => {
          this.showLoading = false;
          if (response.ok) {
            response.json().then(data => {
              this.showSuccess = true;
            });
          } else this.showError = true;
        })
        .then(() => {
          setTimeout(() => {
            this.showSuccess = false;
            this.showError = false;
          }, 1000);
        });
    }
  },
  components: {
    Signals,
    Notifications,
    Subscription
  },
  async created() {
    this.transaction_currencies = await loadTransactionCurrencies();
    var user = await loadUserSettings(this.$props.id);

    this.settings = Object.keys(user.settings).reduce(function(obj, k) {
      if (allowedSettings.indexOf(k) > -1) obj[k] = user.settings[k];
      return obj;
    }, {});
    this.dataLoaded = true;
    this.$emit("loaded", true);
  }
};

function saveToDatabase(chat_id, settings) {
  return fetch(`${serviceEndpoint}/users/${chat_id}`, {
    method: "PUT",
    headers: new Headers({
      "NSVC-API-KEY": apiKey,
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "Access-Control-Request-Method": "*"
    }),
    mode: "cors",
    body: JSON.stringify(settings)
  });
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
  padding: 10px;
  height: 40px !important;
  font-size: large;
  font-weight: 600;
  display: inline-flex;
}

.el-tabs__header {
  margin: 0 10px 15px;
}

.save-button {
  width: 200px;
  margin: 10px;
}

</style>