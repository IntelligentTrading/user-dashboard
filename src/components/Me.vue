<template>

</template>
<script>
export default {
  props: ["token"],
  mounted() {
    var tokenJsonString = Buffer.from(this.$props.token, "base64").toString();
    var token = JSON.parse(tokenJsonString);
    this.$store.commit("telegramId", token.telegram_chat_id);
    this.$router.push(`/Main/${this.token}/${token.telegram_chat_id}`);
  }
};
</script>

