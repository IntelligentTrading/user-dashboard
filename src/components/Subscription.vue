<template>
<el-container>
  <el-header>
            <Header title="SUBSCRIPTIONS" />
            </el-header> 
    <el-main>
        <qrcode class="qrcode" v-bind:text="address"/>
        <div class="container">
          <label class="addressLabel">{{address}}</label>
          <button type="button" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError">
            <i class="far fa-copy"></i>
          </button>
  </div>
    </el-main>
</el-container>
</template>
<script>
import qrcode from "vue-qrcode-component";
import Header from "./Header";

export default {
  name: "Subscription",
  components: { qrcode, Header },
  data() {
    return {
      address: this.$store.state.settings.ittWalletReceiverAddress
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
  }
};
</script>
<style>
.setting-label {
  display: flex;
}

.addressLabel {
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
}

.qrcode {
  display: inline-flex;
}
</style>
