<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Send ITT Tokens</label>
        </el-row>
        <el-row>
            <label style='font-size:10px;font-weight:200'>Tap to copy this address or scan the QR code</label>
        </el-row>
        <el-row>
            <div v-show="this.itt_usd_rate != null" style="margin-top: 20px;">
          <el-row class=flexrow>
              <div class=crownico>
                  <i class="fas fa-crown"></i>
              </div>
              <div class=pricing-col>
          <label class="plan-info">Starter</label>
          <br/>
          <label class="pricing-info">{{Math.round(requiredTokens)}} ITT/mo</label>
          <br/>
          <label class="pricing-subtitle">
            1 ITT = ${{this.itt_usd_rate}} USDT
          </label>
              </div>
        </el-row>
        </div>
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
        <el-row style='padding:20px'>
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
      itt_usd_rate: this.$store.state.itt_usd_rate
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
          type: 'success'
        })
      );
    },
    openBlank: function() {}
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
a{
 text-decoration:none;
}

a.button{
 background-color:lightblue;
 border-radius:5px;
 color:#fff;
 margin-right:10px;
 padding:10px 20% 10px 20%;
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

</style>
