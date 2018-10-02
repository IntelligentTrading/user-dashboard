<template>
  <el-container>
        <el-header>
            <Header title="Currencies Watchlist" />
            </el-header>
        <el-main style="padding: 0px 20px">
          <el-row style="margin-top:10px" v-show=showUpgrade>
            <upgrade-settings-button extraClass=true actionTitle="Upgrade" v-bind:subtitle=subscription to="/Subscription" icon="fas fa-tag icons"></upgrade-settings-button>
          </el-row>
          <hr style="opacity:0.2;" />
          <el-row :gutter="24" v-for="cc in allCounterCurriencies" :key="cc.index" class="counter-label" v-show="cc.canSee">
            <el-col :span="14">
              {{'alt / '+cc.symbol}}
            </el-col>
            <el-col :span="4" style="color:transparent">-</el-col>
            <el-col :span="6" style="text-align:right">
            <el-switch  v-model="cc.value" :disabled="!cc.canEdit" @change="onCounterChange(cc.index,cc.value)"></el-switch>
            </el-col>
            </el-row>
            <hr style="opacity:0.2;" />
          <el-row class="search-row">
            <el-input :disabled="disableSearch" size=medium v-model.lazy="search" prefix-icon="el-icon-search" placeholder="Search Ticker" />
          </el-row>
          <el-row>
            <div class="coin-table">
              <el-row class="cryptorow" :gutter="24" v-show=tc.canSee v-for="tc in filteredTransactionCurrencies" v-bind:key="tc.symbol">
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="14" v-text="tc.name" style="text-align:left"></el-col>
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="4" v-text="tc.symbol" style="font-size:8px; padding-top:6px"></el-col>
                <el-col class="switch-col" :span="6"><el-switch v-model="tc.value" @change="onChange(tc.symbol,tc.value)" :disabled="!tc.canEdit"/></el-col>
              </el-row>
            </div>
          </el-row>
        </el-main>
        <el-footer v-show=showFooter>
          <el-row style="margin-top:10px">
              <el-col :offset="2" :span=12>
                <el-button size="default" style="width:100%" type="success" round @click="selectAllCoins">Select All</el-button>
              </el-col>
            <el-button size="default" type="info" round @click="resetCoinsToDefault">Reset</el-button>
            </el-row>
        </el-footer>
  </el-container>
</template>
<script>
import _ from "lodash";
import Header from "./Header.vue";
import UpgradeSettingsButton from "./UpgradeSettingsButton";
import db from "../db";
import util from "../util";

function isCounterAvailableFor(settings, counter, subscriptionTemplates) {
  var highestSubscriptionLevel = util.getHighestSubscriptionLevel(settings);
  highestSubscriptionLevel =
    highestSubscriptionLevel == "ITT" ? "centomila" : highestSubscriptionLevel;
  var tooLowToEdit =
    highestSubscriptionLevel == "free" || highestSubscriptionLevel == "beta";

  var subscriptionTemplate = subscriptionTemplates.filter(
    st => st.label == highestSubscriptionLevel
  )[0];
  var availableForPlan =
    !subscriptionTemplate.counter ||
    subscriptionTemplate.counter.includes(counter.index);

  counter.canSee = true;
  counter.canEdit = !tooLowToEdit;
  counter.value = tooLowToEdit
    ? availableForPlan
    : settings.counter_currencies.includes(counter.index);

  return counter;
}

function isCoinAvailableFor(
  settings,
  ticker,
  subscriptionTemplates,
  enabledCounterCurrencies
) {
  var highestSubscriptionLevel = util.getHighestSubscriptionLevel(settings);
  highestSubscriptionLevel =
    highestSubscriptionLevel == "ITT" ? "centomila" : highestSubscriptionLevel;
  var tooLowToEdit =
    highestSubscriptionLevel == "free" || highestSubscriptionLevel == "beta";

  var subscriptionTemplate = subscriptionTemplates.filter(
    st => st.label == highestSubscriptionLevel
  )[0];
  var availableForPlan =
    !subscriptionTemplate.tickers ||
    subscriptionTemplate.tickers.includes(ticker.symbol);

  ticker.canSee = tradesAgainstSelectedCounters(
    ticker,
    enabledCounterCurrencies
  );
  ticker.canEdit = !tooLowToEdit;
  ticker.value = tooLowToEdit
    ? availableForPlan
    : settings.transaction_currencies.includes(ticker.symbol);

  return ticker;
}

function tradesAgainstSelectedCounters(ticker, enabledCounterCurrencies) {
  var tradeAgainstSelectedCounterCurrencies = false;

  ticker.counter_currencies.forEach(cc => {
    tradeAgainstSelectedCounterCurrencies =
      tradeAgainstSelectedCounterCurrencies ||
      enabledCounterCurrencies.map(ec => ec.index).includes(cc);
  });
  return tradeAgainstSelectedCounterCurrencies;
}

export default {
  data: function() {
    return {
      search: "",
      settings: this.$store.state.settings,
      subscriptionTemplates: this.$store.state.subscriptionTemplates,
      dbTransactionCurrencies: this.$store.state.all_transaction_currencies,
      subscription: "Upgrade to unlock custom selection.",
      showFooter:
        ["free", "beta"].indexOf(
          util.getHighestSubscriptionLevel(this.$store.state.settings)
        ) < 0,
      showUpgrade:
        ["free", "beta"].indexOf(
          util.getHighestSubscriptionLevel(this.$store.state.settings)
        ) > -1,
      disableSearch:
        util.getHighestSubscriptionLevel(this.$store.state.settings) == "free"
    };
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    selectAllCoins: function() {
      this.$store.state.settings.transaction_currencies = this.$store.state.all_transaction_currencies.map(
        atc => atc.symbol
      );

      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: this.$store.state.settings
      });
      //this.$forceUpdate();
    },
    resetCoinsToDefault: function() {
      this.$store.dispatch("resetCoinsToDefault");
      this.$forceUpdate();
    },
    onChange: function(symbol, enabled) {
      if (enabled) this.settings.transaction_currencies.push(symbol);
      else
        this.settings.transaction_currencies = this.settings.transaction_currencies.filter(
          t => t != symbol
        );

      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: this.settings
      });

      //this.$forceUpdate();
    },
    onCounterChange: function(index, enabled) {
      if (enabled) this.settings.counter_currencies.push(index);
      else {
        this.settings.counter_currencies = this.settings.counter_currencies.filter(
          t => t != index
        );
      }

      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: this.settings
      });

      //this.$forceUpdate();
    }
  },
  computed: {
    resetting: function() {
      return false;
    },
    filteredTransactionCurrencies: function() {
      var enabledCounterCurrencies = this.allCounterCurriencies.filter(
        acc => acc.value
      );
      if (!enabledCounterCurrencies || enabledCounterCurrencies.length <= 0)
        return [];

      var allTransactionCurrencies = _.sortBy(
        this.dbTransactionCurrencies.map(tc => {
          return isCoinAvailableFor(
            this.$store.state.settings,
            tc,
            this.subscriptionTemplates,
            enabledCounterCurrencies
          );
        }),
        t => {
          return parseInt(t.rank);
        }
      );

      allTransactionCurrencies.forEach(t => {
        t.canSee =
          t.canSee &&
          (this.search == "" ||
            t.name.toLowerCase().startsWith(this.search.toLowerCase()) ||
            t.symbol.toLowerCase().startsWith(this.search.toLowerCase()));
      });

      return allTransactionCurrencies;
    },
    allCounterCurriencies: function() {
      return db.COUNTER_CURRENCIES.filter(cc => cc.available).map(cc => {
        return isCounterAvailableFor(
          this.$store.state.settings,
          cc,
          this.subscriptionTemplates
        );
      });
    }
  },
  components: {
    Header,
    UpgradeSettingsButton
  }
};
</script>
<style>
.switch-col {
  text-align: right;
}

.coin-table {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 80px;
}

.el-footer {
  background: white;
  height: 80px !important;
  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(0, 0, 0, 0.19);
}

.el-input--medium .el-input__inner {
  height: 60px !important;
}

.counter-label {
  text-align: left;

  padding-bottom: 10px;
  margin-right: 0px !important;
}

.cryptorow {
  padding: 8px;
}
</style>

