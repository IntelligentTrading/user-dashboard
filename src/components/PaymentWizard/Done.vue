<template>
    <div>
        <el-row>
            <label style='font-size:12px;font-weight:600'>Payment Result</label>
        </el-row>
        <el-row style='text-align:center'>
            <i v-show="transaction.success" class="fas fa-crown paymentok"></i>
         </el-row>
         <el-row style='text-align:center'>
            <label>{{transaction.success?'Success!':'Payment unsuccessful'}}</label>
         </el-row>
         <el-row style='text-align:center'>
            <label>{{transaction.value/Math.pow(10,18)}} ETH</label>
         </el-row>
    </div>
</template>
<script>
import db from "../../db";
import { mapGetters } from "vuex";

export default {
  name: "Done",
  props: ["payload"],
  computed: {
    transaction: function() {
      var transaction = JSON.parse(this.$props.payload);
      return transaction;
    }
  },
  methods: {}
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
</style>
