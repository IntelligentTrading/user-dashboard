<template>

</template>
<script>
import { mapState, mapMutations } from "vuex";
import api from "../api";

export default {
  props: ["token"],
  mounted() {
    var tokenJsonString = Buffer.from(this.$props.token, "base64").toString();
    var token = JSON.parse(tokenJsonString);
    this.$store.dispatch("storeToken", this.$props.token);
    this.$store.dispatch("saveChatId", token.telegram_chat_id).then(() => {
      console.log("Loading backend data...");
      Promise.all([
        api.loadTransactionCurrencies(),
        api.loadSignals(),
        api.loadIttPrice(),
        api.loadSubscriptionTemplates(),
        api.loadEthPrice()
      ])
        .then(fulfillments => {
          this.$store.commit("all_transaction_currencies", fulfillments[0]);
          this.$store.commit("signals", fulfillments[1]);
          this.$store.commit("itt_usd_rate", fulfillments[2]);
          this.$store.commit("subscriptionTemplates", fulfillments[3]);
          this.$store.commit("eth_usd_rate", fulfillments[4][0].priceUsd);
        })
        .then(() => {
          console.log("Redirecting to Main page...");
          this.$router.push(`/Main/${this.token}/`);
        });
    });
  }
};
</script>

