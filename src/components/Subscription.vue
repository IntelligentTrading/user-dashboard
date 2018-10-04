<template>
<el-container>
  <el-header>
            <Header title="Subscriptions" />
            </el-header> 
    <el-main>
      <el-row>
      <label class="plan-label">{{subscription.plan}}</label>
      </el-row>
      <el-row>
      <label class="exp-date">{{subscription.daysLeft}} days left.</label>
      </el-row>
      <el-row>
        <qrcode class="qrcode" v-bind:text="address"/>
        </el-row>
        <el-row>
        <div class="container">
          <button type="button" class="addressLabel" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError">
            {{address}} <i class="far fa-copy" style="color:#4ccfa6"></i>
          </button>
        </div>
        </el-row>
        <el-row style="margin-top: 20px">
          <label class="qr-info">Send ITT tokens to this wallet address, then your subscription will be updated instantly.</label>
        </el-row>
        <div v-show="this.itt_usd_rate != null" style="margin-top: 20px; text-align: center;">
          <el-row  style="margin-top:10px">
          <label>
          Starter plan rate
          </label>
          <br/>
          <label class="pricing-info">
        {{requiredTokens}} ITT/mo
          </label>
          <br/>
          <label class="pricing-subtitle">
            1 ITT = ${{this.itt_usd_rate}} USDT
          </label>
        </el-row>
        <el-row>
          <el-button type="success" @click="openBlank('https://intelligenttrading.org/guides/how-to-buy-itt-tokens/?utm_source=TelegramBotSettings')">How to get ITT</el-button>
        </el-row>
        </div>
        <div v-show="this.itt_usd_rate == null" style="margin-top: 20px; text-align: center;">
          <label class="pricing-info-soon">
        Pricing info available soon...
          </label>
        </div>
        
    </el-main>
</el-container>
</template>
<script>
import qrcode from "vue-qrcode-component";
import Header from "./Header";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

var usdPricePerSecond = 20 * 12 / 365.25 / 24 / 3600;
var oneMonthInSeconds = 2629746;

export default {
  name: "Subscription",
  components: { qrcode, Header },
  data() {
    return {
      address: this.$store.state.settings.ittWalletReceiverAddress,
      itt_usd_rate: this.$store.state.itt_usd_rate
    };
  },
  methods: {
    onCopy: function(e) {
      alert(`ITF wallet\n${e.text}\n\nAddress copied`);
    },
    onError: function(e) {
      alert("Failed to copy text");
    },
    goBack: function() {
      this.$router.go(-1);
    },
    openBlank: function(link){
      window.open(link,'_blank')
    }
  },
  computed: {
    ...mapGetters(['subscription']),
    requiredTokens: function() {
      if (this.itt_usd_rate)
        return Math.ceil(
          oneMonthInSeconds * usdPricePerSecond / this.itt_usd_rate
        );
      else "N/A";
    }
  }
};
</script>
<style>
.qr-info{
  color:#2a4d96;
  font-weight: bold;
  font-size: 16px; 
}

.pricing-info {
  font-size: 42px;
  font-family: "helvetica neue";
  border-radius: 5px;
  padding: 5px;
  font-weight: 100;
  margin: 5px;
}

.pricing-info-soon {
  font-size: 24px;
  font-family: "helvetica neue";
  border-radius: 5px;
  padding: 5px;
  font-weight: 100;
  margin: 5px;
}

.setting-label {
  display: flex;
}

.addressLabel {
  font-size: 12px;
  background: transparent;
  border: transparent;
  padding: 5px;
  margin-top: 10px;
}

.qrcode {
display: inline-block;
}

.qrcode>img {
  
  margin-top: 20px;
  width: 200px;
  height: 200px;
}

.plan-label {
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 16px;
  color: #2a4d96;
  font-weight: bold;
}

.exp-date {
  font-size: 13px;
}
</style>
