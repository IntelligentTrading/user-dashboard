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
          <el-row :gutter="24" v-for="cc in availableCounterCurrencies" :key="cc.index" class="counter-label" v-show="cc.canSee">
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
            <el-input size=medium v-model.lazy="search" prefix-icon="el-icon-search" placeholder="Search Ticker" />
          </el-row>
          <el-row>
            <div class="coin-table">
              <el-row class="cryptorow" :gutter="24" v-show=tc.canSee v-for="tc in filteredTransactionCurrencies" v-bind:key="tc.symbol" :disabled=!tc.canEdit>
                <el-col v-bind:class="{isNotAvailable:!tc.canEdit }" :span="14" v-text='tc.name' style="text-align:left"></el-col>
                <el-col v-bind:class="{isNotAvailable:!tc.canEdit }" :span="4" v-text="tc.symbol" style="font-size:8px; padding-top:6px"></el-col>
                <el-col class="switch-col" :span="6">
                  <el-switch :value="tc.value" @change="onChange(tc)" :disabled="!tc.canEdit" />
                  </el-col>
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
import api from "../api";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data: function() {
    return {
      search: "",
      subscription: "Upgrade to unlock custom selection.",
      showFooter:
        ["free", "beta"].indexOf(this.$store.getters.highestSubscriptionLevel) <
        0,
      showUpgrade:
        ["free", "beta"].indexOf(this.$store.getters.highestSubscriptionLevel) >
        -1,
      disableSearch: this.$store.getters.highestSubscriptionLevel == "free"
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
    onChange: function(ticker) {
      if (!ticker.value)
        this.settings.transaction_currencies.push(ticker.symbol);
      else
        this.settings.transaction_currencies = this.settings.transaction_currencies.filter(
          t => t != ticker.symbol
        );

      ticker.value = !ticker.value;

      this.$nextTick().then(() => {
        this.$store.dispatch("save", {
          chat_id: this.$store.state.telegram_chat_id,
          settings: this.settings
        });
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
    ...mapGetters([
      "highestSubscriptionLevel",
      "settings",
      "subscriptionTemplates",
      "dbTransactionCurrencies",
      "availableTransactionCurrencies",
      "availableCounterCurrencies"
    ]),
    filteredTransactionCurrencies: function() {
      return this.availableTransactionCurrencies.filter(t => {
        return (
          t.canSee &&
          (this.search == "" ||
            t.name.toLowerCase().startsWith(this.search.toLowerCase()) ||
            t.symbol.toLowerCase().startsWith(this.search.toLowerCase()))
        );
      });
    },
    resetting: function() {
      return false;
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

.isNotAvailable {
  opacity: 0.5;
}
.el-badge__content.is-fixed {
  top: 12px;
  right: 40px;
}

.el-badge__content {
  background-color: #00d3a2;
  border-radius: 8px;
}

.noShowBadge {
  opacity: 0;
}
</style>

