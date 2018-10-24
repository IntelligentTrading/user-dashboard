<template>
    <div>
        <el-row>
            <label style='font-size:18px;font-weight:600'>Sign a message with your address</label>
        </el-row>
        <el-row style='text-align:left;padding-top:20px'>
            <label style='font-size:12px;font-weight:200;word-break:break-all'>1. Paste your Transaction hash in the box below</label>
        </el-row>
        <el-row>
            <el-input placeholder="0x5f365e6d3c568ab6b87f43de7958c87aa255c77ef6e63f47e932c5295866cb71" v-model="txHash" size="mini"></el-input>
            </el-row>
            <el-row>
          </el-row>
          <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:12px;font-weight:200'>2. Click on <span style='font-weight:600' @click="doCopy">{{txHashNo0x}}</span> to copy to your clipboard and use it as message to sign on <a href="https://mycrypto.com/sign-and-verify-message/sign" target="_blank">MyCrypto</a> selecting the address you used to pay. <a href='https://intelligenttrading.org/guides/how-to-buy-itt-tokens/' target='_blank'>(Detailed guide)</a></label>
            </el-row>
            <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:12px;font-weight:200'>3. Paste the full signature result in the box below and press <b>Verify</b>.</label>
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

export default {
  name: "Sign",
  props: ["page"],
  data() {
    return {
      txHash: "",
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
    txHashNo0x: function() {
      if (this.txHash.length <= 0) return "the string you will see here";
      return this.txHash.startsWith("0x") ? this.txHash.slice(2) : this.txHash;
    }
  },
  methods: {doCopy: function() {
      this.$copyText(this.txHashNo0x).then(() => {
        this.$notify({
          title: "ITF Payment",
          message: `${this.txHashNo0x} copied to clipboard`,
          duration: 2000,
          offset: 100,
          type: "success"
        });
      });
    },
    validateSignature: function() {
      var signatureObject = JSON.parse(this.signatureResult);
      this.validating = true;
      this.verificationText = 'Verifying...'
      api.verifyEthSignature(
        JSON.stringify({
          ...signatureObject,
          telegram_chat_id: this.telegram_chat_id
        })
      ).then(result => {
        this.validating = false;
        this.$emit("update:payload", JSON.stringify(result));
        this.$emit("update:step", 2);
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
