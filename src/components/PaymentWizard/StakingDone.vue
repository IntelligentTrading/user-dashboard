<template>
    <div>
        <el-row style='text-align:center'>
            <i v-show="stakingResult.verified" class="fas fa-check paymentok"></i>
            <i v-show="!stakingResult.verified" class="fas fa-frown paymentko"></i>
         </el-row>
         <el-row style='text-align:center;margin:10px'>
            <label style='font-weight:600'>{{stakingResult.verified?'Your staking address is verified!':'Something went wrong. Double check your address and be sure the signature is correct.'}}</label>
         </el-row>
         <!--<el-row v-show="transaction.success" style='text-align:center'>
            <label>{{transaction.value/Math.pow(10,18)}} ETH converted to superpowers!</label>
         </el-row>-->
         <el-row style="padding:20px">
         <el-button type="primary" :disabled=this.refreshing @click="goHome">{{reloadText}}</el-button>
         </el-row>
    </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";

export default {
  name: "StakingDone",
  props: ["stakingPayload"],
  data() {
    return {
      refreshing: false,
      reloadText: "Finish"
    };
  },
  computed: {
    stakingResult: function() {
      var stakingResult = JSON.parse(this.$props.stakingPayload);
      return stakingResult;
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
