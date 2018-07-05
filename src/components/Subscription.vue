<template>
<el-container>
  <el-header>
            <Header title="SUBSCRIPTIONS" />
            </el-header> 
    <el-main>
      <label style="font-size:xx-large">{{subscriptionPlan.plan}}</label>
      <br/>
      <label>{{subscriptionPlan.daysLeft}} days left.</label>
    
        <qrcode class="qrcode" v-bind:text="address"/>
        <div class="container">
          <button type="button" class="addressLabel" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError">
            {{address}}
          </button>
        </div>

        <div v-show="this.itt_usd_rate != null" style="margin-top: 20px; text-align: center;">
          <el-row  style="margin-top:10px">
          <label>
          Starter plan as low as
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
import util from "../util.js";

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
    }
  },
  computed: {
    subscriptionPlan: function() {
      var x = util.subscription(this.$store.state.settings);
      return x;
    },
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
  font-size: small;
  background: goldenrod;
  border: transparent;
  padding: 5px;
  margin-top: 10px;
}

.qrcode {
  display: inline-flex;
  margin-top: 20px;
}
</style>
