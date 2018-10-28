<template>
    <div>
        <el-row style='text-align:center'>
            <i v-show="transaction.success" class="fas fa-check paymentok"></i>
            <i v-show="!transaction.success" class="fas fa-frown paymentko"></i>
         </el-row>
         <el-row style='text-align:center;margin:10px'>
            <label style='font-weight:600'>{{transaction.success?'Yay! Transaction successful!':'Something went wrong'}}</label>
         </el-row>
         <el-row style='text-align:center;word-break: break-all;font-size: medium;'>
            <label>{{transaction.success?'':transaction.reason}}</label>
         </el-row>
         <el-row v-show="transaction.success" style='text-align:center'>
            <label>{{transaction.value/Math.pow(10,18)}} ETH converted to superpowers!</label>
         </el-row>
         <el-row style="padding:20px">
         <el-button type="primary" :disabled=this.refreshing @click="goHome">{{reloadText}}</el-button>
         </el-row>
    </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";
import alienbaby from "../../assets/alienbaby.png";

export default {
  name: "Done",
  props: ["payload"],
  data() {
    return {
      alienbaby: alienbaby,
      refreshing: false,
      reloadText: "Go Home"
    };
  },
  computed: {
    transaction: function() {
      var transaction = JSON.parse(this.$props.payload);
      return transaction;
    }
  },
  methods: {
    goHome: function() {
      this.refreshing = true;
      this.reloadText = "Redirecting...";
      this.$router.go("Main");
    }
  }
};
</script>
<style>
.paymentok {
  font-size: 70px;
  color: lightseagreen;
  padding: 40px;
  margin: 20px;
  border: lightseagreen solid 2px;
  border-radius: 100%;
}
.paymentko {
  font-size: 70px;
  color: lightcoral;
  padding: 40px;
  margin: 20px;
}
</style>
