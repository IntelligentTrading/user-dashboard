<template>
    <div>
        <el-row>
            <label style='font-size:18px;font-weight:600'>Pay with ITT Tokens</label>
            </el-row>
        <el-row>
          <label class="pricing-subtitle">
            Exchange rate: 1 ITT = ${{this.itt_usd_rate}} USDT
          </label>
        </el-row>
        <el-row style=margin-top:20px><label style="font-size:12px">Get access to the Pro Plan for </label></el-row>
        <el-row style="padding:10px">
          <el-col :span=8>
        <el-card :class="[{'selected': preferredDuration == '1M'}, 'subscriptionDuration']" shadow=never border @click.native="preferredDuration = '1M'">
              <span style="font-size:12px">1 Month
              </span>
          </el-card>
          </el-col>
          <el-col :span=8>
          <el-card :class="[{'selected': preferredDuration == '3M'}, 'subscriptionDuration']" shadow=never border @click.native="preferredDuration = '3M'">
              <span style="font-size:12px">3 Months
              </span>
          </el-card>
          </el-col>
        <el-col :span=8>
          <el-card :class="[{'selected': preferredDuration == '12M'}, 'subscriptionDuration']" shadow=never border @click.native="preferredDuration = '12M'">
              <span style="font-size:12px">12 Months
              </span>
          </el-card>
          </el-col>
        </el-row>  
        <el-row>
            <label style='font-size:12px;font-weight:200'>Send <b>{{subscriptionAmount}} ITT</b> to the following address.<br /> (Tap or scan the QR code below to copy the receiver address)</label>
        </el-row>
        <el-row>
        <qrcode class='qrcode' :text="address" @click.native='doCopy'></qrcode>
        </el-row>
        <el-row>
        <div class="container">
          <button type="button" class="addressLabel" v-clipboard:copy="address">
            {{address}} <i class="far fa-copy" style="color:#4ccfa6"></i>
          </button>
        </div>
        </el-row>
        <el-row style='padding:30px'>
          <a href='https://intelligenttrading.org/guides/how-to-buy-itt-tokens/?utm_source=TelegramBotSettings' target="_blank" class='button'>How to get ITT</a>
        </el-row>
    </div>
</template>
<script>
import qrcode from "vue-qrcode-component";
import constant from "../../constant";

export default {
  name: "SendItt",
  components: { qrcode },
  data() {
    return {
      months: 1,
      label: "ITT",
      address: this.$store.state.settings.ittWalletReceiverAddress,
      itt_usd_rate: this.$store.state.itt_usd_rate,
      preferredDuration:'3M'
    };
  },
  computed: {
    requiredTokens: function() {
      if (this.itt_usd_rate)
        return (
          (constant.oneMonthInSeconds * constant.usdPricePerSecond) /
          this.itt_usd_rate
        );
      else return "N/A";
    },
    getLabel: function() {
      return "ITT";
    },
    subscriptionAmount: function() {
      return parseInt(this.preferredDuration.replace('M','')) * Math.round(this.requiredTokens);
    }
  },
  methods: {
    doCopy: function() {
      this.$copyText(this.address).then(
        this.$notify({
          title: "ITF Payment",
          message: `${this.address} copied to clipboard`,
          duration: 0,
          offset: 100,
          type: "success"
        })
      );
    },
    openBlank: function() {}
  }
};
</script>
<style>
.el-card__body {
  padding: 10px;
}

.plan-info {
  font-size: 16px;
}
.pricing-col {
  text-align: left;
  border-left: black 1px solid;
  padding-left: 10px;
}

.pricing-info {
  font-size: 16px;
  padding: 0px;
  margin: 0px;
}
a {
  text-decoration: none;
}

a.button {
  background-color: lightblue;
  border-radius: 5px;
  color: #fff;
  padding: 10px 20% 10px 20%;
}

.flexrow {
  margin-top: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.subscriptionDuration {
  margin: 2px;
  opacity: 0.7;
}
</style>
