<template>
<el-container>
  <el-header>
            <Header title="Subscriptions" />
            </el-header> 
    <el-main>
      <el-tabs>
         <el-tab-pane>
          <span slot="label">Pay with ETH <i class="fab fa-ethereum"></i></span>
          <div>
            <component :is=CurrentPage v-bind:step.sync=step :payload.sync=payload></component>
            </div>
        </el-tab-pane>
        <el-tab-pane>
            <span slot="label">Pay with ITT <img src='https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/favicon-16x16.png' style="width:14px;height:14px"/></span>
            <send-itt></send-itt>
        </el-tab-pane>
        <el-tab-pane>
            <span slot="label">Stake ITT <img src='https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/favicon-16x16.png' style="width:14px;height:14px"/></span>
            <div>
            <component :is=StakingCurrentPage v-bind:stakingStep.sync=stakingStep :stakingPayload.sync=stakingPayload></component>
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
import SendItt from "./PaymentWizard/SendItt";
import StakeItt from "./PaymentWizard/StakeItt";
import SignStaking from "./PaymentWizard/SignStaking";
import StakingDone from "./PaymentWizard/StakingDone";
import Sign from "./PaymentWizard/Sign";
import Done from "./PaymentWizard/Done";
import constant from "../constant";

export default {
  name: "Subscription",
  components: { qrcode, Header, SendEth, Sign, SendItt, StakeItt, SignStaking, StakingDone },
  data() {
    return {
      step: 0,
      stakingStep: 0,
      payload: undefined,
      stakingPayload: undefined
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
    ...mapGetters(["subscription"]),
    CurrentPage: function() {
      var pages = [SendEth, Sign, Done];
      return pages[this.step];
    },
    StakingCurrentPage: function() {
      var pages = [StakeItt, SignStaking, StakingDone];
      return pages[this.stakingStep];
    },
    CurrentStepLabel: function() {
      var labels = ["Sign your transaction", "Verify", "Done!"];
      return labels[this.step];
    },
    CurrentStakingStepLabel: function() {
      var labels = ["Setup your staking", "Verify", "Done!"];
      return labels[this.stakingStep];
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
  margin-top: 10px;
  width: 150px;
  height: 150px;
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
  bottom: 10px;
  left: 0;
  right: 0;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  width: 90%;
}

.el-notification {
  font-family: sans-serif;
}
.el-notification__content {
  font-size: 10px;
}

.el-textarea__inner {
    min-height: 180px !important;
    font-size: 10px;
    line-height: 1.2;
}
</style>
