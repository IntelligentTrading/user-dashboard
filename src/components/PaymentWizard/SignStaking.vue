<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Sign a message with your address</label>
        </el-row>
        <el-row style='text-align:left'>
            <label style='font-size:10px;font-weight:200'>1. Paste your staking wallet address in the box below</label>
        </el-row>
        <el-row>
            <el-input placeholder="0x1fD19a3FB5Ec2D73440B908c8038333aeFAd1e3e4e" v-model="stakingAddress" size="mini"></el-input>
            </el-row>
            <el-row>
          </el-row>
          <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:10px;font-weight:200'>2. Click on <span style='font-weight:600' @click="doCopy">{{codeToSign}}</span> to copy to your clipboard and use it as message to sign on <a href="https://mycrypto.com/sign-and-verify-message/sign">MyCrypto</a> selecting the address you used to pay. (Detailed guide)</label>
            </el-row>
            <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:10px;font-weight:200'>3. Paste the full signature result in the box below and press <b>Verify</b>.</label>
            </el-row>
            <el-row>
                <el-input type="textarea" :rows="8" :placeholder=exampleSignature v-model="signatureResult"></el-input>
            </el-row>
            <el-row style="padding:20px">
            <el-button type="primary" :disabled="signatureResult=='' || validating" @click="validateSignature">{{verificationText}} <i class="fas fa-long-arrow-alt-right"></i></el-button>
            </el-row>
    </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";
import Hashids from "hashids";

var hashid = new Hashids();

export default {
  name: "Sign",
  props: ["page"],
  data() {
    return {
      stakingAddress: "",
      signatureResult: "",
      verificationText: "Verify your signature",
      validating: false,
      exampleSignature: `{
  "address": "0xe345sdcace2107d017961bcfa29f3e4065f49e",
  "msg": "0x5f365e6d3c568ab6b87f43de7958c87aa255c77ef6e63f47e932c5295866cb71",
  "sig": "0x8a185e5eabdce82aabc2e045sdf43a7d1d2cf0af8ba7c8c087e0987oiub3e960b54ba8e489b6ab536ae186f1cdc4dce088d8fbd3f741b",
  "version": "2"
}`
    };
  },
  computed: {
    ...mapGetters(["telegram_chat_id"]),
    codeToSign: function() {
      if (this.stakingAddress.length <= 0)
        return "the string you will see here";
      return hashid.encode(this.telegram_chat_id);
    }
  },
  methods: {
    doCopy: function() {
      this.$copyText(this.codeToSign).then(() => {
        this.$notify({
          title: "ITF Payment",
          message: `${this.codeToSign} copied to clipboard`,
          duration: 0,
          offset: 100,
          type: "success"
        });
      });
    },
    validateSignature: function() {
      var signatureObject = JSON.parse(this.signatureResult);
      this.validating = true;
      this.verificationText = "Verifying...";
      api.verifyStakingSignature(
          JSON.stringify({
            signature: signatureObject.sig,
            telegram_chat_id: this.telegram_chat_id
          })
        )
        .then(result => {
          this.validating = false;
          this.$emit("update:stakingPayload", JSON.stringify(result));
          this.$emit("update:stakingStep", 2);
        });
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

.transactionHashTrimmingResult {
  font-size: 8px;
  font-weight: 600;
  font-family: Avenir;
}
</style>
