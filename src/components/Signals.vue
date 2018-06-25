<template>
<el-container>
    <el-main>
      <div class="option-label">Trading Pair</div>
            <el-input size=medium style="margin-bottom:10px; border:transparent" v-model="search" prefix-icon="el-icon-search" placeholder="Search Coin" />
            <div class="coin-table">
              <el-row :gutter="24"  v-for="(tc,index) in filteredTransactionCurrencies" :class="{'even-row': index % 2 === 0}" v-bind:key="tc.symbol" style="text-align:left">
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="14" v-text="tc.name"></el-col>
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="4" v-text="tc.symbol" style="font-size:8px"></el-col>
                <el-col class="switch-col" :span="6"><el-switch v-model="tc.enabled" @change="onChange(tc.symbol,tc.enabled)"/></el-col>
              </el-row>
            </div>
            <hr style="opacity:0.2;" />
            <div style="display:inline-flex; margin-bottom:10px">            
            <el-checkbox-group v-model=userSettings.counter_currencies size="default">
                <el-checkbox-button v-for="cc in allCounterCurrencies" :disabled="!cc.enabled" :label="cc.symbol" :key="cc.index" @change="onSettingsChanged('counter_currencies',userSettings.counter_currencies)">{{'alt / '+cc.symbol}}</el-checkbox-button>
            </el-checkbox-group>
            </div>
            <div class="option-label">Risk settings</div>
            <el-row :gutter="20">
                 <el-radio-group v-model="userSettings.horizon" size="default" @change="onSettingsChanged('horizon',userSettings.horizon)">
                    <el-radio-button label="High risk"></el-radio-button>
                    <el-radio-button label="Medium risk"></el-radio-button>
                    <el-radio-button label="Low risk"></el-radio-button>
                </el-radio-group>
        </el-row>
    </el-main>
</el-container>
</template>
<script>
import _ from "lodash";

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

var horizons = ["short", "medium", "long"];
var risks = ["High risk", "Medium risk", "Low risk"];

function transformFromHorizon(hrz) {
  return risks[horizons.indexOf(hrz)];
}

function transformToHorizon(hrzText) {
  return horizons[risks.indexOf(hrzText)];
}

export default {
  name: "Signals",
  props: ["settings", "transactionCurrencies"],
  data() {
    return {
      userSettings: {
        counter_currencies: this.$props.settings.counter_currencies.map(
          cc => counter_currencies[cc].symbol
        ),
        horizon: transformFromHorizon(this.$props.settings.horizon)
      },
      allCounterCurrencies: counter_currencies,
      search: ""
    };
  },
  methods: {
    onChange: function(obj, state) {
      if (state) this.$props.settings.transaction_currencies.push(obj);
      else
        this.$props.settings.transaction_currencies = this.$props.settings.transaction_currencies.filter(
          t => t != obj
        );
    },
    onSettingsChanged: function(property, state) {
      var propertyValue = state;

      if (property === "counter_currencies")
        propertyValue = state.map(s =>
          counter_currencies.find(cc => cc.symbol == s).index
        );
      if (property === "horizon") propertyValue = transformToHorizon(state);

      this.$emit("settingChanged", property, propertyValue);
    }
  },
  computed: {
    filteredTransactionCurrencies: function() {
      var allTransactionCurrencies = _.sortBy(
        this.transactionCurrencies.map(tc => {
          tc.enabled =
            this.$props.settings.transaction_currencies.indexOf(tc.symbol) > -1;
          return tc;
        }),
        t => {
          return parseInt(t.rank);
        }
      );

      return this.search
        ? allTransactionCurrencies.filter(
            t =>
              t.name.toLowerCase().startsWith(this.search.toLowerCase()) ||
              t.symbol.toLowerCase().startsWith(this.search.toLowerCase())
          )
        : allTransactionCurrencies;
    }
  }
};
</script>
<style>
.even-row {
  background-color: rgba(238, 242, 247, 0.3);
}

.el-main {
  padding: 5px;
}

.setting-label {
  display: flex;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-footer {
  height: 60px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  margin: 0px;
  padding: 0px;
  left: 0px;
}

.coin-table {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 230px;
}

.isNotSelected {
  color: lightslategray;
  opacity: 0.6;
}

.switch-col {
  padding: 0px;
  text-align: end;
}

.option-label {
  font-size: small;
  font-weight: 600;
  font-family: unset;
  text-align: left;
  color: steelblue;
}
</style>
