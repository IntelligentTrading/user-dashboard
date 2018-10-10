<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Payment Result</label>
        </el-row>
        <el-row style='text-align:center'>
            <i v-show="transaction.success" class="fas fa-crown paymentok"></i>
            <i v-show="!transaction.success" class="fas fa-frown paymentko"></i>
         </el-row>
         <el-row style='text-align:center'>
            <label>{{transaction.success?'Success!':'Unsuccessful'}}</label>
         </el-row>
         <el-row style='text-align:center;word-break: break-all;font-size: medium;'>
            <label>{{transaction.success?'':transaction.reason}}</label>
         </el-row>
         <el-row v-show="transaction.success" style='text-align:center'>
            <label>{{transaction.value/Math.pow(10,18)}} ETH</label>
         </el-row>
         <el-button type="primary" class='stepButton' :disabled=this.refreshing @click="goHome">{{reloadText}}</el-button>
    </div>
</template>
<script>
import db from "../../db";
import { mapGetters } from "vuex";

export default {
  name: "Done",
  props: ["payload"],
  data() {
    return {
      refreshing: false,
      reloadText: "Home"
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
      this.reloadText = 'Redirecting...'
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
