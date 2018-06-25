<template>
<el-container>
  <el-header>
            <el-row style="margin-top:10px">
                <el-col :span="2">
                  <div @click="goBack"><i class="el-icon-arrow-left el-icon-left" style="color:whitesmoke"></i>
                  </div>
                  </el-col>
                <el-col :span="20" >SETTINGS</el-col>
                <el-col :span="2">
                </el-col>
            </el-row>
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

export default {
  name: "Subscription",
  components: { qrcode },
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
