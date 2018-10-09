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
      <el-tabs>
         <el-tab-pane>
          <span slot="label">Pay with ETH <i class="fab fa-ethereum"></i></span>
          <div>
            <component :is=CurrentPage v-bind:step.sync=step :payload.sync=payload></component>
            </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">Pay with ITT <img src='https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/favicon-16x16.png' style="width:14px;height:14px"/></span>
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
        </el-tab-pane>
      </el-tabs>
     
        
    </el-main>
</el-container>
</template>
<script>
import qrcode from "vue-qrcode-component";
import Header from "./Header";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import SendEth from "./PaymentWizard/SendEth";
import Sign from "./PaymentWizard/Sign";
import Done from "./PaymentWizard/Done";
import constant from "../constant";

export default {
  name: "Subscription",
  components: { qrcode, Header, SendEth, Sign },
  data() {
    return {
      step: 0,
      address: this.$store.state.settings.ittWalletReceiverAddress,
      itt_usd_rate: this.$store.state.itt_usd_rate,
      payload: undefined
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
    openBlank: function(link) {
      window.open(link, "_blank");
    }
  },
  computed: {
    ...mapGetters(["subscription"]),
    requiredTokens: function() {
      if (this.itt_usd_rate)
        return Math.ceil(
          (constant.oneMonthInSeconds * constant.usdPricePerSecond) /
            this.itt_usd_rate
        );
      else "N/A";
    },
    CurrentPage: function() {
      var pages = [SendEth, Sign, Done];
      return pages[this.step];
    },
    CurrentStepLabel: function() {
      var labels = ["Sign your transaction", "Verify", "Done!"];
      return labels[this.step];
    }
  }
};
</script>
<style>
.qr-info {
  color: #2a4d96;
  font-weight: bold;
  font-size: 16px;
}

.pricing-info {
  font-size: 32px;
  border-radius: 5px;
  padding: 5px;
  font-weight: 400;
  margin: 5px;
}

.pricing-subtitle {
  font-size: 10px;
  font-weight: 200;
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

.qrcode > img {
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

.steps {
  margin-bottom: 0px;
  margin-top: 10px;
}

.stepButton {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  width: 90%;
}
</style>
