<template>
<el-container>
    <el-main>
        <qrcode class="qrcode" v-bind:text="address"/>
        <div class="addressLabel">{{address}}</div>
    </el-main>
</el-container>
</template>
<script>
import qrcode from "vue-qrcode-component";

export default {
  name: "Subscription",
  components: { qrcode },
  props: ["settings"],
  data() {
    return {
      address: this.settings.ittWalletReceiverAddress
    };
  }
};
</script>
<style>

.setting-label {
  display: flex;
}

.addressLabel {
    font-size: 12px;
    margin: 2px;
}

.qrcode{
    display: inline-flex
}
</style>
