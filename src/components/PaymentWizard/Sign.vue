<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Sign a message with your address</label>
        </el-row>
        <el-row style='text-align:left'>
            <label style='font-size:10px;font-weight:200'>1. Paste your Transaction hash in the box below</label>
        </el-row>
        <el-row>
            <el-input placeholder="0x5f365e6d3c568ab6b87f43de7958c87aa255c77ef6e63f47e932c5295866cb71" v-model="txHash" size="mini"></el-input>
            </el-row>
            <el-row>
          </el-row>
          <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:10px;font-weight:200'>2. Click on <span style='font-weight:600'>{{txHashNo0x}}</span> to copy to your clipboard and use it as message to sign on <a href="https://mycrypto.com/sign-and-verify-message/sign">MyCrypto</a> selecting the address you used to pay. (Detailed guide)</label>
            </el-row>
            <el-row style='text-align:left; margin-top:10px'>
            <label style='font-size:10px;font-weight:200'>3. Paste the full signature result in the box below and press <b>Verify</b>.</label>
            </el-row>
            <el-row>
                <el-input type="textarea" :rows="8" :placeholder=exampleSignature v-model="signatureResult"></el-input>
            </el-row>
            <el-button type="primary" class='stepButton' :disabled="signatureResult=='' || validating" @click="validateSignature">Verify your signature <i class="fas fa-long-arrow-alt-right"></i></el-button>
    </div>
</template>
<script>
import db from "../../db";
import { mapGetters } from "vuex";

export default {
  name: "Sign",
  props: ["page"],
  data() {
    return {
      txHash: "",
      signatureResult: "",
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
  methods: {
    validateSignature: function() {
      var signatureObject = JSON.parse(this.signatureResult);
      console.log({
        ...signatureObject,
        telegram_chat_id: this.telegram_chat_id
      });
      db.verifySignature(JSON.stringify({
        ...signatureObject,
        telegram_chat_id: this.telegram_chat_id
      })).then(result => {
        console.log(result);
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
