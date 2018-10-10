<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Send Ethereum</label>
        </el-row>
        <el-row>
            <label style='font-size:10px;font-weight:200'>Tap to copy this address or scan the QR code</label>
        </el-row>
        <el-row>
            <div v-show="this.eth_usd_rate != null" style="margin-top: 20px;">
          <el-row class=flexrow  style="margin-top:10px;">
              <div class=crownico >
                  <i class="fas fa-crown"></i>
              </div>
              <div class="pricing-col">
          <label class="plan-info">Starter</label>
          <br/>
          <label class="pricing-info">{{requiredTokens}} ETH/mo</label>
          <br/>
          <label class="pricing-subtitle">
            1 ETH = ${{Math.round(parseFloat(this.eth_usd_rate))}} USDT = {{(1/requiredTokens).toFixed(1)}} months
          </label>
              </div>
        </el-row>
        </div>
        </el-row>
        <el-row>
        <qrcode class='qrcode' :text="ethAddress" @click.native='doCopy'></qrcode>
        </el-row>
        <el-row>
        <div class="container">
          <button type="button" class="addressLabel" v-clipboard:copy="ethAddress">
            {{ethAddress}} <i class="far fa-copy" style="color:#4ccfa6"></i>
          </button>
        </div>
        </el-row>
        <el-button type="primary" class='stepButton' @click="$emit('update:step', 1)">Sign your transaction <i class="fas fa-long-arrow-alt-right"></i></el-button>
    </div>
</template>
<script>
import qrcode from "vue-qrcode-component";
import constant from "../../constant";

export default {
  name: "SendEth",
  components: { qrcode },
  data() {
    return {
      eth_usd_rate: this.$store.state.eth_usd_rate,
      months: 1,
      label: "ETH"
    };
  },
  computed: {
    ethAddress: function() {
      return process.env.ITF_ETH_PAYMENT_WALLET;
    },
    requiredTokens: function() {
      if (this.eth_usd_rate)
        return (
          (constant.oneMonthInSeconds * constant.usdPricePerSecond) /
          this.eth_usd_rate
        ).toFixed(3);
      else "N/A";
    },
    getLabel: function() {
      return "ETH";
    }
  },
  methods: {
    doCopy: function() {
      this.$copyText(this.ethAddress).then(
        function(e) {
          console.log(e);
        },
        function(e) {
          console.log(e);
        }
      );
    }
  }
};
</script>
<style>
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

.flexrow {
  margin-top: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.crownico {
  text-align: right;
  padding: 10px;
  font-size: 32px;
  max-width: 50%;
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
