<template>
  <el-container>
        <el-header>
            <el-row style="margin-top:10px">
                <el-col :span="2">
                  <div @click="goBack"><i class="el-icon-arrow-left el-icon-left" style="color:whitesmoke"></i>
                  </div>
                  </el-col>
                <el-col :span="20" >SETTINGS</el-col>
                <el-col :span="2">
                </el-col>
            </el-row>
            </el-header>
        <el-main style="padding:0px">
          <el-row>
            <el-col :span=16>
          <el-input size=medium v-model="search" prefix-icon="el-icon-search" placeholder="Search Coin" />
            </el-col>
          <el-col :span="8">
          <el-button size="mini" style="margin-top:15px" round>select all</el-button>
          </el-col>
          </el-row>
            <div class="coin-table">
              <el-row :gutter="24" style="display:inline" v-for="tc in filteredTransactionCurrencies" v-bind:key="tc.symbol">
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="14" v-text="tc.name" style="text-align:left"></el-col>
                <el-col v-bind:class="{isNotSelected:!tc.enabled }" :span="4" v-text="tc.symbol" style="font-size:8px"></el-col>
                <el-col class="switch-col" :span="6"><el-switch v-model="tc.enabled" @change="onChange(tc.symbol,tc.enabled)"/></el-col>
              </el-row>
            </div>
            <hr class="settings-separator" />
        </el-main>
  </el-container>
</template>
<script>
import _ from 'lodash'

export default {
  data(){
    return {
      search: ""
    }
  },
  methods: {
    goBack: function() {
      this.$router.go(-1);
    },
    onChange: function(symbol,enabled){
      this.$store.commit("setModified", true);
      if (enabled) this.$store.state.settings.transaction_currencies.push(symbol);
      else
        this.$store.state.settings.transaction_currencies = this.$store.state.settings.transaction_currencies.filter(
          t => t != symbol
        );
    }
  },
  computed: {
    filteredTransactionCurrencies: function() {
      var allTransactionCurrencies = _.sortBy(
        this.$store.state.all_transaction_currencies.map(tc => {
          tc.enabled =
            this.$store.state.settings.transaction_currencies.indexOf(tc.symbol) > -1;
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

.el-input__inner{
  border-radius: 0px;
  border: 0px
}

.el-input--medium .el-input__inner{
  height: 60px;
}
.coin-table {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 425px;
}
</style>

