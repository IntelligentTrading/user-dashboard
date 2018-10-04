<template>

</template>
<script>
import { mapState, mapMutations } from "vuex";
import db from "../db";

export default {
  props: ["token"],
  mounted() {
    var tokenJsonString = Buffer.from(this.$props.token, "base64").toString();
    var token = JSON.parse(tokenJsonString);
    this.$store.dispatch("saveChatId", token.telegram_chat_id).then(() => {
      console.log("Loading backend data...");
      Promise.all([
        db.loadTransactionCurrencies(),
        db.loadSignals(),
        db.loadIttPrice(),
        db.loadSubscriptionTemplates()
      ])
        .then(fulfillments => {
          this.$store.commit("all_transaction_currencies", fulfillments[0]);
          this.$store.commit("signals", fulfillments[1]);
          this.$store.commit("itt_usd_rate", fulfillments[2]);
          this.$store.commit("subscriptionTemplates", fulfillments[3]);
        })
        .then(() => {
          console.log("Redirecting to Main page...");
          this.$router.push(`/Main/${this.token}/${token.telegram_chat_id}`);
        });
    });
  }
};
</script>

