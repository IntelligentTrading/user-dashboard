<template>
<el-container>
  <el-header>
            <Header title="Subscriptions" />
            </el-header> 
    <el-main>
      <div style="display:inline-block">
      <el-row>
        <label class='title'>{{this.subscription.plan}}</label>
      </el-row>
      <el-row>
        <label class='daysleft-title'>{{this.daysLeftLabel()}}</label>
      </el-row>
      <el-row>
        <label class='daysleft-title'>. . .</label>
      </el-row>
      <el-row>
        <label class='upgrade-label'>{{this.upgradeOrExtendLabel()}} <a href='https://intelligenttrading.org/pricing/' target='_blank'>[View all features]</a></label>
      </el-row>
      <el-row style='margin-top:20px;font-weight:500'>
        <label class='upgrade-label'>Select your payment method:</label>
      </el-row>
      <el-row>
          <el-card :class="[{'selected': preferredPaymentMethod == 'SendEth'}, 'paymentMethodCard']" shadow=never border @click.native="preferredPaymentMethod = 'SendEth'">
            <div style="padding: 2px;">
              <span><i class="fab fa-ethereum"></i><label class=method> Pay with Ethereum</label></span>
              <el-row>
              <span style="font-size:12px">Use ETH to purchase 1, 3, 12 months of access.
              </span>
              </el-row>
                <el-row>
                <span style='font-size:10px;display: flex'>* All ETH received will be used to purchase ITT on your behalf.</span>
                </el-row>
        </div>
          </el-card>
      </el-row>
      <el-row>
        <el-card :class="[{'selected': preferredPaymentMethod == 'SendItt'}, 'paymentMethodCard']" shadow=never border @click.native="preferredPaymentMethod = 'SendItt'">
            <div style="padding: 2px;">
              <span><img src='https://intelligenttrading.org/wp-content/themes/intelligent-trading/assets/img/icons/favicon-16x16.png' style="width:14px;height:14px"/><label class=method> Pay with ITT</label></span>
              <div class='bottom clearfix'>
              <span style="font-size:12px">Use ITT to purchase 1, 3, 12 months of access.
              </span>
              </div>
        </div>
          </el-card>
      </el-row>
      <el-row>
        <el-card :class="[{'selected': this.preferredPaymentMethod == 'StakeItt'}, 'paymentMethodCard']" shadow=never border @click.native="preferredPaymentMethod = 'StakeItt'">
            <div style="padding: 2px;">
              <span><i class="fas fa-coins"></i><label class='method'> Stake ITT</label></span>
              <div class='bottom clearfix'>
              <span style="font-size:12px">Get access by holding 10,000 ITT in your wallet.</span>
              </div>
        </div>
          </el-card>
      </el-row>
      <el-button class=next type="primary" @click="startPayment()">Next <i class="fas fa-long-arrow-alt-right"></i></el-button>
      </div>
    </el-main>
</el-container>
</template>
<script>
import Header from "./Header";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import constant from "../constant";

export default {
  name: "Subscription",
  components: {
    Header
  },
  data() {
    return {
      preferredPaymentMethod: "SendItt"
    };
  },
  methods: {
    highlight: src => {
      this.preferredPaymentMethod = src;
      console.log(this.preferredPaymentMethod);
    },
    goBack: function() {
      this.$router.go(-1);
    },
    daysLeftLabel: function() {
      if (this.settings.staking.diecimila) return `Staking active.`;

      return this.subscription.daysLeft > 0 || this.subscription.daysLeft == "∞"
        ? this.subscription.daysLeft + " days left"
        : this.subscription.hoursLeft + " hours left";
    },
    upgradeOrExtendLabel: function() {
      if (this.subscription.plan == "Pro")
        return "Extend your subscription to the Pro Plan to keep receiving premium trading signals.";
      else
        return "Upgrade to Pro for just $20 to get premium trading signals and unlock alerts from coins listed on Binance.";
    },
    startPayment: function() {
      this.$router.push("/Payment/" + this.preferredPaymentMethod);
    }
  },
  computed: {
    ...mapGetters([
      "settings",
      "dbTransactionCurrencies",
      "subscription",
      "highestSubscriptionLevel",
      "signalLabel",
      "telegram_chat_id"
    ])
  }
};
</script>
<style>
.next {
  width: 100%;
  margin-top: 10px;
}

.paymentMethodCard {
  width: 100%;
  text-align: left;
  margin-top: 10px;
  opacity: 0.7;
}

.method {
  font-weight: 500;
}

.block {
  display: flex;
  text-align: left;
  padding: 20px;
}

.upgrade-label {
  font-size: 12px;
  margin-top: 15px;
}

.qr-info {
  color: #2a4d96;
  font-weight: bold;
  font-size: 16px;
}

.selected {
  background: #66b1ff38;
  border: #3a8ee6 1px solid;
  opacity: 1;
}

.title {
  font-size: 24px;
}

.daysleft-title {
  font-size: 14px;
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
