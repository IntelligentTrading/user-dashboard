<template>
    <div>
        <el-row>
            <label style='font-size:18px;font-weight:600'>Pay with Ethereum</label>
            </el-row>
        <el-row>
          <label class="pricing-subtitle">
            1 ETH = ${{Math.round(parseFloat(this.eth_usd_rate))}} USDT
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
            <label style='font-size:12px;font-weight:200'>Send <b>{{subscriptionAmount}} ETH</b><span style='color:lightslategray'> (${{Math.round(subscriptionAmount * parseFloat(this.eth_usd_rate))}})</span> to the following address.<br /> (Tap or scan the QR code below to copy the receiver address)</label>
        </el-row>
        <el-row>
        <qrcode class='qrcode' :text="ethAddress" @click.native='doCopy'></qrcode>
        </el-row>
        <el-row>
        <div class="container">
          <button type="button" class="addressLabel" @click='doCopy'>
            {{ethAddress}} <i class="far fa-copy" style="color:#4ccfa6"></i>
          </button>
        </div>
        </el-row>
        <el-row style='padding:30px'>
          <el-button type="primary" @click="$emit('update:step', 1)">Sign your transaction <i class="fas fa-long-arrow-alt-right"></i></el-button>
        </el-row>
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
      label: "ETH",
        preferredDuration:'3M'
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
    },
    subscriptionAmount: function() {
      return (parseInt(this.preferredDuration.replace('M','')) * this.requiredTokens).toFixed(3)
    }
  },
  methods: {
    doCopy: function() {
      this.$copyText(this.ethAddress).then(() => {
        this.$notify({
          title: "ITF Payment",
          message: `${this.ethAddress} copied to clipboard`,
          duration: 2000,
          offset: 100,
          type: 'success'
        });
      });
    }
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
