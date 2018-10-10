<template>
<div>
  <h1 class="price">Sorry</h1>
  <h4>To keep your data safe I cannot refresh the page! Please close this page and reopen the settings from the bot!</h4>
</div>
</template>

<script>
export default {
  name: "ErrorPage",
  data() {
    return {
      msg: "This is an error Page"
    };
  },
  created() {
    this.$emit("loaded", true);
  }
};
</script>


<style>
.pro {
  margin-top: 100px;
}

.price {
  font-family: "Helvetica Neue";
  font-size: 52px;
  font-weight: 100;
}
</style>
