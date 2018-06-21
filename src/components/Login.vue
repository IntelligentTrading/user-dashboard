<template>
<el-container>
    <el-header class="header">LOGIN</el-header>
    <el-main>
        <img class="logo" :src="logo" />
        <div class="chat-id">{{id}}</div>
        <el-button class="go" @click="verify" type="primary">Go</el-button>
    </el-main>
</el-container>
</template>

<script>
import logo from "../assets/itf.jpg";

const serviceEndpoint = process.env.ITT_NODE_SERVICES;
const apiKey = process.env.NODE_SVC_API_KEY;

function loadTransactionCurrencies() {
  console.log(`Fetching ${serviceEndpoint}/tickers/transaction_currencies`)
  return fetch(`${serviceEndpoint}/tickers/transaction_currencies`, {
    headers: new Headers({
      "NSVC-API-KEY": apiKey,
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "Access-Control-Request-Method": "*"
    }),
    mode: "cors"
  }).then(result => {
    return result.json();
  });
}

function loadUserSettings(chat_id) {

  return fetch(`${serviceEndpoint}/users/${chat_id}`, {
    headers: new Headers({
      "NSVC-API-KEY": apiKey,
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "Access-Control-Request-Method": "*"
    }),
    mode: "cors"
  }).then(result => {
    return result.json();
  });
}

export default {
  data: function() {
    return {
      logo: logo
    };
  },
  name: "Login",
  props: ["id"],
  components: {},
  methods: {
    verify() {
      Promise.all([
        loadTransactionCurrencies(),
        loadUserSettings(this.$props.id)
      ]).then(fullfillments => {
        alert('Loaded!')
        this.$router.push({
          name: "Settings",
          params: {
            settings: fullfillments[1].settings,
            transaction_currencies: fullfillments[0]
          }
        });
      });
    }
  }
};
</script>

<style>
.header {
  color: darkslateblue;
  padding: 10px;
}

.chat-id {
  font-size: 24px;
  font-weight: 100;
}

.go {
  width: 200px;
  margin: 20px;
}

.logo {
  width: 80px;
  margin-bottom: 50px;
  margin-top: 50px;
}
</style>
