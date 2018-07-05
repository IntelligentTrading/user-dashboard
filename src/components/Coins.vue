<template>
  <el-container>
        <el-header>
            <Header title="Coins" />
            </el-header>
        <el-main>
          <el-row class="search-row">
            <el-input size=medium v-model="search" prefix-icon="el-icon-search" placeholder="Search Coin" />
          </el-row>
          <el-row>
            <div class="coin-table">
              <el-row :gutter="24" style="display:inline" v-for="tc in filteredTransactionCurrencies" v-bind:key="tc.symbol">
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="14" v-text="tc.name" style="text-align:left"></el-col>
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="4" v-text="tc.symbol" style="font-size:8px"></el-col>
                <el-col class="switch-col" :span="6"><el-switch v-model="tc.enabled" @change="onChange(tc.symbol,tc.enabled)"/></el-col>
              </el-row>
            </div>
          </el-row>
        </el-main>
        <el-footer>
          <el-row style="margin-top:10px">
              <el-col :offset="2" :span=12>
                <el-button size="default" style="width:100%" type="success" round @click="selectAllCoins">Select all</el-button>
              </el-col>
            <el-button size="default" type="info" round @click="resetCoinsToDefault">Reset</el-button>
            </el-row>
        </el-footer>
  </el-container>
</template>
<script>
import _ from "lodash";
import Header from "./Header.vue";

export default {
  data: function() {
    return {
      search: ""
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
      if (enabled)
        this.$store.state.settings.transaction_currencies.push(symbol);
      else
        this.$store.state.settings.transaction_currencies = this.$store.state.settings.transaction_currencies.filter(
          t => t != symbol
        );

      this.$store.dispatch("save", {
        chat_id: this.$store.state.telegram_chat_id,
        settings: this.$store.state.settings
      });

      this.$forceUpdate();
    }
  },
  computed: {
    resetting: function() {
      return false;
    },
    filteredTransactionCurrencies: function() {
      var allTransactionCurrencies = _.sortBy(
        this.$store.state.all_transaction_currencies.map(tc => {
          tc.enabled =
            this.$store.state.settings.transaction_currencies.indexOf(
              tc.symbol
            ) > -1;
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
  },
  components: {
    Header
  }
};
</script>
<style>

.coin-table {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 80px;
}

.el-footer {
  background: white;
  height: 80px !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.el-input--medium .el-input__inner{
  height: 60px !important;
  
}

</style>

